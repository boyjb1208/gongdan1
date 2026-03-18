import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-dark text-light font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black flex items-center justify-center rounded-md relative overflow-hidden border border-white/10 shrink-0">
              <span className="text-white font-black text-2xl tracking-tighter mt-[-2px]">GDC</span>
              <div className="absolute bottom-2 right-1.5 w-3.5 h-1 bg-primary"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none">{settings.companyName}</span>
              <span className="text-[10px] text-primary font-bold tracking-widest mt-1">INDUSTRIAL AUTO RECYCLING</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">서비스</a>
            <a href="#process" className="text-sm font-medium hover:text-primary transition-colors">진행절차</a>
            <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">고객후기</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">상담문의</a>
            <a href="tel:010-8794-8484" className="flex items-center gap-2 bg-primary text-dark px-5 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors">
              <Phone size={18} />
              <span>{settings.phone}</span>
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-light p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark pt-20"
          >
            <nav className="flex flex-col p-6 gap-6">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">서비스</a>
              <a href="#process" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">진행절차</a>
              <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">고객후기</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">상담문의</a>
              <a href="tel:010-8794-8484" className="flex items-center justify-center gap-2 bg-primary text-dark px-6 py-4 rounded-xl font-bold mt-4">
                <Phone size={20} />
                <span>전화 상담하기</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black flex items-center justify-center rounded-md relative overflow-hidden border border-white/10 shrink-0">
                  <span className="text-white font-black text-xl tracking-tighter mt-[-2px]">GDC</span>
                  <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-primary"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tight leading-none">{settings.companyName}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                주소: {settings.address}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                운영시간: {settings.hours}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                대표전화: {settings.phone}
              </p>
            </div>
            <div className="flex flex-col md:items-end justify-end">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
              </p>
              <Link to="/admin" className="text-gray-600 text-xs mt-2 hover:text-gray-400">
                관리자 로그인
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <a href={`tel:${settings.phone}`} className="w-14 h-14 bg-primary text-dark rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform md:hidden">
          <Phone size={28} />
        </a>
      </div>
    </div>
  );
}
