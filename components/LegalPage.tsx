import Link from "next/link";
import { CS_WA } from "@/lib/format";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export function LegalPage({
  title,
  subtitle,
  current,
  other,
  sections,
  updated,
}: {
  title: string;
  subtitle: string;
  current: string;
  other: { label: string; href: string };
  sections: LegalSection[];
  updated: string;
}) {
  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <section className="rounded-[28px] bg-[#fff0f6] p-7 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-xs font-bold tracking-[.2em] text-[#e0337a]">LEGAL</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-3">{title}</h1>
          <p className="text-[#5a4b58] mt-3 max-w-xl">{subtitle}</p>
        </div>
        <div className="flex gap-2 bg-white rounded-full p-1.5 border border-[#f9d4e3] self-start md:self-auto">
          <span className="rounded-full bg-[#e0337a] text-white font-bold text-sm px-4 py-2">
            {current}
          </span>
          <Link
            href={other.href}
            className="rounded-full font-bold text-sm px-4 py-2 text-[#5a4b58]"
          >
            {other.label}
          </Link>
        </div>
      </section>

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        <aside
          className="lg:sticky lg:top-28 rounded-[22px] p-6 text-white"
          style={{ background: "#2a1526" }}
        >
          <div className="text-xs font-bold tracking-[.2em] text-[#ff7aa8]">DAFTAR ISI</div>
          <nav className="mt-3 [&_a]:!text-white/75 [&_a:hover]:!text-white">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={"#" + s.id}
                className="flex gap-3 py-2 text-sm text-white/80 hover:text-white"
              >
                <span className="font-extrabold text-[#e0337a] w-5">{i + 1}</span>
                {s.title}
              </a>
            ))}
          </nav>
          <div className="prose mt-4 pt-4 border-t border-white/10 [&_p]:!text-white/60 [&_p]:!text-xs">
            <p className="text-sm">Terakhir diperbarui: {updated}</p>
          </div>
        </aside>

        <div className="space-y-4 min-w-0">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-28 bg-white rounded-[22px] border border-[#f4e8ee] p-6 md:p-7 prose"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#1f1630] text-white font-extrabold text-sm grid place-items-center shrink-0">
                  {i + 1}
                </span>
                <h2 className="!m-0">{s.title}</h2>
              </div>
              <div className="mt-3">{s.body}</div>
            </section>
          ))}

          <div className="rounded-[22px] bg-[#ffe3ee] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="font-bold">Ada pertanyaan soal halaman ini?</div>
            <a
              href={`https://wa.me/${CS_WA}`}
              target="_blank"
              rel="noopener"
              className="self-start rounded-full bg-[#25a35a] text-white font-bold px-5 py-2.5"
            >
              Chat CS 0857-1117-2317
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
