/**
 * TERMS OF USE & PRIVACY POLICY — route /privacy-policy/
 *
 * Transcribed from the Bricks export ("Terms of Use & Privacy Policy.json",
 * page ID 845). The page is two sections: a hero whose heading is the bare
 * `{post_title}` dynamic tag, and one rich-text element (#brxe-mzcbuw) set to
 * `font-size: var(--text-s)`.
 *
 * The body is modelled as PostBlock[] — the same typed-block shape the blog
 * uses — so it renders through PostBody with no dangerouslySetInnerHTML, and
 * maps onto a CMS portable-text field later (PHASE-5 §7.2).
 *
 * Transcription is lossless: stripping tags from the source HTML and
 * concatenating every run below produce byte-identical text (10,031 chars,
 * whitespace-normalised).
 *
 * 🔴 THREE EMPTY PARAGRAPHS DROPPED. The source carries orphaned Gutenberg
 * block comments — one `<!-- wp:heading -->` and a dangling
 * `<!-- /wp:list-item -->` / `<!-- /wp:list -->` pair closing a list that is
 * never opened — each wrapped in its own `<p>`. They render as empty
 * paragraphs on the live page. Same class of junk as CHANGE #27.
 *
 * ➖ THE TWO CONTACT URLS ARE LEFT AS PLAIN TEXT. The source prints
 * `https://weiztech.com/contact-us/` as text, not as an anchor, in both the
 * Introduction and the Contact section. Linking them would be an improvement,
 * but it is a functional change to a legal document — flagged for approval in
 * the phase report rather than made here.
 */

import type { PostBlock } from "@/types/content";

/* The hero heading is `{post_title}`; the source has no hero body. */
export const PRIVACY_HERO = {
  heading: "Terms of Use & Privacy Policy",
} as const;

