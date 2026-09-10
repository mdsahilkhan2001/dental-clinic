"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, Input, SubmitBar, Textarea } from "@/components/admin/form-kit";
import { saveSiteContentAction } from "@/app/actions/admin/content";
import type { SiteContent } from "@/lib/content/defaults";

export function ContentForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [hero, setHero] = React.useState(content.hero);
  const [about, setAbout] = React.useState({
    heading: content.about.heading,
    body: content.about.body.join("\n"),
  });
  const [why, setWhy] = React.useState(content.whyChooseUs);
  const [cta, setCta] = React.useState(content.cta);
  const [footerNote, setFooterNote] = React.useState(content.footerNote);
  const [social, setSocial] = React.useState(content.social);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const res = await saveSiteContentAction({
        hero,
        about,
        whyChooseUs: why,
        cta,
        footerNote,
        social,
      });
      if (res.ok) {
        toast.success("Homepage content updated.");
        router.refresh();
      } else {
        toast.error(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <h2 className="text-lg">Hero</h2>
        <Field label="Eyebrow" htmlFor="h-eyebrow" error={errors["hero.eyebrow"]}>
          <Input
            id="h-eyebrow"
            value={hero.eyebrow}
            onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline" htmlFor="h-headline" error={errors["hero.headline"]}>
          <Input
            id="h-headline"
            value={hero.headline}
            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
          />
        </Field>
        <Field label="Supporting text" htmlFor="h-sub" error={errors["hero.subheadline"]}>
          <Textarea
            id="h-sub"
            rows={3}
            value={hero.subheadline}
            onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary CTA label" htmlFor="h-cta1">
            <Input
              id="h-cta1"
              value={hero.primaryCtaLabel}
              onChange={(e) =>
                setHero({ ...hero, primaryCtaLabel: e.target.value })
              }
            />
          </Field>
          <Field label="Secondary CTA label" htmlFor="h-cta2">
            <Input
              id="h-cta2"
              value={hero.secondaryCtaLabel}
              onChange={(e) =>
                setHero({ ...hero, secondaryCtaLabel: e.target.value })
              }
            />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <h2 className="text-lg">About section</h2>
        <Field label="Heading" htmlFor="a-heading" error={errors["about.heading"]}>
          <Input
            id="a-heading"
            value={about.heading}
            onChange={(e) => setAbout({ ...about, heading: e.target.value })}
          />
        </Field>
        <Field
          label="Body"
          htmlFor="a-body"
          hint="One paragraph per line."
          error={errors["about.body"]}
        >
          <Textarea
            id="a-body"
            rows={6}
            value={about.body}
            onChange={(e) => setAbout({ ...about, body: e.target.value })}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Why choose us</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setWhy((w) => [...w, { title: "", description: "" }])
            }
          >
            <Plus className="size-4" aria-hidden /> Add point
          </Button>
        </div>
        {why.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-[var(--radius)] border border-border p-4"
          >
            <div className="flex-1 space-y-2">
              <Input
                value={item.title}
                placeholder="Title"
                onChange={(e) =>
                  setWhy((w) =>
                    w.map((x, idx) =>
                      idx === i ? { ...x, title: e.target.value } : x,
                    ),
                  )
                }
              />
              <Textarea
                value={item.description}
                rows={2}
                placeholder="Description"
                onChange={(e) =>
                  setWhy((w) =>
                    w.map((x, idx) =>
                      idx === i ? { ...x, description: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove"
              onClick={() => setWhy((w) => w.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-4 text-red-600" aria-hidden />
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <h2 className="text-lg">Appointment CTA</h2>
        <Field label="Heading" htmlFor="c-heading" error={errors["cta.heading"]}>
          <Input
            id="c-heading"
            value={cta.heading}
            onChange={(e) => setCta({ ...cta, heading: e.target.value })}
          />
        </Field>
        <Field label="Body" htmlFor="c-body" error={errors["cta.body"]}>
          <Textarea
            id="c-body"
            rows={2}
            value={cta.body}
            onChange={(e) => setCta({ ...cta, body: e.target.value })}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-background p-6">
        <h2 className="text-lg">Footer &amp; social links</h2>
        <Field label="Footer note" htmlFor="f-note" error={errors.footerNote}>
          <Textarea
            id="f-note"
            rows={2}
            value={footerNote}
            onChange={(e) => setFooterNote(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["instagram", "Instagram URL"],
              ["facebook", "Facebook URL"],
              ["youtube", "YouTube URL"],
              ["googleBusiness", "Google Business Profile URL"],
            ] as const
          ).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              htmlFor={`s-${key}`}
              error={errors[`social.${key}`]}
              hint="Leave blank to hide."
            >
              <Input
                id={`s-${key}`}
                value={social[key]}
                onChange={(e) =>
                  setSocial({ ...social, [key]: e.target.value })
                }
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </section>

      <SubmitBar
        pending={pending}
        label="Save homepage content"
        extra={
          <Button asChild type="button" variant="ghost" size="sm">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden /> Preview site
            </a>
          </Button>
        }
      />
    </form>
  );
}
