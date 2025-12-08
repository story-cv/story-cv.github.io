
# Blog Directory Structure

This directory contains all blog-related files for the StoryCV website.

## Directory Structure

```
/blog/
├── README.md                    # This documentation file
├── index.html                   # Blog listing page
├── feed.xml                     # RSS feed for blog posts
├── related-articles.js          # Related articles component
├── articles/                    # Individual blog post folders (clean URLs)
│   ├── ats-filter-90-10-rule/
│   │   └── index.html
│   ├── what-is-resume-writer/
│   │   └── index.html
│   ├── student-resume-template-with-real-examples/
│   │   └── index.html
│   └── [future-article-slug]/
│       └── index.html
├── images/                      # Images used in blog posts
│   ├── ATS filter versus recruiter.webp
│   ├── student-resume-template.webp
│   ├── what-is-resume-writer.webp
│   └── [future-images]
└── templates/                   # Reusable templates
    └── article-template.html    # Template for new blog articles
```

## Clean URL Structure

All blog articles use clean URLs (folder/index.html pattern):
- URL: `https://story.cv/blog/articles/article-slug/`
- File: `blog/articles/article-slug/index.html`

## Adding New Blog Posts

1. **Create the article folder**: Create a new folder in `articles/` with your slug name

2. **Create index.html**: Copy `templates/article-template.html` to `articles/your-slug/index.html`

3. **Replace template variables**:
   - `{{TITLE}}` - Article title
   - `{{DESCRIPTION}}` - Meta description
   - `{{KEYWORDS}}` - SEO keywords
   - `{{SLUG}}` - URL-friendly folder name
   - `{{CATEGORY}}` - Post category
   - `{{PUBLISH_DATE}}` - Full ISO date
   - `{{PUBLISH_DATE_SHORT}}` - YYYY-MM-DD format
   - `{{DISPLAY_DATE}}` - Human-readable date
   - `{{READ_TIME}}` - Estimated reading time
   - `{{FEATURED_IMAGE}}` - Image filename in /images/
   - `{{IMAGE_ALT}}` - Alt text for featured image
   - `{{CONTENT}}` - Article HTML content
   - `{{RELATED_POSTS}}` - Related articles HTML

4. **Add images**: Place article images in the `images/` directory

5. **Update blog index**: Add the new post to `blog/index.html`

6. **Update RSS feed**: Add the new post to `feed.xml`

7. **Update related articles**: Add to `related-articles.js`

8. **Update sitemap**: Add the new clean URL to `/sitemap.xml`

## Path References (from article folders)

- **To root stylesheets/scripts**: Use `../../../` (e.g., `../../../style.css`)
- **To blog images**: Use `../../images/` (e.g., `../../images/photo.webp`)
- **To related-articles.js**: Use `../../related-articles.js`

## Benefits of This Structure

- **Clean URLs**: Professional, SEO-friendly URLs without .html extension
- **Organized**: Clear separation of content types
- **Scalable**: Easy to add new posts and assets
- **Maintainable**: Consistent templates and paths
- **SEO-friendly**: Proper URL structure and metadata
- **Performance**: Optimized image organization
