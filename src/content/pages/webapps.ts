/**
 * WEB DESIGN & DEVELOPMENT PAGE CONTENT — route /webapps/
 *
 * Every string transcribed verbatim from the Bricks export
 * (`Web Design & Development .json`, page ID 817), checked against
 * uploads/bricks/css/post-817.min.css. Source quirks are preserved unless
 * noted — two of them are already logged in PHASE-5 §10.
 *
 * The route/title mismatch is deliberate: /webapps/ renders a page titled
 * "Web Design & Development". See PHASE-4 §2.1.
 */

import type { IconName } from "@/components/primitives";

export const WEBAPPS_HERO = {
  eyebrow: "Web Development in Israel",
  heading: "Web Development for Your Small Businesses",
  body: "We specialize in creating professional, high-performance websites tailored to your business needs. Our expert team provides comprehensive website development services, ensuring your online presence is both impressive and functional.",
  cta: { label: "Schedule a Consultation", href: "/contact-us/" },
  image: {
    src: "/images/Web-Development-in-Israel.svg",
    alt: "Web development in Israel",
    width: 650,
    height: 434,
  },
} as const;

/* Section 2 — `.wd3-cards`, four tiles in a grid--auto-2. Each whole tile is a
   link to the quote form; absolute in the source, internal here. CHANGE #14. */
export const WEBAPPS_SERVICES = {
  heading: "Comprehensive Web Solutions for Your Business",
  body: "We offer a wide range of web design and development services to help you achieve your online goals.",
  cards: [
    {
      icon: "ion-ios-browsers" as IconName,
      title: "UI/UX Design",
      body: "We'll work with you to create a website that is both visually stunning and easy to use, with a focus on user experience and conversion.",
      href: "/quote/",
    },
    {
      icon: "ion-logo-html5" as IconName,
      title: "Website Design & Development",
      body: "Our team of experts will build a custom WordPress website that is tailored to your business needs, with a focus on speed, security, and scalability.",
      href: "/quote/",
    },
    {
      icon: "ion-ios-easel" as IconName,
      title: "Branding & Interactions",
      body: "We'll help you create a brand identity that reflects your business values and resonates with your target audience.",
      href: "/quote/",
    },
    {
      icon: "ion-ios-save" as IconName,
      title: "Website Maintenance",
      body: "Our team will ensure your website is always up-to-date, secure with regular maintenance and optimization improve performance and search engine rankings.",
      href: "/quote/",
    },
  ],
} as const;

/* Section 3 — `.industry-cards`, six numbered tiles in a grid--auto-3. */
export const WEBAPPS_INDUSTRIES = {
  heading: "Industries We Serve",
  body: "We work with a wide range of industries, providing custom website solutions that meet each sector’s specific needs.",
  cards: [
    {
      number: "01",
      title: "E-commerce",
      body: "We build secure and user-friendly e-commerce websites designed to boost sales.",
      href: "/quote/",
    },
    {
      number: "02",
      title: "Business Website",
      body: "Our business websites showcase your brand and drive conversions.",
      href: "/quote/",
    },
    {
      number: "03",
      title: "WordPress Website",
      body: "We create quality WordPress sites using popular page builders like Elementor and Bricks.",
      href: "/quote/",
    },
    {
      number: "04",
      title: "Brand Website",
      body: "Our brand websites create a strong image with visually stunning designs.",
      href: "/quote/",
    },
    {
      number: "05",
      title: "Lawyer Website",
      body: "We develop professional websites for law firms to strengthen their online presence.",
      href: "/quote/",
    },
    {
      number: "06",
      title: "Small Business Website",
      body: "Our websites for small businesses offer affordable, effective solutions to help you grow.",
      href: "/quote/",
    },
  ],
} as const;

/* Section 4 — copy on the left, a grid--auto-4 of six checkmarks on the right.
   "SEO-friendly websites" carries a trailing newline in the source; HTML
   collapses it. */
