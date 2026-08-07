import Article from "@/app/icons/untitled-ui/duocolor/articule";
import Automation from "@/app/icons/untitled-ui/duocolor/automation";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";
import Funnel from "@/app/icons/untitled-ui/duocolor/funnel";
import LayoutAlt from "@/app/icons/untitled-ui/duocolor/layout-alt-02";
import RealEstateAgent from "@/app/icons/untitled-ui/duocolor/real-estate-agent";
import { ReactNode } from "react";

export type Feature = {
  slug: string;
  number: string;
  title: string;
  /** Short label used in the navbar dropdown and related-feature cards. */
  shortTitle: string;
  tagline: string;
  /** One-liner for cards, dropdowns and meta descriptions. */
  summary: string;
  description: string;
  bullets: string[];
  /** The tools an agent would otherwise pay for separately. */
  replaces: string[];
  /** Slugs of the three features shown at the bottom of this feature's page. */
  related: string[];
  icon: ReactNode;
};

export const features: Feature[] = [
  {
    slug: "lead-capture",
    number: "01",
    title: "Lead Capture & Organization",
    shortTitle: "Lead Capture",
    tagline: "Every enquiry lands in one place",
    summary:
      "Home valuation requests, tour and general enquiries, mortgage and seller call bookings, buyer's guide downloads — every lead captured and organized.",
    description:
      "Your site does the asking for you. Each of these is a purpose-built flow on your website, and every submission arrives tagged, timestamped and sorted — not scattered across your inbox and three dashboards.",
    bullets: [
      "Home valuation requests from sellers",
      "Tour bookings and general enquiries on any listing",
      "Mortgage consultation call bookings",
      "Seller call bookings",
      "Buyer's guide downloads that capture the email",
      "Every lead sorted by source, type and stage",
    ],
    replaces: ["Follow Up Boss", "Landing page builders", "Form plugins"],
    related: ["email-automation", "appointments", "dashboard"],
    icon: <Funnel />,
  },
  {
    slug: "email-automation",
    number: "02",
    title: "Email Follow-up Automation",
    shortTitle: "Email Automation",
    tagline: "Nobody goes cold because you got busy",
    summary:
      "Stay top of mind with follow-up sequences that reach every new lead automatically.",
    description:
      "The moment a lead comes in, your follow-up starts — a confirmation, then a sequence that keeps you in front of them for as long as it takes. You write it once; it runs on every lead after that.",
    bullets: [
      "Instant confirmation on every form and booking",
      "Follow-up sequences that run per lead type",
      "Notifications the second a hot lead arrives",
      "Everything sent from your own domain",
    ],
    replaces: ["Mailchimp", "Constant Contact", "CRM action plans"],
    related: ["lead-capture", "blog", "dashboard"],
    icon: <Automation />,
  },
  {
    slug: "featured-listings",
    number: "03",
    title: "Featured Listings",
    shortTitle: "Featured Listings",
    tagline: "Your listings, not a syndicated feed",
    summary:
      "Put your best properties front and centre with rich, responsive listing pages.",
    description:
      "Full listing pages built into your site — photos, details, map, and an enquiry form wired straight into your lead pipeline. Feature the properties you want front and centre on your homepage.",
    bullets: [
      "Rich listing pages with galleries and full details",
      "Feature and reorder properties from your dashboard",
      "Enquiry and tour forms attached to every listing",
      "Fast, mobile-first pages that are actually yours",
    ],
    replaces: ["IDX Broker", "Showcase IDX", "Listing plugins"],
    related: ["lead-capture", "appointments", "dashboard"],
    icon: <RealEstateAgent />,
  },
  {
    slug: "appointments",
    number: "04",
    title: "Appointment Management",
    shortTitle: "Appointments",
    tagline: "Scheduling that lives inside your site",
    summary:
      "Built-in scheduling for tours, calls and consultations — no third-party tools.",
    description:
      "Clients book tours, mortgage calls and seller consultations without ever leaving your website or being handed off to a third-party booking page. You approve, reschedule or cancel from one screen.",
    bullets: [
      "Built-in booking for tours, calls and consultations",
      "You set the availability; the site enforces it",
      "Confirmations and reminders sent automatically",
      "Every appointment tied back to the lead it came from",
    ],
    replaces: ["Calendly", "Acuity", "Back-and-forth email"],
    related: ["lead-capture", "featured-listings", "email-automation"],
    icon: <EventAvailable />,
  },
  {
    slug: "blog",
    number: "05",
    title: "Blogs",
    shortTitle: "Blogs",
    tagline: "Content that keeps working after you publish",
    summary:
      "Publish market insights and guides that bring in organic traffic all year round.",
    description:
      "Write market updates, neighbourhood guides and buyer advice directly in your dashboard. No separate CMS, no plugin updates, no theme that breaks the week you need it most.",
    bullets: [
      "Write, edit and publish from your own dashboard",
      "Cover images, drafts and scheduling built in",
      "Clean, SEO-friendly pages out of the box",
      "Posts feed straight into your buyer's guide funnel",
    ],
    replaces: ["WordPress", "SEO plugins", "Separate blog hosting"],
    related: ["lead-capture", "email-automation", "dashboard"],
    icon: <Article />,
  },
  {
    slug: "dashboard",
    number: "06",
    title: "Dedicated Dashboard",
    shortTitle: "Dashboard",
    tagline: "One screen for the whole business",
    summary:
      "One place to manage leads, listings, appointments and content end to end.",
    description:
      "The reason the bundle matters: leads, listings, appointments, emails and content all sit behind a single login, and they talk to each other. A booked tour is attached to the lead. A downloaded guide starts a sequence.",
    bullets: [
      "Leads, listings, appointments and posts in one place",
      "See where every lead came from and what they did",
      "Manage availability, content and listings yourself",
      "No plugins to update, no hosting to babysit",
    ],
    replaces: ["Five separate logins", "Zapier glue", "Spreadsheets"],
    related: ["lead-capture", "featured-listings", "appointments"],
    icon: <LayoutAlt />,
  },
];

export const featureSlugs = features.map((feature) => feature.slug);

export const getFeature = (slug: string) =>
  features.find((feature) => feature.slug === slug);

/**
 * The three curated related features for a page, falling back to the next
 * features in order if a related slug is ever mistyped or removed.
 */
export const getRelatedFeatures = (slug: string): Feature[] => {
  const feature = getFeature(slug);
  if (!feature) return [];

  const related = feature.related
    .map((relatedSlug) => getFeature(relatedSlug))
    .filter((item): item is Feature => Boolean(item) && item!.slug !== slug);

  const fallback = features.filter(
    (item) => item.slug !== slug && !related.includes(item),
  );

  return [...related, ...fallback].slice(0, 3);
};
