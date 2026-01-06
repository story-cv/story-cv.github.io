from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class OutrankArticle(BaseModel):
    id: str
    title: str
    content_markdown: str
    content_html: str
    meta_description: Optional[str] = None
    created_at: Optional[datetime] = None
    image_url: Optional[str] = None
    slug: str
    tags: Optional[List[str]] = []


class OutrankWebhookData(BaseModel):
    articles: List[OutrankArticle]


class OutrankWebhookPayload(BaseModel):
    event_type: str
    timestamp: datetime
    data: OutrankWebhookData


class BlogPostResponse(BaseModel):
    id: UUID
    slug: str
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    html_body: str
    excerpt: Optional[str]
    category: Optional[str]
    tags: List[str]
    author_byline: str
    featured_image: Optional[str]
    image_alt: Optional[str]
    read_time_minutes: int
    status: str
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BlogPostListItem(BaseModel):
    slug: str
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    excerpt: Optional[str]
    category: Optional[str]
    featured_image: Optional[str]
    image_alt: Optional[str]
    read_time_minutes: int
    published_at: Optional[datetime]

    class Config:
        from_attributes = True
