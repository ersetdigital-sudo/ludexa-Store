"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SERVICES, svcById, type Service } from "@/data/services";
import { PAY, VCH, detectOperator } from "@/data/checkout";
import { Icon } from "./Icon";
import { WaIconConfirm } from "./WaIcon";
import { rp, waLink } from "@/lib/format";
import { TX, type Tx } from "@/lib/store";

const QRIS_IMG = "/images/qris-ludexa.jpg";

type Bill = { amt: number; last4: string };
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

export function Checkout({ fixedId }: { fixedId?: string }) {
  const [cur, setCur] = useState<Service>(() => svcById(fixedId) ?? SERVICES[0]);
  const [isFixed, setIsFixed] = useState<boolean>(() => !!fixedId);
  const [item, setItem] = useState<[string, number] | null>(null);
  const [itemIdx, setItemIdx] = useState<number | null>(null);
  const [pay, setPay] = useState(0);
  const [step, setStep] = useState(1);
  const [num, setNum] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [vCode, setVCode] = useState("");
  const [invalidVoucher, setInvalidVoucher] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [checking, setChecking] = useState(false);
  const [cekLabel, setCekLabel] = useState("Cek Tagihan");
  const [cd, setCd] = useState(900);
  const [tx, setTx] = useState<Tx | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [rDate, setRDate] = useState("");
  const prevStep = useRef(1);

  /* ---- inisialisasi dari URL & penyimpanan perangkat (sama seperti versi HTML) ---- */
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (fixedId) qs.set("layanan", fixedId);
    if (!qs.get("layanan")) {
      let v: string | null = null;
      try {
        v = sessionStorage.getItem("ldx_svc") || localStorage.getItem("ldx_svc");
      } catch {
        v = null;
      }
      if (v) qs.set("layanan", v);
    }
    let n: string | null = null;
    try {
      n = localStorage.getItem("ldx_no");
      localStorage.removeItem("ldx_no");
    } catch {
      n = null;
    }
    if (!qs.get("no") && n) qs.set("no", n);

    const found = svcById(qs.get("layanan"));
    if (found) {
      setCur(found);
      setIsFixed(true);
    }
    if (qs.get("no")) setNum(qs.get("no") as string);

    let v0: string | null = qs.get("voucher");
    try {
      v0 = v0 || localStorage.getItem("ldx_voucher");
    } catch {
      v0 = v0;
    }
    if (v0) applyV(v0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- perubahan halaman ---- */
  useEffect(() => {
    if (step !== 1 && prevStep.current === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevStep.current = step;
  }, [step]);

  /* ---- hitung mundur pembayaran ---- */
  useEffect(() => {
    if (step !== 2) return;
    let t = 900;
    setCd(t);
    const id = setInterval(() => {
      t -= 1;
      setCd(t);
      if (t <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  const digits = num.replace(/\D/g, "");
  const valid = digits.length >= 8;
  const opInfo = detectOperator(num, cur.id);

  const disc = () => {
    if (!voucher || !item) return 0;
    const v = VCH[voucher];
    if (v.only && !v.only.includes(cur.id)) return 0;
    if (v.min && item[1] < v.min) return 0;
    return v.pct ? Math.min(Math.round((item[1] * v.pct) / 100), v.max ?? 0) : v.flat ?? 0;
  };

  const total = () => (item ? Math.max(0, item[1] + PAY[pay][1] - disc()) : 0);

  const vMsg: Msg | null = invalidVoucher
    ? { cls: V_MSG_RED, text: "Kode voucher tidak valid." }
    : voucher
      ? !item
        ? { cls: V_MSG_GREY, text: `Voucher ${voucher} dipasang. Pilih produk untuk melihat potongan.` }
        : disc() > 0
          ? { cls: V_MSG_GREEN, text: "✓ " + VCH[voucher].label }
          : {
              cls: V_MSG_ORANGE,
              text:
                VCH[voucher].only && !VCH[voucher].only!.includes(cur.id)
                  ? "Voucher hanya untuk pulsa, paket data & token PLN."
                  : "Minimal transaksi " + rp(VCH[voucher].min ?? 0) + ".",
            }
      : null;

  function applyV(code?: string) {
    const c = (code || "").trim().toUpperCase();
    if (!c) {
      setVoucher(null);
      setInvalidVoucher(false);
      return;
    }
    if (!VCH[c]) {
      setVoucher(null);
      setInvalidVoucher(true);
      return;
    }
    setInvalidVoucher(false);
    setVoucher(c);
    setVCode(c);
  }

  function onVoucherBtn() {
    if (voucher) {
      setVoucher(null);
      setVCode("");
      setInvalidVoucher(false);
    } else {
      applyV(vCode);
    }
  }

  function selectService(id: string) {
    setCur(svcById(id) ?? SERVICES[0]);
    setItem(null);
    setItemIdx(null);
    setBill(null);
    setCekLabel("Cek Tagihan");
    setShowErr(false);
  }

  function checkBill() {
    if (!valid) {
      setShowErr(true);
      return;
    }
    setChecking(true);
    setCekLabel("Mengecek…");
    setTimeout(() => {
      const amt = (Math.floor(Math.random() * 40) + 8) * 5000;
      setItem(["Tagihan " + cur.n, amt]);
      setItemIdx(null);
      setBill({ amt, last4: digits.slice(-4) });
      setChecking(false);
      setCekLabel("Cek Ulang");
    }, 700);
  }

  function goPay() {
    if (!valid || !item) {
      if (!valid) setShowErr(true);
      return;
    }
    const p = PAY[pay];
    const t: Tx = {
      ref: "REF-LDX" + Date.now().toString().slice(-8),
      svc: cur.n,
      prod: item[0],
      no: num.trim(),
      method: p[0],
      admin: p[1],
      total: total(),
      disc: disc(),
      voucher: disc() ? voucher : null,
      time: new Date().toISOString(),
      status: "Menunggu",
    };
    setTx(t);
    setStep(2);
  }

  function confirmPaid() {
    if (!tx) return;
    setVerifying(true);
    setTimeout(() => {
      const done: Tx = { ...tx, status: "Diproses", sn: "Dikirim setelah verifikasi" };
      TX.save(done);
      setTx(done);
      setRDate(
        new Date(done.time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
      );
      setVerifying(false);
      setStep(3);
    }, 1200);
  }

  const mmss =
    String(Math.max(0, Math.floor(cd / 60))).padStart(2, "0") +
    ":" +
    String(Math.max(0, cd % 60)).padStart(2, "0");

  const payMethod = tx ? PAY[pay] : null;

  const payBox =
    payMethod?.[2] === "qr" ? (
      <>
        <Image
          src={QRIS_IMG}
          alt="QRIS Ludexa"
          width={1135}
          height={1600}
          className="w-full max-w-[300px] mx-auto rounded-2xl border border-[#f2e6ec] shadow-sm"
        />
        <a
          href={QRIS_IMG}
          download="QRIS-Ludexa.jpg"
          target="_blank"
          rel="noopener"
          className="inline-block mt-3 text-sm font-bold text-[#e0337a]"
        >
          ⬇ Unduh QRIS
        </a>
        <div className="mt-3 text-left text-sm bg-[#fff8eb] rounded-xl p-3 text-[#7a4b06]">
          <b>Penting:</b> scan pakai aplikasi bank/e-wallet, lalu masukkan nominal{" "}
          <b>persis {rp(tx?.total ?? 0)}</b> agar pembayaran mudah dicek.
        </div>
      </>
    ) : payMethod?.[2] === "va" ? (
      <>
        <div className="text-sm text-[#7a6b78]">Nomor Virtual Account</div>
        <div className="mt-1 text-2xl font-extrabold font-mono tracking-wider">
          8808 {tx?.ref.slice(-8, -4)} {tx?.ref.slice(-4)} 21
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
          Notifikasi pembayaran dikirim ke aplikasi <b>{payMethod?.[0]}</b> kamu. Buka aplikasi lalu
          konfirmasi.
        </p>
      </>
    );

  const waHref = tx
    ? waLink(
        `Halo CS Ludexa Store, saya ingin konfirmasi pembayaran:\n\nKode referensi: ${tx.ref}\nProduk: ${tx.prod}\nNomor tujuan: ${tx.no}\nMetode: ${tx.method}\nTotal: ${rp(tx.total)}\n\nBukti transfer saya lampirkan. Terima kasih.`
      )
    : "#";

  const title = isFixed ? (cur.bill ? "Bayar " : "Beli ") + cur.n : "Transaksi";

  return (
    <main className="max-w-6xl mx-auto px-5 py-8 md:py-10">
      <div className="rounded-[28px] bg-[#fff0f6] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          {isFixed && (
            <span className={`rounded-2xl p-3 w-14 h-14 shrink-0 t-${cur.t}`}>
              <Icon name={cur.id} className="w-full h-full" />
            </span>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
            {isFixed && (
              <Link href="/#layanan" className="text-sm font-semibold text-[#e0337a]">
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
            {SERVICES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectService(s.id)}
                className={
                  "opt !py-2 !px-4 whitespace-nowrap font-semibold text-sm flex items-center gap-2 " +
                  (s.id === cur.id ? "active" : "")
                }
              >
                <Icon name={s.id} className="w-5 h-5" />
                {s.n}
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
                  onChange={(e) => setNum(e.target.value.replace(/[^\d +]/g, ""))}
                />
                {opInfo.kind === "op" && (
                  <span
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-white"
                    style={{
                      background: opInfo.op.color,
                      color: opInfo.op.name === "Indosat" ? "#1f1630" : "#fff",
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
            </div>

            {/* B — nominal / tagihan */}
            <div className="bg-white rounded-[22px] border border-[#f4e8ee] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#1f1630] text-white text-xs font-extrabold grid place-items-center">
                  B
                </span>
                <div className="font-bold">{cur.bill ? "Cek tagihan" : "Pilih nominal"}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {cur.bill ? (
                  <>
                    <button
                      type="button"
                      onClick={checkBill}
                      disabled={checking}
                      className="btn btn-ghost col-span-2"
                    >
                      {cekLabel}
                    </button>
                    {/* billBox selalu dirender (kosong sampai tagihan dicek) agar tinggi grid sama dengan versi HTML */}
                    <div className="col-span-2">
                      {bill && (
                        <div className="opt active flex justify-between items-center">
                          <span>
                            <b>Tagihan bulan ini</b>
                            <br />
                            <span className="text-xs text-[#7a6b78]">
                              a.n. Pelanggan ****{bill.last4}
                            </span>
                          </span>
                          <b className="text-[#e0337a]">{rp(bill.amt)}</b>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  cur.items?.map((it, i) => (
                    <button
                      key={it[0]}
                      type="button"
                      onClick={() => {
                        setItem(it);
                        setItemIdx(i);
                      }}
                      className={"opt" + (itemIdx === i ? " active" : "")}
                    >
                      <div className="font-semibold">{it[0]}</div>
                      <div className="text-[#e0337a] font-bold mt-1">{rp(it[1])}</div>
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
                {PAY.map((p, i) => (
                  <button
                    key={p[0]}
                    type="button"
                    onClick={() => setPay(i)}
                    className={"opt" + (i === pay ? " active" : "")}
                  >
                    <div className="font-semibold text-sm">{p[0]}</div>
                    <div className="text-xs text-[#7a6b78]">
                      {p[1] ? "Admin " + rp(p[1]) : "Gratis admin"}
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
              <span className="text-[10px] font-bold tracking-[.2em] text-[#e0337a]">LUDEXA</span>
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
                <dd className="font-semibold text-right">{item ? item[0] : "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Metode</dt>
                <dd className="font-semibold">{PAY[pay][0]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#7a6b78]">Biaya admin</dt>
                <dd className="font-semibold">{rp(item ? PAY[pay][1] : 0)}</dd>
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
                  className="btn btn-ghost !py-2 !px-4 text-sm shrink-0"
                >
                  {voucher ? "Hapus" : "Pakai"}
                </button>
              </div>
              {vMsg && <p className={vMsg.cls}>{vMsg.text}</p>}
            </div>

            {voucher && disc() > 0 && (
              <div className="mt-3 text-sm flex justify-between">
                <span className="text-[#16835e] font-semibold">Diskon voucher</span>
                <b className="text-[#16835e]">-{rp(disc())}</b>
              </div>
            )}

            <div className="border-t border-dashed border-[#efd5e0] my-5" />
            <div className="flex justify-between items-end">
              <span className="text-[#7a6b78]">Total</span>
              <span className="text-2xl font-extrabold text-[#e0337a]">{rp(total())}</span>
            </div>
            <button
              type="button"
              onClick={goPay}
              disabled={!item}
              className="btn w-full mt-6"
            >
              Lanjut ke Pembayaran
            </button>
            <p className="text-xs text-[#7a6b78] mt-3 text-center">
              Mode demo, belum terhubung ke payment gateway.
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
          <div className="flex justify-between items-center text-sm">
            <span className="badge b-wait">Menunggu pembayaran</span>
            <span className="font-semibold text-[#7a6b78]">
              Sisa waktu <b className="text-[#1f1630]">{mmss}</b>
            </span>
          </div>
          <div className="mt-6 text-[#7a6b78] text-sm">Total pembayaran</div>
          <div className="text-3xl font-extrabold text-[#e0337a]">{rp(tx?.total ?? 0)}</div>
          <div className="mt-6">{payBox}</div>
          <div className="mt-5 text-left bg-[#fbf6f9] rounded-2xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#7a6b78]">Produk</span>
              <b>{tx?.prod}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6b78]">Nomor tujuan</span>
              <b>{tx?.no}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6b78]">Kode referensi</span>
              <b className="font-mono">{tx?.ref}</b>
            </div>
          </div>
          <button
            type="button"
            onClick={confirmPaid}
            disabled={verifying}
            className="btn w-full mt-6"
          >
            {verifying ? "Memverifikasi…" : "Saya Sudah Bayar"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full mt-3 text-sm font-semibold text-[#7a6b78]"
          >
            ← Ubah pesanan
          </button>
        </div>
      </section>

      {/* STEP 3 */}
      <section className={step === 3 ? "mt-6" : "mt-6 hidden"}>
        <div
          className="max-w-md mx-auto bg-white rounded-[24px] border-2 border-[#1f1630] overflow-hidden"
          style={{ boxShadow: "6px 6px 0 #e0337a" }}
        >
          <div className="p-8 text-center text-white" style={{ background: "#2a1526" }}>
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-[#b7700b] p-4 animate-pulse">
              <Icon name="clock" className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-extrabold mt-4">Terima kasih!</h2>
            <p className="text-white/90 mt-1">Pembayaran Anda sedang dalam pengecekan.</p>
            <p className="text-white/70 text-xs mt-2">{rDate}</p>
          </div>
          <div className="p-6 text-sm space-y-3">
            <Row a="Status" b={<span className="badge b-wait">Sedang dicek</span>} />
            <Row a="Kode referensi" b={tx?.ref} c="font-mono" />
            <Row a="Layanan" b={tx?.svc} />
            <Row a="Produk" b={tx?.prod} />
            <Row a="Nomor tujuan" b={tx?.no} />
            <Row a="Metode" b={tx?.method} />
            <Row
              a={/PLN/.test(tx?.svc ?? "") ? "Token" : "Serial number"}
              b={tx?.sn}
              c="font-mono text-[#e0337a]"
            />
            {tx?.disc ? (
              <Row a={"Voucher " + (tx.voucher ?? "")} b={"-" + rp(tx.disc)} c="text-[#16835e]" />
            ) : null}
            <div className="border-t border-dashed border-[#efd5e0]" />
            <Row a="Total dibayar" b={rp(tx?.total ?? 0)} c="text-lg text-[#e0337a]" />
            <p className="text-xs text-[#7a6b78] bg-[#fff8eb] rounded-xl p-3 mt-2">
              Verifikasi biasanya 1–5 menit. Simpan kode referensi dan pantau statusnya di menu Cek
              Transaksi.
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
              onClick={() => {
                try {
                  localStorage.setItem("ldx_q", tx?.ref ?? "");
                } catch {
                  /* abaikan */
                }
              }}
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
