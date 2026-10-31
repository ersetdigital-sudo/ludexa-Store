import Link from "next/link";

export function DataUnavailable({
  message = "Layanan lagi gangguan, coba lagi sebentar.",
}: {
  message?: string;
}) {
  return (
    <main className="max-w-3xl mx-auto px-5 py-16">
      <div className="card p-8 text-center">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-2xl font-extrabold mt-3">Belum bisa dimuat</h1>
        <p className="text-sm text-[#7a6b78] mt-2">{message}</p>
        <Link href="/" className="btn mt-6">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
