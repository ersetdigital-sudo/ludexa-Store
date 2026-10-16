// Isi nomor WhatsApp CS format 62xxxxxxxxxx (tanpa + / spasi)
export const CS_WA = "6285711172317";

export const waLink = (t: string) =>
  "https://wa.me/" + CS_WA + "?text=" + encodeURIComponent(t);

export const rp = (n: number) => "Rp" + Number(n).toLocaleString("id-ID");

export const fmtDate = (t: string | number | Date) =>
  new Date(t).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
