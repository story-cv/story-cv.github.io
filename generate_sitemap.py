#!/usr/bin/env python3
import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.database import SessionLocal
from src.models import BlogPost, PostStatus

def generate_sitemap():
    base_url = "https://story.cv"
    
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    static_pages = [
        {'path': '', 'changefreq': 'weekly', 'priority': '1.0'},
        {'path': 'about-us', 'changefreq': 'monthly', 'priority': '0.8'},
        {'path': 'student-resume', 'changefreq': 'monthly', 'priority': '0.9'},
        {'path': 'blog', 'changefreq': 'daily', 'priority': '0.8'},
        {'path': 'privacy-policy', 'changefreq': 'yearly', 'priority': '0.5'},
        {'path': 'terms-of-service', 'changefreq': 'yearly', 'priority': '0.5'},
    ]
    
    for page in static_pages:
        url_elem = ET.SubElement(urlset, 'url')
        
        loc = ET.SubElement(url_elem, 'loc')
        if page['path']:
            loc.text = f"{base_url}/{page['path']}"
        else:
            loc.text = base_url
            
        lastmod = ET.SubElement(url_elem, 'lastmod')
        lastmod.text = today
            
        changefreq = ET.SubElement(url_elem, 'changefreq')
        changefreq.text = page['changefreq']
        
        priority = ET.SubElement(url_elem, 'priority')
        priority.text = page['priority']
    
    db = SessionLocal()
    try:
        posts = db.query(BlogPost).filter(
            BlogPost.status == PostStatus.published
        ).all()
        
        for post in posts:
            url_elem = ET.SubElement(urlset, 'url')
            
            loc = ET.SubElement(url_elem, 'loc')
            loc.text = f"{base_url}/blog/articles/{post.slug}"
            
            lastmod = ET.SubElement(url_elem, 'lastmod')
            if post.updated_at:
                lastmod.text = post.updated_at.strftime('%Y-%m-%d')
            elif post.published_at:
                lastmod.text = post.published_at.strftime('%Y-%m-%d')
            else:
                lastmod.text = today
            
            changefreq = ET.SubElement(url_elem, 'changefreq')
            changefreq.text = 'monthly'
            
            priority = ET.SubElement(url_elem, 'priority')
            priority.text = '0.7'
    finally:
        db.close()
    
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ", level=0)
    
    with open('sitemap.xml', 'wb') as f:
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
        tree.write(f, encoding='utf-8')
    
    print("Sitemap generated successfully!")
    print(f"Total URLs: {len(urlset)}")
    
    print("\nPages included:")
    for url in urlset:
        loc = url.find('loc').text
        print(f"  - {loc}")

if __name__ == "__main__":
    generate_sitemap()
