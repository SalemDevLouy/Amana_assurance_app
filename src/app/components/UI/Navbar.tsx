"use client"
import React, { useState } from 'react'
import { useSession } from "next-auth/react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button, Dropdown, Label } from '@heroui/react';
import LogOut from '../other/LogOut';
import UserAvatar from '../other/UserAvatar';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    ...(status === 'authenticated' ? [{ href: '/main', label: 'Mon Espace' }] : []),
    ...(status === 'authenticated' && session?.user?.role === 'ADMIN'
      ? [{ href: '/dashboard', label: 'Tableau de bord' }]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: '#d4d0c8', borderBottom: '2px solid #808080', borderTop: '2px solid #fff' }}>
      {/* Menu bar row */}
      <div className="flex items-center" style={{ borderBottom: '1px solid #808080' }}>
        {/* Logo / brand */}
        <Link href="/" className="flex items-center gap-1 px-3 py-1.5 font-bold" style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: 11, color: '#000', textDecoration: 'none', borderRight: '1px solid #808080' }}>
          <span style={{ fontSize: 16 }}>🛡️</span>
          <span>Amana</span>
        </Link>

        {/* Nav menu items */}
        <nav className="hidden md:flex items-center">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5"
                style={{
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  fontSize: 11,
                  color: active ? '#fff' : '#000',
                  background: active ? '#0a246a' : 'transparent',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRight: '1px solid #bfbfbf',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Auth section */}
        <div className="hidden md:flex items-center gap-2 px-2 py-1">
          {status === 'authenticated' ? (
            <Dropdown>
              <Button aria-label="Menu" variant="secondary" className="w-8 h-8 p-0 bg-transparent border-0">
                <UserAvatar username={session?.user?.name || 'User'} />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                  <Dropdown.Item id="new-file" textValue="New file">
                    <Link href="/main/profile"><Label>Ma Profil</Label></Link>
                  </Dropdown.Item>
                  <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                    <LogOut />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Link href="/login" className="win-btn" style={{ fontSize: 11, padding: '2px 10px' }}>
                🔑 Se connecter
              </Link>
              <Link href="/signup" className="win-btn win-btn-primary" style={{ fontSize: 11, padding: '2px 10px' }}>
                📁 Commencer
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden win-btn mx-2"
          style={{ padding: '2px 8px', fontSize: 11 }}
          aria-label="Toggle menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden win-panel p-2" style={{ borderTop: '1px solid #808080' }}>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1"
                  style={{
                    fontFamily: 'Tahoma, Arial, sans-serif',
                    fontSize: 11,
                    background: active ? '#0a246a' : 'transparent',
                    color: active ? '#fff' : '#000',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="win-separator" />
            {status === 'authenticated' ? (
              <div className="px-3 py-1"><LogOut /></div>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="win-btn text-xs" style={{ marginBottom: 4 }}>
                  🔑 Se connecter
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="win-btn win-btn-primary text-xs">
                  📁 Commencer
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
