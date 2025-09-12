
#!/usr/bin/env python3
import os
import xml.etree.ElementTree as ET
from datetime import datetime
import re

def get_last_modified(file_path):
    """Get the last modified date of a file"""
    try:
        timestamp = os.path.getmtime(file_path)
        return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def extract_title_from_html(file_path):
    """Extract title from HTML file for better organization"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            return title_match.group(1) if title_match else None
    except:
        return None

def generate_sitemap():
    """Generate sitemap.xml automatically"""
    
    # Base URL
    base_url = "https://story.cv"
    
    # Create root element
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Static pages configuration
    static_pages = [
        {
            'path': '',  # Homepage
            'changefreq': 'weekly',
            'priority': '1.0'
        },
        {
            'path': 'about-us.html',
            'changefreq': 'monthly', 
            'priority': '0.8'
        },
        {
            'path': 'student-resume.html',
            'changefreq': 'monthly',
            'priority': '0.9'
        },
        {
            'path': 'blog.html',
            'changefreq': 'weekly',
            'priority': '0.8'
        },
        {
            'path': 'privacy-policy.html',
            'changefreq': 'yearly',
            'priority': '0.5'
        },
        {
            'path': 'terms-of-service.html',
            'changefreq': 'yearly',
            'priority': '0.5'
        }
    ]
    
    # Add static pages
    for page in static_pages:
        url_elem = ET.SubElement(urlset, 'url')
        
        # Location
        loc = ET.SubElement(url_elem, 'loc')
        if page['path']:
            loc.text = f"{base_url}/{page['path']}"
        else:
            loc.text = base_url
            
        # Last modified
        lastmod = ET.SubElement(url_elem, 'lastmod')
        if page['path'] and os.path.exists(page['path']):
            lastmod.text = get_last_modified(page['path'])
        else:
            lastmod.text = get_last_modified('index.html') if os.path.exists('index.html') else datetime.now().strftime('%Y-%m-%d')
            
        # Change frequency
        changefreq = ET.SubElement(url_elem, 'changefreq')
        changefreq.text = page['changefreq']
        
        # Priority
        priority = ET.SubElement(url_elem, 'priority')
        priority.text = page['priority']
    
    # Auto-discover blog articles
    blog_articles_dir = 'blog/articles'
    if os.path.exists(blog_articles_dir):
        for filename in os.listdir(blog_articles_dir):
            if filename.endswith('.html'):
                file_path = os.path.join(blog_articles_dir, filename)
                
                url_elem = ET.SubElement(urlset, 'url')
                
                # Location
                loc = ET.SubElement(url_elem, 'loc')
                loc.text = f"{base_url}/{file_path}"
                
                # Last modified
                lastmod = ET.SubElement(url_elem, 'lastmod')
                lastmod.text = get_last_modified(file_path)
                
                # Change frequency
                changefreq = ET.SubElement(url_elem, 'changefreq')
                changefreq.text = 'monthly'
                
                # Priority
                priority = ET.SubElement(url_elem, 'priority')
                priority.text = '0.7'
    
    # Auto-discover any other HTML files in root (excluding specific ones)
    excluded_files = {
        'index.html', 'about-us.html', 'student-resume.html', 
        'blog.html', 'privacy-policy.html', 'terms-of-service.html'
    }
    
    for filename in os.listdir('.'):
        if filename.endswith('.html') and filename not in excluded_files:
            url_elem = ET.SubElement(urlset, 'url')
            
            # Location
            loc = ET.SubElement(url_elem, 'loc')
            loc.text = f"{base_url}/{filename}"
            
            # Last modified
            lastmod = ET.SubElement(url_elem, 'lastmod')
            lastmod.text = get_last_modified(filename)
            
            # Change frequency
            changefreq = ET.SubElement(url_elem, 'changefreq')
            changefreq.text = 'monthly'
            
            # Priority
            priority = ET.SubElement(url_elem, 'priority')
            priority.text = '0.6'
    
    # Create the tree and write to file
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ", level=0)
    
    with open('sitemap.xml', 'wb') as f:
        f.write(b'<?xml version="1.0" encoding="UTF-8"?>\n')
        tree.write(f, encoding='utf-8')
    
    print("✅ Sitemap generated successfully!")
    print(f"📊 Total URLs: {len(urlset)}")
    
    # Show what was included
    print("\n📋 Pages included:")
    for url in urlset:
        loc = url.find('loc').text
        lastmod = url.find('lastmod').text
        print(f"  • {loc} (last modified: {lastmod})")

if __name__ == "__main__":
    generate_sitemap()
