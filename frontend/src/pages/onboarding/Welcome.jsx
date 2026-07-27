import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../../design-system/components/BrandLogo.jsx";
import { useSession } from "../../contexts/SessionContext.jsx";
import { demoPeople } from "../../data/demo/publicDemo.js";

const steps = [
  "Welcome",
  "Contact",
  "Handle",
  "Profile",
  "Currency",
  "Notifications",
  "People",
  "Funding",
];

export default function Welcome() {
  const navigate = useNavigate();
  const { session, setRole } = useSession();
  const savedProfile = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("pbx_onboarding_profile") || "{}");
    } catch {
      return {};
    }
  }, []);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState({
    role: session?.role || "sender",
    fullName: savedProfile.fullName || session?.user?.displayName || "",
    phone: savedProfile.phone || "",
    handle: "",
    currency: savedProfile.preferredCurrency || "USD",
    notifications: { messages: true, payments: true, requests: true },
  });

  const update = (key, value) => setState((current) => ({ ...current, [key]: value }));
  const next = async () => {
    if (index === 0 && state.role) {
      await setRole(state.role);
    }
    if (index < steps.length - 1) {
      setIndex((value) => value + 1);
    } else {
      navigate(state.role === "recipient" ? "/recipient/dashboard" : "/sender/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#03112B] px-4 py-6 text-[#03112B]">
      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <Link to="/">
          <BrandLogo variant="light" className="text-[16px]" />
        </Link>
        <button onClick={() => navigate("/sender/dashboard")} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-[#F7F4ED]">
          Skip for now
        </button>
      </div>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] bg-[#F7F4ED] shadow-dark">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="bg-[#061A3A] p-6 text-[#F7F4ED] lg:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D6B14A]">Onboarding</p>
            <h1 className="mt-4 font-display text-4xl font-bold">Create your PBX identity.</h1>
            <p className="mt-4 text-sm leading-7 text-[#A9B5C8]">
              Set up enough to explore PBX. Bank connection and live payout integrations can be skipped in development.
            </p>
            <div className="mt-8 space-y-3">
              {steps.map((step, i) => (
                <div key={step} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${i === index ? "bg-[#D6B14A] text-[#03112B]" : "text-[#A9B5C8]"}`}>
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-current text-xs font-bold">{i + 1}</span>
                  <span className="text-sm font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="h-2 overflow-hidden rounded-full bg-[#03112B]/10">
                <div className="h-full bg-[#D6B14A]" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#53647E]">
                Step {index + 1} of {steps.length}
              </p>
            </div>

            <StepContent index={index} state={state} update={update} />

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => setIndex((value) => Math.max(0, value - 1))}
                disabled={index === 0}
                className="min-h-11 rounded-xl border border-[#03112B]/10 px-5 font-bold text-[#03112B] disabled:opacity-40"
              >
                Back
              </button>
              <button onClick={next} className="min-h-11 rounded-xl bg-[#03112B] px-6 font-bold text-[#F7F4ED]">
                {index === steps.length - 1 ? "Enter PBX" : "Continue"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function StepContent({ index, state, update }) {
  switch (index) {
    case 0:
      return <WelcomeStep state={state} update={update} />;
    case 1:
      return <ContactStep state={state} update={update} />;
    case 2:
      return <HandleStep state={state} update={update} />;
    case 3:
      return <ProfileStep state={state} />;
    case 4:
      return <CurrencyStep state={state} update={update} />;
    case 5:
      return <NotificationStep state={state} update={update} />;
    case 6:
      return <PeopleStep />;
    default:
      return <FundingStep />;
  }
}

function StepShell({ title, text, children }) {
  return (
    <div>
      <h2 className="font-display text-4xl font-bold tracking-[-0.04em]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#53647E]">{text}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function WelcomeStep({ state, update }) {
  return (
    <StepShell title="Welcome to PBX Exchange" text="Choose how you want to start. You can switch or add business profiles later.">
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ["sender", "Personal sender", "Pay, request, chat, add money, convert, and manage wallet activity."],
          ["recipient", "Recipient mode", "Receive transfers, view wallets, convert currency, withdraw, and manage notifications."],
        ].map(([role, title, text]) => (
          <button key={role} onClick={() => update("role", role)} className={`rounded-2xl border p-5 text-left ${state.role === role ? "border-[#D6B14A] bg-[#D6B14A]/15" : "border-[#03112B]/10 bg-white"}`}>
            <p className="font-bold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[#53647E]">{text}</p>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function ContactStep({ state, update }) {
  return (
    <StepShell title="Confirm your contact details" text="Use verified contact details for login, notifications, and account activity alerts.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" value={state.fullName} onChange={(value) => update("fullName", value)} />
        <Input label="Phone" value={state.phone} onChange={(value) => update("phone", value)} />
      </div>
    </StepShell>
  );
}

function HandleStep({ state, update }) {
  const suggested = (state.fullName || "pbxuser").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 18);
  return (
    <StepShell title="Choose your PBX handle" text="Your handle is how people can find you on PBX without exposing private contact details.">
      <Input label="PBX handle" prefix="@" value={state.handle || suggested} onChange={(value) => update("handle", value)} />
      <p className="mt-3 text-xs text-[#53647E]">Handle availability is checked when profile APIs are connected.</p>
    </StepShell>
  );
}

function ProfileStep({ state }) {
  const initials = (state.fullName || "PBX User").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <StepShell title="Add your profile" text="Use initials now, or add a photo later from Profile settings.">
      <div className="flex items-center gap-5 rounded-2xl bg-white p-5">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-[#03112B] text-2xl font-bold text-[#D6B14A]">{initials}</div>
        <div>
          <p className="font-bold">{state.fullName || "PBX User"}</p>
          <p className="text-sm text-[#53647E]">@{state.handle || "yourhandle"}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B7953F]">Demo avatar</p>
        </div>
      </div>
    </StepShell>
  );
}

function CurrencyStep({ state, update }) {
  return (
    <StepShell title="Choose your primary wallet" text="PBX shows USD, PHP, and digital-dollar structures separately so balances stay clear.">
      <div className="grid gap-3 sm:grid-cols-3">
        {["USD", "PHP", "USDC structure"].map((currency) => (
          <button key={currency} onClick={() => update("currency", currency)} className={`rounded-2xl border p-5 text-left font-bold ${state.currency === currency ? "border-[#D6B14A] bg-[#D6B14A]/15" : "border-[#03112B]/10 bg-white"}`}>
            {currency}
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function NotificationStep({ state, update }) {
  const toggle = (key) => update("notifications", { ...state.notifications, [key]: !state.notifications[key] });
  return (
    <StepShell title="Set notification preferences" text="Choose the account events you want PBX to surface. Delivery providers may be mocked in development.">
      <div className="grid gap-3">
        {[
          ["messages", "Messages"],
          ["payments", "Payments and deposits"],
          ["requests", "Payment requests"],
        ].map(([key, label]) => (
          <button key={key} onClick={() => toggle(key)} className="flex items-center justify-between rounded-2xl bg-white p-5 text-left">
            <span className="font-bold">{label}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${state.notifications[key] ? "bg-[#2F9E75]/15 text-[#1F7A59]" : "bg-[#03112B]/10 text-[#53647E]"}`}>
              {state.notifications[key] ? "On" : "Off"}
            </span>
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function PeopleStep() {
  return (
    <StepShell title="Find people on PBX" text="People discovery becomes the center of your payment network. These are demo contacts for local exploration.">
      <div className="grid gap-3">
        {demoPeople.map((person) => (
          <div key={person.id} className="flex items-center justify-between rounded-2xl bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#D6B14A] font-bold">{person.initials}</div>
              <div>
                <p className="font-bold">{person.name}</p>
                <p className="text-sm text-[#53647E]">{person.handle}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#B7953F]">{person.status}</span>
          </div>
        ))}
      </div>
    </StepShell>
  );
}

function FundingStep() {
  return (
    <StepShell title="Funding method or skip" text="Bank linking, Plaid, Circle, and payout rails may be sandboxed or unavailable. You can still enter PBX and explore demo balances.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#03112B]/10 bg-white p-5">
          <p className="font-bold">Connect Bank</p>
          <p className="mt-2 text-sm text-[#53647E]">Sandbox account structure. Live bank funding not required for this demo.</p>
        </div>
        <div className="rounded-2xl border border-[#D6B14A]/40 bg-[#D6B14A]/15 p-5">
          <p className="font-bold">Skip for now</p>
          <p className="mt-2 text-sm text-[#53647E]">Enter PBX with clearly labeled demo balances.</p>
        </div>
      </div>
    </StepShell>
  );
}

function Input({ label, value, onChange, prefix }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <div className="flex h-12 overflow-hidden rounded-xl border border-[#03112B]/15 bg-white focus-within:border-[#D6B14A] focus-within:ring-2 focus-within:ring-[#D6B14A]/25">
        {prefix && <span className="grid place-items-center px-3 text-[#53647E]">{prefix}</span>}
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent px-3 outline-none" />
      </div>
    </label>
  );
}

