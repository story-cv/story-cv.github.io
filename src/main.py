import os
import json
import secrets
import logging
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, Request, Depends, HTTPException, Header
from fastapi.responses import HTMLResponse, Response, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from sqlalchemy import desc

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from src.database import engine, get_db, Base
from src.models import BlogPost, PostStatus
from src.schemas import OutrankWebhookPayload
from src.utils import markdown_to_html, generate_excerpt, calculate_read_time
from src.image_processor import process_article_images, storage_client

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StoryCV")

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app.mount("/blog/images",
          StaticFiles(directory=str(BASE_DIR / "blog" / "images")),
          name="blog_images")
app.mount("/static", StaticFiles(directory=str(BASE_DIR)), name="static")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request,
                                       exc: RequestValidationError):
    body = await request.body()
    logger.error(f"Validation error for {request.url.path}")
    logger.error(f"Request body: {body.decode('utf-8', errors='replace')}")
    logger.error(f"Validation errors: {exc.errors()}")
    return JSONResponse(status_code=422,
                        content={
                            "detail": exc.errors(),
                            "body": body.decode('utf-8',
                                                errors='replace')[:500]
                        })


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return HTMLResponse(content=(BASE_DIR / "index.html").read_text(),
                        status_code=200)


@app.get("/about-us", response_class=HTMLResponse)
async def about_us(request: Request):
    return templates.TemplateResponse(
        "about-us.html",
        {"request": request},
    )


@app.get("/student-resume", response_class=HTMLResponse)
async def student_resume(request: Request):
    return HTMLResponse(content=(BASE_DIR / "student-resume" /
                                 "index.html").read_text(),
                        status_code=200)


@app.get("/privacy-policy", response_class=HTMLResponse)
async def privacy_policy(request: Request):
    return HTMLResponse(content=(BASE_DIR / "privacy-policy" /
                                 "index.html").read_text(),
                        status_code=200)


@app.get("/terms-of-service", response_class=HTMLResponse)
async def terms_of_service(request: Request):
    return HTMLResponse(content=(BASE_DIR / "terms-of-service" /
                                 "index.html").read_text(),
                        status_code=200)


@app.get("/blog", response_class=HTMLResponse)
async def blog_listing(request: Request, db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published).order_by(
            desc(BlogPost.published_at)).all()

    featured_post = posts[0] if posts else None
    recent_posts = posts[1:] if len(posts) > 1 else []

    return templates.TemplateResponse(
        "blog/index.html", {
            "request": request,
            "featured_post": featured_post,
            "recent_posts": recent_posts,
            "all_posts": posts
        })


@app.get("/blog/articles/{slug}", response_class=HTMLResponse)
async def blog_article(request: Request,
                       slug: str,
                       db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(
        BlogPost.slug == slug,
        BlogPost.status == PostStatus.published).first()

    if not post:
        raise HTTPException(status_code=404, detail="Article not found")

    related_posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published, BlogPost.slug != slug,
        BlogPost.category == post.category).order_by(
            desc(BlogPost.published_at)).limit(3).all()

    if len(related_posts) < 3:
        additional = db.query(BlogPost).filter(
            BlogPost.status == PostStatus.published, BlogPost.slug != slug,
            BlogPost.slug.notin_([p.slug for p in related_posts])).order_by(
                desc(BlogPost.published_at)).limit(3 -
                                                   len(related_posts)).all()
        related_posts.extend(additional)

    return templates.TemplateResponse("blog/article.html", {
        "request": request,
        "post": post,
        "related_posts": related_posts
    })


@app.get("/blog/articles/{slug}/")
async def blog_article_trailing_slash_redirect(slug: str):
    return RedirectResponse(url=f"/blog/articles/{slug}", status_code=301)


@app.get("/api/storage/{path:path}")
async def serve_storage_image(path: str):
    try:
        file_data = storage_client.download_as_bytes(path)
        
        content_type = "application/octet-stream"
        if path.endswith(".webp"):
            content_type = "image/webp"
        elif path.endswith(".png"):
            content_type = "image/png"
        elif path.endswith(".jpg") or path.endswith(".jpeg"):
            content_type = "image/jpeg"
        elif path.endswith(".gif"):
            content_type = "image/gif"
        
        return Response(
            content=file_data,
            media_type=content_type,
            headers={"Cache-Control": "public, max-age=31536000"}
        )
    except Exception as e:
        logger.error(f"Failed to serve storage file {path}: {e}")
        raise HTTPException(status_code=404, detail="Image not found")


@app.get("/blog/feed.xml", response_class=Response)
async def blog_feed(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published).order_by(
            desc(BlogPost.published_at)).limit(20).all()

    rss_items = []
    for post in posts:
        pub_date = post.published_at.strftime(
            "%a, %d %b %Y %H:%M:%S +0000") if post.published_at else ""
        rss_items.append(f"""
        <item>
            <title><![CDATA[{post.title}]]></title>
            <link>https://story.cv/blog/articles/{post.slug}</link>
            <description><![CDATA[{post.excerpt or post.description or ''}]]></description>
            <pubDate>{pub_date}</pubDate>
            <guid>https://story.cv/blog/articles/{post.slug}</guid>
            <category>{post.category or 'General'}</category>
        </item>
        """)

    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>StoryCV Blog</title>
        <link>https://story.cv/blog</link>
        <description>Expert resume writing tips, career advice, and job search strategies from StoryCV.</description>
        <language>en-us</language>
        <atom:link href="https://story.cv/blog/feed.xml" rel="self" type="application/rss+xml"/>
        {''.join(rss_items)}
    </channel>
