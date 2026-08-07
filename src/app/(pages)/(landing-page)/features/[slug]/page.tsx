import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import BookDemoCta from "../../components/book-demo-cta";
import FeatureDetail from "../../components/features/feature-detail";
import FeaturePageHero from "../../components/features/feature-page-hero";
import RelatedFeatures from "../../components/features/related-features";
import { features, getFeature } from "../../components/features/feature-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) return { title: "Feature not found | RealtyIllustrations" };

  const title = `${feature.title} | RealtyIllustrations`;
  const description = `${feature.summary} Included in every RealtyIllustrations site for $30/month — no separate ${feature.replaces[0]} subscription needed.`;
  const url = `https://realtyillustrations.live/features/${feature.slug}`;

  return {
    title,
    description,
    keywords: [
      "real estate website",
      "realtor software",
      feature.title.toLowerCase(),
      ...feature.replaces.map((name) => `${name} alternative`),
    ],
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: url },
  };
}

const FeaturePage = async ({ params }: Props) => {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) notFound();

  return (
    <>
      <FeaturePageHero slug={slug} />
      <FeatureDetail slug={slug} />
      <RelatedFeatures slug={slug} />
      <BookDemoCta
        description={`${feature.shortTitle} is one of six features included in every site we build. Book a 30-minute demo and we'll show you the whole thing running live.`}
      />
    </>
  );
};

export default FeaturePage;
