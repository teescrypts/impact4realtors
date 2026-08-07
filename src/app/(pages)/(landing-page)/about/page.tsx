import { Metadata } from "next";
import React from "react";
import AboutHero from "../components/about/about-hero";
import OurMission from "../components/about/our-mission";
import WhyWeBuiltIt from "../components/about/why-we-built-it";
import BookDemoCta from "../components/book-demo-cta";

export const metadata: Metadata = {
  title: "About Us | RealtyIllustrations",
  description:
    "RealtyIllustrations is a project by Impact Illustration, which has built digital technology for small and medium businesses across America since 2018. Our mission: empower SMEs with the technology they need to grow within their capacity.",
  keywords:
    "Impact Illustration, RealtyIllustrations, about, real estate website company, SME digital technology, custom realtor website, affordable real estate website",
};

function Page() {
  return (
    <div>
      <AboutHero />
      <OurMission />
      <WhyWeBuiltIt />
      <BookDemoCta
        title={
          <>
            Let&apos;s build the site your business{" "}
            <span style={{ whiteSpace: "nowrap" }}>actually needs.</span>
          </>
        }
        description="Book a 30-minute demo. We'll show you the platform running live, then talk through what yours would look like — no obligation either way."
      />
    </div>
  );
}

export default Page;
