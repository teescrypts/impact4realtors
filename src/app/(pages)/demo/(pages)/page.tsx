import React, { Fragment } from "react";
import HeroSection from "./components/sections/home-hero";
import ListingsSection from "./components/sections/recent-listings";
import SellSection from "./components/sections/sell-section";
import TestimonialsSection from "./components/sections/testimonial-section";
import LatestBlogs from "./components/sections/latest-blog";
import FAQsSection from "./components/sections/faqs";
import NewsletterPopup from "./components/sections/newssletter-popup";
import apiRequest from "@/app/lib/api-request";
import { HomepageResponse } from "@/types";

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

  return (
    <Fragment>
      <HeroSection adminId={adminId} />
      <ListingsSection adminId={adminId} forRent={forRent} forSale={forSale} />
      <SellSection adminId={adminId} />
      <LatestBlogs adminId={adminId} blogs={blogs} />
      <TestimonialsSection />
      <FAQsSection />
      <NewsletterPopup />
    </Fragment>
  );
}

export default Page;
