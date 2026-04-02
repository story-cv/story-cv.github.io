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
    html = md.convert(md_content)
    html = re.sub(r'<a href=', '<a target="_blank" rel="noopener noreferrer" href=', html)
    html = re.sub(r'<table>', '<div class="table-wrapper"><table>', html)
    html = re.sub(r'</table>', '</table></div>', html)
    return html


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


def extract_faq_items(markdown_body: str) -> Optional[list]:
    """
    Extract FAQ Q&A pairs from markdown. Looks for a FAQ section heading
    and parses bold-question + inline-answer paragraphs, or ### subheading format.
    Returns a list of {question, answer} dicts, or None if no FAQ section found.
    """
    faq_match = re.search(
        r'^##\s+(frequently asked questions|faq|faqs|common questions|q&a|questions & answers)\s*$',
        markdown_body,
        re.MULTILINE | re.IGNORECASE
    )
    if not faq_match:
        return None

    faq_start = faq_match.end()
    next_section = re.search(r'^(##\s+|---)', markdown_body[faq_start:], re.MULTILINE)
    faq_text = (
        markdown_body[faq_start: faq_start + next_section.start()]
        if next_section
        else markdown_body[faq_start:]
    )

    items = []

    paragraphs = re.split(r'\n\n+', faq_text.strip())
    for para in paragraphs:
        m = re.match(r'^\*\*(.+?\?)\*\*\s+(.+)', para.strip(), re.DOTALL)
        if m:
            question = m.group(1).strip()
            answer = m.group(2).strip()
            answer = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', answer)
            answer = re.sub(r'\*{1,2}([^*]+)\*{1,2}', r'\1', answer)
            answer = re.sub(r'\n+', ' ', answer).strip()
            items.append({"question": question, "answer": answer})

    if items:
        return items

    for m in re.finditer(
        r'^###\s+(.+?\?)\s*\n+(.*?)(?=\n###|\n##|---|\Z)',
        faq_text,
        re.MULTILINE | re.DOTALL
    ):
        question = m.group(1).strip()
        answer = m.group(2).strip()
        answer = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', answer)
        answer = re.sub(r'\*{1,2}([^*]+)\*{1,2}', r'\1', answer)
        answer = re.sub(r'\n+', ' ', answer).strip()
        items.append({"question": question, "answer": answer})

    return items if items else None
