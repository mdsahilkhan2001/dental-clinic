"use server";

import { ensureAdmin } from "./_helpers";
import { slugify } from "@/lib/utils";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const BUCKETS = ["gallery", "doctors", "services", "content"] as const;
type Bucket = (typeof BUCKETS)[number];

export interface UploadResult {
  ok: boolean;
  error?: string;
  url?: string;
  path?: string;
}

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadResult> {
  const guard = await ensureAdmin();
  if (!guard.ok) return { ok: false, error: guard.error };

  const file = formData.get("file");
  const bucketInput = String(formData.get("bucket") ?? "content");
  const bucket: Bucket = BUCKETS.includes(bucketInput as Bucket)
    ? (bucketInput as Bucket)
    : "content";

  if (!(file instanceof File)) {
    return { ok: false, error: "No file was received." };
  }
  if (!ALLOWED.includes(file.type)) {
    return { ok: false, error: "Please upload a JPG, PNG, WebP or AVIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be 6 MB or smaller." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${new Date().getFullYear()}/${base}-${Date.now()
    .toString(36)}.${ext}`;

  const { error } = await guard.supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return { ok: false, error: "Upload failed. Please try again." };
  }

  const {
    data: { publicUrl },
  } = guard.supabase.storage.from(bucket).getPublicUrl(path);

  return { ok: true, url: publicUrl, path };
}
