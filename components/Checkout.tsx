"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { detectOperator } from "@/data/checkout";
import { Icon } from "./Icon";
import { WaIconConfirm } from "./WaIcon";
import { serviceMeta, type PaymentMethod, type Service } from "@/lib/catalog";
import {
  checkOrder,
  checkVoucher,
  createBillCheck,
  createOrder,
  getPayment,
} from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { PUBLIC_STATUS } from "@/lib/db/status";
import type {
  OrderLookup,
  PaymentInfo,
  VoucherCheck,
  WebBrand,
} from "@/lib/db/types";
import { rp } from "@/lib/format";
import { saveRef } from "@/lib/refs";

type Pending = "order" | "bill" | "verify" | null;
type Msg = { cls: string; text: string };

const V_MSG_GREY = "text-xs mt-2 text-[#7a6b78]";
const V_MSG_GREEN = "text-xs mt-2 text-[#16835e] font-semibold";
const V_MSG_ORANGE = "text-xs mt-2 text-[#c25a17]";
const V_MSG_RED = "text-xs mt-2 text-red-500";

function Step({ n, current, label }: { n: number; current: number; label: string }) {
  const state = n < current ? "done" : n === current ? "on" : "";
  return (
    <div className={"step" + (state ? " " + state : "")}>
      <span className="n">{n < current ? "✓" : n}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

function Row({ a, b, c = "" }: { a: string; b: React.ReactNode; c?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[#7a6b78]">{a}</span>
      <b className={"text-right " + c}>{b}</b>
    </div>
  );
}

function buildWaHref(waCs: string | null, message: string) {
  const digits = (waCs ?? "").replace(/\D/g, "");
  if (!digits) return "#";
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
}

function waDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) digits = "0" + digits.slice(2);
  else if (digits.startsWith("8")) digits = "0" + digits;
  return digits;
}

export function Checkout({
  fixedId,
  services,
  methods,
  brand,
}: {
  fixedId?: string;
  services: Service[];
  methods: PaymentMethod[];
  brand: WebBrand;
}) {
  const initial = (services.find((service) => service.id === fixedId) ??
    services[0]) as Service;
  const [cur, setCur] = useState<Service>(initial);
  const [isFixed, setIsFixed] = useState<boolean>(!!fixedId);
  const [item, setItem] = useState<[string, number, string] | null>(null);
  const [itemIdx, setItemIdx] = useState<number | null>(null);
  const [pay, setPay] = useState(0);
  const [step, setStep] = useState(1);
  const [num, setNum] = useState("");
  const [wa, setWa] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [showWaErr, setShowWaErr] = useState(false);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [vCode, setVCode] = useState("");
  const [voucherCheck, setVoucherCheck] = useState<VoucherCheck | null>(null);
  const [voucherBusy, setVoucherBusy] = useState(false);
  const [tx, setTx] = useState<PaymentInfo | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sn, setSn] = useState<string | null>(null);
  const [rDate, setRDate] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const prevStep = useRef(1);

  const method = methods[pay] ?? methods[0];

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (fixedId) qs.set("layanan", fixedId);
    if (!qs.get("layanan")) {
      let stored: string | null = null;
      try {
        stored = sessionStorage.getItem("ldx_svc") || localStorage.getItem("ldx_svc");
      } catch {
        stored = null;
      }
      if (stored) qs.set("layanan", stored);
    }
    const found = services.find((service) => service.id === qs.get("layanan"));
    if (found) {
      setCur(found);
      setIsFixed(true);
    }
    let number: string | null = null;
    try {
      number = localStorage.getItem("ldx_no");
      localStorage.removeItem("ldx_no");
    } catch {
      number = null;
    }
    if (!qs.get("no") && number) qs.set("no", number);
    if (qs.get("no")) setNum(qs.get("no") as string);

    let code: string | null = qs.get("voucher");
    try {
      code = code || localStorage.getItem("ldx_voucher");
    } catch {
      code = code;
    }
    if (code) {
      setVoucher(code.trim().toUpperCase());
      setVCode(code.trim().toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== 1 && prevStep.current === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevStep.current = step;
  }, [step]);

  useEffect(() => {
    if (!tx || tx.status !== "menunggu_bayar" || !tx.expires_at) {
      setRemaining(null);
      return;
    }
    const target = new Date(tx.expires_at).getTime();
    const update = () => {
      setRemaining(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [tx]);

  useEffect(() => {
    if (!voucher) {
      setVoucherCheck(null);
      return;
    }
    let active = true;
    setVoucherBusy(true);
    checkVoucher({
      brandSlug: brand.slug,
      code: voucher,
      serviceId: cur.dbId,
      subtotal: item?.[1] ?? 0,
    })
      .then((result) => {
        if (active) setVoucherCheck(result);
      })
      .catch((error) => {
        if (active) {
          setVoucherCheck({
            valid: false,
            potongan: 0,
            pesan: toPublicError(error).message,
          });
        }
      })
      .finally(() => {
        if (active) setVoucherBusy(false);
      });
    return () => {
      active = false;
    };
  }, [voucher, brand.slug, cur.dbId, item?.[1]]);

  const digits = num.replace(/\D/g, "");
  const valid = digits.length >= 8;
  const waValid = (() => {
    const d = waDigits(wa);
    return d.startsWith("08") && d.length >= 10 && d.length <= 14;
  })();
  const opInfo = detectOperator(num, cur.id);

  const discount =
    voucherCheck?.valid && item ? Math.max(0, voucherCheck.potongan) : 0;
  const previewTotal = item
    ? Math.max(0, item[1] + (method?.fee ?? 0) - discount)
    : 0;
  const expired =
    tx?.status === "menunggu_bayar" &&
    remaining !== null &&
    remaining <= 0;

  const vMsg: Msg | null = (() => {
    if (!voucher) return null;
    if (voucherBusy && !voucherCheck) {
      return { cls: V_MSG_GREY, text: "Memeriksa voucher…" };
    }
    if (!voucherCheck) return null;
    if (!voucherCheck.valid) {
      return { cls: V_MSG_RED, text: voucherCheck.pesan };
    }
    if (!item) {
      return {
        cls: V_MSG_GREY,
        text: `Voucher ${voucher} dipasang. Pilih produk untuk melihat potongan.`,
      };
    }
    if (discount > 0) {
      return {
        cls: V_MSG_GREEN,
        text: `✓ ${voucherCheck.pesan} Hemat ${rp(discount)}.`,
      };
    }
    return { cls: V_MSG_ORANGE, text: voucherCheck.pesan };
  })();

  function onVoucherBtn() {
    if (voucher) {
      setVoucher(null);
      setVCode("");
      setVoucherCheck(null);
      return;
    }
    const code = vCode.trim().toUpperCase();
    if (!code) return;
    setVoucher(code);
  }

  function selectService(id: string) {
    const next = services.find((service) => service.id === id);
    if (!next) return;
    setCur(next);
    setItem(null);
    setItemIdx(null);
    setShowErr(false);
    setShowWaErr(false);
    setSubmitError(null);
  }

  function inputPayload() {
    const value = num.trim();
    if (cur.inputs.length === 0) {
      return { nomor_tujuan: value };
    }
    return { [cur.inputs[0].key]: value };
  }

  async function goPay() {
    if (!item || !method || pending) {
      if (!item) setShowErr(true);
      return;
    }
    setPending("order");
    setSubmitError(null);
    try {
      const created = await createOrder({
        brandSlug: brand.slug,
        serviceId: cur.dbId,
        productId: item[2],
        nomorTujuan: num.trim(),
        input: inputPayload(),
        paymentMethodId: method.id,
        voucherCode: voucherCheck?.valid ? voucher : null,
      });
      saveRef(created.ref);

      let info: PaymentInfo;
      try {
        info = await getPayment(created.ref);
      } catch {
        info = {
          ref: created.ref,
          status: "menunggu_bayar",
          total: created.total,
          nama_layanan: cur.n,
          nama_produk: item[0],
          nomor_tujuan: num.trim(),
          metode_bayar: method.name,
          tipe_metode: method.type === "ew" ? "ewallet" : method.type,
          biaya_admin: method.fee,
          potongan: discount,
          voucher_kode: voucherCheck?.valid ? voucher : null,
          qris_image_url: brand.qris_image_url,
          logo_url: brand.logo_url,
          nama_brand: brand.nama,
          wa_cs: brand.wa_cs,
          expires_at: created.expires_at,
          jam_cek_tagihan: brand.jam_cek_tagihan,
          nominal_tagihan: null,
          denda: 0,
          created_at: new Date().toISOString(),
        };
      }
      setTx(info);
      setSn(null);
      setStep(2);
    } catch (error) {
      setSubmitError(toPublicError(error).message);
    } finally {
      setPending(null);
    }
  }

  async function handleBill() {
    if (!method || pending) return;
    if (!valid) {
      setShowErr(true);
      return;
    }
    if (!waValid) {
      setShowWaErr(true);
      return;
    }
    setPending("bill");
    setSubmitError(null);
    try {
      const created = await createBillCheck({
        brandSlug: brand.slug,
        serviceId: cur.dbId,
        nomorTujuan: num.trim(),
        input: inputPayload(),
        waPembeli: waDigits(wa),
        paymentMethodId: method.id,
        voucherCode: voucherCheck?.valid ? voucher : null,
      });
      saveRef(created.ref);

      let info: PaymentInfo;
      try {
        info = await getPayment(created.ref);
      } catch {
        info = {
          ref: created.ref,
          status: "menunggu_cek",
          total: null,
          nama_layanan: cur.n,
          nama_produk: null,
          nomor_tujuan: num.trim(),
          metode_bayar: method.name,
          tipe_metode: method.type === "ew" ? "ewallet" : method.type,
          biaya_admin: method.fee,
          potongan: 0,
          voucher_kode: voucherCheck?.valid ? voucher : null,
          qris_image_url: brand.qris_image_url,
          logo_url: brand.logo_url,
          nama_brand: brand.nama,
          wa_cs: brand.wa_cs,
          expires_at: null,
          jam_cek_tagihan: created.jam_cek_tagihan ?? brand.jam_cek_tagihan,
          nominal_tagihan: null,
          denda: 0,
          created_at: new Date().toISOString(),
        };
      }
      setTx(info);
      setSn(null);
      setStep(2);
    } catch (error) {
      setSubmitError(toPublicError(error).message);
    } finally {
      setPending(null);
    }
  }

  async function confirmPaid() {
    if (!tx || pending) return;
    setPending("verify");
    try {
      const [payment, found] = await Promise.all([
        getPayment(tx.ref),
        checkOrder({ brandSlug: brand.slug, ref: tx.ref }).catch(
          () => [] as OrderLookup[],
        ),
      ]);
      setTx(payment);
      setSn(found[0]?.sn ?? null);
    } catch {
      /* status tetap memakai data terakhir */
    } finally {
      setRDate(
        new Date().toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      );
      setPending(null);
      setStep(3);
    }
  }

  const mmss =
    remaining === null
      ? "--:--"
      : String(Math.max(0, Math.floor(remaining / 60))).padStart(2, "0") +
        ":" +
        String(Math.max(0, remaining % 60)).padStart(2, "0");

  const payBox =
    tx?.tipe_metode === "qr" ? (
      <>
        {tx.qris_image_url ? (
          <img
            src={tx.qris_image_url}
            alt="QRIS Ludexa"
            className="w-full max-w-[300px] mx-auto rounded-2xl border border-[#f2e6ec] shadow-sm"
          />
        ) : null}
        {tx.qris_image_url ? (
          <a
            href={tx.qris_image_url}
            download="QRIS-Ludexa.jpg"
            target="_blank"
            rel="noopener"
            className="inline-block mt-3 text-sm font-bold text-[#e0337a]"
          >
            ⬇ Unduh QRIS
          </a>
        ) : null}
        <div className="mt-3 text-left text-sm bg-[#fff8eb] rounded-xl p-3 text-[#7a4b06]">
          <b>Penting:</b> scan pakai aplikasi bank/e-wallet, lalu masukkan
          nominal <b>persis {rp(tx.total ?? 0)}</b> agar pembayaran mudah
          dicek.
        </div>
      </>
    ) : tx?.tipe_metode === "va" ? (
      <>
        <div className="text-sm text-[#7a6b78]">Nomor Virtual Account</div>
        <div className="mt-1 text-2xl font-extrabold font-mono tracking-wider">
          8808 {tx.ref.slice(-8, -4)} {tx.ref.slice(-4)} 21
        </div>
        <p className="text-sm text-[#7a6b78] mt-3">
          Transfer lewat m-banking / ATM sesuai total di atas.
        </p>
      </>
    ) : (
      <>
        <div className="w-16 h-16 mx-auto rounded-2xl t-purple p-4">
          <Icon name="wallet" className="w-full h-full" />
        </div>
        <p className="text-sm text-[#7a6b78] mt-3">
          Notifikasi pembayaran dikirim ke aplikasi{" "}
          <b>{tx?.metode_bayar ?? "e-wallet"}</b> kamu. Buka aplikasi lalu
          konfirmasi.
        </p>
      </>
    );

  const waMessage = tx
    ? `Halo CS ${brand.nama}, saya ingin konfirmasi pembayaran:\n\nKode referensi: ${tx.ref}\nProduk: ${tx.nama_produk ?? tx.nama_layanan}\nNomor tujuan: ${tx.nomor_tujuan}\nMetode: ${tx.metode_bayar ?? "-"}\nTotal: ${tx.total !== null ? rp(tx.total) : "belum ditetapkan"}\n\nBukti transfer saya lampirkan. Terima kasih.`
    : "";
  const waHref = buildWaHref(brand.wa_cs, waMessage);

  const title = isFixed ? (cur.bill ? "Bayar " : "Beli ") + cur.n : "Transaksi";
  const statusMeta = tx ? PUBLIC_STATUS[expired ? "dibatalkan" : tx.status] : null;

  return (
    <main className="max-w-6xl mx-auto px-5 py-8 md:py-10">
      <div className="rounded-[28px] bg-[#fff0f6] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {isFixed && (
            <span className={`rounded-2xl p-3 w-14 h-14 shrink-0 t-${cur.t}`}>
              <Icon name={serviceMeta(cur.id).icon} className="w-full h-full" />
            </span>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
            {isFixed && (
              <Link
                href="/#layanan"
                className="text-sm font-semibold text-[#e0337a]"
              >
                ← Ganti layanan
              </Link>
            )}
          </div>
        </div>
        <div className="bg-white rounded-full px-4 py-3 flex items-center gap-3 md:min-w-[420px] border border-[#f9d4e3]">
          <Step n={1} current={step} label="Isi data" />
          <div className={"bar" + (step > 1 ? " done" : "")} />
          <Step n={2} current={step} label="Pembayaran" />
          <div className={"bar" + (step > 2 ? " done" : "")} />
          <Step n={3} current={step} label="Verifikasi" />
        </div>
      </div>

      {/* STEP 1 */}
      <section className={step === 1 ? "mt-6" : "mt-6 hidden"}>
        {!isFixed && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => selectService(service.id)}
                className={
                  "opt !py-2 !px-4 whitespace-nowrap font-semibold text-sm flex items-center gap-2 " +
                  (service.id === cur.id ? "active" : "")
                }
              >
                <Icon
                  name={serviceMeta(service.id).icon}
                  className="w-5 h-5"
                />
                {service.n}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-4">
            {/* A — nomor tujuan */}
            <div className="bg-white rounded-[22px] border border-[#f4e8ee] p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#1f1630] text-white text-xs font-extrabold grid place-items-center">
                  A
                </span>
                <label htmlFor="num" className="font-bold">
                  {cur.f}
                </label>
              </div>
              <div className="relative">
                <input
                  id="num"
                  className="field !pr-36"
                  inputMode="numeric"
                  placeholder={cur.ph}
                  value={num}
                  onChange={(e) =>
                    setNum(e.target.value.replace(/[^\d +]/g, ""))
                  }
                />
                {opInfo.kind === "op" && (
                  <span
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-white"
                    style={{
                      background: opInfo.op.color,
                      color:
                        opInfo.op.name === "Indosat" ? "#1f1630" : "#fff",
                    }}
                  >
                    <span className="w-4 h-4 rounded-full bg-white/30 grid place-items-center text-[9px]">
                      {opInfo.op.name[0]}
                    </span>
                    {opInfo.op.name}
                  </span>
                )}
              </div>
              {opInfo.kind === "hint" && (
                <p className="text-xs text-[#7a6b78] mt-2">
                  Operator tidak dikenali, periksa kembali nomor HP.
                </p>
              )}
              {showErr && !valid && (
                <p className="text-red-500 text-sm mt-2">
                  Mohon isi nomor dengan benar (min. 8 digit).
                </p>
              )}

              {cur.bill && (
                <div className="mt-5">
                  <label htmlFor="wa" className="font-bold">
                    Nomor WhatsApp
                  </label>
                  <input
                    id="wa"
                    className="field mt-2"
                    inputMode="tel"
                    placeholder="08xx xxxx xxxx"
                    value={wa}
                    onChange={(e) =>
                      setWa(e.target.value.replace(/[^\d +]/g, ""))
                    }
                  />
                  <p className="text-xs text-[#7a6b78] mt-2">
                    Nominal dan link bayar dikirim admin ke WhatsApp ini.
                  </p>
                  {(showWaErr || wa.length > 0) && !waValid && (
                    <p className="text-red-500 text-sm mt-2">
                      Nomor WhatsApp wajib diisi dengan format 08xx.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* B — nominal / tagihan */}
            <div className="bg-white rounded-[22px] border border-[#f4e8ee] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1f1630] text-white text-xs font-extrabold grid place-items-center">
                  B
                </span>
                <div className="font-bold">
                  {cur.bill ? "Cek tagihan" : "Pilih nominal"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {cur.bill ? (
                  <div className="col-span-2 rounded-2xl bg-[#fff8fb] border border-dashed border-[#f9c6da] p-5 text-sm text-[#5a4b58]">
                    Tagihan dicek manual oleh admin. Setelah dikirim, buka link
                    bayar atau halaman Cek Transaksi untuk melihat nominal dan
                    melanjutkan pembayaran.
                  </div>
                ) : (
                  cur.items?.map((it, i) => (
                    <button
                      key={it[0]}
                      type="button"
                      onClick={() => {
                        setItem(it);
                        setItemIdx(i);
                        setSubmitError(null);
                      }}
                      className={"opt" + (itemIdx === i ? " active" : "")}
                    >
                      <div className="font-semibold">{it[0]}</div>
                      <div className="text-[#e0337a] font-bold mt-1">
                        {rp(it[1])}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* C — metode pembayaran */}
            <div className="bg-white rounded-[22px] border border-[#f4e8ee] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1f1630] text-white text-xs font-extrabold grid place-items-center">
                  C
                </span>
                <div className="font-bold">Metode pembayaran</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {methods.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPay(i)}
                    className={"opt" + (i === pay ? " active" : "")}
                  >
                    <div className="font-semibold text-sm">{p.name}</div>
                    <div className="text-xs text-[#7a6b78]">
                      {p.fee ? "Admin " + rp(p.fee) : "Gratis admin"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* struk belanja */}
          <aside
            className="rounded-[24px] p-6 lg:sticky lg:top-24 border-2 border-[#1f1630] bg-white"
            style={{ boxShadow: "6px 6px 0 #e0337a" }}
          >
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-lg">Struk belanja</div>
              <span className="text-[10px] font-bold tracking-[.2em] text-[#e0337a]">
                LUDEXA
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Layanan</dt>
                <dd className="font-semibold">{cur.n}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Nomor</dt>
                <dd className="font-semibold">{num || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Produk</dt>
                <dd className="font-semibold text-right">
                  {item ? item[0] : cur.bill ? "Menunggu cek admin" : "-"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Metode</dt>
                <dd className="font-semibold">{method?.name ?? "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Biaya admin</dt>
                <dd className="font-semibold">
                  {rp(item && method ? method.fee : 0)}
                </dd>
              </div>
            </dl>

            <div className="mt-5">
              <label className="text-sm font-bold block mb-2" htmlFor="vIn">
                Kode voucher
              </label>
              <div className="flex gap-2">
                <input
                  id="vIn"
                  value={vCode}
                  onChange={(e) => setVCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onVoucherBtn();
                    }
                  }}
                  className="field !py-2.5 !text-sm uppercase font-mono"
                  placeholder="Contoh: LUDOBARU"
                />
                <button
                  type="button"
                  onClick={onVoucherBtn}
                  disabled={voucherBusy}
                  className="btn btn-ghost !py-2 !px-4 text-sm shrink-0"
                >
                  {voucher ? "Hapus" : "Pakai"}
                </button>
              </div>
              {vMsg && <p className={vMsg.cls}>{vMsg.text}</p>}
            </div>

            {voucher && discount > 0 && (
              <div className="mt-3 text-sm flex justify-between">
                <span className="text-[#16835e] font-semibold">
                  Diskon voucher
                </span>
                <b className="text-[#16835e]">-{rp(discount)}</b>
              </div>
            )}

            <div className="border-t border-dashed border-[#efd5e0] my-5" />
            <div className="flex justify-between items-end">
              <span className="text-[#7a6b78]">Total</span>
              <span className="text-2xl font-extrabold text-[#e0337a]">
                {cur.bill && !item ? "Menunggu cek" : rp(previewTotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => (cur.bill ? handleBill() : goPay())}
              disabled={
                pending !== null ||
                (cur.bill ? !valid || !waValid : !item)
              }
              className="btn w-full mt-6"
            >
              {pending === "order" || pending === "bill"
                ? "Memproses…"
                : cur.bill
                  ? "Cek Tagihan"
                  : "Lanjut ke Pembayaran"}
            </button>
            {submitError && (
              <p className="text-xs text-red-500 mt-3 text-center">
                {submitError}
              </p>
            )}
            <p className="text-xs text-[#7a6b78] mt-3 text-center">
              Pembayaran diverifikasi manual oleh admin.
            </p>
          </aside>
        </div>
      </section>

      {/* STEP 2 */}
      <section className={step === 2 ? "mt-6" : "mt-6 hidden"}>
        <div
          className="max-w-xl mx-auto bg-white rounded-[24px] border-2 border-[#1f1630] p-6 md:p-8 text-center"
          style={{ boxShadow: "6px 6px 0 #e0337a" }}
        >
          {tx?.status === "menunggu_cek" ? (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="badge b-wait">Lagi dicek admin</span>
                <span className="font-semibold text-[#7a6b78]">
                  {tx.jam_cek_tagihan ?? "08.00 - 21.00"}
                </span>
              </div>
              <div className="mt-6 text-2xl font-extrabold">
                Tagihan sedang dicek
              </div>
              <p className="text-sm text-[#7a6b78] mt-2">
                Admin akan mengisi nominal dan mengirim link bayar ke WhatsApp
                kamu. Simpan kode referensi di bawah.
              </p>
              <div className="mt-5 text-left bg-[#fbf6f9] rounded-2xl p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Layanan</span>
                  <b>{tx.nama_layanan}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Nomor tujuan</span>
                  <b>{tx.nomor_tujuan}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Kode referensi</span>
                  <b className="font-mono">{tx.ref}</b>
                </div>
              </div>
              <Link
                href={`/cek?q=${encodeURIComponent(tx.ref)}`}
                className="btn w-full mt-6"
              >
                Cek Status Transaksi
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost w-full mt-3"
              >
                Hubungi CS
              </a>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className={statusMeta?.badgeClass ?? "badge b-wait"}>
                  {expired
                    ? "Waktu habis"
                    : tx?.status === "menunggu_bayar"
                      ? "Menunggu pembayaran"
                      : (statusMeta?.label ?? "Menunggu pembayaran")}
                </span>
                <span className="font-semibold text-[#7a6b78]">
                  Sisa waktu <b className="text-[#1f1630]">{mmss}</b>
                </span>
              </div>
              <div className="mt-6 text-[#7a6b78] text-sm">
                Total pembayaran
              </div>
              <div className="text-3xl font-extrabold text-[#e0337a]">
                {tx?.total !== null && tx?.total !== undefined
                  ? rp(tx.total)
                  : "Belum ditetapkan"}
              </div>
              <div className="mt-6">
                {expired ? (
                  <div className="rounded-2xl bg-[#fff8eb] p-4 text-sm text-[#7a4b06]">
                    Waktu pembayaran sudah habis. Silakan cek status transaksi
                    atau buat pesanan baru.
                  </div>
                ) : (
                  payBox
                )}
              </div>
              <div className="mt-5 text-left bg-[#fbf6f9] rounded-2xl p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Produk</span>
                  <b>{tx?.nama_produk ?? tx?.nama_layanan}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Nomor tujuan</span>
                  <b>{tx?.nomor_tujuan}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7a6b78]">Kode referensi</span>
                  <b className="font-mono">{tx?.ref}</b>
                </div>
              </div>
              <button
                type="button"
                onClick={confirmPaid}
                disabled={pending === "verify" || expired}
                className="btn w-full mt-6"
              >
                {pending === "verify"
                  ? "Memproses…"
                  : "Saya Sudah Bayar"}
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost w-full mt-3"
              >
                Konfirmasi via WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-3 text-sm font-semibold text-[#7a6b78]"
              >
                ← Ubah pesanan
              </button>
            </>
          )}
        </div>
      </section>

      {/* STEP 3 */}
      <section className={step === 3 ? "mt-6" : "mt-6 hidden"}>
        <div
          className="max-w-md mx-auto bg-white rounded-[24px] border-2 border-[#1f1630] overflow-hidden"
          style={{ boxShadow: "6px 6px 0 #e0337a" }}
        >
          <div
            className="p-8 text-center text-white"
            style={{ background: "#2a1526" }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-[#b7700b] p-4">
              <Icon name="clock" className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-extrabold mt-4">Terima kasih!</h2>
            <p className="text-white/90 mt-1">
              Pembayaran Anda sedang dalam pengecekan.
            </p>
            <p className="text-white/70 text-xs mt-2">{rDate}</p>
          </div>
          <div className="p-6 text-sm space-y-3">
            <Row
              a="Status"
              b={
                <span className="badge b-wait">
                  {tx?.status === "sukses" ? "Sukses" : "Menunggu verifikasi admin"}
                </span>
              }
            />
            <Row a="Kode referensi" b={tx?.ref} c="font-mono" />
            <Row a="Layanan" b={tx?.nama_layanan} />
            <Row a="Produk" b={tx?.nama_produk ?? "-"} />
            <Row a="Nomor tujuan" b={tx?.nomor_tujuan} />
            <Row a="Metode" b={tx?.metode_bayar ?? "-"} />
            <Row
              a={/PLN/i.test(tx?.nama_layanan ?? "") ? "Token" : "Serial number"}
              b={sn ?? "Akan dikirim setelah verifikasi"}
              c="font-mono text-[#e0337a]"
            />
            {tx?.potongan ? (
              <Row
                a={"Voucher " + (tx.voucher_kode ?? "")}
                b={"-" + rp(tx.potongan)}
                c="text-[#16835e]"
              />
            ) : null}
            <div className="border-t border-dashed border-[#efd5e0]" />
            <Row
              a="Total dibayar"
              b={tx?.total !== null && tx?.total !== undefined ? rp(tx.total) : "-"}
              c="text-lg text-[#e0337a]"
            />
            <p className="text-xs text-[#7a6b78] bg-[#fff8eb] rounded-xl p-3 mt-2">
              Verifikasi biasanya 1–5 menit. Simpan kode referensi dan pantau
              statusnya di menu Cek Transaksi.
            </p>
          </div>
          <div className="px-6">
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="btn w-full !bg-[#25d366] hover:!bg-[#1ebe5a] !shadow-[0_10px_24px_-10px_rgba(37,211,102,.7)]"
              style={{ background: "#25d366" }}
            >
              <WaIconConfirm />
              Konfirmasi via WhatsApp
            </a>
            <p className="text-xs text-center text-[#7a6b78] mt-2 mb-4">
              Kirim bukti bayar ke CS agar verifikasi lebih cepat.
            </p>
          </div>
          <div className="px-6 pb-6 grid grid-cols-2 gap-3">
            <Link
              href={"/cek?q=" + encodeURIComponent(tx?.ref ?? "")}
              className="btn btn-ghost"
            >
              Cek Status
            </Link>
            <Link href="/bayar" className="btn">
              Transaksi Lagi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
