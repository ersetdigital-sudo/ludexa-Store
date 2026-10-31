import type { Metadata } from "next";
import { CekClient } from "@/components/CekClient";
import { getCatalog } from "@/lib/db/server";

export const metadata: Metadata = {
  title: "Cek Transaksi",
  description:
    "Lacak status transaksi Ludexa Store dengan kode referensi atau nomor tujuan. Riwayat transaksi tersimpan di perangkat kamu.",
  alternates: { canonical: "/cek" },
  openGraph: {
    title: "Cek Transaksi — Ludexa Store",
    description:
      "Lacak status transaksi dengan kode referensi atau nomor tujuan.",
    url: "/cek",
  },
};

export default async function CekPage() {
  const result = await getCatalog();
  return (
    <CekClient
      services={result.data?.services ?? []}
      brandSlug={result.data?.brand.slug ?? process.env.BRAND_SLUG ?? ""}
    />
  );
}
