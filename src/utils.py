import markdown
import hashlib
import hmac
import re
from typing import Optional


def markdown_to_html(md_content: str) -> str:
    md = markdown.Markdown(
        extensions=[
            'tables',
            'fenced_code',
            'codehilite',
            'toc',
            'nl2br',
            'sane_lists'
        ],
        extension_configs={
            'codehilite': {
                'css_class': 'highlight',
                'guess_lang': False
            }
        }
    )
    return md.convert(md_content)


def generate_excerpt(markdown_body: str, max_length: int = 200) -> str:
    text = re.sub(r'[#*`\[\]()>-]', '', markdown_body)
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    if len(text) > max_length:
        text = text[:max_length].rsplit(' ', 1)[0] + '...'
    return text


def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    if not signature or not secret:
        return False
    expected = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


def calculate_read_time(text: str, words_per_minute: int = 200) -> int:
    word_count = len(text.split())
    minutes = max(1, round(word_count / words_per_minute))
    return minutes
