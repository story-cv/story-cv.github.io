# Story.CV - Professional Resume Writer Powered by AI

## Overview

Story.CV is an AI-powered professional resume writing application that helps users create compelling resumes. The project is currently in its initial setup phase with a basic HTML structure, CSS design system, and placeholder JavaScript file. The application is designed to be a modern, responsive web application with a clean user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript
- **Design System**: Custom CSS with CSS custom properties for theming
- **Responsive Design**: Mobile-first approach using viewport meta tag
- **Typography**: Onest font family from Google Fonts as primary typeface
- **Theme Support**: Built-in light/dark mode support for logos and potentially the entire interface

### Backend Architecture
- **Current State**: No backend implementation yet
- **Planned**: Likely to incorporate AI services for resume generation
- **Database**: May use Drizzle ORM for data persistence (database type to be determined)

## Key Components

### Design System
- **Color Palette**: Comprehensive color system with primary (blue), secondary (slate), and accent (amber) colors
- **Typography Scale**: Onest font with three weights (regular, medium, bold)
- **Spacing System**: Consistent spacing scale from 4px to 24px
- **Shadow System**: Four-tier shadow system for depth and hierarchy
- **Theme Support**: CSS custom properties allow for easy theme switching

### Current Structure
- **Header**: Logo with adaptive light/dark mode support
- **Main Content**: Placeholder area for future application features
- **Footer**: Placeholder for future content
- **Styling**: Comprehensive CSS design system ready for component development

## Data Flow

### Current State
- Above-the-fold hero section with compelling messaging
- Responsive design optimized for mobile and desktop
- SEO-optimized with meta tags, structured data, and semantic HTML
- JavaScript file exists but contains no functionality yet

### Planned Architecture
- User interactions will likely trigger AI-powered resume generation
- Form data collection for user information
- Integration with AI services for content generation
- Potential user authentication and resume storage

## Recent Changes (July 13, 2025)

### Hero Section Implementation
- Added above-the-fold hero section with H1 headline and subtitle
- Implemented call-to-action buttons with primary/secondary styling
- Created responsive design that works across all device sizes
- Applied clean, modern typography using Onest font system

### SEO Optimization
- Added comprehensive meta descriptions and keywords
- Implemented Open Graph and Twitter Card meta tags
- Added structured data (JSON-LD) for search engine understanding
- Included canonical URL for proper indexing
- Used semantic HTML with proper heading hierarchy

## External Dependencies

### Current Dependencies
- **Google Fonts**: Onest font family for typography
- **SVG Assets**: Logo files with light/dark mode variants

### Planned Dependencies
- AI service integration (specific provider TBD)
- Potential authentication services
- Database hosting (if Drizzle ORM is implemented)

## Deployment Strategy

### Current Setup
- Static website ready for deployment to any web server
- No build process required for current implementation
- Assets are self-contained except for Google Fonts

### Future Considerations
- Will likely need server hosting for backend functionality
- May require build process for bundling and optimization
- Environment variable management for API keys and configuration
- CDN setup for static assets and performance optimization

### Development Workflow
- Simple file-based development for frontend
- Hot reload capability can be easily added
- No complex build tools required in current state
- Future: May incorporate bundling tools like Vite or Webpack

The application is well-positioned for rapid development with its solid design foundation and clear architectural direction toward AI-powered resume generation functionality.