import os
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, Request, Depends, HTTPException, Header
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import desc

from src.database import engine, get_db, Base
from src.models import BlogPost, PostStatus
from src.schemas import OutrankWebhookPayload
from src.utils import markdown_to_html, generate_excerpt, verify_webhook_signature, calculate_read_time

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StoryCV")

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app.mount("/blog/images", StaticFiles(directory=str(BASE_DIR / "blog" / "images")), name="blog_images")
app.mount("/static", StaticFiles(directory=str(BASE_DIR)), name="static")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return HTMLResponse(content=(BASE_DIR / "index.html").read_text(), status_code=200)


@app.get("/about-us", response_class=HTMLResponse)
async def about_us(request: Request):
    return templates.TemplateResponse(
        "about-us.html",
        {
            "request": request
        },
    )


@app.get("/student-resume", response_class=HTMLResponse)
async def student_resume(request: Request):
    return HTMLResponse(content=(BASE_DIR / "student-resume" / "index.html").read_text(), status_code=200)


@app.get("/privacy-policy", response_class=HTMLResponse)
async def privacy_policy(request: Request):
    return HTMLResponse(content=(BASE_DIR / "privacy-policy" / "index.html").read_text(), status_code=200)


@app.get("/terms-of-service", response_class=HTMLResponse)
async def terms_of_service(request: Request):
    return HTMLResponse(content=(BASE_DIR / "terms-of-service" / "index.html").read_text(), status_code=200)


@app.get("/blog", response_class=HTMLResponse)
async def blog_listing(request: Request, db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published
    ).order_by(desc(BlogPost.published_at)).all()
    
    featured_post = posts[0] if posts else None
    recent_posts = posts[1:] if len(posts) > 1 else []
    
    return templates.TemplateResponse(
        "blog/index.html",
        {
            "request": request,
            "featured_post": featured_post,
            "recent_posts": recent_posts,
            "all_posts": posts
        }
    )


@app.get("/blog/articles/{slug}", response_class=HTMLResponse)
async def blog_article(request: Request, slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(
        BlogPost.slug == slug,
        BlogPost.status == PostStatus.published
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Article not found")
    
    related_posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published,
        BlogPost.slug != slug,
        BlogPost.category == post.category
    ).order_by(desc(BlogPost.published_at)).limit(3).all()
    
    if len(related_posts) < 3:
        additional = db.query(BlogPost).filter(
            BlogPost.status == PostStatus.published,
            BlogPost.slug != slug,
            BlogPost.slug.notin_([p.slug for p in related_posts])
        ).order_by(desc(BlogPost.published_at)).limit(3 - len(related_posts)).all()
        related_posts.extend(additional)
    
    return templates.TemplateResponse(
        "blog/article.html",
        {
            "request": request,
            "post": post,
            "related_posts": related_posts
        }
    )


@app.get("/blog/feed.xml", response_class=Response)
async def blog_feed(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(
        BlogPost.status == PostStatus.published
    ).order_by(desc(BlogPost.published_at)).limit(20).all()
    
    rss_items = []
    for post in posts:
        pub_date = post.published_at.strftime("%a, %d %b %Y %H:%M:%S +0000") if post.published_at else ""
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


@app.post("/api/webhooks/outrank")
async def outrank_webhook(
    request: Request,
    payload: OutrankWebhookPayload,
    db: Session = Depends(get_db),
    x_outrank_signature: str = Header(None, alias="X-Outrank-Signature")
):
    webhook_secret = os.environ.get("OUTRANK_WEBHOOK_SECRET")
    
    if webhook_secret:
        body = await request.body()
        if not verify_webhook_signature(body, x_outrank_signature, webhook_secret):
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    html_body = markdown_to_html(payload.markdown_body)
    excerpt = payload.excerpt or generate_excerpt(payload.markdown_body)
    read_time = payload.read_time_minutes or calculate_read_time(payload.markdown_body)
    
    existing_post = db.query(BlogPost).filter(BlogPost.slug == payload.slug).first()
    
    if existing_post:
        existing_post.title = payload.title
        existing_post.subtitle = payload.subtitle
        existing_post.description = payload.description
        existing_post.markdown_body = payload.markdown_body
        existing_post.html_body = html_body
        existing_post.excerpt = excerpt
        existing_post.category = payload.category
        existing_post.tags = payload.tags or []
        existing_post.author_byline = payload.author_byline or "StoryCV Team"
        existing_post.featured_image = payload.featured_image
        existing_post.image_alt = payload.image_alt
        existing_post.read_time_minutes = read_time
        existing_post.status = PostStatus[payload.status] if payload.status else PostStatus.draft
        existing_post.published_at = payload.published_at
        existing_post.updated_at = datetime.utcnow()
        db.commit()
        return {"status": "updated", "slug": payload.slug}
    else:
        new_post = BlogPost(
            slug=payload.slug,
            title=payload.title,
            subtitle=payload.subtitle,
            description=payload.description,
            markdown_body=payload.markdown_body,
            html_body=html_body,
            excerpt=excerpt,
            category=payload.category,
            tags=payload.tags or [],
            author_byline=payload.author_byline or "StoryCV Team",
            featured_image=payload.featured_image,
            image_alt=payload.image_alt,
            read_time_minutes=read_time,
            status=PostStatus[payload.status] if payload.status else PostStatus.draft,
            published_at=payload.published_at
        )
        db.add(new_post)
        db.commit()
        return {"status": "created", "slug": payload.slug}


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
        return Response(content=file_path.read_bytes(), media_type=content_type)
    
    index_path = BASE_DIR / path / "index.html"
    if index_path.is_file():
        return HTMLResponse(content=index_path.read_text(), status_code=200)
    
    raise HTTPException(status_code=404, detail="Not found")
