import Link from 'next/link';
import React from 'react'

export default function Footer() {
    return (
        <footer className="py-10 bg-[#06060f] border-t border-white/10 text-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-200 text-sm">© 2026 Amana. Tous droits réservés.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-500/70 text-sm transition-colors">Confidentialité</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-500/70 text-sm transition-colors">Conditions d&apos;utilisation</Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-500/70 text-sm transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      );
}
