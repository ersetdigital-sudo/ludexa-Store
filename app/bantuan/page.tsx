import type { Metadata } from "next";
import { HelpClient } from "@/components/HelpClient";
import { HELP_TOPICS } from "@/data/help";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Jawaban cepat seputar pembayaran, transaksi, refund, promo, voucher, dan keamanan di Ludexa Store. Butuh bantuan? Chat CS 24 jam.",
  alternates: { canonical: "/bantuan" },
  openGraph: {
    title: "Pusat Bantuan — Ludexa Store",
    description: "Jawaban cepat seputar pembayaran, transaksi, promo, dan keamanan.",
    url: "/bantuan",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HELP_TOPICS.flatMap((f) =>
    f[2].map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
};

export default function BantuanPage() {
  return (
    <>
      <HelpClient />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
