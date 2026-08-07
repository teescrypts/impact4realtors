/**
 * Single source of truth for the pricing story, shared by the homepage
 * section and the full breakdown on /pricing.
 *
 * NOTE: the competitor figures are typical published starting prices for each
 * category and are meant as a ballpark — update them whenever a vendor
 * changes its pricing.
 */

export const MONTHLY_PRICE = "$30";

/** Sum of the low and high ends of `currentStack`, kept in sync by hand. */
export const STACK_TOTAL = "$177 – 380";

export const currentStack = [
  {
    job: "Lead follow-up & CRM",
    tools: "Follow Up Boss, LionDesk",
    price: "$50 – 70",
  },
  {
    job: "Website",
    tools: "WordPress + theme + hosting + plugins",
    price: "$30 – 100",
  },
  {
    job: "Listings",
    tools: "IDX Broker, Showcase IDX",
    price: "$50 – 100",
  },
  {
    job: "Scheduling",
    tools: "Calendly, Acuity",
    price: "$12 – 20",
  },
  {
    job: "Email marketing",
    tools: "Mailchimp, Constant Contact",
    price: "$20 – 50",
  },
  {
    job: "Lead magnets & forms",
    tools: "Landing page builders, form plugins",
    price: "$15 – 40",
  },
];

export const included: { label: string; slug?: string }[] = [
  { label: "Lead capture & organization", slug: "lead-capture" },
  { label: "Email follow-up automation", slug: "email-automation" },
  { label: "Featured listings", slug: "featured-listings" },
  { label: "Appointment management", slug: "appointments" },
  { label: "Blog & content", slug: "blog" },
  { label: "Dedicated dashboard", slug: "dashboard" },
  { label: "Custom design, built for you" },
  { label: "Hosting & maintenance" },
];
