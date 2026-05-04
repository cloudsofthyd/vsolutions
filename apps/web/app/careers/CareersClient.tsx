"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Job = {
  id: string;
  title: string;
  iconClass: "j1" | "j2" | "j3" | "j4" | "j5" | "j6";
  iconChar: string;
  categories: string[];
  keywords: string;
  tags: { dept: string; location: string; remote: string; experience: string; type: string };
  posted: string;
  applyJobName: string;
  applyEmailSubject: string;
  about: React.ReactNode;
  sections: Array<{ heading: string; intro?: React.ReactNode; items?: React.ReactNode[] }>;
  apply: {
    blurb: string;
    info: Array<{ icon: string; text: string }>;
  };
};

const JOBS: Job[] = [
  {
    id: "bdm",
    title: "Business Development Manager (BDM) — Web, App & Digital Marketing",
    iconClass: "j1",
    iconChar: "↗",
    categories: ["sales", "remote"],
    keywords: "business development manager bdm sales b2b client acquisition",
    tags: {
      dept: "Sales",
      location: "📍 Troy, MI",
      remote: "⌂ Remote available",
      experience: "Mid-Senior",
      type: "Full-Time",
    },
    posted: "Posted Apr 18, 2026",
    applyJobName: "Business Development Manager",
    applyEmailSubject: "Business Development Manager Application",
    about: (
      <>
        <p>
          V Solutions Inc is a leading <strong>AI &amp; Data Solutions Company</strong>{" "}
          specializing in AI, NLP, and digital marketing. We're expanding our team and
          seeking a dynamic Business Development Manager (BDM) to spearhead client
          acquisition in web development, app development, and digital marketing.
        </p>
        <p>
          As BDM, you'll play a pivotal role in expanding our client base for web
          development services, app development projects, and digital marketing
          campaigns. You'll identify new business opportunities, build strong client
          relationships, and close deals to fuel our growth in these high-demand areas.
        </p>
      </>
    ),
    sections: [
      {
        heading: "Key Focus Areas",
        items: [
          "Generating leads for custom web development (AI-powered websites that convert visitors into customers)",
          "Securing clients for app development (mobile and web applications tailored to business needs)",
          "Driving partnerships for digital marketing services (SEO, paid ads, social media, content writing)",
        ],
      },
      {
        heading: "Key Responsibilities",
        items: [
          <><strong>Lead Generation:</strong> Research and identify potential clients using LinkedIn, industry databases, and networking events to build a robust pipeline</>,
          <><strong>Client Acquisition:</strong> Develop and execute sales strategies — cold outreach, presentations, and tailored proposals</>,
          <><strong>Relationship Building:</strong> Foster long-term client relationships, positioning V Solutions as their go-to partner for digital growth</>,
          <><strong>Sales Closing:</strong> Negotiate contracts, handle objections, and close deals to meet quarterly targets</>,
          <><strong>Market Analysis:</strong> Stay updated on trends in web dev (AI integration), app dev, and digital marketing</>,
          <><strong>Collaboration:</strong> Work closely with developers, marketers, and AI specialists for seamless project delivery</>,
          <><strong>Reporting:</strong> Track sales metrics and contribute to strategic planning</>,
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "3+ years in business development or sales, preferably in web/app development or digital marketing agencies",
          "Bachelor's degree in Business, Marketing, IT, or related field (MBA preferred)",
          "Proven ability to generate leads and close deals in tech/digital sectors",
          "Strong knowledge of CRM (Salesforce), sales automation, SEO, and digital tools",
          "Excellent communication, negotiation, and presentation skills",
          "Self-motivated, goal-oriented, thrives in fast-paced remote/international environments",
        ],
      },
    ],
    apply: {
      blurb: "Send your resume and cover letter outlining your relevant experience.",
      info: [
        { icon: "$", text: "Competitive + uncapped commissions" },
        { icon: "⏱", text: "Full-Time" },
        { icon: "⌂", text: "Remote / Hybrid" },
        { icon: "✉", text: "Subject: BDM Application" },
      ],
    },
  },
  {
    id: "content-writer",
    title: "Content Writer — SEO-Optimized Digital Marketing & AI Solutions",
    iconClass: "j2",
    iconChar: "✎",
    categories: ["creative", "marketing", "remote"],
    keywords: "content writer seo writing copywriter blog",
    tags: {
      dept: "Creative · Marketing",
      location: "📍 Troy, MI",
      remote: "⌂ Remote / Global",
      experience: "Mid-Level (2+ yrs)",
      type: "Full-Time / Freelance",
    },
    posted: "Posted Apr 11, 2026",
    applyJobName: "Content Writer",
    applyEmailSubject: "Content Writer Application",
    about: (
      <p>
        We're seeking a talented Content Writer to join our team and help produce
        engaging, high-ranking content that supports client projects in digital
        marketing, web/app development, AI integration, and beyond. If you excel at{" "}
        <strong>SEO content writing</strong>, keyword research, and turning complex tech
        topics into readable, persuasive copy — this role is for you.
      </p>
    ),
    sections: [
      {
        heading: "Key Responsibilities",
        items: [
          "Research industry topics (AI, digital marketing, web/app development, SEO, cybersecurity, cloud) and produce well-researched, original articles, blog posts, case studies, whitepapers, and website copy",
          "Write SEO-optimized content with keyword research, meta titles/descriptions, headings, and internal linking",
          "Create engaging content for blogs, social media captions, email newsletters, landing pages, and service pages",
          "Collaborate with digital marketing teams, web developers, and designers to align with brand voice and project timelines",
          "Edit and proofread for grammar, clarity, tone, factual accuracy, and readability",
          "Boost organic search rankings by matching user search intent and current Google algorithms",
          "Update existing content to improve SEO performance",
          "Track content performance via Google Analytics, Search Console, and similar tools",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "2+ years professional content writing experience, ideally in digital marketing or tech/IT",
          "Strong understanding of SEO best practices (keyword research, on-page optimization, E-E-A-T, search intent)",
          "Excellent English writing — clear, engaging, persuasive copy for B2B and tech audiences",
          "Experience with tech/digital topics (AI, marketing, web/app dev, SEO) highly preferred",
          "Familiarity with Google Keyword Planner, Ahrefs/SEMrush, Grammarly, WordPress, CMS platforms",
          "Bachelor's in English, Journalism, Marketing, Communications, or equivalent",
          <><strong>Bonus:</strong> Portfolio with SEO-optimized blog posts or articles that ranked well</>,
        ],
      },
    ],
    apply: {
      blurb: "Send resume, cover letter, and 3-5 SEO-optimized writing samples.",
      info: [
        { icon: "$", text: "Competitive + bonuses" },
        { icon: "⏱", text: "Full-Time / Freelance" },
        { icon: "⌂", text: "Remote (Global)" },
        { icon: "✉", text: "Include 3-5 samples" },
      ],
    },
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer — Digital Marketing & AI-Powered Solutions",
    iconClass: "j3",
    iconChar: "◈",
    categories: ["creative", "remote"],
    keywords: "graphic designer adobe photoshop illustrator branding visual",
    tags: {
      dept: "Creative",
      location: "📍 Troy, MI",
      remote: "⌂ Remote (Worldwide)",
      experience: "2–5+ years",
      type: "Full-Time / Freelance",
    },
    posted: "Posted Apr 04, 2026",
    applyJobName: "Graphic Designer",
    applyEmailSubject: "Graphic Designer Application",
    about: (
      <p>
        We're expanding our creative team and seeking a skilled Graphic Designer to
        craft eye-catching visuals that elevate digital marketing campaigns, enhance
        websites/apps, and support AI-driven client projects. Your designs will help
        clients stand out online and drive engagement and conversion.
      </p>
    ),
    sections: [
      {
        heading: "Key Responsibilities",
        items: [
          "Design high-quality graphics for social media posts, ads (Google/Facebook/LinkedIn), email campaigns, banners, infographics, and website elements",
          "Create branding materials: logos, icons, typography, color palettes, and style guides",
          "Produce visuals for AI-powered websites, app mockups, landing pages, and marketing collateral",
          "Collaborate with content writers, marketers, developers, and clients",
          "Ensure designs are responsive, follow brand guidelines, and incorporate SEO-friendly elements",
          "Iterate on feedback and deliver final files in multiple formats (PNG, SVG, PSD)",
          "Stay updated on design trends and UI/UX best practices",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "2+ years professional graphic design, preferably in agency or tech firm",
          "Strong portfolio with digital marketing graphics, branding, and tech-related designs",
          <>Proficiency in <strong>Adobe Creative Suite</strong> (Photoshop, Illustrator, InDesign) — After Effects or Figma a plus</>,
          "Solid understanding of typography, color theory, layout, and digital design",
          "Experience with responsive design and social media formats",
          <><strong>Bonus:</strong> AI design tools (Midjourney, Canva AI), motion graphics, video editing</>,
        ],
      },
    ],
    apply: {
      blurb: "Send resume, cover letter, and portfolio link (Behance / Dribbble / personal site).",
      info: [
        { icon: "$", text: "Competitive + bonuses" },
        { icon: "⏱", text: "Full-Time / Freelance" },
        { icon: "⌂", text: "Remote (Worldwide)" },
        { icon: "✉", text: "Include portfolio link" },
      ],
    },
  },
  {
    id: "video-editor",
    title: "Video Editor — Digital Marketing & Social Media Content",
    iconClass: "j4",
    iconChar: "▶",
    categories: ["creative", "remote"],
    keywords: "video editor premiere pro after effects social media reels",
    tags: {
      dept: "Creative",
      location: "📍 Troy, MI",
      remote: "⌂ Remote (Global)",
      experience: "2+ years",
      type: "Full-Time / Freelance",
    },
    posted: "Posted Mar 28, 2026",
    applyJobName: "Video Editor",
    applyEmailSubject: "Video Editor Application",
    about: (
      <p>
        Join our team as Video Editor to bring stories to life through polished,
        high-impact videos that support digital marketing and AI-driven client success.
        You'll edit short and long-form videos for social media (Reels, TikToks, YouTube
        Shorts), ads, client testimonials, website embeds, product demos, and marketing
        campaigns.
      </p>
    ),
    sections: [
      {
        heading: "Key Responsibilities",
        items: [
          "Edit raw footage into engaging videos: trim, sequence, add transitions, effects, text overlays, graphics, music, sound design",
          "Create social media-ready content (vertical/horizontal) for Instagram, TikTok, YouTube, LinkedIn, Facebook",
          "Produce promotional videos, explainer clips, ad creatives, and project highlight reels",
          "Collaborate with marketers, designers, and clients on brand voice and campaign goals",
          "Incorporate motion graphics, subtitles, color grading for maximum viewer retention",
          "Optimize videos for web/social and export in multiple formats",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "2+ years video editing experience, ideally in digital marketing or agency settings",
          "Strong portfolio/reel with marketing videos, social content, ads, or tech edits",
          <>Expert in <strong>Adobe Premiere Pro, After Effects</strong>; Final Cut Pro or DaVinci Resolve a plus</>,
          "Knowledge of motion graphics, color correction, audio mixing",
          "Understanding of digital marketing video best practices (hooks, CTAs, platform specs, YouTube SEO)",
          <><strong>Bonus:</strong> AI video tools, stock footage, basic shooting/directing</>,
        ],
      },
    ],
    apply: {
      blurb: "Email resume, cover letter, and video reel/portfolio link.",
      info: [
        { icon: "$", text: "Competitive + bonuses" },
        { icon: "⏱", text: "Full-Time / Freelance" },
        { icon: "⌂", text: "Remote (Global)" },
        { icon: "✉", text: "Include 3-5 video links" },
      ],
    },
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Specialist — SEO, Paid Ads & Growth Strategies",
    iconClass: "j5",
    iconChar: "⚡",
    categories: ["marketing", "remote"],
    keywords: "digital marketing specialist seo ppc google ads meta ads",
    tags: {
      dept: "Marketing",
      location: "📍 Troy, MI",
      remote: "⌂ Remote (Worldwide)",
      experience: "2–5+ years",
      type: "Full-Time / Freelance",
    },
    posted: "Posted Mar 21, 2026",
    applyJobName: "Digital Marketing Specialist",
    applyEmailSubject: "Digital Marketing Specialist Application",
    about: (
      <p>
        We're seeking a results-oriented Digital Marketing Specialist to manage
        multi-channel campaigns, drive organic and paid traffic, and support client
        success in tech/digital sectors. You'll plan, execute, and optimize digital
        marketing campaigns across SEO, paid search, social media, email, and content
        to generate leads and ROI for clients.
      </p>
    ),
    sections: [
      {
        heading: "Key Responsibilities",
        items: [
          "Develop and implement digital marketing strategies focused on lead generation, brand awareness, and revenue growth",
          "Manage SEO, PPC (Google Ads, Meta Ads), social media advertising, and email campaigns",
          "Conduct keyword research, competitor analysis, and market research",
          "Create and optimize content, landing pages, ad creatives, and email sequences",
          "Track KPIs (ROAS, CPA, traffic, conversions) using GA4, Search Console, ad platforms, CRM",
          "Run A/B tests and optimize conversion funnels",
          "Collaborate with content writers, designers, video editors, developers, and clients",
          "Stay updated on algorithm changes, AI marketing tools, and digital trends",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "2+ years in digital marketing roles, preferably agency or tech firm",
          "Proven experience with SEO, Google Ads, Meta Ads, social media, email marketing (Mailchimp/Klaviyo)",
          "Strong analytical skills; proficient in GA4, Search Console, SEMrush/Ahrefs, ad platforms",
          "Knowledge of content marketing, CRO, and paid/organic channel integration",
          "Excellent communication, project management, and adaptability",
          <><strong>Bonus:</strong> AI-driven marketing tools, technical SEO basics, B2B tech clients</>,
        ],
      },
    ],
    apply: {
      blurb: "Send resume, cover letter, and case studies showing ROAS/traffic growth.",
      info: [
        { icon: "$", text: "Competitive + ROI bonuses" },
        { icon: "⏱", text: "Full-Time / Freelance" },
        { icon: "⌂", text: "Remote (Worldwide)" },
        { icon: "✉", text: "Include campaign examples" },
      ],
    },
  },
  {
    id: "seo",
    title: "SEO Specialist / SEO Engineer — Technical & On-Page Optimization",
    iconClass: "j6",
    iconChar: "⌕",
    categories: ["marketing", "remote"],
    keywords: "seo specialist engineer technical seo on-page optimization",
    tags: {
      dept: "Marketing · Engineering",
      location: "📍 Troy, MI",
      remote: "⌂ Remote (Global)",
      experience: "2+ years",
      type: "Full-Time / Freelance",
    },
    posted: "Posted Mar 14, 2026",
    applyJobName: "SEO Specialist",
    applyEmailSubject: "SEO Specialist Application",
    about: (
      <p>
        We're hiring an SEO Specialist / SEO Engineer to handle technical audits,
        on-page optimizations, keyword strategies, and performance improvements for
        client projects in tech, AI, and digital services. You'll optimize websites for
        search engines, improve rankings, fix technical issues, and boost organic
        visibility — focusing on E-E-A-T, user intent, and AI-era search trends.
      </p>
    ),
    sections: [
      {
        heading: "Key Responsibilities",
        items: [
          "Perform comprehensive SEO audits (technical, on-page, off-page) using Screaming Frog, Ahrefs, SEMrush, Search Console",
          "Conduct keyword research, search intent analysis, and competitor benchmarking",
          "Implement on-page optimizations: meta tags, headings, schema markup, internal linking, content silos, Core Web Vitals",
          "Handle technical SEO: site speed, mobile-friendliness, crawl errors, indexation, HTTPS, structured data, XML sitemaps",
          "Build and manage link-building strategies (ethical outreach, guest posts, partnerships)",
          "Optimize for AI search features, voice search, and emerging algorithms (2026 trends)",
          "Monitor rankings, traffic, conversions; create monthly SEO reports",
          "Collaborate with developers, content teams, and marketers to integrate SEO into web/app projects",
        ],
      },
      {
        heading: "Qualifications",
        items: [
          "2+ years as SEO Specialist, SEO Engineer, or similar (agency or in-house)",
          "Deep knowledge of technical SEO, on-page/off-page optimization, and tools (Ahrefs/SEMrush, GA, Search Console, PageSpeed)",
          "Strong understanding of HTML/CSS basics, site architecture, and UX factors",
          "Analytical mindset with ROI-focused improvement experience",
          "Familiarity with content strategy, link building, local/international SEO",
          <><strong>Bonus:</strong> AI SEO tools, JavaScript rendering issues, e-commerce/tech site optimization</>,
        ],
      },
    ],
    apply: {
      blurb: "Email resume, cover letter, and SEO case studies (before/after rankings).",
      info: [
        { icon: "$", text: "Competitive + ranking bonuses" },
        { icon: "⏱", text: "Full-Time / Freelance" },
        { icon: "⌂", text: "Remote (Global)" },
        { icon: "✉", text: "Include SEO case studies" },
      ],
    },
  },
];

