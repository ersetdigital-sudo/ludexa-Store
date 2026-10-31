"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { WaIconConfirm } from "./WaIcon";
import { PUBLIC_STATUS } from "@/lib/db/status";
import type { PaymentInfo } from "@/lib/db/types";
import { fmtDate, rp } from "@/lib/format";

function waHref(waCs: string | null, message: string) {
  const digits = (waCs ?? "").replace(/\D/g, "");
  if (!digits) return "#";
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
}

export function PaymentStatus({
  payment,
  sn = null,
}: {
  payment: PaymentInfo;
  sn?: string | null;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (payment.status !== "menunggu_bayar" || !payment.expires_at) {
      setRemaining(null);
      return;
    }
    const target = new Date(payment.expires_at).getTime();
    const update = () => {
      setRemaining(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [payment.status, payment.expires_at]);

  const expired =
    payment.status === "menunggu_bayar" &&
    remaining !== null &&
    remaining <= 0;
  const status = expired ? "dibatalkan" : payment.status;
  const meta = PUBLIC_STATUS[status];
  const total =
    payment.total !== null ? rp(payment.total) : "Belum ditetapkan";
  const mmss =
    remaining === null
      ? "--:--"
      : String(Math.max(0, Math.floor(remaining / 60))).padStart(2, "0") +
        ":" +
        String(Math.max(0, remaining % 60)).padStart(2, "0");

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(payment.ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  const waMessage = `Halo CS ${payment.nama_brand}, saya ingin konfirmasi pembayaran:\n\nKode referensi: ${payment.ref}\nProduk: ${payment.nama_produk ?? payment.nama_layanan}\nNomor tujuan: ${payment.nomor_tujuan}\nMetode: ${payment.metode_bayar ?? "-"}\nTotal: ${payment.total !== null ? rp(payment.total) : "belum ditetapkan"}\n\nBukti transfer saya lampirkan. Terima kasih.`;
  const chatUrl = waHref(payment.wa_cs, waMessage);

  const payBox =
    payment.tipe_metode === "qr" ? (
      <>
        {payment.qris_image_url ? (
          <img
            src={payment.qris_image_url}
            alt="QRIS pembayaran"
            className="w-full max-w-[300px] mx-auto rounded-2xl border border-[#f2e6ec] shadow-sm"
          />
        ) : null}
        {payment.total !== null ? (
          <div className="mt-3 text-left text-sm bg-[#fff8eb] rounded-xl p-3 text-[#7a4b06]">
            <b>Penting:</b> scan pakai aplikasi bank/e-wallet, lalu masukkan
            nominal <b>persis {total}</b>.
          </div>
        ) : null}
      </>
    ) : payment.tipe_metode === "va" ? (
      <>
        <div className="text-sm text-[#7a6b78]">Nomor Virtual Account</div>
        <div className="mt-1 text-2xl font-extrabold font-mono tracking-wider">
          8808 {payment.ref.slice(-8, -4)} {payment.ref.slice(-4)} 21
        </div>
        <p className="text-sm text-[#7a6b78] mt-3">
          Transfer lewat m-banking / ATM sesuai total di atas.
        </p>
      </>
    ) : payment.tipe_metode === "ewallet" ? (
      <>
        <div className="w-16 h-16 mx-auto rounded-2xl t-purple p-4">
          <Icon name="wallet" className="w-full h-full" />
        </div>
        <p className="text-sm text-[#7a6b78] mt-3">
          Notifikasi pembayaran dikirim ke aplikasi{" "}
          <b>{payment.metode_bayar ?? "e-wallet"}</b> kamu.
        </p>
      </>
    ) : null;

  return (
    <main className="max-w-6xl mx-auto px-5 py-8 md:py-10">
      <div className="rounded-[28px] bg-[#fff0f6] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">
            STATUS PEMBAYARAN
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-2">
            {payment.nama_produk ?? payment.nama_layanan}
          </h1>
          <p className="text-sm text-[#7a6b78] mt-1">
            {payment.nama_layanan} · {payment.nomor_tujuan}
          </p>
        </div>
        <span className={meta.badgeClass}>{meta.label}</span>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div
          className="bg-white rounded-[24px] border-2 border-[#1f1630] p-6 md:p-8"
          style={{ boxShadow: "6px 6px 0 #e0337a" }}
        >
          {status === "menunggu_cek" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#fff3dc] text-[#b7700b] p-4">
                <Icon name="clock" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-extrabold mt-4">
                Tagihan sedang dicek admin
              </h2>
              <p className="text-sm text-[#7a6b78] mt-2 max-w-md mx-auto">
                Nominal dan link bayar akan dikirim ke WhatsApp kamu. Jam cek{" "}
                {payment.jam_cek_tagihan ?? "08.00 - 21.00"}.
              </p>
            </div>
          ) : status === "menunggu_bayar" ? (
            <div className="text-center">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                <span className="badge b-wait">Menunggu pembayaran</span>
                <span className="font-semibold text-[#7a6b78]">
                  Sisa waktu <b className="text-[#1f1630]">{mmss}</b>
                </span>
              </div>
              <div className="mt-6 text-[#7a6b78] text-sm">
                Total pembayaran
              </div>
              <div className="text-3xl font-extrabold text-[#e0337a]">
                {total}
              </div>
              <div className="mt-6">{payBox}</div>
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener"
                className="btn w-full mt-6 !bg-[#25d366] hover:!bg-[#1ebe5a]"
              >
                <WaIconConfirm />
                Konfirmasi via WhatsApp
              </a>
            </div>
          ) : status === "sudah_bayar" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#fff3dc] text-[#b7700b] p-4">
                <Icon name="clock" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-extrabold mt-4">
                Pembayaran sedang dicek admin
              </h2>
              <p className="text-sm text-[#7a6b78] mt-2">
                Verifikasi biasanya 1–5 menit.
              </p>
            </div>
          ) : status === "sukses" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#dcf5ec] text-[#16835e] p-4">
                <Icon name="check" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-extrabold mt-4">
                Transaksi sukses
              </h2>
              {sn ? (
                <p className="text-sm text-[#7a6b78] mt-3">
                  {/PLN/i.test(payment.nama_layanan)
                    ? "Token"
                    : "Serial number"}
                  :{" "}
                  <b className="font-mono text-[#e0337a]">{sn}</b>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#f4e8ee] text-[#7a6b78] p-4">
                <Icon name="clock" className="w-full h-full" />
              </div>
              <h2 className="text-2xl font-extrabold mt-4">
                Transaksi dibatalkan
              </h2>
              <p className="text-sm text-[#7a6b78] mt-2">
                Waktu pembayaran habis atau pesanan dibatalkan.
              </p>
              <Link href="/bayar" className="btn mt-6">
                Buat Pesanan Baru
              </Link>
            </div>
          )}
        </div>

        <aside className="bg-white rounded-[24px] border border-[#f4e8ee] p-6">
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">
            RINCIAN
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Kode referensi</dt>
              <dd className="font-mono font-bold text-right">
                {payment.ref}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Layanan</dt>
              <dd className="font-semibold">{payment.nama_layanan}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Nomor tujuan</dt>
              <dd className="font-semibold">{payment.nomor_tujuan}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Metode</dt>
              <dd className="font-semibold">
                {payment.metode_bayar ?? "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Biaya admin</dt>
              <dd className="font-semibold">{rp(payment.biaya_admin)}</dd>
            </div>
            {payment.potongan > 0 ? (
              <div className="flex justify-between gap-3">
                <dt className="text-[#16835e]">Voucher</dt>
                <dd className="font-semibold text-[#16835e]">
                  -{rp(payment.potongan)}
                </dd>
              </div>
            ) : null}
            <div className="border-t border-dashed border-[#efd5e0] pt-3 flex justify-between gap-3">
              <dt className="text-[#7a6b78]">Total</dt>
              <dd className="font-extrabold text-[#e0337a]">{total}</dd>
            </div>
            {payment.expires_at ? (
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Batas bayar</dt>
                <dd className="font-semibold text-right">
                  {fmtDate(payment.expires_at)}
                </dd>
              </div>
            ) : null}
          </dl>
          <button
            type="button"
            onClick={copyRef}
            className="btn btn-ghost w-full mt-5"
          >
            {copied ? "Referensi disalin" : "Salin Kode Referensi"}
          </button>
          <Link
            href={`/cek?q=${encodeURIComponent(payment.ref)}`}
            className="btn w-full mt-3"
          >
            Cek Status
          </Link>
        </aside>
      </div>
    </main>
  );
}