export const WEBAPPS_WHY_CHOOSE_US = {
  heading: "Why Choose Us?",
  body: "At Weiz Technologies, we’re dedicated to delivering top-tier website development services tailored to your business needs. Our expert team uses the latest technologies and efficient methods to create responsive, SEO-friendly websites optimized for conversions. We ensure your site looks great, runs smoothly, increases organic traffic, and boosts user engagement. With clear communication and competitive pricing, you can count on us to build a website that helps your business grow.",
  points: [
    "Responsive design",
    "Speed Optimized",
    "SEO-friendly websites",
    "Experienced team",
    "Conversion-focused sites",
    "Advanced technology",
  ],
} as const;

/**
 * Section 5 — `.demo-card`, six portfolio tiles.
 *
 * Every demo opens in a new tab: they are separate sites, and the source sets
 * `newTab: true` on the heading, body and "View Demo" links alike.
 *
 * OPEN: the "Gadget Store" tile is inconsistent in the source. Its heading and
 * View Demo link point at https://weiztech.org.il/, but its *body copy* links
 * to https://doc.weiztech.org.il/ — the medical demo. Carried as written on
 * the assumption the heading is right; flag if the body link should follow it.
 */
export const WEBAPPS_SHOWCASE = {
  heading: "Our Web Design Showcase",
  body: "Take a look at some of our latest web design projects that showcase our expertise and creativity.",
  cards: [
    {
      title: "Law Firm",
      body: "A professional website to make your law firm look good and attract clients.",
      image: "/images/Weiz.Law_.webp",
      href: "https://law.weiztech.org.il/",
    },
    {
      title: "Medical Website",
      body: "A website that looks good and will attract patients.",
      image: "/images/Weiz.doc.webp",
      href: "https://doc.weiztech.org.il/",
    },
    {
      title: "Sports Gym",
      body: "A modern website for your gym that looks good on all devices. You can also sell things through it.",
      image: "/images/weiz.gym_.webp",
      href: "https://gym.weiztech.org.il/",
    },
    {
      title: "Gadget Store",
      body: "A website that looks good and is easy to use.",
      image: "/images/Gadgests.webp",
      href: "https://weiztech.org.il/",
    },
    {
      title: "Fashion Designer - BOYA",
      body: "A beautiful website that is easy to use and has special features.",
      image: "/images/Boya-Hodaya.webp",
      href: "https://boya-hodya.com/",
    },
    {
      title: "Sports Store",
      body: "A website to sell sports equipment. You can use this design for other things too.",
      image: "/images/Weiz.shop_.webp",
      href: "https://shop.weiztech.org.il/",
    },
  ],
  demoLabel: "View Demo",
} as const;

/* Section 6 — the NextBricks timeline. Five steps; the numbering is part of
   each heading in the source, not generated. */
export const WEBAPPS_PROCESS = {
  heading: "Our Development Process",
  body: "Our development process is designed to ensure your website is built efficiently and accurately, meeting all your requirements and delivering results that exceed expectations.",
  steps: [
    {
      title: "1. Initial Consultation",
      body: "We start by understanding your needs and goals. This consultation helps us tailor our services to your specific requirements.",
    },
    {
      title: "2. Project Planning",
      body: "We create a detailed plan and timeline to ensure the project runs smoothly and stays on schedule.",
    },
    {
      title: "3. Design and Development",
      body: "Our team designs and develops the website based on the plan, focusing on creating a functional and visually appealing site that meets your needs.",
    },
    {
      title: "4. Testing and Quality Control",
      body: "We ensure the website works perfectly and meets all requirements. Our quality control process includes thorough testing to fix any issues.",
    },
    {
      title: "5. Launch and Support",
      body: "We launch the website and provide ongoing support to ensure it continues to perform optimally and supports your business goals.",
    },
  ],
} as const;

/**
 * Section 7 — pricing, behind a Monthly/Annually tab pair.
 *
 * Two source quirks preserved, both already in PHASE-5 §10:
 *  - The annual Starter lists "Custom business logo" TWICE and omits the
 *    monthly plan's "Website security protection". Change-log item #13.
 *  - The monthly panel heads its feature list "What's Included?" and the
 *    annual one "What's Included" — no question mark. Change-log item #14.
 *
 * Every "Get Started" button is a Bricks internal link to post 3725, which is
 * /quote/. The same links also carry `url: "/#brxe-yumjkl"` — a stale fragment
 * pointing at a Home element that no longer exists. Bricks resolves internal
 * links by postId, so the fragment never applied; not carried over.
 */
