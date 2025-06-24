import React, { Fragment } from "react";
import HeroSection from "./components/sections/hero-section";
import RecentListings from "./components/sections/recent-listing";
import SellWithExpert from "./components/sections/sell";
import OurAgents from "./components/sections/our-agent";
import LatestBlogs from "./components/sections/latest-blogs";
import Testimonials from "./components/sections/testimonials";
import apiRequest from "@/app/lib/api-request";
import { HomepageResponse } from "@/types";
import AboutSection from "./components/sections/about-us";
import NewsletterPopup from "../(pages)/components/sections/newssletter-popup";

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
  const agents = response.data.agents;



  return (
    <Fragment>
      <HeroSection adminId={adminId} />
      <AboutSection adminId={adminId} />
      <RecentListings adminId={adminId} forRent={forRent} forSale={forSale} />
      <SellWithExpert adminId={adminId} />
      <OurAgents agents={agents} adminId={adminId} />
      <LatestBlogs blogs={blogs} adminId={adminId} />
      <Testimonials />
       <NewsletterPopup />
    </Fragment>
  );
}

export default Page;
