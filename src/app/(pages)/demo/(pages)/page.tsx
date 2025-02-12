import React from "react";
import HeroSection from "./components/sections/home-hero";
import ListingsSection from "./components/sections/recent-listings";
import SellSection from "./components/sections/sell-section";
import TestimonialsSection from "./components/sections/testimonial-section";
import LatestBlogs from "./components/sections/latest-blog";
import FAQsSection from "./components/sections/faqs";
import NewsletterPopup from "./components/sections/newssletter-popup";

function Page() {
  return (
    <div>
      <HeroSection />
      <ListingsSection />
      <SellSection />
      <LatestBlogs />
      <TestimonialsSection />
      <FAQsSection />
      <NewsletterPopup />
    </div>
  );
}

export default Page;
