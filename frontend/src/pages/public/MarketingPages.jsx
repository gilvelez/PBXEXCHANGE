import React from "react";
import { Link } from "react-router-dom";
import { demoBusinesses, demoExternalRecipients, demoPeople, demoWallets } from "../../data/demo/publicDemo";

function PageHero({ eyebrow, title, text, cta = "Create Your PBX Account" }) {
  return (
    <section className="bg-[#03112B] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D6B14A]">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.04em] text-[#F7F4ED] md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#A9B5C8]">{text}</p>
        <Link to="/register" className="mt-8 inline-flex rounded-xl bg-[#D6B14A] px-6 py-4 font-bold text-[#03112B] hover:bg-[#E0C16A]">
          {cta}
        </Link>
      </div>
    </section>
  );
}

function InfoGrid({ items }) {
  return (
    <section className="bg-[#F7F4ED] px-6 py-14 text-[#03112B]">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-[#03112B]/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B7953F]">{item.kicker}</p>
            <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#53647E]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Personal() {
  return (
    <>
      <PageHero
        eyebrow="Personal PBX"
        title="Your social wallet for family, friends, and home."
        text="Create a PBX handle, find trusted people, chat privately, send payments, request money, and manage USD, PHP, and digital-dollar wallet structures in one place."
      />
      <InfoGrid
        items={[
          { kicker: "People", title: "Search and connect", text: "Find people by name, PBX handle, email, or phone where privacy settings permit." },
          { kicker: "Chat", title: "Money with context", text: "Payments and requests appear inside conversations so everyone sees the status and note." },
          { kicker: "Wallets", title: "Balances stay clear", text: "USD, PHP, and USDC structures are shown separately with demo/sandbox labels where relevant." },
        ]}
      />
      <section className="bg-[#061A3A] px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold text-[#F7F4ED]">Demo people in the PBX network</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {demoPeople.map((person) => (
              <div key={person.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#D6B14A] font-bold text-[#03112B]">{person.initials}</div>
                  <div>
                    <p className="font-bold text-[#F7F4ED]">{person.name}</p>
                    <p className="text-sm text-[#A9B5C8]">{person.handle}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#E0C16A]">{person.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About PBX"
        title="Built around Filipino connection, not just transfer forms."
        text="PBX Exchange is designed as a trusted social-payment network where people, families, and businesses can communicate, move money, and understand wallet activity clearly."
      />
      <InfoGrid
        items={[
          { kicker: "Community", title: "Filipino connection", text: "PBX centers the people behind every payment: family, friends, workers, customers, and businesses." },
          { kicker: "Clarity", title: "Status-first money movement", text: "Every request, payment, conversion, deposit, withdrawal, and external transfer should show a clear state." },
          { kicker: "Trust", title: "Premium product standard", text: "The interface favors calm hierarchy, accessible contrast, and factual integration labels." },
        ]}
      />
    </>
  );
}

export function Help() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Understand PBX accounts, wallets, payments, and demo states."
        text="These help topics explain how the product is intended to work while banking, payout, notification, and live-rate integrations are configured."
        cta="Create Account"
      />
      <section className="bg-[#F7F4ED] px-6 py-14 text-[#03112B]">
        <div className="mx-auto grid max-w-5xl gap-4">
          {[
            ["Is PBX-to-PBX live?", "The local product flow is verified with the PBX ledger. Production settlement depends on deployment and treasury configuration."],
            ["Why do I see demo balances?", "Demo balances let the complete product experience remain navigable while funding integrations are sandboxed or disabled."],
            ["Can I add external recipients?", "External recipient structures remain available as a secondary path and are labeled when payout rails are not configured."],
            ["Are live FX rates required?", "No. PBX can show illustrative rates in demo mode and should clearly label them until a live provider is configured."],
          ].map(([q, a]) => (
            <details key={q} className="rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-sm leading-6 text-[#53647E]">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export function BusinessMarketing() {
  return (
    <>
      <PageHero
        eyebrow="Business PBX"
        title="Business profiles, customer conversations, and payments in one PBX network."
        text="Businesses can be discovered, messaged, and paid through PBX. Business dashboards and settlement rails remain clearly labeled where integrations are sandboxed."
      />
      <section className="bg-[#F7F4ED] px-6 py-14 text-[#03112B]">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold">Demo business profiles</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {demoBusinesses.map((business) => (
              <div key={business.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-bold">{business.name}</p>
                <p className="text-sm text-[#53647E]">{business.handle} • {business.category}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#B7953F]">{business.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function PricingMarketing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Transparent product states before live pricing claims."
        text="PBX pricing is structured for personal users, families, and businesses. Final live fees, FX spreads, and payout costs should be configured before production claims are made."
      />
      <InfoGrid
        items={[
          { kicker: "Personal", title: "PBX account", text: "Create a PBX identity, search people, chat, pay, request, and manage demo wallet balances." },
          { kicker: "Family", title: "Cross-border wallet", text: "Use wallet, conversion, withdrawal, and external recipient structures with clear demo labels." },
          { kicker: "Business", title: "Business profile", text: "Discovery, customer conversations, payments, and activity are represented structurally." },
        ]}
      />
    </>
  );
}

export function HowItWorksMarketing() {
  return (
    <>
      <PageHero
        eyebrow="How PBX works"
        title="Sign up. Create a PBX identity. Connect. Chat. Pay or request."
        text="The primary journey is social: People → Profile → Connection → Chat → Pay or Request. Wallet, conversion, withdrawal, and external transfer flows support that network."
      />
      <InfoGrid
        items={[
          { kicker: "1", title: "Create your identity", text: "Choose a handle, add profile details, and set wallet preferences during onboarding." },
          { kicker: "2", title: "Find people", text: "Search PBX users and businesses, send requests, accept connections, and invite non-PBX recipients." },
          { kicker: "3", title: "Move money in context", text: "Open a conversation, send messages, pay, request, and review status in chat and activity." },
        ]}
      />
    </>
  );
}

export function SecurityMarketing() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Clear controls, protected sessions, and honest integration states."
        text="PBX preserves authentication guards, session validation, server-side transfer checks, idempotency, and ledger validation where implemented."
      />
      <InfoGrid
        items={[
          { kicker: "Sessions", title: "Authenticated routes", text: "App routes are guarded and restored sessions are verified against backend auth." },
          { kicker: "Transfers", title: "Server-side validation", text: "PBX-to-PBX payments use server-side balance checks and ledger entries." },
          { kicker: "Transparency", title: "No false live claims", text: "Mocked, sandboxed, disabled, and credential-dependent integrations must be labeled." },
        ]}
      />
    </>
  );
}

export function ExternalRecipientsMarketing() {
  return (
    <section className="bg-[#061A3A] px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl font-bold text-[#F7F4ED]">External recipient structures remain available</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demoExternalRecipients.map((recipient) => (
            <div key={recipient.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="font-bold text-[#F7F4ED]">{recipient.name}</p>
              <p className="text-sm text-[#A9B5C8]">{recipient.method}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#D6B14A]">{recipient.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

