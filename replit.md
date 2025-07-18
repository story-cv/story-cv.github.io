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

## Recent Changes (July 15, 2025)

### Color System Update
- Updated primary orange color to #EE4E34 across the entire design system
- Updated hover states and dark mode variants to maintain consistency
- Applied new orange color to "your story" highlight in main headline

### Hero Section Refinements
- Changed primary CTA button text to "Join the waitlist"
- Updated primary CTA link to point to https://tally.so/r/wzBlA0
- Added white font color for subtitle in dark mode for better contrast
- Maintained responsive design and accessibility standards

### Below-the-Fold Section Implementation
- Added "Why Your Resume Will Finally Stand Out" section
- Implemented two-column grid layout with text content and visual placeholder
- Created responsive design that stacks on mobile devices
- Used clean, minimal styling consistent with overall design system
- Content emphasizes Story.CV as a resume writer (not builder) with personalized approach

### Advantages Section Implementation
- Added "Why we're better than a human resume writer" section
- Implemented responsive 2x2 grid layout (stacks to 1x4 on mobile)
- Created card-based design with hover effects and subtle shadows
- Four key advantages: industry knowledge, no awkward calls, affordability, and speed
- Used secondary background color to visually separate from other sections

### ChatGPT Timeline Section Implementation
- Added "Yes, you can use ChatGPT for your resume" section with 6-step timeline
- Implemented vertical timeline with sticky progress line and animated markers
- Created sticky header that appears/disappears during timeline scroll
- Added scroll-triggered animations for timeline steps using Intersection Observer
- Mobile-responsive design with proper spacing and marker positioning
- Emphasizes cognitive load and complexity of using ChatGPT for resume writing

### Process Flow Section Implementation
- Added "Let's make resume writing easy this time" section with 3-step process
- Implemented card-based design with numbered steps in corners
- Created responsive layout: vertical stack on mobile, horizontal on desktop
- Added hover effects with elevation and border color changes
- Included placeholder image areas for future visual content
- Used staggered scroll animations for card entrance
- Added Japandi-style dotted connection lines between cards on desktop (subtle dots)
- Emphasized StoryCV's simplicity compared to ChatGPT complexity

### Mini Hero Section Implementation
- Added emotional clarity section with soft #FCEDDA background color
- Centered layout with illustration placeholder and focused messaging
- Emphasized deeper value: helping users think better about their work
- Responsive design with generous vertical padding (80px desktop, 40px mobile)
- Added fade-in scroll animation using Intersection Observer
- Included "Join the waitlist" CTA consistent with primary orange branding
- Clean, minimal design focused on reflection and clarity

### Comparison Table Section Implementation (Redesigned)
- Added "Not just different. Actually better." H2 title above comparison
- Built shadcn-style comparison table with sticky header and single-row display
- Implemented one-row-at-a-time display with smooth transitions (LeapingAI-inspired)
- Created card-based layout with gradient highlights for StoryCV column
- Added auto-advance functionality (4-second intervals) with pause on hover
- Built comprehensive navigation: progress dots, keyboard arrows, mouse wheel, touch swipe
- Included mobile-responsive design hiding table header on mobile
- Used proper shadcn component styling with borders, shadows, and hover effects
- Implemented smooth cubic-bezier transitions and gradient backgrounds
- Added content for all 4 comparison areas: Content Help, Storytelling, Speed, Cost

