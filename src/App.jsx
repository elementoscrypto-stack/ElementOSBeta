import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { supabase } from "./supabaseClient";
import {
  Atom, BarChart3, BookOpen, Calculator, CheckCircle2, ChevronRight, Download,
  FileText, Home, Layers, Lock, Network, Orbit, Radar, Save, Search,
  ShieldCheck, Sparkles, UserPlus
} from "lucide-react";

const rawElements = `H|Hydrogen|1|Nonmetal,He|Helium|2|Noble gas,Li|Lithium|3|Alkali metal,Be|Beryllium|4|Alkaline earth metal,B|Boron|5|Metalloid,C|Carbon|6|Nonmetal,N|Nitrogen|7|Nonmetal,O|Oxygen|8|Nonmetal,F|Fluorine|9|Halogen,Ne|Neon|10|Noble gas,Na|Sodium|11|Alkali metal,Mg|Magnesium|12|Alkaline earth metal,Al|Aluminium|13|Post-transition metal,Si|Silicon|14|Metalloid,P|Phosphorus|15|Nonmetal,S|Sulfur|16|Nonmetal,Cl|Chlorine|17|Halogen,Ar|Argon|18|Noble gas,K|Potassium|19|Alkali metal,Ca|Calcium|20|Alkaline earth metal,Sc|Scandium|21|Transition metal,Ti|Titanium|22|Transition metal,V|Vanadium|23|Transition metal,Cr|Chromium|24|Transition metal,Mn|Manganese|25|Transition metal,Fe|Iron|26|Transition metal,Co|Cobalt|27|Transition metal,Ni|Nickel|28|Transition metal,Cu|Copper|29|Transition metal,Zn|Zinc|30|Transition metal,Ga|Gallium|31|Post-transition metal,Ge|Germanium|32|Metalloid,As|Arsenic|33|Metalloid,Se|Selenium|34|Nonmetal,Br|Bromine|35|Halogen,Kr|Krypton|36|Noble gas,Rb|Rubidium|37|Alkali metal,Sr|Strontium|38|Alkaline earth metal,Y|Yttrium|39|Transition metal,Zr|Zirconium|40|Transition metal,Nb|Niobium|41|Transition metal,Mo|Molybdenum|42|Transition metal,Tc|Technetium|43|Transition metal,Ru|Ruthenium|44|Transition metal,Rh|Rhodium|45|Transition metal,Pd|Palladium|46|Transition metal,Ag|Silver|47|Transition metal,Cd|Cadmium|48|Transition metal,In|Indium|49|Post-transition metal,Sn|Tin|50|Post-transition metal,Sb|Antimony|51|Metalloid,Te|Tellurium|52|Metalloid,I|Iodine|53|Halogen,Xe|Xenon|54|Noble gas,Cs|Caesium|55|Alkali metal,Ba|Barium|56|Alkaline earth metal,La|Lanthanum|57|Lanthanide,Ce|Cerium|58|Lanthanide,Pr|Praseodymium|59|Lanthanide,Nd|Neodymium|60|Lanthanide,Pm|Promethium|61|Lanthanide,Sm|Samarium|62|Lanthanide,Eu|Europium|63|Lanthanide,Gd|Gadolinium|64|Lanthanide,Tb|Terbium|65|Lanthanide,Dy|Dysprosium|66|Lanthanide,Ho|Holmium|67|Lanthanide,Er|Erbium|68|Lanthanide,Tm|Thulium|69|Lanthanide,Yb|Ytterbium|70|Lanthanide,Lu|Lutetium|71|Lanthanide,Hf|Hafnium|72|Transition metal,Ta|Tantalum|73|Transition metal,W|Tungsten|74|Transition metal,Re|Rhenium|75|Transition metal,Os|Osmium|76|Transition metal,Ir|Iridium|77|Transition metal,Pt|Platinum|78|Transition metal,Au|Gold|79|Transition metal,Hg|Mercury|80|Transition metal,Tl|Thallium|81|Post-transition metal,Pb|Lead|82|Post-transition metal,Bi|Bismuth|83|Post-transition metal,Po|Polonium|84|Metalloid,At|Astatine|85|Halogen,Rn|Radon|86|Noble gas,Fr|Francium|87|Alkali metal,Ra|Radium|88|Alkaline earth metal,Ac|Actinium|89|Actinide,Th|Thorium|90|Actinide,Pa|Protactinium|91|Actinide,U|Uranium|92|Actinide,Np|Neptunium|93|Actinide,Pu|Plutonium|94|Actinide,Am|Americium|95|Actinide,Cm|Curium|96|Actinide,Bk|Berkelium|97|Actinide,Cf|Californium|98|Actinide,Es|Einsteinium|99|Actinide,Fm|Fermium|100|Actinide,Md|Mendelevium|101|Actinide,No|Nobelium|102|Actinide,Lr|Lawrencium|103|Actinide,Rf|Rutherfordium|104|Transition metal,Db|Dubnium|105|Transition metal,Sg|Seaborgium|106|Transition metal,Bh|Bohrium|107|Transition metal,Hs|Hassium|108|Transition metal,Mt|Meitnerium|109|Unknown,Ds|Darmstadtium|110|Unknown,Rg|Roentgenium|111|Unknown,Cn|Copernicium|112|Transition metal,Nh|Nihonium|113|Unknown,Fl|Flerovium|114|Unknown,Mc|Moscovium|115|Unknown,Lv|Livermorium|116|Unknown,Ts|Tennessine|117|Unknown,Og|Oganesson|118|Unknown`;

