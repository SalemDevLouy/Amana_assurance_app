"use client"
import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { useSession } from "next-auth/react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogOut from '../other/LogOut';
import UserAvatar from '../other/UserAvatar';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
    ...(status === 'authenticated' ? [{ href: '/main', label: 'My Space' }] : []),
    ...(status === 'authenticated' && session?.user?.role === 'ADMIN'
      ? [{ href: '/dashboard', label: 'Dashboard' }]
      : []),
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-center px-4 pt-4">
          <div
            className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
              scrolled
                ? 'bg-white/80 border-blue-100/80 shadow-lg shadow-blue-900/10'
                : 'bg-blue-600/8 border-white/15 shadow-md shadow-black/10'
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 pr-3 border-r border-blue-100/40 mr-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
                <FaShieldAlt className="text-white text-xs" />
              </div>
              <span className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block tracking-tight">
                Amaneka
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:block w-px h-4 bg-blue-100/60 mx-1" />

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {status === 'authenticated' ? (
                <div className="relative group">
                  <div className="cursor-pointer ring-2 ring-blue-200 hover:ring-blue-400 rounded-full transition-all duration-200">
                    <UserAvatar username={session?.user?.name || 'User'} />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-blue-50 rounded-2xl shadow-xl shadow-blue-900/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1.5">
                    <Link
                      href="/main/profile"
                      className="block px-4 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors"
                    >
                      My Profile
                    </Link>
                    <div className="border-t border-blue-50 my-1" />
                    <div className="px-4 py-1">
                      <LogOut />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden pointer-events-auto mx-4 mt-2 overflow-hidden rounded-2xl border border-blue-100/40 bg-white/95 backdrop-blur-xl shadow-xl shadow-blue-900/10 transition-all duration-300 ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col p-3 gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-blue-50 mt-2 pt-2 flex flex-col gap-1.5">
              {status === 'authenticated' ? (
                <div className="px-4 py-2"><LogOut /></div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50/60 transition-all">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
