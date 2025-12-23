#!/usr/bin/env python3
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import SessionLocal, engine, Base
from src.models import BlogPost, PostStatus
from src.utils import markdown_to_html

Base.metadata.create_all(bind=engine)

articles = [
    {
        "slug": "ats-filter-90-10-rule",
        "title": "Passing the ATS is the easiest (and the most pointless) part",
        "description": "Stop wasting time on ATS keywords. Understand why your resume fails the human test & how a foundation-first career narrative is the only strategy that gets you hired.",
        "category": "Resume Tips",
        "author_byline": "Kavya",
        "featured_image": "ATS filter versus recruiter.webp",
        "image_alt": "ATS filter versus human recruiter comparison",
        "read_time_minutes": 4,
        "published_at": datetime(2025, 1, 23),
        "markdown_body": """## Passing the ATS is the easiest (and the most pointless) part

If you're looking for a job, you know the cycle. Sometimes it feels like you've been stuck in the application vortex. You send 50, 100, sometimes 200 applications. You're glued to your screen for hours, swapping keywords and agonizing over that silly little machine called the ATS (Applicant Tracking System). You have a "perfect" score. The bot loves you.

And yet, the interviews are not happening. Nothing.

Why are you still stuck?

The job search industry taught you the wrong thing. They convinced you the last **10%** of the problem was the entire journey. What about the actual **90%** of the work that matters?

### ATS is not the problem you think it is.

The worst resume advice is also the simplest: "Just pass the ATS."

The entire industry is basically obsessed with a bot that does one thing: **Keyword sorting.** That's its only job.

What does a high ATS score prove? It means the machine found the necessary words and decided your file is fine to be handed off. That's it. It does not mean you are qualified. It does not mean you are interesting. It means you spelled the words correctly.

What does a high ATS score actually mean? It means the machine found the keywords and decided your file can be passed to the next stage. That's it. It doesn't mean you're qualified, interesting or compelling.

### Format vs. Foundation: you've been focusing on the wrong F-word

You are currently wasting time on the easiest, most superficial part of this job:

- You prioritize templates and fonts (format) instead of the actual story (foundation).
- You spend hours swapping keywords and optimizing weak content.

This is why you lose the job even after passing the ATS. Your content is disjointed, keyword-stuffed, and reads like a generic job description. It passes the bot, but the human recruiter rejects it instantly. The ATS didn't fail you. Your weak content did.

### If your resume fails these, the ATS score means nothing.

Let's talk about the real decision-maker: the Recruiter.

The human review process is fast. It's often a 6-second glance. Recruiters aren't counting keywords. They're looking for value, patterns and strategic fit.

They are asking three human questions:

1. **What valuable thing did this person *actually* do? (Impact)**
2. **Does their career story *make sense*? (Coherence)**
3. **Are they worth 15 minutes of my time? (Interest)**

If your content is only optimized for the bot, it fails these three human tests every time.

## The resume strategy that changes the entire game.

The only way to consistently clear that six-second human hurdle is to build a **foundation-first resume**. This is the entire 90% of the strategy we talked about.

### The Coherent Career Narrative

Your career is not a series of random jobs. It's a **trajectory.**

- **Narrative over Listing:** Stop using the passive, pointless phrases like "responsible for." Write active stories of change and impact.
- **Bridging the Gaps:** A true foundation-first approach turns career pivots and gaps into strengths. Don't try to hide your past. Strategically link it to the role you want next.

### Beyond "Responsible For"

Every bullet point must answer the question: **"So what?"**

Stop writing generic job duties. You need to articulate the **quantifiable impact** (revenue, time saved, efficiency). If you can't quantify, then use the space to showcase a clear, specific soft skill or challenge you overcame. Every bullet point needs a point.

### Why Resume Builders Can't Do This

Generic resume builders and tools can't build this foundation because they are limited by the poor material you feed them. They can handle the **editing**, but they cannot do the **strategy**. They can't extract the context.

This is the real problem, and it's very simple: **You need a writer to solve a writing problem.**

### Extracting your true value

That's why we built StoryCV. It's an **AI Writer that works like a human Strategist.**

- **The Power of the Guided Interview:** Instead of asking you what to paste, we ask the same probing questions a top human resume writer would. We ask about the biggest risks you took, the unintended positive outcomes of your projects, and the strategic challenges you overcame. We pull out the context your own brain struggles to isolate.
- **The Writer AI Philosophy:** StoryCV isn't trained on keyword density or ATS loopholes. It's trained on strategic narrative flow and high-impact language. It builds the Foundation because it understands the structure of success, not just the rules of the machine.

You've been playing the ATS game because it was the easiest game. It was advertised everywhere.

**Stop sending 100 bad applications. Send 5 great ones.**

The best opportunities don't come from more applications; they come from better ones. And that starts with a career story built on a rock-solid foundation.

---

### Ready to Build Your Foundation-First Resume?

Stop wasting time on ATS optimization. Let StoryCV help you craft a strategic, narrative-driven resume that passes both the bot and the human test.

[Write my resume](https://write.story.cv)
"""
    },
    {
        "slug": "what-is-resume-writer",
        "title": "The #1 Question to Ask Before Hiring a Resume Writer",
        "description": "A professional resume writer is more than a typist. Learn the difference between free AI tools, an average 'pro' service and a strategy-driven approach to land your next job.",
        "category": "Career Advice",
        "author_byline": "Kavya",
        "featured_image": "what-is-resume-writer.webp",
        "image_alt": "What is a resume writer - professional resume writing services explained",
        "read_time_minutes": 8,
        "published_at": datetime(2025, 9, 5),
        "markdown_body": """The modern job market is a competitive place. Your resume isn't just a document. It's a tool.

And it has two jobs: get past the automated screeners (the Applicant Tracking System, or ATS) and convince a human to give you a call.

Job seekers usually try one of two quick fixes:

- using a free AI to do the work for you, or
- paying for an online resume writer service.

But what if both paths lead to the same dead end?

The real question isn't whether to go the free or paid route. It's about recognizing that the core problem is a lack of strategy.

**A generic resume, whether free or expensive, is a waste of time.**

## Why a "Free" Resume from ChatGPT is Actually the Most Expensive One

Using a free AI feels like a smart move. You open a new tab and type a simple prompt into ChatGPT: "Write me a resume."

The result is fast and free. The words are strong. You get bullet points and keywords. It seems like you can build online resume content in minutes.

But here's the problem: a generic AI is a word machine, not a career strategist.

It doesn't know your story, your specific career goals or the nuanced value you bring to a team. It gives you content that is bland, unengaging and looks just like every other resume out there. A recruiter can spot it a mile away.

This approach saves you a few hours of work, but it costs you every interview you don't get.

![A person using AI to write their resume](/blog/images/ai-chatbot.webp)
*Your resume doesn't have a keyword problem. It has a story problem.*

## The Standard Resume Writer Service: The Limitations of a "Done-for-You" Model

When the free option doesn't work, you turn to a professional. You start searching for resume writers for hire and find an online resume writer service that promises expert results. You read some resume writer reviews and decide to pay a significant sum, perhaps several hundred dollars. You figure it's an investment in yourself.

But what if the "pro" service is just a glorified version of the free AI?

One job seeker's cautionary tale on [Reddit](https://www.reddit.com/r/jobs/comments/8jtsng/my_experience_with_topresume/) reveals this all-too-common problem. They paid for a premium service targeting senior roles. The result was a bland, unengaging resume that lost all their unique accomplishments. When they submitted the new resume for the service's "free" evaluation, the automated critique came back identical to the first one, word for word.

This experience makes you wonder: are resume writers worth it?

The answer is yes, but only if they're the right kind. Many services operate as a "done-for-you" black box, taking your money and delivering a canned output that lacks true strategic value.

## The Right Solution: The Power of a Strategic Narrative

So, what is a resume writer? A true resume writer isn't a typist who just rearranges your career history. They are a career strategist. Their value isn't in their ability to write words, but in their ability to help you find your story.

A great resume is a strategic document that answers one question for a recruiter: "Why should I hire this person?" It has a clear narrative that shows progression, highlights accomplishments and demonstrates your unique value.

This is the kind of thinking you need when you're seriously considering resume writer hiring.

The best online resume writer services don't write for you. They guide you. They provide the strategic framework that empowers you to tell your unique story.

This is the exact philosophy that guides the work we're doing at StoryCV. We believe a great resume is a collaboration between you and a smart, transparent process.

![A person choosing the strategic narrative approach](/blog/images/strategic-resume-writer.webp)
*Choose the path of a strategist, not a typist.*

---

### Ready to Transform Your Resume?

You now understand the difference between typists and strategists. StoryCV helps you craft a resume that tells your unique story and gets results.

[Write my resume](https://write.story.cv)

## Conclusion: Choose Your Story Wisely

How much does a resume writer cost? The cost is irrelevant if the service doesn't get you results. Whether you use a free AI or a paid but generic service, you're making the same mistake. You're treating your resume like a list of tasks instead of a strategic, narrative-driven document.

Your professional narrative is the most valuable asset you have. Invest in a process that guides you to create a resume that doesn't just list your experience, but sells your value and gets you the job you want.
"""
    },
    {
        "slug": "student-resume-template-with-real-examples",
        "title": "The only student resume template you'll ever need",
        "description": "Real student resume examples you can copy. Perfect for internships, part-time jobs, and your first full-time position.",
        "category": "Resume Tips",
        "author_byline": "StoryCV Team",
        "featured_image": "student-resume-template.webp",
        "image_alt": "Student resume template with real examples",
        "read_time_minutes": 10,
        "published_at": datetime(2025, 8, 25),
        "markdown_body": """Looking at student resume templates feels overwhelming at first. Too many formats. Too many rules. And if you don't have much experience yet, it feels even harder to fill a page without sounding fake.

But a student resume doesn't need to be complicated. It needs to be clear. Your contact details, your education, a few lines about what you've done so far like projects, part-time jobs and even volunteering. That's enough to get started.

## What is the best format for a student resume?

One page. One column. Clear headings. Bullet points. Reverse chronological order. Most recent things at the top. Margins between 0.5 and 1 inch. Font size 10.5-12, readable, no script fonts. Sans serif fonts for resume is recommended.

That's it.

### Why this format works

- **It matches how recruiters scan.** Left to right, top to bottom.
- **It is ATS friendly.** No text in images or tables.
- **It makes tradeoffs obvious.** You highlight proof in the first 1/3 of the page.

## How to write a good resume as a student?

Focus on relevance. Show what you did, not what your responsibilities were. Use numbers when you can. Keep bullets short. Each bullet should answer: "Why should they care?"

**Strong Student Achievement Examples:**
- Built a web app for a class project used by 30+ classmates to track deadlines.
- Managed weekly events for a campus club, growing attendance from 40 to 120 students.

## What are the sections of a resume

- **Contact info:** name, email, LinkedIn, portfolio/GitHub.
- **Education:** degree, university, graduation date, GPA if strong, relevant coursework.
- **Experience:** internships, part-time jobs, projects.
- **Skills:** tools, languages, software.
- **Optional:** extracurriculars, volunteer work, awards.

### Default layout

1. Contact and links
2. Headline or target role
3. Education
4. Skills
5. Projects and coursework
6. Experience (internships, part-time, freelance)
7. Leadership and activities
8. Awards and extras

Save as PDF unless the employer asks for Word.

Put your strongest section higher. If projects are your proof, move them above experience.

If you are struggling to stick to one page, remember: a resume is a decision tool, not a biography. Show proof of skills the job needs. Hide everything else.

## Skills for a student resume

The skills section is where students often get stuck. You think you don't have enough to show. Wrong. You have more than you realize.

Break skills into clear categories. Technical skills go first if they're relevant to the job. Language skills matter if you're applying to global companies. Soft skills only count if you can prove them with examples elsewhere on your resume.

**Strong Skills Section Examples:**
- **Programming:** Python, Java, JavaScript, HTML/CSS
- **Tools:** Git, VS Code, Figma, Excel, Google Analytics
- **Languages:** English (native), Spanish (conversational), Mandarin (basic)

Don't list skills you can't discuss in an interview. If you put "Excel" and can't explain pivot tables, that's a problem. If you list "Python" but only wrote one script for class, be ready to explain what you built.

Here's what counts as a skill for students: any software you've used for class projects, programming languages from coursework, design tools from personal projects, languages you speak at home, and technical skills from internships or part-time jobs.

**Avoid These Common Mistakes:**
- Generic soft skills like "communication" without proof
- Skills you learned years ago and can't remember
- Obvious skills like "Microsoft Word" unless specifically required

## Margins, fonts, and layout specs

- **Margins.** 0.75 to 1 inch on all sides. If you need space, go 0.5 inch, never less.
- **Font size.** 10.5 to 12 for body, 12 to 14 for headings.
- **Fonts.** Any clean system font. No script fonts. Avoid icons.
- **Line spacing.** 1.0 to 1.15. Add 2 to 4 pt space after each section.
- **File name.** firstname_lastname_resume_role.pdf

## Can you put extracurricular activities on a resume?

Yes. Treat them as leadership and impact.

**Good examples:**
- **President, FinTech Society** - grew membership from 60 to 140, secured 3 sponsor partners.
- **Captain, Volleyball Team** - coordinated 12-player schedule and led training that improved set success by 18 percent.
- **Organizer, Women in Tech Hackathon** - raised $8,000 in funding, managed 120 participants.

**Avoid:** Listing passive memberships without outcomes.

Your resume's job is to earn a shortlisting. The hiring manager's job is to reduce risk. Use numbers and outcomes to lower that risk.

## Can you put babysitting on a resume?

Yes. Frame it as paid work with scope and outcomes.

**Examples:**
- **Babysitter, self-employed** - managed care for two children ages 4 and 7, improved homework completion from 50 percent to 100 percent over 3 months.
- **Tutor and caregiver** - created a 6-week reading plan, raised reading level by one grade.

## What makes a good student template

Use these criteria to judge any template.

- **Simple structure.** One column. No tables.
- **Scannable headings.** Education, Skills, Projects, Experience.
- **Keyword-friendly.** Text, not images.
- **Tight spacing.** Enough white space to breathe, but not wasteful.
- **Proof-first.** Bullets show outcomes, not tasks.

---

### Ready to Transform Your Student Resume?

You now know which sections to include and how to structure a student resume. Filling it in and making it look sharp is where most students get stuck. That's where StoryCV can help. It takes your experience, projects, and skills, and turns them into a resume ready to send to recruiters in minutes.

[Write my resume](https://write.story.cv)

## Student resume examples for internships

Niche down. Aim each version at one role. Software engineering intern, data analyst intern, product design intern, research assistant, operations associate.

### Software engineering intern
- Built a full-stack CRUD app used by 35 peers. Cut manual tracking time by 3 hours per week.
- Wrote unit tests that raised coverage from 0 to 72 percent across key modules.
- Refactored API calls to reduce average response time from 420 ms to 180 ms.

### Data analyst intern
- Cleaned 120,000-row survey dataset. Reduced processing time by 60 percent.
- Automated weekly KPI dashboard in spreadsheets. Saved team 2 hours weekly.
- A/B tested landing copy. Improved click-through by 14 percent.

### Marketing intern
- Planned 4-week TikTok content calendar. Grew followers from 0 to 1,800.
- Ran UTM-tagged email campaign to 3,200 students. 32 percent open, 6 percent click.
- Negotiated 3 campus partnerships that added 220 signups.

Student resumes don't need to be perfect. They need to show you can learn, contribute, and take responsibility. That's enough to get in the door.

Templates are a start, but you don't have to do this alone. StoryCV uses AI to turn your student resume template into a polished, recruiter-ready resume in minutes.
"""
    }
]