const elements = rawElements.split(",").map(row => {
  const [symbol, name, atomicNumber, category] = row.split("|");
  return { symbol, name, atomicNumber: Number(atomicNumber), category };
});
const elementMap = Object.fromEntries(elements.map(e => [e.symbol, e]));
const categories = ["All", ...Array.from(new Set(elements.map(e => e.category)))];
const metrics = ["stability", "conductivity", "thermal", "diffusion", "pressure", "rarity", "alignment"];
const periodicRows = [
  ["H", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "He"],
  ["Li", "Be", null, null, null, null, null, null, null, null, null, null, "B", "C", "N", "O", "F", "Ne"],
  ["Na", "Mg", null, null, null, null, null, null, null, null, null, null, "Al", "Si", "P", "S", "Cl", "Ar"],
  ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"],
  ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"],
  ["Cs", "Ba", "La", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn"],
  ["Fr", "Ra", "Ac", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"],
  [null, null, null, "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", null],
  [null, null, null, "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", null],
];

function clamp(v) { return Math.max(0.35, Math.min(5, v)); }
function score(sym) {
  const e = elementMap[sym] || elementMap.Al;
  const n = e.atomicNumber;
  const metal = e.category.includes("metal") || ["Transition metal", "Lanthanide", "Actinide"].includes(e.category);
  const noble = e.category === "Noble gas";
  const heavy = n > 80;
  return {
    stability: clamp((noble ? 4.7 : metal ? 3.65 : 2.6) + ((n % 7) - 3) * 0.09 - (heavy ? 0.35 : 0)),
    conductivity: clamp((metal ? 4.15 : 1.35) + ((n % 5) - 2) * 0.16),
    thermal: clamp(2.25 + ((n % 11) - 4) * 0.17 + (metal ? 0.75 : 0)),
    diffusion: clamp(2.2 + ((n % 9) - 4) * 0.16 + (n < 12 ? 0.3 : 0)),
    pressure: clamp(2.45 + ((n % 13) - 6) * 0.11 + (metal ? 0.45 : 0)),
    rarity: clamp(1.15 + n / 30),
    alignment: Math.max(0, Math.min(100, 100 - Math.abs(n - 13) * 1.55)),
  };
}

function compatibilityScore(a, b) {
  const sa = score(a);
  const sb = score(b);

  const diff =
    Math.abs(sa.stability - sb.stability) +
    Math.abs(sa.conductivity - sb.conductivity) +
    Math.abs(sa.thermal - sb.thermal) +
    Math.abs(sa.diffusion - sb.diffusion) +
    Math.abs(sa.pressure - sb.pressure);

  return Math.max(12, Math.min(99, Math.round(100 - diff * 7.5)));
}

function rarityTier(score) {
  if (score >= 95) return "LEGENDARY";
  if (score >= 88) return "ULTRA RARE";
  if (score >= 78) return "RARE";
  if (score >= 65) return "UNCOMMON";
  return "COMMON";
}

function materialDNA(a, b) {
  return `${a}-${b}-${Math.abs(
    a.charCodeAt(0) * 7 +
    b.charCodeAt(0) * 13
  ).toString(16).toUpperCase()}`;
}

function heatStyle(value, max = 5) {
  const t = Math.max(0, Math.min(1, value / max));
  const hue = 220 - t * 170;
  return { background: `linear-gradient(135deg,hsl(${hue} 92% ${34 + t * 20}%),hsl(${hue - 20} 88% ${24 + t * 10}%))`, color: t > 0.55 ? "#05111f" : "#e0f2fe" };
}
function downloadFile(name, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function Panel({ children, className = "" }) {
  return <div className={`relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-white/[.055] p-5 shadow-[0_0_80px_rgba(34,211,238,.12),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl ${className}`}><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.10),transparent_36%)]"/><div className="relative z-10">{children}</div></div>;
}
function Pill({ children, gold = false }) { return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[.22em] ${gold ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}`}>{children}</span>; }
function Button({ children, onClick, variant = "ghost", className = "" }) {
  const styles = variant === "primary" ? "bg-cyan-300 text-slate-950" : variant === "danger" ? "border border-rose-300/20 bg-rose-300/10 text-rose-100" : "border border-white/10 bg-white/[.04] text-slate-100 hover:border-cyan-300/30";
  return <button onClick={onClick} className={`rounded-2xl px-4 py-3 font-bold transition hover:scale-[1.02] ${styles} ${className}`}>{children}</button>;
}
function Info({ title, children }) { return <div className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-50"><div className="mb-1 text-xs font-black uppercase tracking-[.22em] text-cyan-200">{title}</div><div className="leading-6 text-slate-200">{children}</div></div>; }
function Background() { return <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,.18),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,.16),transparent_34%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,auto,38px_38px,38px_38px]"/><div className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/25 via-fuchsia-400/18 to-emerald-400/22 blur-3xl"/></div>; }
function MiniBars({ values, max = 5 }) { return <div className="flex h-28 items-end gap-2">{values.map((v, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-cyan-300/80" style={{ height: `${Math.max(8, (v / max) * 100)}%` }}/><span className="text-[10px] text-slate-500">{i + 1}</span></div>)}</div>; }
function RadarChart({ data }) {
  const keys = ["stability", "conductivity", "thermal", "diffusion", "pressure", "rarity"];
  const points = keys.map((k, i) => { const angle = -Math.PI / 2 + (i / keys.length) * Math.PI * 2; const r = (data[k] / 5) * 42; return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`; }).join(" ");
  return <svg viewBox="0 0 100 100" className="h-52 w-full"><polygon points="50,8 86,29 86,71 50,92 14,71 14,29" fill="none" stroke="rgba(255,255,255,.18)"/><polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="rgba(255,255,255,.11)"/><polygon points={points} fill="rgba(34,211,238,.28)" stroke="rgba(34,211,238,.95)" strokeWidth="1.5"/>{keys.map((k, i) => { const angle = -Math.PI / 2 + (i / keys.length) * Math.PI * 2; return <text key={k} x={50 + Math.cos(angle) * 48} y={52 + Math.sin(angle) * 48} textAnchor="middle" className="fill-slate-300 text-[4px] uppercase">{k.slice(0, 4)}</text>; })}</svg>;
}
function Sidebar({ page, setPage }) {
  const items = [["dashboard", "Dashboard", Home], ["login", "Account", Lock], ["explorer", "Explorer", Search], ["periodic", "Periodic Table", Layers], ["compare", "Compare", BarChart3], ["atlas", "Behaviour Atlas", Radar], ["graph", "Behaviour Graph", Network], ["universe", "Similarity Universe", Orbit], ["isotopes", "Isotope Lab", Atom], ["calculations", "Calculation Core", Calculator], ["reports", "Reports", BookOpen]];
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[310px] overflow-y-auto border-r border-cyan-300/15 bg-[#030712]/90 p-5 backdrop-blur-2xl lg:block"><div className="mb-7"><div className="text-2xl font-black tracking-[.22em] text-cyan-100">ElementOS</div><div className="text-[10px] uppercase tracking-[.3em] text-slate-500">material intelligence platform</div></div><div className="space-y-2">{items.map(([id, label, Icon]) => <button key={id} onClick={() => setPage(id)} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${page === id ? "border-cyan-300/30 bg-cyan-400/10 text-white" : "border-white/5 bg-white/[.025] text-slate-300"}`}><span className="flex items-center gap-3"><Icon size={16} className="text-cyan-300"/>{label}</span><ChevronRight size={14}/></button>)}</div></aside>;
}
function Dashboard({ setPage, saveWorkspace, loadWorkspace, session, isPro, startCheckout }) {
  return <><Panel className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><div><Pill gold><Sparkles size={12}/> production preview</Pill><h1 className="mt-4 text-5xl font-black sm:text-7xl">ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Material Intelligence Platform</span></h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Explore, compare and publish material behaviour. ElementOS now feels like a subscriber-ready research workspace: accounts, live simulation, visual comparison, graph intelligence and exportable reports.</p><Info title="Positioning upgrade">Public language has been cleaned up. The product now leads with material intelligence, simulation, research reports and workspace value instead of internal prototype wording.</Info></div><Panel><h2 className="text-2xl font-black">Launch Workspace</h2>{[["Create Account", "login", UserPlus], ["Run Compare", "compare", BarChart3], ["Open Live Atlas", "atlas", Radar], ["Isotope Lab", "isotopes", Atom], ["Generate Report", "reports", FileText]].map(([label, id, Icon], i) => <Button key={id} onClick={() => setPage(id)} className="mt-3 w-full" variant={i === 1 ? "primary" : "ghost"}><Icon className="inline" size={16}/> {label}</Button>)}{session && <div className="mt-4 grid gap-3"><Button onClick={saveWorkspace} variant="primary" className="w-full"><Save size={16} className="inline"/> Save Workspace</Button><Button onClick={loadWorkspace} className="w-full">Restore Workspace</Button></div>}{!session && <Button onClick={() => setPage("login")} variant="primary" className="mt-4 w-full"><Lock size={16} className="inline"/> Sign in to Upgrade</Button>}{session && !isPro && <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-100">Billing</div><Button onClick={startCheckout} variant="primary" className="w-full"><Sparkles size={16} className="inline"/> Upgrade to Pro Lab</Button><p className="mt-3 text-xs leading-5 text-amber-100/80">Unlock premium PDF exports and Pro workspace features through Stripe Sandbox.</p></div>}{session && isPro && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab Active</div>}</Panel></Panel><div className="grid gap-6 xl:grid-cols-4">{[["118", "elements"], ["7", "behaviour metrics"], ["4", "export modes"], ["Live", "simulation layer"]].map(([a,b]) => <Panel key={b}><div className="text-4xl font-black text-cyan-100">{a}</div><div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{b}</div></Panel>)}</div><div className="grid gap-6 xl:grid-cols-3"><Panel><h2 className="text-2xl font-black">Live Platform Signal</h2><MiniBars values={[2.8, 3.5, 4.2, 3.8, 4.7, 3.9, 4.4]}/><p className="mt-3 text-sm text-slate-400">Animated-style data blocks give the product more serious scientific dashboard energy.</p></Panel><Panel><h2 className="text-2xl font-black">Subscriber Value</h2><div className="mt-4 space-y-3">{["Saved experiments", "Premium reports", "Material comparison history", "Workspace identity"].map(x => <div key={x} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-cyan-100"><CheckCircle2 size={15} className="mr-2 inline text-emerald-300"/>{x}</div>)}</div></Panel><Panel><h2 className="text-2xl font-black">Scientific OS Feel</h2><p className="mt-4 text-sm leading-7 text-slate-300">Every major page now has a reason to exist: Explorer finds materials, Compare ranks them, Atlas visualizes response fields, Graph explains relationships, Reports turns everything into sellable outputs.</p></Panel></div></>;
}
function LoginAccount({ session, setSession, setPage, isPro, startCheckout }) {
  const [email, setEmail] = useState("researcher@elementos.ai");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("Paul Roper");
  const [plan, setPlan] = useState("Pro Lab");
  const [message, setMessage] = useState("");

  const signUp = async () => {
    setMessage("Creating account...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, plan } },
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSession(data.session);
    setMessage("Account created. Workspace ready.");
  };

  const signIn = async () => {
    setMessage("Signing in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setSession(data.session);
    setMessage("Signed in successfully.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMessage("Signed out.");
  };

  const plans = [
    ["Explorer", "$19", "Start exploring elements and calculations."],
    ["Pro Lab", "$49", "Save workspaces, export reports and run deeper visual simulations."],
    ["Research Team", "$149", "Shared workspaces, team reporting and enterprise exports."],
  ];

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1fr_.9fr]">
        <div>
          <Pill gold><ShieldCheck size={12} /> secure research workspace</Pill>
          <h1 className="mt-4 text-5xl font-black">Account & Workspace</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Real Supabase authentication is now connected. Users can create accounts, sign in, sign out and keep sessions active.
          </p>

          {session && (
            <Info title="Active Session">
              Signed in as <b>{session.user.email}</b>. ElementOS is now running as a cloud-connected SaaS app.
            </Info>
          )}
        </div>

        <Panel>
          <h2 className="text-3xl font-black">
            {session ? "Workspace Active" : "Login / Create Account"}
          </h2>

          {!session ? (
            <div className="mt-5 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"
              />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"
              />

              <Button variant="primary" onClick={signUp}>Create Account</Button>
              <Button onClick={signIn}>Sign In</Button>

              {message && <p className="text-sm text-cyan-200">{message}</p>}
            </div>
          ) : (
            <div className="mt-5">
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                <div className="text-xs uppercase tracking-[.2em] text-emerald-200">Signed in</div>
                <div className="mt-2 text-2xl font-black text-emerald-100">{session.user.email}</div>
                <div className="text-sm text-slate-300">Plan: {plan}</div>
              </div>

              <Button variant="primary" onClick={() => setPage("dashboard")} className="mt-4 w-full">
                Enter ElementOS
              </Button>

              {!isPro && (
                <Button onClick={startCheckout} variant="primary" className="mt-3 w-full">
                  <Sparkles size={16} className="inline" /> Upgrade to Pro Lab
                </Button>
              )}

              {isPro && (
                <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100">
                  <CheckCircle2 size={16} className="mr-2 inline" /> Pro Lab Active
                </div>
              )}

              <Button onClick={signOut} className="mt-3 w-full">
                Sign Out
              </Button>

              {message && <p className="mt-3 text-sm text-cyan-200">{message}</p>}
            </div>
          )}
        </Panel>
      </Panel>

      <Panel>
        <h2 className="text-3xl font-black">Choose Plan</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {plans.map(([p, price, desc]) => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-[2rem] border p-6 text-left transition hover:scale-[1.02] ${
                plan === p ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/25"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-cyan-100">{p}</h3>
                <div className="text-3xl font-black text-emerald-200">{price}</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{desc}</p>
            </button>
          ))}
        </div>
      </Panel>
    </>
  );
}
function Explorer({ selected, setSelected, setCompare }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All");
  const filtered = elements.filter(e => (cat === "All" || e.category === cat) && `${e.symbol} ${e.name} ${e.category}`.toLowerCase().includes(q.toLowerCase())).slice(0, 80);
  const el = elementMap[selected] || elementMap.Al; const s = score(selected);
  return <><Panel><Pill gold><Search size={12}/> material explorer</Pill><h1 className="mt-4 text-5xl font-black">Element Explorer</h1><Info title="User value">Search and inspect the behaviour profile of each element before adding it to a comparison or report.</Info></Panel><div className="grid gap-6 xl:grid-cols-[420px_1fr]"><Panel><div className="flex gap-2 rounded-2xl border border-white/10 bg-black/25 p-3"><Search className="text-cyan-300"/><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search elements..." className="w-full bg-transparent outline-none"/></div><select value={cat} onChange={(e) => setCat(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select><div className="mt-4 max-h-[620px] overflow-auto pr-2">{filtered.map(e => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className={`mb-2 flex w-full items-center justify-between rounded-2xl border p-3 text-left ${selected === e.symbol ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-white/[.03]"}`}><span><b>{e.symbol}</b> · {e.name}<div className="text-xs text-slate-500">{e.category}</div></span><ChevronRight size={15}/></button>)}</div></Panel><Panel><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><div><div className="text-8xl font-black text-cyan-100">{el.symbol}</div><h2 className="mt-2 text-4xl font-black">{el.name}</h2><p className="mt-2 text-slate-400">Atomic number {el.atomicNumber} · {el.category}</p><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{metrics.map(k => <div key={k} className="rounded-3xl border border-white/10 bg-black/25 p-4"><div className="text-xs uppercase tracking-[.22em] text-slate-500">{k === "alignment" ? "Alignment" : k}</div><div className="mt-2 text-3xl font-black text-cyan-100">{k === "alignment" ? s[k].toFixed(0) : s[k].toFixed(2)}</div></div>)}</div><Button onClick={() => setCompare(x => x.includes(el.symbol) ? x : [...x, el.symbol].slice(0, 8))} variant="primary" className="mt-6">Add {el.symbol} to Compare</Button></div><Panel><h3 className="text-xl font-black">Behaviour Radar</h3><RadarChart data={s}/><p className="text-sm text-slate-400">A visual profile makes each element instantly understandable.</p></Panel></div></Panel></div></>;
}
function PeriodicTable({ selected, setSelected }) {
  const [layer, setLayer] = useState("conductivity"); const [cat, setCat] = useState("All");
  return <><Panel><Pill gold><Layers size={12}/> full element map</Pill><h1 className="mt-4 text-5xl font-black">Periodic Table</h1><Info title="Heat layers">Switch between behaviour metrics to reveal material response patterns across all 118 elements.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(l => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{l === "alignment" ? "Alignment" : l}</Button>)}<select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select></div></Panel><Panel className="overflow-auto"><div className="grid min-w-[1050px] gap-2">{periodicRows.map((row, ri) => <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: "repeat(18,minmax(0,1fr))" }}>{row.map((sym, i) => { const el = sym ? elementMap[sym] : null; const inactive = el && cat !== "All" && el.category !== cat; return el ? <button key={sym} onClick={() => setSelected(sym)} className={`h-16 rounded-2xl border transition hover:scale-110 ${selected === sym ? "ring-2 ring-white" : ""} ${inactive ? "opacity-25" : ""}`} style={heatStyle(score(sym)[layer], layer === "alignment" ? 100 : 5)}><div className="text-[9px]">{el.atomicNumber}</div><b>{sym}</b><div className="text-[9px]">{score(sym)[layer].toFixed(layer === "alignment" ? 0 : 1)}</div></button> : <div key={i} className="h-16 rounded-2xl border border-cyan-300/5 bg-cyan-300/[.01]"/>; })}</div>)}</div></Panel></>;
}
function Compare({ compare, setCompare, setPage }) {
  const [candidate, setCandidate] = useState("Al"); const rows = compare.map(sym => ({ ...elementMap[sym], metrics: score(sym) }));
  return <><Panel><Pill gold><BarChart3 size={12}/> comparison engine</Pill><h1 className="mt-4 text-5xl font-black">Compare Engine</h1><Info title="Cleaned terminology">ZDAR has been renamed public-facing as <b>Alignment</b>. It remains a branded experimental score, but the table now reads like a serious material decision engine.</Info></Panel><Panel><div className="flex flex-wrap gap-3"><select value={candidate} onChange={(e) => setCandidate(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">{elements.map(e => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}</select><Button onClick={() => setCompare(x => x.includes(candidate) ? x : [...x, candidate].slice(0, 10))} variant="primary">Add Element</Button><Button onClick={() => { setCompare([]); setTimeout(() => setCompare(["Al", "Fe", "Cu", "Ti"]), 10); }}>Reset</Button><Button onClick={() => setPage("reports")}>Create Report</Button></div><div className="mt-6 overflow-auto"><table className="w-full min-w-[980px] border-separate border-spacing-y-2"><thead><tr className="text-left text-xs uppercase tracking-[.18em] text-slate-400"><th className="px-3 py-2">Element</th>{metrics.map(k => <th key={k} className="px-2 py-2">{k === "alignment" ? "Alignment" : k}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.symbol} className="rounded-2xl border border-white/10 bg-white/[.035]"><td className="rounded-l-2xl border-y border-l border-white/10 p-3"><b className="text-cyan-200">{row.symbol}</b><div className="text-xs text-slate-500">{row.name}</div></td>{metrics.map(k => <td key={k} className="border-y border-white/10 p-2 last:rounded-r-2xl last:border-r"><div className="rounded-xl px-3 py-2 text-center text-sm font-bold" style={heatStyle(row.metrics[k], k === "alignment" ? 100 : 5)}>{row.metrics[k].toFixed(k === "alignment" ? 0 : 2)}</div></td>)}</tr>)}</tbody></table></div></Panel><div className="grid gap-6 xl:grid-cols-2"><Panel><h2 className="text-2xl font-black">Compare Chart</h2><MiniBars values={rows.map(r => r.metrics.conductivity)}/><p className="mt-2 text-sm text-slate-400">Conductivity ranking for current compare set.</p></Panel><Panel><h2 className="text-2xl font-black">Decision Summary</h2><p className="mt-3 text-sm leading-7 text-slate-300">{rows[0]?.name || "Aluminium"} leads the current workspace. Use Reports to export this as a branded comparison brief with chart notes and simulation IDs.</p></Panel></div></>;
}
function BehaviourAtlas({ selected, setSelected }) {
  const [layer, setLayer] = useState("conductivity"); const [environment, setEnvironment] = useState("Lab air"); const selectedElement = elementMap[selected] || elementMap.Al; const selectedScore = score(selected);
  const fieldCells = Array.from({ length: 128 }, (_, i) => { const e = elements[(i * 7) % elements.length]; const wave = Math.sin(i / 5) * 0.35; return { element: e, value: Math.max(0.2, Math.min(layer === "alignment" ? 100 : 5, score(e.symbol)[layer] + wave)) }; });
  const top = elements.map(e => ({ ...e, metrics: score(e.symbol) })).sort((a, b) => b.metrics[layer] - a.metrics[layer]).slice(0, 8);
  return <><Panel><Pill gold><Radar size={12}/> live simulation layer</Pill><h1 className="mt-4 text-5xl font-black">Behaviour Atlas</h1><Info title="Now useful">This is no longer another periodic table. It is a live material field map for seeing behaviour intensity, environmental context and top-ranked materials.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(l => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{l === "alignment" ? "Alignment" : l}</Button>)}<select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{["Lab air", "Vacuum", "High pressure", "Salt exposure", "High temperature", "Cryogenic"].map(x => <option key={x}>{x}</option>)}</select></div></Panel><div className="grid gap-6 xl:grid-cols-[1fr_420px]"><Panel><div className="flex items-center justify-between"><h2 className="text-3xl font-black">Behaviour Field Map</h2><Pill gold>{environment}</Pill></div><div className="mt-6 grid grid-cols-8 gap-2 md:grid-cols-12 xl:grid-cols-16">{fieldCells.map((cell, i) => <button key={`${cell.element.symbol}-${i}`} onClick={() => setSelected(cell.element.symbol)} className={`aspect-square rounded-2xl border text-xs font-black transition hover:scale-110 ${selected === cell.element.symbol ? "ring-2 ring-white" : "border-white/10"}`} style={heatStyle(cell.value, layer === "alignment" ? 100 : 5)}>{cell.element.symbol}</button>)}</div></Panel><Panel><h2 className="text-2xl font-black">Selected Telemetry</h2><div className="mt-4 text-6xl font-black text-cyan-100">{selectedElement.symbol}</div><div className="text-2xl font-black">{selectedElement.name}</div><RadarChart data={selectedScore}/><p className="text-sm leading-7 text-slate-300">In {environment}, {selectedElement.name} shows a {selectedScore[layer] > (layer === "alignment" ? 65 : 3.5) ? "strong" : "moderate"} {layer} signal.</p></Panel></div><Panel><h2 className="text-3xl font-black">Top Materials for {layer}</h2><div className="mt-5 grid gap-3 md:grid-cols-4">{top.map((e, i) => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left"><div className="text-xs text-slate-500">#{i + 1}</div><div className="text-2xl font-black text-cyan-100">{e.symbol}</div><div className="text-sm text-slate-400">{e.name}</div></button>)}</div></Panel></>;
}
function BehaviourGraph({ selected, setSelected }) {
  const [metric, setMetric] = useState("conductivity"); const selectedScore = score(selected);
  const related = elements.filter(e => e.symbol !== selected).map(e => { const s = score(e.symbol); const distance = Math.abs(s.stability - selectedScore.stability) + Math.abs(s.conductivity - selectedScore.conductivity) + Math.abs(s.thermal - selectedScore.thermal) + Math.abs(s.diffusion - selectedScore.diffusion); return { ...e, metrics: s, similarity: Math.max(0, 100 - distance * 13) }; }).sort((a,b) => b.similarity - a.similarity).slice(0, 18);
  const nodes = related.map((e, i) => ({ ...e, x: 50 + Math.cos(i / related.length * Math.PI * 2) * (20 + (i % 5) * 5), y: 50 + Math.sin(i / related.length * Math.PI * 2) * (20 + (i % 5) * 5) }));
  return <><Panel><Pill gold><Network size={12}/> relationship intelligence</Pill><h1 className="mt-4 text-5xl font-black">Behaviour Graph</h1><Info title="Reason to exist">The graph explains which materials are behaviour-adjacent to the selected element and gives a similarity ranking.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(m => <Button key={m} onClick={() => setMetric(m)} variant={metric === m ? "primary" : "ghost"}>{m === "alignment" ? "Alignment" : m}</Button>)}</div></Panel><div className="grid gap-6 xl:grid-cols-[1fr_430px]"><Panel><div className="relative h-[660px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/35"><svg className="absolute inset-0 h-full w-full">{nodes.map(n => <line key={n.symbol} x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`} stroke="rgba(34,211,238,.22)" strokeWidth="2"/>)}</svg><div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-amber-300/30 bg-amber-300/10 text-3xl font-black text-amber-100">{selected}</div>{nodes.map(n => <button key={n.symbol} onClick={() => setSelected(n.symbol)} className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-cyan-300/20 bg-slate-950/85 text-sm font-black text-cyan-100 transition hover:scale-125" style={{ left: `${n.x}%`, top: `${n.y}%`, boxShadow: `0 0 ${10 + (n.metrics[metric] / (metric === "alignment" ? 100 : 5)) * 40}px rgba(34,211,238,.35)` }}>{n.symbol}</button>)}</div></Panel><Panel><h2 className="text-2xl font-black">Closest Matches</h2><div className="mt-4 space-y-2">{related.slice(0, 8).map(e => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3 text-left"><span><b className="text-cyan-100">{e.symbol}</b> <span className="text-slate-400">{e.name}</span></span><span className="font-black text-emerald-200">{e.similarity.toFixed(0)}%</span></button>)}</div></Panel></div></>;
}
function SimilarityUniverse({ selected, setSelected }) {
  const [mode, setMode] = useState("alloy"); const base = elementMap[selected] || elementMap.Al; const baseScore = score(selected);
  const relationships = elements.filter(e => e.symbol !== selected).map(e => { const s = score(e.symbol); const similarity = Math.max(0, 100 - (Math.abs(baseScore.conductivity - s.conductivity) + Math.abs(baseScore.thermal - s.thermal) + Math.abs(baseScore.stability - s.stability)) * 9); const reason = mode === "alloy" ? (e.category.includes("metal") && base.category.includes("metal") ? "metallic / alloy-adjacent behaviour" : "limited alloy compatibility") : mode === "conductive" ? "conductivity pathway match" : "thermal transfer pathway match"; return { ...e, similarity, reason }; }).sort((a,b) => b.similarity - a.similarity).slice(0, 12);
  return <><Panel><Pill gold><Orbit size={12}/> substitution discovery</Pill><h1 className="mt-4 text-5xl font-black">Similarity Universe</h1><Info title="Clear purpose">This page finds substitute, adjacent or compatible materials by behaviour. It turns “universe” into a real discovery engine.</Info><div className="mt-4 flex flex-wrap gap-2">{["alloy", "conductive", "thermal"].map(m => <Button key={m} onClick={() => setMode(m)} variant={mode === m ? "primary" : "ghost"}>{m}</Button>)}</div></Panel><div className="grid gap-6 xl:grid-cols-[1fr_420px]"><Panel><div className="relative h-[620px] rounded-[2rem] border border-cyan-300/15 bg-black/35"><div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-amber-300/10 p-7 text-center text-3xl font-black text-amber-100">{base.symbol}</div>{relationships.map((r, i) => { const angle = (i / relationships.length) * Math.PI * 2; const radius = 160 + (i % 4) * 48; return <button key={r.symbol} onClick={() => setSelected(r.symbol)} className="absolute h-16 w-16 rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-100 transition hover:scale-125" style={{ left: `calc(50% + ${Math.cos(angle) * radius}px - 2rem)`, top: `calc(50% + ${Math.sin(angle) * radius}px - 2rem)` }}>{r.symbol}</button>; })}</div></Panel><Panel><h2 className="text-2xl font-black">Why it matters</h2><p className="mt-3 text-sm leading-7 text-slate-300">For {base.name}, ElementOS ranks materials that may behave similarly under {mode} conditions. This supports substitution thinking, material discovery and report generation.</p><div className="mt-5 space-y-2">{relationships.slice(0, 6).map(r => <div key={r.symbol} className="rounded-2xl border border-white/10 bg-black/25 p-3"><b className="text-cyan-100">{r.symbol} · {r.name}</b><div className="text-sm text-slate-400">{r.reason} · {r.similarity.toFixed(0)}%</div></div>)}</div></Panel></div></>;
}

function IsotopeLab() {
  const [symbol, setSymbol] = useState("Ti");
  const [protons, setProtons] = useState(22);
  const [neutrons, setNeutrons] = useState(26);
  const [field, setField] = useState(62);
  const [temperature, setTemperature] = useState(38);
  const [pressure, setPressure] = useState(24);

  const selectedElement = elementMap[symbol] || elementMap.Ti;
  const massNumber = protons + neutrons;
  const neutronRatio = protons > 0 ? neutrons / protons : 0;
  const magicNumbers = [2, 8, 20, 28, 50, 82, 126];
  const shellBonus = magicNumbers.includes(protons) || magicNumbers.includes(neutrons) ? 12 : 0;
  const balancePenalty = Math.abs(neutrons - protons * 1.35) * 2.1;
  const environmentBonus = field * 0.08 - temperature * 0.045 - pressure * 0.03;
  const stability = Math.max(0, Math.min(100, 82 - balancePenalty + shellBonus + environmentBonus));
  const decayRisk = Math.max(0, Math.min(100, 100 - stability));
  const bindingSignal = Math.max(0, Math.min(100, 42 + stability * 0.48 + Math.sin(massNumber / 7) * 8));
  const isotopeName = `${selectedElement.name}-${massNumber}`;
  const shellLabel = stability > 78 ? "high stability candidate" : stability > 52 ? "moderate stability candidate" : "unstable / high decay-risk candidate";

  const nucleus = Array.from({ length: Math.min(96, massNumber) }, (_, i) => ({
    type: i % Math.max(2, Math.round(neutronRatio * 2)) === 0 ? "p" : "n",
    angle: (i / Math.min(96, massNumber)) * Math.PI * 2,
    ring: 34 + (i % 5) * 24,
  }));

  const applyElement = (nextSymbol) => {
    const next = elementMap[nextSymbol] || elementMap.Ti;
    setSymbol(next.symbol);
    setProtons(next.atomicNumber);
    setNeutrons(Math.max(1, Math.round(next.atomicNumber * 1.18)));
  };

  const exportSummary = () => {
    downloadFile(
      "elementos-isotope-lab-report.txt",
      `ElementOS Isotope Lab Report\n\nIsotope: ${isotopeName}\nElement: ${selectedElement.name} (${selectedElement.symbol})\nProtons: ${protons}\nNeutrons: ${neutrons}\nMass Number: ${massNumber}\nNeutron Ratio: ${neutronRatio.toFixed(3)}\nStability Score: ${stability.toFixed(1)} / 100\nDecay Risk: ${decayRisk.toFixed(1)} / 100\nBinding Signal: ${bindingSignal.toFixed(1)} / 100\nInterpretation: ${shellLabel}\nGenerated: ${new Date().toLocaleString()}`
    );
  };

  return (
    <>
      <Panel>
        <Pill gold><Atom size={12}/> isotope simulation lab</Pill>
        <h1 className="mt-4 text-5xl font-black">Isotope Lab</h1>
        <Info title="What this page does">
          Build isotope candidates by adjusting proton count, neutron count and environmental field assumptions. This is a visual stability simulator for ElementOS research workflows.
        </Info>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Panel>
          <h2 className="text-2xl font-black">Isotope Builder</h2>

          <label className="mt-5 block text-sm text-slate-400">
            Base element
            <select
              value={symbol}
              onChange={(e) => applyElement(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none"
            >
              {elements.map((e) => (
                <option key={e.symbol} value={e.symbol}>
                  {e.symbol} — {e.name}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 grid gap-4">
            {[
              ["Protons", protons, setProtons, 1, 118],
              ["Neutrons", neutrons, setNeutrons, 0, 180],
              ["Field Strength", field, setField, 0, 100],
              ["Thermal Load", temperature, setTemperature, 0, 100],
              ["Pressure Load", pressure, setPressure, 0, 100],
            ].map(([label, value, setter, min, max]) => (
              <label key={label} className="text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>{label}</span>
                  <span className="font-mono text-cyan-200">{value}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            ))}
          </div>

          <Button variant="primary" onClick={exportSummary} className="mt-6 w-full">
            <Download size={15} className="inline"/> Export Isotope Report
          </Button>
        </Panel>

        <Panel>
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">Active isotope</div>
              <h2 className="mt-2 text-5xl font-black text-cyan-100">{isotopeName}</h2>
              <p className="mt-3 text-slate-300">
                {selectedElement.name} nucleus with {protons} protons and {neutrons} neutrons. Mass number {massNumber}.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["Stability", stability, 100],
                  ["Decay Risk", decayRisk, 100],
                  ["Binding Signal", bindingSignal, 100],
                ].map(([label, value, max]) => (
                  <div key={label} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                    <div className="text-xs uppercase tracking-[.18em] text-slate-500">{label}</div>
                    <div className="mt-2 text-3xl font-black text-cyan-100">{value.toFixed(1)}</div>
                    <div className="mt-3 h-3 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, (value / max) * 100)}%` }}/>
                    </div>
                  </div>
                ))}
              </div>

              <Info title="Simulation Interpretation">
                {isotopeName} is currently a <b>{shellLabel}</b>. Stability improves when neutron balance approaches the modelled stable band and when proton/neutron counts land near shell-favourable numbers.
              </Info>
            </div>

            <div className="relative h-[420px] rounded-[2rem] border border-cyan-300/15 bg-black/35">
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-amber-300/10 text-center text-2xl font-black leading-[5rem] text-amber-100">
                {selectedElement.symbol}
              </div>

              {nucleus.map((dot, i) => (
                <div
                  key={i}
                  className={`absolute h-4 w-4 rounded-full ${dot.type === "p" ? "bg-cyan-300" : "bg-fuchsia-300"}`}
                  style={{
                    left: `calc(50% + ${Math.cos(dot.angle) * dot.ring}px - .5rem)`,
                    top: `calc(50% + ${Math.sin(dot.angle) * dot.ring}px - .5rem)`,
                    boxShadow: dot.type === "p" ? "0 0 18px rgba(34,211,238,.7)" : "0 0 18px rgba(217,70,239,.7)",
                  }}
                  title={dot.type === "p" ? "proton" : "neutron"}
                />
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <h2 className="text-3xl font-black">Isotope Readout</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ["Element", `${selectedElement.name} (${selectedElement.symbol})`],
            ["Mass Number", massNumber],
            ["Neutron Ratio", neutronRatio.toFixed(3)],
            ["Shell Bonus", shellBonus > 0 ? "Active" : "Inactive"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-[.18em] text-slate-500">{label}</div>
              <div className="mt-2 text-xl font-black text-cyan-100">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
          This module is a product simulation layer, not a substitute for validated nuclear physics software. It is designed for ElementOS exploration, visualization and report generation.
        </div>
      </Panel>
    </>
  );
}


function CalculationCore() {
  const [mass, setMass] = useState(12); const [velocity, setVelocity] = useState(8); const [voltage, setVoltage] = useState(12); const [current, setCurrent] = useState(3);
  const kinetic = 0.5 * mass * velocity * velocity; const power = voltage * current;
  return <><Panel><Pill gold><Calculator size={12}/> calculation core</Pill><h1 className="mt-4 text-5xl font-black">Scientific Calculation Core</h1><Info title="Credibility upgrade">The public-facing calculator now uses normal scientific modules instead of internal theory labels. It supports visible equations, fields and instant outputs.</Info></Panel><div className="grid gap-6 xl:grid-cols-2"><Panel><h2 className="text-2xl font-black">Kinetic Energy</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-400">Mass<input type="number" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"/></label><label className="text-sm text-slate-400">Velocity<input type="number" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"/></label></div><div className="mt-6 text-5xl font-black text-emerald-100">{kinetic.toLocaleString()} J</div><p className="mt-2 font-mono text-sm text-slate-400">E = 0.5 × m × v²</p></Panel><Panel><h2 className="text-2xl font-black">Electrical Power</h2><div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-400">Voltage<input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"/></label><label className="text-sm text-slate-400">Current<input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 p-4 outline-none"/></label></div><div className="mt-6 text-5xl font-black text-emerald-100">{power.toLocaleString()} W</div><p className="mt-2 font-mono text-sm text-slate-400">P = V × I</p></Panel></div><Panel><h2 className="text-2xl font-black">Calculation Trend</h2><MiniBars values={[kinetic / 60, power / 12, 3.4, 4.2, 2.9, 4.7].map(v => Math.min(5, Math.max(.5, v)))}/><Button className="mt-5" onClick={() => downloadFile("elementos-calculation-summary.txt", `ElementOS Calculation Summary\n\nKinetic Energy: ${kinetic} J\nElectrical Power: ${power} W\nGenerated: ${new Date().toLocaleString()}`)}>Export Calculation Summary</Button></Panel></>;
}
function Reports({ compare, session, isPro, startCheckout }) {
  const [saved, setSaved] = useState([]);
  const [status, setStatus] = useState("");

  const cards = [
    ["Material Comparison Brief", "A polished report for selected compare materials, chart notes and ranked metrics."],
    ["Behaviour Atlas Snapshot", "A visual summary of active behaviour fields and top material signals."],
    ["Research Workspace Summary", "Saved simulations, selected elements, calculations and export history."],
  ];

  const compareRows = compare.map((sym) => ({
    symbol: sym,
    name: elementMap[sym]?.name || sym,
    metrics: score(sym),
  }));

  const build = (title, desc) =>
    `ElementOS Research Report

${title}

${desc}

Compare Set: ${compare.join(", ")}
Generated: ${new Date().toLocaleString()}

Status: Presentation-ready platform export.`;

  const loadReports = async () => {
    if (!session) {
      setSaved([]);
      return;
    }

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error(error);
      setStatus("Could not load cloud reports.");
      return;
    }

    setSaved(data || []);
  };

  useEffect(() => {
    loadReports();
  }, [session]);

  const saveReport = async (title, desc) => {
    if (!session) {
      alert("Please sign in before saving reports.");
      return;
    }

    const content = build(title, desc);
    setStatus("Saving report to cloud...");

    const { error } = await supabase.from("reports").insert({
      user_id: session.user.id,
      title,
      content,
      compare_set: compare,
    });

    if (error) {
      console.error(error);
      setStatus("Report save failed.");
      alert("Report save failed.");
      return;
    }

    setStatus("Report saved to Supabase.");
    await loadReports();
  };

  const exportPDF = (title, desc, savedContent = "") => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 16;
    const now = new Date().toLocaleString();
    const content = savedContent || build(title, desc);

    pdf.setFillColor(2, 6, 23);
    pdf.rect(0, 0, pageWidth, 36, "F");
    pdf.setTextColor(103, 232, 249);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("ElementOS", margin, 16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text("Material Intelligence Report", margin, 25);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(title, margin, 50);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Generated: ${now}`, margin, 58);
    pdf.text(`User: ${session?.user?.email || "Unsigned export"}`, margin, 64);

    pdf.setFontSize(11);
    pdf.setTextColor(30, 41, 59);
    const wrappedDesc = pdf.splitTextToSize(desc, pageWidth - margin * 2);
    pdf.text(wrappedDesc, margin, 76);

    let y = 92 + wrappedDesc.length * 5;

    pdf.setFillColor(240, 249, 255);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 18, 3, 3, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(14, 116, 144);
    pdf.text("Compare Set", margin + 4, y + 7);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(15, 23, 42);
    pdf.text(compare.join(", ") || "No compare set selected", margin + 4, y + 14);

    y += 30;
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Material Metrics", margin, y);
    y += 8;

    pdf.setFontSize(9);
    pdf.setFillColor(15, 23, 42);
    pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.text("Element", margin + 3, y + 5.5);
    pdf.text("Stability", margin + 42, y + 5.5);
    pdf.text("Conduct.", margin + 72, y + 5.5);
    pdf.text("Thermal", margin + 100, y + 5.5);
    pdf.text("Pressure", margin + 128, y + 5.5);
    pdf.text("Align", margin + 158, y + 5.5);
    y += 8;

    compareRows.forEach((row, index) => {
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(index % 2 === 0 ? 248 : 241, 250, 252);
      pdf.rect(margin, y, pageWidth - margin * 2, 8, "F");
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${row.symbol} ${row.name}`, margin + 3, y + 5.5);
      pdf.text(row.metrics.stability.toFixed(2), margin + 42, y + 5.5);
      pdf.text(row.metrics.conductivity.toFixed(2), margin + 72, y + 5.5);
      pdf.text(row.metrics.thermal.toFixed(2), margin + 100, y + 5.5);
      pdf.text(row.metrics.pressure.toFixed(2), margin + 128, y + 5.5);
      pdf.text(row.metrics.alignment.toFixed(0), margin + 158, y + 5.5);
      y += 8;
    });

    y += 12;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(15, 23, 42);
    pdf.text("Report Notes", margin, y);
    y += 7;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(51, 65, 85);
    const notes = pdf.splitTextToSize(content, pageWidth - margin * 2);
    notes.slice(0, 26).forEach((line) => {
      if (y > 278) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, margin, y);
      y += 5;
    });

    pdf.setProperties({
      title: `${title} - ElementOS`,
      subject: "ElementOS Material Intelligence Report",
      author: "ElementOS",
    });

    pdf.save(`${title.toLowerCase().replaceAll(" ", "-")}.pdf`);
  };

  return (
    <>
      <Panel>
        <Pill gold><BookOpen size={12}/> PDF publishing layer</Pill>
        <h1 className="mt-4 text-5xl font-black">Reports Centre</h1>
        <Info title="PDF upgrade">
          Reports now save to Supabase and export as branded PDFs with timestamps, compare sets and material metrics. This gives ElementOS a stronger paid-product export layer.
        </Info>
        {!session && (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            Sign in to save reports to the cloud. PDF export is a Pro Lab feature.
          </div>
        )}
        {session && !isPro && (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            PDF exports are locked behind Pro Lab. Save reports to cloud now, then upgrade when you are ready to export polished PDFs.
          </div>
        )}
        {session && isPro && (
          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100">
            <CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab active — PDF exports unlocked.
          </div>
        )}
        {status && <p className="mt-4 text-sm font-bold text-cyan-200">{status}</p>}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        {cards.map(([title, desc]) => (
          <Panel key={title}>
            <FileText className="text-cyan-300"/>
            <h2 className="mt-4 text-2xl font-black">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{desc}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => saveReport(title, desc)}>
                <Save size={15} className="inline"/> Save to Cloud
              </Button>
              <Button variant="primary" onClick={() => {
                if (!isPro) {
                  alert("PDF exports are a Pro Lab feature.");
                  startCheckout();
                  return;
                }
                exportPDF(title, desc);
              }}>
                <Download size={15} className="inline"/> Export PDF
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <h2 className="text-3xl font-black">Saved Cloud Reports</h2>
        {saved.length === 0 ? (
          <p className="mt-3 text-slate-400">No saved cloud reports yet. Save one above to test persistent report history.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {saved.map((r) => (
              <div key={r.id || `${r.title}-${r.created_at}`} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <b className="text-cyan-100">{r.title}</b>
                    <div className="text-sm text-slate-500">{new Date(r.created_at).toLocaleString()}</div>
                  </div>
                  <Button onClick={() => {
                    if (!isPro) {
                      alert("PDF exports are a Pro Lab feature.");
                      startCheckout();
                      return;
                    }
                    exportPDF(r.title, r.content || "Saved ElementOS report", r.content || "");
                  }}>
                    <Download size={15} className="inline"/> PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selected, setSelected] = useState("Al");
  const [compare, setCompare] = useState(["Al", "Fe", "Cu", "Ti"]);
  const [session, setSession] = useState(null);
  const [isPro, setIsPro] = useState(false);

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  const params = new URLSearchParams(window.location.search);

  if (params.get("checkout") === "success") {
    setIsPro(true);
    localStorage.setItem("elementos_pro", "true");
    alert("ElementOS Pro activated.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (params.get("checkout") === "cancelled") {
    alert("Checkout cancelled.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (localStorage.getItem("elementos_pro") === "true") {
    setIsPro(true);
  }

  return () => subscription.unsubscribe();
}, []);

  const saveWorkspace = async () => {
    if (!session) {
      alert("Please sign in before saving a workspace.");
      setPage("login");
      return;
    }

    const { error } = await supabase.from("workspaces").insert({
      user_id: session.user.id,
      selected_element: selected,
      compare_set: compare,
    });

    if (error) {
      console.error(error);
      alert("Workspace save failed.");
      return;
    }

    alert("Workspace saved successfully.");
  };

  const loadWorkspace = async () => {
    if (!session) {
      alert("Please sign in before restoring a workspace.");
      setPage("login");
      return;
    }

    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data?.length) {
      console.error(error);
      alert("No saved workspace found.");
      return;
    }

    const workspace = data[0];

    setSelected(workspace.selected_element || "Al");
    setCompare(workspace.compare_set || ["Al", "Fe", "Cu", "Ti"]);

    alert("Workspace restored.");
  };

const startCheckout = async () => {
  if (!session) {
    alert("Please sign in before upgrading.");
    setPage("login");
    return;
  }

  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.user.email,
    }),
  });

  const data = await response.json();

  if (data.url) {
    window.location.href = data.url;
  } else {
    alert(data.error || "Checkout failed.");
  }
};
  
  const pages = useMemo(
    () => ({
      dashboard: (
        <Dashboard
          setPage={setPage}
          saveWorkspace={saveWorkspace}
          loadWorkspace={loadWorkspace}
          session={session}
          isPro={isPro}
          startCheckout={startCheckout}
        />
      ),
      login: (
        <LoginAccount
          session={session}
          setSession={setSession}
          setPage={setPage}
          isPro={isPro}
          startCheckout={startCheckout}
        />
      ),
      explorer: (
        <Explorer
          selected={selected}
          setSelected={setSelected}
          setCompare={setCompare}
        />
      ),
      periodic: (
        <PeriodicTable
          selected={selected}
          setSelected={setSelected}
        />
      ),
      compare: (
        <Compare
          compare={compare}
          setCompare={setCompare}
          setPage={setPage}
        />
      ),
      atlas: (
        <BehaviourAtlas
          selected={selected}
          setSelected={setSelected}
        />
      ),
      graph: (
        <BehaviourGraph
          selected={selected}
          setSelected={setSelected}
        />
      ),
      universe: (
        <SimilarityUniverse
          selected={selected}
          setSelected={setSelected}
        />
      ),
      isotopes: <IsotopeLab />,
      calculations: <CalculationCore />,
      reports: <Reports compare={compare} session={session} isPro={isPro} startCheckout={startCheckout} />,
    }),
    [page, selected, compare, session, isPro]
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <Background />
      <Sidebar page={page} setPage={setPage} />

      <main className="relative z-10 space-y-6 p-4 lg:ml-[310px] lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <div>
            <div className="text-2xl font-black tracking-[.18em] text-cyan-100">
              ElementOS
            </div>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">
              material intelligence
            </div>
          </div>

          <select
            value={page}
            onChange={(e) => setPage(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none"
          >
            {Object.keys(pages).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {pages[page]}
      </main>
    </div>
  );
}
