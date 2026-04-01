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
    <div
      className={`group relative rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-blue-600/30 hover:bg-white/10 transition-all duration-300 cursor-pointer ${!available ? 'opacity-40 pointer-events-none' : ''}`}
      onClick={available ? onClick : undefined}
    >
      <Link href={available ? link : '#'} passHref>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-blue-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
            <FaFileAlt className="text-blue-500 text-sm" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-sm font-semibold text-gray-500 truncate">{title}</h4>
            <p className="text-xs text-gray-500/40 mt-0.5">
              {desc} <span className="text-gray-500/55">{small}</span>
            </p>
          </div>
          <FaArrowRight className="flex-shrink-0 text-gray-500/20 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all text-xs mt-0.5" />
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;