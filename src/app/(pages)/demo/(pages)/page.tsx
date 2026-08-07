import React, { Fragment } from "react";
import HeroSection from "./components/sections/home-hero";
import ListingsSection from "./components/sections/recent-listings";
import TestimonialsSection from "./components/sections/testimonial-section";
import LatestBlogs from "./components/sections/latest-blog";
import NewsletterPopup from "./components/sections/newssletter-popup";
import apiRequest from "@/app/lib/api-request";
import { HomepageResponse } from "@/types";
import AboutUs from "./components/about";
import HomeEvaluationSection from "./components/sections/home-evaluation";
import { BuyerLeadCaptureSection } from "./components/sections/buyer-lead-capture";
import SellSection from "./components/sections/sell-section";
import FeaturedSpotlight from "./components/featured-spotlight";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminId = (await searchParams).admin as string;
  const response = await apiRequest<{
    message: string;
    data: HomepageResponse;
  }>(`public/homepage/data?adminId=${adminId}`, {
    tag: "fetchHomePageData",
  });

  const forSale = response.data.forSale;
  const forRent = response.data.forRent;
  const blogs = response.data.publishedBlogs;

  // A newly seeded admin can have no listings at all, so this may be
  // undefined - the spotlight is skipped rather than rendered empty.
  const spotlightProperty = forSale?.[0] ?? forRent?.[0];

  return (
    <Fragment>
      <HeroSection adminId={adminId} />
      <AboutUs adminId={adminId} />
      <HomeEvaluationSection adminId={adminId} />
      <ListingsSection adminId={adminId} forRent={forRent} forSale={forSale} />
      {spotlightProperty && (
        <FeaturedSpotlight property={spotlightProperty} adminId={adminId} />
      )}
      <BuyerLeadCaptureSection adminId={adminId} />
      <SellSection adminId={adminId} />
      <LatestBlogs adminId={adminId} blogs={blogs} />
      <TestimonialsSection />
      {/* <FAQsSection /> */}
      <NewsletterPopup adminId={adminId} />
    </Fragment>
  );
}

export default Page;