const BENEFITS: Array<{
  cls: string;
  iconCls: string;
  icon: string;
  title: string;
  desc: string;
}> = [
  { cls: "b1", iconCls: "b1", icon: "⚡", title: "Competitive Salary", desc: "Performance-based incentives, uncapped commissions for sales roles, and bonuses tied to real campaign results." },
  { cls: "b2", iconCls: "b2", icon: "⌂", title: "Remote-First Flexibility", desc: "Work from anywhere with flexible hours. Hybrid options for Troy, MI candidates. International talent welcome." },
  { cls: "b3", iconCls: "b3", icon: "↗", title: "Innovative Projects", desc: "Work on cutting-edge AI, cloud, and digital marketing projects with forward-thinking clients." },
  { cls: "b4", iconCls: "b4", icon: "◈", title: "Collaborative Culture", desc: "Friendly, supportive teams focused on growth, innovation, and delivering real business value together." },
  { cls: "b5", iconCls: "b5", icon: "★", title: "Pro Development Support", desc: "Tools access (Adobe CC, Ahrefs, SEMrush), training budget, conferences, and continuous learning opportunities." },
  { cls: "b6", iconCls: "b6", icon: "⬢", title: "Modern Tech Stack", desc: "AI-powered tools, latest dev frameworks, and creative software — we equip you with what you need to do your best work." },
  { cls: "b7", iconCls: "b7", icon: "⊕", title: "Freelance-to-Full-Time", desc: "Many roles open to freelance start with a clear path to full-time based on fit and performance." },
  { cls: "b8", iconCls: "b8", icon: "✦", title: "Equal Opportunity", desc: "We welcome diverse applicants and value creativity, accuracy, results-driven work — regardless of background." },
];

