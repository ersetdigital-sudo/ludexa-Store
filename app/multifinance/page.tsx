import type { Metadata } from "next";
import { CheckoutSection } from "@/components/CheckoutSection";

export const metadata: Metadata = {
  title: "Multifinance",
  description: "Bayar angsuran multifinance dan cicilan kendaraan tepat waktu.",
  openGraph: {
    title: "Multifinance — Ludexa Store",
    description: "Bayar angsuran multifinance dan cicilan kendaraan tepat waktu.",
    url: "/multifinance",
  },
};

export default function Page() {
  return <CheckoutSection fixedId="multifinance" />;
}
