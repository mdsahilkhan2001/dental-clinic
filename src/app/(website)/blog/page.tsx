import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";

import { PageHero } from "@/components/website/page-hero";
import { CTASection } from "@/components/website/cta-section";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { buildMetadata } from "@/lib/seo/metadata";
import { getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Articles & Oral Health Tips",
  description:
    "Articles from Jeevan Dental & Aesthetic Clinic on dental hygiene, oral health, skin care, hair care and aesthetic care.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Articles"
        title="Oral health & care tips"
        description="Practical, general information from our clinicians. Articles are educational and do not replace a consultation."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Articles", href: "/blog" },
        ]}
      />

      <section className="section">
        <div className="container-page">
          {posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  {post.cover_image_url && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.cover_image_url}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {post.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                        {post.category}
                      </span>
                    )}
                    <h2 className="mt-1 text-lg">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="after:absolute after:inset-0 group-hover:text-accent"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-4 text-xs text-muted-foreground">
                      {post.published_at
                        ? formatDate(post.published_at.slice(0, 10))
                        : ""}
                      {post.author ? ` · ${post.author}` : ""}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-10 text-center">
              <Newspaper className="mx-auto size-8 text-navy-300" aria-hidden />
              <p className="mt-3 text-sm text-muted-foreground">
                Articles will be published here soon. In the meantime, see our{" "}
                <Link href="/faq" className="font-semibold text-accent underline">
                  FAQ
                </Link>{" "}
                for common questions.
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        heading="Have a question about your care?"
        body="Book a consultation and speak with our clinician directly."
        tone="surface"
      />
    </>
  );
}
