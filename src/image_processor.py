import os
import re
import logging
from io import BytesIO
from urllib.parse import urlparse
import requests
from PIL import Image
from replit.object_storage import Client

logger = logging.getLogger(__name__)

storage_client = Client()

OUTRANK_IMAGE_PATTERN = re.compile(
    r'https://cdn\.outrank\.so/[^\s"\'<>]+\.(jpg|jpeg|png|gif)',
    re.IGNORECASE
)


def download_image(url: str) -> bytes:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.content


def convert_to_webp(image_data: bytes, quality: int = 80) -> bytes:
    img = Image.open(BytesIO(image_data))
    if img.mode in ('RGBA', 'LA', 'P'):
        img = img.convert('RGB')
    output = BytesIO()
    img.save(output, format='WEBP', quality=quality)
    return output.getvalue()


def get_filename_from_url(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path
    filename = os.path.basename(path)
    name = os.path.splitext(filename)[0]
    name = re.sub(r'[^a-zA-Z0-9_-]', '-', name)
    return name


def upload_to_storage(image_data: bytes, object_name: str) -> str:
    storage_client.upload_from_bytes(object_name, image_data)
    bucket_id = os.environ.get('DEFAULT_OBJECT_STORAGE_BUCKET_ID', '')
    public_url = f"https://storage.googleapis.com/{bucket_id}/{object_name}"
    return public_url


def process_image_url(url: str, slug: str) -> str:
    try:
        logger.info(f"Processing image: {url}")
        image_data = download_image(url)
        webp_data = convert_to_webp(image_data)
        filename = get_filename_from_url(url)
        object_name = f"blog-images/{slug}/{filename}.webp"
        public_url = upload_to_storage(webp_data, object_name)
        logger.info(f"Uploaded to: {public_url}")
        return public_url
    except Exception as e:
        logger.error(f"Failed to process image {url}: {e}")
        return url


def process_featured_image(image_url: str, slug: str) -> str:
    if not image_url:
        return image_url
    if 'cdn.outrank.so' in image_url:
        return process_image_url(image_url, slug)
    return image_url


def process_content_images(content: str, slug: str) -> str:
    seen_urls = set()
    
    for match in OUTRANK_IMAGE_PATTERN.finditer(content):
        original_url = match.group(0)
        if original_url in seen_urls:
            continue
        seen_urls.add(original_url)
        
        new_url = process_image_url(original_url, slug)
        if new_url != original_url:
            content = content.replace(original_url, new_url)
    
    return content


def process_article_images(slug: str, featured_image: str = None, markdown_content: str = None) -> tuple:
    processed_featured = process_featured_image(featured_image, slug) if featured_image else None
    processed_markdown = process_content_images(markdown_content, slug) if markdown_content else None
    return processed_featured, processed_markdown