export const PRIVACY_BLOCKS: readonly PostBlock[] = [
  { type: "heading", level: 2, runs: [{ t: "Introduction" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "The use of this website (“the Site”) of Weiztech LLC. and its affiliated companies (together and individually: “Weiz”, “we”, “us”, or “our”) is subject to the Terms of Use and Privacy Policy as detailed below.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "These Terms of Use (“the Terms”) are an integral part of the Terms of Use of the Site.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Any access to the Site and/or use of it and its content constitutes a statement that you have read and understood these Terms and that you accept, agree to, and approve their content. If you do not agree with the terms, do not use this Site. All references to the masculine gender shall also refer to the feminine gender, and all references to the singular shall also refer to the plural, unless it contradicts the written subject or content, or if the context requires a different interpretation.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [{ t: "Any changes to these Terms will be published on this page." }],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "For any questions, issues, or if you wish to report a privacy violation, please contact us via the following link:",
        br: true,
      },
      { t: "https://weiztech.com/contact-us/ (“Contact Link”)" },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Data Collection" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "Data on the Site is provided by you voluntarily, and in some cases, data may be collected automatically. Some of the data collected includes information that can reasonably be used to identify you, including your first and last name, residential address and/or email address, your phone number, location, and more (“Personal Information”).",
      },
    ],
  },
  { type: "paragraph", runs: [{ t: "Personal data collection on the Site occurs in two ways:" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "1. Directly – for example, when you provide information to register for newsletters, receive services, make inquiries, or fill out forms.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "2. Indirectly – through site technology, such as your IP address, the pages you view, your operating system, and browser type.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "On the “Careers” page, users can upload a PDF document. This document is stored in the company’s database for review and communication purposes.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Purpose of Data Collection" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "We use Personal Information to provide you with the information you request, for online applications, and for other purposes that will be clarified to you or described at the time of data collection, and for any other purpose specified in these Terms.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "We analyze information related to the IP address to determine what is most effective regarding the Site and to help us identify ways to improve and optimize the Site.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Data Retention and Use" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "We retain Personal Information as required to provide you with services and, at times, for a longer period if required by law. Among other things, the following types of information may be collected about you: first name and last name, residential address and/or email address, phone number, location, conferences you have registered for, inquiries in “Contact Us,” and more.",
        br: true,
      },
      {
        t: "Weiz will use Personal Information only in accordance with the purposes for which it was collected and according to these Terms.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Any information or content you publish on the Site in any way (other than Personal Information) will not be considered proprietary or confidential, and anyone exposed to it, including Weiz, will be allowed to use it in any manner. It is clarified that Weiz and its representatives will not be responsible for such information or content.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Personal Information provided by you through the Site or other means (such as email, social networks, registration for conferences, or any other way), for the purpose of registering for conferences, events, courses, training, or any other commercial or business purpose, will be stored in Weiz’s database. Weiz may use this information for the following purposes: (1) for its administrative, business, and commercial needs, including contacting you, direct mail, marketing and advertising campaigns, commercial offers, and/or courses, via mail, phone, fax, or email; (2) providing information to affiliated companies and/or third parties for the above purposes; (3) for any other commercial purpose related to the circumstances and manner of the information provided by you.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Personal Information provided by you through the Site or other means (such as email, social networks, and under the “Refer-a-Friend” model) in the context of applying for possible job positions (“Candidate Information”) is required to evaluate your suitability for the requested positions. The service, if provided, will be based on the information you provided, which will be stored in Weiz’s database in accordance with legal requirements, Weiz’s procedures, and the provisions of these Terms. Weiz will be entitled to transfer such information to third parties at your request and at its discretion, for its benefit and/or your benefit. Weiz may use Candidate Information: (1) for its administrative, business, and commercial needs, including contacting you, direct mail, marketing and advertising campaigns, job offers, and/or courses, via mail, phone, fax, or email; (2) providing Candidate Information to affiliated companies and/or third parties for receiving offers for jobs/products/services that Weiz believes you may be interested in. Weiz may also retain Candidate Information for a period longer than required for filling the position for which the application was submitted and offer you additional suitable job opportunities in the future. If you wish not to be included in direct mailing lists and/or not to have Candidate Information transferred to third parties as described above, you must request this from us via email or registered mail, according to the contact details on the Site. Failure to request will be considered as giving consent for Weiz to use Candidate Information as described.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "International Transfers of Personal Information" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "If we transfer Personal Information outside Israel, it is done in compliance with local privacy laws regarding the collection, use, and retention of Personal Information. Processing your Personal Information on third-party sites or services (such as cloud service providers) is your responsibility, including compliance with relevant legislation, even if you requested us to upload the information on your behalf.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Your Rights" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "Weiz permits you to use the Site and its services for personal, non-commercial use only, subject to the Site's conditions and the Terms.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "You have the right to know if we hold Personal Information about you, to review the Personal Information, and to correct inaccuracies, all subject to the law.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Applicability and Third-Party Services" }] },
  {
    type: "paragraph",
    runs: [{ t: "This Privacy Policy applies only to data collected by us for our use." }],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Some services on the Site (such as search engines) are managed by Weiz’s product and content providers. These services are provided by those providers and not by Weiz. When using these services, you may be asked to provide or have Personal Information collected. The use of this information is subject to the privacy policies of those providers and not Weiz’s privacy policy, so you are advised to review their privacy policy documents as well.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Protection of Personal Information" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "Weiz respects the privacy of users on its sites. Here is an overview of how we use the information you provide or that is collected about you while using the Site.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Disclosure" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "We will not sell, trade, or disclose to any third party any Personal Information obtained from the use of services or visits to the Site.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "However, we may transfer Personal Information to our service providers who may be located outside Israel, including to countries that do not provide the same level of privacy protection as provided in Israel, and you consent to such transfers as necessary. In such cases, we will ensure that your Personal Information is adequately protected according to the law and our internal policy.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Additionally, there may be certain exceptions, including if disclosure is required by law or if there is a need to protect the rights, property, or safety of Weiz, our customers, or third parties, if the Personal Information is publicly available, or if such disclosure is reasonably required.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Security" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "We implement systems and procedures for information security on the Site and continue to improve them according to available technology. These systems and procedures reduce the risk of unauthorized access to Weiz’s computers but do not guarantee complete security. Therefore, Weiz does not guarantee that the services on the Site will be entirely immune to unauthorized access to the information stored therein.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "The Site may contain links to and from third-party sites. Following these links will lead to third-party sites operating under separate Terms of Use and Privacy Policies, and Weiz has no responsibility or liability for such sites, their content, visual elements, data, or the policies applicable to them.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Site Use" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "You may not make any changes to the copyrights and intellectual property rights inherent in the Site and its content.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Unless otherwise expressly stated in the Terms, all content, design, and display (“Content”) are the intellectual property of Weiz or third parties and are protected by law. Any unauthorized use of the Content or any part of it may constitute a violation of the law. Trademarks and company or product names mentioned on the Site belong to their respective owners. Using the Site does not grant you any rights to Weiz’s or third parties’ intellectual property published on the Site.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "Weiz reserves the right to refuse access to the Site or any part of it to any user at its sole discretion and without prior notice.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "You may not alter, distribute, reproduce, copy, sell, transmit, publish, perform, create derivative works from, or exploit for any commercial or public purpose any Content and/or Weiz’s or third parties’ trademarks, and you may not permit any third party to do so; in no case may you perform the aforementioned actions and/or use the Content without the prior written consent of Weiz. It is clarified that Weiz does not grant you any rights to its or third parties’ intellectual property.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "You may not create links to the Site from other sites without Weiz’s prior written approval and subject to the approval conditions and legal provisions.",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: "By using the Site, you agree that you may not post any prohibited content on the Site as outlined below: (1) that violates or encourages the violation of any law or rights of any person or entity; (2) of a pornographic and/or sexually explicit, offensive, harassing, obscene, threatening, racist, defamatory, inciting, threatening, derogatory nature, encourages criminal activity, infringes on an individual's privacy",
      },
    ],
  },
  {
    type: "paragraph",
    runs: [
      {
        t: ", and/or any other unlawful content; (3) that constitutes spam, phishing, or any content that contains viruses, malware, or any other harmful software.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Amendments" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "Weiz reserves the right to change the Site, its content, and the Terms at its sole discretion and without prior notice. Any use of the Site after the publication of changes to the Terms will be subject to the updated Terms.",
      },
    ],
  },
  { type: "heading", level: 3, runs: [{ t: "Disclaimer of Liability" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "The use of the Site and the Content is done at your sole responsibility. Weiz, its employees, directors, officers, and any entity associated with Weiz do not guarantee that the Site will operate continuously or without interruptions and errors. Weiz does not guarantee that the Content will be accurate, complete, or suitable for your specific needs or any specific purpose. Weiz shall not be liable for any damages, including indirect, consequential, incidental, special, or punitive damages, arising from the use of or inability to use the Site, even if Weiz has been advised of the possibility of such damages.",
      },
    ],
  },
  { type: "heading", level: 3, runs: [{ t: "Applicable Law" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "The Terms and the use of the Site will be governed by and construed in accordance with the laws of the State of Israel, and any dispute arising out of or related to these Terms or the use of the Site will be subject to the exclusive jurisdiction of the competent courts in Tel Aviv, Israel.",
      },
    ],
  },
  { type: "heading", level: 2, runs: [{ t: "Contact" }] },
  {
    type: "paragraph",
    runs: [
      {
        t: "For any questions regarding the Site, the Terms, or any other matter related to the Site, please contact us via the following link:",
        br: true,
      },
      { t: "https://weiztech.com/contact-us/" },
    ],
  },
];
