import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: TitleTag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <TitleTag
        className={cn(
          "mt-3 text-3xl leading-tight sm:text-4xl",
          TitleTag === "h1" && "text-4xl sm:text-5xl",
        )}
      >
        {title}
      </TitleTag>
      {description && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
