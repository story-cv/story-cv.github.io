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

EXTERNAL_IMAGE_PATTERN = re.compile(
    r'https?://[^\s"\'<>]+\.(jpg|jpeg|png|gif)',
    re.IGNORECASE
)


def needs_processing(url: str) -> bool:
    """Returns True for any external image URL that isn't already WebP."""
    return bool(url) and url.startswith('http') and not url.lower().endswith('.webp')


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
    public_url = f"/api/storage/{object_name}"
    return public_url


def process_image_url(url: str, slug: str, on_failure=None) -> str:
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
        if on_failure is not None:
            try:
                on_failure(url, str(e))
            except Exception as cb_err:
                logger.error(f"on_failure callback raised an error for {url}: {cb_err}")
        return url


def process_image_url_tracked(url: str, slug: str) -> tuple:
    """Like process_image_url but returns (new_url, error_message_or_None).

    On success: (converted_url, None)
    On failure: (original_url, error_string)
    """
    try:
        logger.info(f"Processing image: {url}")
        image_data = download_image(url)
        webp_data = convert_to_webp(image_data)
        filename = get_filename_from_url(url)
        object_name = f"blog-images/{slug}/{filename}.webp"
        public_url = upload_to_storage(webp_data, object_name)
        logger.info(f"Uploaded to: {public_url}")
        return public_url, None
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Failed to process image {url}: {error_msg}")
        return url, error_msg


def process_featured_image(image_url: str, slug: str, on_failure=None) -> str:
    if not image_url:
        return image_url
    if needs_processing(image_url):
        return process_image_url(image_url, slug, on_failure=on_failure)
    return image_url


def process_content_images(content: str, slug: str, on_failure=None) -> str:
    seen_urls = set()

    for match in EXTERNAL_IMAGE_PATTERN.finditer(content):
        original_url = match.group(0)
        if original_url in seen_urls:
            continue
        seen_urls.add(original_url)

        new_url = process_image_url(original_url, slug, on_failure=on_failure)
        if new_url != original_url:
            content = content.replace(original_url, new_url)

    return content


def process_article_images(slug: str, featured_image: str = None, markdown_content: str = None, on_failure=None) -> tuple:
    processed_featured = process_featured_image(featured_image, slug, on_failure=on_failure) if featured_image else None
    processed_markdown = process_content_images(markdown_content, slug, on_failure=on_failure) if markdown_content else None
    return processed_featured, processed_markdown
