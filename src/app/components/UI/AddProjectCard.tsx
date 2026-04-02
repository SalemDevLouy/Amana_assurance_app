import { AddProjectCardProps } from "@/app/types/types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function AddProjectCard({ title, desc, small, link, available }: Readonly<AddProjectCardProps>) {
  return (
    <Link href={available ? link : "#"} className={available ? "" : "pointer-events-none"}>
      <div
        className={`group relative overflow-hidden rounded-2xl border border-cyan-300/40 bg-white/70 p-6 transition-all duration-300 ${
          available
            ? "hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-200/60"
            : "opacity-50"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-100/40 via-transparent to-blue-100/40 opacity-80" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/40 bg-white text-cyan-700 transition-colors group-hover:text-cyan-800">
            <FaPlus className="text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              {desc} {small}
            </p>
            <h4 className="mt-1 text-base font-bold text-gray-800">{title}</h4>
          </div>
        </div>
      </div>
    </Link>
  );
}
