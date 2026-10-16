import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Bayar",
  description: "Halaman transaksi Ludexa Store: pilih layanan, isi nomor tujuan, lalu bayar lewat QRIS, transfer bank, atau e-wallet.",
  openGraph: {
    title: "Bayar — Ludexa Store",
    description: "Halaman transaksi Ludexa Store: pilih layanan, isi nomor tujuan, lalu bayar lewat QRIS, transfer bank, atau e-wallet.",
    url: "/bayar",
  },
};

export default function Page() {
  return <Checkout />;
}
