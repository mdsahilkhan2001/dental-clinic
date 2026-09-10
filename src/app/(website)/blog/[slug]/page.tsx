import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PageHero } from "@/components/website/page-hero";
import { CTASection } from "@/components/website/cta-section";
import { MedicalDisclaimer } from "@/components/website/disclaimer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Article not found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: post.seo_title ?? post.title,
    description:
      post.seo_description ?? post.excerpt ?? `${post.title} — ${siteConfig.name}`,
    path: `/blog/${post.slug}`,
    images: post.cover_image_url
      ? [{ url: post.cover_image_url, alt: post.title }]
      : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.cover_image_url ?? undefined,
            datePublished: post.published_at ?? post.created_at,
            dateModified: post.updated_at,
            author: post.author
              ? { "@type": "Person", name: post.author }
              : { "@id": `${siteConfig.url}/#clinic` },
            publisher: { "@id": `${siteConfig.url}/#clinic` },
            mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
          },
        ]}
      />
      <PageHero
        eyebrow={post.category ?? "Article"}
        title={post.title}
        description={
          post.published_at
            ? `Published ${formatDate(post.published_at.slice(0, 10))}${
                post.author ? ` · ${post.author}` : ""
              }`
            : undefined
        }
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Articles", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <section className="section">
        <article className="container-page max-w-3xl">
          {post.cover_image_url && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border border-border">
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <div className="prose-clinic max-w-none text-[15px]">
            {post.content.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <MedicalDisclaimer className="mt-10" />
        </article>
      </section>

      <CTASection
        heading="Ready to speak with a clinician?"
        body="Book a consultation and get advice for your specific situation."
        tone="surface"
      />
    </>
  );
}
