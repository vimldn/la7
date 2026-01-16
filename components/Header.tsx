'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  currentPage?: 'home' | 'blog' | 'blog-post';
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: currentPage === 'home' ? '#calculator' : '/#calculator', label: 'Calculator' },
    { href: currentPage === 'home' ? '#compare' : '/#compare', label: 'Compare' },
    { href: currentPage === 'home' ? '#tips' : '/#tips', label: 'Tips' },
    { href: '/blog', label: 'Blog', isActive: currentPage === 'blog' || currentPage === 'blog-post' },
  ];

  return (
    <>
      <header className={`border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                💰
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LoanApp.co.ke</h1>
                <p className="text-xs text-slate-400">Compare loan apps in Kenya</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    link.isActive
                      ? 'text-emerald-400 font-medium'
                      : 'text-slate-300 hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Hamburger Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-52 h-full bg-slate-900 border-l border-slate-700 shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <nav className="px-6 py-4">
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  className="transform transition-all duration-300"
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-lg font-medium transition-all ${
                      link.isActive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-emerald-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-lg">
                💰
              </div>
              <span className="text-sm font-semibold text-white">LoanApp.co.ke</span>
            </div>
            <p className="text-xs text-slate-500">
              Kenya's loan app comparison tool
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
