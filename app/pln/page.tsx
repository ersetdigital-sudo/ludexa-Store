import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Token PLN",
  description: "Beli token listrik PLN prabayar. Masukkan ID pelanggan, bayar, token langsung terkirim.",
  openGraph: {
    title: "Token PLN — Ludexa Store",
    description: "Beli token listrik PLN prabayar. Masukkan ID pelanggan, bayar, token langsung terkirim.",
    url: "/pln",
  },
};

export default function Page() {
  return <Checkout fixedId="pln" />;
}
