/**
 * HOME PAGE CONTENT
 *
 * Every string transcribed verbatim from the Bricks export (home.json,
 * page ID 34). Typos and quirks in the source are preserved unless listed in
 * the change log — see the note on `lpaptops` below.
 */

import type { IconName } from "@/components/primitives";

export const HOME_HERO = {
  eyebrow: { chip: "Weiz", label: "Trusted IT Solutions" },
  heading: "Your Digital Partner for Growth and Innovation",
  body: "Weiz Technologies is your go-to partner for secure and reliable IT solutions. We help businesses of all sizes achieve their goals by providing innovative technology that drives growth and efficiency.",
  primaryCta: { label: "Get in Touch", href: "/contact-us/" },
  /* Anchor scrolls to the services section. The source targets the Bricks
     element id #brxe-kwgztb; here it targets the semantic id we give it. */
  secondaryCta: { label: "Explore", href: "#services" },
} as const;

/* The logo marquee is shared verbatim with Hardware — see VENDOR_LOGOS in
   content/site.ts. */

export const HOME_SERVICES = {
  eyebrow: "IT Solutions Tailored to You",
  heading: "Your One-Stop IT Shop",
  body: "From hardware procurement to custom software development, we offer tailored solutions to meet your unique needs.",
  cards: [
    {
      icon: "ion-md-laptop" as IconName,
      title: "Hardware",
      /* NOTE: the source reads "lpaptops". Preserved verbatim pending a
         decision on change-log item #12. */
      body: "Source a wide range of computing components, from lpaptops to peripherals. Enjoy fast delivery, competitive pricing, and flexible purchase or rental options.",
      ctaLabel: "Learn More",
      href: "/products/",
    },
    {
      icon: "ion-logo-python" as IconName,
      title: "Software Development",
      body: "Let us build custom software solutions that perfectly align with your business goals. Describe your challenges, and we'll provide the technological solution.",
      ctaLabel: "Learn More",
      href: "/software/",
    },
    {
      icon: "ion-ios-cloud-done" as IconName,
      title: "Cloud Solutions",
      body: "Need cloud-based backup or server hosting? Weiz Technologies offers flexible and cost-effective cloud solutions tailored to your specific requirements.",
      ctaLabel: "Learn More",
      href: "/software/",
    },
    {
      icon: "ti-world" as IconName,
      title: "App Development",
      body: "From simple websites to complex marketing platforms, we create iOS and Android & Web apps that drive results.",
      ctaLabel: "Learn More",
      href: "/webapps/",
    },
    {
      icon: "ti-shield" as IconName,
      title: "Cybersecurity",
      body: "Our comprehensive cybersecurity solutions identify and mitigate vulnerabilities to safeguard your business from cyber threats.",
      ctaLabel: "Learn More",
      href: "/software/",
    },
  ],
} as const;

export const HOME_WHY_CHOOSE_US = {
  eyebrow: "Why Choose Us",
  heading: "Empowering Your Business with IT",
  body: "With our expert team and customized solutions, we ensure your technology works seamlessly for you.",
  cards: [
    {
      title: "Tailored Solutions",
      body: "We provide personalized IT solutions that align perfectly with your unique business needs. Our proactive monitoring and dynamic support ensure your technology always works for you.",
    },
    {
      title: "Technology Leadership",
      body: "Weiz Technologies is at the forefront of technology. We help your business leverage the latest tools and strategies to improve efficiency, enhance security, and gain a competitive edge.",
    },
    {
      title: "Unmatched Service",
      body: "Experience our unparalleled commitment to service, professionalism, and reliability. We deliver on time, within budget, and with minimal disruption.",
    },
    {
      title: "Built to Last",
      body: "Our IT solutions are designed for long-term success. Through meticulous planning, testing, and optimization, we ensure your technology remains robust and adaptable to your evolving needs.",
    },
  ],
} as const;

export const HOME_FAQ = {
  eyebrow: "Frequently Asked Questions",
  heading: "Your Questions, Answered!",
  body: "Have questions about our IT services? Find the answers you need here.",
  items: [
    {
      question: "How can I determine the best IT solutions for my business?",
      answer:
        "The optimal IT solutions for your business depend on your specific needs and goals. We start with a thorough assessment to understand your current setup and challenges. From there, we recommend tailored solutions that streamline your operations while staying within budget.",
    },
    {
      question: "What should I look for in a technology partner?",
      answer:
        "Beyond technical expertise, seek a partner genuinely interested in your business's success. Consider factors like reliability, clear communication, and creativity.",
    },
    {
      question: "What is your response time for inquiries, issues, and quotes?",
      /* NOTE: states Monday–Thursday 8:00–5:00. This is a THIRD set of opening
         hours, conflicting with the Organization schema (7 days 09:00–17:00)
         and the Contact page meta (Sun–Thu 08:00–17:00). Open item D. */
      answer:
        "We understand the importance of timely responses when it comes to IT. We pride ourselves on our quick turnaround. Contact us by phone, email, or WhatsApp for a prompt response during our business hours: Monday-Thursday, 8:00 AM - 5:00 PM.",
    },
    {
      question: "What is the best technology strategy for a new business?",
      answer:
        "To maximize your investment, focus on your business's core needs. Prioritize reliable hardware, secure data backups, and robust cybersecurity. Consider outsourcing IT management to reduce costs and benefit from expert services. Avoid complex and expensive systems; opt for efficient and cost-effective solutions.",
    },
    {
      question: "Do you offer wholesale distribution to dealers?",
      answer:
        "Absolutely! We have a successful reseller program designed to help our partners expand their offerings and grow their businesses. If you're interested in selling our products or services, contact us for special pricing, immediate inventory availability, and unparalleled support.",
    },
  ],
} as const;

export const HOME_CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect with Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
