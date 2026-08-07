import { Metadata } from "next";
import React from "react";
import BookDemoCta from "../components/book-demo-cta";
import PricingHero from "../components/pricing/pricing-hero";
import ToolStackComparison from "../components/pricing/tool-stack-comparison";

export const metadata: Metadata = {
  title: "Pricing | RealtyIllustrations",
  description:
    "One flat $30/month. Lead capture, email follow-up automation, featured listings, appointment booking, blogging and a dedicated dashboard — the tools most agents buy from five different companies, bundled into one custom-built website.",
  keywords:
    "realtor website pricing, affordable real estate website, real estate CRM cost, IDX alternative pricing, all in one realtor platform",
};

function Page() {
  return (
    <div>
      <PricingHero />
      <ToolStackComparison />
      <BookDemoCta />
    </div>
  );
}

export default Page;
