"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { uploadImageAction } from "@/app/actions/admin/upload";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-danger">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function SubmitBar({
  pending,
  label = "Save changes",
  onCancel,
  extra,
}: {
  pending: boolean;
  label?: string;
  onCancel?: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-0 -mx-1 flex items-center justify-end gap-2.5 border-t border-border bg-background/95 px-1 py-4 backdrop-blur">
      {extra}
      {onCancel && (
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
      )}
      <Button type="submit" variant="default" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {label}
      </Button>
    </div>
  );
}

export function CheckboxRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-[var(--radius)] border border-border p-3 text-sm">
      <Checkbox
        checked={checked}
        onCheckedChange={(c) => onChange(c === true)}
        className="mt-0.5"
      />
      <span>
        <span className="font-medium text-primary">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

export { Input, Textarea };

export function ImageField({
  label,
  value,
  onChange,
  bucket,
  hint,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (url: string, path?: string) => void;
  bucket: "gallery" | "doctors" | "services" | "content";
  hint?: string;
  required?: boolean;
  error?: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("bucket", bucket);
      const res = await uploadImageAction(fd);
      if (res.ok && res.url) {
        onChange(res.url, res.path);
        toast.success("Image uploaded.");
      } else {
        toast.error(res.error ?? "Upload failed.");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label} hint={hint} required={required} error={error}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No image
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-4" aria-hidden />
              )}
              Upload
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
              >
                <X className="size-4" aria-hidden />
                Remove
              </Button>
            )}
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL / path"
            className="w-72 max-w-full"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </Field>
  );
}
