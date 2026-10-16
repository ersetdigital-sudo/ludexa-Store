import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Beli Pulsa",
  description: "Beli pulsa semua operator dengan harga bersahabat. Proses instan, nomor HP terdeteksi otomatis.",
  openGraph: {
    title: "Beli Pulsa — Ludexa Store",
    description: "Beli pulsa semua operator dengan harga bersahabat. Proses instan, nomor HP terdeteksi otomatis.",
    url: "/pulsa",
  },
};

export default function Page() {
  return <Checkout fixedId="pulsa" />;
}
