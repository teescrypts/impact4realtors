import React from "react";
import AboutSection from "../components/sections/about-us";
import Testimonials from "../components/sections/testimonials";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminId = (await searchParams).admin as string | undefined;

  return (
    <div>
      <AboutSection adminId={adminId} />
      <Testimonials />
    </div>
  );
}

export default Page;
