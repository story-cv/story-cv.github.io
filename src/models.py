import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
import enum

from src.database import Base


class PostStatus(enum.Enum):
    draft = "draft"
    published = "published"


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    subtitle = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    markdown_body = Column(Text, nullable=False)
    html_body = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    tags = Column(JSONB, default=list)
    author_byline = Column(String(255), default="StoryCV Team")
    featured_image = Column(String(500), nullable=True)
    image_alt = Column(String(500), nullable=True)
    read_time_minutes = Column(Integer, default=5)
    status = Column(SQLEnum(PostStatus), default=PostStatus.draft, index=True)
    published_at = Column(DateTime, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<BlogPost {self.slug}>"
