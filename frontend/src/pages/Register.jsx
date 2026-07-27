import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import { AuthFrame } from "./Login.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useSession();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    country: "United States",
    preferredCurrency: "USD",
    agreements: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    if (!form.agreements) {
      setError("Please confirm the account agreements to continue.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.fullName || undefined);
      sessionStorage.setItem("pbx_onboarding_profile", JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        country: form.country,
        preferredCurrency: form.preferredCurrency,
      }));
      navigate("/welcome");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      title="Create your PBX account"
      subtitle="Open an account, choose a PBX identity, and enter the social wallet experience."
      sideTitle="Start with identity, then find people."
      sideText="Registration creates the account. Onboarding continues with handle selection, profile setup, notification preferences, people discovery, and optional funding."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input value={form.fullName} onChange={update("fullName")} className="input" placeholder="Maria Santos" data-testid="register-displayname-input" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={update("phone")} className="input" placeholder="+1 415 555 0101" />
          </Field>
        </div>
        <Field label="Email">
          <input type="email" value={form.email} onChange={update("email")} className="input" placeholder="maria@example.com" required data-testid="register-email-input" />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} onChange={update("password")} className="input" placeholder="Create a password" required minLength={6} data-testid="register-password-input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Country">
            <select value={form.country} onChange={update("country")} className="input">
              <option>United States</option>
              <option>Philippines</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </Field>
          <Field label="Preferred currency">
            <select value={form.preferredCurrency} onChange={update("preferredCurrency")} className="input">
              <option>USD</option>
              <option>PHP</option>
              <option>USDC structure</option>
            </select>
          </Field>
        </div>
        <label className="flex gap-3 rounded-xl border border-[#03112B]/10 bg-white p-4 text-sm text-[#53647E]">
          <input type="checkbox" checked={form.agreements} onChange={update("agreements")} className="mt-1" />
          <span>
            I agree to the PBX account terms, privacy policy, electronic communications, and understand demo/sandbox states may appear in local development.
          </span>
        </label>
        {error && <div className="rounded-xl border border-[#C65A62]/30 bg-[#C65A62]/10 p-3 text-sm text-[#8B3038]" data-testid="register-error">{error}</div>}
        <button type="submit" disabled={loading} className="min-h-12 w-full rounded-xl bg-[#03112B] font-bold text-[#F7F4ED] hover:bg-[#102B57] disabled:opacity-60" data-testid="register-submit-btn">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-[#53647E]">
        Already have an account? <Link to="/login" className="font-bold text-[#03112B] underline">Log in</Link>
      </p>
    </AuthFrame>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#03112B]">{label}</span>
      {React.cloneElement(children, {
        className: `${children.props.className || ""} h-12 w-full rounded-xl border border-[#03112B]/15 bg-white px-4 text-[#03112B] outline-none focus:border-[#D6B14A] focus:ring-2 focus:ring-[#D6B14A]/25`,
      })}
    </label>
  );
}

