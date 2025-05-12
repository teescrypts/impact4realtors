import React from "react";
import SellWithExpert from "../components/sections/sell";
import Testimonials from "../components/sections/testimonials";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminId = (await searchParams).admin as string | undefined;

  return (
    <div>
      <SellWithExpert adminId={adminId} />
      <Testimonials />
    </div>
  );
}

export default Page;
