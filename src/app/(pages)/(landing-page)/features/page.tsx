import { Metadata } from "next";
import React from "react";
import BookDemoCta from "../components/book-demo-cta";
import FeaturesGrid from "../components/features/features-grid";
import FeaturesHero from "../components/features/features-hero";

export const metadata: Metadata = {
  title: "Features | RealtyIllustrations",
  description:
    "Lead capture, email follow-up automation, featured listings, appointment booking, blogging and a dedicated dashboard — the tools most agents buy from five different companies, bundled into one custom-built website.",
  keywords:
    "real estate website features, realtor lead capture, real estate CRM alternative, IDX alternative, realtor appointment booking, real estate email automation",
};

function Page() {
  return (
    <div>
      <FeaturesHero />
      <FeaturesGrid />
      <BookDemoCta />
    </div>
  );
}

export default Page;
