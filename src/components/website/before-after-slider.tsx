"use client";

import * as React from "react";
import Image from "next/image";

import type { BeforeAfterRow } from "@/types/database";

function Slider({ item }: { item: BeforeAfterRow }) {
  const [pos, setPos] = React.useState(50);

  return (
    <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background">
      <div className="relative aspect-[4/3] select-none">
        <Image
          src={item.after_url}
          alt={`${item.treatment} — after`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <Image
            src={item.before_url}
            alt={`${item.treatment} — before`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ maxWidth: "none", width: "100vw" }}
          />
          <span className="absolute left-3 top-3 rounded-full bg-navy-950/70 px-2 py-0.5 text-[11px] font-semibold text-white">
            Before
          </span>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-navy-950/70 px-2 py-0.5 text-[11px] font-semibold text-white">
          After
        </span>
        <div
          className="absolute inset-y-0 w-0.5 bg-white"
          style={{ left: `${pos}%` }}
          aria-hidden
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Reveal before and after for ${item.treatment}`}
          className="absolute inset-x-0 bottom-4 mx-auto w-[85%] cursor-ew-resize accent-white"
        />
      </div>
      <figcaption className="p-4">
        <p className="font-semibold text-primary">{item.treatment}</p>
        {item.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

export function BeforeAfterGallery({ items }: { items: BeforeAfterRow[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <Slider key={item.id} item={item} />
      ))}
    </div>
  );
}
