export type Payment = [string, number, "qr" | "ew" | "va"];

export const PAY: Payment[] = [
  ["QRIS", 0, "qr"],
  ["DANA", 1000, "ew"],
  ["OVO", 1000, "ew"],
  ["GoPay", 1000, "ew"],
  ["ShopeePay", 1000, "ew"],
  ["Virtual Account", 2500, "va"],
];

export type Voucher = {
  pct?: number;
  max?: number;
  flat?: number;
  min?: number;
  only?: string[];
  label: string;
};

export const VCH: Record<string, Voucher> = {
  LUDOBARU: { pct: 20, max: 20000, only: ["pulsa", "data", "pln"], label: "Cashback 20% (maks. Rp20.000)" },
  HEMAT5: { flat: 5000, min: 50000, label: "Potongan Rp5.000 min. Rp50.000" },
};

export type Operator = { name: string; color: string; prefixes: string[] };

export const OPS: Operator[] = [
  { name: "Telkomsel", color: "#e4002b", prefixes: ["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"] },
  { name: "Indosat", color: "#f7b500", prefixes: ["0814", "0815", "0816", "0855", "0856", "0857", "0858"] },
  { name: "XL", color: "#0b4ea2", prefixes: ["0817", "0818", "0819", "0859", "0877", "0878"] },
  { name: "Axis", color: "#7b2d8e", prefixes: ["0831", "0832", "0833", "0838"] },
  { name: "Tri", color: "#1d1d1b", prefixes: ["0895", "0896", "0897", "0898", "0899"] },
  { name: "Smartfren", color: "#e5007e", prefixes: ["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"] },
  { name: "by.U", color: "#12b7c6", prefixes: ["0851"] },
];

// Deteksi operator dari awalan nomor (hanya untuk pulsa & paket data)
export function detectOperator(value: string, serviceId: string) {
  const isHP = ["pulsa", "data"].includes(serviceId);
  let d = value.replace(/\D/g, "");
  if (d.startsWith("62")) d = "0" + d.slice(2);
  else if (d.startsWith("8")) d = "0" + d;

  if (!isHP || d.length < 4) return { kind: "none" as const };
  const o = OPS.find((x) => x.prefixes.includes(d.slice(0, 4)));
  if (o) return { kind: "op" as const, op: o };
  return { kind: "hint" as const };
}
