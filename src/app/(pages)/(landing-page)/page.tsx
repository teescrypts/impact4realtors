import React from "react";
import HomeHeroSection from "./components/homee-sections/home-hero";
import HowItWorks from "./components/homee-sections/home-how-it-works";
import PricingSection from "./components/homee-sections/home-pricing-section";

// Metadata

function Page() {
  return (
    <div>
      <HomeHeroSection />
      <HowItWorks />
      <PricingSection />
    </div>
  );
}

export default Page;
