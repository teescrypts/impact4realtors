import React from "react";
import ContactUs from "../../components/contact-us";
import FAQsSection from "../../components/sections/faqs";

async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ reason: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reason = (await params).reason;
  const adminId = (await searchParams).admin as string;

  return (
    <div>
      <ContactUs reason={reason} adminId={adminId} />
      <FAQsSection />
    </div>
  );
}

export default Page;