def seed_articles():
    db = SessionLocal()
    try:
        for article in articles:
            existing = db.query(BlogPost).filter(BlogPost.slug == article["slug"]).first()
            if existing:
                print(f"Article '{article['slug']}' already exists, updating...")
                for key, value in article.items():
                    if key != "markdown_body":
                        setattr(existing, key, value)
                existing.markdown_body = article["markdown_body"]
                existing.html_body = markdown_to_html(article["markdown_body"])
                existing.status = PostStatus.published
            else:
                print(f"Creating article '{article['slug']}'...")
                new_post = BlogPost(
                    slug=article["slug"],
                    title=article["title"],
                    description=article["description"],
                    excerpt=article["description"],
                    category=article["category"],
                    author_byline=article["author_byline"],
                    featured_image=article["featured_image"],
                    image_alt=article["image_alt"],
                    read_time_minutes=article["read_time_minutes"],
                    published_at=article["published_at"],
                    markdown_body=article["markdown_body"],
                    html_body=markdown_to_html(article["markdown_body"]),
                    status=PostStatus.published,
                    tags=[]
                )
                db.add(new_post)
        
        db.commit()
        print("Articles seeded successfully!")
        
        count = db.query(BlogPost).count()
        print(f"Total articles in database: {count}")
        
    except Exception as e:
        print(f"Error seeding articles: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_articles()
