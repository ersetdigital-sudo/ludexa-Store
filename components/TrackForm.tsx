"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TrackForm() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className="mt-auto pt-6 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/cek?q=" + encodeURIComponent(q.trim()));
      }}
    >
      <input
        required
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full h-12 rounded-xl border border-[#f2dde6] bg-white px-4 outline-none focus:border-[#e0337a]"
        placeholder="REF-LDX12345678 / 0812..."
        aria-label="Kode referensi atau nomor tujuan"
      />
      <button className="w-full h-12 rounded-xl bg-[#1f1630] hover:bg-black text-white font-bold">
        Cek Status
      </button>
    </form>
  );
}
