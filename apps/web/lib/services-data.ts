// Service showcase data — ported from vsolutions-services.html
// Source content verified against www.vsolutionsinc.com (May 2026).

export type FeatureItem = { strong: string; text: string };
export type Feature = {
  eyebrow: string;
  title: string;
  summary: string;
  glyph: string;
  tags: string[];
  items: FeatureItem[];
};
export type WhyCard = { icon: string; title: string; desc: string };
export type ProcessStep = { title: string; desc: string };
export type Stat = { num: string; lbl: string };
export type Faq = { q: string; a: string };
export type Tech = { n: string };
export type Quote = { text: string; who: string; org: string };

export type Service = {
  slug: string;
  url: string;
  name: string;
  pillIcon: string;
  accent: string;
  accent2: string;
  accentGlow: string;
  glyph: string;
  image: string;
  pill: string;
  title: string;
  subhead: string;
  lede: string;
  stats: Stat[];
  tags: string[];
  introTitle: string;
  introStat: { num: string; label: string; text: string };
  introBody: string;
  features: Feature[];
  why: WhyCard[];
  process: ProcessStep[];
  ctaTitle: string;
  ctaText: string;
  tagline?: string;
  gallery?: string[];
  industries?: string[];
  tech?: Tech[];
  quote?: Quote;
  faqs?: Faq[];
};

export const SERVICE_ORDER = [
  "ai",
  "cloud",
  "cybersecurity",
  "web",
  "mobile",
  "marketing",
  "vdi",
  "content",
] as const;

export type ServiceKey = (typeof SERVICE_ORDER)[number];

// Mapping from CMS/DB slug → showcase key
export const DB_SLUG_TO_KEY: Record<string, ServiceKey> = {
  "artificial-intelligence": "ai",
  "cloud-devops-services": "cloud",
  "cybersecurity-application-security-testing": "cybersecurity",
  "website-development-services-vsolutions-inc": "web",
  "mobile-application-development": "mobile",
  "digital-marketing": "marketing",
  "vdi-endpoint-management-services": "vdi",
  "content-writing": "content",
};

