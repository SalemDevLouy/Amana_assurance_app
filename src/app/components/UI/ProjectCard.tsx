"use client";
import Link from 'next/link';
import { FaFileAlt, FaArrowRight } from 'react-icons/fa';

interface AddProjectCardProps {
  title: string;
  desc: string;
  small: string;
  link: string;
  available: boolean;
  onClick?: () => void;
}

const ProjectCard: React.FC<AddProjectCardProps> = ({
  title,
  desc,
  small,
  link,
  available,
  onClick,
}) => {
  return (
    <Link
      href={available ? link : "#"}
      passHref
      onClick={available ? onClick : undefined}
      className={`group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 ${
        available
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-100"
          : "pointer-events-none opacity-40"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-50/70 via-transparent to-blue-50/70 opacity-80" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50">
          <FaFileAlt className="text-sm text-cyan-700" />
        </div>
        <div className="grow min-w-0">
          <h4 className="truncate text-sm font-semibold text-gray-800">{title}</h4>
          <p className="mt-0.5 text-xs text-gray-500">
            {desc} <span className="text-gray-600">{small}</span>
          </p>
        </div>
        <FaArrowRight className="mt-0.5 shrink-0 text-xs text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-cyan-600" />
      </div>
    </Link>
  );
};

export default ProjectCard;