const FAQS: Array<{ q: string; a: React.ReactNode; open?: boolean }> = [
  {
    q: "Are roles fully remote?",
    a: "Most roles offer fully remote options with flexible hours. Hybrid is available for Troy, MI candidates. We hire international talent — strong English proficiency required for client-facing roles.",
    open: true,
  },
  {
    q: "Do you offer freelance-to-full-time conversions?",
    a: "Yes. Several roles (Content Writer, Graphic Designer, Video Editor, Digital Marketing Specialist, SEO) start as freelance and convert to full-time based on fit and performance — typically within 60-90 days.",
  },
  {
    q: "What's the interview process?",
    a: "1) Apply via email or form → 2) Initial 15-min screen call → 3) Technical/portfolio review → 4) Team interview → 5) Paid trial project (1-3 days) → 6) Offer. Typically 1-2 weeks end-to-end.",
  },
  {
    q: "What does compensation look like?",
    a: "Base salary at market rates plus performance bonuses tied to real outcomes — campaign ROI for marketing roles, ranking/traffic improvements for SEO, content impact for writers, uncapped commissions for sales. Compensation is discussed openly during the process.",
  },
  {
    q: "I don't see a role that fits — can I still apply?",
    a: (
      <>
        Absolutely. Email{" "}
        <a
          href="mailto:careers@vsolutionsinc.com"
          style={{ color: "var(--rose)", fontWeight: 600 }}
        >
          careers@vsolutionsinc.com
        </a>{" "}
        with your resume and a short note explaining your skills. We're always happy to
        hear from talented people, even if there's no current opening for your specialty.
      </>
    ),
  },
];

