import os
import asyncio
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
from starlette.middleware.gzip import GZipMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc, text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from src.database import engine, get_db, Base, SessionLocal
from src.models import BlogPost, PostStatus
from src.schemas import OutrankWebhookPayload
from src.utils import markdown_to_html, generate_excerpt, calculate_read_time, extract_faq_items
from src.image_processor import process_article_images, storage_client

Base.metadata.create_all(bind=engine)

# Safe column migration — idempotent, runs on every startup
with engine.connect() as _conn:
    _conn.execute(text("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS faq_items JSONB"))
    _conn.execute(text("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_conversion_failures JSONB"))
    _conn.commit()

app = FastAPI(title="StoryCV")
app.add_middleware(GZipMiddleware, minimum_size=1000)

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app.mount("/blog/images",
          StaticFiles(directory=str(BASE_DIR / "blog" / "images")),
          name="blog_images")
app.mount("/static", StaticFiles(directory=str(BASE_DIR)), name="static")


@app.on_event("startup")
async def fix_manually_published_articles():
    """Fix metadata for manually-published articles that were created before
    the webhook schema supported subtitle/author_byline/image_alt fields."""
    db = SessionLocal()
    try:
        fixes = [
            {
                "slug": "maternity-leave-on-resume",
                "subtitle": "How to write maternity break (without underselling yourself)",
                "author_byline": "Kavya Jahagirdar",
                "image_alt": "How to write maternity leave on a resume",
                "category": "Career advice",
            },
            {
                "slug": "why-hard-to-describe-your-accomplishments",
                "author_byline": "Kavya Jahagirdar",
                "category": "Career advice",
            },
        ]
        updated = 0
        for fix in fixes:
            slug = fix.pop("slug")
            post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
            if not post:
                continue
            changed = False
            for field, value in fix.items():
                if getattr(post, field, None) != value:
                    setattr(post, field, value)
                    changed = True
            if changed:
                updated += 1
        if updated:
            db.commit()
            logger.info(f"Manual article fix: updated {updated} post(s)")
    except Exception as e:
        logger.error(f"Manual article fix failed: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("startup")
async def backfill_faq_items():
    """Populate faq_items for any existing posts that have a FAQ section."""
    db = SessionLocal()
    try:
        posts = db.query(BlogPost).filter(BlogPost.faq_items == None).all()
        updated = 0
        for post in posts:
            faq = extract_faq_items(post.markdown_body)
            if faq:
                post.faq_items = faq
                updated += 1
        if updated > 0:
            db.commit()
            logger.info(f"FAQ backfill: populated faq_items for {updated} post(s)")
    except Exception as e:
        logger.error(f"FAQ backfill failed: {e}")
        db.rollback()
    finally:
        db.close()


@app.on_event("startup")
async def schedule_image_backfill():
    """Launch WebP conversion for articles that still have external JPG/PNG images."""
    asyncio.create_task(_run_image_backfill())


async def _run_image_backfill():
    from src.image_processor import needs_processing, process_image_url_tracked, process_content_images, EXTERNAL_IMAGE_PATTERN
    loop = asyncio.get_event_loop()
    db = SessionLocal()
    try:
        posts = db.query(BlogPost).filter(BlogPost.status == PostStatus.published).all()
        updated = 0
        for post in posts:
            needs_update = False
            failures = dict(post.image_conversion_failures or {})

            fi = post.featured_image or ''
            if needs_processing(fi):
                new_fi, err = await loop.run_in_executor(None, process_image_url_tracked, fi, post.slug)
                if err:
                    failures[fi] = {"type": "featured_image", "error": err, "attempted_at": datetime.utcnow().isoformat()}
                elif new_fi != fi:
                    post.featured_image = new_fi
                    failures.pop(fi, None)
                    needs_update = True

            md = post.markdown_body or ''
            if EXTERNAL_IMAGE_PATTERN.search(md):
                new_md = md
                for match in EXTERNAL_IMAGE_PATTERN.finditer(md):
                    original_url = match.group(0)
                    if original_url in failures and original_url in new_md:
                        continue
                    new_url, err = await loop.run_in_executor(None, process_image_url_tracked, original_url, post.slug)
                    if err:
                        failures[original_url] = {"type": "content_image", "error": err, "attempted_at": datetime.utcnow().isoformat()}
                    elif new_url != original_url:
                        new_md = new_md.replace(original_url, new_url)
                        failures.pop(original_url, None)
                if new_md != md:
                    post.markdown_body = new_md
                    post.html_body = markdown_to_html(new_md)
                    needs_update = True

            post.image_conversion_failures = failures if failures else None
            db.commit()

            if needs_update:
                updated += 1
                logger.info(f"Image backfill: converted '{post.slug}'")

            await asyncio.sleep(0)

        logger.info(f"Image backfill complete: {updated} article(s) updated")
    except Exception as e:
        logger.error(f"Image backfill error: {e}")
        db.rollback()
    finally:
        db.close()


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


@app.get("/blog/")
async def blog_trailing_slash_redirect():
    return RedirectResponse(url="/blog", status_code=301)


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
        faq_items = extract_faq_items(markdown_content)

        existing_post = db.query(BlogPost).filter(
            BlogPost.slug == article.slug).first()

        image_alt = article.image_alt or f"{article.title} - StoryCV Blog"

        if existing_post:
            existing_post.title = article.title
            if article.subtitle is not None:
                existing_post.subtitle = article.subtitle
            if article.author_byline is not None:
                existing_post.author_byline = article.author_byline
            existing_post.description = article.meta_description or existing_post.description
            existing_post.markdown_body = markdown_content
            existing_post.html_body = html_body
            existing_post.excerpt = excerpt
            existing_post.tags = article.tags or existing_post.tags or []
            existing_post.featured_image = featured_image or existing_post.featured_image
            existing_post.image_alt = image_alt
            existing_post.faq_items = faq_items
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
                                subtitle=article.subtitle,
                                description=article.meta_description,
                                markdown_body=markdown_content,
                                html_body=html_body,
                                excerpt=excerpt,
                                category="Resume Tips",
                                tags=article.tags or [],
                                author_byline=article.author_byline or "StoryCV Team",
                                featured_image=featured_image,
                                image_alt=image_alt,
                                faq_items=faq_items,
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


@app.get("/admin/image-status")
async def image_status(
    db: Session = Depends(get_db),
    authorization: str = Header(None, alias="Authorization"),
):
    from src.image_processor import needs_processing, EXTERNAL_IMAGE_PATTERN

    access_token = os.environ.get("OUTRANK_ACCESS_TOKEN")
    if not access_token:
        raise HTTPException(status_code=503, detail="Admin access not configured")
    expected_header = f"Bearer {access_token}"
    if not authorization or not secrets.compare_digest(authorization, expected_header):
        raise HTTPException(status_code=401, detail="Invalid access token")

    posts = db.query(BlogPost).filter(BlogPost.status == PostStatus.published).all()

    total = len(posts)
    webp_featured_count = 0
    external_featured_count = 0
    external_content_count = 0
    articles_with_external_images = []
    articles_with_failures = []
    total_failed_images = 0

    for post in posts:
        fi = post.featured_image or ""
        md = post.markdown_body or ""
        failures = post.image_conversion_failures or {}

        fi_needs_conversion = needs_processing(fi)
        md_has_external = bool(EXTERNAL_IMAGE_PATTERN.search(md))

        if fi_needs_conversion:
            external_featured_count += 1
        elif fi:
            webp_featured_count += 1

        if md_has_external:
            external_content_count += 1

        if fi_needs_conversion or md_has_external:
            articles_with_external_images.append({
                "slug": post.slug,
                "title": post.title,
                "featured_image_needs_conversion": fi_needs_conversion,
                "content_has_external_images": md_has_external,
                "featured_image_url": fi if fi_needs_conversion else None,
            })

        if failures:
            total_failed_images += len(failures)
            articles_with_failures.append({
                "slug": post.slug,
                "title": post.title,
                "failed_image_count": len(failures),
                "failures": [
                    {
                        "url": url,
                        "type": info.get("type"),
                        "error": info.get("error"),
                        "attempted_at": info.get("attempted_at"),
                    }
                    for url, info in failures.items()
                ],
            })

    return JSONResponse({
        "total_articles": total,
        "webp_featured_images": webp_featured_count,
        "external_featured_images": external_featured_count,
        "articles_with_external_content_images": external_content_count,
        "articles_with_external_images": articles_with_external_images,
        "total_failed_images": total_failed_images,
        "articles_with_failures": articles_with_failures,
    })


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
