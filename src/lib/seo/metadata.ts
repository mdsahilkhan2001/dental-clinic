import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: siteConfig.name,
};

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Omit index to keep default (indexable). */
  noindex?: boolean;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  keywords?: string[];
}

/** Build consistent per-page metadata with canonical + OG + Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  noindex,
  images,
  keywords,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path === "/" ? "" : path}`;
  const ogImages = images?.length ? images : [DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    keywords: keywords ?? undefined,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