const ROLE_CHIPS = [
  { cls: "r1", text: "Business Development", remote: "Hybrid" },
  { cls: "r2", text: "Content Writer", remote: "Remote" },
  { cls: "r3", text: "Graphic Designer", remote: "Remote" },
  { cls: "r4", text: "Video Editor", remote: "Remote" },
  { cls: "r5", text: "Digital Marketer", remote: "Remote" },
  { cls: "r6", text: "SEO Specialist", remote: "Remote" },
];

type FilterKey = "all" | "sales" | "creative" | "marketing" | "remote";

export default function CareersClient() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [modalRole, setModalRole] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  const visibleJobs = useMemo(() => {
    const q = search.toLowerCase().trim();
    return JOBS.filter((j) => {
      const matchFilter = filter === "all" || j.categories.includes(filter);
      const matchSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.keywords.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  // Tilt on benefit cards
  useEffect(() => {
    const cards = benefitsRef.current
      ? Array.from(benefitsRef.current.querySelectorAll<HTMLElement>(".benefit-card"))
      : [];
    const handlers = cards.map((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * -3;
        const tiltY = (x / rect.width) * 3;
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      return { card, onMove, onLeave };
    });
    return () => {
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  // Modal: lock body scroll + Escape to close
  useEffect(() => {
    if (!modalRole) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalRole(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [modalRole]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const role = modalRole || "this role";
    const subject = `${role} Application — ${data.get("firstName")} ${data.get("lastName")}`;
    const body =
      `Application for: ${role}\r\n\r\n` +
      `Name: ${data.get("firstName")} ${data.get("lastName")}\r\n` +
      `Email: ${data.get("email")}\r\n` +
      `Phone: ${data.get("phone") || "N/A"}\r\n` +
      `Location: ${data.get("location") || "N/A"}\r\n` +
      `Experience: ${data.get("experience")}\r\n` +
      `Portfolio: ${data.get("portfolio") || "N/A"}\r\n\r\n` +
      `Why I'm a great fit:\r\n${data.get("cover")}\r\n\r\n` +
      `[Please attach resume to this email]`;
    window.location.href = `mailto:careers@vsolutionsinc.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const filterCounts: Record<FilterKey, number> = {
    all: JOBS.length,
    sales: JOBS.filter((j) => j.categories.includes("sales")).length,
    creative: JOBS.filter((j) => j.categories.includes("creative")).length,
    marketing: JOBS.filter((j) => j.categories.includes("marketing")).length,
    remote: JOBS.filter((j) => j.categories.includes("remote")).length,
  };

  return (
    <>
      <section className="careers-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <span className="current">Careers</span>
          </nav>

          <div className="hero-grid">
            <div>
              <div className="hero-pill">
                <span className="label">We're hiring</span>
                <span>
                  <span>{JOBS.length}</span> open roles · Remote-friendly · Global
                  talent welcome
                </span>
              </div>

              <h1 className="careers-title">
                Learn &amp; Grow In
                <br />
                Your <em>Career</em>
                <br />
                With V Solutions
              </h1>

              <p className="careers-subhead">
                Our diverse teams offer flexibility, friendly working environment, and
                exciting opportunities for professional advancement.
              </p>

              <p className="careers-lede">
                With lots of growth comes new opportunities. We're always looking for
                talented, driven, and friendly individuals who are passionate about
                technology to join our team of customer-focused analysts.
              </p>

              <div className="hero-actions">
                <a href="#openings" className="btn btn-primary">
                  View Open Roles <span className="btn-arrow">→</span>
                </a>
                <a
                  href="mailto:careers@vsolutionsinc.com"
                  className="btn btn-ghost"
                >
                  ✉ careers@vsolutionsinc.com
                </a>
              </div>

              <div className="hero-trust">
                <div className="hero-trust-item">
                  <span className="hero-trust-num">{JOBS.length}</span>
                  <span className="hero-trust-lbl">Open Roles</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">100%</span>
                  <span className="hero-trust-lbl">Remote-Friendly</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">2</span>
                  <span className="hero-trust-lbl">Countries Hired</span>
                </div>
                <div className="hero-trust-item">
                  <span className="hero-trust-num">4.8★</span>
                  <span className="hero-trust-lbl">Team Rating</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hv-bg">
                <div className="hv-orbit">
                  <div className="hv-pulse"></div>
                  <div className="hv-pulse p2"></div>
                  <div className="hv-pulse p3"></div>
                  <div className="hv-center">
                    <img
                      src="https://vsolutionsinc.com/wp-content/uploads/2026/03/vsolutions-final.svg"
                      alt="V Solutions"
                    />
                  </div>
                  {ROLE_CHIPS.map((c) => (
                    <span key={c.cls} className={`role-chip ${c.cls}`}>
                      <span className="dot"></span>
                      {c.text}
                      <span className="badge-remote">{c.remote}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec fade-up visible">
        <div className="container">
          <div className="sec-head">
            <div className="sec-eyebrow">Why VSolutions</div>
            <h2 className="sec-title">
              Work that <em>respects your time</em>
              <br />
              and amplifies your craft.
            </h2>
            <p className="sec-desc">
              A growing team of designers, developers, marketers, and AI specialists
              building cutting-edge solutions for clients worldwide. Here's what we offer.
            </p>
          </div>

          <div className="benefits-grid" ref={benefitsRef}>
            {BENEFITS.map((b) => (
              <div key={b.title} className={`benefit-card ${b.cls}`}>
                <div className={`benefit-icon ${b.iconCls}`}>{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="openings-section fade-up visible" id="openings">
        <div className="container">
          <div className="sec-head">
            <div className="sec-eyebrow">Current Openings</div>
            <h2 className="sec-title">
              Find your <em>next opportunity.</em>
            </h2>
            <p className="sec-desc">
              All roles below are actively hiring. Click any position to expand the full
              description and apply directly via email or our application form.
            </p>
          </div>

          <div className="filter-bar">
            <div className="filter-bar-left">
              <span className="filter-bar-label">Filter by:</span>
              {(
                [
                  ["all", "All"],
                  ["sales", "Sales"],
                  ["creative", "Creative"],
                  ["marketing", "Marketing"],
                  ["remote", "Remote"],
                ] as Array<[FilterKey, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  className={`filter-chip${filter === key ? " active" : ""}`}
                  onClick={() => setFilter(key)}
                  type="button"
                >
                  {label} <span className="count">{filterCounts[key]}</span>
                </button>
              ))}
            </div>
            <label className="filter-search">
              <span className="filter-search-icon">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, skill, or keyword..."
              />
            </label>
          </div>

          {visibleJobs.length === 0 && (
            <div className="no-results show">
              <div className="icon">🔍</div>
              <p>
                No openings match your search.{" "}
                <a
                  href="mailto:careers@vsolutionsinc.com"
                  style={{ color: "var(--rose)", fontWeight: 600 }}
                >
                  Send us your resume anyway
                </a>{" "}
                — we'd love to hear from you.
              </p>
            </div>
          )}

          <div className="jobs-list">
            {visibleJobs.map((job) => (
              <details key={job.id} className="job-card">
                <summary className="job-card-summary">
                  <div className={`job-icon ${job.iconClass}`}>{job.iconChar}</div>
                  <div className="job-meta">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-tags">
                      <span className="job-tag dept">{job.tags.dept}</span>
                      <span className="job-tag location">{job.tags.location}</span>
                      <span className="job-tag remote">{job.tags.remote}</span>
                      <span className="job-tag experience">{job.tags.experience}</span>
                      <span className="job-tag type">{job.tags.type}</span>
                    </div>
                  </div>
                  <div className="job-posted">{job.posted}</div>
                  <span className="job-toggle"></span>
                </summary>
                <div className="job-detail">
                  <div className="job-detail-grid">
                    <div className="job-detail-content">
                      <h4>About the Role</h4>
                      {job.about}
                      {job.sections.map((s) => (
                        <div key={s.heading}>
                          <h4>{s.heading}</h4>
                          {s.intro && <p>{s.intro}</p>}
                          {s.items && (
                            <ul>
                              {s.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <aside className="job-apply-card">
                      <h4>Apply for this role</h4>
                      <p>{job.apply.blurb}</p>
                      <div className="job-apply-info">
                        {job.apply.info.map((item) => (
                          <div key={item.text} className="job-apply-info-item">
                            <span className="icon">{item.icon}</span>
                            <span>{item.text}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalRole(job.applyJobName);
                        }}
                      >
                        Apply Now <span className="btn-arrow">→</span>
                      </button>
                      <a
                        href={`mailto:careers@vsolutionsinc.com?subject=${encodeURIComponent(
                          job.applyEmailSubject,
                        )}`}
                        className="email-link"
                      >
                        or email careers@vsolutionsinc.com
                      </a>
                    </aside>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="culture-section fade-up visible">
        <div className="container">
          <div className="culture-grid">
            <div>
              <div className="sec-eyebrow">Life at VSolutions</div>
              <h2 className="sec-title" style={{ textAlign: "left" }}>
                A team that <em>builds together</em> and ships fast.
              </h2>

              <div className="culture-quote">
                <p className="culture-quote-text">
                  &ldquo;VSolutions gave me the freedom to do my best work — flexible
                  hours, great tools, real ownership of projects. The team genuinely
                  cares about both client outcomes and the craft of getting there.&rdquo;
                </p>
                <div className="culture-quote-author">
                  <div className="culture-quote-avatar">A</div>
                  <div className="culture-quote-meta">
                    <strong>Anonymous Team Member</strong>
                    <span>Digital Marketing · 3 years at VSolutions</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="sec-eyebrow">Common Questions</div>
              <h2 className="sec-title" style={{ textAlign: "left" }}>
                Hiring <em>FAQ.</em>
              </h2>

              <div className="faq-list">
                {FAQS.map((f) => (
                  <details key={f.q} className="faq-item" open={f.open}>
                    <summary>{f.q}</summary>
                    <div className="faq-answer">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta fade-up visible">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <div className="cta-eyebrow">Ready to grow with us?</div>
              <h3>
                Don't see your role? <em>Send us your resume.</em>
              </h3>
              <p>
                We're always looking for talented, driven, friendly individuals
                passionate about technology. Even if there's no current opening that
                matches your skills, we'd love to hear from you.
              </p>
              <div className="cta-actions">
                <a
                  href="mailto:careers@vsolutionsinc.com?subject=General Application"
                  className="btn btn-primary"
                >
                  Send Resume <span className="btn-arrow">→</span>
                </a>
                <a href="#openings" className="btn btn-ghost">
                  Browse Open Roles
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className={`modal-overlay${modalRole ? " active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalRole(null);
        }}
      >
        <div className="modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="modal-close"
            onClick={() => setModalRole(null)}
            aria-label="Close"
          >
            ×
          </button>
          <h3>
            Apply for <em>{modalRole || "this role"}</em>
          </h3>
          <p className="modal-subtitle">
            Fill in the form below or send your resume directly to{" "}
            <a
              href="mailto:careers@vsolutionsinc.com"
              style={{ color: "var(--rose)", fontWeight: 600 }}
            >
              careers@vsolutionsinc.com
            </a>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-row cols">
              <div className="form-row">
                <label>
                  First Name <span className="required">*</span>
                </label>
                <input type="text" name="firstName" required />
              </div>
              <div className="form-row">
                <label>
                  Last Name <span className="required">*</span>
                </label>
                <input type="text" name="lastName" required />
              </div>
            </div>
            <div className="form-row">
              <label>
                Email <span className="required">*</span>
              </label>
              <input type="email" name="email" required />
            </div>
            <div className="form-row">
              <label>Phone Number</label>
              <input type="tel" name="phone" />
            </div>
            <div className="form-row">
              <label>Country / Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Detroit, MI / Berlin, Germany"
              />
            </div>
            <div className="form-row">
              <label>
                Years of Experience <span className="required">*</span>
              </label>
              <select name="experience" required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                <option>0–2 years</option>
                <option>2–5 years</option>
                <option>5–10 years</option>
                <option>10+ years</option>
              </select>
            </div>
            <div className="form-row">
              <label>Portfolio / LinkedIn URL</label>
              <input type="url" name="portfolio" placeholder="https://" />
            </div>
            <div className="form-row">
              <label>
                Why are you a great fit? <span className="required">*</span>
              </label>
              <textarea
                name="cover"
                required
                placeholder="Tell us about your relevant experience and what excites you about this role..."
              />
            </div>
            <div className="form-row">
              <label>Resume / CV</label>
              <label className="file-upload">
                <span className="icon">📎</span>
                <span>
                  {resumeName ||
                    "Click to upload PDF or DOCX (optional — you can also email later)"}
                </span>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const f = e.currentTarget.files?.[0];
                    setResumeName(f ? `📄 ${f.name}` : null);
                  }}
                />
              </label>
            </div>
            <button type="submit" className="btn btn-primary modal-submit">
              Submit Application <span className="btn-arrow">→</span>
            </button>
            <p className="modal-disclaimer">
              By applying, you agree to our <a href="/privacy-policy/">Privacy Policy</a>.
              We're an equal opportunity employer.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
