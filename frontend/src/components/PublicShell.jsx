/**
 * PublicShell - Unified layout for public/marketing pages
 * Uses the same Navy + Gold theme as AppShell
 * Allows for "marketing hero" sections while keeping consistent tokens
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { tw } from "../lib/theme";
import BrandLogo from "../design-system/components/BrandLogo.jsx";

export default function PublicShell({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      {/* Sticky Navigation - Navy themed */}
      {!isHome && (
        <nav className={`${tw.shellBgSolid} border-b ${tw.borderOnDark} sticky top-0 z-50`}>
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BrandLogo variant="light" className="text-[17px]" />
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <NavLink to="/pricing" label="Pricing" />
              <NavLink to="/how-it-works" label="How It Works" />
              <NavLink to="/business" label="Business" />
              <Link
                to="/welcome"
                className={`rounded-xl ${tw.btnPrimary} px-5 py-2.5 transition`}
                data-testid="nav-get-started"
              >
                Create Account
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button className="md:hidden text-white/70 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      )}
      
      {/* Page Content */}
      <main>
        {children}
      </main>
      
      {/* Footer - Navy themed */}
      <footer className={`${tw.shellBgSolid} py-10 border-t ${tw.borderOnDark}`}>
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-white/50">
          <div className="flex justify-center items-center gap-3 mb-4">
            <BrandLogo variant="light" className="text-[16px]" />
            <div className="font-semibold text-white/70">Social payments and cross-border wallets for Filipinos everywhere.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="/privacy" className="hover:text-[#D6B14A] transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D6B14A] transition">Terms of Service</Link>
            <Link to="/security" className="hover:text-[#D6B14A] transition">Security</Link>
          </div>
          <p className="max-w-2xl mx-auto text-white/40">
            PBX is a financial technology platform and does not provide banking or money transmission services directly. 
            Services may be provided by licensed financial partners where required. 
            Demo estimates shown; actual rates, fees, and availability vary.
          </p>
          <p className="mt-4">© {new Date().getFullYear()} PBX Exchange. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`transition ${isActive ? 'text-[#D6B14A]' : 'text-white/70 hover:text-[#D6B14A]'}`}
    >
      {label}
    </Link>
  );
}