</rss>"""

    return Response(content=rss_content, media_type="application/xml")


@app.get("/sitemap.xml", response_class=Response)
async def sitemap(db: Session = Depends(get_db)):
    base_url = "https://story.cv"
    today = datetime.utcnow().strftime('%Y-%m-%d')
    
    static_pages = [
        {'path': '', 'changefreq': 'weekly', 'priority': '1.0'},
        {'path': 'about-us', 'changefreq': 'monthly', 'priority': '0.8'},
        {'path': 'student-resume', 'changefreq': 'monthly', 'priority': '0.9'},
        {'path': 'blog', 'changefreq': 'daily', 'priority': '0.8'},
        {'path': 'privacy-policy', 'changefreq': 'yearly', 'priority': '0.5'},
        {'path': 'terms-of-service', 'changefreq': 'yearly', 'priority': '0.5'},
    ]
    
    urls = []
    for page in static_pages:
        loc = f"{base_url}/{page['path']}" if page['path'] else base_url
        urls.append(f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>""")
    
    posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published
    ).all()
    
    for post in posts:
        lastmod = today
        if post.updated_at:
            lastmod = post.updated_at.strftime('%Y-%m-%d')
        elif post.published_at:
            lastmod = post.published_at.strftime('%Y-%m-%d')
        
        urls.append(f"""  <url>
    <loc>{base_url}/blog/articles/{post.slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""")
    
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    return Response(content=sitemap_xml, media_type="application/xml")


@app.post("/api/webhooks/outrank")
async def outrank_webhook(request: Request,
                          payload: OutrankWebhookPayload,
                          db: Session = Depends(get_db),
                          authorization: str = Header(None,
                                                      alias="Authorization")):
    access_token = os.environ.get("OUTRANK_ACCESS_TOKEN")

    if access_token:
        expected_header = f"Bearer {access_token}"
        if not authorization or not secrets.compare_digest(
                authorization, expected_header):
            raise HTTPException(status_code=401, detail="Invalid access token")

    logger.info(
        f"Received webhook: event_type={payload.event_type}, articles={len(payload.data.articles)}"
    )

    if payload.event_type != "publish_articles":
        logger.info(f"Ignoring event_type: {payload.event_type}")
        return {
            "event_type": payload.event_type,
            "processed": 0,
            "message": "Event type not handled"
        }

    results = []
    for article in payload.data.articles:
        logger.info(f"Processing article: {article.slug}")
        
        processed_featured_image, processed_markdown = process_article_images(
            slug=article.slug,
            featured_image=article.image_url,
            markdown_content=article.content_markdown
        )
        
        markdown_content = processed_markdown or article.content_markdown
        featured_image = processed_featured_image or article.image_url
        
        html_body = markdown_to_html(markdown_content)
        excerpt = generate_excerpt(markdown_content)
        read_time = calculate_read_time(markdown_content)

        existing_post = db.query(BlogPost).filter(
            BlogPost.slug == article.slug).first()

        image_alt = f"{article.title} - StoryCV Blog"

        if existing_post:
            existing_post.title = article.title
            existing_post.description = article.meta_description or existing_post.description
            existing_post.markdown_body = markdown_content
            existing_post.html_body = html_body
            existing_post.excerpt = excerpt
            existing_post.tags = article.tags or existing_post.tags or []
            existing_post.featured_image = featured_image or existing_post.featured_image
            existing_post.image_alt = image_alt
            existing_post.read_time_minutes = read_time
            existing_post.status = PostStatus.published
            existing_post.published_at = existing_post.published_at or article.created_at or datetime.utcnow(
            )
            existing_post.updated_at = datetime.utcnow()
            results.append({"status": "updated", "slug": article.slug})
            logger.info(f"Updated article: {article.slug}")
        else:
            new_post = BlogPost(slug=article.slug,
                                title=article.title,
                                description=article.meta_description,
                                markdown_body=markdown_content,
                                html_body=html_body,
                                excerpt=excerpt,
                                category="Resume Tips",
                                tags=article.tags or [],
                                author_byline="StoryCV Team",
                                featured_image=featured_image,
                                image_alt=image_alt,
                                read_time_minutes=read_time,
                                status=PostStatus.published,
                                published_at=article.created_at
                                or datetime.utcnow())
            db.add(new_post)
            results.append({"status": "created", "slug": article.slug})
            logger.info(f"Created article: {article.slug}")

    db.commit()
    return {
        "event_type": payload.event_type,
        "processed": len(results),
        "results": results
    }


@app.get("/{path:path}")
async def serve_static(path: str):
    file_path = BASE_DIR / path
    if file_path.is_file():
        content_type = "text/html"
        if path.endswith(".css"):
            content_type = "text/css"
        elif path.endswith(".js"):
            content_type = "application/javascript"
        elif path.endswith(".svg"):
            content_type = "image/svg+xml"
        elif path.endswith(".webp"):
            content_type = "image/webp"
        elif path.endswith(".png"):
            content_type = "image/png"
        elif path.endswith(".jpg") or path.endswith(".jpeg"):
            content_type = "image/jpeg"
        elif path.endswith(".xml"):
            content_type = "application/xml"
        return Response(content=file_path.read_bytes(),
                        media_type=content_type)

    index_path = BASE_DIR / path / "index.html"
    if index_path.is_file():
        return HTMLResponse(content=index_path.read_text(), status_code=200)

    raise HTTPException(status_code=404, detail="Not found")
