import type { Metadata } from "next";
import { pjs } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPublicBrand } from "@/lib/db/server";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

export const revalidate = 60;

const FALLBACK_TAGLINE = "Semua pembayaran digital, satu tempat";

export async function generateMetadata(): Promise<Metadata> {
  const brand = (await getPublicBrand()).data;
  const name = brand?.nama || SITE_NAME;
  const tagline = brand?.tagline || FALLBACK_TAGLINE;
  const description = `${tagline}. Beli pulsa, paket data, token listrik, top up e-wallet, dan bayar tagihan bulanan. Cepat, aman, harga bersahabat.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s — ${name}`,
    },
    description,
    applicationName: name,
    keywords: [
      "pulsa",
      "paket data",
      "token PLN",
      "top up e-wallet",
      "DANA",
      "OVO",
      "GoPay",
      "BPJS",
      "PDAM",
      "PPOB",
      "pembayaran digital",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: name,
      title: `${name} — ${tagline}`,
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${tagline}`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brand = (await getPublicBrand()).data;
  const brandName = brand?.nama || SITE_NAME;
  const tagline = brand?.tagline || FALLBACK_TAGLINE;
  const waDigits = (brand?.wa_cs ?? "").replace(/\D/g, "");

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: SITE_URL,
    description: `${tagline}. Layanan pembayaran digital.`,
    ...(waDigits
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["Indonesian"],
            telephone: `+${waDigits}`,
          },
        }
      : {}),
  };

  return (
    <html lang="id" className={pjs.variable}>
      <body>
        <Header
          brandName={brandName}
          logoUrl={brand?.logo_url ?? null}
          waCs={brand?.wa_cs ?? null}
        />
        {children}
        <Footer
          brandName={brandName}
          logoUrl={brand?.logo_url ?? null}
          waCs={brand?.wa_cs ?? null}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
