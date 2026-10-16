import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

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
  return <Checkout fixedId="inet" />;
}
