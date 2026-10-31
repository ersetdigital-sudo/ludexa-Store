import type { Metadata } from "next";
import { CheckoutSection } from "@/components/CheckoutSection";

export const metadata: Metadata = {
  title: "Bayar PDAM",
  description: "Cek dan bayar tagihan air PDAM dengan cepat langsung dari HP.",
  openGraph: {
    title: "Bayar PDAM — Ludexa Store",
    description: "Cek dan bayar tagihan air PDAM dengan cepat langsung dari HP.",
    url: "/pdam",
  },
};

export default function Page() {
  return <CheckoutSection fixedId="pdam" />;
}
