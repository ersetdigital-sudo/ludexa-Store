import type { Metadata } from "next";
import { CheckoutSection } from "@/components/CheckoutSection";
import { DataUnavailable } from "@/components/DataUnavailable";
import { PaymentStatus } from "@/components/PaymentStatus";
import { getOrderByRef, getPaymentByRef } from "@/lib/db/server";

export const metadata: Metadata = {
  title: "Bayar",
  description:
    "Halaman transaksi Ludexa Store: pilih layanan, isi nomor tujuan, lalu bayar lewat QRIS, transfer bank, atau e-wallet.",
  openGraph: {
    title: "Bayar — Ludexa Store",
    description:
      "Halaman transaksi Ludexa Store: pilih layanan, isi nomor tujuan, lalu bayar lewat QRIS, transfer bank, atau e-wallet.",
    url: "/bayar",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; layanan?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref?.trim();

  if (ref) {
    const [payment, order] = await Promise.all([
      getPaymentByRef(ref),
      getOrderByRef(ref),
    ]);
    if (!payment.data) {
      return <DataUnavailable message={payment.error} />;
    }
    return (
      <PaymentStatus
        payment={payment.data}
        sn={order.data?.[0]?.sn ?? null}
      />
    );
  }

  return <CheckoutSection fixedId={params.layanan} />;
}
