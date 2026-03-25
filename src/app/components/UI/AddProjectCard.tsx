import { AddProjectCardProps } from "@/app/types/types";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function AddProjectCard({ title, desc, small, link, available }: AddProjectCardProps) {
  return (
    <Link href={available ? link : ''} className={!available ? 'pointer-events-none' : ''}>
      <div className={`group relative rounded-2xl border-2 border-dashed border-blue-600/30 bg-white/5 hover:border-blue-600/60 hover:bg-white/6 transition-all duration-300 p-6 flex items-center gap-5 ${!available ? 'opacity-40' : ''}`}>
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/15 to-cyan-500/15 border border-white/10 group-hover:border-blue-600/25 flex items-center justify-center transition-all">
          <FaPlus className="text-blue-500/70 group-hover:text-blue-500 text-lg transition-colors" />
        </div>
        <div>
          <p className="text-xs uppercase font-semibold tracking-wide text-gray-500/35 group-hover:text-gray-500/50 transition-colors">{desc} {small}</p>
          <h4 className="text-base font-bold text-gray-500/70 group-hover:text-gray-500 transition-colors mt-0.5">{title}</h4>
        </div>
      </div>
    </Link>
  );
}
