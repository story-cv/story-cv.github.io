#!/usr/bin/env python3
"""
Migration script to update blog post image URLs from full GCS paths to API storage paths.

Converts URLs like:
  https://storage.googleapis.com/{bucket_id}/blog-images/{slug}/{filename}.webp
To:
  /api/storage/blog-images/{slug}/{filename}.webp

Also handles any Outrank CDN URLs that might have been missed during processing.

Usage:
  python scripts/migrate_image_urls.py --dry-run  # Preview changes
  python scripts/migrate_image_urls.py            # Apply changes
"""

import os
import re
import sys
import argparse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import SessionLocal
from src.models import BlogPost

GCS_URL_PATTERN = re.compile(
    r'https://storage\.googleapis\.com/[^/]+/(blog-images/[^\s"\'<>]+)',
    re.IGNORECASE
)

OUTRANK_CDN_PATTERN = re.compile(
    r'https://cdn\.outrank\.so/[^\s"\'<>]+\.(jpg|jpeg|png|gif|webp)',
    re.IGNORECASE
)


def convert_gcs_url(match):
    storage_path = match.group(1)
    return f"/api/storage/{storage_path}"


def migrate_content(content: str) -> tuple[str, int]:
    if not content:
        return content, 0
    
    changes = 0
    original = content
    
    content = GCS_URL_PATTERN.sub(convert_gcs_url, content)
    
    changes = len(GCS_URL_PATTERN.findall(original))
    
    return content, changes


def migrate_featured_image(image_url: str) -> tuple[str, bool]:
    if not image_url:
        return image_url, False
    
    match = GCS_URL_PATTERN.match(image_url)
    if match:
        storage_path = match.group(1)
        return f"/api/storage/{storage_path}", True
    
    return image_url, False


def run_migration(dry_run: bool = True):
    db = SessionLocal()
    
    try:
        posts = db.query(BlogPost).all()
        
        total_posts = len(posts)
        updated_posts = 0
        total_changes = 0
        
        print(f"\n{'='*60}")
        print(f"Image URL Migration {'(DRY RUN)' if dry_run else '(LIVE)'}")
        print(f"{'='*60}")
        print(f"Total posts to check: {total_posts}\n")
        
        for post in posts:
            changes_in_post = 0
            
            new_featured, featured_changed = migrate_featured_image(post.featured_image)
            if featured_changed:
                print(f"[{post.slug}] Featured image:")
                print(f"  OLD: {post.featured_image}")
                print(f"  NEW: {new_featured}")
                changes_in_post += 1
                if not dry_run:
                    post.featured_image = new_featured
            
            new_markdown, markdown_changes = migrate_content(post.markdown_body)
            if markdown_changes > 0:
                print(f"[{post.slug}] Markdown body: {markdown_changes} URL(s) updated")
                changes_in_post += markdown_changes
                if not dry_run:
                    post.markdown_body = new_markdown
            
            new_html, html_changes = migrate_content(post.html_body)
            if html_changes > 0:
                print(f"[{post.slug}] HTML body: {html_changes} URL(s) updated")
                changes_in_post += html_changes
                if not dry_run:
                    post.html_body = new_html
            
            if changes_in_post > 0:
                updated_posts += 1
                total_changes += changes_in_post
        
        print(f"\n{'='*60}")
        print(f"Summary:")
        print(f"  Posts updated: {updated_posts}/{total_posts}")
        print(f"  Total URL changes: {total_changes}")
        print(f"{'='*60}")
        
        if not dry_run and total_changes > 0:
            db.commit()
            print("\nChanges committed to database.")
        elif dry_run and total_changes > 0:
            print("\nNo changes made (dry run mode).")
            print("Run without --dry-run to apply changes.")
        else:
            print("\nNo URLs found that need migration.")
    
    except Exception as e:
        db.rollback()
        print(f"\nError during migration: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Migrate blog post image URLs to API storage paths"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without applying them"
    )
    
    args = parser.parse_args()
    run_migration(dry_run=args.dry_run)
