import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = {
  title: "E-Wallet",
  description: "Top up saldo DANA, OVO, GoPay, dan ShopeePay dengan cashback menarik.",
  openGraph: {
    title: "E-Wallet — Ludexa Store",
    description: "Top up saldo DANA, OVO, GoPay, dan ShopeePay dengan cashback menarik.",
    url: "/ewallet",
  },
};

export default function Page() {
  return <Checkout fixedId="wallet" />;
}
