"use client"
import Link from 'next/link';
import { FaShieldAlt, FaArrowRight, FaLock } from 'react-icons/fa';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-rose-500/8 blur-[120px]" />

      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-6 border border-rose-200">
          <FaLock className="text-rose-500 text-xl" />
        </div>

        <p className="text-8xl font-black bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent mb-4 leading-none">
          401
        </p>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          You don&apos;t have permission to access this page. Please sign in with an authorized account.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:scale-105 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <FaShieldAlt className="text-xs" />
            Sign In
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-200 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
