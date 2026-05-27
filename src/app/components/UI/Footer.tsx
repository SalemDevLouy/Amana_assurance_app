import Link from 'next/link';
import { FaShieldAlt, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const links = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Insurance Partners', href: '/#partners' },
    { label: 'Pricing', href: '/#pricing' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
                <FaShieldAlt className="text-white text-xs" />
              </div>
              <span className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
                Amaneka
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
              AI-powered automobile insurance platform built for Algeria.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[FaLinkedin, FaTwitter, FaFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <Icon className="text-xs" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Amaneka. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built for Algeria · Automobile Insurance Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
