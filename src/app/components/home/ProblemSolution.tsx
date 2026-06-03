"use client"
import useAOS from '../../hooks/useAOS';
import { FaTimes, FaCheck } from 'react-icons/fa';

const problems = [
  'Hours wasted at insurance agencies',
  'Paper forms and manual document handling',
  'Days waiting for claim approval',
  'No visibility into repair progress',
  'Fraud-prone manual inspection process',
  'Disconnected experts, garages, and towing',
];

const solutions = [
  'Subscribe to insurance in under 10 minutes',
  'AI-powered OCR auto-fills your documents',
  'Instant claim submission from your phone',
  'Live repair tracking with status notifications',
  'AI damage detection and fraud prevention',
  'One platform connecting all service partners',
];

export default function ProblemSolution() {
  useAOS();
  return (
    <section className="relative py-28 px-4 overflow-hidden">
      {/* Subtle divider glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-100 to-transparent" />

      <div className="max-w-6xl mx-auto">

        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full mb-4">
            The Problem
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Make insurance{' '}
            <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
              simple, fast, fair.
            </span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We built Amaneka to replace every frustrating step with a seamless digital experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Before */}
          <div
            className="bg-white/80 border border-rose-100 rounded-3xl p-8 backdrop-blur-sm"
            data-aos="fade-right"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                <FaTimes className="text-rose-500 text-sm" />
              </div>
              <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">Before Amaneka</h3>
            </div>
            <ul className="space-y-3.5">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-gray-500">
                  <FaTimes className="text-rose-400 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div
            className="bg-white/80 border border-emerald-100 rounded-3xl p-8 backdrop-blur-sm"
            data-aos="fade-left"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FaCheck className="text-emerald-600 text-sm" />
              </div>
              <h3 className="text-base font-bold text-gray-700 uppercase tracking-wide">With Amaneka</h3>
            </div>
            <ul className="space-y-3.5">
              {solutions.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <FaCheck className="text-emerald-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
