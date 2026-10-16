import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

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
  return <Checkout fixedId="fin" />;
}
