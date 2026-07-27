import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "../design-system/components/BrandLogo.jsx";

const navItems = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/personal", label: "Personal" },
  { to: "/business", label: "Business" },
  { to: "/security", label: "Security" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
];

export default function PublicShell({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#03112B] text-[#F7F4ED] font-sans-pbx">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03112B]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center" aria-label="PBX Exchange home">
            <BrandLogo variant="light" className="text-[17px]" showDescriptor />
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-[#A9B5C8] lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-[#E0C16A] ${isActive ? "text-[#E0C16A]" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-[#F7F4ED] hover:bg-white/10">
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-[#D6B14A] px-5 py-2.5 text-sm font-bold text-[#03112B] transition hover:bg-[#E0C16A]"
            >
              Create Account
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/10 text-[#F7F4ED] lg:hidden"
            aria-label="Open navigation"
            aria-expanded={open}
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
            <nav className="grid gap-1 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-[#DBE2ED] hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold">
                Log In
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#D6B14A] px-4 py-3 text-center text-sm font-bold text-[#03112B]">
                Create Account
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-[#061A3A]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <BrandLogo variant="light" className="text-[18px]" />
            <p className="mt-5 max-w-md text-sm leading-6 text-[#A9B5C8]">
              Social payments and cross-border wallets for Filipinos everywhere.
              Demo and sandbox states are clearly labeled while integrations are connected.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <FooterGroup title="Product" links={[["How It Works", "/how-it-works"], ["Personal", "/personal"], ["Business", "/business"], ["Pricing", "/pricing"]]} />
            <FooterGroup title="Trust" links={[["Security", "/security"], ["Help", "/help"], ["Privacy", "/privacy"], ["Terms", "/terms"]]} />
            <FooterGroup title="Account" links={[["Log In", "/login"], ["Create Account", "/register"], ["Onboarding", "/welcome"]]} />
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-[#8E9DB5]">
          © {new Date().getFullYear()} PBX Exchange. PBX is a technology platform; mocked or sandboxed integrations are labeled in product.
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#E0C16A]">{title}</h2>
      <div className="mt-4 grid gap-3">
        {links.map(([label, to]) => (
          <Link key={to} to={to} className="text-sm text-[#A9B5C8] transition hover:text-[#F7F4ED]">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

