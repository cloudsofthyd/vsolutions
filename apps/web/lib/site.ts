// Static site config — the data the public layout depends on.

export const SITE = {
  name: "V Solutions Inc",
  domain: "vsolutionsinc.com",
  description:
    "V Solutions Inc — North America's AI, cloud, cybersecurity, DevOps and digital marketing partner. Serving USA & Canada with custom web, mobile, VDI and SRE engineering.",
  defaultTitle:
    "V Solutions Inc — AI, Cloud, DevOps & Digital Marketing | USA & Canada",
  phone: "248-232-8488",
  phoneHref: "tel:2482328488",
  email: "info@vsolutionsinc.com",
  // Primary US HQ (kept under `address` for backwards-compat with Footer/Announce).
  address: {
    street: "100 West Big Beaver Rd",
    cityState: "Troy - MI - 48084",
    googleMapsUrl: "https://maps.google.com/?q=100+West+Big+Beaver+Rd+Troy+MI+48084",
  },
  offices: [
    {
      city: "Troy, Michigan",
      country: "United States",
      flag: "🇺🇸",
      lines: ["100 West Big Beaver Rd", "Troy, MI 48084"],
      mapUrl: "https://maps.google.com/?q=100+West+Big+Beaver+Rd+Troy+MI+48084",
      phone: "248-232-8488",
      phoneHref: "tel:+12482328488",
      tag: "Headquarters",
      timeZone: "America/Detroit",
      coords: { lat: 42.5803, lng: -83.1499 },
    },
    {
      city: "Hyderabad, Telangana",
      country: "India",
      flag: "🇮🇳",
      lines: [
        "Plot No.17-24, Flat No.403 A, 4th Floor",
        "Reliance Cyber Ville, Vittal Rao Nagar",
        "Madhapur, HITEC City, Hyderabad",
        "Telangana 500081",
      ],
      mapUrl:
        "https://maps.google.com/?q=Reliance+Cyber+Ville+Madhapur+HITEC+City+Hyderabad+500081",
      phone: null,
      phoneHref: null,
      tag: "Engineering Hub",
      timeZone: "Asia/Kolkata",
      coords: { lat: 17.4485, lng: 78.3908 },
    },
  ] as const,
  logoMain: "/uploads/2026/03/vsolutions-final.svg",
  logoFooter: "/uploads/2019/10/vsolutions-final_footer.png",
  social: {
    linkedin: "https://www.linkedin.com/company/vsolutionsinc",
    x: "https://x.com/Vsolutionsinc",
  },
} as const;

export const HEADER_NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about-v-solutions-inc/",
    children: [
      { label: "About V Solutions Inc", href: "/about-v-solutions-inc/" },
      { label: "V-Framework", href: "/about-v-solutions-inc/v-framework/" },
    ],
  },
  { label: "How we work", href: "/how-we-work/" },
  {
    label: "Services",
    href: "/service-overview/",
    children: [
      { label: "Artificial Intelligence", href: "/service/artificial-intelligence/" },
      { label: "Content Writing", href: "/service/content-writing/" },
      { label: "Cloud Solutions DevOps, SRE", href: "/service/cloud-devops-services/" },
      {
        label: "Cybersecurity Application Security Testing",
        href: "/service/cybersecurity-application-security-testing/",
      },
      { label: "Digital Marketing", href: "/service/digital-marketing/" },
      { label: "Mobile Application Development", href: "/service/mobile-application-development/" },
      { label: "VDI & Endpoint Management Services", href: "/service/vdi-endpoint-management-services/" },
      {
        label: "Website Development Services",
        href: "/service/website-development-services-vsolutions-inc/",
      },
    ],
  },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Careers", href: "/careers/" },
  { label: "Pricing", href: "/pricing/" },
] as const;

export const FOOTER_MENU = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-v-solutions-inc/" },
  { label: "How we work", href: "/how-we-work/" },
  { label: "Services", href: "/service-overview/" },
  { label: "Case Studies", href: "/case-study/" },
  { label: "Careers", href: "/careers/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Blog", href: "/blog-insights/" },
] as const;

export const FOOTER_SERVICES = [
  { label: "Artificial Intelligence", href: "/service/artificial-intelligence/" },
  { label: "Cloud DevOps & SRE", href: "/service/cloud-devops-services/" },
  { label: "Cybersecurity", href: "/service/cybersecurity-application-security-testing/" },
  { label: "Web Development", href: "/service/website-development-services-vsolutions-inc/" },
  { label: "Mobile Development", href: "/service/mobile-application-development/" },
  { label: "Digital Marketing", href: "/service/digital-marketing/" },
  { label: "VDI & Endpoint", href: "/service/vdi-endpoint-management-services/" },
] as const;

export const LEGAL_LINKS = [
  { label: "Terms and Conditions", href: "/terms-and-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Cookie Policy", href: "/cookie-policy-v-solutions-inc/" },
] as const;
