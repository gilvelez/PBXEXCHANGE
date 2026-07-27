import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import BrandLogo from "../design-system/components/BrandLogo.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useSession();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password || undefined);
      navigate("/sender/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      title="Welcome back to PBX"
      subtitle="Log in to continue your conversations, wallets, payments, and requests."
      sideTitle="Your social wallet stays centered on people."
      sideText="Demo or sandbox balances may appear in local development. Production integrations should be connected before live settlement claims are made."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <Field label="Email address">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#03112B]/15 bg-white px-4 text-[#03112B] outline-none focus:border-[#D6B14A] focus:ring-2 focus:ring-[#D6B14A]/25"
            placeholder="maria@example.com"
            required
            data-testid="login-email-input"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#03112B]/15 bg-white px-4 text-[#03112B] outline-none focus:border-[#D6B14A] focus:ring-2 focus:ring-[#D6B14A]/25"
            placeholder="Your password"
            data-testid="login-password-input"
          />
          <p className="mt-2 text-xs text-[#53647E]">Some local demo accounts support passwordless sandbox login.</p>
        </Field>
        {error && <div className="rounded-xl border border-[#C65A62]/30 bg-[#C65A62]/10 p-3 text-sm text-[#8B3038]" data-testid="login-error">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-[#03112B] px-5 font-bold text-[#F7F4ED] transition hover:bg-[#102B57] disabled:opacity-60"
          data-testid="login-submit-btn"
        >
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-[#53647E]">
        New to PBX? <Link to="/register" className="font-bold text-[#03112B] underline">Create your account</Link>
      </p>
    </AuthFrame>
  );
}

export function AuthFrame({ title, subtitle, sideTitle, sideText, children }) {
  return (
    <div className="min-h-screen bg-[#03112B] px-4 py-8 text-[#03112B]">
      <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <Link to="/" aria-label="PBX Exchange home">
          <BrandLogo variant="light" className="text-[17px]" />
        </Link>
        <Link to="/" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#F7F4ED] hover:bg-white/10">
          Back to site
        </Link>
      </div>
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] bg-[#F7F4ED] shadow-dark lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="hidden bg-[radial-gradient(circle_at_top,rgba(214,177,74,0.24),transparent_34%),linear-gradient(180deg,#061A3A,#03112B)] p-10 text-[#F7F4ED] lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D6B14A]">PBX Exchange</p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight">{sideTitle}</h2>
          <p className="mt-5 text-sm leading-7 text-[#A9B5C8]">{sideText}</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm font-bold">Main journey</p>
            <p className="mt-2 text-sm text-[#A9B5C8]">Sign up → PBX identity → People → Chat → Pay or Request</p>
          </div>
        </aside>
        <main className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#B7953F]">Account access</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em]">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#53647E]">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#03112B]">{label}</span>
      {children}
    </label>
  );
}

