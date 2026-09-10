import { Header } from "@/components/website/header";
import { Footer } from "@/components/website/footer";
import { MobileBottomBar } from "@/components/website/mobile-bottom-bar";
import { FloatingWhatsApp } from "@/components/website/floating-whatsapp";
import { JsonLd, localBusinessJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";
import { getClinicHours, getSiteContent } from "@/lib/data";

// Public pages are statically rendered and refreshed hourly (ISR). Admin
// actions also call `revalidatePath` for immediate updates after edits.
export const revalidate = 3600;

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hours, content] = await Promise.all([
    getClinicHours(),
    getSiteContent(),
  ]);

  const sameAs = Object.values(content.social).filter(Boolean);

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd
        data={[
          websiteJsonLd(),
          localBusinessJsonLd({ hours, sameAs }),
        ]}
      />
      <Header />
      <main id="main" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomBar />
    </div>
  );
}
