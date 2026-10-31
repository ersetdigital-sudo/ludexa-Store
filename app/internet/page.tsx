import type { Metadata } from "next";
import { CheckoutSection } from "@/components/CheckoutSection";

export const metadata: Metadata = {
  title: "Internet & TV",
  description: "Bayar tagihan internet dan TV kabel provider pilihan Anda.",
  openGraph: {
    title: "Internet & TV — Ludexa Store",
    description: "Bayar tagihan internet dan TV kabel provider pilihan Anda.",
    url: "/internet",
  },
};

export default function Page() {
  return <CheckoutSection fixedId="internet" />;
}
