export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 leading-none">
      <svg width="40" height="42" viewBox="0 0 40 42" aria-hidden="true">
        <path
          d="M13 13V10a7 7 0 0 1 14 0v3"
          fill="none"
          stroke={dark ? "#ffb3cf" : "#1f1630"}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M5 14h30l-2.4 22.5A5 5 0 0 1 27.6 41H12.4a5 5 0 0 1-5-4.5z" fill="#e0337a" />
        <path d="M14 25q6 7 12 0" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="14" cy="20.5" r="1.8" fill="#fff" />
        <circle cx="26" cy="20.5" r="1.8" fill="#fff" />
      </svg>
      <span className="flex flex-col">
        <span
          className={
            "font-black text-[24px] tracking-tight italic " +
            (dark ? "text-white" : "text-[#1f1630]")
          }
        >
          Ludexa
        </span>
        <span
          className={
            "text-[9px] font-bold tracking-[.45em] mt-0.5 " +
            (dark ? "text-[#ffb3cf]" : "text-[#e0337a]")
          }
        >
          STORE
        </span>
      </span>
    </span>
  );
}
