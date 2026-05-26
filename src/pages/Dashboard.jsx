import React from "react";
import {
  Atom,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock3,
  FileText,
  Lock,
  Network,
  Radar,
  Save,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { Panel, Pill, Button, Info, MiniBars } from "../components/UI";
import GuidePanel from "../components/GuidePanel";
import RealTimeNetworkPanel from "../components/RealTimeNetworkPanel";
import { generateDiscoveryEngine } from "../features/discoveryEngine";

export default function Dashboard({ setPage, saveWorkspace, loadWorkspace, session, isPro, startCheckout }) {
  return <><Panel className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><div><Pill gold><Sparkles size={12}/> production preview</Pill><h1 className="mt-4 text-5xl font-black sm:text-7xl">ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Material Intelligence Platform</span></h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Explore, compare and publish material behaviour. ElementOS now feels like a subscriber-ready research workspace: accounts, live simulation, visual comparison, graph intelligence and exportable reports.</p><Info title="Positioning upgrade">Public language has been cleaned up. The product now leads with material intelligence, simulation, research reports and workspace value instead of internal prototype wording.</Info></div><Panel><h2 className="text-2xl font-black">Launch Workspace</h2>{[["Create Account", "login", UserPlus], ["Beta Launch", "beta", UserPlus], ["AI Copilot", "copilot", Sparkles], ["Mission Control", "mission", CheckCircle2], ["Discover", "discover", Sparkles], ["Time Machine", "timemachine", Clock3], ["Scenario Builder", "scenario", FileText], ["Well Driller", "welldriller", Radar], ["Seismo", "seismo", Network], ["Simulation Reports", "simreports", BookOpen], ["Viral Card Studio", "viralcards", Sparkles], ["Calculation Core", "calculations", Calculator], ["My Lab", "lab", Save], ["Visual Engine", "visualization", BarChart3], ["Run Compare", "compare", BarChart3], ["Open Live Atlas", "atlas", Radar], ["Isotope Lab", "isotopes", Atom], ["Generate Report", "reports", FileText]].map(([label, id, Icon], i) => <Button key={id} onClick={() => setPage(id)} className="mt-3 w-full" variant={i === 1 ? "primary" : "ghost"}><Icon className="inline" size={16}/> {label}</Button>)}{session && <div className="mt-4 grid gap-3"><Button onClick={saveWorkspace} variant="primary" className="w-full"><Save size={16} className="inline"/> Save Workspace</Button><Button onClick={loadWorkspace} className="w-full">Restore Workspace</Button></div>}{!session && <Button onClick={() => setPage("login")} variant="primary" className="mt-4 w-full"><Lock size={16} className="inline"/> Sign in to Upgrade</Button>}{session && !isPro && <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-100">Billing</div><Button onClick={startCheckout} variant="primary" className="w-full"><Sparkles size={16} className="inline"/> Upgrade to Pro Lab</Button><p className="mt-3 text-xs leading-5 text-amber-100/80">Unlock premium PDF exports and Pro workspace features through Stripe Sandbox.</p></div>}{session && isPro && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab Active</div>}</Panel></Panel><div className="grid gap-6 xl:grid-cols-4">{[["118", "elements"], ["7", "behaviour metrics"], ["4", "export modes"], ["Live", "simulation layer"]].map(([a,b]) => <Panel key={b}><div className="text-4xl font-black text-cyan-100">{a}</div><div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{b}</div></Panel>)}</div>
<GuidePanel page="dashboard" />
<RealTimeNetworkPanel discoveries={generateDiscoveryEngine(8)} setPage={setPage} />
<Panel>
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <Pill gold>
        <Network size={12} /> live network
      </Pill>
      <h2 className="mt-3 text-4xl font-black">ElementOS Activity Layer</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        Live platform telemetry designed to make the workspace feel active,
        collaborative and constantly evolving.
      </p>
    </div>
    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
      ● Network Stable
    </div>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {[
      ["12,482", "simulations today"],
      ["842", "active researchers"],
      ["3,942", "reports generated"],
      ["128", "public discoveries shared"],
    ].map(([value, label]) => (
      <div
        key={label}
        className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 to-black/40 p-5"
      >
        <div className="text-4xl font-black text-cyan-100">{value}</div>
        <div className="mt-2 text-xs uppercase tracking-[.22em] text-slate-400">{label}</div>
      </div>
    ))}
  </div>

  <div className="mt-6 grid gap-5 xl:grid-cols-3">
    {[
      ["Titanium + Tungsten trending", "High thermal-pressure compatibility interactions detected."],
      ["Copper behaviour spike", "Conductive comparison activity increased 18% this hour."],
      ["Public report momentum", "New compatibility discoveries are actively being shared."],
    ].map(([title, desc]) => (
      <div key={title} className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
        <div className="text-lg font-black text-cyan-100">{title}</div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
      </div>
    ))}
  </div>
</Panel>

<Panel>
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <Pill gold>
        <UserPlus size={12} /> researcher profile
      </Pill>
      <h2 className="mt-3 text-4xl font-black">Researcher Identity Layer</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        Profiles and discovery stats make ElementOS feel personal, returnable and community-driven.
      </p>
    </div>
    <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">
      Top Titanium Researcher
    </div>
  </div>

  <div className="mt-6 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
    <div className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl border border-cyan-300/30 bg-cyan-300/10 text-2xl font-black text-cyan-100">
          {(session?.user?.email || "R").slice(0, 1).toUpperCase()}
        </div>
        <div>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Research profile</div>
          <div className="mt-1 text-2xl font-black text-cyan-100">
            {session?.user?.email || "Guest Researcher"}
          </div>
          <div className="mt-1 text-sm text-slate-400">ElementOS Discovery Network</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["1,248", "simulations"],
          ["32", "exports"],
          ["14", "shared discoveries"],
          ["97%", "profile signal"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-3xl font-black text-emerald-200">{value}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
        Badge unlocked: <b>Material Discovery Founder</b>. Users now have a reason to return and grow their research identity.
      </div>
    </div>

    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Public ecosystem</div>
          <h3 className="mt-2 text-2xl font-black">Recent Public Discoveries</h3>
        </div>
        <Pill><Sparkles size={12} /> live feed</Pill>
      </div>

      <div className="mt-5 space-y-3">
        {[
          ["Ti + W", "94%", "Ultra rare thermal-pressure pathway"],
          ["Cu + Ag", "91%", "High-conductivity substitute corridor"],
          ["Al + Fe", "88%", "Structural compatibility report shared"],
          ["Si + Ge", "86%", "Semiconductor-adjacent behaviour match"],
        ].map(([pair, value, desc]) => (
          <div key={pair} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <div>
              <div className="text-lg font-black text-cyan-100">{pair}</div>
              <div className="mt-1 text-sm text-slate-400">{desc}</div>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xl font-black text-emerald-100">
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</Panel>


<Panel>
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <Pill gold><Sparkles size={12} /> growth engine</Pill>
      <h2 className="mt-3 text-4xl font-black">Researcher Progression Layer</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
        XP, streaks, daily discoveries and leaderboards create the return-loop that turns ElementOS into a habit instead of a one-time tool.
      </p>
    </div>
    <Button onClick={() => setPage("discover")} variant="primary">Open Discovery Feed</Button>
  </div>
  <div className="mt-6 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
    <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
      <div className="text-xs uppercase tracking-[.22em] text-emerald-200">Researcher level</div>
      <div className="mt-3 text-6xl font-black text-emerald-100">LVL 12</div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/30">
        <div className="h-full w-[72%] rounded-full bg-emerald-300" />
      </div>
      <p className="mt-4 text-sm leading-6 text-emerald-50/90">7-day discovery streak active. Your next milestone unlocks the Rare Pair Analyst badge.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {[
        ["Discovery of the Day", "Ti + Hf", "Before 98% of researchers"],
        ["Current Rank", "#12", "Weekly discovery board"],
        ["Share Card", "Ready", "Post your strongest pairing"],
        ["Saved Collection", "24", "Material paths stored"],
      ].map(([title, value, desc]) => (
        <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs uppercase tracking-[.2em] text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-black text-cyan-100">{value}</div>
          <div className="mt-1 text-sm text-slate-400">{desc}</div>
        </div>
      ))}
    </div>
  </div>
</Panel>

<div className="grid gap-6 xl:grid-cols-3"><Panel><h2 className="text-2xl font-black">Live Platform Signal</h2><MiniBars values={[2.8, 3.5, 4.2, 3.8, 4.7, 3.9, 4.4]}/><p className="mt-3 text-sm text-slate-400">Animated-style data blocks give the product more serious scientific dashboard energy.</p></Panel><Panel><h2 className="text-2xl font-black">Subscriber Value</h2><div className="mt-4 space-y-3">{["Saved experiments", "Premium reports", "Material comparison history", "Workspace identity"].map(x => <div key={x} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-cyan-100"><CheckCircle2 size={15} className="mr-2 inline text-emerald-300"/>{x}</div>)}</div></Panel><Panel><h2 className="text-2xl font-black">Scientific OS Feel</h2><p className="mt-4 text-sm leading-7 text-slate-300">Every major page now has a reason to exist: Explorer finds materials, Compare ranks them, Atlas visualizes response fields, Graph explains relationships, Reports turns everything into sellable outputs.</p></Panel></div></>;
}
