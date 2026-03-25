"use client"
import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSession } from "next-auth/react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import LogOut from '../other/LogOut';
// import Image from 'next/image';
import UserAvatar from '../other/UserAvatar';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    ...(status === 'authenticated' ? [{ href: '/workspace', label: 'Espace de travail' }] : []),
    ...(status === 'authenticated' && session?.user?.role === 'ADMIN'
      ? [{ href: '/dashboard', label: 'Tableau de bord' }]
      : []),
  ];

  return (
    <>
      {/* ── Desktop: centered floating pill ── */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-center px-4 pt-4">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-blue-600/10 backdrop-blur-xl border border-white/15 shadow-md shadow-black/20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 pr-2 border-r border-white/15 mr-1">
              {/* <Image width={28} height={28} src="/assets/Amana.png" alt="Amana" className="rounded-lg" /> */}
              <span className="text-sm font-extrabold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
                Amana 
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
                        ? 'bg-white/15 text-gray-600'
                        : 'text-gray-500/80 hover:text-gray-500 hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="hidden md:block w-px h-4 bg-white/15 mx-1" />

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {status === 'authenticated' ? (
                <Dropdown placement="bottom-end" className="bg-[#0d0d1a] border border-white/10 text-blue-400 shadow-xl rounded-2xl">
                  <DropdownTrigger>
                    <div className="cursor-pointer ring-2 ring-blue-600/30 hover:ring-blue-600/60 rounded-full transition-all duration-200">
                      <UserAvatar username={session?.user?.name || 'User'} />
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="name" isReadOnly className="cursor-default">
                      <p className="text-xs text-gray-500/40 uppercase tracking-wider">{session?.user?.name}</p>
                    </DropdownItem>
                    <DropdownItem key="workspace">
                      <Link href="/workspace" className="text-sm text-gray-500/70 hover:text-gray-500 transition-colors">
                        Espace de travail
                      </Link>
                    </DropdownItem>
                    {session?.user?.role === 'ADMIN' ? (
                      <DropdownItem key="dashboard">
                        <Link href="/dashboard" className="text-sm text-gray-500/70 hover:text-gray-500 transition-colors">
                          Tableau de bord
                        </Link>
                      </DropdownItem>
                    ) : <></>}
                    <DropdownItem key="logout" color="danger">
                      <LogOut />
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600/60 hover:text-gray-600 hover:bg-white/10 transition-all duration-200"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-100 shadow-md shadow-blue-600/25 hover:shadow-blue-600/50 hover:scale-105 transition-all duration-200"
                  >
                    Commencer
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-500/70 hover:text-gray-500 hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — breaks out of pointer-events-none */}
        <div
          className={`md:hidden pointer-events-auto mx-4 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d1a]/95 backdrop-blur-xl transition-all duration-300 ${
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
                    active ? 'bg-white/15 text-gray-500' : 'text-gray-500/60 hover:text-gray-500 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1.5">
              {status === 'authenticated' ? (
                <div className="px-4 py-2"><LogOut /></div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500/60 hover:text-gray-500 hover:bg-white/10 transition-all">
                    Se connecter
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    Commencer gratuitement
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