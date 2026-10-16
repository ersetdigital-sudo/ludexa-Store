import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Bayar BPJS",
  description: "Bayar iuran BPJS Kesehatan bulanan tanpa antre, kapan saja.",
  openGraph: {
    title: "Bayar BPJS — Ludexa Store",
    description: "Bayar iuran BPJS Kesehatan bulanan tanpa antre, kapan saja.",
    url: "/bpjs",
  },
};

export default function Page() {
  return <Checkout fixedId="bpjs" />;
}
