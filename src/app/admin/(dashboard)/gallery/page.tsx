import type { Metadata } from "next";

import { AdminHeader } from "@/components/admin/admin-header";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { adminGetGallery } from "@/lib/data/admin";
import { hasServiceRole } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const images = await adminGetGallery();
  return (
    <div className="space-y-6">
      <AdminHeader
        title="Gallery"
        description="Upload photos to Supabase Storage, set categories and alt text, and control what is shown."
      />
      {!hasServiceRole ? (
        <p className="rounded-[var(--radius)] border border-warning/30 bg-gold-50 px-4 py-3 text-sm text-gold-800">
          Add <code>SUPABASE_SERVICE_ROLE_KEY</code> and create the storage
          buckets (0002_storage.sql) to manage the gallery.
        </p>
      ) : (
        <GalleryManager images={images} />
      )}
    </div>
  );
}
