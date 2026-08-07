import BookDemoCta from "./components/book-demo-cta";
import FeatureWeb from "./components/homee-sections/feature-web";
import HomeHeroSection from "./components/homee-sections/home-hero";
import HomePricing from "./components/homee-sections/home-pricing";
import WhyUs from "./components/homee-sections/why-us";

function Page() {
  return (
    <div>
      <HomeHeroSection />
      <WhyUs />
      <FeatureWeb />
      <HomePricing />
      <BookDemoCta />
    </div>
  );
}

export default Page;