export const SERVICES: Record<ServiceKey, Service> = {
  ai: {
    slug: "ai",
    url: "/service/artificial-intelligence/",
    name: "Artificial Intelligence",
    pillIcon: "AI",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "⚡",
    image: "https://vsolutionsinc.com/wp-content/uploads/2020/03/ai-450x450.png",
    pill: "AI Services",
    title: "Empower business with <em>intelligent AI</em> built for marketing",
    subhead:
      "In 2026, AI is not just a tool — it's the driving force behind smarter strategies, deeper insights, and unparalleled efficiency.",
    lede: "At <strong>VSolutions Inc</strong>, our Artificial Intelligence Services empower businesses to harness the full potential of AI. We deploy custom AI solutions that integrate seamlessly with your marketing efforts — delivering predictive intelligence, automation, and optimization at scale.",
    stats: [
      { num: "200%", lbl: "Avg ROI Lift" },
      { num: "24/7", lbl: "Agentic Monitoring" },
      { num: "4x", lbl: "Faster Insights" },
      { num: "GDPR", lbl: "CCPA Ready" },
    ],
    tags: ["Predictive AI", "NLP", "GenAI", "Computer Vision", "Agentic Workflows", "Ethical AI"],
    introTitle: "AI that <em>augments</em> human expertise",
    introStat: {
      num: "200%",
      label: "Performance Gains",
      text: "Successfully implemented AI solutions that have driven 30-200% improvements in key metrics for clients across industries.",
    },
    introBody:
      "<p>At VSolutions Inc, our Artificial Intelligence Services empower businesses to harness the full potential of AI in digital marketing and beyond. In 2026, AI is not just a tool—it's the driving force behind smarter strategies, deeper insights, and unparalleled efficiency. We specialize in deploying custom AI solutions that integrate seamlessly with your marketing efforts, delivering predictive intelligence, automation, and optimization at scale.</p><p>Our AI services are built on the principle of augmentation: <strong>advanced technology enhances human expertise, never replaces it.</strong> We combine state-of-the-art machine learning models with the creative and strategic insight of our marketing professionals to create solutions that are intelligent, ethical, and results-oriented.</p>",
    features: [
      {
        eyebrow: "Custom Integration",
        title: "AI Integration <em>For Digital Marketing</em>",
        summary: "Bespoke AI models trained on your data — connected to every tool you already use.",
        glyph: "◈",
        tags: ["CRM", "CMS", "Ad Platforms", "Analytics"],
        items: [
          { strong: "Bespoke AI Models", text: "Development and deployment of custom machine learning models trained on your unique data for superior accuracy in audience segmentation, behavior prediction, and campaign forecasting." },
          { strong: "Seamless Platform Integration", text: "Connect AI capabilities with your existing tools (CRM, CMS, advertising platforms, analytics suites) for unified, automated workflows." },
          { strong: "Agentic AI Workflows", text: "Autonomous AI agents that manage repetitive tasks, monitor campaigns 24/7, and execute real-time optimizations based on predefined strategies." },
          { strong: "Scalable Infrastructure", text: "Cloud-based AI solutions that grow with your business, ensuring performance and reliability at any scale." },
        ],
      },
      {
        eyebrow: "Advanced Analytics",
        title: "AI-Powered <em>Analytics & Insights</em>",
        summary: "Predictive intelligence that doesn't just report — it forecasts what happens next.",
        glyph: "↗",
        tags: ["Predictive", "Real-Time", "Attribution", "Competitive"],
        items: [
          { strong: "Predictive Customer Intelligence", text: "Forecast customer lifetime value, churn risk, and next-best actions using deep learning models." },
          { strong: "Real-Time Performance Analytics", text: "AI-driven dashboards that detect anomalies, identify trends, and suggest immediate optimizations." },
          { strong: "Competitive Intelligence", text: "Monitor market trends, competitor strategies, and emerging opportunities through automated data aggregation and analysis." },
          { strong: "Attribution & ROI Modeling", text: "Multi-touch attribution powered by AI to accurately measure channel impact and maximize marketing spend efficiency." },
        ],
      },
      {
        eyebrow: "Creative Optimization",
        title: "AI-Driven <em>Content & Creative</em>",
        summary: "Generate, test, and personalize content at scale — with human expert oversight on every output.",
        glyph: "✎",
        tags: ["GenAI", "Personalization", "Multimodal", "Testing"],
        items: [
          { strong: "Generative AI for Content Creation", text: "AI-assisted generation of blog posts, social media copy, email campaigns, and ad creatives—refined and approved by human experts." },
          { strong: "Creative Performance Prediction", text: "Test thousands of variations virtually to predict winning creatives before launch." },
          { strong: "Personalized Content at Scale", text: "Dynamic content engines that adapt messaging, visuals, and offers in real-time based on individual user profiles." },
          { strong: "Multimodal AI Capabilities", text: "Generate and optimize images, videos, and interactive elements alongside text for richer experiences." },
        ],
      },
      {
        eyebrow: "Ethical AI",
        title: "Ethical <em>AI Governance</em> & Implementation",
        summary: "Trustworthy AI that aligns with your values, your data, and global compliance frameworks.",
        glyph: "🛡",
        tags: ["GDPR", "CCPA", "Bias-Free", "Explainable"],
        items: [
          { strong: "Bias Detection & Mitigation", text: "Ongoing monitoring and correction to ensure fair, inclusive AI outcomes." },
          { strong: "Data Privacy Compliance", text: "Full adherence to GDPR, CCPA, and emerging AI regulations." },
          { strong: "Explainable AI", text: "Clear documentation and visibility into how models make decisions." },
          { strong: "Human-in-the-Loop Oversight", text: "Critical decisions always involve expert review and approval." },
        ],
      },
    ],
    why: [
      { icon: "⚡", title: "Marketing-First AI Expertise", desc: "Unlike general AI providers, we understand digital marketing deeply — ensuring solutions deliver measurable business impact." },
      { icon: "◈", title: "End-to-End Ownership", desc: "From strategy and development to deployment and ongoing optimization — one accountable partner." },
      { icon: "↗", title: "Proven Results", desc: "Successfully implemented AI solutions that have driven 30-200% improvements in key metrics for clients across industries." },
      { icon: "★", title: "Future-Proof Approach", desc: "Continuously updated with the latest advancements in AI, including multimodal models and agentic systems." },
    ],
    process: [
      { title: "Discovery & Assessment", desc: "Evaluate existing systems, data maturity, and business goals to uncover high-impact AI opportunities." },
      { title: "Strategy, Design & Use-Case Definition", desc: "Collaborate to define priority use cases, model requirements, architecture, and measurable success metrics." },
      { title: "Development, Training & Validation", desc: "Build, train, and rigorously test custom AI solutions in a controlled environment to ensure accuracy and reliability." },
      { title: "Deployment, Integration & Continuous Evolution", desc: "Deploy with minimal disruption, enable teams, and continuously monitor performance, retrain models, and expand capabilities." },
    ],
    ctaTitle: "Unlock smarter growth — <em>with AI today.</em>",
    ctaText: "Elevate your digital strategy with custom AI solutions that drive automation, predictive insights, and measurable business results. Let's transform your data into competitive advantage.",
    tagline: "Augment expertise. Never replace it.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2025/12/ai-ml.svg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/AI-Enhanced-Website-Features-1.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Advanced-AI-Enhanced-SEO-Services.jpg",
    ],
    industries: ["Healthcare", "FinTech", "E-commerce", "SaaS", "Manufacturing", "Media"],
    tech: [
      { n: "OpenAI" }, { n: "Anthropic" }, { n: "Hugging Face" }, { n: "LangChain" },
      { n: "PyTorch" }, { n: "TensorFlow" }, { n: "Vector DBs" }, { n: "AWS Bedrock" },
    ],
    quote: {
      text: "VSolutions deployed an AI pipeline in 6 weeks that lifted our qualified-lead conversion by 38%. The team didn't just deliver a model — they embedded it into our workflow with a clear path to ROI.",
      who: "VP, Marketing Operations",
      org: "B2B SaaS · Mid-market",
    },
    faqs: [
      { q: "Do we need our own data to use AI?", a: "Not necessarily. Our AI consultants help you start with public, third-party, or pre-trained models, and we add your proprietary data only where it materially improves accuracy or differentiation." },
      { q: "How do you handle data privacy and compliance?", a: "Every engagement includes a data-handling plan aligned to GDPR, CCPA, HIPAA, and SOC 2. We default to private cloud and customer-controlled keys; we never train shared models on your data without explicit consent." },
      { q: "Can you integrate AI with our existing CRM, CMS, and ad platforms?", a: "Yes. We integrate with HubSpot, Salesforce, WordPress, Shopify, GA4, Google Ads, Meta, LinkedIn, and most modern stacks via APIs, webhooks, or message queues." },
      { q: "How long until we see measurable impact?", a: "Most clients see lift on the first KPI within 30–60 days. Larger transformations follow our 4-phase roadmap with quarterly business reviews and continuous re-training." },
    ],
  },

  cloud: {
    slug: "cloud",
    url: "/service/cloud-devops-services/",
    name: "Cloud DevOps & SRE",
    pillIcon: "☁︎",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "↗",
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Cloud-Devops-Services-450x450.jpg",
    pill: "Cloud · DevOps · SRE",
    title: "Build. Scale. Operate. <em>Without limits.</em>",
    subhead: "Production-grade reliability at the speed of a startup. Cloud platforms engineered for scale.",
    lede: "Enterprise-grade <strong>cloud infrastructure, CI/CD automation, Kubernetes orchestration, and Site Reliability Engineering</strong> — designed to keep your platform fast, secure, and 99.99% available across AWS, Azure, and GCP. From legacy migrations to multi-region rebuilds, we handle the hard parts.",
    stats: [
      { num: "99.99%", lbl: "Uptime Achieved" },
      { num: "67%", lbl: "Faster Deploys" },
      { num: "42%", lbl: "Cloud Spend Cut" },
      { num: "80%", lbl: "Fewer Incidents" },
    ],
    tags: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "Argo CD"],
    introTitle: "Reliability <em>by design.</em>",
    introStat: {
      num: "$2.4M",
      label: "Annual Cloud Savings",
      text: "Real client outcome — 42% spend reduction through right-sizing, FinOps, and smart workload placement across AWS, Azure, and GCP.",
    },
    introBody:
      "<p>VSolutions delivers <strong>enterprise-grade cloud infrastructure</strong> with the velocity engineering teams need and the reliability that finance teams demand. Our DevOps practice combines deep expertise in AWS, Azure, and Google Cloud with battle-tested SRE principles drawn from Google's SRE handbook.</p><p>Whether you're modernizing a legacy monolith, migrating from on-prem, or scaling a microservices fleet across regions, our team designs <strong>infrastructure-as-code blueprints, GitOps deployment pipelines, observability stacks, and automated runbooks</strong> that keep your platform humming as your business grows.</p>",
    features: [
      {
        eyebrow: "Cloud Migration",
        title: "Migrate to <em>any cloud</em> — without the downtime",
        summary: "Lift-and-shift, replatform, or refactor — we handle complex migrations with zero data loss.",
        glyph: "☁",
        tags: ["AWS", "Azure", "GCP", "Hybrid"],
        items: [
          { strong: "Cloud Migration & Modernization", text: "Lift-and-shift, replatform, or refactor — we choose the right strategy per workload and execute with zero data loss." },
          { strong: "Multi-Cloud Architecture", text: "Vendor-agnostic designs across AWS, Azure, and GCP — avoid lock-in and optimize cost per workload." },
          { strong: "Hybrid Cloud Setup", text: "Connect on-prem data centers with cloud resources via VPN, Direct Connect, or ExpressRoute for hybrid workloads." },
          { strong: "Disaster Recovery Planning", text: "Multi-region failover, automated backup verification, and RPO/RTO guarantees that survive real outages." },
        ],
      },
      {
        eyebrow: "CI/CD Automation",
        title: "Ship code <em>10x faster</em> with safe, automated pipelines",
        summary: "GitOps-driven deployments, blue-green rollouts, automated rollback. Your developers ship every hour.",
        glyph: "⚡",
        tags: ["GitHub Actions", "GitLab CI", "ArgoCD", "Spinnaker"],
        items: [
          { strong: "Build & Deployment Pipelines", text: "GitHub Actions, GitLab CI, Jenkins, or CircleCI — wired to test gates, security scans, and automated rollbacks." },
          { strong: "GitOps with Argo CD / Flux", text: "Declarative deployments where Git is the source of truth — every change tracked, every rollback one commit away." },
          { strong: "Blue-Green & Canary Releases", text: "Ship safely with traffic-shifting deployments and automated abort on metric regression." },
          { strong: "Quality & Security Gates", text: "Unit tests, integration tests, SAST/DAST scans, dependency audits — all enforced before any production deploy." },
        ],
      },
      {
        eyebrow: "Kubernetes & Containers",
        title: "Production-ready <em>Kubernetes</em> at any scale",
        summary: "EKS, AKS, GKE — cluster design, hardening, autoscaling, observability. Your platform team will thank us.",
        glyph: "⬢",
        tags: ["EKS", "GKE", "AKS", "Helm", "Istio"],
        items: [
          { strong: "Cluster Design & Hardening", text: "Pod Security Standards, network policies, RBAC, secrets encryption, and node hardening per CIS benchmarks." },
          { strong: "Helm & GitOps Workflows", text: "Helm chart libraries, Kustomize overlays, and ArgoCD application sets that scale across teams and environments." },
          { strong: "Service Mesh (Istio / Linkerd)", text: "mTLS everywhere, traffic policies, observability, and zero-trust networking inside the cluster." },
          { strong: "Cluster Autoscaling & Cost Optimization", text: "Karpenter, Cluster Autoscaler, spot instances, and right-sized resource limits — pay only for what you use." },
        ],
      },
      {
        eyebrow: "Site Reliability Engineering",
        title: "SRE practices that <em>keep you up</em> at 3am — without the pager",
        summary: "SLOs, error budgets, blameless postmortems, automated runbooks. Reliability becomes engineering, not heroics.",
        glyph: "🛡",
        tags: ["SLOs", "Prometheus", "Grafana", "PagerDuty"],
        items: [
          { strong: "SLOs & Error Budgets", text: "Define what reliability means for each service, set realistic targets, and use error budgets to balance velocity vs stability." },
          { strong: "Observability Stack", text: "Prometheus metrics, Loki logs, Tempo traces, Grafana dashboards — all wired into PagerDuty/OpsGenie for actionable alerts." },
          { strong: "Incident Response & Runbooks", text: "Pre-built runbooks, automated remediation, and blameless postmortem culture that turns incidents into improvements." },
          { strong: "Performance & Cost Optimization", text: "Right-sizing, query optimization, caching strategies, and FinOps practices that cut cloud bills 30-50%." },
        ],
      },
    ],
    why: [
      { icon: "☁", title: "Multi-Cloud Expertise", desc: "Certified engineers across AWS, Azure, and GCP — we choose the right cloud per workload, not per vendor relationship." },
      { icon: "⚡", title: "Battle-Tested SRE", desc: "Practices drawn from Google's SRE handbook adapted for your business — reliability becomes engineering discipline." },
      { icon: "↗", title: "Cost Engineering", desc: "FinOps practices that have saved clients 30-50% on cloud bills without sacrificing performance or reliability." },
      { icon: "★", title: "Always-On Coverage", desc: "24/7 monitoring, on-call rotations, and incident response baked into every engagement — not an afterthought." },
    ],
    process: [
      { title: "Architecture Review & Roadmap", desc: "Audit existing infrastructure, identify reliability and cost gaps, design a phased roadmap aligned to business priorities." },
      { title: "Infrastructure-as-Code Build", desc: "Terraform / Pulumi modules, GitOps pipelines, observability stack — everything version-controlled and reproducible." },
      { title: "Migration & Cutover", desc: "Phased rollouts with traffic shifting, parallel run validation, and zero-downtime cutover for production workloads." },
      { title: "SRE Operations & Optimization", desc: "Ongoing 24/7 monitoring, capacity planning, cost optimization, and continuous reliability improvements." },
    ],
    ctaTitle: "Stop firefighting. <em>Start engineering reliability.</em>",
    ctaText: "Get a free cloud architecture review. We'll identify your top 3 reliability and cost-savings opportunities — with concrete next steps.",
    tagline: "Build. Scale. Operate. Without limits.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Cloud-Solutions-DevOps-Site-Reliability-Engineering.png",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/devops.avif",
      "https://vsolutionsinc.com/wp-content/uploads/2025/12/gdm.jpg",
    ],
    industries: ["Financial Services", "Healthcare", "E-commerce", "SaaS", "Manufacturing & IoT", "Media"],
    tech: [
      { n: "AWS" }, { n: "Azure" }, { n: "GCP" }, { n: "Kubernetes" },
      { n: "Terraform" }, { n: "Argo CD" }, { n: "Prometheus" }, { n: "Grafana" },
      { n: "Helm" }, { n: "Istio" }, { n: "GitHub Actions" }, { n: "Jenkins" },
    ],
    quote: {
      text: "A 6-week migration of our multi-tier app to Azure with zero data loss and zero rollback. The SRE handover was the most polished I've seen — runbooks, dashboards, and on-call paths ready on day one.",
      who: "Director of Platform Engineering",
      org: "Healthcare SaaS",
    },
    faqs: [
      { q: "Which cloud should we choose — AWS, Azure, or GCP?", a: "It depends on workload, existing tooling, and team skills. We run a workload-by-workload assessment and often recommend multi-cloud or hybrid architectures to avoid lock-in." },
      { q: "Can you reduce our existing cloud bill?", a: "Yes. Our FinOps engagements typically cut spend 30–50% through right-sizing, savings plans, spot/Reserved instances, storage tiering, and idle-resource cleanup — without performance regression." },
      { q: "Do you offer 24/7 SRE / managed services?", a: "Yes. We provide tier 1–3 on-call, SLA-backed monitoring, automated remediation, and quarterly reliability reviews. Most clients run with 99.99% achieved uptime." },
      { q: "How long does a typical migration take?", a: "Phase 1 (Discovery + Architecture) is usually 3–5 weeks. Production cutover ranges from 4–12 weeks depending on complexity, integrations, and downtime tolerance." },
    ],
  },

  cybersecurity: {
    slug: "cybersecurity",
    url: "/service/cybersecurity-application-security-testing/",
    name: "Cybersecurity & AppSec",
    pillIcon: "🛡︎",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "🛡",
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/cybersecurity-450x450.jpg",
    pill: "Cybersecurity · AppSec",
    title: "Protect what <em>powers your business</em>.",
    subhead: "Application security testing, penetration testing, threat modeling, and compliance frameworks built for modern enterprises.",
    lede: "A single breach costs an average of <strong>$4.45 million</strong>. Modern attackers move at machine speed — your defenses must move faster. We deliver <strong>SAST, DAST, SCA, penetration testing, threat modeling, and compliance assessments</strong> — turning security from a checkbox into a competitive advantage.",
    stats: [
      { num: "$4.45M", lbl: "Avg Breach Avoided" },
      { num: "24/7", lbl: "Threat Monitoring" },
      { num: "OWASP", lbl: "Top 10 Coverage" },
      { num: "SOC 2", lbl: "Audit-Ready" },
    ],
    tags: ["Pen-Testing", "SAST/DAST", "Threat Modeling", "SOC2", "GDPR", "Zero Trust"],
    introTitle: "Security <em>woven into</em> every layer.",
    introStat: {
      num: "100%",
      label: "OWASP Top 10",
      text: "Comprehensive coverage of OWASP Top 10 web vulnerabilities, plus emerging threats specific to your industry and tech stack.",
    },
    introBody:
      "<p>VSolutions Inc delivers comprehensive cybersecurity services that protect your applications, data, and infrastructure from evolving threats. Our security practice combines <strong>offensive security expertise (penetration testing, red teaming) with defensive engineering (SAST/DAST integration, threat modeling, secure architecture review)</strong> — covering the full lifecycle from design to production.</p><p>Whether you're preparing for SOC 2, ISO 27001, or HIPAA audits, hardening a SaaS platform, or responding to an active incident — our certified security engineers move fast and document everything. <strong>We don't just find vulnerabilities — we help your team understand them, fix them, and prevent them from recurring.</strong></p>",
    features: [
      {
        eyebrow: "Application Security",
        title: "Application <em>Security Testing</em>",
        summary: "SAST, DAST, IAST integrated into every CI/CD pipeline. Vulnerabilities caught before code reaches production.",
        glyph: "⊕",
        tags: ["SAST", "DAST", "SCA", "API Security"],
        items: [
          { strong: "Static Application Security Testing (SAST)", text: "Source code analysis integrated into your CI pipeline — catch vulnerabilities before code is merged." },
          { strong: "Dynamic Application Security Testing (DAST)", text: "Runtime testing against deployed apps to find real exploitable issues — not just theoretical CVEs." },
          { strong: "Software Composition Analysis (SCA)", text: "Identify vulnerable dependencies, license risks, and outdated libraries across your entire dependency tree." },
          { strong: "API Security Testing", text: "OpenAPI / GraphQL schema fuzzing, authentication testing, rate-limit validation, and injection testing." },
        ],
      },
      {
        eyebrow: "Penetration Testing",
        title: "Penetration <em>Testing & Red Team</em>",
        summary: "Manual pen-tests by certified ethical hackers. Find what scanners miss — before adversaries do.",
        glyph: "⌕",
        tags: ["OSCP", "CEH", "Web", "Network"],
        items: [
          { strong: "Web Application Penetration Testing", text: "Manual testing by certified ethical hackers (OSCP, CEH) — finding logic flaws, auth bypasses, and chained exploits scanners can't detect." },
          { strong: "Network Penetration Testing", text: "External and internal network testing — perimeter, segmentation, lateral movement, and privilege escalation paths." },
          { strong: "Cloud Configuration Audits", text: "AWS/Azure/GCP configuration reviews against CIS benchmarks — find misconfigurations that lead to data breaches." },
          { strong: "Red Team Engagements", text: "Adversary simulation campaigns testing your detection, response, and recovery capabilities under real-world conditions." },
        ],
      },
      {
        eyebrow: "Threat Modeling",
        title: "Threat <em>Modeling & Architecture</em>",
        summary: "Security designed in, not bolted on. STRIDE-based threat models for new and existing systems.",
        glyph: "◈",
        tags: ["STRIDE", "OCTAVE", "PASTA", "Trust Boundaries"],
        items: [
          { strong: "STRIDE Threat Modeling", text: "Systematic identification of Spoofing, Tampering, Repudiation, Information Disclosure, DoS, and Elevation threats." },
          { strong: "Secure Architecture Review", text: "Trust boundary analysis, attack surface mapping, and security control gap assessments for cloud architectures." },
          { strong: "Zero-Trust Implementation", text: "Identity-aware proxies, mTLS service mesh, principle of least privilege — security that survives perimeter compromise." },
          { strong: "DevSecOps Integration", text: "Embed security into every stage of the SDLC — from design reviews to automated testing to runtime protection." },
        ],
      },
      {
        eyebrow: "Compliance & Reporting",
        title: "Risk & <em>Compliance Frameworks</em>",
        summary: "SOC 2, ISO 27001, HIPAA, GDPR, PCI-DSS — preparation, evidence collection, and audit support.",
        glyph: "✎",
        tags: ["SOC 2", "ISO 27001", "HIPAA", "PCI", "GDPR"],
        items: [
          { strong: "Risk & Compliance Assessments", text: "Gap analysis against SOC 2, ISO 27001, HIPAA, PCI-DSS, GDPR — prioritized roadmap to compliance." },
          { strong: "Threat Mitigation Guidance", text: "Detailed remediation playbooks per finding — code-level fixes, configuration changes, and architectural recommendations." },
          { strong: "Detailed Security Reporting", text: "Executive summaries, technical deep-dives, CVSS-scored findings, and reproduction steps your engineers can act on." },
          { strong: "Incident Response Retainer", text: "Pre-arranged IR coverage so your team has expert help available within hours when an incident occurs." },
        ],
      },
    ],
    why: [
      { icon: "🛡", title: "Certified Security Engineers", desc: "OSCP, CEH, CISSP-certified team with deep expertise in offensive and defensive security — not generalists." },
      { icon: "⚡", title: "Speed Without Compromise", desc: "Security findings delivered in days, not weeks. Critical vulnerabilities flagged within 24 hours." },
      { icon: "↗", title: "Compliance Expertise", desc: "SOC 2, ISO 27001, HIPAA, PCI-DSS, GDPR — we've helped clients pass dozens of audits across industries." },
      { icon: "★", title: "Actionable Reports", desc: "Findings include reproduction steps, code-level fixes, and architectural recommendations — not vague checklists." },
    ],
    process: [
      { title: "Scoping & Threat Modeling", desc: "Map attack surface, identify trust boundaries, prioritize testing scope based on business risk and compliance needs." },
      { title: "Testing & Analysis", desc: "Combine automated scanning (SAST/DAST/SCA) with manual penetration testing to find both known and novel vulnerabilities." },
      { title: "Reporting & Remediation", desc: "Deliver CVSS-scored findings with code-level fixes, then partner with your engineers to verify remediation effectiveness." },
      { title: "Monitoring & Re-Testing", desc: "Continuous re-testing on every release, plus 24/7 threat monitoring and incident response retainer for ongoing coverage." },
    ],
    ctaTitle: "Find vulnerabilities <em>before attackers do.</em>",
    ctaText: "Free 30-minute security review of your application architecture. We'll identify your top 3 risk areas and recommend a clear path to fix them.",
    tagline: "Protect what powers your business.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/cybersecurity-450x450.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/11668583_20945597-1024x1024.jpg",
    ],
    industries: ["Financial Services", "Healthcare", "E-commerce", "SaaS", "Government", "Education", "Legal"],
    tech: [
      { n: "Checkmarx" }, { n: "Fortify" }, { n: "SonarQube" }, { n: "Veracode" },
      { n: "Semgrep" }, { n: "Burp Suite" }, { n: "OWASP ZAP" }, { n: "Acunetix" },
      { n: "Netsparker" }, { n: "Rapid7" }, { n: "Nessus" }, { n: "Metasploit" },
    ],
    quote: {
      text: "Their pen-test report was the most actionable we've ever received — every finding had reproduction steps, code-level fixes, and a CVSS score we could trust. We closed our SOC 2 audit two months ahead of schedule.",
      who: "CISO",
      org: "FinTech Platform",
    },
    faqs: [
      { q: "How is your pen-test different from automated scanners?", a: "Automated scanners catch ~30% of real vulnerabilities and miss almost all logic flaws. Our OSCP- and CEH-certified hackers chain exploits, escalate privileges, and find issues scanners simply cannot — auth bypasses, IDORs, race conditions, and business-logic abuse." },
      { q: "Do you help with SOC 2, ISO 27001, HIPAA, or PCI compliance?", a: "Yes. We run gap assessments, draft policies, build evidence repositories, and partner with auditors. We've helped clients pass SOC 2 Type II, ISO 27001, HIPAA, and PCI-DSS audits across multiple industries." },
      { q: "What do you deliver as a final report?", a: "Every engagement ends with an executive summary, a CVSS-scored technical report, code-level remediation guidance, video walkthroughs of critical findings, and a remediation re-test included." },
      { q: "Can you respond to an active incident?", a: "Yes. We offer Incident Response retainers — guaranteed response within hours, plus forensics, containment, eradication, and recovery support." },
    ],
  },

  web: {
    slug: "web",
    url: "/service/website-development-services-vsolutions-inc/",
    name: "Web Development",
    pillIcon: "⌬",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "⌬",
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Custom-Website-Design-Development-450x450.jpg",
    pill: "Web Engineering",
    title: "Modern, high-performance websites that <em>work as hard</em> as you do.",
    subhead: "Powerful digital assets engineered for speed, SEO, accessibility, and conversion.",
    lede: "We build <strong>fast, modern, SEO-optimized websites</strong> with Next.js, React, and headless architectures — including corporate sites, e-commerce platforms, membership portals, and progressive web apps. Sites that load in under a second, score 95+ on Lighthouse, and convert visitors into loyal customers.",
    stats: [
      { num: "95+", lbl: "Lighthouse Score" },
      { num: "<1s", lbl: "Time to Interactive" },
      { num: "3x", lbl: "Conversion Lift" },
      { num: "100%", lbl: "Mobile-First" },
    ],
    tags: ["Next.js", "React", "Headless CMS", "TypeScript", "Tailwind", "Vercel"],
    introTitle: "<em>Engineered</em> for performance and conversion.",
    introStat: {
      num: "95+",
      label: "Lighthouse Score",
      text: "Every site we build hits Lighthouse Performance, SEO, Accessibility, and Best Practices scores of 95+ on real-world hardware.",
    },
    introBody:
      "<p>Most agencies build pretty websites. We build <strong>websites that perform</strong>. Every page is engineered with Core Web Vitals as non-negotiables, semantic HTML for SEO and accessibility, and conversion paths designed from real user research — not just visual aesthetics.</p><p>Whether you need a high-converting marketing site, a SaaS product website with a complex admin dashboard, an e-commerce platform, or a content-rich publication, we deliver <strong>production-grade engineering with first-class developer experience for your team</strong> — so you can ship updates fast without breaking anything.</p>",
    features: [
      {
        eyebrow: "Custom Development",
        title: "Custom <em>Next.js & React</em> Builds",
        summary: "Server components, edge runtime, ISR — the modern web platform, used the way it was designed.",
        glyph: "⌬",
        tags: ["Next.js 15", "React 19", "TypeScript", "Edge"],
        items: [
          { strong: "Next.js 15 + App Router", text: "Server components, streaming, parallel data fetching, and edge runtime — the modern React stack at its peak." },
          { strong: "Headless CMS Integration", text: "Sanity, Contentful, Strapi, Payload — your content team gets a powerful editor while developers ship clean code." },
          { strong: "Type-Safe End-to-End", text: "TypeScript across frontend, API routes, database (Prisma), and tRPC — catch bugs at compile time, not in production." },
          { strong: "API Routes & Server Actions", text: "Full-stack apps with Next.js handles authentication, payments, AI features, and database operations natively." },
        ],
      },
      {
        eyebrow: "Performance",
        title: "Performance-First <em>Architecture</em>",
        summary: "Static generation, edge caching, image optimization, font subsetting. Sub-second loads everywhere.",
        glyph: "⚡",
        tags: ["Core Web Vitals", "CDN", "Edge", "Lazy Loading"],
        items: [
          { strong: "Core Web Vitals Optimization", text: "LCP < 2.5s, INP < 200ms, CLS < 0.1 — Google's ranking signals nailed on every page." },
          { strong: "Edge Caching & CDN", text: "Vercel, Cloudflare, or AWS CloudFront — pages served from the edge node closest to your visitor." },
          { strong: "Image & Asset Optimization", text: "AVIF/WebP, responsive sizing, blur placeholders, font subsetting — automatic via Next.js Image." },
          { strong: "ISR & On-Demand Revalidation", text: "Static performance with dynamic content — pages regenerate only when source data actually changes." },
        ],
      },
      {
        eyebrow: "SEO & Accessibility",
        title: "SEO & <em>Accessibility</em> Baked In",
        summary: "Semantic HTML, structured data, perfect Lighthouse scores. Built to rank and built for everyone.",
        glyph: "↗",
        tags: ["Schema.org", "WCAG 2.2 AA", "Sitemap", "OG"],
        items: [
          { strong: "Schema.org Structured Data", text: "JSON-LD for Article, Product, Organization, BreadcrumbList — rich results in Google search." },
          { strong: "Semantic HTML5", text: "Proper heading hierarchy, landmarks, ARIA where needed — Google bots and screen readers both happy." },
          { strong: "Mobile-First Responsive", text: "Designed mobile-first with breakpoints that work on every device — phones, tablets, foldables, desktops, and beyond." },
          { strong: "WCAG 2.2 AA Compliance", text: "Color contrast, keyboard navigation, focus management, and screen reader support — accessibility audits pass on every build." },
        ],
      },
      {
        eyebrow: "Conversion Engineering",
        title: "Conversion-Focused <em>Design</em>",
        summary: "Forms that convert, CTAs that compel, A/B tested funnels. Every pixel earns its place.",
        glyph: "◈",
        tags: ["A/B Testing", "Heatmaps", "Forms", "Funnels"],
        items: [
          { strong: "High-Converting Forms", text: "Multi-step forms with progress indicators, smart validation, and analytics tracking — conversion rates up 30-60%." },
          { strong: "A/B Testing Infrastructure", text: "Built-in experimentation framework with feature flags — test headlines, layouts, and CTAs without redeployment." },
          { strong: "Analytics & Heatmap Integration", text: "GA4, Plausible, Hotjar, Microsoft Clarity — understand exactly how users behave on every page." },
          { strong: "Funnel & Path Analysis", text: "Conversion path tracking from first touch through purchase — find drop-off points and fix them." },
        ],
      },
    ],
    why: [
      { icon: "⌬", title: "Modern React Stack", desc: "Next.js 15, React 19, TypeScript, and the latest tooling — your platform won't feel dated in two years." },
      { icon: "⚡", title: "Performance Obsessed", desc: "Every site we ship hits 95+ on Lighthouse Performance — no excuses, no compromises." },
      { icon: "↗", title: "SEO Native", desc: "Schema.org, sitemaps, semantic HTML, and Core Web Vitals all baked in — no SEO afterthoughts." },
      { icon: "★", title: "Owner-Friendly", desc: "Headless CMS, clear documentation, and developer experience your team can pick up — no agency lock-in." },
    ],
    process: [
      { title: "Discovery & Strategy", desc: "User research, competitor analysis, content audit, and conversion strategy — we design for outcomes, not just looks." },
      { title: "Design System & Prototypes", desc: "Figma design system, interactive prototypes, accessibility review, and stakeholder approval before code begins." },
      { title: "Development & Testing", desc: "Iterative builds with weekly demos, automated testing (unit + E2E), and Lighthouse CI on every pull request." },
      { title: "Launch & Ongoing Support", desc: "Phased rollout, performance monitoring, post-launch optimization, and 30-day post-launch support included." },
    ],
    ctaTitle: "Ready for a <em>website that performs?</em>",
    ctaText: "Free 30-minute consultation. We'll review your current site's performance, SEO, and conversion paths — with concrete recommendations.",
    tagline: "Powerful digital assets that ship and rank.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Custom-Website-Design-Development-450x450.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/AI-Enhanced-Website-Features-1.jpg",
    ],
    industries: ["SaaS", "E-commerce", "Healthcare", "Education", "Real Estate", "Hospitality", "Manufacturing"],
    tech: [
      { n: "Next.js 15" }, { n: "React 19" }, { n: "TypeScript" }, { n: "Tailwind" },
      { n: "Sanity" }, { n: "Contentful" }, { n: "Strapi" }, { n: "WordPress" },
      { n: "Shopify" }, { n: "WooCommerce" }, { n: "Vercel" }, { n: "Cloudflare" },
    ],
    quote: {
      text: "They rebuilt our marketing site on Next.js and our Lighthouse Performance went from 41 to 98. Time-to-first-byte under 200ms, organic traffic up 3x in six months. Best part: our content team can ship updates without a developer.",
      who: "Head of Growth",
      org: "B2B SaaS · Series B",
    },
    faqs: [
      { q: "How long does a typical website project take?", a: "Marketing sites: 6–10 weeks. Complex SaaS or e-commerce builds: 12–20 weeks. We work in 2-week iterative sprints with weekly demos so you see progress continuously." },
      { q: "Do you provide a CMS so our team can update content?", a: "Yes. We integrate headless CMS platforms (Sanity, Contentful, Strapi, Payload) or WordPress where appropriate — your editors get a powerful interface and developers ship clean, type-safe code." },
      { q: "Will the new site rank better in Google?", a: "Yes — when paired with content strategy. We bake in Core Web Vitals, schema.org, semantic HTML, and accessibility from day one, which Google rewards. Many clients see 2–3x organic traffic within 6 months." },
      { q: "Do you offer ongoing support after launch?", a: "Yes. Every project includes 30 days of post-launch support, and most clients sign on for monthly retainers covering performance monitoring, content updates, and feature additions." },
    ],
  },

  mobile: {
    slug: "mobile",
    url: "/service/mobile-application-development/",
    name: "Mobile App Development",
    pillIcon: "⊞",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "⊞",
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/Mobile-Application-Development-450x450.jpg",
    pill: "iOS · Android · Cross-Platform",
    title: "Build apps that <em>drive business forward</em>.",
    subhead: "From enterprise software to consumer mobile apps — engineered to delight users and accelerate growth.",
    lede: "We turn your vision into <strong>powerful, scalable applications</strong>. Native iOS in Swift, native Android in Kotlin, and cross-platform apps in React Native or Flutter — chosen per project to serve your users best. Backend integrations, offline-first sync, push notifications, and CI/CD baked in.",
    stats: [
      { num: "4.7★", lbl: "Avg App Rating" },
      { num: "iOS+", lbl: "Android Native" },
      { num: "<2s", lbl: "Cold Start" },
      { num: "CI/CD", lbl: "TestFlight Ready" },
    ],
    tags: ["Swift", "Kotlin", "React Native", "Flutter", "Firebase", "AWS Amplify"],
    introTitle: "Apps users <em>actually keep</em> on their home screen.",
    introStat: {
      num: "4.7★",
      label: "Avg Store Rating",
      text: "Apps we build and maintain consistently rank 4.5★ or higher on the App Store and Google Play — driven by performance and UX obsession.",
    },
    introBody:
      "<p>Most mobile apps get installed and never opened again. We build <strong>apps users actually keep on their home screen</strong> — fast cold starts, intuitive UX, offline-first reliability, and update flows that don't feel like a chore.</p><p>Whether you need a native iOS/Android app for maximum performance, a cross-platform React Native or Flutter build for budget efficiency, or a Progressive Web App as a step toward going fully native — we choose the right approach for your audience and ship apps that pass App Store and Google Play review on the first submission.</p>",
    features: [
      {
        eyebrow: "Native Development",
        title: "Native <em>iOS & Android</em>",
        summary: "Swift + SwiftUI for iOS. Kotlin + Jetpack Compose for Android. Maximum performance, platform-native UX.",
        glyph: "⊞",
        tags: ["Swift", "SwiftUI", "Kotlin", "Compose"],
        items: [
          { strong: "iOS Development (Swift / SwiftUI)", text: "Modern Swift apps with SwiftUI, Combine, and the full Apple ecosystem (HealthKit, ARKit, Core ML, Apple Pay)." },
          { strong: "Android Development (Kotlin / Compose)", text: "Kotlin + Jetpack Compose apps with full Material 3 support, WorkManager, and Google services integration." },
          { strong: "Native Performance", text: "60fps animations, sub-2s cold starts, optimized memory usage — apps that feel as fast as the platform best practices allow." },
          { strong: "Platform-Native UX", text: "iOS apps that feel like iOS apps. Android apps that feel like Android apps. No uncanny-valley cross-platform compromises." },
        ],
      },
      {
        eyebrow: "Cross-Platform",
        title: "Cross-Platform <em>with React Native or Flutter</em>",
        summary: "One codebase, two stores, 70% cost savings. When budget matters more than 60fps animations.",
        glyph: "◈",
        tags: ["React Native", "Flutter", "Expo", "Dart"],
        items: [
          { strong: "React Native + Expo", text: "JavaScript/TypeScript apps with native modules where needed — fast development, easy hiring, mature ecosystem." },
          { strong: "Flutter + Dart", text: "Pixel-perfect cross-platform apps with custom UI — when you need consistency across iOS, Android, web, and desktop." },
          { strong: "Shared Codebase Strategy", text: "70-90% code reuse between platforms while preserving native UX where it matters (navigation, lists, gestures)." },
          { strong: "OTA Updates with EAS / CodePush", text: "Push critical fixes to users in hours, not the App Store review cycle of days." },
        ],
      },
      {
        eyebrow: "UI/UX Design",
        title: "Intuitive <em>UI & UX Design</em>",
        summary: "iOS HIG, Material 3, and our own opinionated standards. Beautiful and accessible by default.",
        glyph: "✎",
        tags: ["Figma", "iOS HIG", "Material 3", "A11y"],
        items: [
          { strong: "User Research & Testing", text: "Interview real users, test prototypes, validate flows before code is written — design decisions backed by data, not guesses." },
          { strong: "Figma Design System", text: "Component libraries, design tokens, and prototypes that translate 1:1 to code — no design-to-dev surprises." },
          { strong: "Accessibility First", text: "Voice Over, TalkBack, dynamic type, color contrast — WCAG 2.2 AA compliant from the first build." },
          { strong: "Motion & Microinteractions", text: "Fluid animations, haptic feedback, and microinteractions that make apps feel alive — without distracting from the task." },
        ],
      },
      {
        eyebrow: "Backend & DevOps",
        title: "Backend, <em>APIs, and CI/CD</em>",
        summary: "Firebase, Supabase, AWS Amplify, or custom — plus Fastlane CI/CD that ships builds to TestFlight nightly.",
        glyph: "↗",
        tags: ["Firebase", "Supabase", "AWS", "Fastlane"],
        items: [
          { strong: "Backend & API Integration", text: "Firebase, Supabase, AWS Amplify, or custom Node/Go backends — auth, push notifications, real-time sync, and analytics." },
          { strong: "Offline-First Architecture", text: "Apps that work in airplane mode and sync seamlessly when reconnected — critical for field workers and travelers." },
          { strong: "CI/CD with Fastlane / EAS", text: "Automated builds, TestFlight deploys, Google Play uploads, screenshot generation — release cycle from days to hours." },
          { strong: "App Store Submission Support", text: "Review prep, metadata optimization, screenshot design, and reviewer response — first-submission approvals are our standard." },
        ],
      },
    ],
    why: [
      { icon: "⊞", title: "Right Stack Per Project", desc: "Native when performance matters, cross-platform when budget matters, PWA when SEO matters — we don't force one tool." },
      { icon: "⚡", title: "Performance Native", desc: "Sub-2s cold starts, 60fps animations, smooth scrolling — performance is not optional, it's the baseline." },
      { icon: "↗", title: "Store Approval First-Try", desc: "Deep familiarity with App Store and Google Play guidelines — we get apps approved on first submission, every time." },
      { icon: "★", title: "Long-Term Maintenance", desc: "Apps need OS updates twice a year — we build for maintainability and offer ongoing support contracts to keep things current." },
    ],
    process: [
      { title: "Discovery & Platform Strategy", desc: "User research, competitive analysis, native vs cross-platform decision, and feature prioritization based on business value." },
      { title: "Design & Prototyping", desc: "Figma design system, interactive prototypes tested with real users, accessibility review, and stakeholder sign-off." },
      { title: "Development & Testing", desc: "Iterative sprints, weekly TestFlight builds, automated unit + E2E tests, beta testing with real users before submission." },
      { title: "Launch & Continuous Improvement", desc: "App Store submission, launch monitoring, performance analytics, user feedback integration, and ongoing version updates." },
    ],
    ctaTitle: "Build the app <em>users can't live without.</em>",
    ctaText: "Free 30-minute strategy call. We'll review your concept, recommend the right tech stack, and outline a realistic timeline and budget.",
    tagline: "Apps that drive real business outcomes.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Mobile-Application-Development-450x450.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/02/mobile-app-development1-300x225.png",
    ],
    industries: ["FinTech & Banking", "Healthcare & MedTech", "E-commerce", "Logistics", "Real Estate", "Education", "Hospitality", "IoT"],
    tech: [
      { n: "Swift" }, { n: "SwiftUI" }, { n: "Kotlin" }, { n: "Jetpack Compose" },
      { n: "React Native" }, { n: "Flutter" }, { n: "Expo" }, { n: "Firebase" },
      { n: "Supabase" }, { n: "AWS Amplify" }, { n: "Fastlane" }, { n: "TestFlight" },
    ],
    quote: {
      text: "Both our iOS and Android apps were approved on first submission, with 4.8★ average reviews after 3 months. The offline-first architecture has saved us countless support tickets from field teams.",
      who: "VP, Field Operations",
      org: "Logistics & Supply Chain",
    },
    faqs: [
      { q: "Native or cross-platform — which is right for us?", a: "Native (Swift + Kotlin) is best when you need maximum performance, deep platform integrations, or platform-specific UX. Cross-platform (React Native or Flutter) is best when budget, time-to-market, or shared codebase economics matter more. We help you decide in week 1." },
      { q: "Will my app pass App Store and Google Play review?", a: "Yes — first-submission approval is our standard. We know the guidelines deeply, prep metadata and screenshots professionally, and pre-test against rejection patterns." },
      { q: "Do you handle the backend, push notifications, and analytics?", a: "Yes. We build full-stack — Firebase, Supabase, AWS Amplify, or custom Node/Go backends. Push, real-time sync, analytics, and crash reporting are part of every engagement." },
      { q: "How do you handle ongoing maintenance and OS updates?", a: "iOS and Android ship a major OS update each year. We offer maintenance retainers that cover SDK updates, security patches, OS compatibility, and feature work — so your app stays current with no surprises." },
    ],
  },

  marketing: {
    slug: "marketing",
    url: "/service/digital-marketing/",
    name: "Digital Marketing",
    pillIcon: "⚡︎",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "⚡",
    image: "https://vsolutionsinc.com/wp-content/uploads/2020/03/dmhome-450x450.jpg",
    pill: "AI-Enhanced · Growth Marketing",
    title: "Smarter marketing, <em>bigger results</em> — AI does the heavy lifting.",
    subhead: "AI-enhanced SEO, paid media, social, and conversion optimization — propelling your business forward in 2026 and beyond.",
    lede: "We balance <strong>AI efficiency</strong> (data analysis, optimization, automation) with <strong>human creativity</strong> (strategy, empathy, brand voice). Performance media buying, Generative Engine Optimization (GEO), content engineering, and conversion rate optimization — every dollar tracked, every campaign optimized in real-time.",
    stats: [
      { num: "312%", lbl: "Avg ROI" },
      { num: "300%", lbl: "Traffic Growth" },
      { num: "4.5x", lbl: "ROAS" },
      { num: "24/7", lbl: "Campaign Optimization" },
    ],
    tags: ["SEO", "PPC", "Meta Ads", "Content", "Email", "Analytics"],
    introTitle: "<em>Real growth.</em> Real numbers.",
    introStat: {
      num: "312%",
      label: "ROI Delivered",
      text: "Inspired Infotech case study: 312% ROI from a single SEO + content marketing engagement over 6 months.",
    },
    introBody:
      "<p>Most agencies sell impressions, clicks, and \"engagement\". We sell <strong>pipeline, revenue, and customer LTV</strong>. Every campaign we run is tied to a measurable business outcome with full-funnel attribution — from the first ad impression to the closed deal.</p><p>Our AI-driven approach combines <strong>data engineering, predictive analytics, automated bid management, and AI-powered content generation</strong> with the strategic insight of senior marketers — so your campaigns optimize themselves 24/7 while humans focus on creative and strategic work.</p>",
    features: [
      {
        eyebrow: "SEO & Organic Growth",
        title: "SEO & <em>Organic Growth</em>",
        summary: "Technical SEO, content engineering, link building, AI search optimization. The full organic acquisition stack.",
        glyph: "⌕",
        tags: ["Technical", "On-Page", "Content", "AI Search"],
        items: [
          { strong: "Technical SEO Audits", text: "Core Web Vitals, crawlability, indexation, schema markup, internal linking — fix the foundation before content efforts." },
          { strong: "Keyword Strategy & Content Engineering", text: "Topic clusters, search intent analysis, content gaps — content built to rank for queries your customers actually use." },
          { strong: "AI Search Optimization (LLMO)", text: "Optimize for Perplexity, ChatGPT Search, Google AI Overviews — get cited where buyers research in 2026." },
          { strong: "Link Building & Digital PR", text: "Editorial outreach, guest posting, broken link building, brand mentions — DR/DA growth without spammy networks." },
        ],
      },
      {
        eyebrow: "Paid Media",
        title: "Performance <em>Paid Media</em>",
        summary: "Google, Meta, LinkedIn, YouTube — managed by humans, optimized by AI. ROAS positive in 60 days.",
        glyph: "↗",
        tags: ["Google Ads", "Meta", "LinkedIn", "YouTube"],
        items: [
          { strong: "Google Ads (Search, Performance Max, YouTube)", text: "Full Google ecosystem coverage with cross-channel attribution and AI-driven bid management." },
          { strong: "Meta Ads (Facebook & Instagram)", text: "Advantage+ campaigns, custom audiences, lookalikes, and creative testing infrastructure for scaled performance." },
          { strong: "LinkedIn Ads (B2B Focus)", text: "Account-based marketing, lead gen forms, conversation ads, and InMail sequences for B2B pipeline." },
          { strong: "Conversion API & Server-Side Tracking", text: "Bypass iOS 14.5+ tracking limits with first-party data and server-side conversion tracking — full attribution restored." },
        ],
      },
      {
        eyebrow: "Content & Email",
        title: "Content <em>Engineering & Email</em>",
        summary: "Content that ranks, converts, and earns links. Email flows that recover abandoned carts and nurture leads.",
        glyph: "✎",
        tags: ["Blog", "Whitepapers", "Email", "Lifecycle"],
        items: [
          { strong: "Editorial Content Strategy", text: "Pillar pages, supporting content, content calendars — built to rank and to be shared, not just published." },
          { strong: "AI-Augmented Writing", text: "Senior writers + AI augmentation = scaled content output without sacrificing quality or factual accuracy." },
          { strong: "Lifecycle Email Marketing", text: "Welcome series, abandoned cart, re-engagement, post-purchase, churn prevention — Klaviyo, Mailchimp, or HubSpot." },
          { strong: "Lead Magnets & Funnels", text: "Whitepapers, calculators, mini-courses, free tools — high-converting magnets that build pipeline at the top of funnel." },
        ],
      },
      {
        eyebrow: "Analytics & CRO",
        title: "Analytics & <em>Conversion Rate Optimization</em>",
        summary: "Full-funnel attribution, A/B testing, heatmaps, funnel analysis. Data-driven decisions, not guesses.",
        glyph: "◈",
        tags: ["GA4", "Looker", "Hotjar", "A/B"],
        items: [
          { strong: "Full-Funnel Analytics Setup", text: "GA4, Looker Studio, server-side tracking, BigQuery — clean data architecture you can actually trust." },
          { strong: "A/B Testing Infrastructure", text: "Headlines, layouts, CTAs, pricing pages — experimentation framework that runs continuous tests." },
          { strong: "Heatmaps & Session Recording", text: "Hotjar, Microsoft Clarity, Mouseflow — see exactly how users interact with your site, find friction, fix it." },
          { strong: "Multi-Touch Attribution", text: "Move beyond last-click — understand the full customer journey and allocate spend to channels that actually drive revenue." },
        ],
      },
    ],
    why: [
      { icon: "⚡", title: "Revenue-Focused, Not Vanity", desc: "Every campaign tied to a real business KPI — pipeline, MRR, LTV, ROAS. Not just clicks and impressions." },
      { icon: "↗", title: "Real Results", desc: "312% ROI for Inspired Infotech. 300% traffic growth for HinduTone. Case studies you can verify." },
      { icon: "◈", title: "Full-Stack Marketing", desc: "SEO + Paid + Content + Email + Analytics + CRO — one team owning the full funnel, no handoff gaps." },
      { icon: "★", title: "AI-Native Operations", desc: "AI tools embedded in every workflow — bid management, content generation, audience modeling, attribution — running 24/7." },
    ],
    process: [
      { title: "Audit & Benchmark", desc: "Comprehensive audit of current channels, attribution accuracy, content gaps, and competitor positioning." },
      { title: "Strategy & Roadmap", desc: "90-day strategy with channel mix, KPI targets, content calendar, and budget allocation tied to business outcomes." },
      { title: "Execute & Optimize", desc: "Campaigns launched in week 2, AI-driven optimization runs 24/7, weekly reporting cadence for transparency." },
      { title: "Scale & Iterate", desc: "Quarterly business reviews, channel expansion, creative refreshes, and continuous optimization toward bigger goals." },
    ],
    ctaTitle: "Stop guessing. <em>Start scaling.</em>",
    ctaText: "Free 30-minute marketing audit. We'll review your current channels, show you the biggest revenue opportunities, and recommend a 90-day plan.",
    tagline: "AI efficiency. Human creativity. Measurable growth.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2020/03/dmhome-450x450.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Advanced-AI-Enhanced-SEO-Services.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/AI-Driven-Social-Media-Marketing.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Call_to_Actions1.png",
    ],
    industries: ["SaaS & Tech", "E-commerce", "Healthcare", "B2B Services", "Education", "Real Estate", "Financial Services"],
    tech: [
      { n: "Google Ads" }, { n: "Meta Ads" }, { n: "LinkedIn Ads" }, { n: "TikTok Ads" },
      { n: "GA4" }, { n: "Looker Studio" }, { n: "BigQuery" }, { n: "HubSpot" },
      { n: "Salesforce" }, { n: "Klaviyo" }, { n: "Hotjar" }, { n: "Semrush" },
    ],
    quote: {
      text: "312% ROI from a single SEO + content engagement in 6 months. Their AI-augmented workflow lets us publish 3x the volume at higher quality — and the team feels like an extension of ours, not an outside vendor.",
      who: "Founder & CEO",
      org: "Inspired Infotech",
    },
    faqs: [
      { q: "How is AI-Enhanced marketing different from traditional digital marketing?", a: "Traditional teams optimize manually on weekly cadences. Our AI-enhanced workflows run optimization 24/7 — bid adjustments, creative testing, audience expansion, and budget reallocation happen continuously. Humans focus on strategy, creative, and brand." },
      { q: "What is Generative Engine Optimization (GEO)?", a: "GEO is optimizing your content to be cited by AI search engines (ChatGPT Search, Perplexity, Google AI Overviews, Bing Copilot). We adapt your content structure, citations, and entity signals so you get cited where buyers research in 2026." },
      { q: "How quickly will we see results?", a: "Paid media campaigns are usually ROAS-positive within 60–90 days. SEO compounds slower — most clients see meaningful organic traffic lift in months 4–6 and major ranking gains in months 6–12." },
      { q: "Do you offer transparent reporting?", a: "Yes. Real-time dashboards in Looker Studio, weekly performance summaries, and monthly business reviews tied to pipeline, revenue, and customer LTV — not vanity metrics." },
    ],
  },

  vdi: {
    slug: "vdi",
    url: "/service/vdi-endpoint-management-services/",
    name: "VDI & Endpoint",
    pillIcon: "⌂",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "⌂",
    image: "https://vsolutionsinc.com/wp-content/uploads/2020/03/aisolutions-450x450.png",
    pill: "VDI · Endpoint Management",
    title: "Secure, scalable virtual workspaces for the <em>hybrid workforce</em>.",
    subhead: "High-performance VDI across Azure Virtual Desktop, VMware Horizon, Citrix, and Microsoft Intune.",
    lede: "We design, deploy, manage, and optimize <strong>enterprise-grade VDI and endpoint management platforms</strong> across <strong>Azure Virtual Desktop, VMware Horizon, Citrix Virtual Apps & Desktops, and Microsoft Intune</strong> — with end-to-end expertise ensuring seamless user experiences and robust zero-trust security.",
    stats: [
      { num: "10K+", lbl: "Endpoints Managed" },
      { num: "Zero", lbl: "Trust Default" },
      { num: "24/7", lbl: "Helpdesk Coverage" },
      { num: "5min", lbl: "Avg Provision Time" },
    ],
    tags: ["Citrix", "VMware Horizon", "Azure AVD", "Intune", "Jamf", "BYOD"],
    introTitle: "The hybrid workforce <em>built right.</em>",
    introStat: {
      num: "10K+",
      label: "Endpoints Managed",
      text: "We currently manage 10,000+ endpoints across enterprise clients with 99.9% uptime and 5-minute average provision time.",
    },
    introBody:
      "<p>Hybrid work is not a temporary trend — it's the new operating model. But most organizations have <strong>VDI deployed badly</strong>: slow logins, frustrated users, security gaps, and infrastructure costs that spiral out of control. We fix that.</p><p>Whether you're standing up your first VDI environment, modernizing a legacy Citrix farm, migrating to Azure Virtual Desktop, or rolling out unified endpoint management across 10,000+ devices — our team brings deep expertise across <strong>Citrix DaaS, VMware Horizon, Microsoft AVD, Intune, Jamf Pro, and zero-trust networking</strong>.</p>",
    features: [
      {
        eyebrow: "Virtual Desktops",
        title: "Virtual <em>Desktop Infrastructure</em>",
        summary: "Citrix DaaS, VMware Horizon, Azure AVD — designed, deployed, and operated by certified architects.",
        glyph: "⌂",
        tags: ["Citrix DaaS", "VMware Horizon", "Azure AVD", "AppStream"],
        items: [
          { strong: "Citrix DaaS / CVAD Deployments", text: "Citrix Virtual Apps & Desktops (CVAD), Citrix DaaS, App Layering — full-stack Citrix expertise from architecture to operations." },
          { strong: "VMware Horizon Implementation", text: "Horizon 8, Horizon Cloud on Azure, Workspace ONE — designed for performance and scale." },
          { strong: "Microsoft Azure Virtual Desktop (AVD)", text: "Modern AVD deployments with FSLogix profiles, MSIX app attach, and integration with Microsoft Entra ID." },
          { strong: "Amazon WorkSpaces / AppStream 2.0", text: "AWS-native virtual desktop and application streaming for clients standardized on AWS." },
        ],
      },
      {
        eyebrow: "Endpoint Management",
        title: "Unified <em>Endpoint Management</em>",
        summary: "Intune, Jamf, MDM, BYOD — manage every device in your fleet from one console.",
        glyph: "⊞",
        tags: ["Intune", "Jamf", "BYOD", "COPE"],
        items: [
          { strong: "Microsoft Intune Deployment", text: "Windows, macOS, iOS, Android — full unified endpoint management with conditional access and compliance policies." },
          { strong: "Jamf Pro for Apple Fleets", text: "Mac, iPhone, iPad management at scale — zero-touch DEP enrollment, app catalogs, and Apple Business Manager integration." },
          { strong: "Mobile Device Management (MDM)", text: "BYOD, COPE, COBO scenarios — separate work and personal data while preserving employee privacy." },
          { strong: "Patch Management & Compliance", text: "Automated OS patching, application updates, configuration drift detection, and compliance reporting." },
        ],
      },
      {
        eyebrow: "Secure Access",
        title: "Secure <em>Remote Access</em>",
        summary: "Zero-trust network access (ZTNA), MFA, conditional access. Replace VPNs with modern identity-aware proxies.",
        glyph: "🛡",
        tags: ["ZTNA", "MFA", "SSO", "Conditional Access"],
        items: [
          { strong: "Zero Trust Network Access (ZTNA)", text: "Replace legacy VPN with identity-aware proxies — Cloudflare Access, Zscaler, Netskope, Citrix Secure Private Access." },
          { strong: "Multi-Factor Authentication (MFA)", text: "Phishing-resistant MFA with hardware keys (YubiKey), passkeys, and FIDO2 — eliminate password attack vectors." },
          { strong: "Conditional Access Policies", text: "Risk-based access decisions: allow only if device is compliant, location is trusted, and behavior is normal." },
          { strong: "Single Sign-On (SSO)", text: "Microsoft Entra ID, Okta, Google Workspace — one identity, every application, full audit trail." },
        ],
      },
      {
        eyebrow: "Operations",
        title: "Ongoing <em>Operations & Support</em>",
        summary: "24/7 monitoring, helpdesk, patch management. White-glove operations so your IT team can focus on strategy.",
        glyph: "↗",
        tags: ["Monitoring", "Helpdesk", "Patching", "Backup"],
        items: [
          { strong: "24/7 Monitoring & Alerting", text: "ControlUp, Citrix Director, eG Innovations — proactive monitoring with SLA-backed response times." },
          { strong: "Tier 1-3 Helpdesk Coverage", text: "White-label helpdesk for end-user issues — your employees get help, your IT team focuses on strategic work." },
          { strong: "Patch & Update Management", text: "Coordinated patching of host servers, gold images, applications, and endpoints — minimal user disruption." },
          { strong: "Backup & Disaster Recovery", text: "Image-level backups, profile data protection, and tested DR runbooks for VDI continuity in any scenario." },
        ],
      },
    ],
    why: [
      { icon: "⌂", title: "Multi-Vendor Expertise", desc: "Citrix CCE, VMware VCP, Microsoft MCSE certifications — deep experts across every major VDI platform." },
      { icon: "🛡", title: "Security-First Architecture", desc: "Zero-trust networking, phishing-resistant MFA, conditional access — security baked into every deployment." },
      { icon: "⚡", title: "Performance-Tuned", desc: "FSLogix profiles, GPU acceleration, login optimization — sub-30s logins even for power users with heavy app loads." },
      { icon: "★", title: "White-Glove Operations", desc: "24/7 monitoring, tier 1-3 helpdesk, patch management — your IT team can finally focus on strategic projects." },
    ],
    process: [
      { title: "Assessment & Architecture", desc: "Workload analysis, user persona mapping, capacity planning, and platform selection (Citrix vs VMware vs AVD)." },
      { title: "Design & Pilot", desc: "Reference architecture, gold image creation, profile management strategy, and pilot deployment with 50-100 users." },
      { title: "Rollout & Migration", desc: "Phased rollout to all users, training enablement, helpdesk preparation, and decommissioning of legacy infrastructure." },
      { title: "Operations & Optimization", desc: "24/7 monitoring, ongoing helpdesk, capacity scaling, performance tuning, and continuous platform improvements." },
    ],
    ctaTitle: "Modernize your <em>workforce experience.</em>",
    ctaText: "Free 30-minute VDI architecture review. We'll assess your current setup and recommend the right modernization path — Citrix, VMware, AVD, or hybrid.",
    tagline: "High-performance virtual workspaces. Anywhere. Anytime.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2020/03/Secure-Virtual-Desktop-Infrastructure-VDI-Hosting-Solutions.png",
      "https://vsolutionsinc.com/wp-content/uploads/2020/03/aisolutions-450x450.png",
    ],
    industries: ["Financial Services", "Healthcare", "Government", "Education", "Legal", "Insurance", "Defense"],
    tech: [
      { n: "Azure AVD" }, { n: "Windows 365" }, { n: "VMware Horizon" }, { n: "vSphere" },
      { n: "Citrix DaaS" }, { n: "Citrix CVAD" }, { n: "Microsoft Intune" }, { n: "Jamf Pro" },
      { n: "FSLogix" }, { n: "MSIX App Attach" }, { n: "Workspace ONE" }, { n: "Entra ID" },
    ],
    quote: {
      text: "They migrated 4,000 endpoints to Azure Virtual Desktop in 11 weeks with zero data loss. Login times dropped from 90 seconds to 22, and our helpdesk tickets fell 60% in the first quarter.",
      who: "CIO",
      org: "Healthcare Network",
    },
    faqs: [
      { q: "Should we use Citrix, VMware Horizon, or Azure Virtual Desktop?", a: "Citrix excels at heavy-duty graphics and complex multi-tenant scenarios. VMware Horizon shines for hybrid cloud and existing vSphere shops. AVD is the best fit for Microsoft 365–first organizations and tight Azure integration. We help you choose based on workload, identity, and existing investments." },
      { q: "Can VDI handle GPU-intensive workloads (CAD, video, AI)?", a: "Yes. We deploy NVIDIA GRID and AMD MxGPU configurations on AVD, Horizon, and Citrix to support 3D CAD, video editing, and AI/ML workstation use cases with native-feel performance." },
      { q: "How does Microsoft Intune fit into VDI?", a: "Intune complements VDI by managing physical endpoints (laptops, mobile, BYOD) alongside virtual desktops. We unify policy, compliance, conditional access, and software delivery across both — a single pane of glass for IT." },
      { q: "Do you offer 24/7 managed support after deployment?", a: "Yes. Most clients run on managed services covering monitoring, patching, capacity scaling, image lifecycle, helpdesk tier 1–3, and quarterly health reviews." },
    ],
  },

  content: {
    slug: "content",
    url: "/service/content-writing/",
    name: "Content Writing",
    pillIcon: "✎︎",
    accent: "#1A4D8C",
    accent2: "#3FB8D4",
    accentGlow: "rgba(30,136,184,.22)",
    glyph: "✎",
    image: "https://vsolutionsinc.com/wp-content/uploads/2026/01/content-writing-450x450.jpg",
    pill: "Editorial · SEO Content",
    title: "Words that work. <em>Stories that sell.</em>",
    subhead: "Content that drives action, builds authority, and fuels measurable growth.",
    lede: "We craft content that <strong>does more than fill pages</strong> — it ranks in search, earns links, and converts readers into pipeline. Senior writers, AI augmentation, and editorial rigor — for blogs, whitepapers, technical docs, landing pages, email sequences, and beyond.",
    stats: [
      { num: "200+", lbl: "Articles Published" },
      { num: "3.2x", lbl: "Engagement Lift" },
      { num: "#1", lbl: "Avg SERP Position" },
      { num: "E-E-A-T", lbl: "Native" },
    ],
    tags: ["SEO Writing", "Whitepapers", "Blog", "Technical Docs", "Email", "Landing Pages"],
    introTitle: "Content that earns <em>attention and links.</em>",
    introStat: {
      num: "3.2x",
      label: "Avg Engagement",
      text: "Content we publish averages 3.2x the engagement and time-on-page vs industry benchmarks — backed by editorial craft and SEO precision.",
    },
    introBody:
      "<p>Most agencies treat content as a commodity — quantity over quality, keyword-stuffed posts written by generalists, then abandoned the day after publication. We treat content as a <strong>strategic business asset</strong>: every piece is researched, written, edited, optimized, and tracked against pipeline outcomes.</p><p>Our writers are <strong>senior tech and business journalists</strong>, augmented (not replaced) by AI for research and ideation. Every article passes editorial review, fact-checking, SEO optimization, and quality scoring before publication. Result: content that ranks, earns links, and actually drives revenue.</p>",
    features: [
      {
        eyebrow: "SEO Content",
        title: "SEO-Optimized <em>Blog & Articles</em>",
        summary: "Topic clusters, keyword strategy, search intent analysis. Content built to rank and to be useful.",
        glyph: "⌕",
        tags: ["Topic Clusters", "Search Intent", "E-E-A-T", "Schema"],
        items: [
          { strong: "Keyword Research & Topic Clusters", text: "Pillar pages and supporting content built around topic clusters that establish topical authority in your niche." },
          { strong: "Search Intent Optimization", text: "Match informational, navigational, transactional, and commercial intent — content that actually answers the query." },
          { strong: "E-E-A-T Compliance", text: "Experience, Expertise, Authority, Trust signals throughout — author bylines, citations, fact-checking, expert quotes." },
          { strong: "On-Page SEO Excellence", text: "Title tags, meta descriptions, H1-H6 hierarchy, internal linking, schema markup — full technical optimization on every piece." },
        ],
      },
      {
        eyebrow: "Long-Form Content",
        title: "Whitepapers, <em>eBooks & Reports</em>",
        summary: "High-quality long-form lead magnets that establish thought leadership and capture qualified pipeline.",
        glyph: "📑",
        tags: ["Whitepapers", "eBooks", "Industry Reports", "Lead Magnets"],
        items: [
          { strong: "Industry Whitepapers", text: "5,000-15,000 word research-driven whitepapers with original survey data, expert interviews, and visual data presentations." },
          { strong: "eBook & Guide Production", text: "Multi-chapter ebooks designed as gated lead magnets — strategic content that builds authority while capturing leads." },
          { strong: "Original Research & Surveys", text: "Conduct primary research, run industry surveys, analyze data — produce original insights other publications will cite and link." },
          { strong: "Designer Collaboration", text: "Editorial paired with our design team — every long-form piece gets custom illustrations, charts, and pull-quotes." },
        ],
      },
      {
        eyebrow: "Technical & B2B",
        title: "Technical <em>Documentation & B2B</em>",
        summary: "Developer docs, API references, B2B case studies, technical blog posts. Written by engineers who can write.",
        glyph: "⌬",
        tags: ["Dev Docs", "API", "Case Studies", "B2B"],
        items: [
          { strong: "Developer Documentation", text: "API references, SDK guides, tutorials, code samples — clear, accurate, and tested by senior engineers." },
          { strong: "Technical Blog Posts", text: "Deep technical content on AI, cloud, security, DevOps — written by engineers who can also write, not the other way around." },
          { strong: "B2B Case Studies", text: "Customer success stories that aren't fluff — concrete numbers, real challenges, technical depth, and quotable insights." },
          { strong: "Comparison & Pillar Pages", text: "High-converting \"X vs Y\" comparison pages, alternatives pages, and ultimate guides — top-of-funnel SEO workhorses." },
        ],
      },
      {
        eyebrow: "Conversion Copy",
        title: "Landing Pages, <em>Email & Ad Copy</em>",
        summary: "High-converting copy for paid landing pages, drip emails, ad creative, and sales sequences.",
        glyph: "↗",
        tags: ["Landing Pages", "Email Sequences", "Ad Copy", "Sales"],
        items: [
          { strong: "Landing Page Copywriting", text: "High-converting page structure, headline frameworks, social proof integration, and CTA optimization for paid traffic." },
          { strong: "Email Sequences & Newsletters", text: "Welcome flows, nurture campaigns, product launches, weekly newsletters — written to be opened and acted on." },
          { strong: "Ad Copy & Creative Briefs", text: "Google Ads, Meta Ads, LinkedIn — copy variations for testing, paired with creative briefs for designers and video editors." },
          { strong: "Sales Enablement Content", text: "Pitch decks, one-pagers, battle cards, ROI calculators — content that helps your sales team close more deals." },
        ],
      },
    ],
    why: [
      { icon: "✎", title: "Senior Writers Only", desc: "Every writer is a senior journalist or domain expert with 5+ years experience — no junior content mills, no generic copy." },
      { icon: "⌕", title: "SEO-Native", desc: "Every piece optimized for search from the first draft — keyword research, search intent, E-E-A-T, schema all baked in." },
      { icon: "↗", title: "Pipeline-Tied Metrics", desc: "Content ROI tracked from organic impressions through pipeline-attributed revenue — not vanity engagement scores." },
      { icon: "★", title: "AI-Augmented Workflows", desc: "AI handles research, ideation, and first drafts — humans handle strategy, fact-checking, voice, and editorial judgment." },
    ],
    process: [
      { title: "Strategy & Audit", desc: "Content audit, keyword opportunity analysis, competitive gap analysis, and content calendar for the next 90 days." },
      { title: "Research & Outline", desc: "Deep research, expert interviews, primary data gathering, and detailed outlines reviewed before drafting begins." },
      { title: "Draft, Edit & Optimize", desc: "Senior writer drafts, editor reviews for voice and accuracy, SEO optimization pass, and visual elements added." },
      { title: "Publish, Promote & Measure", desc: "Publication coordinated with social, email, and paid promotion; performance tracked against pipeline metrics monthly." },
    ],
    ctaTitle: "Content that <em>actually drives revenue.</em>",
    ctaText: "Free 30-minute content audit. We'll analyze your current content performance, identify ranking opportunities, and recommend a 90-day editorial calendar.",
    tagline: "Words that work. Stories that sell.",
    gallery: [
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/content-writing-450x450.jpg",
      "https://vsolutionsinc.com/wp-content/uploads/2026/01/Advanced-AI-Enhanced-SEO-Services.jpg",
    ],
    industries: ["Technology & SaaS", "Healthcare", "Financial Services", "E-commerce", "B2B Services", "Education", "Real Estate"],
    tech: [
      { n: "WordPress" }, { n: "HubSpot" }, { n: "Webflow" }, { n: "Sanity" },
      { n: "Contentful" }, { n: "Semrush" }, { n: "Ahrefs" }, { n: "Surfer SEO" },
      { n: "Frase" }, { n: "Grammarly" }, { n: "Clearscope" }, { n: "Notion" },
    ],
    quote: {
      text: "Our blog went from 2,000 monthly visits to 47,000 in nine months. Their writers actually understand B2B SaaS — pieces ship with case studies, customer quotes, and original data. Real editorial craft, not template content.",
      who: "Director, Content Marketing",
      org: "B2B SaaS · Series C",
    },
    faqs: [
      { q: "How long does a typical blog post take?", a: "Standard SEO blog posts ship in 3–5 business days from brief approval. Long-form pieces (3,000+ words) take 7–10 days. Whitepapers and ebooks run 3–5 weeks depending on research depth." },
      { q: "Do you handle SEO research or do we provide keywords?", a: "Either way works. Most clients start with a topic-cluster strategy we develop using their seed topics + competitive analysis; some come with their own keyword lists and editorial calendars. We adapt to your workflow." },
      { q: "How do you ensure factual accuracy?", a: "Every piece passes a 3-step review: writer self-edit, editor review for voice and accuracy, and an SME (subject-matter expert) pass for technical pieces. Citations are required and verified." },
      { q: "Can you write technical documentation for developers?", a: "Yes. Our technical writers come from engineering backgrounds — API references, SDK guides, tutorials, and developer-experience copy that's clear, accurate, and tested in real terminals." },
    ],
  },
};
