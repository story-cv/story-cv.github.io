# StoryCV - Professional Resume Writer Powered by AI

## Overview
StoryCV is an AI-powered professional resume writing application designed to help users create compelling resumes. It aims to make expert resume writing accessible to everyone, providing a solution that is both efficient and high-quality, differentiating itself from generic AI builders or traditional human writers. The project focuses on a modern, responsive web application with a clean user interface.

## Recent Changes
- **November 27, 2025**: Implemented floating card design system across all major sections (except hero). Each section now features visually distinct, self-contained cards with rounded corners (1.5rem), subtle borders, soft shadows, and generous padding. Section backgrounds reset to white with cards retaining original background colors (cream #FCEDDA, gray #f8fafc, or white) to create floating appearance inspired by typeless.com
- **November 27, 2025**: Added scroll-triggered reveal animations using Intersection Observer API with fade-in effects (0.7s transitions, 32px translateY) across all major sections
- **November 25, 2025**: Reinstated Kavya's founder information - added circular photo signature in homepage "Resume writing became a game of keywords" section, and full founders section on About Us page with bio and links to Resumey.Pro and StoryCV
- **November 25, 2025**: Implemented clean URL structure (moved about-us.html, privacy-policy.html, etc. to folder/index.html format), updated all navigation links to use absolute paths without .html extensions
- **November 24, 2025**: Added trust badges section below hero featuring Product Hunt, Twelve Tools, OpenHunts, and Tiny Launches badges with modular CSS Grid layout (auto-fit), grayscale-to-color hover effects, and staggered fade-in animations
- **November 4, 2025**: Redesigned Pricing section with storytelling 2-tier card layout ("The First Chapter" free tier and "The Full Story" $29/month with Founding User Price badge), using brand color #ee4e34 for premium tier accents and hover effects
- **November 3, 2025**: Redesigned FAQ section with modern two-column layout (left: title/CTA panel, right: accordion), using brand color #ee4e34 for accents and left border highlights, with full ARIA accessibility support
- **October 22, 2025**: Updated all CTA buttons across the website from "Join the waitlist" to "Write my resume" with new link to https://write.story.cv
- **October 17, 2025**: Integrated Twelve Tools badge in footer with mobile-responsive styling

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript.
- **Design System**: Custom CSS with CSS custom properties for theming, a comprehensive color system (primary #ee4e34 orange-red, secondary slate, accent amber), a consistent spacing system (4px-24px), and a four-tier shadow system.
- **Typography**: Onest font family from Google Fonts.
- **Responsive Design**: Mobile-first approach using viewport meta tag.
- **Theming**: Light mode only.
- **Key Sections**: Includes a hero section, trust badges section (Product Hunt, Twelve Tools, OpenHunts, Tiny Launches), "Why Your Resume Will Finally Stand Out," "Why we're better than a human resume writer" (advantages), a 6-step ChatGPT timeline, a 3-step process flow, a mini hero section for emotional clarity, a tabbed comparison section (Traditional vs. StoryCV, Generic AI vs. StoryCV), two-tier pricing with narrative "chapter" theme, about us, and FAQ sections.
- **Interactive Elements**: Modular trust badges grid with grayscale hover effects and scroll-triggered staggered animations, two-column FAQ layout with sticky left panel and accordion questions, two-card pricing layout with hover effects and featured badge, scroll-triggered animations.
- **Floating Card Design**: All major sections (except hero) wrapped in floating card containers with 1.5rem border-radius, subtle gray border (#e5e7eb), soft shadow (shadow-xl equivalent), generous internal padding, and section backgrounds reset to white for contrast. Cards use `.floating-card`, `.floating-card-cream`, `.floating-card-gray`, `.floating-card-white` classes.

### Backend Architecture
- **Current State**: No backend implemented.
- **Planned**: Future integration with AI services for resume generation and potential use of Drizzle ORM for data persistence.

### Technical Implementations
- **SEO Optimization**: Comprehensive meta tags, structured data (Website, ProfessionalService, FAQPage schema markup), and social media meta tags.
- **Accessibility**: Focus on clean typography, readable font sizes, mobile-friendly interactions, and full ARIA support for accordion elements (aria-expanded, aria-controls).

## External Dependencies

- **Google Fonts**: Onest font family.
- **SVG Assets**: Logos and icons.