export const WEBAPPS_PRICING = {
  eyebrow: "Pricing",
  heading: "Tailored Packages for Your Business",
  body: "We understand that every business is different. That's why we offer flexible pricing packages designed to meet your specific needs.",
  tabs: [
    { id: "monthly", label: "Monthly" },
    { id: "annually", label: "Annually" },
  ],
  cta: { label: "Get Started", href: "/quote/" },
  plans: {
    monthly: [
      {
        name: "Starter",
        blurb: "This comprehensive package gets you started with a strong online presence.",
        price: "₪749",
        period: "per month",
        featuresLabel: "What's Included?",
        features: [
          "Beautiful, responsive website",
          "Reliable website hosting & email",
          "Custom business logo",
          "Website security protection",
        ],
      },
      {
        name: "Growth",
        blurb: "This package, building on the Starter, adds tools for rapid business growth.",
        price: "₪2799",
        period: "per month",
        featuresLabel: "What's Included?",
        features: [
          "Everything from the Starter Package +",
          "Advanced sales portal",
          "Product database management",
          "Payment gateway integration",
        ],
      },
      {
        name: "Pro",
        blurb: "Our top package offers exceptional results and a tailored online presence.",
        price: "Get a Free Quote",
        period: null,
        featuresLabel: "What's Included?",
        features: [
          "Everything from previous packages +",
          "Personalized content and development",
          "Custom-tailored advertising campaign",
          "Uncompromising responsive design",
        ],
      },
    ],
    annually: [
      {
        name: "Starter",
        blurb: "This comprehensive package gets you started with a strong online presence.",
        price: "₪4,700",
        period: "annually",
        featuresLabel: "What's Included",
        features: [
          "Beautiful, responsive website",
          "Reliable website hosting & email",
          /* Duplicated in the source; the monthly plan has "Website security
             protection" in this slot. Change-log item #13. */
          "Custom business logo",
          "Custom business logo",
        ],
      },
      {
        name: "Growth",
        blurb: "This package, building on the Starter, adds tools for rapid business growth.",
        price: "₪17,900",
        period: "annually",
        featuresLabel: "What's Included",
        features: [
          "Everything from the Starter Package +",
          "Advanced sales portal",
          "Product database management",
          "Payment gateway integration",
        ],
      },
      {
        name: "Pro",
        blurb: "Our top package offers exceptional results and a tailored online presence.",
        price: "Get a Free Quote",
        period: null,
        featuresLabel: "What's Included",
        features: [
          "Everything from previous packages +",
          "Personalized content and development",
          "Custom-tailored advertising campaign",
          "Uncompromising responsive design",
        ],
      },
    ],
  },
} as const;

/* Section 8 — FAQ. The chevron icons carry a vestigial Lorem Ipsum `text`
   property that Bricks never renders; see PHASE-9 (Home) §1. */
export const WEBAPPS_FAQ = {
  eyebrow: "FAQs",
  heading: "Questions? We Have Answers",
  body: "We can answer all your questions.",
  items: [
    {
      question: "Which package is best for my business?",
      answer:
        "We will help you choose the right package for your business. We will first learn about your business and what you need. Then, we will recommend a package that fits your budget and helps your business grow.",
    },
    {
      question: "Can I choose a design from the gallery?",
      answer: "Yes, you can! Our gallery has many designs to choose from.",
    },
    {
      question: "Will the website work on phones and tablets?",
      answer: "Yes, our websites are designed for all devices.",
    },
    {
      question: "Can I ask for special content in the basic package?",
      answer:
        "Maybe. We can see if we can add special content to the basic package. If we can, we will tell you how much it will cost.",
    },
    {
      question: "Can I sell your services to my customers?",
      answer:
        "Yes, you can! We have a program that helps you sell our services. Please contact us if you are interested.",
    },
  ],
} as const;

/* NOTE: "Connect With Us Today" — capital W, as on Hardware. */
export const WEBAPPS_CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect With Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
