import React from "react";
import { Link } from "react-router-dom";
import { demoActivity, demoConversation, demoSteps, demoWallets } from "../data/demo/publicDemo";

export function Landing() {
  return (
    <div>
      <section className="overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(214,177,74,0.14),transparent_32%),linear-gradient(180deg,#03112B_0%,#061A3A_58%,#0B2248_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_0.92fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit rounded-full border border-[#D6B14A]/30 bg-[#D6B14A]/10 px-4 py-2 text-sm font-semibold text-[#EAD58F]">
              Social payments and cross-border wallets for Filipinos everywhere.
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-[#F7F4ED] md:text-7xl">
              Money moves better when people are connected.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DBE2ED]">
              Find people on PBX, send and request money through conversations,
              manage USD and PHP wallets, and stay connected across borders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#D6B14A] px-6 font-bold text-[#03112B] hover:bg-[#E0C16A]">
                Create Your PBX Account
              </Link>
              <Link to="/how-it-works" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 font-bold text-[#F7F4ED] hover:bg-white/10">
                See How PBX Works
              </Link>
            </div>
            <p className="mt-5 text-sm text-[#A9B5C8]">
              Demo balances, illustrative exchange rates, and sandbox integrations are labeled in product.
            </p>
          </div>

          <ProductPreview />
        </div>
      </section>

      <section className="bg-[#F7F4ED] px-6 py-16 text-[#03112B]">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="The PBX journey"
            title="People first. Payments inside the conversation."
            text="PBX is organized around the way Filipino families and businesses already coordinate money: people, context, conversation, and clear status."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {demoSteps.map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#03112B]/10 bg-white p-5 shadow-sm">
                <div className="mb-4 text-sm font-bold text-[#B7953F]">0{index + 1}</div>
                <p className="text-sm font-semibold leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureBand />
      <HowItWorksPreview />

      <section className="bg-[#03112B] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-[22px] border border-[#D6B14A]/25 bg-[#061A3A] p-8 text-center shadow-dark md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#D6B14A]">Join the PBX network</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-[#F7F4ED]">
            Create your PBX identity and start from People.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#A9B5C8]">
            Explore the social wallet experience with demo balances while banking, payout, and treasury integrations are configured.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/register" className="rounded-xl bg-[#D6B14A] px-7 py-4 font-bold text-[#03112B] hover:bg-[#E0C16A]">
              Create Your PBX Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="rounded-[28px] border border-white/10 bg-[#F1EDE4] p-4 shadow-dark">
        <div className="rounded-[22px] bg-[#03112B] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6B14A]">PBX Conversation</p>
              <h2 className="mt-1 text-xl font-bold text-[#F7F4ED]">Jose Reyes</h2>
            </div>
            <div className="rounded-full bg-[#2F9E75]/15 px-3 py-1 text-xs font-bold text-[#7AD7B7]">Connected</div>
          </div>

          <div className="space-y-3">
            {demoConversation.map((message) => (
              <PreviewBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {demoWallets.map((wallet) => (
              <div key={wallet.currency} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold text-[#A9B5C8]">{wallet.currency}</p>
                <p className="mt-1 font-financial text-lg font-bold text-[#F7F4ED]">{wallet.balance}</p>
                <p className="mt-1 text-[11px] text-[#E0C16A]">{wallet.state}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-[#F7F4ED] p-4 text-[#03112B]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold">Recent activity</h3>
              <span className="text-xs font-semibold text-[#53647E]">Demo feed</span>
            </div>
            <div className="space-y-2">
              {demoActivity.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-xs text-[#53647E]">{item.type} • {item.status}</p>
                  </div>
                  <p className="font-financial text-sm font-bold">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBubble({ message }) {
  const isMaria = message.from === "Maria";
  if (message.type === "payment" || message.type === "request") {
    return (
      <div className={`max-w-[82%] rounded-2xl p-4 ${isMaria ? "ml-auto bg-[#D6B14A] text-[#03112B]" : "bg-white text-[#03112B]"}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em]">{message.type === "payment" ? "Payment" : "Request"}</p>
        <p className="mt-1 font-financial text-2xl font-extrabold">{message.amount}</p>
        <p className="text-sm">{message.note}</p>
        <p className="mt-2 text-xs font-semibold opacity-75">{message.status} • {message.time}</p>
      </div>
    );
  }
  return (
    <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${isMaria ? "ml-auto bg-[#D6B14A] text-[#03112B]" : "bg-white/10 text-[#F7F4ED]"}`}>
      {message.text}
      <div className="mt-1 text-[11px] opacity-65">{message.time}</div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#B7953F]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-bold tracking-[-0.03em] md:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-[#53647E]">{text}</p>
    </div>
  );
}

function FeatureBand() {
  const features = [
    ["Social payments", "Find PBX users, connect, chat, pay, and request money with context."],
    ["Wallets and conversion", "Hold USD, PHP, and digital-dollar structures with clearly labeled demo states."],
    ["Cross-border transfers", "External recipient flows remain available as a secondary path."],
    ["Business payments", "Discover businesses, message them, and pay from the same PBX network."],
    ["Security controls", "Session handling, status labels, route guards, and account controls stay visible."],
    ["Notifications", "Message, request, payment, and account-activity notifications are represented structurally."],
  ];

  return (
    <section className="bg-[#061A3A] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Complete product structure"
          title="A social wallet, not a remittance form."
          text="PBX-to-PBX payments are primary. External rails, banks, FX, Circle, PayMongo, email, and SMS can remain mocked or sandboxed while the full experience is restored."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-bold text-[#F7F4ED]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#A9B5C8]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksPreview() {
  return (
    <section className="bg-[#F1EDE4] px-6 py-16 text-[#03112B]">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <SectionIntro
            eyebrow="How PBX works"
            title="From identity to conversation to payment."
            text="The primary PBX flow starts with a searchable identity and ends with payment activity inside a private conversation."
          />
          <div className="mt-8 flex gap-3">
            <Link to="/how-it-works" className="rounded-xl bg-[#03112B] px-5 py-3 font-bold text-[#F7F4ED]">See the flow</Link>
            <Link to="/personal" className="rounded-xl border border-[#03112B]/15 px-5 py-3 font-bold">Personal accounts</Link>
          </div>
        </div>
        <div className="grid gap-4">
          {["Sign up and choose a PBX handle", "Find family, friends, and businesses", "Open a chat and pay or request", "Track wallet and activity status"].map((step) => (
            <div key={step} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Landing;

