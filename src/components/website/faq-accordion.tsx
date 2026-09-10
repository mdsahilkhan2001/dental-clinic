"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { QAItem } from "@/types/database";

export function FaqAccordion({
  items,
  className,
}: {
  items: QAItem[];
  className?: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No questions have been published yet.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className={className}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
