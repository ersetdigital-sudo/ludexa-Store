import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Paket Data",
  description: "Beli paket data / kuota internet semua operator. Pilih nominal, isi nomor, bayar, langsung aktif.",
  openGraph: {
    title: "Paket Data — Ludexa Store",
    description: "Beli paket data / kuota internet semua operator. Pilih nominal, isi nomor, bayar, langsung aktif.",
    url: "/data",
  },
};

export default function Page() {
  return <Checkout fixedId="data" />;
}
