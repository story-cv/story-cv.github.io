from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class OutrankWebhookPayload(BaseModel):
    slug: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=500)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    markdown_body: str = Field(..., min_length=1)
    excerpt: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    author_byline: Optional[str] = "StoryCV Team"
    featured_image: Optional[str] = None
    image_alt: Optional[str] = None
    read_time_minutes: Optional[int] = 5
    status: Optional[str] = "draft"
    published_at: Optional[datetime] = None


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
