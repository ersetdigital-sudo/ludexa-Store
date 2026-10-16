import type { Metadata } from "next";
import { pjs } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Semua pembayaran digital, satu tempat`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Platform pembayaran digital untuk beli pulsa, paket data, token PLN, top up e-wallet, dan bayar tagihan bulanan. Cepat, aman, harga bersahabat.",
  applicationName: SITE_NAME,
  keywords: [
    "pulsa", "paket data", "token PLN", "top up e-wallet", "DANA", "OVO", "GoPay",
    "BPJS", "PDAM", "PPOB", "pembayaran digital",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Semua pembayaran digital, satu tempat`,
    description:
      "Beli pulsa, paket data, token listrik, top up e-wallet, dan bayar tagihan dalam satu tempat.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Semua pembayaran digital, satu tempat`,
    description:
      "Beli pulsa, paket data, token listrik, top up e-wallet, dan bayar tagihan dalam satu tempat.",
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Platform pembayaran digital untuk pulsa, data, token listrik, dan tagihan bulanan.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Indonesian"],
    telephone: "+62-857-1117-2317",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={pjs.variable}>
      <body>
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