### CTA Banner Section Implementation
- Added "Ready to Tell Your Story?" banner section with compelling messaging
- Created gradient background using primary orange to deeper red (#EE4E34 to #C63716)
- Implemented white-on-orange button styling with hover elevation effects
- Added radial gradient overlay for visual depth and polish
- Built responsive design with proper font scaling across device sizes
- Included smooth scroll-triggered fade-in animation
- Emphasized conversion messaging about better opportunities from better resumes

### Pricing Section Implementation
- Added comprehensive pricing section with "Professional resume writing, reimagined." headline
- Built mobile-friendly comparison table with Free Preview vs Full Resume ($79) columns
- Implemented feature comparison for 6 key areas: interview, progress, preview, revisions, download, support
- Added interactive tooltips for "daily cap" and "unlimited" explanations
- Created value propositions highlighting no time pressure, no subscription, no credit card required
- Built prominent 50% OFF pre-launch promotion section with orange gradient styling
- Included clear call-to-action messaging and waitlist signup button
- Designed responsive layout with proper mobile scaling and touch-friendly tooltips

### About Us Section Implementation
- Added "The humans behind StoryCV" section with comprehensive company story
- Built philosophy subsection emphasizing quality over quantity approach
- Created "Our take" section explaining positioning against ATS-focused tools
- Added "Why StoryCV" highlighted box explaining the product's unique foundation-first approach
- Implemented founders section with photo placeholders and personal introduction
- Used secondary background color to visually separate from pricing section
- Added scroll-triggered staggered animations for each subsection
- Included external links to Resumey.Pro with proper target and rel attributes
- Designed mobile-responsive layout with proper photo placeholder scaling

### FAQ Section Implementation
- Added comprehensive FAQ section with 11 key questions covering product positioning and features
- Built interactive accordion functionality with smooth expand/collapse animations
- Implemented one-at-a-time accordion behavior for better user focus
- Created hover states and visual feedback with primary orange color accents
- Added detailed answers covering differentiation from ChatGPT and generic AI builders
- Included target audience clarification with specific use cases and scenarios
- Built privacy and security FAQ addressing data handling concerns
- Used scroll-triggered staggered animations for engaging section entrance
- Designed mobile-responsive layout with proper touch interaction support
- Applied consistent styling with secondary background and proper spacing

### Footer Section Implementation
- Added professional footer with logo, tagline, and brand positioning
- Implemented social media links for Twitter, LinkedIn, and Instagram with proper icons
- Created consistent CTA button matching other landing page CTAs linking to waitlist
- Added legal links section with Terms of Service and Privacy Policy placeholders
- Built responsive design with proper mobile stacking and layout adjustments
- Used secondary background color with subtle border separation
- Included dark/light mode logo switching for brand consistency
- Applied hover effects and subtle animations for enhanced user experience

### About Us Page Implementation (July 18, 2025)
- Created standalone About Us page (`about-us.html`) with clean URL structure
- Added mission statement banner with orange gradient consistent with brand
- Implemented team section content from existing landing page
- Built responsive design inspired by narrative.bi with card-based layout
- Added navigation header with Home/About links and CTA button
- Integrated mission statement: "Make expert resume writing accessible to everyone. Not just faster. Actually better."
- Included founders section with photo placeholders and Resumey.Pro connection
- Added footer navigation link to About Us page from main landing page
- Built comprehensive mobile responsive design for all screen sizes

### About Us Page Redesign (July 18, 2025)
- Moved "Meet the Founders" section directly below page title
- Redesigned mission banner as two-column layout with orange H2 title on left
- Simplified mission statement to single line: "Make expert resume writing accessible to everyone"
- Moved mission banner below founders section for better content flow
- Center-aligned founders description text for improved visual balance
- Moved "Why StoryCV" box outside "Our Take" section as standalone element
- Fixed logo display issues in header and footer with proper dark/light mode switching
- Applied consistent brand colors with primary orange (#EE4E34) for mission title

### Launch Preparation Updates (July 18, 2025)
- Updated all primary CTA buttons to open in new tabs (target="_blank" rel="noopener noreferrer")
- Modified hero section "you" text to be italicized for emphasis: "We don't ask *you* to figure out what sounds good"
- Redesigned "Better than human resume writer" section with new title: "Everything a traditional resume writer offers. And everything they don't."
- Converted advantages section from paragraphs to bullet point lists for better readability
- Added icon placeholders to advantage cards for future visual enhancement
- Updated ChatGPT timeline title to italicize "can": "Yes, you *can* use ChatGPT for your resume"
- Removed arrows (→) from all ChatGPT timeline step descriptions for cleaner presentation
- Applied Onest font family to FAQ section for consistent typography throughout site
- Pricing table updated with white background for free column and light gray for content cells
- Converted 3 value propositions to bullet points with orange styling
- Changed Pre-Launch Exclusive box to cream background (#FCEDDA)
- Removed em dash from mini hero text and split into two sentences
- Moved "Ready to Tell Your Story?" CTA section after pricing/promo section
- Updated CTA banner with cream background (#FCEDDA) and dark mode support (#2A2520)
- Changed CTA button to orange gradient styling with white text for better contrast
- All waitlist CTAs properly link to https://tally.so/r/wzBlA0 and open in new tabs

### Previous Changes (July 13, 2025)
- Added above-the-fold hero section with H1 headline and subtitle
- Implemented call-to-action buttons with primary/secondary styling
- Created responsive design that works across all device sizes
- Applied clean, modern typography using Onest font system
- Added comprehensive SEO optimization with meta tags and structured data

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