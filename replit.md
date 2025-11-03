# StoryCV - Professional Resume Writer Powered by AI

## Overview
StoryCV is an AI-powered professional resume writing application designed to help users create compelling resumes. It aims to make expert resume writing accessible to everyone, providing a solution that is both efficient and high-quality, differentiating itself from generic AI builders or traditional human writers. The project focuses on a modern, responsive web application with a clean user interface.

## Recent Changes
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
- **Key Sections**: Includes a hero section, "Why Your Resume Will Finally Stand Out," "Why we're better than a human resume writer" (advantages), a 6-step ChatGPT timeline, a 3-step process flow, a mini hero section for emotional clarity, a tabbed comparison section (Traditional vs. StoryCV, Generic AI vs. StoryCV), pricing, about us, and FAQ sections.
- **Interactive Elements**: Two-column FAQ layout with sticky left panel and accordion questions, scroll-triggered animations, and interactive tooltips.

### Backend Architecture
- **Current State**: No backend implemented.
- **Planned**: Future integration with AI services for resume generation and potential use of Drizzle ORM for data persistence.

### Technical Implementations
- **SEO Optimization**: Comprehensive meta tags, structured data (Website, ProfessionalService, FAQPage schema markup), and social media meta tags.
- **Accessibility**: Focus on clean typography, readable font sizes, mobile-friendly interactions, and full ARIA support for accordion elements (aria-expanded, aria-controls).

## External Dependencies

- **Google Fonts**: Onest font family.
- **SVG Assets**: Logos and icons.