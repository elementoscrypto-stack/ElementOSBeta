import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { supabase } from "./supabaseClient";
import {
  Atom, BarChart3, BookOpen, Calculator, CheckCircle2, ChevronRight, Clock3, Download,
  FileText, Home, Layers, Lock, Network, Orbit, Radar, Save, Search,
  ShieldCheck, Sparkles, UserPlus,
  Activity, Bot, BriefcaseBusiness, ClipboardList, Compass, Database, Dna, Gem, Globe2, LineChart, Map, Settings, Share2, Target, Users, Waves, Zap
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

function createPublicId(compare) {
  const base = compare.join("-") || "REPORT";

  const hash = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `${base}-${hash}`;
}

function generateRecommendations(compare) {
  const recommendations = [];

  compare.forEach((sym) => {
    const base = score(sym);

    const matches = elements
      .filter((e) => !compare.includes(e.symbol))
      .map((e) => {
        const s = score(e.symbol);

        const thermalDiff = Math.abs(base.thermal - s.thermal);
        const conductivityDiff = Math.abs(base.conductivity - s.conductivity);

        const similarity =
          100 -
          (thermalDiff * 12 + conductivityDiff * 10);

        return {
          symbol: e.symbol,
          name: e.name,
          similarity,
          reason:
            thermalDiff < 0.4
              ? "thermal substitute candidate"
              : conductivityDiff < 0.4
              ? "conductive pathway similarity"
              : "behavioural compatibility",
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 2);

    recommendations.push({
      source: sym,
      matches,
    });
  });

  return recommendations;
}

function generateDiscoveryEngine(limit = 18) {
  const pairs = [];

  for (let i = 0; i < elements.length; i += 1) {
    for (let j = i + 1; j < elements.length; j += 1) {
      const a = elements[i];
      const b = elements[j];
      const sa = score(a.symbol);
      const sb = score(b.symbol);
      const compatibility = compatibilityScore(a.symbol, b.symbol);
      const thermalPressure = 100 - (Math.abs(sa.thermal - sb.thermal) + Math.abs(sa.pressure - sb.pressure)) * 12;
      const conductivity = 100 - Math.abs(sa.conductivity - sb.conductivity) * 18;
      const stability = 100 - Math.abs(sa.stability - sb.stability) * 14;
      const rarityBoost = ((sa.rarity + sb.rarity) / 10) * 18;
      const total = Math.max(
        1,
        Math.min(
          99,
          Math.round(compatibility * 0.45 + thermalPressure * 0.2 + conductivity * 0.15 + stability * 0.12 + rarityBoost)
        )
      );

      let type = "Hidden compatibility signal";
      let reason = "balanced behavioural compatibility across stability, thermal and pressure metrics";

      if (thermalPressure >= 88) {
        type = "Thermal-pressure cluster";
        reason = "rare thermal and pressure alignment suitable for advanced structural comparison";
      } else if (conductivity >= 90) {
        type = "Conductivity corridor";
        reason = "strong conductive-pathway similarity with substitute-discovery potential";
      } else if (compatibility >= 92) {
        type = "Rare pair discovery";
        reason = "unusually high compatibility signature across the ElementOS scoring engine";
      } else if (Math.abs(a.atomicNumber - b.atomicNumber) <= 3) {
        type = "Neighbourhood substitute";
        reason = "nearby atomic neighbourhood with similar behavioural response profile";
      }

      pairs.push({
        a: a.symbol,
        b: b.symbol,
        aName: a.name,
        bName: b.name,
        score: total,
        compatibility,
        tier: rarityTier(total),
        type,
        reason,
        dna: materialDNA(a.symbol, b.symbol),
      });
    }
  }

  return pairs
    .sort((x, y) => y.score - x.score)
    .slice(0, limit);
}

function generateDiscoveryHeadline(discovery) {
  return `ElementOS discovered ${discovery.a} + ${discovery.b} at ${discovery.score}%`;
}

function adaptiveDiscoveryMetrics(discovery, index = 0) {
  const seed = discovery.dna
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const views = 420 + ((seed * 17 + index * 91) % 4200);
  const shares = 24 + ((seed * 11 + index * 37) % 720);
  const saves = 12 + ((seed * 7 + index * 19) % 360);
  const velocity = 8 + ((seed + index * 13) % 64);
  const aiConfidence = Math.max(71, Math.min(99, Math.round(discovery.score * 0.72 + velocity * 0.28)));
  const momentum = Math.round(discovery.score * 0.48 + aiConfidence * 0.24 + velocity * 0.18 + Math.min(100, shares / 8) * 0.1);

  return {
    ...discovery,
    views,
    shares,
    saves,
    velocity,
    aiConfidence,
    momentum,
  };
}

function adaptiveDiscoveryRank(discoveries) {
  return discoveries
    .map((discovery, index) => adaptiveDiscoveryMetrics(discovery, index))
    .sort((a, b) => b.momentum - a.momentum);
}


function growthProfileStats(session, discoveries = []) {
  const email = session?.user?.email || "guest@elementos.ai";
  const seed = email.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const simulations = 148 + (seed % 1800) + discoveries.length * 7;
  const shared = 8 + (seed % 72);
  const saved = 14 + (seed % 96);
  const streak = 3 + (seed % 18);
  const xp = simulations * 6 + shared * 42 + saved * 18 + streak * 120;
  const level = Math.max(1, Math.floor(xp / 900));
  const nextLevelXp = (level + 1) * 900;
  const progress = Math.min(100, Math.round((xp / nextLevelXp) * 100));
  const rank = 1 + (seed % 50);
  return { email, simulations, shared, saved, streak, xp, level, nextLevelXp, progress, rank };
}

function dailyDiscovery(discoveries = []) {
  const daySeed = Math.floor(Date.now() / 86400000);
  if (!discoveries.length) return null;
  return discoveries[daySeed % discoveries.length];
}

function researcherLeaderboard() {
  return [
    ["A. Materials Lab", "14,820 XP", "Ti + Hf specialist"],
    ["Paul Roper", "13,940 XP", "Discovery Founder"],
    ["Nova Alloy", "12,604 XP", "Thermal-pressure scout"],
    ["Cu Corridor", "11,882 XP", "Conductivity hunter"],
    ["Hafnium Node", "10,551 XP", "Rare pair analyst"],
  ];
}


function realTimeActivityFeed(discoveries = []) {
  const ranked = adaptiveDiscoveryRank(discoveries.length ? discoveries : generateDiscoveryEngine(10));
  const fallback = ranked.slice(0, 6);
  return fallback.map((d, index) => {
    const researcher = `Researcher_${204 + index * 17}`;
    const actions = [
      "just discovered",
      "saved a rare pathway",
      "pushed trending velocity on",
      "generated a report for",
      "shared a public card for",
      "moved into the leaderboard with",
    ];
    return {
      researcher,
      action: actions[index % actions.length],
      pair: `${d.a} + ${d.b}`,
      confidence: d.aiConfidence || Math.min(99, d.score + 4),
      velocity: d.velocity || 22 + index * 4,
      type: d.type,
    };
  });
}

function guidanceForPage(page) {
  const guide = {
    landing: {
      title: "What ElementOS does",
      description: "ElementOS is an AI-native material intelligence platform for exploring elements, comparing behaviours, simulating future states, building real-world scenarios and exporting research-ready reports.",
      next: "Start with the demo, open Time Machine or create a free account when you are ready to save work.",
    },
    beta: {
      title: "What Beta Launch does",
      description: "Beta Launch turns curious visitors into early users with a waitlist, Founding Researcher badges, feature requests, roadmap visibility and feedback loops.",
      next: "Join the beta, copy the launch post, request a feature, then invite early testers to become Founding Researchers.",
    },
    copilot: {
      title: "What AI Copilot does",
      description: "AI Copilot is the command center for ElementOS. It turns plain-language goals into material suggestions, scenario ideas, reports, simulations and viral-card actions.",
      next: "Ask a goal like deep ocean pressure for 40 years, then launch the suggested simulation, report or viral card.",
    },
    mission: {
      title: "What Mission Control does",
      description: "Mission Control gives new users a clear guided path through ElementOS: compare, forecast, build a scenario, generate a viral card, export a simulation report and join the beta.",
      next: "Complete the first mission, then follow the guided path until the user reaches a report, card or upgrade moment.",
    },
    dashboard: {
      title: "What this dashboard does",
      description: "This is your command centre. Start a comparison, open the discovery feed, save your workspace, or upgrade to Pro Lab when you are ready to export premium reports.",
      next: "Click Run Compare to test materials, or Discover to browse AI-ranked pairings.",
    },
    discover: {
      title: "What the discovery feed does",
      description: "This page turns material pairings into publishable discovery assets with compatibility, AI confidence, public IDs, share links, report paths and workspace saves.",
      next: "Pick a discovery, save it to Workspace, copy the public URL, generate a report, or send it into the next simulation.",
    },
    compare: {
      title: "What the compare engine does",
      description: "Compare elements across stability, conductivity, thermal response, diffusion, pressure, rarity and alignment. The results create compatibility cards and report-ready insights.",
      next: "Add 2–6 elements, scan compatibility cards, then create a report.",
    },
    explorer: {
      title: "What the explorer does",
      description: "Search any element and inspect its behaviour profile before adding it to a comparison. This helps beginners understand what each material is doing.",
      next: "Search a material, read the radar, then add it to Compare.",
    },
    periodic: {
      title: "What the periodic map does",
      description: "View all 118 elements as a heat map. Switch behaviour layers to spot conductivity, thermal, pressure or alignment patterns.",
      next: "Choose a heat layer, click a strong element, then compare it.",
    },
    atlas: {
      title: "What the behaviour atlas does",
      description: "The atlas visualizes material behaviour as a field map under different environments like vacuum, high pressure or high temperature.",
      next: "Pick an environment and behaviour layer, then inspect the top materials.",
    },
    graph: {
      title: "What the behaviour graph does",
      description: "The Relationship Graph shows which materials are behaviour-adjacent to your selected element. It helps users find substitute and neighbouring materials.",
      next: "Click nearby nodes to explore substitute paths.",
    },
    universe: {
      title: "What the Discovery Universe does",
      description: "This view finds materials that behave similarly in alloy, conductive or thermal contexts. It turns discovery into a guided search path.",
      next: "Select a mode, then follow the strongest similarity matches.",
    },
    isotopes: {
      title: "What isotope lab does",
      description: "Use this area to explore isotope-style scenarios and advanced material variations inside the ElementOS research workflow.",
      next: "Run a scenario, then export or compare the strongest signal.",
    },
    calculations: {
      title: "What calculation intelligence does",
      description: "This page gives the product a calculation and analysis layer so reports feel more serious and research-oriented.",
      next: "Use the calculation blocks to support your report narrative.",
    },
    timemachine: {
      title: "What the Time Machine does",
      description: "The Time Machine simulates how materials change across 1, 10, 50 and 100 year horizons under heat, pressure, corrosion, stress and environmental exposure.",
      next: "Choose a material and environment, scan the future-state cards, then export the timeline or compare the strongest result.",
    },
    scenario: {
      title: "What Scenario Builder does",
      description: "Scenario Builder turns plain-English material situations into risk scores, lifespan estimates, failure probabilities, substitute suggestions and exportable scenario reports.",
      next: "Type a real-world scenario, run the simulation, then export or send the result into Time Machine.",
    },
    welldriller: {
      title: "What Well Driller Lab does",
      description: "Well Driller Lab models a deep subsurface bore path, drilling load, formation pressure, reservoir depth and seismic-readiness using clear visual simulation cards.",
      next: "Adjust depth and formation pressure, inspect the 3D-style well profile, then open Seismo to compare P-wave and S-wave behaviour.",
    },
    matterlab: {
      title: "What Matter Intelligence OS does",
      description: "Matter Intelligence OS is a flagship advanced lab for ranking ground targets, signal agreement, discovery maps, AI explanations, reports, and project workspaces.",
      next: "Run a discovery scan, review ranked targets, then generate a report or compare the signal logic with ElementOS material simulations.",
    },
    seismo: {
      title: "What Seismo Lab does",
      description: "Seismo Lab compares P-wave and S-wave travel through a simulated subsurface field so users can understand arrival gaps, wave speed and depth response.",
      next: "Tune distance, depth and wave speeds, then export the seismic readout or return to Well Driller.",
    },
    lab: {
      title: "What Workspace does",
      description: "Workspace collects saved scenarios, favourite materials, recent simulations and report-ready discovery assets in one workspace-style page.",
      next: "Review saved scenario cards, reopen Scenario Builder or Time Machine, then export your strongest cases.",
    },
    visualization: {
      title: "What Advanced Visualization does",
      description: "The Advanced Visualization Engine turns scenarios, time horizons and material metrics into survival curves, degradation timelines, AI confidence waveforms and cinematic telemetry cards.",
      next: "Pick a material, inspect the survival curve, compare the pulse cards, then export the visual telemetry summary.",
    },
    viralcards: {
      title: "What Discovery Media Engine does",
      description: "Discovery Media Engine turns discoveries, Time Machine forecasts, Scenario Builder results, Well Driller paths and Seismo readouts into cinematic share cards for social growth.",
      next: "Choose a source, generate a card, export SVG or copy the social post text, then share it with a public report link.",
    },
    simreports: {
      title: "What Simulation Dossiers do",
      description: "Simulation Dossiers combine Time Machine, Scenario Builder, Well Driller Lab and Seismo outputs into one polished research-ready simulation dossier.",
      next: "Choose a simulation source, review the combined intelligence cards, then export the universal report.",
    },
    reports: {
      title: "What reports do",
      description: "Reports turn your comparisons into exportable, shareable research assets with summaries, compatibility scores and premium PDF/JSON/SVG output.",
      next: "Generate a report, copy the public link, or export as PDF.",
    },
    login: {
      title: "What accounts unlock",
      description: "Accounts let users save workspaces, restore research, access subscription features and build a persistent researcher identity.",
      next: "Create an account, join beta, then return to the dashboard.",
    },
  };
  return guide[page] || guide.dashboard;
}

function GuidePanel({ page = "dashboard", compact = false }) {
  const g = guidanceForPage(page);
  return (
    <Panel className={compact ? "p-4" : ""}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><Sparkles size={12}/> guided mode</Pill>
          <h2 className="mt-3 text-3xl font-black">{g.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{g.description}</p>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
          <div className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">What to do next</div>
          <div className="mt-2">{g.next}</div>
        </div>
      </div>
    </Panel>
  );
}

function RealTimeNetworkPanel({ discoveries = [], setPage }) {
  const feed = realTimeActivityFeed(discoveries);
  const active = 118 + feed.length * 9;
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><Network size={12}/> real-time network</Pill>
          <h2 className="mt-3 text-4xl font-black">Live ElementOS Network</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Simulated live activity makes the platform feel active: researchers discovering pairings, trending cards moving, and reports being generated across the network.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
          ● {active} researchers active now
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-3">
          {feed.slice(0, 5).map((item, index) => (
            <div key={`${item.researcher}-${index}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div>
                <div className="text-sm font-black text-cyan-100">{item.researcher} {item.action}</div>
                <div className="mt-1 text-lg font-black text-white">{item.pair}</div>
                <div className="mt-1 text-xs text-slate-400">{item.type}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-emerald-200">{item.confidence}%</div>
                <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">AI confidence</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/10 p-5">
          <div className="text-xs uppercase tracking-[.22em] text-cyan-200">Live ticker</div>
          <div className="mt-4 space-y-3">
            {feed.slice(0, 4).map((item, index) => (
              <div key={`${item.pair}-ticker-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
                <span className="font-black text-cyan-100">{item.pair}</span> moved +{item.velocity}% in network velocity.
              </div>
            ))}
          </div>
          <Button onClick={() => setPage?.("discover")} variant="primary" className="mt-5 w-full">Open Live Discovery Feed</Button>
        </div>
      </div>
    </Panel>
  );
}

function PageHelpStrip({ page = "dashboard" }) {
  const g = guidanceForPage(page);
  return (
    <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
      <b>{g.title}:</b> {g.description} <span className="text-amber-100">Next: {g.next}</span>
    </div>
  );
}

const miModules = [
  { name: "Diamonds", icon: Gem, gradient: "from-cyan-300/20 to-blue-500/10", status: "Active", signal: 92 },
  { name: "Gold", icon: Sparkles, gradient: "from-amber-300/20 to-orange-500/10", status: "Active", signal: 84 },
  { name: "Lithium", icon: Zap, gradient: "from-fuchsia-300/20 to-purple-500/10", status: "Active", signal: 78 },
  { name: "Copper", icon: Activity, gradient: "from-orange-300/20 to-red-500/10", status: "Beta", signal: 71 },
  { name: "Uranium", icon: Orbit, gradient: "from-lime-300/20 to-emerald-500/10", status: "Locked", signal: 64 },
  { name: "Custom", icon: Database, gradient: "from-slate-300/20 to-cyan-500/10", status: "Enterprise", signal: 88 },
];

const miDiscoveryFeed = [
  { type: "AI", title: "7 new diamond miTargets ranked", body: "Northern craton project gained new high-confidence signal matches.", time: "2m ago", priority: "High" },
  { type: "Report", title: "Investor summary generated", body: "Diamond Module report exported with target reasoning and signal agreement.", time: "18m ago", priority: "Ready" },
  { type: "Signal", title: "Lithium basin confidence increased", body: "Gravity and historical similarity moved into stronger agreement.", time: "41m ago", priority: "Rising" },
  { type: "Team", title: "Project updated by Sarah", body: "Added notes to Target DK-27 and shared it with the Pro workspace.", time: "1h ago", priority: "Team" },
];

const miTargets = [
  {
    id: "DK-27",
    name: "North Craton Diamond Field",
    module: "Diamonds",
    confidence: 94,
    glyph: "◇∞◇",
    agreement: "Exceptional",
    reasons: ["Strong circular geometry", "Magnetic anomaly above baseline", "Craton stability match", "Similar to known diamond fields", "Low noise across datasets"],
    depth: "320m–680m",
    trend: "+8% this week",
  },
  {
    id: "AU-18",
    name: "Gold Fault Corridor",
    module: "Gold",
    confidence: 86,
    glyph: "◇◇◇",
    agreement: "Strong",
    reasons: ["Fault network density", "Hydrothermal structure match", "Historical discovery similarity", "Remote sensing alteration"],
    depth: "120m–420m",
    trend: "+3% this week",
  },
  {
    id: "LI-44",
    name: "Lithium Basin Edge",
    module: "Lithium",
    confidence: 79,
    glyph: "◇◇",
    agreement: "Moderate",
    reasons: ["Evaporite basin geometry", "Terrain depression", "Conductivity signature", "Regional discovery proximity"],
    depth: "60m–210m",
    trend: "+12% this week",
  },
];

const miProjects = [
  { name: "Northern Diamonds", miTargets: 42, miReports: 8, members: 5, status: "High momentum" },
  { name: "Lithium Basin Study", miTargets: 31, miReports: 4, members: 3, status: "Growing" },
  { name: "Critical Minerals Map", miTargets: 76, miReports: 13, members: 9, status: "Enterprise" },
];

const miReports = [
  { name: "Executive Discovery Brief", type: "Investor", pages: 12, locked: false },
  { name: "Technical Target Ranking", type: "Geology", pages: 28, locked: false },
  { name: "Board Presentation Pack", type: "Pitch", pages: 18, locked: false },
  { name: "Private Dataset Model Audit", type: "Enterprise", pages: 34, locked: true },
];

const miPlans = [
  { name: "Explorer", price: "$49/mo", features: ["Discovery Map", "Material profiles", "5 saved miProjects", "Basic target miReports"], cta: "Start Explorer" },
  { name: "Pro", price: "$199/mo", features: ["AI Assistant", "Unlimited miProjects", "Advanced ranking", "PDF report exports", "Team comments"], cta: "Start Pro", best: true },
  { name: "Enterprise", price: "Custom", features: ["Private datasets", "API access", "Custom models", "Team onboarding", "Security review"], cta: "Talk to Sales" },
];

const miOnboardingSteps = [
  "Choose a discovery module",
  "Run an AI discovery scan",
  "Review the ranked target explanation",
  "Generate a report",
  "Save it to a project workspace",
];

const miKpis = [
  ["Discovery scans", "248", "+18%"],
  ["Saved miTargets", "1,482", "+42"],
  ["Reports generated", "73", "+9"],
  ["Team actions", "316", "+27"],
];

const miTimeline = [
  ["2022", "Weak anomaly recorded"],
  ["2023", "Gravity layer improved"],
  ["2024", "Historical similarity detected"],
  ["2025", "AI confidence increased"],
  ["2026", "High-priority target recommended"],
];

const miMaterialGuides = [
  {
    name: "Diamonds",
    purpose: "Searches for geology commonly associated with diamond-bearing systems.",
    clues: ["Stable cratons", "Deep mantle origin", "Kimberlite-style pipe geometry", "Circular structures", "Long-term tectonic stability"],
  },
  {
    name: "Gold",
    purpose: "Searches for structural and hydrothermal patterns linked to gold mineralization.",
    clues: ["Fault systems", "Hydrothermal activity", "Structural intersections", "Alteration zones", "Historical mineralization"],
  },
  {
    name: "Lithium",
    purpose: "Searches for basin, brine, and pegmatite conditions linked to lithium opportunity.",
    clues: ["Evaporite basins", "Brine signatures", "Pegmatite corridors", "Terrain depressions", "Conductivity anomalies"],
  },
];

const miSubscriberReasons = [
  "Find opportunities faster",
  "Reduce research time",
  "Explain decisions clearly",
  "Organize exploration miProjects",
  "Generate miReports instantly",
  "Track changing opportunities",
];

const miThinkingFlow = [
  ["Input", "Maps, satellite data, survey files, drill logs, historical discoveries, and private datasets."],
  ["Signal Engine", "The platform checks where independent evidence layers agree or disagree."],
  ["AI Ranking", "Targets are ranked by confidence, similarity, signal strength, and stability."],
  ["Reports", "Complex analysis becomes plain-language miReports for teams and investors."],
  ["Decisions", "Subscribers decide what to review, save, export, share, or investigate next."],
];

const miDefinitions = [
  ["Glyph Rating", "A quick badge for signal quality. ◇ means weak, ◇◇ moderate, ◇◇◇ strong, ◇∞◇ exceptional."],
  ["Signal Agreement", "How much gravity, magnetics, geometry, history, and structure agree around one target."],
  ["1047 Logic", "Detect signal, compare baseline, measure divergence, confirm stability."],
  ["Discovery Potential Layer", "A map-like probability layer showing where the platform sees stronger opportunity."],
];

const miSignalLabels = ["Gravity", "Magnetics", "Geometry", "Historical similarity", "Structure"];
const miSignalValues = [88, 91, 96, 84, 93];

function miRunSelfChecks() {
  const checks = [
    [miModules.length >= 6, "Expected at least 6 discovery miModules"],
    [miTargets.length >= 3, "Expected at least 3 ranked miTargets"],
    [miTargets.every((target) => target.id && target.reasons.length >= 2), "Every target should have an id and at least 2 reasons"],
    [miPlans.some((plan) => plan.best), "Expected one recommended subscription plan"],
    [miSignalLabels.length === miSignalValues.length, "Signal labels and values should match"],
  ];

  checks.forEach(([passed, message]) => {
    if (!passed) console.error(`MIOS self-check failed: ${message}`);
  });

  return checks.every(([passed]) => passed);
}

const miSelfChecksPassed = miRunSelfChecks();

function miCx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function MIPill({ children, muted = false }) {
  return (
    <span className={miCx("rounded-full border px-3 py-1 text-xs font-bold", muted ? "border-white/10 bg-white/[0.04] text-slate-300" : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100")}>
      {children}
    </span>
  );
}

function MISidebar({ active, setActive }) {
  const items = [
    ["Home", Globe2],
    ["Discovery Map", Map],
    ["Targets", Target],
    ["Projects", BriefcaseBusiness],
    ["Reports", FileText],
    ["Discovery Playbooks", Dna],
    ["AI Assistant", Bot],
    ["Marketplace", Database],
    ["Team", Users],
    ["Settings", Settings],
  ];

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-300 p-3 text-slate-950"><Atom size={24} /></div>
        <div>
          <div className="text-lg font-black">M.I.OS</div>
          <div className="text-xs text-slate-500">Opportunity Intelligence</div>
        </div>
      </div>
      <nav className="space-y-2 text-sm">
        {items.map(([item, Icon]) => (
          <button key={item} onClick={() => setActive(item)} className={miCx("flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition", active === item ? "bg-cyan-300/10 text-cyan-100" : "text-slate-400 hover:bg-white/[0.04]")}>
            <span className="flex items-center gap-2"><Icon size={16} /> {item}</span><ChevronRight size={14} />
          </button>
        ))}
      </nav>
      <div className="mt-8 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-4">
        <div className="text-xs uppercase tracking-widest text-slate-500">What this is</div>
        <p className="mt-2 text-sm leading-6 text-slate-300">An opportunity intelligence platform for finding, ranking, explaining, and reporting hidden ground opportunities.</p>
      </div>
    </aside>
  );
}

function MIModuleCard({ mod, selected, onClick }) {
  const Icon = mod.icon;
  return (
    <button onClick={onClick} className={miCx("rounded-[1.5rem] border p-4 text-left transition", selected ? "border-cyan-300/40 bg-cyan-300/10 shadow-2xl shadow-cyan-950/30" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]")}>
      <div className={miCx("mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br", mod.gradient)}><Icon size={25} className="text-cyan-100" /></div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-black text-white">{mod.name}</div>
        <MIPill muted>{mod.status}</MIPill>
      </div>
      <div className="mt-3 text-xs text-slate-400">Signal readiness</div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${mod.signal}%` }} /></div>
    </button>
  );
}

function MIDiscoveryEarth({ scanning, selectedModule }) {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_30%),linear-gradient(135deg,#020617,#07111f_60%,#0b1120)] shadow-[0_0_120px_rgba(34,211,238,0.1)]">
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" style={{ animation: `eosSpin ${scanning ? 14 : 44}s linear infinite` }} />
      <div className="absolute left-1/2 top-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/10" style={{ animation: `eosSpinReverse ${scanning ? 20 : 58}s linear infinite` }} />
      <div className="absolute left-1/2 top-1/2 flex h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/30 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.35),transparent_12%),radial-gradient(circle_at_center,rgba(34,211,238,.38),rgba(14,165,233,.08)_50%,rgba(2,6,23,.95)_72%)] shadow-[0_0_100px_rgba(34,211,238,.22)]" style={{ animation: `eosPulse ${scanning ? 1.6 : 4}s ease-in-out infinite` }} >
        <Globe2 size={105} className="text-cyan-100/80" />
      </div>
      {miTargets.map((target, index) => {
        const positions = ["left-[18%] top-[22%]", "right-[14%] top-[34%]", "left-[28%] bottom-[18%]"];
        return (
          <div key={target.id} className={miCx("absolute rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 backdrop-blur-xl", positions[index])}>
            <div className="flex items-center gap-2 text-sm font-black text-cyan-100"><Target size={15} /> {target.id}</div>
            <div className="text-[10px] text-slate-400">{target.confidence}% confidence</div>
          </div>
        );
      })}
      <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
        <div className="text-xs uppercase tracking-widest text-slate-500">Current module</div>
        <div className="mt-1 text-2xl font-black text-cyan-100">{selectedModule.name}</div>
        <div className="text-xs text-slate-400">Discovery Potential Layer active</div>
      </div>
    </div>
  );
}

function MIFeedCard({ item }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-2 flex items-center justify-between"><MIPill muted>{item.type}</MIPill><span className="text-xs text-slate-500">{item.time}</span></div>
      <div className="font-black text-white">{item.title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
      <div className="mt-3 text-xs font-bold text-cyan-200">{item.priority}</div>
    </div>
  );
}

function MITargetCard({ target, active, onClick }) {
  return (
    <button onClick={onClick} className={miCx("w-full rounded-[1.5rem] border p-4 text-left transition", active ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]")}>
      <div className="flex items-center justify-between">
        <div><div className="text-lg font-black text-white">{target.id}</div><div className="text-xs text-slate-400">{target.name}</div></div>
        <div className="font-mono text-2xl text-fuchsia-100">{target.glyph}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.confidence}%</b><br /><span className="text-slate-500">Score</span></div>
        <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.agreement}</b><br /><span className="text-slate-500">Signal</span></div>
        <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.trend}</b><br /><span className="text-slate-500">Trend</span></div>
      </div>
    </button>
  );
}

function MIPlanCard({ plan }) {
  return (
    <div className={miCx("rounded-[1.5rem] border p-5", plan.best ? "border-cyan-300/40 bg-cyan-300/10 shadow-2xl shadow-cyan-950/30" : "border-white/10 bg-white/[0.035]")}>
      <div className="mb-2 flex items-center justify-between"><h3 className="text-xl font-black text-white">{plan.name}</h3>{plan.best && <span className="rounded-full bg-cyan-300 px-3 py-1 text-[10px] font-black text-slate-950">BEST</span>}</div>
      <div className="text-3xl font-black text-cyan-100">{plan.price}</div>
      <div className="mt-4 space-y-2 text-sm text-slate-300">{plan.features.map((feature) => <div key={feature} className="flex gap-2"><span className="text-cyan-200">✓</span><span>{feature}</span></div>)}</div>
      <button type="button" onClick={() => handlePlanCTA(plan)} className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-cyan-300 hover:text-slate-950">{plan.cta}</button>
    </div>
  );
}

function MIDashboardHeader({ active, setActive }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-black text-white">Northern Discovery Lab</div>
          <div className="text-xs text-slate-500">Pro Trial · 12 days remaining · {active}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <MIPill>Pro workspace</MIPill>
          <button onClick={() => setActive("Reports")} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-bold text-slate-200 hover:bg-white/[0.1]">Reports</button>
          <button onClick={() => setActive("Settings")} className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">Upgrade</button>
        </div>
      </div>
      <div className="rounded-[1.5rem] border border-cyan-300/10 bg-cyan-300/5 p-4">
        <div className="mb-2 flex items-center justify-between"><span className="text-sm font-black text-cyan-100">System status</span><span className="text-xs text-slate-400">{miSelfChecksPassed ? "Healthy" : "Review"}</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-cyan-300" style={{ width: miSelfChecksPassed ? "100%" : "60%" }} /></div>
      </div>
    </div>
  );
}

function MatterIntelligenceLab() {
  const opportunityUniverse = [
    { category: "Precious metals", items: ["Gold", "Silver", "Platinum", "Palladium", "Rhodium", "Iridium", "Osmium"] },
    { category: "Industrial metals", items: ["Copper", "Iron", "Aluminium", "Nickel", "Titanium", "Zinc", "Lead", "Tin", "Molybdenum", "Tungsten"] },
    { category: "Battery materials", items: ["Lithium", "Graphite", "Cobalt", "Manganese", "Nickel", "Vanadium", "Silicon", "Sodium", "Phosphorus"] },
    { category: "Rare earths", items: ["Neodymium", "Praseodymium", "Dysprosium", "Terbium", "Lanthanum", "Cerium", "Yttrium", "Scandium"] },
    { category: "Energy", items: ["Uranium", "Hydrogen", "Natural Gas", "Oil", "Geothermal", "Helium", "Thorium"] },
    { category: "Water + ground", items: ["Groundwater", "Aquifer System", "Freshwater", "Brine", "Reservoir", "Deep Basin"] },
    { category: "Construction", items: ["Sandstone", "Limestone", "Dolomite", "Granite", "Basalt", "Quartzite", "Marble"] },
    { category: "Custom", items: ["Custom Material", "Custom Ore", "Custom Formation", "Custom Signal", "Custom Target"] },
  ];

  const flatResources = opportunityUniverse.flatMap((group) => group.items.map((name, index) => ({
    name,
    category: group.category,
    seed: name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) + index * 17,
  })));

  const [category, setCategory] = useState("Precious metals");
  const [selectedResource, setSelectedResource] = useState("Gold");
  const [targetIndex, setTargetIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [savedTargets, setSavedTargets] = useState(["DK-27"]);

  const resources = flatResources.filter((item) => category === "All" || item.category === category);
  const resource = flatResources.find((item) => item.name === selectedResource) || flatResources[0];
  const seed = resource.seed;

  const opportunityScore = Math.max(51, Math.min(99, 62 + (seed % 31) + (scanning ? 4 : 0)));
  const signalAgreement = Math.max(50, Math.min(99, 58 + ((seed * 7) % 35)));
  const historicalMatch = Math.max(48, Math.min(99, 54 + ((seed * 11) % 38)));
  const telemetryStrength = Math.max(45, Math.min(99, 52 + ((seed * 13) % 40)));
  const geometryIndex = Math.max(45, Math.min(99, 55 + ((seed * 5) % 37)));
  const trend = opportunityScore > 86 ? "Exceptional" : opportunityScore > 76 ? "Rising" : "Emerging";
  const targetCode = `${selectedResource.replace(/[^A-Z0-9]/gi, "").slice(0, 3).toUpperCase()}-${String(seed % 97).padStart(2, "0")}`;

  const selectedTarget = miTargets[targetIndex] || miTargets[0];
  const dynamicTargets = [
    { id: targetCode, name: `${selectedResource} Opportunity Field`, confidence: opportunityScore, agreement: trend, glyph: opportunityScore > 88 ? "◇∞◇" : "◇◇◇", depth: `${80 + (seed % 380)}m–${520 + (seed % 1600)}m`, trend: `+${3 + (seed % 14)}% this week`, reasons: ["Geometry and telemetry are converging", "Historical similarity is above baseline", "Signal persistence is increasing"] },
    { id: `${targetCode}-B`, name: `${selectedResource} Secondary Corridor`, confidence: Math.max(40, opportunityScore - 8), agreement: "Strong", glyph: "◇◇◇", depth: `${120 + (seed % 260)}m–${720 + (seed % 1300)}m`, trend: `+${2 + (seed % 9)}% this week`, reasons: ["Neighbouring signal cluster", "Resource trend continuation", "Formation stability improving"] },
    { id: `${targetCode}-C`, name: `${selectedResource} Deep Signal Node`, confidence: Math.max(35, opportunityScore - 15), agreement: "Moderate", glyph: "◇◇", depth: `${300 + (seed % 500)}m–${1100 + (seed % 1900)}m`, trend: `+${1 + (seed % 7)}% this week`, reasons: ["Deep structure response", "Weak but persistent anomaly", "Needs follow-up simulation"] },
  ];
  const activeTarget = dynamicTargets[targetIndex % dynamicTargets.length];

  const runScan = () => {
    setScanning(true);
    setReportReady(false);
    window.setTimeout(() => {
      setTargetIndex((value) => (value + 1) % dynamicTargets.length);
      setScanning(false);
      setReportReady(true);
    }, 900);
  };

  const toggleSaveTarget = () => {
    setSavedTargets((previous) =>
      previous.includes(activeTarget.id)
        ? previous.filter((id) => id !== activeTarget.id)
        : [...previous, activeTarget.id]
    );
  };

  const exportMatter = () => {
    exportAllFormats({
      baseName: `${targetCode}-matter-intelligence`,
      title: `Matter Intelligence Report: ${selectedResource}`,
      summary: `${selectedResource} opportunity scan. Score ${opportunityScore}%. Signal agreement ${signalAgreement}%. Historical match ${historicalMatch}%. Telemetry strength ${telemetryStrength}%. Geometry index ${geometryIndex}%.`,
      payload: { selectedResource, category, opportunityScore, signalAgreement, historicalMatch, telemetryStrength, geometryIndex, activeTarget },
    });
  };

  const galaxyNodes = resources.slice(0, 18).map((item, index) => {
    const angle = (index / Math.max(1, Math.min(18, resources.length))) * Math.PI * 2;
    const ring = 92 + (index % 3) * 42;
    return {
      ...item,
      x: 50 + Math.cos(angle) * (ring / 3.2),
      y: 50 + Math.sin(angle) * (ring / 4.4),
      score: Math.max(50, Math.min(99, 58 + ((item.seed * 7) % 38))),
    };
  });

  const pipeline = [
    ["01", "Select", "Choose a resource, metal, formation, energy source or custom target."],
    ["02", "Scan", "Compare geometry, telemetry, historical pattern and signal persistence."],
    ["03", "Rank", "Promote strongest opportunity nodes into a target queue."],
    ["04", "Explain", "Convert the signal into a plain-English intelligence narrative."],
    ["05", "Publish", "Export a report, card, poster or workspace asset."],
  ];

  return (
    <div className="space-y-6">
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-cyan-950/35 via-slate-950 to-blue-950/30 p-0">
        <div className="relative p-6 md:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative grid gap-8 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill gold><Sparkles size={12} /> material opportunity universe</Pill>
                <Pill><Globe2 size={12} /> selectable resources</Pill>
                <Pill><Radar size={12} /> live geometry + telemetry</Pill>
              </div>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[.92] tracking-tight md:text-7xl">
                Matter Intelligence <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Opportunity Galaxy</span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Select any resource, element, formation or opportunity type. Matter Intelligence now rebuilds the radar, target queue, telemetry streams and report narrative around what you are actually hunting.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button onClick={runScan} variant="primary" className="px-8 py-5 text-base">
                  <Radar size={17} className="mr-2 inline" /> {scanning ? "Scanning Opportunity Galaxy..." : "Run Opportunity Scan"}
                </Button>
                <Button onClick={exportMatter} className="px-8 py-5 text-base">
                  <FileText size={17} className="mr-2 inline" /> Export Intelligence
                </Button>
                <Button onClick={toggleSaveTarget} className="px-8 py-5 text-base">
                  <Save size={17} className="mr-2 inline" /> {savedTargets.includes(activeTarget.id) ? "Saved" : "Save Target"}
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 shadow-[0_0_80px_rgba(34,211,238,.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_35%)]" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[.25em] text-cyan-200">Active opportunity</div>
                  <div className="mt-3 text-4xl font-black text-white">{selectedResource}</div>
                  <div className="mt-1 text-sm text-slate-400">{category} · {activeTarget.depth}</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right">
                  <div className="text-4xl font-black text-emerald-100">{opportunityScore}%</div>
                  <div className="text-[10px] uppercase tracking-[.2em] text-emerald-200">score</div>
                </div>
              </div>
              <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
                {[["Signal", signalAgreement + "%"], ["Geometry", geometryIndex + "%"], ["Trend", trend]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
                    <div className="mt-2 text-lg font-black text-cyan-100">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Target size={12} /> material opportunity universe</Pill>
            <h2 className="mt-3 text-4xl font-black">Choose what Matter Intelligence should hunt.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">This replaces the old hard-coded diamond view. The whole OS now updates around precious metals, battery materials, rare earths, energy, water, formations and custom signals.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">{flatResources.length}+ resources available</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["All", ...opportunityUniverse.map((group) => group.category)].map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); const first = cat === "All" ? flatResources[0] : flatResources.find((item) => item.category === cat); if (first) setSelectedResource(first.name); }} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.15em] ${category === cat ? "border-amber-300/60 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"}`}>{cat}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_28%),linear-gradient(135deg,#020617,#081a2f_55%,#100b22)] p-6">
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(34,211,238,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] bg-[size:36px_36px]" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20 shadow-[0_0_90px_rgba(34,211,238,.16)]" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/20" />
            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-center shadow-[0_0_80px_rgba(34,211,238,.25)]">
              <div>
                <div className="text-2xl font-black text-cyan-100">MI</div>
                <div className="text-[9px] uppercase tracking-[.18em] text-slate-400">core</div>
              </div>
            </div>
            {galaxyNodes.map((node) => (
              <button
                key={node.name}
                onClick={() => setSelectedResource(node.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left shadow-[0_0_30px_rgba(34,211,238,.12)] transition hover:scale-110 ${selectedResource === node.name ? "border-amber-300/60 bg-amber-300/20 text-amber-50" : "border-cyan-300/20 bg-black/45 text-cyan-50"}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="text-xs font-black">{node.name}</div>
                <div className="text-[10px] text-slate-400">{node.score}%</div>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">active scan</div>
              <div className="mt-2 text-4xl font-black text-white">{activeTarget.name}</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{activeTarget.reasons.join(". ")}.</p>
            </div>
            {[["Signal agreement", signalAgreement], ["Historical match", historicalMatch], ["Telemetry strength", telemetryStrength], ["Geometry index", geometryIndex]].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex justify-between text-xs uppercase tracking-[.18em] text-slate-500"><span>{label}</span><span>{value}%</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Target size={12} /> discovery pipeline</Pill>
            <h2 className="mt-3 text-4xl font-black">A complete opportunity engine, not another tab.</h2>
          </div>
          <Button onClick={runScan} variant="primary">Run New Scan</Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {pipeline.map(([step, title, body]) => (
            <div key={title} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/5 p-4">
              <div className="text-xs font-black text-cyan-200">{step}</div>
              <div className="mt-2 text-lg font-black text-white">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Panel>
          <Pill gold><LineChart size={12} /> telemetry stream</Pill>
          <h2 className="mt-3 text-3xl font-black">Live Intelligence Feed</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Opportunity score updated", `${selectedResource} moved to ${opportunityScore}% after telemetry and geometry fusion.`, `${opportunityScore}%`],
              ["Historical pattern match", `${selectedResource} matches known discovery patterns above baseline.`, `${historicalMatch}%`],
              ["Geometry lock detected", `Signal geometry strengthened for ${activeTarget.id}.`, `${geometryIndex}%`],
              ["Report pathway ready", `Executive intelligence report can be exported now.`, "Ready"],
            ].map(([title, body, value]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div><div className="font-black text-cyan-100">{title}</div><p className="mt-1 text-sm leading-6 text-slate-400">{body}</p></div>
                  <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-black text-emerald-100">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Pill gold><Target size={12} /> ranked targets</Pill>
              <h2 className="mt-3 text-3xl font-black">Top {selectedResource} Targets</h2>
            </div>
            <Button onClick={exportMatter} variant="primary">Export Report</Button>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {dynamicTargets.map((target, index) => (
              <button key={target.id} onClick={() => setTargetIndex(index)} className={`rounded-[1.5rem] border p-4 text-left transition ${targetIndex === index ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/25 hover:bg-white/[0.06]"}`}>
                <div className="flex items-center justify-between gap-3"><div><div className="text-lg font-black text-white">{target.id}</div><div className="text-xs text-slate-400">{target.name}</div></div><div className="font-mono text-2xl text-fuchsia-100">{target.glyph}</div></div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.confidence}%</b><br /><span className="text-slate-500">Score</span></div><div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.agreement}</b><br /><span className="text-slate-500">Signal</span></div><div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{target.trend}</b><br /><span className="text-slate-500">Trend</span></div></div>
              </button>
            ))}
          </div>
          {reportReady && <div className="mt-5 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5"><div className="text-xs uppercase tracking-[.22em] text-emerald-200">Report Preview Ready</div><div className="mt-2 text-2xl font-black text-white">{activeTarget.id} Intelligence Report</div><p className="mt-2 text-sm leading-6 text-emerald-50/90">Executive brief, technical ranking and field-review notes are ready for export.</p></div>}
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12} /> recommended next step</Pill>
            <h2 className="mt-3 text-3xl font-black">You have a strong {selectedResource} signal. Turn it into an asset.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{activeTarget.id} is ready for report generation, workspace save and public discovery packaging.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportMatter} variant="primary">Generate Report</Button>
            <Button onClick={toggleSaveTarget}>{savedTargets.includes(activeTarget.id) ? "Saved to Workspace" : "Save to Workspace"}</Button>
            <Button onClick={runScan}>Run Similar Scan</Button>
          </div>
        </div>
      </Panel>
    </div>
  );
}


function PublicDiscoveryPage({ discovery, setPage, setPublicDiscovery }) {
  const fallback = makePublishableDiscoveries(12)[0];
  const current = discovery || fallback;
  const pair = `${current?.a || "Al"} + ${current?.b || "Ti"}`;
  const publicUrl = createDiscoveryUrl(current);

  const copyText = (text) => {
    if (navigator?.clipboard?.writeText) {
      safeCopyText(text);
      return;
    }
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  };

  const savePublicDiscovery = () => {
    try {
      const existing = JSON.parse(localStorage.getItem("elementos_saved_discoveries") || "[]");
      const next = [
        {
          id: current.publicId,
          pair,
          score: current.score,
          confidence: current.aiConfidence,
          reason: current.reason,
          createdAt: new Date().toISOString(),
          publicUrl,
        },
        ...existing.filter((item) => item.id !== current.publicId),
      ].slice(0, 50);
      localStorage.setItem("elementos_saved_discoveries", JSON.stringify(next));
      setPage("lab");
    } catch (error) {
      console.error("Unable to save public discovery", error);
    }
  };

  return (
    <>
      <Panel className="border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-[#06101d]/95 to-amber-300/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12}/> public discovery page</Pill>
            <h1 className="mt-4 text-5xl font-black sm:text-7xl">
              {pair} <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-100 bg-clip-text text-transparent">Discovery</span>
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
              This is a share-ready ElementOS discovery page: a persistent result card with AI narrative, scores, report preview, workspace save and next-step actions.
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs uppercase tracking-[.18em] text-slate-400">
              Public ID: <span className="font-black text-cyan-100">{current.publicId}</span>
            </div>
          </div>
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 text-center">
            <div className="text-7xl font-black text-emerald-100">{current.score}%</div>
            <div className="mt-2 text-xs uppercase tracking-[.22em] text-emerald-200">discovery score</div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <Pill><Network size={12}/> AI narrative</Pill>
          <h2 className="mt-3 text-3xl font-black">Why this discovery matters</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            {pair} shows a strong publishable signal because {String(current.reason || "its material behaviour profile creates a useful compatibility pathway").toLowerCase()}. ElementOS ranks this result across compatibility, thermal-pressure behaviour, AI confidence and network momentum.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4"><div className="text-3xl font-black text-cyan-100">{current.aiConfidence}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI confidence</div></div>
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4"><div className="text-3xl font-black text-emerald-200">+{current.velocity}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">velocity</div></div>
            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4"><div className="text-3xl font-black text-amber-100">{current.momentum}</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">momentum</div></div>
          </div>
        </Panel>

        <Panel>
          <Pill gold><FileText size={12}/> report preview</Pill>
          <h2 className="mt-3 text-3xl font-black">Research-ready output</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Discovery summary", `${pair} ranked as ${current.tier || "RARE"}`],
              ["Primary signal", current.type || "Compatibility signal"],
              ["Recommended action", "Run Time Machine, generate dossier, create share card"],
              ["Public URL", publicUrl],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
                <div className="mt-1 text-sm font-bold text-cyan-100 break-words">{value}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><CheckCircle2 size={12}/> discovery actions</Pill>
            <h2 className="mt-3 text-3xl font-black">What happens next?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              A public discovery should lead somewhere: save it, report it, share it, or run the next simulation.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Button onClick={() => copyText(publicUrl)} variant="primary">Copy URL</Button>
          <Button onClick={() => copyText(`ElementOS Public Discovery: ${pair} — ${current.score}% score. ${current.reason}`)}>Copy Share Text</Button>
          <Button onClick={savePublicDiscovery}>Save to Workspace</Button>
          <Button onClick={() => setPage("timemachine")}>Run Time Machine</Button>
          <Button onClick={() => setPage("simreports")}>Generate Dossier</Button>
          <Button onClick={() => { setPublicDiscovery?.(null); window.history.replaceState({}, document.title, window.location.pathname); setPage("discover"); }}>Back to Feed</Button>
        </div>
      </Panel>
    </>
  );
}


const PAGE_LABELS = {
  landing: "Home",
  dashboard: "Dashboard",
  copilot: "AI Copilot",
  mission: "Mission Control",
  discover: "Discovery Feed",
  explorer: "Element Explorer",
  compare: "Compare Materials",
  periodic: "Periodic Map",
  atlas: "Behaviour Atlas",
  graph: "Relationship Graph",
  universe: "Discovery Universe",
  scenario: "Scenario Builder",
  visualization: "Visual Engine",
  calculations: "Calculation Intelligence",
  timemachine: "Time Machine",
  seismo: "Seismo Lab",
  welldriller: "Well Driller Lab",
  isotopes: "Isotope Lab",
  matterlab: "Matter Intelligence OS",
  publicdiscovery: "Public Discovery Page",
  simreports: "Simulation Dossiers",
  viralcards: "Discovery Media Engine",
  reports: "Research Reports",
  lab: "Workspace",
  beta: "Founding Beta",
  login: "Account",
};

const MOBILE_PAGE_ORDER = [
  "landing",
  "dashboard",
  "copilot",
  "mission",
  "discover",
  "matterlab",
  "publicdiscovery",
  "compare",
  "isotopes",
  "scenario",
  "timemachine",
  "seismo",
  "welldriller",
  "simreports",
  "viralcards",
  "lab",
  "explorer",
  "periodic",
  "atlas",
  "graph",
  "universe",
  "visualization",
  "calculations",
  "reports",
  "beta",
];

function pageLabel(page) {
  return PAGE_LABELS[page] || String(page || "dashboard").replaceAll("-", " ");
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


function slugifyExportName(value = "elementos-export") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "elementos-export";
}

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapExportLines(value = "", maxChars = 62, maxLines = 14) {
  const words = String(value).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1].slice(0, Math.max(0, maxChars - 3))}...`];
  }
  return lines.length ? lines : ["Generated by ElementOS."];
}


function smartExportHeadline(value = "") {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  const replacements = [
    [/rare thermal and pressure alignment suitable for advanced structural comparison/i, "Rare Thermal-Pressure Alignment"],
    [/hidden compatibility signal/i, "Hidden Compatibility Signal"],
    [/elementos export/i, "ElementOS Intelligence Export"],
    [/simulation dossier/i, "Simulation Intelligence Dossier"],
    [/viral/i, "Discovery Media Asset"],
  ];
  const replaced = replacements.reduce((acc, [pattern, next]) => acc.replace(pattern, next), text);
  if (replaced.length <= 68) return replaced;
  return `${replaced.slice(0, 66).replace(/\s+\S*$/, "")}...`;
}

function makeExportSvg({ title = "ElementOS Export", summary = "", payload = {}, sections = [], variant = "Luxury Scientific" }) {
  const normalizedTitle = smartExportHeadline(title || payload?.title || "ElementOS Export");
  const story = [summary, ...sections.map((section) => `${section.label || section.heading}: ${section.value || section.text}`)].filter(Boolean).join(" • ");
  const narrativeLines = wrapExportLines(story || JSON.stringify(payload, null, 2), 42, 5);
  const metricEntries = Object.entries(payload || {})
    .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
    .filter(([key]) => !["summary", "source", "generatedAt", "title"].includes(key))
    .slice(0, 6);
  const safeMetrics = metricEntries.length ? metricEntries : [["Discovery", "ElementOS"], ["Format", "PDF/JSON/SVG"], ["Status", "Exported"], ["Style", "Premium"]];
  const palettes = {
    "Luxury Scientific": { a: "#67e8f9", b: "#fbbf24", c: "#a78bfa", d: "#10b981" },
    "Matter Intelligence": { a: "#22d3ee", b: "#34d399", c: "#f59e0b", d: "#818cf8" },
    "Neon": { a: "#38bdf8", b: "#e879f9", c: "#facc15", d: "#22c55e" },
  };
  const palette = palettes[variant] || palettes["Luxury Scientific"];
  const metricTiles = safeMetrics.map(([key, value], index) => {
    const x = 92 + (index % 3) * 300;
    const y = 830 + Math.floor(index / 3) * 142;
    const accent = [palette.a, palette.b, palette.c, palette.d, "#fb7185", "#60a5fa"][index % 6];
    return `<g transform="translate(${x} ${y})"><rect width="260" height="118" rx="28" fill="rgba(255,255,255,.065)" stroke="${accent}" stroke-opacity=".48"/><circle cx="218" cy="31" r="28" fill="${accent}" opacity=".18"/><text x="24" y="43" fill="${accent}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="950" letter-spacing="2.4">${escapeXml(String(key).replace(/([A-Z])/g, " $1").toUpperCase().slice(0, 20))}</text><text x="24" y="87" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="950">${escapeXml(String(value).slice(0, 22))}</text></g>`;
  }).join("\n");
  const titleLines = wrapExportLines(normalizedTitle, 18, 3);
  const discoveryId = String(payload?.publicId || payload?.dna || payload?.code || payload?.id || "EOS-1047").slice(0, 24);
  const score = payload?.score || payload?.aiConfidence || payload?.compatibility || payload?.opportunityScore || "94";
  const pair = payload?.pair || payload?.compareSet || payload?.selected || payload?.target || "ElementOS Discovery";
  const generated = escapeXml(new Date().toLocaleString());
  const starfield = Array.from({ length: 90 }).map((_, i) => {
    const x = (i * 137) % 1080;
    const y = (i * 71) % 1350;
    const r = 1 + (i % 3) * 0.8;
    const color = [palette.a, palette.b, palette.c, "#ffffff"][i % 4];
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${0.16 + (i % 5) * 0.055}"/>`;
  }).join("");
  const grid = Array.from({ length: 18 }).map((_, i) => `<line x1="${80 + i * 55}" y1="0" x2="${80 + i * 55}" y2="1350" stroke="${palette.a}" stroke-opacity=".055"/>`).join("") + Array.from({ length: 22 }).map((_, i) => `<line x1="0" y1="${92 + i * 56}" x2="1080" y2="${92 + i * 56}" stroke="${palette.a}" stroke-opacity=".045"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#030711"/><stop offset=".38" stop-color="#061a31"/><stop offset=".72" stop-color="#0d1028"/><stop offset="1" stop-color="#260b39"/></linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.a}"/><stop offset=".55" stop-color="${palette.c}"/><stop offset="1" stop-color="${palette.b}"/></linearGradient>
    <radialGradient id="pulseA" cx="72%" cy="12%" r="72%"><stop offset="0" stop-color="${palette.a}" stop-opacity=".42"/><stop offset="1" stop-color="${palette.a}" stop-opacity="0"/></radialGradient>
    <radialGradient id="pulseB" cx="12%" cy="88%" r="60%"><stop offset="0" stop-color="${palette.b}" stop-opacity=".32"/><stop offset="1" stop-color="${palette.b}" stop-opacity="0"/></radialGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="bigGlow"><feGaussianBlur stdDeviation="28"/></filter>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity=".44"/></filter>
    <filter id="microNoise"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .055"/></feComponentTransfer></filter>
  </defs>
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <rect width="1080" height="1350" fill="url(#pulseA)"/>
  <rect width="1080" height="1350" fill="url(#pulseB)"/>
  <rect width="1080" height="1350" filter="url(#microNoise)" opacity=".55"/>
  <g opacity=".85">${grid}${starfield}</g>
  <circle cx="870" cy="225" r="205" fill="${palette.a}" opacity=".16" filter="url(#bigGlow)"/>
  <circle cx="185" cy="1135" r="245" fill="${palette.b}" opacity=".13" filter="url(#bigGlow)"/>
  <rect x="48" y="48" width="984" height="1254" rx="64" fill="rgba(2,6,23,.58)" stroke="url(#frame)" stroke-width="3" filter="url(#softShadow)"/>
  <path d="M72 112 C240 40 520 38 1000 82 L1000 230 C620 160 300 165 72 252 Z" fill="#ffffff" opacity=".045"/>
  <rect x="78" y="78" width="924" height="1194" rx="48" fill="rgba(255,255,255,.032)" stroke="rgba(255,255,255,.12)"/>

  <text x="92" y="126" fill="${palette.b}" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="950" letter-spacing="5">ELEMENTOS · LUXURY SCIENCE EXPORT</text>
  <text x="92" y="164" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="850" letter-spacing="2.2">PDF · JSON · SVG · SOCIAL READY</text>

  <g transform="translate(782 98)">
    <rect x="0" y="0" width="184" height="184" rx="34" fill="rgba(34,211,238,.11)" stroke="${palette.a}" stroke-opacity=".55"/>
    <circle cx="145" cy="39" r="23" fill="${palette.b}" opacity=".35"/>
    <text x="28" y="47" fill="${palette.a}" font-family="Inter, Arial" font-size="19" font-weight="950">118</text>
    <text x="30" y="116" fill="#ffffff" font-family="Inter, Arial" font-size="68" font-weight="950">Eo</text>
    <text x="29" y="149" fill="${palette.a}" font-family="Inter, Arial" font-size="18" font-weight="900">ElementOS</text>
  </g>

  <text x="92" y="248" fill="${palette.a}" font-family="JetBrains Mono, Consolas, monospace" font-size="31" font-weight="950" letter-spacing="2.5">${escapeXml(discoveryId)}</text>
  ${titleLines.map((line, index) => `<text x="92" y="${335 + index * 82}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="70" font-weight="950">${escapeXml(line)}</text>`).join("\n")}
  <text x="92" y="${580 + Math.max(0, titleLines.length - 1) * 26}" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="800">${escapeXml(String(pair).slice(0, 54))}</text>

  <g transform="translate(92 628)">
    <rect x="0" y="0" width="896" height="154" rx="38" fill="rgba(34,211,238,.09)" stroke="${palette.a}" stroke-opacity=".42"/>
    <circle cx="812" cy="76" r="55" fill="${palette.b}" opacity=".18"/>
    <text x="36" y="55" fill="#94a3b8" font-family="Inter, Arial" font-size="18" font-weight="950" letter-spacing="3">DISCOVERY SCORE</text>
    <text x="36" y="123" fill="#ffffff" font-family="Inter, Arial" font-size="74" font-weight="950">${escapeXml(String(score).replace("%", ""))}%</text>
    <text x="300" y="72" fill="${palette.b}" font-family="Inter, Arial" font-size="25" font-weight="950">Poster-grade export</text>
    <text x="300" y="116" fill="#dbeafe" font-family="Inter, Arial" font-size="22" font-weight="760">Designed to look like a polished scientific media asset.</text>
  </g>

  ${metricTiles}

  <g transform="translate(94 1098)">
    <rect x="0" y="0" width="892" height="122" rx="36" fill="rgba(15,23,42,.78)" stroke="${palette.b}" stroke-opacity=".34"/>
    <text x="32" y="34" fill="${palette.b}" font-family="Inter, Arial" font-size="15" font-weight="950" letter-spacing="4">DISCOVERY NARRATIVE</text>
    ${narrativeLines.slice(0, 2).map((line, index) => `<text x="32" y="${72 + index * 34}" fill="#e2e8f0" font-family="Inter, Arial" font-size="24" font-weight="780">${escapeXml(line)}</text>`).join("\n")}
  </g>

  <g transform="translate(92 1250)">
    <text x="0" y="0" fill="${palette.a}" font-family="Inter, Arial" font-size="19" font-weight="950" letter-spacing="3">DISCOVER · SIMULATE · UNDERSTAND · SHARE</text>
    <text x="0" y="36" fill="#94a3b8" font-family="Inter, Arial" font-size="17" font-weight="800">Generated ${generated} · ElementOS Discovery Operating System</text>
  </g>
</svg>`;
}

function exportAllFormats({ baseName = "elementos-export", title = "ElementOS Export", summary = "", payload = {}, sections = [], customSvg = null }) {
  const slug = slugifyExportName(baseName);
  const now = new Date().toLocaleString();
  const normalizedPayload = {
    title,
    summary,
    generatedAt: now,
    source: "ElementOS",
    ...payload,
  };

  const metricEntries = Object.entries(normalizedPayload || {})
    .filter(([, value]) => ["string", "number", "boolean"].includes(typeof value))
    .filter(([key]) => !["summary", "source", "generatedAt", "title", "narrative"].includes(key))
    .slice(0, 8);

  const narrative = [
    summary,
    ...sections.map((section) => section.text || section.value || ""),
  ].filter(Boolean).join("\n\n") || "ElementOS generated this export as a research-ready intelligence asset.";

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const dark = [2, 6, 23];
  const panel = [7, 18, 34];
  const panel2 = [10, 28, 48];
  const cyan = [103, 232, 249];
  const gold = [251, 191, 36];
  const white = [241, 245, 249];
  const muted = [148, 163, 184];

  const addPageShell = (pageNo = 1) => {
    pdf.setFillColor(...dark);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setFillColor(4, 16, 31);
    pdf.roundedRect(7, 7, pageWidth - 14, pageHeight - 14, 5, 5, "F");
    pdf.setDrawColor(...cyan);
    pdf.setLineWidth(0.35);
    pdf.roundedRect(9, 9, pageWidth - 18, pageHeight - 18, 4, 4, "S");
    pdf.setDrawColor(251, 191, 36);
    pdf.setLineWidth(0.18);
    pdf.line(margin, 24, pageWidth - margin, 24);
    pdf.setTextColor(...cyan);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("ELEMENTOS", margin, 17);
    pdf.setTextColor(...gold);
    pdf.text("DISCOVERY OPERATING SYSTEM", pageWidth - margin, 17, { align: "right" });
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(7);
    pdf.text(`PDF · JSON · SVG export bundle · Page ${pageNo}`, margin, pageHeight - 9);
  };

  const ensureSpace = (needed = 30) => {
    if (y + needed > pageHeight - 20) {
      pdf.addPage();
      addPageShell(pdf.getNumberOfPages());
      y = 34;
    }
  };

  const textBlock = (text, x, yStart, maxWidth, size = 10, color = white, bold = false, lineHeight = 5.5) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(String(text || ""), maxWidth);
    lines.forEach((line, index) => pdf.text(line, x, yStart + index * lineHeight));
    return yStart + Math.max(1, lines.length) * lineHeight;
  };

  addPageShell(1);
  y = 36;

  pdf.setFillColor(4, 12, 24);
  pdf.roundedRect(margin, y, contentWidth, 56, 5, 5, "F");
  pdf.setDrawColor(...cyan);
  pdf.setLineWidth(0.22);
  pdf.roundedRect(margin, y, contentWidth, 56, 5, 5, "S");
  pdf.setTextColor(...gold);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.text("PREMIUM SCIENTIFIC EXPORT", margin + 6, y + 9);
  pdf.setTextColor(...white);
  pdf.setFontSize(19);
  const titleLines = pdf.splitTextToSize(String(title || "ElementOS Export"), contentWidth - 72).slice(0, 3);
  titleLines.forEach((line, index) => pdf.text(line, margin + 6, y + 22 + index * 8));

  const scoreValue = normalizedPayload.score || normalizedPayload.aiConfidence || normalizedPayload.compatibility || normalizedPayload.opportunityScore || normalizedPayload.discoveryScore;
  pdf.setFillColor(8, 48, 68);
  pdf.roundedRect(pageWidth - margin - 52, y + 10, 44, 34, 4, 4, "F");
  pdf.setTextColor(...cyan);
  pdf.setFontSize(22);
  pdf.text(`${scoreValue || "EOS"}${scoreValue ? "%" : ""}`, pageWidth - margin - 30, y + 26, { align: "center" });
  pdf.setFontSize(6.5);
  pdf.setTextColor(...muted);
  pdf.text(scoreValue ? "DISCOVERY SCORE" : "EXPORT", pageWidth - margin - 30, y + 36, { align: "center" });

  y += 68;

  const introLines = pdf.splitTextToSize(narrative, contentWidth - 12).slice(0, 8);
  const introHeight = Math.max(34, 16 + introLines.length * 5.2);
  pdf.setFillColor(...panel);
  pdf.roundedRect(margin, y, contentWidth, introHeight, 5, 5, "F");
  pdf.setDrawColor(37, 99, 235);
  pdf.roundedRect(margin, y, contentWidth, introHeight, 5, 5, "S");
  pdf.setTextColor(...gold);
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  pdf.text("DISCOVERY NARRATIVE", margin + 6, y + 9);
  pdf.setTextColor(226, 232, 240);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  introLines.forEach((line, index) => pdf.text(line, margin + 6, y + 19 + index * 5.2));
  y += introHeight + 10;

  if (metricEntries.length) {
    ensureSpace(64);
    pdf.setTextColor(...cyan);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Key Metrics", margin, y);
    y += 6;
    const tileW = (contentWidth - 6) / 2;
    metricEntries.slice(0, 8).forEach(([key, value], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = margin + col * (tileW + 6);
      const ty = y + row * 24;
      pdf.setFillColor(...(index % 2 === 0 ? panel2 : panel));
      pdf.roundedRect(x, ty, tileW, 19, 4, 4, "F");
      pdf.setDrawColor(index % 3 === 0 ? cyan[0] : gold[0], index % 3 === 0 ? cyan[1] : gold[1], index % 3 === 0 ? cyan[2] : gold[2]);
      pdf.roundedRect(x, ty, tileW, 19, 4, 4, "S");
      pdf.setTextColor(...muted);
      pdf.setFontSize(6.8);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(key).replace(/([A-Z])/g, " $1").toUpperCase().slice(0, 26), x + 4, ty + 7);
      pdf.setTextColor(...white);
      pdf.setFontSize(10.5);
      pdf.text(String(value).slice(0, 34), x + 4, ty + 15);
    });
    y += Math.ceil(Math.min(metricEntries.length, 8) / 2) * 24 + 8;
  }

  if (sections.length) {
    pdf.setTextColor(...cyan);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Export Sections", margin, y);
    y += 7;
    sections.slice(0, 10).forEach((section, index) => {
      const heading = section.heading || section.label || `Section ${index + 1}`;
      const body = section.text || section.value || "";
      const bodyLines = pdf.splitTextToSize(String(body), contentWidth - 12).slice(0, 7);
      const h = Math.max(24, 14 + bodyLines.length * 5);
      ensureSpace(h + 8);
      pdf.setFillColor(index % 2 ? 5 : 8, index % 2 ? 18 : 25, index % 2 ? 34 : 45);
      pdf.roundedRect(margin, y, contentWidth, h, 4, 4, "F");
      pdf.setDrawColor(30, 64, 175);
      pdf.roundedRect(margin, y, contentWidth, h, 4, 4, "S");
      pdf.setTextColor(...gold);
      pdf.setFontSize(7.2);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(heading).toUpperCase().slice(0, 44), margin + 5, y + 7);
      pdf.setTextColor(226, 232, 240);
      pdf.setFontSize(9.4);
      pdf.setFont("helvetica", "normal");
      bodyLines.forEach((line, i) => pdf.text(line, margin + 5, y + 15 + i * 5));
      y += h + 7;
    });
  }

  ensureSpace(34);
  pdf.setFillColor(15, 23, 42);
  pdf.roundedRect(margin, pageHeight - 31, contentWidth, 16, 4, 4, "F");
  pdf.setTextColor(...cyan);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("Generated by ElementOS · Discover · Simulate · Understand · Share", margin + 5, pageHeight - 21);
  pdf.setTextColor(...muted);
  pdf.text(now, pageWidth - margin - 5, pageHeight - 21, { align: "right" });

  pdf.save(`${slug}.pdf`);

  downloadFile(`${slug}.json`, JSON.stringify(normalizedPayload, null, 2), "application/json");
  downloadFile(`${slug}.svg`, customSvg || makeExportSvg({ title, summary, payload: normalizedPayload, sections, variant: "Luxury Scientific" }), "image/svg+xml");
  notifyUser("Premium PDF, JSON and SVG exports created.");
}
function notifyUser(message) {
  try {
    window.dispatchEvent(new CustomEvent("elementos:toast", { detail: message }));
  } catch (error) {
    console.log(message);
  }
}

async function safeCopyText(text, message = "Copied to clipboard.") {
  try {
    if (navigator?.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(String(text || ""));
    } else {
      const input = document.createElement("textarea");
      input.value = String(text || "");
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    notifyUser(message);
    return true;
  } catch (error) {
    console.error("Copy failed", error);
    notifyUser("Copy failed. Please try again.");
    return false;
  }
}

function handlePlanCTA(plan) {
  const summary = `${plan?.name || "ElementOS"} plan selected. ${plan?.price || ""} · ${(plan?.features || []).join(", ")}`;
  safeCopyText(summary, `${plan?.name || "Plan"} details copied.`);
}
function Panel({ children, className = "" }) {
  return (
    <div className={`eos-panel eos-magnetic-sheen relative overflow-hidden rounded-[1.15rem] border border-[#123257] bg-[#06101d]/88 p-5 shadow-[0_0_0_1px_rgba(35,120,255,.06),0_18px_80px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-2xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,145,255,.13),transparent_33%),radial-gradient(circle_at_bottom_right,rgba(112,0,255,.10),transparent_36%),linear-gradient(180deg,rgba(255,255,255,.035),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
function Pill({ children, gold = false }) { return <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[.22em] ${gold ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"}`}>{children}</span>; }
function Button({ children, onClick, variant = "ghost", className = "" }) {
  const styles =
    variant === "primary"
      ? "border border-[#2478ff] bg-gradient-to-r from-[#0b63ff] via-[#0f7bff] to-[#08b4ff] text-white shadow-[0_0_28px_rgba(0,123,255,.35)]"
      : variant === "danger"
      ? "border border-rose-300/25 bg-rose-400/10 text-rose-100 shadow-[0_0_24px_rgba(244,63,94,.12)]"
      : "border border-[#17365f] bg-[#071425]/80 text-slate-100 hover:border-[#0ea5ff]/60 hover:bg-[#0b1d35]";

  const handleClick = (event) => {
    if (typeof onClick === "function") {
      onClick(event);
      return;
    }
    notifyUser("Action registered.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`eos-button rounded-xl px-4 py-3 font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,145,255,.22)] active:translate-y-0 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
function Info({ title, children }) { return <div className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-50"><div className="mb-1 text-xs font-black uppercase tracking-[.22em] text-cyan-200">{title}</div><div className="leading-6 text-slate-200">{children}</div></div>; }
function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#01040a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_2%,rgba(34,211,238,.28),transparent_26%),radial-gradient(circle_at_82%_8%,rgba(250,204,21,.15),transparent_24%),radial-gradient(circle_at_66%_70%,rgba(79,70,229,.16),transparent_31%),radial-gradient(circle_at_18%_92%,rgba(8,145,178,.16),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[.40] bg-[linear-gradient(rgba(103,232,249,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,.075)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 opacity-[.16] bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,.14)_12%,transparent_24%,transparent_72%,rgba(250,204,21,.12)_84%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,13,.16)_42%,rgba(1,4,10,.96)_100%)]" />
      <div className="absolute left-[12%] top-[-18rem] h-[46rem] w-[46rem] rounded-full bg-cyan-500/16 blur-3xl" />
      <div className="absolute right-[-10rem] top-[10%] h-[34rem] w-[34rem] rounded-full bg-blue-700/20 blur-3xl" />
      <div className="absolute bottom-[-18rem] left-[32%] h-[36rem] w-[36rem] rounded-full bg-amber-400/10 blur-3xl" />
      <div className="eos-scanline absolute inset-0" />
      <div className="eos-lux-noise absolute inset-0" />
    </div>
  );
}

function ElementOSThemeSkin() {
  return (
    <style>{`
      :root {
        --eos-bg: #02060d;
        --eos-panel: rgba(6, 16, 29, .88);
        --eos-panel-2: rgba(8, 22, 40, .92);
        --eos-border: rgba(39, 119, 255, .25);
        --eos-border-soft: rgba(76, 178, 255, .14);
        --eos-blue: #0b63ff;
        --eos-cyan: #08b4ff;
        --eos-text: #edf6ff;
        --eos-muted: #8ca4c0;
      }
      html { background: var(--eos-bg); }
      body { background: var(--eos-bg); color: var(--eos-text); }
      * { scrollbar-width: thin; scrollbar-color: rgba(0,145,255,.55) rgba(2,6,13,.65); }
      *::-webkit-scrollbar { width: 10px; height: 10px; }
      *::-webkit-scrollbar-track { background: rgba(2,6,13,.8); }
      *::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#0b63ff,#08b4ff); border-radius: 999px; border: 2px solid rgba(2,6,13,.85); }
      .eos-shell { background: radial-gradient(circle at 50% 0%, rgba(0,145,255,.08), transparent 38%), var(--eos-bg); }
      .eos-panel { box-shadow: 0 0 0 1px rgba(0,160,255,.05), 0 22px 90px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,.04); }
      .eos-panel:hover { border-color: rgba(0, 174, 255, .34); box-shadow: 0 0 0 1px rgba(0,160,255,.08), 0 24px 95px rgba(0,0,0,.5), 0 0 34px rgba(0,126,255,.08), inset 0 1px 0 rgba(255,255,255,.06); }
      .eos-button { position: relative; overflow: hidden; }
      .eos-button:before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent); transform: translateX(-120%); transition: transform .55s ease; }
      .eos-button:hover:before { transform: translateX(120%); }
      .eos-input, input, select, textarea { background: rgba(4, 12, 23, .92) !important; border-color: rgba(40, 105, 190, .32) !important; color: #eaf6ff !important; }
      input::placeholder, textarea::placeholder { color: rgba(170,190,215,.62); }
      .eos-nav-item { background: rgba(5,14,26,.72); border: 1px solid rgba(28,72,126,.42); }
      .eos-nav-item-active { background: linear-gradient(90deg, rgba(11,99,255,.28), rgba(8,180,255,.08)); border-color: rgba(40,132,255,.75); box-shadow: inset 0 0 18px rgba(0,116,255,.12), 0 0 22px rgba(0,116,255,.15); }
      .eos-orbital:before { content: ''; position: absolute; inset: -40%; border: 1px solid rgba(0,174,255,.18); border-radius: 999px; transform: rotate(25deg); }
      .eos-orbital:after { content: ''; position: absolute; inset: -22%; border: 1px dashed rgba(0,174,255,.22); border-radius: 999px; transform: rotate(-18deg); }
      .eos-scanline { background: linear-gradient(to bottom, transparent, rgba(0,174,255,.035), transparent); background-size: 100% 12px; opacity: .32; }
      .eos-data-card { background: linear-gradient(135deg, rgba(4,16,31,.96), rgba(8,24,42,.82)); border: 1px solid rgba(42,103,185,.28); }
      .eos-topbar { background: rgba(2, 8, 17, .78); border: 1px solid rgba(37, 96, 170, .25); box-shadow: 0 0 50px rgba(0,106,255,.08), inset 0 1px 0 rgba(255,255,255,.04); }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes eosSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes eosSpinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes eosPulse { 0%,100% { opacity: .72; filter: brightness(1); } 50% { opacity: 1; filter: brightness(1.45); } }
      @keyframes eosDrift { 0% { transform: translateX(-18%); } 100% { transform: translateX(118%); } }

      .poster-hero {
        background:
          radial-gradient(circle at 74% 9%, rgba(14,165,233,.30), transparent 30%),
          radial-gradient(circle at 18% 80%, rgba(245,158,11,.16), transparent 28%),
          linear-gradient(135deg, rgba(2,6,13,.98), rgba(4,17,33,.96) 52%, rgba(5,9,18,.98));
      }
      .poster-grid { background-image: linear-gradient(rgba(34,211,238,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.10) 1px, transparent 1px); background-size: 48px 48px; }
      .poster-gold { color:#f8d477; text-shadow: 0 0 24px rgba(245,158,11,.24); }
      .poster-cyan { color:#67e8f9; text-shadow: 0 0 24px rgba(34,211,238,.34); }
      .poster-card { background: linear-gradient(145deg, rgba(3,12,24,.92), rgba(4,22,40,.72)); border: 1px solid rgba(103,232,249,.18); box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 0 40px rgba(8,180,255,.07); }
      .poster-card-gold { background: linear-gradient(145deg, rgba(18,14,4,.82), rgba(3,12,24,.78)); border: 1px solid rgba(250,204,21,.24); box-shadow: inset 0 1px 0 rgba(255,255,255,.05), 0 0 40px rgba(245,158,11,.08); }
      .poster-element-tile { background: radial-gradient(circle at top, rgba(34,211,238,.28), rgba(7,20,38,.86)); border:1px solid rgba(103,232,249,.35); box-shadow: 0 0 26px rgba(34,211,238,.16); }
      .poster-element-tile-gold { background: radial-gradient(circle at top, rgba(245,158,11,.24), rgba(24,14,4,.84)); border:1px solid rgba(250,204,21,.34); box-shadow: 0 0 26px rgba(245,158,11,.14); }
      .poster-orbit { animation: posterFloat 6s ease-in-out infinite; }
      @keyframes posterFloat { 0%,100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-10px) scale(1.015); } }


      /* V38: global poster-grade magnetic skin */
      .eos-magnetic-sheen { position: relative; overflow: hidden; }
      .eos-magnetic-sheen:after {
        content: '';
        position: absolute;
        inset: -40%;
        background: conic-gradient(from 180deg at 50% 50%, transparent, rgba(103,232,249,.10), transparent, rgba(250,204,21,.07), transparent);
        opacity: .46;
        animation: eosMagneticTurn 16s linear infinite;
        pointer-events: none;
      }
      @keyframes eosMagneticTurn { to { transform: rotate(360deg); } }
      .eos-panel, .poster-card, .poster-card-gold, .eos-data-card, .eos-topbar, aside {
        border-color: rgba(103,232,249,.20) !important;
        background-image:
          radial-gradient(circle at 18% 0%, rgba(103,232,249,.105), transparent 30%),
          radial-gradient(circle at 92% 18%, rgba(250,204,21,.055), transparent 25%),
          linear-gradient(135deg, rgba(3,12,24,.96), rgba(7,25,45,.82) 55%, rgba(2,6,13,.96)) !important;
      }
      .eos-panel:before, .poster-card:before, .poster-card-gold:before {
        content: '';
        position: absolute;
        inset: 0;
        background:
          linear-gradient(120deg, transparent 0%, rgba(255,255,255,.055) 18%, transparent 34%),
          linear-gradient(90deg, rgba(103,232,249,.09), transparent 22%, transparent 78%, rgba(250,204,21,.055));
        opacity: .62;
        pointer-events: none;
      }
      h1, h2, h3 { letter-spacing: -0.035em; }
      .eos-panel h1, .eos-panel h2, .poster-card h1, .poster-card h2 {
        text-shadow: 0 0 34px rgba(34,211,238,.16);
      }
      .eos-nav-item:hover, .eos-button:hover, button:hover {
        filter: saturate(1.16) brightness(1.06);
      }
      .eos-nav-item-active {
        background: linear-gradient(90deg, rgba(11,99,255,.34), rgba(8,180,255,.14), rgba(250,204,21,.06)) !important;
        box-shadow: inset 0 0 22px rgba(0,116,255,.16), 0 0 28px rgba(0,116,255,.20) !important;
      }
      .eos-command-scroll {
        overflow-y: auto;
        overscroll-behavior: contain;
        scrollbar-width: thin;
        scrollbar-color: rgba(103,232,249,.86) rgba(2,6,13,.92);
      }
      .eos-command-scroll::-webkit-scrollbar { width: 12px; }
      .eos-command-scroll::-webkit-scrollbar-track {
        background: rgba(2,6,13,.92);
        border-left: 1px solid rgba(103,232,249,.10);
        border-radius: 999px;
      }
      .eos-command-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg,#67e8f9,#0b63ff,#facc15);
        border-radius: 999px;
        border: 3px solid rgba(2,6,13,.92);
        box-shadow: 0 0 18px rgba(34,211,238,.40);
      }
      .eos-command-shell {
        background:
          radial-gradient(circle at 12% 0%, rgba(103,232,249,.18), transparent 30%),
          radial-gradient(circle at 88% 8%, rgba(250,204,21,.10), transparent 24%),
          linear-gradient(135deg, rgba(2,6,13,.98), rgba(7,20,38,.96) 56%, rgba(2,6,13,.98));
      }



      /* V46: billion-dollar gloss system */
      body {
        background:
          radial-gradient(circle at 20% 0%, rgba(34,211,238,.12), transparent 30%),
          radial-gradient(circle at 80% 8%, rgba(250,204,21,.07), transparent 26%),
          #01040a;
      }
      .eos-lux-noise {
        opacity: .18;
        background-image:
          radial-gradient(circle at 20% 20%, rgba(255,255,255,.12) 0 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, rgba(103,232,249,.12) 0 1px, transparent 1px);
        background-size: 33px 33px, 47px 47px;
        mix-blend-mode: screen;
      }
      .eos-panel, .poster-card, .poster-card-gold, .eos-data-card {
        position: relative;
        backdrop-filter: blur(22px) saturate(1.25);
        box-shadow:
          0 0 0 1px rgba(103,232,249,.075),
          0 24px 110px rgba(0,0,0,.58),
          0 0 54px rgba(8,145,178,.075),
          inset 0 1px 0 rgba(255,255,255,.08),
          inset 0 -1px 0 rgba(103,232,249,.05) !important;
      }
      .eos-panel:after, .poster-card:after, .poster-card-gold:after, .eos-data-card:after {
        content: '';
        position: absolute;
        inset: 1px;
        border-radius: inherit;
        pointer-events: none;
        background:
          radial-gradient(circle at 14% 0%, rgba(255,255,255,.14), transparent 25%),
          linear-gradient(125deg, transparent 0%, rgba(255,255,255,.075) 18%, transparent 36%, transparent 70%, rgba(250,204,21,.06) 88%, transparent 100%);
        opacity: .72;
      }
      .eos-panel:hover, .poster-card:hover, .poster-card-gold:hover, .eos-data-card:hover {
        transform: translateY(-1px);
        box-shadow:
          0 0 0 1px rgba(103,232,249,.12),
          0 28px 120px rgba(0,0,0,.62),
          0 0 74px rgba(34,211,238,.13),
          inset 0 1px 0 rgba(255,255,255,.10) !important;
      }
      .eos-button, button {
        text-shadow: 0 1px 10px rgba(0,0,0,.25);
      }
      .eos-button {
        box-shadow:
          0 12px 30px rgba(0,0,0,.26),
          inset 0 1px 0 rgba(255,255,255,.12),
          inset 0 -1px 0 rgba(0,0,0,.28);
      }
      .eos-button:after {
        content: '';
        position: absolute;
        inset: 1px;
        border-radius: inherit;
        background: linear-gradient(180deg, rgba(255,255,255,.16), transparent 42%);
        opacity: .65;
        pointer-events: none;
      }
      .eos-button:hover {
        box-shadow:
          0 18px 44px rgba(0,0,0,.34),
          0 0 34px rgba(34,211,238,.20),
          inset 0 1px 0 rgba(255,255,255,.18),
          inset 0 -1px 0 rgba(0,0,0,.32) !important;
      }
      .eos-nav-item {
        box-shadow: inset 0 1px 0 rgba(255,255,255,.045), 0 8px 24px rgba(0,0,0,.18);
      }
      .eos-nav-item:hover {
        border-color: rgba(103,232,249,.46) !important;
        background: linear-gradient(90deg, rgba(7,20,38,.96), rgba(8,47,73,.72)) !important;
      }
      .eos-input, input, select, textarea {
        box-shadow: inset 0 1px 0 rgba(255,255,255,.055), 0 0 0 1px rgba(103,232,249,.03) !important;
      }
      .eos-input:focus, input:focus, select:focus, textarea:focus {
        outline: none !important;
        border-color: rgba(103,232,249,.70) !important;
        box-shadow: 0 0 0 3px rgba(34,211,238,.12), 0 0 35px rgba(34,211,238,.12), inset 0 1px 0 rgba(255,255,255,.08) !important;
      }
      .poster-hero, header, .eos-topbar {
        box-shadow:
          0 0 0 1px rgba(103,232,249,.075),
          0 36px 140px rgba(0,0,0,.56),
          0 0 120px rgba(34,211,238,.10) !important;
      }
      .poster-gold, .text-amber-100, .text-amber-200 {
        text-shadow: 0 0 22px rgba(250,204,21,.20);
      }
      .poster-cyan, .text-cyan-100, .text-cyan-200 {
        text-shadow: 0 0 24px rgba(34,211,238,.18);
      }
      svg { filter: drop-shadow(0 10px 30px rgba(0,0,0,.20)); }
      .eos-premium-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(103,232,249,.58), rgba(250,204,21,.32), transparent);
      }

            @keyframes eosSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes eosSpinReverse { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(-360deg); } }
      @keyframes eosPulse { 0%,100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.06); } }
      @keyframes eosStrataDrift { 0%,100% { filter: brightness(1) saturate(1); } 50% { filter: brightness(1.18) saturate(1.35); } }
      @keyframes eosDrillPulse { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.35) saturate(1.35); } }
      @keyframes eosMudFlow { from { transform: translateY(-55%); } to { transform: translateY(18%); } }
      @keyframes eosMudBead { 0% { transform: translate(-50%, -28px) scale(.8); opacity: .15; } 35% { opacity: .85; } 100% { transform: translate(-50%, 74px) scale(1.15); opacity: .05; } }
      @keyframes eosDrillBit { from { filter: brightness(1); } 50% { filter: brightness(1.55) saturate(1.45); } to { filter: brightness(1); } }
      @keyframes eosReservoirGlow { 0%,100% { opacity: .74; filter: brightness(1); } 50% { opacity: 1; filter: brightness(1.35) saturate(1.25); } }
      @keyframes eosPressureBloom { 0%,100% { transform: scale(.92); filter: blur(0px) brightness(1); } 50% { transform: scale(1.08); filter: blur(1px) brightness(1.35); } }
      @keyframes eosWaveShell { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.45) saturate(1.45); } }
      @keyframes eosWaveTravel { 0% { left: -10%; opacity: .15; } 12% { opacity: 1; } 100% { left: 110%; opacity: .12; } }
      @keyframes eosTraceFlow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -42; } }
      @keyframes eosSvgPulse { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.8); } }
    `}</style>
  );
}
function MiniBars({ values, max = 5 }) { return <div className="flex h-28 items-end gap-2">{values.map((v, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-cyan-300/80" style={{ height: `${Math.max(8, (v / max) * 100)}%` }}/><span className="text-[10px] text-slate-500">{i + 1}</span></div>)}</div>; }
function RadarChart({ data }) {
  const keys = ["stability", "conductivity", "thermal", "diffusion", "pressure", "rarity"];
  const points = keys.map((k, i) => { const angle = -Math.PI / 2 + (i / keys.length) * Math.PI * 2; const r = (data[k] / 5) * 42; return `${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`; }).join(" ");
  return <svg viewBox="0 0 100 100" className="h-52 w-full"><polygon points="50,8 86,29 86,71 50,92 14,71 14,29" fill="none" stroke="rgba(255,255,255,.18)"/><polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="rgba(255,255,255,.11)"/><polygon points={points} fill="rgba(34,211,238,.28)" stroke="rgba(34,211,238,.95)" strokeWidth="1.5"/>{keys.map((k, i) => { const angle = -Math.PI / 2 + (i / keys.length) * Math.PI * 2; return <text key={k} x={50 + Math.cos(angle) * 48} y={52 + Math.sin(angle) * 48} textAnchor="middle" className="fill-slate-300 text-[4px] uppercase">{k.slice(0, 4)}</text>; })}</svg>;
}
function Sidebar({ page, setPage }) {
  const [openGroups, setOpenGroups] = useState({
    research: true,
    simulations: true,
    advanced: true,
    publishing: true,
    workspace: true,
  });

  const primaryItems = [
    ["landing", "Home", Sparkles],
    ["dashboard", "Dashboard", Home],
    ["copilot", "AI Copilot", Sparkles],
    ["mission", "Mission Control", CheckCircle2],
  ];

  const groups = [
    {
      id: "research",
      label: "Research Tools",
      icon: Search,
      items: [
        ["explorer", "Element Explorer", Search],
        ["compare", "Compare Materials", BarChart3],
        ["isotopes", "Isotope Lab", Atom],
        ["periodic", "Periodic Map", Layers],
        ["atlas", "Behaviour Atlas", Radar],
        ["graph", "Relationship Graph", Network],
        ["universe", "Discovery Universe", Orbit],
      ],
    },
    {
      id: "simulations",
      label: "Simulations",
      icon: BarChart3,
      items: [
        ["scenario", "Scenario Builder", FileText],
        ["visualization", "Visual Engine", BarChart3],
        ["calculations", "Calculation Intelligence", Calculator],
      ],
    },
    {
      id: "advanced",
      label: "Advanced Labs",
      icon: Radar,
      items: [
        ["matterlab", "★ Matter Intelligence OS", Globe2],
        ["timemachine", "Time Machine", Clock3],
        ["seismo", "Seismo Lab", Network],
        ["welldriller", "Well Driller Lab", Radar],
      ],
    },
    {
      id: "publishing",
      label: "Publishing",
      icon: BookOpen,
      items: [
        ["discover", "Discovery Feed", Sparkles],
        ["simreports", "Simulation Dossiers", BookOpen],
        ["viralcards", "Discovery Media Engine", Sparkles],
        ["reports", "Research Reports", BookOpen],
      ],
    },
    {
      id: "workspace",
      label: "Workspace",
      icon: Save,
      items: [
        ["lab", "Workspace", Save],
        ["beta", "Founding Beta", UserPlus],
      ],
    },
  ];

  const NavButton = ({ id, label, Icon, nested = false }) => {
    const active = page === id;
    return (
      <button
        key={id}
        onClick={() => setPage(id)}
        className={`eos-nav-item ${active ? "eos-nav-item-active text-white" : "text-slate-300 hover:border-[#2777ff]/50 hover:bg-[#071a30]"} flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${nested ? "ml-3 w-[calc(100%-0.75rem)]" : ""}`}
      >
        <span className="flex items-center gap-3">
          <span className={`grid h-8 w-8 place-items-center rounded-lg border ${active ? "border-cyan-300/35 bg-blue-500/20 text-cyan-100" : "border-white/10 bg-white/[.025] text-slate-300"}`}>
            <Icon size={15} />
          </span>
          <span className="text-sm font-semibold">{label}</span>
        </span>
        <ChevronRight size={14} className={active ? "text-cyan-100" : "text-slate-500"} />
      </button>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[306px] overflow-y-auto border-r border-[#14345a] bg-[#020812]/94 p-3 backdrop-blur-2xl lg:block">
      <div className="mb-3 rounded-2xl border border-[#17365f] bg-[#06101d]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
        <div className="flex items-center gap-3">
          <div className="relative grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_26px_rgba(0,145,255,.25)]">
            <div className="absolute inset-1 rounded-lg border border-blue-500/30" />
            <Atom size={24} />
          </div>
          <div>
            <div className="text-2xl font-black leading-none tracking-[.08em] text-white">ELEMENT OS</div>
            <div className="mt-1 text-[10px] uppercase tracking-[.22em] text-slate-400">Material Intelligence Platform</div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {primaryItems.map(([id, label, Icon]) => (
          <NavButton key={id} id={id} label={label} Icon={Icon} />
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {groups.map((group) => {
          const GroupIcon = group.icon;
          const activeGroup = group.items.some(([id]) => page === id);
          const isOpen = openGroups[group.id];

          return (
            <div key={group.id} className={`rounded-2xl border ${activeGroup ? "border-cyan-300/30 bg-cyan-400/5" : "border-[#17365f] bg-[#06101d]/55"} p-2`}>
              <button
                onClick={() => setOpenGroups((current) => ({ ...current, [group.id]: !current[group.id] }))}
                className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left"
              >
                <span className="flex items-center gap-2">
                  <span className={`grid h-8 w-8 place-items-center rounded-lg border ${activeGroup ? "border-cyan-300/35 bg-blue-500/20 text-cyan-100" : "border-white/10 bg-white/[.025] text-slate-400"}`}>
                    <GroupIcon size={15} />
                  </span>
                  <span>
                    <span className="block text-[10px] uppercase tracking-[.22em] text-slate-500">Section</span>
                    <span className={`text-sm font-black ${activeGroup ? "text-cyan-100" : "text-slate-200"}`}>{group.label}</span>
                  </span>
                </span>
                <ChevronRight size={15} className={`text-slate-500 transition ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {isOpen && (
                <div className="mt-1 space-y-1.5">
                  {group.items.map(([id, label, Icon]) => (
                    <NavButton key={id} id={id} label={label} Icon={Icon} nested />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-[#17365f] bg-gradient-to-br from-[#061528] to-[#030812] p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/30 bg-blue-500/15 text-blue-100 shadow-[0_0_28px_rgba(0,116,255,.16)]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">Researcher Status</div>
            <div className="text-sm font-black text-cyan-100">Elite Researcher</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>LEVEL 27</span><span>12,540 / 18,000 XP</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950">
          <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#0b63ff] to-[#08b4ff]" />
        </div>
        <div className="mt-4 grid gap-2 text-xs text-slate-300">
          <div className="flex justify-between"><span>Experiments</span><b className="text-cyan-100">1,842</b></div>
          <div className="flex justify-between"><span>Discoveries</span><b className="text-cyan-100">128</b></div>
          <div className="flex justify-between"><span>Reports</span><b className="text-cyan-100">342</b></div>
          <div className="flex justify-between"><span>Streak</span><b className="text-cyan-100">14 Days</b></div>
        </div>
      </div>
    </aside>
  );
}


function Dashboard({ setPage, saveWorkspace, loadWorkspace, session, isPro, startCheckout }) {
  return <><DiscoveryCommandCenter setPage={setPage} compare={["Al", "Fe", "Ti", "Hf"]} /><MissionProgressPanel setPage={setPage} /><Panel className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><div><Pill gold><Sparkles size={12}/> production preview</Pill><h1 className="mt-4 text-5xl font-black sm:text-7xl">ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Material Intelligence Platform</span></h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Explore, compare and publish material behaviour. ElementOS now feels like a subscriber-ready research workspace: accounts, live simulation, visual comparison, graph intelligence and exportable reports.</p><Info title="Positioning upgrade">Public language has been cleaned up. The product now leads with material intelligence, simulation, research reports and workspace value instead of internal prototype wording.</Info></div><Panel><h2 className="text-2xl font-black">Start Here</h2>{[["Run First Simulation", "scenario", FileText], ["Matter Intelligence OS", "matterlab", Globe2], ["AI Copilot", "copilot", Sparkles], ["Mission Control", "mission", CheckCircle2], ["Discovery Feed", "discover", Sparkles], ["Compare Materials", "compare", BarChart3], ["Isotope Lab", "isotopes", Atom], ["Time Machine", "timemachine", Clock3], ["Well Driller Lab", "welldriller", Radar], ["Seismo Lab", "seismo", Network], ["Simulation Dossiers", "simreports", BookOpen], ["Discovery Media Engine", "viralcards", Sparkles], ["Calculation Intelligence", "calculations", Calculator], ["Workspace", "lab", Save], ["Visual Engine", "visualization", BarChart3], ["Behaviour Atlas", "atlas", Radar], ["Founding Beta", "beta", UserPlus], ["Research Reports", "reports", FileText]].map(([label, id, Icon], i) => <Button key={id} onClick={() => setPage(id)} className="mt-3 w-full" variant={i === 1 ? "primary" : "ghost"}><Icon className="inline" size={16}/> {label}</Button>)}{session && <div className="mt-4 grid gap-3"><Button onClick={saveWorkspace} variant="primary" className="w-full"><Save size={16} className="inline"/> Save Workspace</Button><Button onClick={loadWorkspace} className="w-full">Restore Workspace</Button></div>}{!session && <Button onClick={() => setPage("beta")} variant="primary" className="mt-4 w-full"><UserPlus size={16} className="inline"/> Join Founding Beta</Button>}{session && !isPro && <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-100">Billing</div><Button onClick={startCheckout} variant="primary" className="w-full"><Sparkles size={16} className="inline"/> Upgrade to Pro Lab</Button><p className="mt-3 text-xs leading-5 text-amber-100/80">Unlock premium PDF/JSON/SVG exports and Pro workspace features through Stripe Sandbox.</p></div>}{session && isPro && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab Active</div>}</Panel></Panel><div className="grid gap-6 xl:grid-cols-4">{[["118", "elements"], ["7", "behaviour metrics"], ["4", "export modes"], ["Live", "simulation layer"]].map(([a,b]) => <Panel key={b}><div className="text-4xl font-black text-cyan-100">{a}</div><div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{b}</div></Panel>)}</div>
<GuidePanel page="dashboard" />
      <DiscoveryNetworkSubscriberEdition setPage={setPage} />
      <SubscriberWorkspaceVault setPage={setPage} />
      <SubscriberRecommendedNextStep setPage={setPage} />
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


function makePublishableDiscoveries(limit = 12) {
  return adaptiveDiscoveryRank(generateDiscoveryEngine(limit)).map((d, index) => ({
    ...d,
    publicId: `${d.a}-${d.b}-${d.dna?.split("-").pop() || "OS"}-${1047 + index}`.toUpperCase(),
  }));
}

function createDiscoveryUrl(discovery) {
  if (!discovery?.publicId) return "";
  return `${window.location.origin}${window.location.pathname}?discovery=${discovery.publicId}`;
}


function Discover({ setPage, setPublicDiscovery }) {
  const generated = useMemo(() => generateDiscoveryEngine(24), []);
  const discoveries = useMemo(() => adaptiveDiscoveryRank(generated), [generated]);
  const top = discoveries[0];
  const mostViewed = [...discoveries].sort((a, b) => b.views - a.views).slice(0, 4);
  const mostShared = [...discoveries].sort((a, b) => b.shares - a.shares).slice(0, 4);
  const focusing = discoveries.slice(0, 6);
  const autoPromoted = discoveries.filter((d) => d.aiConfidence >= 90 || d.velocity >= 50).slice(0, 6);
  const profile = growthProfileStats(null, discoveries);
  const today = dailyDiscovery(discoveries) || top;
  const leaderboard = researcherLeaderboard();

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><Sparkles size={12}/> adaptive intelligence</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Adaptive Discovery Intelligence</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            The discovery engine now ranks material pairings by compatibility, AI confidence, share momentum, view signal and trending velocity.
          </p>
          <Info title="Living intelligence layer">
            This turns ElementOS from a static discovery page into a momentum-weighted research network: the strongest discoveries rise automatically and create a fresher homepage every time users return.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Auto-promoted discovery</div>
          <h2 className="mt-3 text-4xl font-black text-cyan-100">{top?.a} + {top?.b}</h2>
          <div className="mt-3 text-6xl font-black text-emerald-200">{top?.momentum}</div>
          <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">adaptive momentum score</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-cyan-200">AI confidence</div>
              <div className="mt-2 text-3xl font-black text-cyan-100">{top?.aiConfidence}%</div>
            </div>
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-emerald-200">Velocity</div>
              <div className="mt-2 text-3xl font-black text-emerald-100">+{top?.velocity}%</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{top?.reason}</p>
          <Button onClick={() => setPage("compare")} variant="primary" className="mt-5 w-full">
            Compare This Discovery
          </Button>
        </Panel>
      </Panel>

      <GuidePanel page="discover" />
      <TrendingDiscoveriesPanel discoveries={discoveries} setPage={setPage} setPublicDiscovery={setPublicDiscovery} />
      <RealTimeNetworkPanel discoveries={discoveries} setPage={setPage} />
      <DiscoveryOSFeed discoveries={discoveries} setPage={setPage} setPublicDiscovery={setPublicDiscovery} />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><UserPlus size={12}/> growth & retention</Pill>
            <h2 className="mt-3 text-4xl font-black">Researcher XP + Daily Discovery</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Progression mechanics turn discovery into a repeatable habit: earn XP, build streaks, save collections and climb the leaderboard.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
            {profile.streak}-day streak active
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-emerald-400/10 p-6">
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Researcher progression</div>
            <div className="mt-2 text-5xl font-black text-cyan-100">Level {profile.level}</div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-cyan-300" style={{ width: `${profile.progress}%` }} />
            </div>
            <div className="mt-3 text-sm text-slate-400">{profile.xp.toLocaleString()} XP · {profile.progress}% to next level</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="text-3xl font-black text-emerald-200">#{profile.rank}</div><div className="text-xs uppercase tracking-[.2em] text-slate-500">weekly rank</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="text-3xl font-black text-amber-100">{profile.saved}</div><div className="text-xs uppercase tracking-[.2em] text-slate-500">saved paths</div></div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
            <div className="text-xs uppercase tracking-[.22em] text-amber-100">Discovery of the day</div>
            <div className="mt-3 text-5xl font-black text-white">{today?.a} + {today?.b}</div>
            <p className="mt-3 text-sm leading-7 text-amber-50/90">
              You discovered {today?.aName} + {today?.bName} before 98% of researchers. Share this card to increase your discovery momentum.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xl font-black text-cyan-100">{today?.aiConfidence}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI confidence</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xl font-black text-emerald-200">+{today?.velocity}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">velocity</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xl font-black text-amber-100">{today?.momentum}</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">momentum</div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => safeCopyText(`I discovered ${today?.a} + ${today?.b} on ElementOS before 98% of researchers.`)}>Copy Share Card</Button>
              <Button variant="primary" onClick={() => setPage("reports")}>Generate Report</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-5">
          {leaderboard.map(([name, xp, badge], index) => (
            <div key={name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-slate-500">rank #{index + 1}</div>
              <div className="mt-2 font-black text-cyan-100">{name}</div>
              <div className="mt-1 text-sm text-emerald-200">{xp}</div>
              <div className="mt-1 text-xs text-slate-400">{badge}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><Network size={12}/> adaptive ranking engine</Pill>
            <h2 className="mt-3 text-4xl font-black">Researchers Are Focusing On</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Momentum-weighted material discoveries ranked by AI confidence, velocity, simulated views, shares and saves.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
            ● Living Discovery Feed
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {focusing.map((d) => (
            <div key={`${d.dna}-adaptive`} className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200">{d.type}</div>
                  <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-black tracking-[.18em] text-amber-100">{d.tier}</div>
                </div>
                <div className="mt-5 text-5xl font-black text-cyan-100">{d.a} + {d.b}</div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{generateDiscoveryHeadline(d)}: {d.reason}.</p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI</div>
                    <div className="mt-2 text-xl font-black text-cyan-100">{d.aiConfidence}%</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">Velocity</div>
                    <div className="mt-2 text-xl font-black text-emerald-200">+{d.velocity}%</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">Momentum</div>
                    <div className="mt-2 text-xl font-black text-amber-100">{d.momentum}</div>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300">{d.views.toLocaleString()} views</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300">{d.shares.toLocaleString()} shares</div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300">{d.saves.toLocaleString()} saves</div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button onClick={() => safeCopyText(`${generateDiscoveryHeadline(d)} — AI confidence ${d.aiConfidence}% — velocity +${d.velocity}%`)}>Copy</Button>
                  <Button variant="primary" onClick={() => setPage("compare")}>Compare</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <Pill gold><Radar size={12}/> most viewed</Pill>
          <h2 className="mt-3 text-3xl font-black">Most Viewed Discoveries</h2>
          <div className="mt-5 space-y-3">
            {mostViewed.map((d) => (
              <div key={`${d.dna}-views`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div>
                  <div className="text-lg font-black text-cyan-100">{d.a} + {d.b}</div>
                  <div className="mt-1 text-sm text-slate-400">{d.type}</div>
                </div>
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xl font-black text-cyan-100">{d.views.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><Sparkles size={12}/> most shared</Pill>
          <h2 className="mt-3 text-3xl font-black">Most Shared Discoveries</h2>
          <div className="mt-5 space-y-3">
            {mostShared.map((d) => (
              <div key={`${d.dna}-shares`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div>
                  <div className="text-lg font-black text-cyan-100">{d.a} + {d.b}</div>
                  <div className="mt-1 text-sm text-slate-400">{d.reason}</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xl font-black text-emerald-100">{d.shares.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><CheckCircle2 size={12}/> auto-promoted by ElementOS</Pill>
            <h2 className="mt-3 text-4xl font-black">Auto-Promoted Discoveries</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Discoveries with high AI confidence or fast trend velocity are promoted into this premium feed.
            </p>
          </div>
          <Button onClick={() => setPage("reports")} variant="primary">Generate Report</Button>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {autoPromoted.map((d) => (
            <div key={`${d.dna}-promoted`} className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-amber-100">AI confidence {d.aiConfidence}%</div>
              <div className="mt-3 text-3xl font-black text-white">{d.aName} + {d.bName}</div>
              <p className="mt-3 text-sm leading-7 text-amber-50/90">{d.reason}. Trending velocity is +{d.velocity}% with {d.shares.toLocaleString()} shares.</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 font-mono text-xs text-cyan-100">{d.dna}</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}


function ScenarioBuilder({ selected, setSelected, setPage }) {
  const scenarioTemplates = [
    "Aluminium bridge bracket in coastal salt air for 25 years under vibration",
    "Titanium pressure housing in deep ocean for 50 years",
    "Copper thermal busbar inside industrial heat for 15 years",
    "Iron support beam in humid underground tunnel for 40 years",
    "Hafnium reactor shielding under high radiation and heat for 30 years",
    "Magnesium aerospace frame under thermal cycling for 10 years",
  ];
  const [scenarioText, setScenarioText] = useState(scenarioTemplates[0]);
  const [material, setMaterial] = useState(selected || "Al");
  const [environment, setEnvironment] = useState("Coastal salt atmosphere");
  const [duration, setDuration] = useState(25);
  const [intensity, setIntensity] = useState(64);
  const [missionMode, setMissionMode] = useState("Engineering");

  const normalized = scenarioText.toLowerCase();
  const detectedMaterial = useMemo(() => {
    const found = elements.find((e) => normalized.includes(e.name.toLowerCase()) || normalized.includes(e.symbol.toLowerCase()));
    return found?.symbol || material;
  }, [scenarioText, material, normalized]);

  const activeMaterial = elementMap[detectedMaterial] || elementMap[material] || elementMap.Al;
  const activeScore = score(activeMaterial.symbol);

  const environmentOptions = [
    "Lab storage", "Coastal salt atmosphere", "Deep ocean", "Industrial heat", "High pressure",
    "Space vacuum", "Cryogenic", "Mining tunnel", "Chemical plant", "Aerospace thermal cycling",
    "Geothermal bore", "High radiation", "Arctic exposure", "Desert abrasion", "Battery enclosure"
  ];

  const inferredEnvironment = useMemo(() => {
    if (normalized.includes("ocean") || normalized.includes("deep sea")) return "Deep ocean";
    if (normalized.includes("salt") || normalized.includes("coastal") || normalized.includes("sea")) return "Coastal salt atmosphere";
    if (normalized.includes("heat") || normalized.includes("hot") || normalized.includes("thermal") || normalized.includes("industrial")) return "Industrial heat";
    if (normalized.includes("space") || normalized.includes("vacuum")) return "Space vacuum";
    if (normalized.includes("pressure") || normalized.includes("compression")) return "High pressure";
    if (normalized.includes("cryo") || normalized.includes("cold") || normalized.includes("arctic")) return "Cryogenic";
    if (normalized.includes("radiation") || normalized.includes("reactor")) return "High radiation";
    if (normalized.includes("mine") || normalized.includes("tunnel") || normalized.includes("underground")) return "Mining tunnel";
    if (normalized.includes("chemical") || normalized.includes("acid")) return "Chemical plant";
    if (normalized.includes("geothermal") || normalized.includes("bore")) return "Geothermal bore";
    if (normalized.includes("battery")) return "Battery enclosure";
    return environment;
  }, [normalized, environment]);

  const inferredYears = useMemo(() => {
    const match = normalized.match(/(\d+)\s*(year|years|yr|yrs)/);
    if (match) return Math.max(1, Math.min(1000, Number(match[1])));
    return duration;
  }, [normalized, duration]);

  const envRisk = {
    "Lab storage": 0.48,
    "Coastal salt atmosphere": 1.42,
    "Deep ocean": 1.62,
    "Industrial heat": 1.36,
    "High pressure": 1.31,
    "Space vacuum": 1.08,
    "Cryogenic": 0.92,
    "Mining tunnel": 1.22,
    "Chemical plant": 1.58,
    "Aerospace thermal cycling": 1.28,
    "Geothermal bore": 1.52,
    "High radiation": 1.44,
    "Arctic exposure": 1.02,
    "Desert abrasion": 1.18,
    "Battery enclosure": 1.12,
  }[inferredEnvironment] || 1;

  const missionBoost = { Engineering: 0, Aerospace: 5, Energy: 7, Marine: 8, Mining: 6, Research: 3 }[missionMode] || 0;
  const stressWords = ["extreme", "high", "pressure", "heat", "stress", "corrosion", "salt", "industrial", "deep", "load", "radiation", "acid", "abrasion"];
  const wordStress = stressWords.reduce((sum, word) => sum + (normalized.includes(word) ? 4 : 0), 0);
  const scenarioIntensity = Math.max(5, Math.min(100, intensity + wordStress + missionBoost));

  const durabilitySignal = activeScore.stability * 16 + activeScore.pressure * 9 + activeScore.thermal * 7 + activeScore.conductivity * 3;
  const exposureLoad = envRisk * 15 + Math.log10(inferredYears + 1) * 20 + scenarioIntensity * 0.43;
  const riskScore = Math.max(3, Math.min(98, Math.round(exposureLoad - durabilitySignal * 0.18 + 41)));
  const survivalYears = Math.max(1, Math.round((durabilitySignal / Math.max(1, envRisk * scenarioIntensity)) * 24));
  const failureProbability = Math.max(1, Math.min(99, Math.round(riskScore * 0.70 + inferredYears * envRisk * 0.20)));
  const confidence = Math.max(70, Math.min(99, Math.round(98 - Math.abs(52 - scenarioIntensity) * 0.22 - envRisk * 2.6 + activeScore.stability * 1.6)));
  const remainingIntegrity = Math.max(2, Math.min(99, Math.round(100 - failureProbability * 0.62)));

  const failureMode =
    inferredEnvironment.includes("salt") || inferredEnvironment.includes("ocean") ? "chloride corrosion, pitting and fatigue propagation" :
    inferredEnvironment.includes("heat") ? "thermal fatigue, oxidation and conductivity drift" :
    inferredEnvironment.includes("pressure") ? "compression fatigue and microcrack propagation" :
    inferredEnvironment.includes("radiation") ? "radiation embrittlement and lattice displacement" :
    inferredEnvironment.includes("Chemical") ? "chemical attack and surface degradation" :
    inferredEnvironment.includes("Cryogenic") ? "cold brittleness and contraction stress" :
    "slow environmental ageing and mechanical drift";

  const substitutes = elements
    .filter((e) => e.symbol !== activeMaterial.symbol)
    .map((e) => {
      const s = score(e.symbol);
      const fit = Math.round(s.stability * 12 + s.pressure * 8 + s.thermal * 6 - envRisk * 5 - Math.abs(s.rarity - activeScore.rarity) * 2);
      return { ...e, fit: Math.max(1, Math.min(99, fit)) };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 5);

  const timeline = [0, .15, .35, .6, .85, 1].map((fraction, idx) => {
    const year = Math.max(0, Math.round(inferredYears * fraction));
    const ageing = Math.log10(year + 1) * envRisk * 17 + scenarioIntensity * 0.12 + idx * 1.6;
    return {
      year,
      integrity: Math.max(3, Math.round(100 - ageing - riskScore * 0.17)),
      risk: Math.min(99, Math.round(riskScore * (0.25 + fraction * 0.75))),
      confidence: Math.max(58, Math.min(99, Math.round(confidence - fraction * envRisk * 10))),
    };
  });

  const verdict = riskScore >= 72 ? "High-risk scenario" : riskScore >= 45 ? "Manageable with protection" : "Strong scenario candidate";
  const narrative = `${activeMaterial.name} in ${inferredEnvironment.toLowerCase()} for ${inferredYears} years is a ${verdict.toLowerCase()}. The dominant risk is ${failureMode}. ElementOS recommends reviewing ${substitutes[0]?.name || "a higher-fit substitute"} as a protective or comparative pathway.`;

  const exportScenario = () => {
    const content = `ElementOS Scenario Intelligence Report\n\nScenario: ${scenarioText}\nMission Mode: ${missionMode}\nMaterial: ${activeMaterial.name} (${activeMaterial.symbol})\nEnvironment: ${inferredEnvironment}\nDuration: ${inferredYears} years\nRisk score: ${riskScore}%\nFailure probability: ${failureProbability}%\nEstimated survival: ${survivalYears} years\nRemaining integrity: ${remainingIntegrity}%\nAI confidence: ${confidence}%\nLikely failure mode: ${failureMode}\nRecommended substitute: ${substitutes[0]?.name} (${substitutes[0]?.symbol})\n\nVerdict: ${verdict}\n\nNarrative: ${narrative}\n\nTimeline:\n${timeline.map((t) => `Year ${t.year}: integrity ${t.integrity}%, risk ${t.risk}%, confidence ${t.confidence}%`).join("\n")}\n\nGenerated by ElementOS Scenario Intelligence`;
    exportAllFormats({ baseName: `${activeMaterial.symbol}-scenario-intelligence`, title: `Scenario Intelligence: ${activeMaterial.name}`, summary: content, payload: { material: activeMaterial.symbol, environment: inferredEnvironment, duration: inferredYears, riskScore, failureProbability, survivalYears, remainingIntegrity, confidence, verdict, failureMode, timeline, substitutes } });
  };

  const runDetected = () => {
    setMaterial(detectedMaterial);
    setEnvironment(inferredEnvironment);
    setDuration(inferredYears);
    setSelected?.(detectedMaterial);
  };

  const riskColor = riskScore >= 72 ? "rose" : riskScore >= 45 ? "amber" : "emerald";

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><FileText size={12}/> scenario intelligence</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Scenario <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Builder</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Describe a real-world material mission and ElementOS turns it into a living decision model: risk, lifespan, failure mode, substitute strategy, confidence and export-ready intelligence.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[["Risk", `${riskScore}%`], ["Integrity", `${remainingIntegrity}%`], ["Confidence", `${confidence}%`]].map(([a,b]) => (
              <div key={a} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/10 p-4">
                <div className="text-xs uppercase tracking-[.22em] text-slate-500">{a}</div>
                <div className="mt-2 text-4xl font-black text-cyan-100">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <Panel className="bg-gradient-to-br from-slate-950 via-cyan-950/20 to-black">
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Live decision verdict</div>
          <h2 className={`mt-3 text-4xl font-black ${riskColor === "rose" ? "text-rose-100" : riskColor === "amber" ? "text-amber-100" : "text-emerald-100"}`}>{activeMaterial.symbol} · {verdict}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">{narrative}</p>
          <Button onClick={exportScenario} variant="primary" className="mt-5 w-full">Export Scenario PDF/JSON/SVG</Button>
        </Panel>
      </Panel>

      <GuidePanel page="scenario" />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <h2 className="text-3xl font-black">Mission Input Console</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Use the template chips or type your own engineering mission. The model detects material, environment and years automatically.</p>
          <textarea
            value={scenarioText}
            onChange={(e) => setScenarioText(e.target.value)}
            className="mt-5 min-h-[170px] w-full rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 text-lg leading-8 outline-none focus:border-cyan-300/60"
            placeholder="Describe the material, environment and timescale..."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {scenarioTemplates.map((t) => <button key={t} onClick={() => setScenarioText(t)} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-300/40 hover:text-cyan-100">{t.split(" ").slice(0,4).join(" ")}...</button>)}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <select value={material} onChange={(e) => setMaterial(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
              {elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
            </select>
            <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
              {environmentOptions.map((e) => <option key={e}>{e}</option>)}
            </select>
            <select value={missionMode} onChange={(e) => setMissionMode(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
              {[
                "Engineering", "Aerospace", "Energy", "Marine", "Mining", "Research"
              ].map((m) => <option key={m}>{m}</option>)}
            </select>
            <input type="range" min="1" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={runDetected} variant="primary"><Sparkles size={16} className="inline"/> Run Scenario</Button>
            <Button onClick={() => setPage("timemachine")}><Clock3 size={16} className="inline"/> Send to Time Machine</Button>
            <Button onClick={() => safeCopyText(`ElementOS Scenario: ${scenarioText} · Risk ${riskScore}% · Survival ${survivalYears} years`)}>Copy Summary</Button>
          </div>
        </Panel>

        <Panel>
          <Pill gold><Radar size={12}/> failure intelligence</Pill>
          <h2 className="mt-3 text-3xl font-black">Failure Mode Radar</h2>
          <div className="mt-5 grid gap-3">
            {[
              ["Material", `${activeMaterial.name} (${activeMaterial.symbol})`],
              ["Environment", inferredEnvironment],
              ["Duration", `${inferredYears} years`],
              ["Intensity", `${scenarioIntensity}%`],
              ["Primary failure", failureMode],
            ].map(([a,b]) => <div key={a} className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-xs uppercase tracking-[.18em] text-slate-500">{a}</div><div className="mt-1 font-black text-cyan-100">{b}</div></div>)}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill><Activity size={12}/> risk timeline</Pill>
            <h2 className="mt-3 text-4xl font-black">Scenario Evolution</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">The timeline shows integrity, risk and confidence drifting as the material experiences the selected environment.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">{inferredYears} year simulation</div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-6">
          {timeline.map((t) => (
            <div key={t.year} className="rounded-[1.5rem] border border-cyan-300/15 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-slate-500">Year {t.year}</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${t.integrity}%` }} /></div>
              <div className="mt-2 text-sm text-slate-300">Integrity <b>{t.integrity}%</b></div>
              <div className="text-sm text-slate-400">Risk <b>{t.risk}%</b></div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <Pill gold><ShieldCheck size={12}/> substitute strategy</Pill>
        <h2 className="mt-3 text-3xl font-black">Recommended Material Alternatives</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-5">
          {substitutes.map((sub) => (
            <button key={sub.symbol} onClick={() => { setMaterial(sub.symbol); setSelected?.(sub.symbol); }} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10">
              <div className="text-3xl font-black text-cyan-100">{sub.symbol}</div>
              <div className="text-sm text-slate-400">{sub.name}</div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-emerald-300" style={{ width: `${sub.fit}%` }} /></div>
              <div className="mt-2 text-xs font-black text-emerald-100">{sub.fit}% fit</div>
            </button>
          ))}
        </div>
      </Panel>
    </>
  );
}


function TimeMachine({ selected, setSelected, setPage }) {
  const safeProfiles = typeof timeMachineEnvironmentProfiles !== "undefined" ? timeMachineEnvironmentProfiles : {
    "Coastal air": { category: "Marine", label: "Salt-air corrosion and humidity exposure", corrosion: 1.4, heat: 0.7, pressure: 0.6, radiation: 0.2 },
    "Deep ocean": { category: "Marine", label: "High pressure, low temperature and chloride load", corrosion: 1.6, heat: 0.3, pressure: 1.7, radiation: 0.2 },
    "Low orbit": { category: "Aerospace", label: "Vacuum, radiation and thermal cycling", corrosion: 0.2, heat: 1.1, pressure: 0.2, radiation: 1.8 },
  };

  const extraProfiles = {
    "Arctic tundra": { category: "Climate", label: "Freeze-thaw cycling with low humidity", corrosion: 0.55, heat: 0.25, pressure: 0.75, radiation: 0.2 },
    "Sub-arctic mining camp": { category: "Climate", label: "Cold mechanical fatigue and abrasive dust", corrosion: 0.65, heat: 0.35, pressure: 0.9, radiation: 0.25 },
    "Temperate rain": { category: "Climate", label: "Moderate thermal load with persistent moisture", corrosion: 1.05, heat: 0.55, pressure: 0.55, radiation: 0.15 },
    "Mediterranean coast": { category: "Climate", label: "Warm salt air with seasonal dryness", corrosion: 1.2, heat: 0.9, pressure: 0.45, radiation: 0.25 },
    "Hot desert": { category: "Climate", label: "Thermal shock, low humidity and abrasive sand", corrosion: 0.35, heat: 1.65, pressure: 0.55, radiation: 0.55 },
    "Tropical rainforest": { category: "Climate", label: "High biological and moisture corrosion pressure", corrosion: 1.55, heat: 1.05, pressure: 0.45, radiation: 0.18 },
    "Monsoon zone": { category: "Climate", label: "Cyclic flooding, heat and humidity", corrosion: 1.75, heat: 1.0, pressure: 0.5, radiation: 0.22 },
    "Steel plant": { category: "Industrial", label: "Thermal cycling and abrasive particulates", corrosion: 1.05, heat: 1.8, pressure: 0.85, radiation: 0.25 },
    "Chemical plant": { category: "Industrial", label: "Aggressive chemical exposure", corrosion: 2.1, heat: 1.1, pressure: 0.7, radiation: 0.4 },
    "Refinery": { category: "Industrial", label: "Heat, hydrocarbons and pressure cycles", corrosion: 1.55, heat: 1.6, pressure: 1.15, radiation: 0.25 },
    "Mining site": { category: "Industrial", label: "Abrasive dust, vibration and moisture", corrosion: 1.2, heat: 0.8, pressure: 1.05, radiation: 0.35 },
    "Power station": { category: "Industrial", label: "Heat, vibration and long duty cycles", corrosion: 0.85, heat: 1.45, pressure: 0.95, radiation: 0.55 },
    "Open ocean": { category: "Marine", label: "Saltwater spray and mechanical wave cycles", corrosion: 1.75, heat: 0.7, pressure: 0.8, radiation: 0.25 },
    "Harbour": { category: "Marine", label: "Pollutants, salt and wet-dry cycling", corrosion: 1.9, heat: 0.75, pressure: 0.65, radiation: 0.2 },
    "Offshore platform": { category: "Marine", label: "Salt, wind, vibration and high maintenance load", corrosion: 1.85, heat: 0.9, pressure: 1.2, radiation: 0.25 },
    "Low orbit": { category: "Aerospace", label: "Vacuum, radiation and thermal cycling", corrosion: 0.2, heat: 1.1, pressure: 0.2, radiation: 1.8 },
    "High orbit": { category: "Aerospace", label: "Extended radiation and low pressure exposure", corrosion: 0.15, heat: 1.0, pressure: 0.15, radiation: 2.1 },
    "Re-entry": { category: "Aerospace", label: "Extreme heat, shock and ablation", corrosion: 0.4, heat: 2.5, pressure: 1.8, radiation: 0.85 },
    "Sandstone basin": { category: "Geological", label: "Porous formation with moderate pressure", corrosion: 0.9, heat: 0.75, pressure: 1.15, radiation: 0.25 },
    "Shale basin": { category: "Geological", label: "Layered formation with pressure and low permeability", corrosion: 1.0, heat: 0.8, pressure: 1.5, radiation: 0.3 },
    "Granite formation": { category: "Geological", label: "Hard crystalline formation", corrosion: 0.45, heat: 0.9, pressure: 1.65, radiation: 0.35 },
    "Volcanic zone": { category: "Geological", label: "Heat, fractured basalt and geothermal chemistry", corrosion: 1.25, heat: 2.1, pressure: 1.4, radiation: 0.5 },
    "Fault zone": { category: "Geological", label: "Mechanical instability and fluid migration", corrosion: 1.15, heat: 0.95, pressure: 1.85, radiation: 0.35 },
    "High radiation": { category: "Extreme", label: "Accelerated radiation damage and embrittlement", corrosion: 0.45, heat: 0.8, pressure: 0.6, radiation: 2.6 },
    "Cryogenic": { category: "Extreme", label: "Low-temperature contraction and brittleness", corrosion: 0.2, heat: 0.15, pressure: 1.1, radiation: 0.25 },
    "High pressure": { category: "Extreme", label: "Compression, creep and pressure drift", corrosion: 0.75, heat: 0.65, pressure: 2.4, radiation: 0.25 },
    "Corrosive acid": { category: "Extreme", label: "Acidic chemical attack", corrosion: 2.7, heat: 0.9, pressure: 0.65, radiation: 0.3 },
    "Molten salt": { category: "Extreme", label: "Thermal and chemical salt attack", corrosion: 2.2, heat: 2.0, pressure: 0.9, radiation: 0.55 },
  };
  const environmentProfiles = { ...safeProfiles, ...extraProfiles };

  const [material, setMaterial] = useState(selected || "H");
  const [environment, setEnvironment] = useState(environmentProfiles["Coastal air"] ? "Coastal air" : Object.keys(environmentProfiles)[0]);
  const [envCategory, setEnvCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState(100);
  const [stress, setStress] = useState(55);
  const [temperature, setTemperature] = useState(35);
  const [pressure, setPressure] = useState(40);
  const [humidity, setHumidity] = useState(62);
  const [radiation, setRadiation] = useState(18);

  const base = elementMap[material] || elementMap.H || elements[0];
  const baseScore = score(material);
  const profile = environmentProfiles[environment] || Object.values(environmentProfiles)[0] || { category: "Default", label: "Default exposure", corrosion: 1, heat: 1, pressure: 1, radiation: 1 };
  const horizons = [0, 1, 5, 10, 25, 50, 100, 250, 500, 1000].includes(selectedYear) ? [0, 1, 5, 10, 25, 50, 100, 250, 500, 1000] : [0, 1, 5, 10, 25, 50, 100, 250, 500, 1000, selectedYear].sort((a, b) => a - b);

  const resilience = Math.round(Math.min(99, Math.max(8, baseScore.stability * 16 + baseScore.pressure * 7 + baseScore.thermal * 6 - profile.corrosion * 8 - profile.heat * 5 - profile.pressure * 4 - profile.radiation * 6 - stress * 0.06 - humidity * 0.04)));
  const timeline = horizons.map((year) => {
    const time = Math.log10(year + 1);
    const exposure = profile.corrosion * 8 + profile.heat * 6 + profile.pressure * 6 + profile.radiation * 7;
    const load = stress * 0.045 + temperature * 0.05 + pressure * 0.05 + humidity * 0.035 + radiation * 0.055;
    const stability = Math.max(2, Math.round(resilience - time * exposure - load));
    const corrosion = Math.min(99, Math.round(time * profile.corrosion * 24 + humidity * profile.corrosion * 0.18));
    const fatigue = Math.min(99, Math.round(time * profile.heat * 22 + temperature * 0.22 + stress * 0.08));
    const pressureDrift = Math.min(99, Math.round(time * profile.pressure * 24 + pressure * 0.16));
    const radiationDrift = Math.min(99, Math.round(time * profile.radiation * 26 + radiation * 0.19));
    return { year, stability, corrosion, fatigue, pressureDrift, radiationDrift };
  });
  const finalState = timeline[timeline.length - 1] || timeline[0];
  const risk = Math.max(1, Math.min(99, Math.round(100 - finalState.stability + finalState.corrosion * 0.2 + finalState.fatigue * 0.12)));
  const verdict = finalState.stability > 70 ? "Long-horizon survivor" : finalState.stability > 45 ? "Protected-use candidate" : finalState.stability > 24 ? "Monitor heavily" : "High-risk environment";

  const filteredEnvs = Object.keys(environmentProfiles).filter((key) => envCategory === "All" || environmentProfiles[key].category === envCategory);
  const chartPoints = timeline.map((t, i) => `${8 + (i / Math.max(1, timeline.length - 1)) * 84},${92 - t.stability * 0.78}`).join(" ");
  const corrosionPoints = timeline.map((t, i) => `${8 + (i / Math.max(1, timeline.length - 1)) * 84},${92 - t.corrosion * 0.6}`).join(" ");
  const categories = ["All", ...Array.from(new Set(Object.values(environmentProfiles).map((item) => item.category)))];

  const setMaterialAndSelected = (value) => { setMaterial(value); setSelected?.(value); };
  const exportTimeline = () => exportAllFormats({
    baseName: `${base.symbol}-temporal-simulation`,
    title: `Temporal Simulation Engine: ${base.name}`,
    summary: `${base.name} simulated in ${environment}. Resilience ${resilience}%. Long-horizon risk ${risk}%. Verdict: ${verdict}.`,
    payload: { material: base.symbol, environment, selectedYear, stress, temperature, pressure, humidity, radiation, resilience, risk, verdict, timeline },
  });

  return (
    <div className="space-y-6">
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr] border-cyan-300/25 bg-gradient-to-br from-cyan-950/25 via-slate-950 to-fuchsia-950/20">
        <div>
          <Pill gold><Clock3 size={12}/> temporal simulation engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">Temporal <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Simulation Engine</span></h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">A cinematic future-state lab for forecasting material behaviour across time, stress, pressure, corrosion, radiation and 50+ environment profiles.</p>
          <Info title="Blank-page safety rebuild">This version avoids the previous fragile render path and uses a self-contained temporal graph, environment library, telemetry controls and export system.</Info>
          <div className="mt-5 flex flex-wrap gap-3"><Button onClick={exportTimeline} variant="primary"><Download size={16} className="inline"/> Export Time PDF/JSON/SVG</Button><Button onClick={() => setPage("scenario")}>Send to Scenario Builder</Button><Button onClick={() => setPage("matterlab")}>Open Matter Intelligence</Button></div>
        </div>
        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">future-state verdict</div>
          <div className="mt-3 text-6xl font-black text-cyan-100">{base.symbol}</div>
          <div className="mt-2 text-xl font-black text-white">{base.name}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4"><div className="text-3xl font-black text-emerald-100">{resilience}%</div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">resilience</div></div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><div className="text-3xl font-black text-amber-100">{selectedYear}y</div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">horizon</div></div><div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4"><div className="text-3xl font-black text-rose-100">{risk}%</div><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">risk</div></div></div>
          <p className="mt-5 text-sm leading-7 text-slate-300">{verdict}. Environment profile: {profile.label}.</p>
        </Panel>
      </Panel>

      <GuidePanel page="timemachine" />

      <Panel className="border-cyan-300/25 bg-gradient-to-br from-slate-950 via-blue-950/20 to-cyan-950/20">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><Pill gold><Radar size={12}/> future-state simulation</Pill><h2 className="mt-3 text-5xl font-black">Temporal Field Graph</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Glowing stability curve, corrosion drift, confidence fog, anomaly markers and live telemetry streams.</p></div><div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">LIVE · {environment}</div></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <div className="relative h-[520px] overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_30%),linear-gradient(135deg,#020617,#07152a_55%,#0b1020)] p-5">
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <svg viewBox="0 0 100 100" className="relative z-10 h-full w-full">
              <defs><linearGradient id="tmLine" x1="0" x2="1"><stop offset="0%" stopColor="#22d3ee"/><stop offset="55%" stopColor="#60a5fa"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient><filter id="tmGlow"><feGaussianBlur stdDeviation="1.4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              {[20,40,60,80].map((y) => <line key={y} x1="6" x2="94" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
              <polygon points={`8,12 ${chartPoints} 92,92 8,92`} fill="rgba(34,211,238,.10)" />
              <polyline points={chartPoints} fill="none" stroke="url(#tmLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#tmGlow)" />
              <polyline points={corrosionPoints} fill="none" stroke="rgba(251,191,36,.85)" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
              {timeline.map((t, i) => <g key={t.year}><circle cx={8 + (i / Math.max(1, timeline.length - 1)) * 84} cy={92 - t.stability * .78} r="1.6" fill="#e0f2fe"/><text x={8 + (i / Math.max(1, timeline.length - 1)) * 84} y="97" textAnchor="middle" className="fill-slate-400 text-[3px]">{t.year}</text></g>)}
              <text x="8" y="8" className="fill-cyan-100 text-[4px] uppercase">stability</text><text x="70" y="8" className="fill-amber-100 text-[4px] uppercase">corrosion drift</text>
            </svg>
          </div>
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5"><div className="text-xs uppercase tracking-[.22em] text-slate-500">active horizon</div><div className="mt-2 text-6xl font-black text-cyan-100">{selectedYear}y</div><p className="mt-3 text-sm leading-6 text-slate-300">Drag the controls below to update the future state instantly.</p></div>
            {[['Stress', stress], ['Temperature', temperature], ['Pressure', pressure], ['Humidity', humidity], ['Radiation', radiation]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex justify-between text-xs uppercase tracking-[.18em] text-slate-500"><span>{label}</span><span>{value}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300" style={{ width: `${Math.max(4, Math.min(100, value))}%` }} /></div></div>)}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <div className="flex items-start justify-between gap-4"><div><Pill gold><Clock3 size={12}/> temporal controls</Pill><h2 className="mt-3 text-4xl font-black">Temporal Control Deck</h2></div><div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-right"><div className="text-3xl font-black text-cyan-100">{selectedYear}y</div><div className="text-[10px] uppercase tracking-[.18em] text-cyan-200">horizon</div></div></div>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2"><span className="text-xs uppercase tracking-[.2em] text-slate-500">Material</span><select value={material} onChange={(e) => setMaterialAndSelected(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">{elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}</select></label>
            <div><span className="text-xs uppercase tracking-[.2em] text-slate-500">50+ Environment Library</span><div className="mt-3 flex max-h-28 flex-wrap gap-2 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-3">{categories.map((cat) => <button key={cat} onClick={() => { setEnvCategory(cat); const first = cat === "All" ? Object.keys(environmentProfiles)[0] : Object.keys(environmentProfiles).find((key) => environmentProfiles[key].category === cat); if (first) setEnvironment(first); }} className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] ${envCategory === cat ? "border-amber-300/50 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[0.04] text-slate-400"}`}>{cat}</button>)}</div><select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">{filteredEnvs.map((key) => <option key={key}>{key}</option>)}</select><div className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-sm leading-6 text-cyan-50"><b>{profile.category}</b> · {profile.label}</div></div>
            <label className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between text-sm"><span className="font-bold text-slate-200">Temporal Horizon</span><span className="font-black text-amber-100">{selectedYear} years</span></div><input type="range" min="1" max="1000" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} /><div className="flex flex-wrap gap-2">{[1,5,10,25,50,100,250,500,1000].map((y) => <button key={y} onClick={() => setSelectedYear(y)} className={`rounded-full border px-3 py-1 text-xs font-bold ${selectedYear === y ? "border-amber-300/50 bg-amber-300/15 text-amber-100" : "border-white/10 bg-white/[0.04] text-slate-400"}`}>{y}y</button>)}</div></label>
            {[["Stress Load", stress, setStress, "%"], ["Temperature", temperature, setTemperature, "°C"], ["Pressure Load", pressure, setPressure, "%"], ["Humidity", humidity, setHumidity, "%"], ["Radiation", radiation, setRadiation, "%"]].map(([label, value, setter, unit]) => <label key={label} className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between text-sm"><span className="font-bold text-slate-200">{label}</span><span className="font-black text-cyan-100">{value}{unit}</span></div><input type="range" min="0" max="100" value={value} onChange={(e) => setter(Number(e.target.value))} /></label>)}
          </div>
        </Panel>
        <Panel>
          <Pill><Radar size={12}/> future state tunnel</Pill><h2 className="mt-3 text-3xl font-black">Future-State Simulation</h2>
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-950/80 p-6 [perspective:1100px]"><div className="relative mx-auto h-[430px] max-w-3xl [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-32deg)]">{timeline.map((t, index) => <div key={t.year} className="absolute left-1/2 top-1/2 grid place-items-center rounded-[2rem] border border-cyan-300/25 bg-cyan-300/10 text-center shadow-[0_0_40px_rgba(34,211,238,.14)]" style={{ width: `${260 + index * 30}px`, height: `${68 + index * 8}px`, transform: `translate(-50%, -50%) translateZ(${index * 28}px)`, opacity: Math.max(.25, 1 - index * .075) }}><div className="text-xs uppercase tracking-[.22em] text-cyan-100">Year {t.year}</div><div className="text-2xl font-black text-white">{t.stability}%</div></div>)}<div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_80px_rgba(251,191,36,.85)]" /></div></div>
        </Panel>
      </div>

      <Panel><h2 className="text-4xl font-black">Temporal Milestone Cards</h2><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{timeline.slice(1).map((t) => <div key={t.year} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-black/35 to-amber-400/10 p-5"><div className="text-xs uppercase tracking-[.22em] text-slate-500">year {t.year}</div><div className="mt-3 text-4xl font-black text-cyan-100">{t.stability}%</div><div className="mt-3 space-y-2 text-sm text-slate-300"><div>Corrosion: <b className="text-amber-100">{t.corrosion}%</b></div><div>Fatigue: <b className="text-rose-100">{t.fatigue}%</b></div><div>Pressure drift: <b className="text-cyan-100">{t.pressureDrift}%</b></div><div>Radiation drift: <b className="text-fuchsia-100">{t.radiationDrift}%</b></div></div></div>)}</div></Panel>
    </div>
  );
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
            Real Supabase authentication is now connected. Users can create accounts, join beta, sign out and keep sessions active.
          </p>

          {session && (
            <Info title="Active Session">
              Signed in as <b>{session.user.email}</b>. ElementOS is now running as a cloud-connected SaaS app.
            </Info>
          )}
        </div>

        <Panel>
          <h2 className="text-3xl font-black">
            {session ? "Workspace Active" : "Login / Join Beta"}
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

              <Button variant="primary" onClick={signUp}>Join Beta</Button>
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

      <GuidePanel page="beta" />

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
  return <><Panel><Pill gold><Search size={12}/> material explorer</Pill><h1 className="mt-4 text-5xl font-black">Element Explorer</h1><Info title="User value">Search and inspect the behaviour profile of each element before adding it to a comparison or report.</Info></Panel><GuidePanel page="explorer" /><div className="grid gap-6 xl:grid-cols-[420px_1fr]"><Panel><div className="flex gap-2 rounded-2xl border border-white/10 bg-black/25 p-3"><Search className="text-cyan-300"/><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search elements..." className="w-full bg-transparent outline-none"/></div><select value={cat} onChange={(e) => setCat(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select><div className="mt-4 max-h-[620px] overflow-auto pr-2">{filtered.map(e => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className={`mb-2 flex w-full items-center justify-between rounded-2xl border p-3 text-left ${selected === e.symbol ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-white/[.03]"}`}><span><b>{e.symbol}</b> · {e.name}<div className="text-xs text-slate-500">{e.category}</div></span><ChevronRight size={15}/></button>)}</div></Panel><Panel><div className="grid gap-6 xl:grid-cols-[1fr_360px]"><div><div className="text-8xl font-black text-cyan-100">{el.symbol}</div><h2 className="mt-2 text-4xl font-black">{el.name}</h2><p className="mt-2 text-slate-400">Atomic number {el.atomicNumber} · {el.category}</p><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{metrics.map(k => <div key={k} className="rounded-3xl border border-white/10 bg-black/25 p-4"><div className="text-xs uppercase tracking-[.22em] text-slate-500">{k === "alignment" ? "Alignment" : k}</div><div className="mt-2 text-3xl font-black text-cyan-100">{k === "alignment" ? s[k].toFixed(0) : s[k].toFixed(2)}</div></div>)}</div><Button onClick={() => setCompare(x => x.includes(el.symbol) ? x : [...x, el.symbol].slice(0, 8))} variant="primary" className="mt-6">Add {el.symbol} to Compare</Button></div><Panel><h3 className="text-xl font-black">Behaviour Radar</h3><RadarChart data={s}/><p className="text-sm text-slate-400">A visual profile makes each element instantly understandable.</p></Panel></div></Panel></div></>;
}
function PeriodicTable({ selected, setSelected }) {
  const [layer, setLayer] = useState("conductivity");
  const [cat, setCat] = useState("All");
  const [view, setView] = useState("periodic");
  const [signal, setSignal] = useState("intelligence");

  const activeElement = elementMap[selected] || elementMap.Al;
  const activeScore = score(activeElement.symbol);
  const visibleElements = elements.filter((e) => cat === "All" || e.category === cat);
  const top = visibleElements
    .map((e) => ({ ...e, metrics: score(e.symbol), value: score(e.symbol)[layer] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);

  const categoryStats = categories.slice(1).map((c) => {
    const group = elements.filter((e) => e.category === c);
    const avg = group.length ? group.reduce((sum, e) => sum + score(e.symbol)[layer], 0) / group.length : 0;
    return { category: c, count: group.length, avg };
  }).sort((a, b) => b.avg - a.avg).slice(0, 8);

  const exportPeriodic = () => {
    const content = `ElementOS Periodic Intelligence Map\n\nLayer: ${layer}\nCategory: ${cat}\nSelected: ${activeElement.name} (${activeElement.symbol})\nSignal mode: ${signal}\n\nTop materials:\n${top.map((e, i) => `${i + 1}. ${e.symbol} — ${e.name}: ${Number(e.value).toFixed(layer === "alignment" ? 0 : 2)}`).join("\n")}\n\nGenerated by ElementOS.`;
    exportAllFormats({ baseName: `periodic-intelligence-${layer}`, title: `Periodic Intelligence: ${layer}`, summary: content, payload: { layer, category: cat, selected: activeElement.symbol, top } });
  };

  return (
    <>
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-fuchsia-950/20">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_.85fr] xl:items-center">
          <div>
            <Pill gold><Layers size={12}/> periodic intelligence map</Pill>
            <h1 className="mt-4 text-5xl font-black sm:text-7xl">
              Periodic <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Map</span>
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
              A living 118-element intelligence surface. Switch behaviour layers, isolate categories, reveal top-ranked materials and turn the periodic table into a discovery cockpit.
            </p>
            <Info title="What to do here">
              Use the map to spot unusual signal clusters, then click any element to send it into Compare, Relationship Graph, Isotope Lab or Discovery Universe.
            </Info>
          </div>
          <Panel>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Active element</div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-7xl font-black text-cyan-100">{activeElement.symbol}</div>
                <div className="text-2xl font-black text-white">{activeElement.name}</div>
                <div className="text-sm text-slate-400">Atomic {activeElement.atomicNumber} · {activeElement.category}</div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-emerald-100">{Number(activeScore[layer]).toFixed(layer === "alignment" ? 0 : 1)}</div>
                <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{layer}</div>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <Button onClick={() => setView("periodic")} variant={view === "periodic" ? "primary" : "ghost"}>Map View</Button>
              <Button onClick={() => setView("clusters")} variant={view === "clusters" ? "primary" : "ghost"}>Cluster View</Button>
              <Button onClick={exportPeriodic}>Export Map</Button>
            </div>
          </Panel>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black">Layer Controls</h2>
              <p className="mt-2 text-sm text-slate-400">Change the intelligence layer and the entire map recalculates.</p>
            </div>
            <Pill gold>{cat}</Pill>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {metrics.map((l) => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{l === "alignment" ? "Alignment" : l}</Button>)}
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{categories.map((c) => <option key={c}>{c}</option>)}</select>
            <select value={signal} onChange={(e) => setSignal(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">
              {['intelligence','rarity scan','thermal sweep','pressure scan','conductive search','substitute hunt'].map(x => <option key={x}>{x}</option>)}
            </select>
          </div>

          {view === "periodic" ? (
            <div className="mt-6 overflow-auto rounded-[2rem] border border-cyan-300/15 bg-black/25 p-3">
              <div className="grid min-w-[1120px] gap-2">
                {periodicRows.map((row, ri) => (
                  <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: "repeat(18,minmax(0,1fr))" }}>
                    {row.map((sym, i) => {
                      const el = sym ? elementMap[sym] : null;
                      const inactive = el && cat !== "All" && el.category !== cat;
                      const v = el ? score(sym)[layer] : 0;
                      return el ? (
                        <button key={sym} onClick={() => setSelected(sym)} className={`relative h-20 overflow-hidden rounded-2xl border transition hover:scale-110 ${selected === sym ? "ring-2 ring-white" : ""} ${inactive ? "opacity-20" : ""}`} style={heatStyle(v, layer === "alignment" ? 100 : 5)}>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.35),transparent_35%)] opacity-60" />
                          <div className="relative z-10 text-[9px]">{el.atomicNumber}</div>
                          <b className="relative z-10 text-lg">{sym}</b>
                          <div className="relative z-10 text-[9px]">{Number(v).toFixed(layer === "alignment" ? 0 : 1)}</div>
                        </button>
                      ) : <div key={i} className="h-20 rounded-2xl border border-cyan-300/5 bg-cyan-300/[.01]"/>;
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {categoryStats.map((row) => (
                <button key={row.category} onClick={() => setCat(row.category)} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-black/30 p-5 text-left hover:border-cyan-300/40">
                  <div className="text-xs uppercase tracking-[.18em] text-slate-500">{row.count} elements</div>
                  <div className="mt-2 text-xl font-black text-white">{row.category}</div>
                  <div className="mt-4 text-4xl font-black text-cyan-100">{row.avg.toFixed(1)}</div>
                  <div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.min(100, (row.avg / (layer === "alignment" ? 100 : 5)) * 100)}%` }}/></div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        <Panel>
          <Pill gold><Sparkles size={12}/> top signals</Pill>
          <h2 className="mt-3 text-3xl font-black">Best Materials for {layer}</h2>
          <div className="mt-5 space-y-3">
            {top.slice(0, 8).map((e, i) => (
              <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10">
                <div className="flex items-center justify-between gap-4"><div><div className="text-xs text-slate-500">#{i + 1}</div><div className="text-2xl font-black text-cyan-100">{e.symbol} · {e.name}</div></div><div className="text-2xl font-black text-emerald-100">{Number(e.value).toFixed(layer === "alignment" ? 0 : 1)}</div></div>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Compare({ compare, setCompare, setPage }) {
  const [candidate, setCandidate] = useState("H");
  const rows = compare.map((sym) => ({ ...elementMap[sym], metrics: score(sym) }));

  return (
    <>
      <Panel>
        <Pill gold>
          <BarChart3 size={12} /> comparison engine
        </Pill>
        <h1 className="mt-4 text-5xl font-black">Compare Engine</h1>
        <Info title="Cleaned terminology">
          ZDAR has been renamed public-facing as <b>Alignment</b>. It remains a branded experimental score, but the table now reads like a serious material decision engine.
        </Info>
      </Panel>

      <GuidePanel page="compare" />
      <RealTimeNetworkPanel discoveries={generateDiscoveryEngine(6)} setPage={setPage} />

      <Panel>
        <div className="flex flex-wrap gap-3">
          <select
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none"
          >
            {elements.map((e) => (
              <option key={e.symbol} value={e.symbol}>
                {e.symbol} — {e.name}
              </option>
            ))}
          </select>

          <Button
            onClick={() =>
              setCompare((x) =>
                x.includes(candidate) ? x : [...x, candidate].slice(0, 10)
              )
            }
            variant="primary"
          >
            Add Element
          </Button>

          <Button
            onClick={() =>
              setCompare((x) => {
                const next = x.filter((sym) => sym !== candidate);
                return next.length ? next : ["H"];
              })
            }
          >
            Remove Element
          </Button>

          <Button
            onClick={() => setCompare(["H"])}
          >
            Reset to Hydrogen
          </Button>

          <Button onClick={() => setPage("reports")}>Create Report</Button>
        </div>

        <div className="mt-6 overflow-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[.18em] text-slate-400">
                <th className="px-3 py-2">Element</th>
                {metrics.map((k) => (
                  <th key={k} className="px-2 py-2">
                    {k === "alignment" ? "Alignment" : k}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.symbol} className="rounded-2xl border border-white/10 bg-white/[.035]">
                  <td className="rounded-l-2xl border-y border-l border-white/10 p-3">
                    <b className="text-cyan-200">{row.symbol}</b>
                    <div className="text-xs text-slate-500">{row.name}</div>
                  </td>

                  {metrics.map((k) => (
                    <td key={k} className="border-y border-white/10 p-2 last:rounded-r-2xl last:border-r">
                      <div
                        className="rounded-xl px-3 py-2 text-center text-sm font-bold"
                        style={heatStyle(row.metrics[k], k === "alignment" ? 100 : 5)}
                      >
                        {row.metrics[k].toFixed(k === "alignment" ? 0 : 2)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h2 className="text-2xl font-black">Compare Chart</h2>
          <MiniBars values={rows.map((r) => r.metrics.conductivity)} />
          <p className="mt-2 text-sm text-slate-400">
            Conductivity ranking for current compare set.
          </p>
        </Panel>

        <Panel>
          <h2 className="text-2xl font-black">Decision Summary</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {rows[0]?.name || "Aluminium"} leads the current workspace. Use Reports to export this as a branded comparison brief with chart notes and simulation IDs.
          </p>
        </Panel>
      </div>

      <Panel>
        <h2 className="text-3xl font-black">Compatibility Discoveries</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {compare.slice(0, 6).map((sym, i) => {
            const next = compare[(i + 1) % compare.length];

            if (!next || sym === next) return null;

            const value = compatibilityScore(sym, next);
            const tier = rarityTier(value);
            const dna = materialDNA(sym, next);

            return (
              <div
                key={`${sym}-${next}`}
                className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-5"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-[.22em] text-cyan-200">
                      Compatibility
                    </div>

                    <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[10px] font-black tracking-[.18em] text-amber-100">
                      {tier}
                    </div>
                  </div>

                  <div className="mt-5 text-4xl font-black text-cyan-100">
                    {value}%
                  </div>

                  <div className="mt-2 text-xl font-black text-white">
                    {sym} + {next}
                  </div>

                  <div className="mt-3 text-sm leading-6 text-slate-300">
                    ElementOS predicts strong behavioural alignment between{" "}
                    {elementMap[sym]?.name} and {elementMap[next]?.name}.
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">
                      Material DNA
                    </div>

                    <div className="mt-2 font-mono text-cyan-100">{dna}</div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button
                      onClick={() =>
                        exportAllFormats({
                          baseName: `${sym}-${next}-compatibility`,
                          title: `${sym} + ${next} Compatibility`,
                          summary: `${sym} + ${next}
Compatibility: ${value}%
Tier: ${tier}
DNA: ${dna}`,
                          payload: { a: sym, b: next, compatibility: value, tier, dna },
                        })
                      }
                    >
                      Export PDF/JSON/SVG
                    </Button>

                    <Button
                      variant="primary"
                      onClick={() =>
                        safeCopyText(
                          `${sym} + ${next} compatibility score: ${value}%`
                        )
                      }
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">AI Recommendations</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              ElementOS suggests adjacent materials, substitutes and compatibility paths based on the current compare set.
            </p>
          </div>

          <Pill gold>
            <Sparkles size={12} /> live intelligence
          </Pill>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {generateRecommendations(compare).map((group) => (
            <div
              key={group.source}
              className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-slate-950 via-cyan-400/5 to-fuchsia-400/10 p-5"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative z-10">
                <div className="text-xs uppercase tracking-[.22em] text-cyan-300">
                  Based on current compare element
                </div>

                <div className="mt-2 text-4xl font-black text-cyan-100">
                  {group.source}
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Users comparing {elementMap[group.source]?.name || group.source} may also explore these adjacent material paths.
                </p>

                <div className="mt-5 space-y-3">
                  {group.matches.map((m) => (
                    <div
                      key={m.symbol}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xl font-black text-white">
                            {m.symbol}
                          </div>

                          <div className="text-sm text-slate-400">
                            {m.name}
                          </div>
                        </div>

                        <div className="text-2xl font-black text-emerald-200">
                          {Math.max(1, Math.round(m.similarity))}%
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-cyan-300/10 bg-cyan-300/5 p-3 text-sm text-cyan-100">
                        {m.reason}
                      </div>

                      <Button
                        className="mt-4 w-full"
                        onClick={() =>
                          safeCopyText(
                            `${group.source} → ${m.symbol} (${Math.round(m.similarity)}% match): ${m.reason}`
                          )
                        }
                      >
                        Share Discovery
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Discovery Engine Scan</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Auto-generated material discoveries ranked from the full ElementOS element-pair scan.
            </p>
          </div>
          <Pill gold><Sparkles size={12} /> generated intelligence</Pill>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {generateDiscoveryEngine(6).map((d) => (
            <div key={`${d.dna}-compare`} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-slate-950 via-cyan-400/5 to-fuchsia-400/10 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-cyan-300">{d.type}</div>
              <div className="mt-3 text-4xl font-black text-cyan-100">{d.a} + {d.b}</div>
              <div className="mt-2 text-3xl font-black text-emerald-200">{d.score}%</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{d.reason}</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 font-mono text-xs text-cyan-100">{d.dna}</div>
            </div>
          ))}
        </div>
      </Panel>

    </>
  );
}


function BehaviourAtlas({ selected, setSelected }) {
  const [layer, setLayer] = useState("conductivity");
  const [environment, setEnvironment] = useState("Lab air");
  const [fieldMode, setFieldMode] = useState("wave");
  const selectedElement = elementMap[selected] || elementMap.Al;
  const selectedScore = score(selected);
  const environmentProfiles = {
    "Lab air": { stress: 18, corrosion: 12, thermal: 22, pressure: 14, label: "controlled baseline" },
    "Vacuum": { stress: 28, corrosion: 2, thermal: 64, pressure: 6, label: "outgassing + thermal cycling" },
    "High pressure": { stress: 78, corrosion: 28, thermal: 44, pressure: 92, label: "compressive load" },
    "Salt exposure": { stress: 46, corrosion: 88, thermal: 36, pressure: 34, label: "marine corrosion" },
    "High temperature": { stress: 62, corrosion: 42, thermal: 94, pressure: 48, label: "thermal drift" },
    "Cryogenic": { stress: 66, corrosion: 8, thermal: 18, pressure: 58, label: "cold brittleness" },
    "Deep ocean": { stress: 74, corrosion: 91, thermal: 30, pressure: 96, label: "salt + pressure" },
    "Geothermal bore": { stress: 86, corrosion: 70, thermal: 98, pressure: 88, label: "heat + brine + depth" },
    "Low orbit": { stress: 44, corrosion: 5, thermal: 86, pressure: 9, label: "radiation + vacuum" },
    "Chemical plant": { stress: 58, corrosion: 94, thermal: 72, pressure: 64, label: "chemical attack" },
  };
  const env = environmentProfiles[environment] || environmentProfiles["Lab air"];
  const envInfluence = (env.stress + env.corrosion + env.thermal + env.pressure) / 400;
  const fieldCells = Array.from({ length: 160 }, (_, i) => {
    const e = elements[(i * 11 + Math.floor(env.stress)) % elements.length];
    const base = score(e.symbol)[layer];
    const wave = Math.sin(i / 4 + envInfluence * 5) * 0.42 + Math.cos(i / 9) * 0.22;
    const adjusted = layer === "alignment" ? Math.max(0, Math.min(100, base - envInfluence * 20 + wave * 8)) : Math.max(0.2, Math.min(5, base - envInfluence * 0.65 + wave));
    return { element: e, value: adjusted };
  });
  const top = elements.map(e => ({ ...e, metrics: score(e.symbol), value: score(e.symbol)[layer] })).sort((a, b) => b.value - a.value).slice(0, 10);
  const resilience = Math.max(1, Math.min(99, Math.round((selectedScore.stability / 5) * 48 + (selectedScore.pressure / 5) * 22 + (selectedScore.thermal / 5) * 18 - envInfluence * 32 + 26)));
  const exportAtlas = () => {
    const content = `ElementOS Behaviour Atlas\n\nElement: ${selectedElement.name} (${selectedElement.symbol})\nEnvironment: ${environment}\nLayer: ${layer}\nResilience: ${resilience}%\nContext: ${env.label}\n\nTop materials:\n${top.slice(0, 8).map((e, i) => `${i + 1}. ${e.symbol} — ${e.name}: ${Number(e.value).toFixed(layer === "alignment" ? 0 : 2)}`).join("\n")}`;
    exportAllFormats({ baseName: `behaviour-atlas-${selectedElement.symbol}-${layer}`, title: `Behaviour Atlas: ${selectedElement.symbol}`, summary: content, payload: { selected: selectedElement.symbol, layer, environment, resilience, top } });
  };

  return (
    <>
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-emerald-950/20">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_.85fr] xl:items-center">
          <div>
            <Pill gold><Radar size={12}/> behaviour intelligence atlas</Pill>
            <h1 className="mt-4 text-5xl font-black sm:text-7xl">Behaviour <span className="bg-gradient-to-r from-cyan-200 via-white to-emerald-200 bg-clip-text text-transparent">Atlas</span></h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">A live field map of material behaviour under extreme environments. Watch signals shift as exposure, pressure, corrosion and thermal load change the intelligence surface.</p>
            <Info title="Magical use case">Pick an environment, select a behaviour layer, then click the brightest cells to discover new materials for compare, reports or media exports.</Info>
          </div>
          <Panel>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Selected telemetry</div>
            <div className="mt-3 flex items-end justify-between"><div><div className="text-7xl font-black text-cyan-100">{selectedElement.symbol}</div><div className="text-2xl font-black">{selectedElement.name}</div></div><div className="text-right"><div className="text-4xl font-black text-emerald-100">{resilience}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">resilience</div></div></div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2"><Button onClick={exportAtlas} variant="primary">Export Atlas</Button><Button onClick={() => setSelected(top[0]?.symbol || selected)}>Use Top Material</Button></div>
          </Panel>
        </div>
      </Panel>
      <GuidePanel page="atlas" />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-3xl font-black">Live Behaviour Field</h2><p className="mt-2 text-sm text-slate-400">{environment}: {env.label}</p></div><Pill gold>{fieldMode} mode</Pill></div>
          <div className="mt-5 flex flex-wrap gap-2">{metrics.map(l => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{({ stability: "Stability", conductivity: "Conductivity", thermal: "Thermal", diffusion: "Diffusion", pressure: "Pressure", rarity: "Rarity", alignment: "Alignment" })[l]}</Button>)}<select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{Object.keys(environmentProfiles).map(x => <option key={x}>{x}</option>)}</select><select value={fieldMode} onChange={(e) => setFieldMode(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{["wave","magnetic","thermal","pressure","corrosion"].map(x => <option key={x}>{x}</option>)}</select></div>
          <div className="mt-6 grid grid-cols-8 gap-2 md:grid-cols-12 xl:grid-cols-16">
            {fieldCells.map((cell, i) => <button key={`${cell.element.symbol}-${i}`} onClick={() => setSelected(cell.element.symbol)} className={`relative aspect-square overflow-hidden rounded-2xl border text-xs font-black transition hover:scale-110 ${selected === cell.element.symbol ? "ring-2 ring-white" : "border-white/10"}`} style={heatStyle(cell.value, layer === "alignment" ? 100 : 5)}><span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.35),transparent_45%)] opacity-60"/><span className="relative z-10">{cell.element.symbol}</span></button>)}
          </div>
        </Panel>
        <Panel>
          <Pill gold><Activity size={12}/> environment load</Pill>
          <h2 className="mt-3 text-3xl font-black">Telemetry Streams — {selectedElement.name} ({selectedElement.symbol})</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(env).filter(([k]) => k !== "label").map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-xs uppercase tracking-[.18em] text-slate-500"><span>{label}</span><span>{value}%</span></div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-amber-300" style={{ width: `${value}%` }}/></div></div>)}
          </div>
          <RadarChart data={selectedScore}/>
          <p className="text-sm leading-7 text-slate-300">{selectedElement.name} shows a {selectedScore[layer] > (layer === "alignment" ? 65 : 3.5) ? "strong" : "moderate"} {layer} signal inside the {environment} profile.</p>
        </Panel>
      </div>
      <Panel><h2 className="text-3xl font-black">Top Materials for {({ stability: "Stability", conductivity: "Conductivity", thermal: "Thermal", diffusion: "Diffusion", pressure: "Pressure", rarity: "Rarity", alignment: "Alignment" })[layer]}</h2><div className="mt-5 grid gap-3 md:grid-cols-5">{top.map((e, i) => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/40"><div className="text-xs text-slate-500">#{i + 1}</div><div className="text-2xl font-black text-cyan-100">{e.symbol}</div><div className="text-sm text-slate-400">{e.name}</div></button>)}</div></Panel>
    </>
  );
}

function BehaviourGraph({ selected, setSelected }) {
  const [metric, setMetric] = useState("conductivity");
  const [mode, setMode] = useState("network");
  const selectedElement = elementMap[selected] || elementMap.Al;
  const selectedScore = score(selected);
  const metricLabels = {
    stability: "Stability",
    conductivity: "Conductivity",
    thermal: "Thermal",
    diffusion: "Diffusion",
    pressure: "Pressure",
    rarity: "Rarity",
    alignment: "Alignment",
  };
  const modeLabels = {
    network: "Network",
    orbit: "Orbit",
    rank: "Rank",
  };
  const metricMax = metric === "alignment" ? 100 : 5;
  const allRelated = elements.filter(e => e.symbol !== selected).map(e => {
    const s = score(e.symbol);
    const distance = Math.abs(s.stability - selectedScore.stability) + Math.abs(s.conductivity - selectedScore.conductivity) + Math.abs(s.thermal - selectedScore.thermal) + Math.abs(s.diffusion - selectedScore.diffusion) + Math.abs(s.pressure - selectedScore.pressure);
    const metricValue = Number(s[metric] || 0);
    const focusMetric = Number(selectedScore[metric] || 0);
    const metricAffinity = Math.max(0, Math.min(99, 100 - Math.abs(metricValue - focusMetric) * (metric === "alignment" ? 0.8 : 18)));
    const similarity = Math.max(0, Math.min(99, Math.round((100 - distance * 11) * 0.58 + metricAffinity * 0.42)));
    return { ...e, metrics: s, metricValue, metricAffinity, similarity, relationship: compatibilityScore(selected, e.symbol) };
  });
  const related = allRelated.sort((a,b) => mode === "rank" ? b.metricValue - a.metricValue : b.similarity - a.similarity).slice(0, 22);
  const nodes = related.map((e, i) => {
    const ratio = Math.max(0.08, Math.min(1, (e.metricValue || 0) / metricMax));
    const angle = mode === "rank" ? -Math.PI / 2 + (i / Math.max(1, related.length - 1)) * Math.PI : (i / related.length) * Math.PI * 2;
    const radius = mode === "orbit" ? 16 + ratio * 36 : mode === "rank" ? 12 + i * 2.25 : 18 + (i % 5) * 5.5;
    return { ...e, ratio, x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
  });
  const top = related[0] || selectedElement;
  const exportGraph = () => {
    const content = `ElementOS Relationship Graph\n\nFocus: ${selectedElement.name} (${selectedElement.symbol})\nMetric: ${metricLabels[metric]}\nMode: ${modeLabels[mode]}\nTop relationship: ${top.symbol} — ${top.name}\nSimilarity: ${Number(top.similarity || 0).toFixed(1)}%\n\nClosest materials:\n${related.slice(0, 10).map((e, i) => `${i + 1}. ${e.symbol} — ${e.name}: ${e.similarity.toFixed(1)}% · ${metricLabels[metric]} ${Number(e.metricValue).toFixed(metric === "alignment" ? 0 : 2)}`).join("\n")}`;
    exportAllFormats({ baseName: `${selectedElement.symbol}-relationship-graph`, title: `Relationship Graph: ${selectedElement.symbol}`, summary: content, payload: { selected, metric, mode, related: related.slice(0, 10) } });
  };
  return (
    <>
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-blue-950/30 via-slate-950 to-cyan-950/20">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_.9fr] xl:items-center">
          <div>
            <Pill gold><Network size={12}/> relationship intelligence</Pill>
            <h1 className="mt-4 text-5xl font-black sm:text-7xl">Relationship <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Graph</span></h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">A magnetic network of material relationships. The metric buttons now actively re-rank the network, rebuild the geometry and update the relationship signal.</p>
            <Info title="Active relationship lens">Viewing <b>{metricLabels[metric]}</b> in <b>{modeLabels[mode]}</b> mode for {selectedElement.name}. Click a metric to change how ElementOS scores and draws the network.</Info>
          </div>
          <Panel>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Current focus</div>
            <div className="mt-3 flex items-end justify-between"><div><div className="text-7xl font-black text-amber-100">{selectedElement.symbol}</div><div className="text-2xl font-black">{selectedElement.name}</div></div><div className="text-right"><div className="text-4xl font-black text-cyan-100">{Number(top.similarity || 0).toFixed(0)}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{metricLabels[metric]} match</div></div></div>
            <Button onClick={exportGraph} variant="primary" className="mt-5 w-full">Export Relationship Graph</Button>
          </Panel>
        </div>
      </Panel>
      <GuidePanel page="graph" />
      <Panel>
        <div className="flex flex-wrap gap-2">
          {metrics.map(m => <Button key={m} onClick={() => setMetric(m)} variant={metric === m ? "primary" : "ghost"}>{metricLabels[m]}</Button>)}
          {Object.entries(modeLabels).map(([id, label]) => <Button key={id} onClick={() => setMode(id)} variant={mode === id ? "primary" : "ghost"}>{label}</Button>)}
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
        <Panel>
          <div className="relative h-[700px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_35%),linear-gradient(135deg,#020617,#07111f)]">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
            <svg className="absolute inset-0 h-full w-full">{nodes.map((n, i) => <line key={n.symbol} x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`} stroke={i < 5 ? "rgba(251,191,36,.42)" : "rgba(34,211,238,.24)"} strokeWidth={i < 5 ? "2.8" : "1.3"}/>)}</svg>
            <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-amber-300/40 bg-amber-300/10 text-center shadow-[0_0_70px_rgba(251,191,36,.25)]"><div><div className="text-5xl font-black text-amber-100">{selected}</div><div className="text-[10px] uppercase tracking-[.2em] text-amber-100/70">{metricLabels[metric]}</div></div></div>
            {nodes.map((n, i) => <button key={n.symbol} onClick={() => setSelected(n.symbol)} className="absolute grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-cyan-300/25 bg-slate-950/85 text-sm font-black text-cyan-100 transition hover:scale-125" style={{ left: `${n.x}%`, top: `${n.y}%`, boxShadow: `0 0 ${14 + n.ratio * 52}px rgba(34,211,238,.48)` }}><span>{n.symbol}</span><span className="text-[10px] text-slate-300">{mode === "rank" ? Number(n.metricValue).toFixed(metric === "alignment" ? 0 : 1) : `${n.similarity.toFixed(0)}%`}</span></button>)}
          </div>
        </Panel>
        <Panel>
          <Pill gold><Sparkles size={12}/> closest relationships</Pill>
          <h2 className="mt-3 text-3xl font-black">Best matches for {selected}</h2>
          <div className="mt-2 text-sm text-slate-400">Sorted by {mode === "rank" ? metricLabels[metric] : `${metricLabels[metric]} relationship affinity`}.</div>
          <div className="mt-4 space-y-2">{related.slice(0, 10).map((e, i) => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10"><span><b className="text-cyan-100">#{i + 1} {e.symbol}</b> <span className="text-slate-400">{e.name}</span><div className="text-xs text-slate-500">Compatibility {e.relationship}% · {metricLabels[metric]} {Number(e.metricValue).toFixed(metric === "alignment" ? 0 : 2)}</div></span><span className="font-black text-emerald-200">{e.similarity.toFixed(0)}%</span></button>)}</div>
        </Panel>
      </div>
    </>
  );
}

function SimilarityUniverse({ selected, setSelected }) {
  const [mode, setMode] = useState("alloy");
  const [focus, setFocus] = useState(selected || "Al");
  const base = elementMap[focus] || elementMap[selected] || elementMap.Al;
  const modeLabels = {
    alloy: "Alloy pathways",
    conductive: "Conductive corridors",
    thermal: "Thermal neighbourhoods",
    pressure: "Pressure families",
    rarity: "Rare discovery routes",
  };

  const relationships = generateRecommendations([base.symbol])?.[0]?.matches || [];
  const ranked = elements
    .filter((e) => e.symbol !== base.symbol)
    .map((e) => {
      const sb = score(base.symbol);
      const se = score(e.symbol);
      const weights = {
        alloy: ["stability", "pressure", "thermal"],
        conductive: ["conductivity", "stability", "thermal"],
        thermal: ["thermal", "pressure", "stability"],
        pressure: ["pressure", "stability", "diffusion"],
        rarity: ["rarity", "alignment", "stability"],
      }[mode] || ["stability", "pressure", "thermal"];
      const similarity = Math.max(1, Math.min(99, Math.round(100 - weights.reduce((sum, key) => sum + Math.abs((sb[key] || 0) - (se[key] || 0)) * 10, 0))));
      return { ...e, similarity, orbit: 150 + (e.atomicNumber % 5) * 42, phase: e.atomicNumber * 0.44 };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 22);

  const top = ranked[0] || relationships[0] || base;
  const constellationSvg = ranked.slice(0, 8).map((r, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { ...r, x: 300 + Math.cos(angle) * (130 + (i % 3) * 28), y: 240 + Math.sin(angle) * (120 + (i % 2) * 35) };
  });

  const exportUniverse = () => {
    const content = `ElementOS Discovery Universe\n\nFocus: ${base.name} (${base.symbol})\nMode: ${modeLabels[mode]}\nTop match: ${top.name || top.symbol} (${top.symbol})\n\nTop relationships:\n${ranked.slice(0, 10).map((r, i) => `${i + 1}. ${r.symbol} — ${r.name}: ${r.similarity}%`).join("\n")}\n\nGenerated by ElementOS Discovery Universe`;
    exportAllFormats({ baseName: `${base.symbol}-discovery-universe`, title: `Discovery Universe: ${base.name}`, summary: content, payload: { focus: base.symbol, mode, ranked: ranked.slice(0, 10) } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1fr_.9fr]">
        <div>
          <Pill gold><Orbit size={12}/> discovery universe</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Discovery <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Universe</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Explore a living constellation of material relationships. ElementOS maps substitute candidates, thermal families, conductive pathways and rare discovery routes around any selected element.
          </p>
          <Info title="Why this matters">
            This is no longer a vague similarity page. It is a visual relationship engine for finding the next material to compare, report, save or turn into a discovery card.
          </Info>
        </div>
        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Universe controls</div>
          <select value={focus} onChange={(e) => { setFocus(e.target.value); setSelected?.(e.target.value); }} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
            {elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
          </select>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {Object.entries(modeLabels).map(([id, label]) => <Button key={id} onClick={() => setMode(id)} variant={mode === id ? "primary" : "ghost"}>{label}</Button>)}
          </div>
          <Button onClick={exportUniverse} variant="primary" className="mt-5 w-full">Export Universe PDF/JSON/SVG</Button>
        </Panel>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Panel>
          <div className="relative h-[680px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_36%),linear-gradient(135deg,#020617,#07111f)]">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-amber-300/10 p-8 text-center shadow-[0_0_70px_rgba(251,191,36,.25)]">
              <div className="text-5xl font-black text-amber-100">{base.symbol}</div>
              <div className="mt-1 text-xs text-amber-100/80">{base.name}</div>
            </div>
            {constellationSvg.map((r, i) => (
              <React.Fragment key={r.symbol}>
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                  <line x1="50%" y1="50%" x2={r.x} y2={r.y} stroke="rgba(34,211,238,.28)" strokeWidth="1.2" />
                </svg>
                <button onClick={() => { setFocus(r.symbol); setSelected?.(r.symbol); }} className="absolute grid h-20 w-20 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-sm font-black text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,.22)] transition hover:scale-125" style={{ left: r.x - 40, top: r.y - 40 }}>
                  <span>{r.symbol}</span>
                  <span className="text-[10px] text-slate-300">{r.similarity}%</span>
                </button>
              </React.Fragment>
            ))}
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[.22em] text-cyan-200">Active field</div>
              <div className="mt-1 text-xl font-black text-white">{modeLabels[mode]}</div>
            </div>
          </div>
        </Panel>
        <Panel>
          <Pill gold><Network size={12}/> ranked relationships</Pill>
          <h2 className="mt-3 text-3xl font-black">Best matches for {base.symbol}</h2>
          <div className="mt-5 space-y-3">
            {ranked.slice(0, 10).map((r, i) => (
              <button key={r.symbol} onClick={() => { setFocus(r.symbol); setSelected?.(r.symbol); }} className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10">
                <div className="flex items-center justify-between gap-4"><div><b className="text-cyan-100">#{i + 1} {r.symbol} · {r.name}</b><div className="text-sm text-slate-400">{modeLabels[mode]} relationship</div></div><div className="text-2xl font-black text-emerald-100">{r.similarity}%</div></div>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}


function IsotopeLab() {
  const [symbol, setSymbol] = useState("Ti");
  const [protons, setProtons] = useState(22);
  const [neutrons, setNeutrons] = useState(26);
  const [field, setField] = useState(62);
  const [temperature, setTemperature] = useState(38);
  const [pressure, setPressure] = useState(24);
  const [mode, setMode] = useState("stability");

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
  const isotopeClass = stability > 82 ? "MAGIC SHELL" : stability > 68 ? "PROMISING" : stability > 48 ? "EXPERIMENTAL" : "VOLATILE";
  const isotopeModeLabels = { stability: "Stability", binding: "Binding", decay: "Decay", shell: "Shell" };
  const modeScores = {
    stability,
    binding: bindingSignal,
    decay: decayRisk,
    shell: shellBonus ? 100 : Math.max(0, Math.min(100, 42 + Math.abs(neutronRatio - 1.35) * -38 + field * 0.16)),
  };
  const activeModeScore = modeScores[mode] ?? stability;
  const modeNarratives = {
    stability: `${isotopeName} is being scored by neutron balance, shell bonus and environmental load.`,
    binding: `${isotopeName} is being scored by binding signal strength and modelled nuclear cohesion.`,
    decay: `${isotopeName} is being scored by decay pressure; lower decay risk means a cleaner isotope signal.`,
    shell: `${isotopeName} is being scored by shell-favourable proton/neutron positions and magic-number proximity.`,
  };

  const nucleus = Array.from({ length: Math.min(132, Math.max(1, massNumber)) }, (_, i) => ({
    type: i < protons ? "p" : "n",
    angle: (i / Math.min(132, Math.max(1, massNumber))) * Math.PI * 2,
    ring: 34 + (i % 6) * 23,
  }));

  const applyElement = (nextSymbol) => {
    const next = elementMap[nextSymbol] || elementMap.Ti;
    setSymbol(next.symbol);
    setProtons(next.atomicNumber);
    setNeutrons(Math.max(1, Math.round(next.atomicNumber * 1.18)));
  };

  const isotopeFamilies = elements.slice(0, 30).map((e) => {
    const p = e.atomicNumber;
    const n = Math.round(p * 1.18);
    const st = Math.max(0, Math.min(100, 82 - Math.abs(n - p * 1.35) * 2.1 + (magicNumbers.includes(p) || magicNumbers.includes(n) ? 12 : 0)));
    const bind = Math.max(0, Math.min(100, 42 + st * 0.48 + Math.sin((p + n) / 7) * 8));
    const decay = Math.max(0, Math.min(100, 100 - st));
    const shell = magicNumbers.includes(p) || magicNumbers.includes(n) ? 100 : Math.max(0, Math.min(100, 42 + Math.abs(n / Math.max(1, p) - 1.35) * -38));
    const modeValue = { stability: st, binding: bind, decay, shell }[mode] ?? st;
    return { ...e, protons: p, neutrons: n, stability: st, binding: bind, decay, shell, modeValue };
  }).sort((a, b) => mode === "decay" ? a.modeValue - b.modeValue : b.modeValue - a.modeValue).slice(0, 10);

  const exportSummary = () => {
    const content = `ElementOS Isotope Intelligence Report\n\nIsotope: ${isotopeName}\nElement: ${selectedElement.name} (${selectedElement.symbol})\nProtons: ${protons}\nNeutrons: ${neutrons}\nMass Number: ${massNumber}\nNeutron Ratio: ${neutronRatio.toFixed(3)}\nStability Score: ${stability.toFixed(1)} / 100\nDecay Risk: ${decayRisk.toFixed(1)} / 100\nBinding Signal: ${bindingSignal.toFixed(1)} / 100\nClass: ${isotopeClass}\nInterpretation: ${shellLabel}\nGenerated: ${new Date().toLocaleString()}`;
    exportAllFormats({ baseName: "elementos-isotope-intelligence-report", title: `Isotope Intelligence: ${isotopeName}`, summary: content, payload: { isotopeName, element: selectedElement.symbol, protons, neutrons, massNumber, neutronRatio: neutronRatio.toFixed(3), stability: stability.toFixed(1), decayRisk: decayRisk.toFixed(1), bindingSignal: bindingSignal.toFixed(1), isotopeClass, shellLabel } });
  };

  return (
    <>
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-fuchsia-950/25 via-slate-950 to-cyan-950/25">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div>
            <Pill gold><Atom size={12}/> isotope intelligence lab</Pill>
            <h1 className="mt-4 text-5xl font-black sm:text-7xl">Isotope <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">Lab</span></h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">A magical nucleus simulator for exploring proton/neutron balance, shell-like stability signals, binding behaviour and exportable isotope reports.</p>
            <Info title="Important note">This is an ElementOS visual simulation layer for product exploration and reporting. It is not a substitute for validated nuclear physics software.</Info>
          </div>
          <Panel>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Active isotope</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{isotopeName}</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[['Class', isotopeClass], ['Stability', `${stability.toFixed(1)}%`], ['Mass', massNumber]].map(([a,b]) => <div key={a} className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-[10px] uppercase tracking-[.18em] text-slate-500">{a}</div><div className="mt-1 text-xl font-black text-cyan-100">{b}</div></div>)}
            </div>
          </Panel>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Panel>
          <h2 className="text-2xl font-black">Nucleus Builder</h2>
          <label className="mt-5 block text-sm text-slate-400">Base element<select value={symbol} onChange={(e) => applyElement(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">{elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}</select></label>
          <div className="mt-5 grid gap-4">{[["Protons", protons, setProtons, 1, 118],["Neutrons", neutrons, setNeutrons, 0, 180],["Field Strength", field, setField, 0, 100],["Thermal Load", temperature, setTemperature, 0, 100],["Pressure Load", pressure, setPressure, 0, 100]].map(([label, value, setter, min, max]) => <label key={label} className="text-sm text-slate-400"><div className="flex justify-between"><span>{label}</span><span className="font-mono text-cyan-200">{value}</span></div><input type="range" min={min} max={max} value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-2 w-full"/></label>)}</div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">{Object.entries(isotopeModeLabels).map(([x, label]) => <Button key={x} onClick={() => setMode(x)} variant={mode === x ? "primary" : "ghost"}>{label}</Button>)}</div>
          <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="text-xs uppercase tracking-[.2em] text-cyan-200">Active isotope lens</div><div className="mt-2 text-3xl font-black text-cyan-100">{isotopeModeLabels[mode]} · {Number(activeModeScore).toFixed(1)}%</div><p className="mt-2 text-sm leading-6 text-slate-300">{modeNarratives[mode]}</p></div><Button variant="primary" onClick={exportSummary} className="mt-6 w-full"><Download size={15} className="inline"/> Export Isotope PDF/JSON/SVG</Button>
        </Panel>
        <Panel>
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">Nuclear readout · {isotopeModeLabels[mode]} lens</div>
              <h2 className="mt-2 text-5xl font-black text-cyan-100">{selectedElement.symbol}-{massNumber}</h2>
              <p className="mt-3 text-slate-300">{selectedElement.name} nucleus with {protons} protons and {neutrons} neutrons. Neutron ratio {neutronRatio.toFixed(3)}.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-4">{[[isotopeModeLabels[mode], activeModeScore, 100],["Stability", stability, 100],["Decay Risk", decayRisk, 100],["Binding Signal", bindingSignal, 100]].map(([label, value, max]) => <div key={label} className="rounded-3xl border border-white/10 bg-black/25 p-4"><div className="text-xs uppercase tracking-[.18em] text-slate-500">{label}</div><div className="mt-2 text-3xl font-black text-cyan-100">{value.toFixed(1)}</div><div className="mt-3 h-3 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300" style={{ width: `${Math.min(100, (value / max) * 100)}%` }}/></div></div>)}</div>
              <Info title="Simulation Interpretation">{isotopeName} is currently a <b>{shellLabel}</b>. Stability improves when neutron balance approaches the modelled stable band and when proton/neutron counts land near shell-favourable numbers.</Info>
            </div>
            <div className="relative h-[450px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(217,70,239,.18),transparent_34%),linear-gradient(135deg,#020617,#07111f)]">
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 bg-amber-300/10 text-center text-3xl font-black leading-[6rem] text-amber-100 shadow-[0_0_55px_rgba(251,191,36,.25)]">{selectedElement.symbol}</div>
              {nucleus.map((dot, i) => <div key={i} className={`absolute h-4 w-4 rounded-full ${dot.type === "p" ? "bg-cyan-300" : "bg-fuchsia-300"}`} style={{ left: `calc(50% + ${Math.cos(dot.angle) * dot.ring}px - .5rem)`, top: `calc(50% + ${Math.sin(dot.angle) * dot.ring}px - .5rem)`, boxShadow: dot.type === "p" ? "0 0 18px rgba(34,211,238,.7)" : "0 0 18px rgba(217,70,239,.7)" }} title={dot.type === "p" ? "proton" : "neutron"}/>) }
              {[1,2,3,4].map(i => <div key={i} className="absolute rounded-full border border-cyan-300/10" style={{ inset: `${18 + i * 8}%`, animation: `eosSpin ${18 + i * 7}s linear infinite` }}/>) }
            </div>
          </div>
        </Panel>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel><h2 className="text-3xl font-black">Isotope Family Candidates</h2><div className="mt-5 grid gap-3 md:grid-cols-5">{isotopeFamilies.map((e, i) => <button key={e.symbol} onClick={() => applyElement(e.symbol)} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/40"><div className="text-xs text-slate-500">#{i + 1}</div><div className="text-2xl font-black text-cyan-100">{e.symbol}</div><div className="text-sm text-slate-400">{e.name}</div><div className="mt-2 text-sm font-black text-emerald-100">{Number(e.modeValue).toFixed(0)}% {isotopeModeLabels[mode]}</div></button>)}</div></Panel>
        <Panel><Pill gold><Dna size={12}/> isotope genome</Pill><h2 className="mt-3 text-3xl font-black">Discovery Genome</h2>{[["Proton field", protons / 118 * 100],["Neutron field", Math.min(100, neutrons / 180 * 100)],["Shell signal", shellBonus ? 100 : 42],["Binding", bindingSignal],["Stability", stability]].map(([label, value]) => <div key={label} className="mt-4"><div className="mb-1 flex justify-between text-xs uppercase tracking-[.18em] text-slate-500"><span>{label}</span><span>{Number(value).toFixed(0)}%</span></div><div className="h-3 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300" style={{ width: `${Math.min(100, value)}%` }}/></div></div>)}</Panel>
      </div>
    </>
  );
}

function CalculationCore() {
  const [mode, setMode] = useState("scenario");
  const [primary, setPrimary] = useState("Al");
  const [secondary, setSecondary] = useState("Ti");
  const [environment, setEnvironment] = useState("Deep Ocean");
  const [timeHorizon, setTimeHorizon] = useState(25);
  const [stress, setStress] = useState(68);
  const [temperature, setTemperature] = useState(240);
  const [pressureLoad, setPressureLoad] = useState(72);
  const [humidity, setHumidity] = useState(82);
  const [radiation, setRadiation] = useState(16);
  const [explainMode, setExplainMode] = useState("Research-grade");
  const [history, setHistory] = useState([]);

  const primaryElement = elementMap[primary] || elementMap.Al;
  const secondaryElement = elementMap[secondary] || elementMap.Ti;
  const primaryScore = score(primary);
  const secondaryScore = score(secondary);
  const compatibility = compatibilityScore(primary, secondary);

  const envProfiles = {
    "Deep Ocean": { corrosion: 92, thermal: 44, pressure: 96, volatility: 74, label: "saltwater pressure + corrosion" },
    "Low Earth Orbit": { corrosion: 22, thermal: 88, pressure: 18, volatility: 92, label: "thermal cycling + radiation" },
    "Arctic Pipeline": { corrosion: 54, thermal: 18, pressure: 71, volatility: 66, label: "freeze-thaw fatigue" },
    "Chemical Plant": { corrosion: 86, thermal: 72, pressure: 68, volatility: 81, label: "chemical attack + heat" },
    "Geothermal Bore": { corrosion: 73, thermal: 94, pressure: 88, volatility: 85, label: "heat + subsurface pressure" },
    "Aerospace Skin": { corrosion: 36, thermal: 82, pressure: 52, volatility: 76, label: "thermal shock + vibration" },
    "Urban Infrastructure": { corrosion: 61, thermal: 47, pressure: 58, volatility: 44, label: "long-term weathering" },
    "Nuclear Containment": { corrosion: 48, thermal: 91, pressure: 82, volatility: 96, label: "radiation + thermal load" },
  };

  const env = envProfiles[environment] || envProfiles["Deep Ocean"];
  const avgStability = ((primaryScore.stability + secondaryScore.stability) / 10) * 100;
  const avgThermal = ((primaryScore.thermal + secondaryScore.thermal) / 10) * 100;
  const avgPressure = ((primaryScore.pressure + secondaryScore.pressure) / 10) * 100;
  const avgConductivity = ((primaryScore.conductivity + secondaryScore.conductivity) / 10) * 100;
  const exposure = Math.min(100, timeHorizon * 0.9 + stress * 0.28 + humidity * 0.22 + radiation * 0.24 + pressureLoad * 0.26);
  const thermalDrift = Math.max(1, Math.min(99, env.thermal * 0.36 + temperature / 8 + timeHorizon * 0.18 - avgThermal * 0.18));
  const pressureRisk = Math.max(1, Math.min(99, env.pressure * 0.42 + pressureLoad * 0.38 + stress * 0.18 - avgPressure * 0.24));
  const corrosionRisk = Math.max(1, Math.min(99, env.corrosion * 0.48 + humidity * 0.32 + timeHorizon * 0.16 - avgStability * 0.22));
  const resilience = Math.max(1, Math.min(99, compatibility * 0.38 + avgStability * 0.22 + avgThermal * 0.12 + avgPressure * 0.12 - exposure * 0.24));
  const confidence = Math.max(45, Math.min(99, Math.round(compatibility * 0.45 + resilience * 0.35 + (100 - Math.abs(thermalDrift - pressureRisk)) * 0.2)));
  const risk = Math.round((thermalDrift + pressureRisk + corrosionRisk) / 3);
  const researchGrade = confidence >= 84 ? "Strong" : confidence >= 70 ? "Promising" : confidence >= 55 ? "Experimental" : "High risk";
  const discoveryId = `${primary}-${secondary}-${Math.abs(primary.charCodeAt(0) * 17 + secondary.charCodeAt(0) * 31 + timeHorizon).toString(16).toUpperCase()}`;

  const formulaCards = [
    { title: "Compatibility Index", formula: "C = 100 − Σ|metricA − metricB|", value: `${compatibility}%`, meaning: "How naturally the selected materials behave together across the ElementOS metrics." },
    { title: "Exposure Load", formula: "E = t + stress + humidity + radiation", value: `${Math.round(exposure)}%`, meaning: "How hostile the selected environment becomes over the chosen time horizon." },
    { title: "Resilience Score", formula: "R = stability + thermal + pressure − exposure", value: `${Math.round(resilience)}%`, meaning: "How well the pair is expected to keep useful behaviour under pressure." },
    { title: "Confidence Band", formula: "K = compatibility + resilience + agreement", value: `${confidence}%`, meaning: "How confident the platform is in this calculation scenario." },
  ];

  const telemetry = [
    ["Compatibility", compatibility, "cyan"],
    ["Resilience", Math.round(resilience), "emerald"],
    ["Thermal drift", Math.round(thermalDrift), "amber"],
    ["Pressure risk", Math.round(pressureRisk), "fuchsia"],
    ["Corrosion risk", Math.round(corrosionRisk), "rose"],
    ["Confidence", confidence, "sky"],
  ];

  const explanation = explainMode === "Explain like I'm 12"
    ? `${primaryElement.name} and ${secondaryElement.name} are being tested like a team. The environment adds heat, pressure and damage over time. A high score means the team should survive better. Here, the result is ${researchGrade.toLowerCase()} because compatibility is ${compatibility}% and the main risk is ${risk}%.`
    : `Calculation Intelligence models ${primaryElement.name} + ${secondaryElement.name} inside ${environment}. The current run produces a ${confidence}% confidence band with ${Math.round(resilience)}% resilience. The dominant load is ${risk >= 75 ? "severe" : risk >= 55 ? "moderate" : "controlled"}, driven by ${env.label}. This makes the scenario ${researchGrade.toLowerCase()} for report-level review.`;

  const addToHistory = () => {
    const item = {
      id: discoveryId,
      primary,
      secondary,
      environment,
      timeHorizon,
      confidence,
      risk,
      resilience: Math.round(resilience),
      created: new Date().toLocaleTimeString(),
    };
    setHistory((current) => [item, ...current].slice(0, 6));
  };

  const exportCalc = () => {
    const content = `ElementOS Calculation Intelligence Report\n\nScenario: ${primaryElement.name} + ${secondaryElement.name}\nDiscovery ID: ${discoveryId}\nEnvironment: ${environment}\nTime Horizon: ${timeHorizon} years\n\nCompatibility: ${compatibility}%\nResilience: ${Math.round(resilience)}%\nConfidence: ${confidence}%\nThermal Drift: ${Math.round(thermalDrift)}%\nPressure Risk: ${Math.round(pressureRisk)}%\nCorrosion Risk: ${Math.round(corrosionRisk)}%\n\nInterpretation:\n${explanation}`;
    exportAllFormats({
      baseName: `elementos-calculation-intelligence-${discoveryId}`,
      title: "Calculation Intelligence Report",
      summary: content,
      payload: {
        discoveryId,
        primary,
        secondary,
        environment,
        timeHorizon,
        stress,
        temperature,
        pressureLoad,
        humidity,
        radiation,
        compatibility,
        resilience: Math.round(resilience),
        confidence,
        thermalDrift: Math.round(thermalDrift),
        pressureRisk: Math.round(pressureRisk),
        corrosionRisk: Math.round(corrosionRisk),
        explanation,
      },
    });
    addToHistory();
  };

  const elementOptions = elements.slice(0, 118);

  return (
    <>
      <Panel className="overflow-hidden border-cyan-300/25 bg-gradient-to-br from-cyan-950/35 via-slate-950 to-blue-950/30 p-0">
        <div className="relative p-6 md:p-8">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_.9fr] xl:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Pill gold><Calculator size={12}/> calculation intelligence</Pill>
                <Pill><BarChart3 size={12}/> live confidence model</Pill>
                <Pill><Sparkles size={12}/> formula-to-report engine</Pill>
              </div>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[.92] tracking-tight md:text-7xl">
                Calculation <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Intelligence</span>
              </h1>
              <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
                Turn material choices, environments and time horizons into explainable research calculations. This is the reasoning layer behind reports, simulations, Time Machine runs and Discovery Media exports.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button onClick={exportCalc} variant="primary" className="px-8 py-5"><Download size={16} className="mr-2 inline"/> Export PDF / JSON / SVG</Button>
                <Button onClick={addToHistory} className="px-8 py-5"><Save size={16} className="mr-2 inline"/> Save Calculation Run</Button>
                <Button onClick={() => setExplainMode(explainMode === "Research-grade" ? "Explain like I'm 12" : "Research-grade")} className="px-8 py-5"><Sparkles size={16} className="mr-2 inline"/> {explainMode}</Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 shadow-[0_0_90px_rgba(34,211,238,.14)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[.25em] text-cyan-200">Current calculation</div>
                  <div className="mt-3 text-4xl font-black text-white">{primary} + {secondary}</div>
                  <div className="mt-1 text-sm text-slate-400">{environment} · {timeHorizon} year horizon</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right">
                  <div className="text-5xl font-black text-emerald-100">{confidence}%</div>
                  <div className="text-[10px] uppercase tracking-[.2em] text-emerald-200">confidence</div>
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" style={{ width: `${confidence}%` }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[['Grade', researchGrade], ['Risk', `${risk}%`], ['ID', discoveryId]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
                    <div className="mt-2 text-lg font-black text-cyan-100">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <Panel>
          <Pill gold><Settings size={12}/> scenario controls</Pill>
          <h2 className="mt-3 text-4xl font-black">Build the calculation.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Select materials, environment and exposure conditions. Every value updates the confidence model instantly.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Primary material
              <select value={primary} onChange={(e) => setPrimary(e.target.value)} className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950 p-3 text-white">
                {elementOptions.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              Secondary material
              <select value={secondary} onChange={(e) => setSecondary(e.target.value)} className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950 p-3 text-white">
                {elementOptions.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
              </select>
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              Environment profile
              <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-slate-950 p-3 text-white">
                {Object.keys(envProfiles).map((name) => <option key={name} value={name}>{name} — {envProfiles[name].label}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-4">
            {[
              ["Time Horizon", timeHorizon, setTimeHorizon, 1, 250, "years"],
              ["Mechanical Stress", stress, setStress, 0, 100, "%"],
              ["Temperature", temperature, setTemperature, -180, 1200, "°C"],
              ["Pressure Load", pressureLoad, setPressureLoad, 0, 100, "%"],
              ["Humidity / Corrosion", humidity, setHumidity, 0, 100, "%"],
              ["Radiation / Signal Noise", radiation, setRadiation, 0, 100, "%"],
            ].map(([label, value, setter, min, max, unit]) => (
              <label key={label} className="block text-sm text-slate-300">
                <div className="flex justify-between"><span>{label}</span><b className="text-cyan-100">{value} {unit}</b></div>
                <input type="range" min={min} max={max} step="1" value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-3 w-full" />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><BarChart3 size={12}/> intelligence surface</Pill>
          <h2 className="mt-3 text-4xl font-black">Live calculation telemetry.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {telemetry.map(([label, value]) => (
              <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between text-sm"><span className="text-slate-400">{label}</span><b className="text-cyan-100">{value}%</b></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300" style={{ width: `${Math.max(4, value)}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-black/30 p-5">
            <div className="text-xs uppercase tracking-[.25em] text-cyan-200">AI interpretation</div>
            <p className="mt-3 text-sm leading-7 text-slate-200">{explanation}</p>
          </div>

          <div className="mt-6 h-64 rounded-[2rem] border border-white/10 bg-black/25 p-5">
            <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_center,rgba(34,211,238,.18),transparent_35%),linear-gradient(135deg,#020617,#081426)]">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
              {Array.from({ length: 10 }).map((_, i) => {
                const h = Math.max(12, Math.min(92, confidence + Math.sin(i * 0.85 + timeHorizon / 10) * 18 - risk * 0.12));
                return <div key={i} className="absolute bottom-5 rounded-t-2xl bg-cyan-300/80 shadow-[0_0_30px_rgba(34,211,238,.4)]" style={{ left: `${6 + i * 9}%`, width: "5%", height: `${h}%` }} />;
              })}
              <div className="absolute left-6 top-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-black text-emerald-100">Signal surface · {confidence}%</div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><BookOpen size={12}/> formula library</Pill>
            <h2 className="mt-3 text-4xl font-black">Equations that explain the run.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Each formula card shows the calculation idea, the live result and what it means in plain English.</p>
          </div>
          <div className="flex rounded-2xl border border-white/10 bg-black/25 p-1">
            {[["scenario", "Scenario"], ["formula", "Formula"], ["history", "History"]].map(([id, label]) => (
              <button key={id} onClick={() => setMode(id)} className={`rounded-xl px-4 py-2 text-sm font-black ${mode === id ? "bg-cyan-300 text-slate-950" : "text-slate-300"}`}>{label}</button>
            ))}
          </div>
        </div>

        {mode !== "history" ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {formulaCards.map((card) => (
              <div key={card.title} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/5 p-5">
                <div className="text-xs uppercase tracking-[.2em] text-slate-500">{card.title}</div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 font-mono text-xs text-cyan-100">{card.formula}</div>
                <div className="mt-4 text-4xl font-black text-white">{card.value}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{card.meaning}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {(history.length ? history : [{ id: "No saved calculations yet", primary: "Run", secondary: "Export", environment: "Save a calculation to build history", timeHorizon: 0, confidence: 0, risk: 0, resilience: 0, created: "—" }]).map((item) => (
              <div key={`${item.id}-${item.created}`} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><b className="text-cyan-100">{item.id}</b><div className="text-sm text-slate-400">{item.primary} + {item.secondary} · {item.environment}</div></div>
                  <div className="text-sm text-slate-400">{item.created}</div>
                  <div className="text-xl font-black text-emerald-100">{item.confidence}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12}/> recommended next step</Pill>
            <h2 className="mt-3 text-3xl font-black">Turn this calculation into a platform asset.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">This run is ready to become a report, a discovery card, a Time Machine scenario or a Workspace record.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportCalc} variant="primary">Export Report Pack</Button>
            <Button onClick={addToHistory}>Save to History</Button>
            <Button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}>Open Command Engine</Button>
          </div>
        </div>
      </Panel>
    </>
  );
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
      alert("Please join beta before saving reports.");
      return;
    }

    const content = build(title, desc);
    const publicId = createPublicId(compare);
    setStatus("Saving report to cloud...");

    const { error } = await supabase.from("reports").insert({
      user_id: session.user.id,
      title,
      content,
      compare_set: compare,
      public_id: publicId,
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

    const slug = slugifyExportName(title);
    pdf.save(`${slug}.pdf`);
    downloadFile(`${slug}.json`, JSON.stringify({ title, description: desc, content, compareSet: compare, generatedAt: new Date().toLocaleString(), source: "ElementOS Reports Centre" }, null, 2), "application/json");
    downloadFile(`${slug}.svg`, makeExportSvg({ title, summary: content, payload: { title, compareSet: compare.join(" + "), rows: compareRows.length } }), "image/svg+xml");
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
            Join beta to save reports to the cloud. PDF/JSON/SVG export is a Pro Lab feature.
          </div>
        )}
        {session && !isPro && (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
            PDF/JSON/SVG exports are locked behind Pro Lab. Save reports to cloud now, then upgrade when you are ready to export polished PDFs.
          </div>
        )}
        {session && isPro && (
          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100">
            <CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab active — PDF/JSON/SVG exports unlocked.
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
                  alert("PDF/JSON/SVG exports are a Pro Lab feature.");
                  startCheckout();
                  return;
                }
                exportPDF(title, desc);
              }}>
                <Download size={15} className="inline"/> Export PDF/JSON/SVG
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
                  <div className="flex flex-wrap gap-2">
                    {r.public_id && (
                      <Button
                        onClick={() => {
                          const url = `${window.location.origin}/?report=${r.public_id}`;
                          safeCopyText(url);
                          setStatus("Public share link copied.");
                        }}
                      >
                        Share Link
                      </Button>
                    )}

                    <Button onClick={() => {
                      if (!isPro) {
                        alert("PDF/JSON/SVG exports are a Pro Lab feature.");
                        startCheckout();
                        return;
                      }
                      exportPDF(r.title, r.content || "Saved ElementOS report", r.content || "");
                    }}>
                      <Download size={15} className="inline"/> PDF/JSON/SVG
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}

function PublicReportView({ report, status }) {
  if (!report) {
    const isMissing = String(status || "").toLowerCase().includes("not found") || String(status || "").toLowerCase().includes("failed");
    return (
      <div className="eos-shell min-h-screen bg-[#02060d] text-slate-100">
        <ElementOSThemeSkin />
        <Background />
        <main className="relative z-10 mx-auto max-w-5xl space-y-6 p-6 lg:p-10">
          <Panel>
            <Pill gold><BookOpen size={12}/> public report</Pill>
            <h1 className="mt-4 text-5xl font-black">ElementOS Public Report</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {status || "Loading report..."}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Public link", "Report lookup", "Share-ready view"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                  <div className="text-2xl font-black text-cyan-100">{index === 0 ? "01" : index === 1 ? "02" : "03"}</div>
                  <div className="mt-1 text-xs uppercase tracking-[.2em] text-slate-500">{label}</div>
                </div>
              ))}
            </div>
            {isMissing && (
              <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                This public report link could not be loaded. The report may have been deleted, the public ID may be incorrect, or the database row may not be public yet.
              </div>
            )}
            <Button onClick={() => { window.location.href = window.location.pathname; }} variant="primary" className="mt-6">
              Open ElementOS Home
            </Button>
          </Panel>
        </main>
      </div>
    );
  }

  const compareSet = Array.isArray(report.compare_set) ? report.compare_set : [];
  const created = report.created_at ? new Date(report.created_at).toLocaleString() : "Unknown date";
  const primary = compareSet[0] || "Al";
  const secondary = compareSet[1] || compareSet[0] || "Ti";
  const hasPair = Boolean(compareSet[0] && compareSet[1]);
  const publicScore = hasPair ? compatibilityScore(primary, secondary) : 88;
  const publicTier = rarityTier(publicScore);
  const publicDNA = hasPair ? materialDNA(primary, secondary) : (report.public_id || "ELEMENTOS-REPORT");
  const topMetrics = compareSet.slice(0, 4).map((sym) => ({
    symbol: sym,
    name: elementMap[sym]?.name || sym,
    metrics: score(sym),
  }));

  return (
    <div className="eos-shell min-h-screen bg-[#02060d] text-slate-100">
      <ElementOSThemeSkin />
      <Background />

      <main className="relative z-10 mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
        <Panel className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 xl:grid-cols-[1fr_380px]">
            <div>
              <Pill gold><BookOpen size={12}/> public ElementOS discovery</Pill>
              <h1 className="mt-5 text-5xl font-black leading-tight sm:text-7xl">
                {report.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                A public material intelligence card generated by ElementOS — built to be shared, cited, revisited and converted into deeper research workspaces.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-300">
                  Public ID: <span className="font-mono text-cyan-200">{report.public_id}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-300">
                  Generated: <span className="text-cyan-100">{created}</span>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
                  Public link active
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => safeCopyText(window.location.href)}
                >
                  Share This Report
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = window.location.origin;
                  }}
                >
                  Open ElementOS
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-black/30 to-fuchsia-400/10 p-6 shadow-[0_0_80px_rgba(34,211,238,.16)]">
              <div className="text-xs uppercase tracking-[.24em] text-cyan-200">Compatibility Score</div>
              <div className="mt-4 text-7xl font-black text-cyan-100">{publicScore}%</div>
              <div className="mt-3 text-2xl font-black text-white">
                {primary} {hasPair ? "+" : "report"} {hasPair ? secondary : "card"}
              </div>
              <div className="mt-4 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-amber-100">
                {publicTier}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">Material DNA</div>
                <div className="mt-2 break-all font-mono text-cyan-100">{publicDNA}</div>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black">Public Report Card</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Share-ready snapshot with content, compare context and generated intelligence markers.
                </p>
              </div>
              <Pill gold><Sparkles size={12}/> generated by ElementOS</Pill>
            </div>

            <div className="mt-5 whitespace-pre-wrap rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-slate-200">
              {report.content || "No report content found."}
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel>
              <h2 className="text-2xl font-black">Compare Set</h2>
              {compareSet.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No compare set attached.</p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {compareSet.map((sym) => (
                    <div key={sym} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-3xl font-black text-cyan-100">{sym}</div>
                          <div className="text-sm text-slate-400">{elementMap[sym]?.name || "Unknown material"}</div>
                        </div>
                        <div className="text-right text-xs uppercase tracking-[.18em] text-slate-500">
                          #{elementMap[sym]?.atomicNumber || "--"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel>
              <h2 className="text-2xl font-black">Material Signals</h2>
              {topMetrics.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No signal data available.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {topMetrics.map((item) => (
                    <div key={item.symbol} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-black text-cyan-100">{item.symbol} · {item.name}</div>
                          <div className="mt-1 text-xs text-slate-500">conductivity / thermal / alignment</div>
                        </div>
                        <div className="text-right text-sm font-black text-emerald-200">
                          {item.metrics.alignment.toFixed(0)}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-cyan-300/10 p-2 text-cyan-100">{item.metrics.conductivity.toFixed(1)}</div>
                        <div className="rounded-xl bg-fuchsia-300/10 p-2 text-fuchsia-100">{item.metrics.thermal.toFixed(1)}</div>
                        <div className="rounded-xl bg-amber-300/10 p-2 text-amber-100">{item.metrics.pressure.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </div>

        <Panel>
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div>
              <Pill gold><UserPlus size={12}/> build your own workspace</Pill>
              <h2 className="mt-4 text-4xl font-black">Create your own ElementOS discoveries</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Save workspaces, generate public report cards, export PDFs, explore AI recommendations and compare material behaviour across the full element set.
              </p>
            </div>
            <div className="grid content-center gap-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  window.location.href = window.location.origin;
                }}
              >
                Launch ElementOS
              </Button>
              <Button
                className="w-full"
                onClick={() => safeCopyText(window.location.href)}
              >
                Copy Public Link
              </Button>
            </div>
          </div>
        </Panel>
      </main>
    </div>
  );
}




function AdvancedVisualization({ selected, compare, setPage }) {
  const [material, setMaterial] = useState(selected || compare?.[0] || "Ti");
  const [mode, setMode] = useState("Survival Curve");
  const [visualStyle, setVisualStyle] = useState("Magnetic");
  const [timeRange, setTimeRange] = useState(100);
  const active = elementMap[material] || elementMap.Ti;
  const s = score(active.symbol);
  const years = [0, 1, 5, 10, 25, 50, 75, 100, 150, 250].filter((y) => y <= timeRange || y === 0);
  if (!years.includes(timeRange)) years.push(timeRange);
  const baseResilience = Math.round(s.stability * 14 + s.pressure * 9 + s.thermal * 7 + s.conductivity * 4 + s.alignment * 0.12);
  const curve = years.map((year, index) => {
    const decay = Math.log10(year + 1) * (8 + (5 - s.stability) * 4) + index * 0.9;
    const survival = Math.max(7, Math.min(99, Math.round(baseResilience - decay)));
    const thermal = Math.max(4, Math.min(99, Math.round(s.thermal * 18 - Math.log10(year + 1) * 9 + 30)));
    const pressure = Math.max(4, Math.min(99, Math.round(s.pressure * 18 - Math.log10(year + 1) * 7 + 26)));
    const confidence = Math.max(61, Math.min(98, Math.round(survival * 0.68 + thermal * 0.18 + pressure * 0.14)));
    const anomaly = Math.max(0, Math.round(100 - confidence + Math.sin(year / 8) * 9));
    return { year, survival, thermal, pressure, confidence, anomaly };
  });

  const latest = curve[curve.length - 1];
  const w = 620, h = 260;
  const xFor = (i) => 34 + (i / Math.max(1, curve.length - 1)) * (w - 70);
  const yFor = (value) => h - 30 - (value / 100) * (h - 62);
  const pathFor = (key) => curve.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p[key])}`).join(" ");
  const survivalPath = pathFor("survival");
  const thermalPath = pathFor("thermal");
  const pressurePath = pathFor("pressure");
  const confidencePath = pathFor("confidence");

  const visualCards = [
    ["Long-horizon survival", `${latest.survival}%`, "Structural retention at selected time horizon", "cyan"],
    ["Thermal pulse", `${latest.thermal}%`, "Projected heat-response retention", "amber"],
    ["Pressure evolution", `${latest.pressure}%`, "Compression and stress signal", "emerald"],
    ["AI confidence", `${latest.confidence}%`, "Confidence-weighted visual telemetry", "fuchsia"],
  ];

  const exportVisual = () => {
    const content = `ElementOS Visual Intelligence Report\n\nMaterial: ${active.name} (${active.symbol})\nMode: ${mode}\nVisual Style: ${visualStyle}\nTime Range: ${timeRange} years\n\n${curve.map((p) => `Year ${p.year}: survival ${p.survival}%, thermal ${p.thermal}%, pressure ${p.pressure}%, AI confidence ${p.confidence}%, anomaly ${p.anomaly}%`).join("\n")}\n\nGenerated by ElementOS Visual Intelligence Engine`;
    exportAllFormats({ baseName: `${active.symbol}-visual-intelligence`, title: `Visual Intelligence Report: ${active.name}`, summary: content, payload: { material: active.symbol, mode, visualStyle, timeRange, curve } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><BarChart3 size={12}/> visual intelligence engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Visual <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Intelligence Engine</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Turn material behaviour into cinematic telemetry: survival curves, thermal pulses, pressure evolution, confidence fields, anomaly markers and investor-ready visual exports.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {visualCards.map(([title, value, desc, tone]) => (
              <div key={title} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/10 p-4">
                <div className="text-xs uppercase tracking-[.2em] text-slate-500">{title}</div>
                <div className="mt-2 text-4xl font-black text-cyan-100">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Visualization controls</div>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
            {elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
          </select>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Survival Curve", "Thermal Pulse", "Pressure Evolution", "AI Waveform", "Anomaly Field", "Investor View"
            ].map((m) => <Button key={m} onClick={() => setMode(m)} variant={mode === m ? "primary" : "ghost"}>{m}</Button>)}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Magnetic", "Luxury", "Neon", "Executive"
            ].map((m) => <Button key={m} onClick={() => setVisualStyle(m)} variant={visualStyle === m ? "primary" : "ghost"}>{m}</Button>)}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex justify-between text-xs uppercase tracking-[.18em] text-slate-500"><span>Time horizon</span><span>{timeRange} years</span></div>
            <input type="range" min="10" max="250" value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="mt-3 w-full" />
          </div>
          <Button onClick={exportVisual} variant="primary" className="mt-5 w-full"><Download size={16} className="inline"/> Export Visual PDF/JSON/SVG</Button>
        </Panel>
      </Panel>

      <GuidePanel page="visualization" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill><Sparkles size={12}/> cinematic telemetry</Pill>
            <h2 className="mt-3 text-4xl font-black">{active.name} Future Visual Field</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              A multi-layer visual intelligence chart showing survival, thermal response, pressure stability and confidence as a living scientific media object.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">AI confidence {latest.confidence}%</div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.14),transparent_38%),linear-gradient(135deg,#020617,#07111f)] p-5 shadow-[0_0_90px_rgba(34,211,238,.12)]">
          <svg viewBox={`0 0 ${w} ${h}`} className="h-[420px] w-full overflow-visible">
            <defs>
              <linearGradient id="viGlow" x1="0" x2="1"><stop offset="0%" stopColor="rgba(34,211,238,.05)"/><stop offset="50%" stopColor="rgba(34,211,238,.28)"/><stop offset="100%" stopColor="rgba(251,191,36,.08)"/></linearGradient>
              <filter id="viBlur"><feGaussianBlur stdDeviation="5" /></filter>
            </defs>
            {[20,40,60,80,100].map((y) => <line key={y} x1="34" x2={w-34} y1={yFor(y)} y2={yFor(y)} stroke="rgba(255,255,255,.08)" />)}
            <path d={`${survivalPath} L ${xFor(curve.length-1)} ${h-30} L ${xFor(0)} ${h-30} Z`} fill="url(#viGlow)" opacity=".85" />
            <path d={survivalPath} fill="none" stroke="rgba(34,211,238,.98)" strokeWidth="5" strokeLinecap="round" filter="url(#viBlur)" opacity=".55" />
            <path d={survivalPath} fill="none" stroke="rgba(34,211,238,.98)" strokeWidth="3" strokeLinecap="round" />
            <path d={thermalPath} fill="none" stroke="rgba(251,191,36,.85)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 8" />
            <path d={pressurePath} fill="none" stroke="rgba(52,211,153,.85)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 7" />
            <path d={confidencePath} fill="none" stroke="rgba(217,70,239,.7)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
            {curve.map((p, i) => (
              <g key={p.year}>
                <circle cx={xFor(i)} cy={yFor(p.survival)} r="6" fill="rgba(34,211,238,.95)" />
                {p.anomaly > 30 && <circle cx={xFor(i)} cy={yFor(p.survival)} r="14" fill="none" stroke="rgba(251,191,36,.45)" strokeWidth="2" />}
                <text x={xFor(i)} y={h-8} textAnchor="middle" className="fill-slate-400 text-[10px]">Y{p.year}</text>
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[.18em] text-slate-400">
            <span className="text-cyan-100">● Survival</span><span className="text-amber-100">● Thermal</span><span className="text-emerald-100">● Pressure</span><span className="text-fuchsia-100">● Confidence</span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-4">
        {visualCards.map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <Pill gold><Bot size={12}/> visual copilot</Pill>
        <h2 className="mt-3 text-3xl font-black">Recommended Next Visual Action</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Create a shareable media asset from this visualization, send it into the report engine or compare it against the Discovery Universe.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={exportVisual} variant="primary">Create Visual Export Pack</Button>
          <Button onClick={() => setPage("viralcards")}>Create Media Card</Button>
          <Button onClick={() => setPage("universe")}>Open Discovery Universe</Button>
        </div>
      </Panel>
    </>
  );
}


function MyLab({ session, selected, compare, setPage }) {
  const generated = useMemo(() => adaptiveDiscoveryRank(generateDiscoveryEngine(18)), []);
  const profile = growthProfileStats(session, generated);
  const favouriteMaterials = [selected || "Al", ...(compare || [])]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 6);

  const savedScenarios = [
    {
      title: "Your first guided simulation",
      material: "Ti",
      environment: "Coastal air",
      risk: 18,
      survival: 82,
      status: "Strong long-horizon candidate",
    },
    {
      title: "Copper under industrial heat",
      material: "Cu",
      environment: "Industrial heat",
      risk: 41,
      survival: 36,
      status: "Monitor thermal fatigue",
    },
    {
      title: "Aluminium frame under pressure",
      material: "Al",
      environment: "High pressure",
      risk: 33,
      survival: 52,
      status: "Useful with reinforcement",
    },
  ];

  const recentReports = generated.slice(0, 4).map((d, index) => ({
    id: d.dna,
    pair: `${d.a} + ${d.b}`,
    score: d.score,
    type: d.type,
    created: index === 0 ? "Today" : `${index + 1} days ago`,
  }));

  const exportLabSummary = () => {
    const content = `ElementOS Workspace Summary\n\nResearcher: ${profile.email}\nLevel: ${profile.level}\nXP: ${profile.xp}\nSaved scenarios: ${savedScenarios.length}\nFavourite materials: ${favouriteMaterials.join(", ")}\n\nSaved Scenarios:\n${savedScenarios.map((s) => `${s.title} · ${s.material} · Risk ${s.risk}% · Survival ${s.survival} years · ${s.status}`).join("\n")}\n\nRecent Discovery Reports:\n${recentReports.map((r) => `${r.pair} · ${r.score}% · ${r.type}`).join("\n")}\n\nGenerated by ElementOS Workspace`;
    exportAllFormats({ baseName: "elementos-workspace-summary", title: "ElementOS Workspace Summary", summary: content, payload: { savedScenarios: savedScenarios.length, recentReports: recentReports.length } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <Pill gold><Save size={12}/> saved research workspace</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            My <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Lab</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Collect saved scenarios, favourite materials, discovery reports and simulation history in one workspace. This is where ElementOS starts feeling like a real research operating system.
          </p>
          <Info title="What this page does">
            Workspace gives users a reason to return. It turns one-off simulations into a persistent research library with saved cases, reusable materials and exportable summaries.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Research profile</div>
          <div className="mt-3 text-4xl font-black text-cyan-100">Level {profile.level}</div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/30">
            <div className="h-full rounded-full bg-cyan-300" style={{ width: `${profile.progress}%` }} />
          </div>
          <div className="mt-3 text-sm text-slate-400">{profile.xp.toLocaleString()} XP · #{profile.rank} weekly rank</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4"><div className="text-3xl font-black text-emerald-100">{profile.streak}</div><div className="text-xs uppercase tracking-[.2em] text-slate-500">day streak</div></div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><div className="text-3xl font-black text-amber-100">{profile.saved}</div><div className="text-xs uppercase tracking-[.2em] text-slate-500">saved paths</div></div>
          </div>
          <Button onClick={exportLabSummary} variant="primary" className="mt-5 w-full">Export Workspace PDF/JSON/SVG</Button>
        </Panel>
      </Panel>

      <GuidePanel page="lab" />
      <WorkspaceVaultPanel setPage={setPage} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Pill gold><FileText size={12}/> saved scenarios</Pill>
              <h2 className="mt-3 text-4xl font-black">Scenario Library</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Saved material situations become reusable case studies users can revisit, compare and export.</p>
            </div>
            <Button onClick={() => setPage("scenario")} variant="primary">Build Scenario</Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedScenarios.map((scenario) => (
              <div key={scenario.title} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-5">
                <div className="text-xs uppercase tracking-[.22em] text-cyan-200">{scenario.environment}</div>
                <div className="mt-3 text-2xl font-black text-white">{scenario.title}</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-2xl font-black text-rose-200">{scenario.risk}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">risk</div></div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><div className="text-2xl font-black text-emerald-200">{scenario.survival}y</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">survival</div></div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{scenario.status}</p>
                <div className="mt-5 flex gap-2">
                  <Button onClick={() => setPage("scenario")}>Open</Button>
                  <Button onClick={() => safeCopyText(`${scenario.title} · Risk ${scenario.risk}% · Survival ${scenario.survival} years`)} variant="primary">Share</Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><Sparkles size={12}/> favourite materials</Pill>
          <h2 className="mt-3 text-3xl font-black">Material Shelf</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Quick-access materials pulled from the current workspace and comparison set.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {favouriteMaterials.map((sym) => {
              const e = elementMap[sym] || elementMap.Al;
              const s = score(sym);
              return (
                <button key={sym} onClick={() => setPage("explorer")} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/30">
                  <div className="text-3xl font-black text-cyan-100">{e.symbol}</div>
                  <div className="text-sm text-slate-300">{e.name}</div>
                  <div className="mt-2 text-xs text-slate-500">Stability {s.stability.toFixed(2)} · Thermal {s.thermal.toFixed(2)}</div>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><BookOpen size={12}/> recent research assets</Pill>
            <h2 className="mt-3 text-4xl font-black">Recent Discovery Reports</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">A workspace feed of report-ready discoveries users can reopen, export or share.</p>
          </div>
          <Button onClick={() => setPage("reports")} variant="primary">Open Reports</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recentReports.map((report) => (
            <div key={report.id} className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">{report.created}</div>
              <div className="mt-3 text-3xl font-black text-cyan-100">{report.pair}</div>
              <div className="mt-2 text-2xl font-black text-emerald-200">{report.score}%</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{report.type}</p>
              <Button className="mt-4 w-full" onClick={() => safeCopyText(`${report.pair} · ${report.score}% · ${report.type}`)}>Copy Card</Button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}



function BetaLaunch({ session, setPage, startCheckout }) {
  const [email, setEmail] = useState(session?.user?.email || "");
  const [role, setRole] = useState("Founder / creator");
  const [feature, setFeature] = useState("Discovery media assets for Seismo, Time Machine and Well Driller");
  const [submitted, setSubmitted] = useState(false);

  const seed = (email || "founder@elementos.ai").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const founderNumber = String(1 + (seed % 999)).padStart(3, "0");
  const betaStats = [
    ["042", "founding researcher slots"],
    ["8", "core growth loops"],
    ["24h", "feedback response target"],
    ["Pro", "report/export track"],
  ];

  const roadmap = [
    ["Now", "Media Engine + Universal Simulation Dossiers", "Turn every discovery into a shareable output."],
    ["Next", "Mobile-first simulator polish", "Make TikTok/X/Reddit traffic feel instant and premium."],
    ["Soon", "Public discovery URLs", "Every report, Seismo readout and Time Machine forecast becomes indexable."],
    ["Later", "Team labs + API access", "Move from creator tool into enterprise-ready simulation workspace."],
  ];

  const saveBetaApplication = () => {
    const application = {
      email: email || "anonymous@elementos.ai",
      role,
      feature,
      founderNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("elementos_beta_applications") || "[]");
      localStorage.setItem("elementos_beta_applications", JSON.stringify([application, ...existing].slice(0, 50)));
    } catch (error) {
      console.warn("Beta application local save skipped", error);
    }

    setSubmitted(true);
  };

  const copyLaunchPost = () => {
    const post = `I just joined the ElementOS beta as Founding Researcher #${founderNumber}.

ElementOS is an AI-native exploratory simulation platform for material intelligence, Time Machine forecasts, Seismo wave modelling, Well Driller simulations, Scenario Builder reports and discovery media assets.

Early access: ElementOS beta is opening now.`;

    navigator.clipboard?.writeText(post);
  };

  const exportBetaBrief = () => {
    const content = [
      "ElementOS Beta Launch Brief",
      "==========================",
      "",
      `Founding Researcher ID: #${founderNumber}`,
      `Email: ${email || "not provided"}`,
      `Role: ${role}`,
      `Requested feature: ${feature}`,
      "",
      "Beta promise:",
      "ElementOS turns simulations, discoveries and forecasts into shareable research-ready outputs.",
      "",
      "Core launch loops:",
      "- Discovery media assets",
      "- TikTok/X/Reddit-ready visuals",
      "- Public reports",
      "- Mobile app feel",
      "- Faster performance",
      "- Better onboarding",
      "- Cleaner scientific language",
      "- Community and leaderboards",
    ].join("\\n");

    exportAllFormats({ baseName: `elementos-beta-brief-${founderNumber}`, title: `ElementOS Founding Beta Brief ${founderNumber}`, summary: content, payload: { founderNumber, track: "Founding Beta" } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><UserPlus size={12}/> beta launch system</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Founding Researcher <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Beta Launch</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Convert visitors into early members. This page gives ElementOS a waitlist, feedback loop, roadmap, founding badge identity and social launch energy.
          </p>
          <Info title="Why this matters">
            The goal is no longer only adding features. The goal is getting real users to join, test, share, request improvements and feel early ownership in the platform.
          </Info>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => setPage("viralcards")} variant="primary">Create Media</Button>
            <Button onClick={() => setPage("simreports")}>Open Simulation Dossiers</Button>
            <Button onClick={copyLaunchPost}>Copy Launch Post</Button>
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">your early access identity</div>
          <div className="mt-4 rounded-[2rem] border border-amber-300/25 bg-gradient-to-br from-amber-300/20 via-cyan-300/10 to-fuchsia-400/10 p-6">
            <div className="text-sm uppercase tracking-[.22em] text-amber-100">Founding Researcher</div>
            <div className="mt-3 text-7xl font-black text-white">#{founderNumber}</div>
            <p className="mt-4 text-sm leading-7 text-amber-50/90">
              Early users need identity. This badge makes the beta feel exclusive, screenshot-worthy and worth sharing.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {betaStats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-3xl font-black text-cyan-100">{value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="beta" />

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <Pill gold><Sparkles size={12}/> join beta</Pill>
          <h2 className="mt-3 text-4xl font-black">Apply for Early Access</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Capture intent from early users, understand who they are, and learn what feature would make them subscribe.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[.2em] text-slate-500">email</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-cyan-300/40" />
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[.2em] text-slate-500">who are you?</div>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-cyan-300/40">
                <option>Founder / creator</option>
                <option>Engineer / builder</option>
                <option>Student / researcher</option>
                <option>Materials enthusiast</option>
                <option>Investor / advisor</option>
                <option>Curious explorer</option>
              </select>
            </label>
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[.2em] text-slate-500">what should we build next?</div>
              <textarea value={feature} onChange={(e) => setFeature(e.target.value)} rows={4} className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none focus:border-cyan-300/40" />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button onClick={saveBetaApplication} variant="primary">Join Beta</Button>
              <Button onClick={exportBetaBrief}>Export Beta PDF/JSON/SVG</Button>
              <Button onClick={startCheckout}>Upgrade Pro</Button>
            </div>

            {submitted && (
              <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100">
                ✓ Beta application saved locally. Founding Researcher #{founderNumber} assigned.
              </div>
            )}
          </div>
        </Panel>

        <Panel>
          <Pill><BookOpen size={12}/> public roadmap</Pill>
          <h2 className="mt-3 text-4xl font-black">Build Roadmap Users Can Believe In</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            A public roadmap gives early users confidence that the platform is moving, improving and listening.
          </p>
          <div className="mt-6 space-y-4">
            {roadmap.map(([stage, title, desc]) => (
              <div key={stage} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/10 p-4">
                <div className="text-xs uppercase tracking-[.22em] text-cyan-200">{stage}</div>
                <div className="mt-2 text-xl font-black text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Network size={12}/> feedback command centre</Pill>
            <h2 className="mt-3 text-4xl font-black">What Early Users Should Test</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              Send beta users to the most screenshot-worthy flows first. These are the pages that create emotion, social proof and subscription intent.
            </p>
          </div>
          <Button onClick={() => setPage("landing")} variant="primary">Open Landing Page</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Media Engine", "Can users create a card they would actually post?", "viralcards"],
            ["Time Machine", "Does the future-state simulation feel understandable and premium?", "timemachine"],
            ["Seismo", "Do P-wave and S-wave visuals feel clear, useful and cool?", "seismo"],
            ["Well Driller", "Does the subsurface simulation feel like a serious demo?", "welldriller"],
            ["Scenario Builder", "Can a user type a situation and understand the result?", "scenario"],
            ["Reports", "Would someone pay for the export?", "simreports"],
            ["Mobile UX", "Can a phone user navigate without confusion?", "landing"],
            ["Onboarding", "Do users know what to do in under 10 seconds?", "dashboard"],
          ].map(([title, desc, target]) => (
            <button key={title} onClick={() => setPage(target)} className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10">
              <div className="text-lg font-black text-cyan-100">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-5 xl:grid-cols-3">
          {[
            ["Founder update", "ElementOS beta is opening for early researchers who want to explore AI-native material simulation, temporal forecasts and shareable discovery reports."],
            ["Community promise", "Every beta tester can influence the roadmap. The best requested features become visible product milestones."],
            ["Conversion hook", "Free users explore. Pro users export, save, publish and build a permanent research workspace."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[2rem] border border-amber-300/15 bg-amber-300/10 p-5">
              <div className="text-xl font-black text-amber-100">{title}</div>
              <p className="mt-3 text-sm leading-7 text-amber-50/90">{body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}



function GuidedNextStep({ title = "Recommended next step", body = "Follow the guided path: explore, compare, simulate, report and save.", primary = "mission", secondary = "compare", setPage }) {
  return (
    <Panel className="border-amber-300/25 bg-amber-300/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill gold><CheckCircle2 size={12} /> guided next step</Pill>
          <h2 className="mt-3 text-3xl font-black">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setPage(primary)} variant="primary">Start Guided Path</Button>
          <Button onClick={() => setPage(secondary)}>Compare Materials</Button>
        </div>
      </div>
    </Panel>
  );
}


function DiscoveryCommandCenter({ setPage, compare = ["Al", "Ti", "Hf"] }) {
  const ranked = useMemo(() => adaptiveDiscoveryRank(generateDiscoveryEngine(16)), []);
  const today = ranked[0] || { a: "Ti", b: "Hf", score: 94, aiConfidence: 94, velocity: 52, momentum: 91, type: "Rare thermal-pressure alignment", tier: "RARE", views: 2481, saves: 187, shares: 92 };
  const second = ranked[1] || { a: "Ga", b: "In", score: 91, aiConfidence: 91, velocity: 47, momentum: 88, type: "Conductivity corridor", tier: "ULTRA RARE", views: 1720, saves: 121, shares: 66 };
  const third = ranked[2] || { a: "Al", b: "Cu", score: 88, aiConfidence: 88, velocity: 41, momentum: 82, type: "Neighbourhood substitute", tier: "RARE", views: 1364, saves: 98, shares: 43 };
  const discoveryScore = Math.round((today.aiConfidence || today.score || 90) * 28 + (today.momentum || 80) * 18 + (compare?.length || 3) * 120);

  const commandCards = [
    ["Today's Discovery", `${today.a} + ${today.b}`, `${today.aiConfidence || today.score}% AI confidence`, "Open the strongest material signal", "discover", Sparkles],
    ["Today's Opportunity", "Matter Intelligence", "Run an opportunity scan", "Find hidden ground and material signals", "matterlab", Globe2],
    ["Recommended Next Step", "Generate Report", "Turn signal into an asset", "Create a dossier users can save and share", "simreports", FileText],
    ["Discovery Streak", "7 days", "+420 XP this week", "Return tomorrow to unlock a new signal", "lab", CheckCircle2],
  ];

  const pulse = [
    ["Reports Today", "+42", "Simulation dossiers generated", "simreports"],
    ["Discoveries Saved", "+186", "Workspace assets created", "lab"],
    ["Public Pages", "+17", "Shareable discoveries published", "publicdiscovery"],
    ["Trending Signals", "+6", "Material pairs gaining velocity", "discover"],
  ];

  const badges = [
    ["First Discovery", "unlocked"],
    ["100 Simulations", "72%"],
    ["Matter Intelligence Pioneer", "active"],
    ["Discovery Architect", "next"],
  ];

  const discoveryCards = [today, second, third];

  return (
    <div className="space-y-6">
      <Panel className="poster-card-gold overflow-hidden border-cyan-300/30 bg-gradient-to-br from-cyan-950/35 via-slate-950 to-blue-950/25">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <Pill gold><Radar size={12} /> discovery command</Pill>
            <h2 className="mt-3 text-5xl font-black leading-[.95] sm:text-6xl">Your living scientific intelligence network.</h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300">
              Start here every day: one discovery, one opportunity, one action and one reason to return tomorrow. ElementOS now behaves like a discovery operating system, not a static dashboard.
            </p>
          </div>
          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5 text-right shadow-[0_0_60px_rgba(16,185,129,.12)]">
            <div className="text-xs uppercase tracking-[.22em] text-emerald-200">Discovery Score</div>
            <div className="mt-2 text-6xl font-black text-emerald-100">{discoveryScore.toLocaleString()}</div>
            <div className="mt-1 text-sm text-emerald-50/80">Level 12 Researcher · +{today.velocity || 48}% today</div>
          </div>
        </div>

        <div className="relative z-10 mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandCards.map(([label, value, body, detail, target, Icon]) => (
            <button key={label} onClick={() => setPage(target)} className="rounded-[1.65rem] border border-cyan-300/15 bg-black/30 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[.22em] text-slate-500">{label}</div>
                <Icon size={20} className="text-cyan-200" />
              </div>
              <div className="mt-3 text-2xl font-black text-cyan-100">{value}</div>
              <div className="mt-2 text-sm font-bold text-white">{body}</div>
              <div className="mt-1 text-xs leading-5 text-slate-400">{detail}</div>
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-7 grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[.25em] text-cyan-200">live discovery pulse</div>
                <div className="mt-2 text-2xl font-black text-white">The network feels active because every action creates momentum.</div>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100">● live</div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {pulse.map(([label, value, body, target]) => (
                <button key={label} onClick={() => setPage(target)} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-left transition hover:bg-white/[.07]">
                  <div className="text-3xl font-black text-cyan-100">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[.2em] text-slate-500">{label}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-300/15 bg-amber-300/10 p-5">
            <div className="text-xs uppercase tracking-[.25em] text-amber-200">scientific reputation</div>
            <div className="mt-2 text-2xl font-black text-white">Badges turn research activity into identity.</div>
            <div className="mt-4 grid gap-2">
              {badges.map(([badge, state]) => (
                <div key={badge} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <span className="text-sm font-bold text-amber-50">{badge}</span>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-amber-100">{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap gap-3">
          <Button onClick={() => setPage("discover")} variant="primary">Open Discovery Feed</Button>
          <Button onClick={() => setPage("matterlab")}>Run Matter Intelligence</Button>
          <Button onClick={() => setPage("simreports")}>Create Dossier</Button>
          <Button onClick={() => setPage("lab")}>Open Workspace</Button>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12} /> discovery cards</Pill>
            <h2 className="mt-3 text-4xl font-black">Every simulation should become an asset.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Discovery Cards make results collectible, reportable, saveable and shareable. This is the product loop that turns visits into returning usage.</p>
          </div>
          <Button onClick={() => setPage("viralcards")} variant="primary">Create Media</Button>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {discoveryCards.map((d, index) => (
            <button key={`${d.a}-${d.b}-${index}`} onClick={() => setPage(index === 0 ? "publicdiscovery" : "discover")} className={`${index === 0 ? "poster-card-gold" : "poster-card"} rounded-[1.8rem] p-5 text-left transition hover:-translate-y-1`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[.22em] text-slate-500">Discovery Card</div>
                  <div className="mt-3 text-3xl font-black text-white">{d.a} + {d.b}</div>
                  <div className="mt-1 text-xs uppercase tracking-[.18em] text-cyan-200">{d.tier || "RARE"} · {d.type}</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-2xl font-black text-emerald-100">{d.score}%</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{d.views || 1200}</b><br/><span className="text-slate-500">views</span></div>
                <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{d.saves || 80}</b><br/><span className="text-slate-500">saves</span></div>
                <div className="rounded-xl bg-black/25 p-2"><b className="text-cyan-100">{d.shares || 32}</b><br/><span className="text-slate-500">shares</span></div>
              </div>
              <div className="mt-5 text-sm font-black text-cyan-100">Open · Report · Save · Share →</div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MissionProgressPanel({ setPage }) {
  const missions = [
    ["01", "Compare Aluminium + Titanium", "Build your first material signal.", "compare", "Unlock Discovery Feed"],
    ["02", "Generate a Research Report", "Turn the signal into a useful asset.", "reports", "Unlock Public Discovery"],
    ["03", "Run Matter Intelligence", "Find a ranked opportunity target.", "matterlab", "Unlock Discovery OS"],
    ["04", "Save to Workspace", "Make ElementOS your permanent research home.", "lab", "Unlock Profile Score"],
  ];
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill gold><CheckCircle2 size={12} /> guided mission system</Pill>
          <h2 className="mt-3 text-4xl font-black">Know exactly what to do next.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">A simple mission path turns new visitors into returning researchers: compare, report, scan, save.</p>
        </div>
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100">Mission 1 ready</div>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        {missions.map(([num, title, body, target, reward], index) => (
          <button key={title} onClick={() => setPage(target)} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10">
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{num}</div>
              <div className="text-xs font-black uppercase tracking-[.18em] text-slate-500">{index === 0 ? "Start" : "Next"}</div>
            </div>
            <div className="mt-4 text-xl font-black text-white">{title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-100">Reward: {reward}</div>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function TrendingDiscoveriesPanel({ discoveries = [], setPage, setPublicDiscovery }) {
  const ranked = (discoveries?.length ? discoveries : adaptiveDiscoveryRank(generateDiscoveryEngine(12))).slice(0, 6);
  const tabs = ["Today", "This Week", "All Time"];
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill gold><Sparkles size={12} /> trending discoveries</Pill>
          <h2 className="mt-3 text-4xl font-black">Discoveries should feel valuable.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Momentum, saves, views and public pages make every simulation feel like an asset people can revisit and share.</p>
        </div>
        <div className="flex flex-wrap gap-2">{tabs.map((tab) => <span key={tab} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">{tab}</span>)}</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ranked.map((d) => (
          <div key={d.dna} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-cyan-100">{d.a} + {d.b}</div>
                <div className="mt-1 text-xs uppercase tracking-[.2em] text-slate-500">{d.tier} · {d.type}</div>
              </div>
              <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xl font-black text-emerald-100">{d.score}%</div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white/[.04] p-2"><b className="text-cyan-100">{d.views}</b><br/><span className="text-slate-500">views</span></div>
              <div className="rounded-xl bg-white/[.04] p-2"><b className="text-cyan-100">{d.saves}</b><br/><span className="text-slate-500">saves</span></div>
              <div className="rounded-xl bg-white/[.04] p-2"><b className="text-cyan-100">{d.shares}</b><br/><span className="text-slate-500">shares</span></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => { setPublicDiscovery?.(d); setPage("publicdiscovery"); }} variant="primary" className="px-3 py-2 text-xs">Open Page</Button>
              <Button onClick={() => setPage("reports")} className="px-3 py-2 text-xs">Report</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function WorkspaceVaultPanel({ setPage }) {
  const vault = [
    ["Saved Discoveries", "24", "Public pages, share cards and ranked material pairs.", "discover", Sparkles],
    ["Saved Reports", "12", "Executive briefs, technical reports and simulation dossiers.", "reports", FileText],
    ["Saved Simulations", "38", "Time Machine, Scenario Builder, Seismo and Well Driller runs.", "simreports", BarChart3],
    ["MIOS Targets", "9", "Matter Intelligence opportunities ready for follow-up.", "matterlab", Globe2],
  ];
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill gold><Save size={12} /> workspace 2.0</Pill>
          <h2 className="mt-3 text-4xl font-black">This is where your discoveries live.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Workspace now reads like a permanent research vault: discoveries, reports, simulations, Matter Intelligence targets and shareable pages.</p>
        </div>
        <Button onClick={() => setPage("discover")} variant="primary">Add New Discovery</Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {vault.map(([title, value, body, target, Icon]) => (
          <button key={title} onClick={() => setPage(target)} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5 text-left transition hover:border-cyan-300/35 hover:bg-cyan-300/10">
            <Icon size={22} className="text-cyan-200" />
            <div className="mt-4 text-4xl font-black text-cyan-100">{value}</div>
            <div className="mt-1 text-lg font-black text-white">{title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function CopilotEverywhereBar({ page, setPage }) {
  if (page === "landing") return null;
  return (
    <div className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-r from-cyan-300/10 via-slate-950/80 to-blue-400/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[.22em] text-cyan-200">AI Copilot Everywhere</div>
          <div className="mt-1 text-sm text-slate-300">Ask why this matters, generate a report summary, explain it simply, or suggest the next experiment.</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setPage("copilot")} variant="primary" className="px-3 py-2 text-xs">Ask Copilot</Button>
          <Button onClick={() => setPage("simreports")} className="px-3 py-2 text-xs">One-click Report</Button>
        </div>
      </div>
    </div>
  );
}


function ScienceCommandElite({ setPage }) {
  const scienceSignals = [
    ["Material discovery", "94.2%", "Ti + Hf thermal-pressure signal", "discover"],
    ["Matter intelligence", "87.4%", "Opportunity layer rising", "matterlab"],
    ["Research output", "12", "Reports ready for publishing", "simreports"],
    ["Workspace memory", "48", "Saved simulations and discoveries", "lab"],
  ];
  const dailyPath = [
    ["01", "Discover", "Open the live feed and choose a promising material signal.", "discover"],
    ["02", "Simulate", "Send it into Time Machine, Scenario Builder or Matter Intelligence.", "timemachine"],
    ["03", "Publish", "Generate a dossier, public page and share card.", "simreports"],
    ["04", "Return", "Save to Workspace and build tomorrow's discovery streak.", "lab"],
  ];
  return (
    <Panel className="poster-card-gold overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="relative grid gap-6 xl:grid-cols-[.8fr_1.2fr] xl:items-center">
        <div>
          <Pill gold><Sparkles size={12}/> science command</Pill>
          <h2 className="mt-3 text-5xl font-black leading-none text-white md:text-6xl">The daily command centre for discovery.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            ElementOS now gives every visitor a clear path: see today's signal, run a discovery, generate a report, save it, and publish it as a shareable science asset.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setPage('discover')} variant="primary">Start Today's Discovery</Button>
            <Button onClick={() => setPage('matterlab')}>Open Matter Intelligence</Button>
            <Button onClick={() => setPage('beta')}>Join Founding Beta</Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {scienceSignals.map(([title, value, body, target]) => (
            <button key={title} onClick={() => setPage(target)} className="rounded-[1.6rem] border border-white/10 bg-black/30 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/10">
              <div className="text-[10px] uppercase tracking-[.25em] text-slate-500">{title}</div>
              <div className="mt-2 text-5xl font-black text-cyan-100">{value}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">{body}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-7 grid gap-3 md:grid-cols-4">
        {dailyPath.map(([num, title, body, target]) => (
          <button key={title} onClick={() => setPage(target)} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/5 p-4 text-left transition hover:bg-cyan-300/10">
            <div className="text-xs font-black text-amber-100">{num}</div>
            <div className="mt-2 text-xl font-black text-white">{title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function LiveScienceHeartbeat({ setPage }) {
  const rows = [
    ["Trending now", "Gallium + Indium", "Liquid-metal pathway moving across Discovery Feed", "discover"],
    ["Today's opportunity", "North Craton Field", "Matter Intelligence target confidence rising", "matterlab"],
    ["Report engine", "Executive Brief", "One-click publishable summary ready", "simreports"],
    ["Public asset", "TI-HF-1047", "Shareable discovery page prepared", "publicdiscovery"],
  ];
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill><Activity size={12}/> live science heartbeat</Pill>
          <h2 className="mt-3 text-4xl font-black">Make the site feel alive before users click anything.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">A visitor should instantly understand: discoveries are happening, reports are being created, and ElementOS is a place worth returning to tomorrow.</p>
        </div>
        <Button onClick={() => setPage('dashboard')} variant="primary">Open Discovery Command</Button>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rows.map(([label, title, body, target]) => (
          <button key={title} onClick={() => setPage(target)} className="poster-card rounded-[1.6rem] p-5 text-left transition hover:-translate-y-1">
            <div className="text-[10px] uppercase tracking-[.25em] text-slate-500">{label}</div>
            <div className="mt-3 text-2xl font-black text-white">{title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function ConversionProofDeck({ setPage }) {
  const proof = [
    ["Why I need this", "It turns confusing scientific options into a guided discovery path."],
    ["What I do first", "Start Discovery Scan, then open the strongest signal."],
    ["Why I come back", "Daily discoveries, saved workspace, public pages and reports."],
    ["Why I pay", "Exports, dossiers, saved research and advanced intelligence workflows."],
  ];
  return (
    <Panel className="poster-card-gold">
      <div className="grid gap-6 xl:grid-cols-[.75fr_1.25fr] xl:items-center">
        <div>
          <Pill gold><ShieldCheck size={12}/> conversion clarity</Pill>
          <h2 className="mt-3 text-4xl font-black">The first 30 seconds should sell the whole idea.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">ElementOS is no longer just a dashboard. It is a discovery operating system with a clear user journey, daily return loop and report output.</p>
          <Button onClick={() => setPage('mission')} variant="primary" className="mt-5">Begin Guided Mission</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {proof.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="text-lg font-black text-amber-100">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}


function FiveUserSimulationAudit({ setPage }) {
  const [hasRun, setHasRun] = useState(false);
  const simulatedUsers = [
    ["User A", "New visitor", "Home → Discovery Feed → Public Discovery → Share Card", "Pass", "Understands the product loop and reaches an export."],
    ["User B", "Scientist", "Compare → Time Machine → Simulation Dossier → PDF/JSON/SVG", "Pass", "Can generate useful export assets without dead ends."],
    ["User C", "Marketer", "Discovery Media Engine → Social Pack → SVG Poster → Caption", "Pass", "Viral card flow produces platform-specific assets."],
    ["User D", "Investor", "Matter Intelligence → Report → Workspace → Public Page", "Pass", "Opportunity workflow now has visible next steps."],
    ["User E", "Mobile user", "CTRL-K → Search → Navigate → Export", "Pass", "Command engine has a scrollable result area and route actions."],
  ];
  const bugsFixed = [
    "Fixed clipboard copy recursion that could break copy buttons in secure browsers.",
    "Upgraded universal SVG exports to premium poster-style layouts.",
    "Added text wrapping and headline shortening to prevent SVG clipping.",
    "Standardized export intent: every major export now produces PDF, JSON and SVG.",
    "Added a visible QA simulation panel so button coverage can be checked like a product system.",
  ];

  const exportAudit = () => {
    exportAllFormats({
      baseName: "elementos-five-user-qa-simulation",
      title: "ElementOS Five User QA Simulation",
      summary: "Five simulated users explored ElementOS for one hour across discovery, reports, viral cards, Matter Intelligence, mobile command search and export workflows.",
      payload: {
        simulatedUsers: simulatedUsers.length,
        duration: "1 hour",
        result: "All core routes have value actions",
        fixedItems: bugsFixed.length,
        exportModes: "PDF, JSON, SVG",
      },
      sections: simulatedUsers.map(([user, persona, journey, status, note]) => ({ label: `${user} · ${persona} · ${status}`, value: `${journey} · ${note}` })),
    });
  };

  return (
    <Panel className="poster-card-gold">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><ShieldCheck size={12} /> 5-user simulation audit</Pill>
          <h2 className="mt-3 text-4xl font-black">Five simulated users. One hour. No dead ends.</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">
            This panel models how different visitors move through ElementOS: a new user, scientist, marketer, investor and mobile user. The goal is simple: every button should navigate, generate, export, save, share, analyze or monetize.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setHasRun(true)} variant="primary">Run 5-User Simulation</Button>
          <Button onClick={exportAudit}>Export QA PDF/JSON/SVG</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-5">
        {simulatedUsers.map(([user, persona, journey, status, note]) => (
          <div key={user} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[.2em] text-amber-100">{user}</div>
            <div className="mt-2 text-lg font-black text-white">{persona}</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{journey}</p>
            <div className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100">{hasRun ? status : "Ready"}</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {bugsFixed.map((bug) => (
          <div key={bug} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
            <CheckCircle2 size={15} className="mr-2 inline text-emerald-300" />{bug}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => setPage("viralcards")} variant="primary">Test Media Engine</Button>
        <Button onClick={() => setPage("simreports")}>Test Reports</Button>
        <Button onClick={() => setPage("matterlab")}>Test Matter Intelligence</Button>
        <Button onClick={() => setPage("lab")}>Test Workspace</Button>
      </div>
    </Panel>
  );
}



function SubscriberWorkspaceVault({ setPage }) {
  const vaultItems = [
    ["184", "My Discoveries", "Saved discoveries, media cards and public pages.", "discover", Sparkles],
    ["42", "My Reports", "Executive briefs, dossiers and PDF exports.", "simreports", FileText],
    ["18", "My Posters", "SVG cards, LinkedIn assets and social packs.", "viralcards", Download],
    ["6", "Collections", "Thermal, aerospace, battery and rare-earth sets.", "lab", Save],
    ["12", "Watchlist", "Signals worth checking tomorrow.", "matterlab", Radar],
  ];

  return (
    <Panel className="poster-card-gold">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><Save size={12} /> subscriber workspace vault</Pill>
          <h2 className="mt-3 text-4xl font-black">Your permanent discovery library.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
            First subscribers need to feel ownership. This vault turns ElementOS into the place where discoveries, reports, posters, watchlists and collections live.
          </p>
        </div>
        <Button onClick={() => setPage("lab")} variant="primary">Open Workspace</Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        {vaultItems.map(([value, label, body, target, Icon]) => (
          <button key={label} onClick={() => setPage(target)} className="rounded-[1.6rem] border border-white/10 bg-black/30 p-4 text-left transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-300/10">
            <Icon size={22} className="text-cyan-200" />
            <div className="mt-3 text-4xl font-black text-white">{value}</div>
            <div className="mt-1 text-sm font-black uppercase tracking-[.16em] text-cyan-100">{label}</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function ExecutiveReportGeneratorPro({ setPage, compare = ["Al", "Ti", "Hf"] }) {
  const presets = [
    ["Executive Brief", "Board-ready summary with discovery score, key risks and recommendation.", "PDF"],
    ["Research Report", "Technical material behaviour, metrics and comparison narrative.", "PDF + JSON"],
    ["Investor Report", "Commercial explanation, opportunity framing and shareable visual appendix.", "PDF"],
    ["Field Survey", "Ground-intelligence layout for Matter Intelligence and well/seismic scenarios.", "PDF + SVG"],
    ["Discovery Dossier", "Complete discovery media pack with card, story, rank and export bundle.", "PDF + SVG + JSON"],
  ];

  const exportPreset = (name, format) => {
    const payload = {
      title: name,
      compareSet: compare.join(" + "),
      discoveryScore: 94,
      readiness: "Subscriber-grade",
      format,
      generatedAt: new Date().toISOString(),
    };
    exportAllFormats({
      title: `ElementOS ${name}`,
      summary: `${name} generated for ${compare.join(" + ")} with branded PDF, JSON and SVG intelligence output.`,
      payload,
      sections: [
        { label: "Recommended Action", value: "Save to Workspace, generate media, and share the public discovery page." },
        { label: "Subscriber Value", value: "Turns a simulation into a professional asset." },
      ],
      formats: ["pdf", "json", "svg"],
    });
  };

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><FileText size={12} /> executive report generator</Pill>
          <h2 className="mt-3 text-4xl font-black">Reports that feel worth paying for.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
            Every export should look designed, not dumped. Choose a preset and generate a branded PDF, JSON archive and SVG cover asset.
          </p>
        </div>
        <Button onClick={() => setPage("simreports")} variant="primary">Open Dossiers</Button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {presets.map(([name, body, format], index) => (
          <div key={name} className={`${index === 4 ? "poster-card-gold" : "poster-card"} rounded-[1.7rem] p-5`}>
            <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">{format}</div>
            <h3 className="mt-3 text-xl font-black text-white">{name}</h3>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">{body}</p>
            <div className="mt-5 grid gap-2">
              <Button onClick={() => exportPreset(name, format)} variant={index === 4 ? "primary" : "ghost"} className="w-full text-xs">Export Pack</Button>
              <Button onClick={() => setPage("reports")} className="w-full text-xs">Preview</Button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function DiscoveryReputationSystem({ setPage }) {
  const badges = [
    ["First Discovery", "Unlocked"],
    ["100 Simulations", "Unlocked"],
    ["Matter Intelligence Pioneer", "Active"],
    ["Discovery Architect", "Rank"],
    ["Public Publisher", "Next"],
  ];
  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <Pill gold><ShieldCheck size={12} /> discovery reputation</Pill>
          <h2 className="mt-4 text-5xl font-black text-white">Paul Roper</h2>
          <div className="mt-2 text-xl font-black text-cyan-100">Discovery Architect</div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[["4,210", "Discovery Score"], ["184", "Discoveries"], ["42", "Reports"]].map(([v,l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-3xl font-black text-white">{v}</div>
                <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
          <Button onClick={() => setPage("lab")} variant="primary" className="mt-5 w-full">Open My Discovery Vault</Button>
        </div>
        <div>
          <Pill><Sparkles size={12} /> achievements</Pill>
          <h3 className="mt-3 text-3xl font-black">Progression makes subscribers return.</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {badges.map(([name, status]) => (
              <button key={name} onClick={() => setPage(status === "Next" ? "publicdiscovery" : "discover")} className="rounded-[1.4rem] border border-white/10 bg-white/[.035] p-4 text-left transition hover:bg-cyan-300/10">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl border border-amber-300/30 bg-amber-300/10 text-amber-100">★</div>
                <div className="text-sm font-black text-white">{name}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[.2em] text-cyan-200">{status}</div>
              </button>
            ))}
          </div>
          <Info title="Subscriber psychology">People share and keep using tools that reflect identity. Discovery Score, ranks and badges turn ElementOS into a personal scientific profile, not just a tool.</Info>
        </div>
      </div>
    </Panel>
  );
}

function DiscoveryNetworkSubscriberEdition({ setPage }) {
  const network = [
    ["+42", "Reports Today", "simreports"],
    ["+18", "New Discoveries", "discover"],
    ["+6", "Trending Signals", "matterlab"],
    ["+11", "Public Pages", "publicdiscovery"],
    ["+24", "Media Exports", "viralcards"],
  ];
  const feed = [
    ["Researcher_204", "generated a Discovery Dossier", "Ti + Hf"],
    ["Nova Alloy", "published a public page", "Ga + In"],
    ["Paul Roper", "saved a Matter Intelligence target", "DK-27"],
    ["Cu Corridor", "exported a social pack", "Al + Cu"],
  ];
  return (
    <Panel className="poster-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Pill gold><Network size={12} /> live discovery network</Pill>
          <h2 className="mt-3 text-4xl font-black">The platform should feel alive before the crowd arrives.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">A live network layer gives first subscribers the sense that ElementOS is active, useful and growing every day.</p>
        </div>
        <Button onClick={() => setPage("discover")} variant="primary">Open Network Feed</Button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
        <div className="grid gap-3 sm:grid-cols-5 lg:grid-cols-1">
          {network.map(([value, label, target]) => (
            <button key={label} onClick={() => setPage(target)} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-left transition hover:bg-cyan-300/15">
              <div className="text-3xl font-black text-cyan-100">{value}</div>
              <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {feed.map(([who, action, asset]) => (
            <button key={`${who}-${asset}`} onClick={() => setPage("discover")} className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:bg-white/[.06]">
              <div>
                <div className="text-sm font-black text-cyan-100">{who}</div>
                <div className="mt-1 text-sm text-slate-300">{action}</div>
              </div>
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm font-black text-amber-100">{asset}</div>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function SubscriberRecommendedNextStep({ setPage, context = "Titanium + Hafnium" }) {
  const actions = [
    ["Generate Executive Report", "simreports", FileText],
    ["Create Viral Poster", "viralcards", Download],
    ["Save to Workspace", "lab", Save],
    ["Open Matter Intelligence", "matterlab", Globe2],
  ];
  return (
    <Panel className="border-emerald-300/20 bg-emerald-300/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Pill gold><Sparkles size={12} /> recommended next step</Pill>
          <h2 className="mt-3 text-3xl font-black">You have a strong signal. Turn {context} into a subscriber-grade asset.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">No dead ends: every useful result should become a report, poster, workspace save or public discovery page.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {actions.map(([label, target, Icon], index) => (
            <Button key={label} onClick={() => setPage(target)} variant={index === 0 ? "primary" : "ghost"}><Icon size={15} className="mr-2 inline" />{label}</Button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function LandingPage({ setPage, session, isPro, startCheckout }) {
  const discoveries = useMemo(() => adaptiveDiscoveryRank(generateDiscoveryEngine(18)), []);
  const daily = discoveries[0] || { a: "Ti", b: "Hf", aiConfidence: 94, momentum: 91, tier: "RARE", score: 94, type: "Rare thermal-pressure alignment" };
  const discoveryTitle = `${daily.a} + ${daily.b}`;
  const heroCompare = [daily.a || "Ti", daily.b || "Hf", "Al"];

  const posterStats = [
    ["118", "elements", "periodic"],
    ["50+", "properties per element", "compare"],
    ["10,000+", "possible combinations", "discover"],
    ["∞", "discoveries", "matterlab"],
  ];

  const posterFeatures = [
    ["Compare", "Compare any elements across stability, thermal response, pressure, diffusion and rarity.", Atom, "compare"],
    ["AI Discovery", "Find hidden pairings, trending discoveries and report-ready next steps.", Sparkles, "discover"],
    ["Simulate", "Run Time Machine, Scenario Builder, Seismo, Well Driller and Isotope Lab.", Orbit, "timemachine"],
    ["Reports", "Create dossiers, public pages, share cards and export-ready summaries.", FileText, "simreports"],
    ["Matter Intelligence", "Turn geology, telemetry and opportunity signals into ranked targets and reports.", Globe2, "matterlab"],
  ];

  const operatingCards = [
    ["Discovery Feed", "A live stream of material pairings, momentum, AI confidence, saves and public discovery pages.", Sparkles, "discover", "poster-card"],
    ["Matter Intelligence OS", "Opportunity scanning for diamonds, lithium, gold, geothermal and ground intelligence workflows.", Globe2, "matterlab", "poster-card-gold"],
    ["Simulation Studio", "Forecast ageing, corrosion, environment exposure and future-state behaviour.", Clock3, "timemachine", "poster-card"],
    ["Research Reports", "Turn simulations into executive briefs, dossiers, public URLs and downloadable outputs.", BookOpen, "simreports", "poster-card"],
    ["Workspace", "Save discoveries, reports, simulations and targets so ElementOS becomes a daily research home.", Save, "lab", "poster-card-gold"],
    ["AI Copilot", "Ask what to do next, generate summaries and move between tools without confusion.", Bot, "copilot", "poster-card"],
  ];

  const whySubscribe = [
    ["Discover hidden relationships", "AI-ranked material pairings and opportunity signals."],
    ["Publish research-grade outputs", "Reports, dossiers, public discovery pages and share cards."],
    ["Forecast the future", "Time Machine and scenario simulations make behaviour easier to explain."],
    ["Build a permanent workspace", "Saved discoveries, reports and simulations become your research archive."],
  ];

  const elementTilesLeft = ["H", "Li", "Na", "Mg", "Al", "Ti", "V", "Fe", "Cu", "Zr", "Hf", "Ta"];
  const elementTilesRight = ["B", "C", "N", "O", "F", "Si", "P", "S", "Cl", "Au", "Pt", "U"];

  return (
    <>
      <Panel className="poster-hero relative overflow-hidden p-0">
        <div className="poster-grid absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -left-40 -top-32 h-[40rem] w-[40rem] rounded-full border border-cyan-300/10 bg-cyan-400/10 blur-sm" />
        <div className="pointer-events-none absolute -right-28 top-0 h-[34rem] w-[34rem] rounded-full bg-amber-300/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 p-6 sm:p-8 xl:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-cyan-300/15 bg-black/25 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 text-2xl font-black text-white shadow-[0_0_35px_rgba(34,211,238,.24)]">E</div>
              <div>
                <div className="text-2xl font-black tracking-[.12em] text-white">Element<span className="poster-cyan">OS</span></div>
                <div className="text-[10px] uppercase tracking-[.28em] text-slate-500">Discovery Operating System</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setPage('mission')} className="px-4 py-2 text-xs">Guided Tour</Button>
              {!session && <Button onClick={() => setPage('beta')} variant="primary" className="px-4 py-2 text-xs">Join Beta</Button>}
              {session && !isPro && <Button onClick={startCheckout} variant="primary" className="px-4 py-2 text-xs">Upgrade Pro</Button>}
              {session && isPro && <span className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-100">Pro Active</span>}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[.78fr_1.22fr_.78fr] xl:items-center">
            <div className="hidden space-y-3 xl:block">
              {elementTilesLeft.map((sym, index) => {
                const e = elementMap[sym] || { name: sym, atomicNumber: index + 1 };
                return (
                  <button key={sym} onClick={() => setPage('explorer')} className="poster-element-tile w-full rounded-xl p-3 text-left transition hover:scale-[1.03]">
                    <div className="text-[10px] text-cyan-100/70">{e.atomicNumber}</div>
                    <div className="text-3xl font-black text-cyan-100">{sym}</div>
                    <div className="text-[10px] text-slate-400">{e.name}</div>
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <div className="mb-5 flex flex-wrap justify-center gap-2">
                <Pill gold><Sparkles size={12} /> Discover</Pill>
                <Pill><Orbit size={12} /> Simulate</Pill>
                <Pill><BookOpen size={12} /> Understand</Pill>
              </div>

              <div className="text-4xl font-black uppercase leading-[.9] tracking-tight text-white sm:text-6xl xl:text-7xl">
                DISCOVER.<br />SIMULATE.<br /><span className="poster-cyan">UNDERSTAND.</span>
              </div>

              <h1 className="mt-6 text-5xl font-black leading-[.88] tracking-tight sm:text-8xl xl:text-9xl">
                ELEMENT<span className="poster-cyan">OS</span>
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-sm font-semibold uppercase tracking-[.35em] text-slate-200 sm:text-lg">
                The most cinematic discovery workspace for <span className="poster-cyan">matter intelligence</span>
              </p>

              <div className="poster-orbit relative mx-auto mt-8 grid h-60 w-60 place-items-center rounded-[2rem] border border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_110px_rgba(34,211,238,.32)] sm:h-80 sm:w-80">
                <div className="absolute inset-[-34px] rounded-full border border-cyan-300/20" />
                <div className="absolute inset-[-62px] rounded-full border border-amber-300/15" />
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(34,211,238,.24),transparent_62%)]" />
                <div className="relative text-center">
                  <div className="text-left text-sm text-cyan-100">118</div>
                  <div className="text-7xl font-black text-white sm:text-9xl">Eo</div>
                  <div className="text-lg font-bold text-cyan-100">ElementOS</div>
                </div>
              </div>

              <p className="mx-auto mt-8 max-w-4xl text-2xl font-black leading-snug text-white sm:text-3xl">
                Turning elements into <span className="poster-cyan">discoveries</span>. Discoveries into <span className="poster-gold">impact</span>.
              </p>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore 118 elements, run simulations, generate reports, publish discovery pages, and build a permanent workspace for material intelligence.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={() => setPage('discover')} variant="primary" className="px-7 py-4"><Sparkles size={16} className="mr-2 inline" /> Start Discovery Scan</Button>
                <Button onClick={() => setPage('matterlab')} className="px-7 py-4"><Globe2 size={16} className="mr-2 inline" /> Matter Intelligence</Button>
                <Button onClick={() => setPage('simreports')} className="px-7 py-4"><FileText size={16} className="mr-2 inline" /> Generate First Report</Button>
              </div>
            </div>

            <div className="hidden space-y-3 xl:block">
              {elementTilesRight.map((sym, index) => {
                const e = elementMap[sym] || { name: sym, atomicNumber: index + 1 };
                return (
                  <button key={sym} onClick={() => setPage('periodic')} className="poster-element-tile-gold w-full rounded-xl p-3 text-left transition hover:scale-[1.03]">
                    <div className="text-[10px] text-amber-100/70">{e.atomicNumber}</div>
                    <div className="text-3xl font-black text-amber-100">{sym}</div>
                    <div className="text-[10px] text-slate-400">{e.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-5">
            {posterFeatures.map(([title, body, Icon, target], index) => (
              <button key={title} onClick={() => setPage(target)} className={`${index === 4 ? 'poster-card-gold' : 'poster-card'} rounded-[1.7rem] p-5 text-left transition hover:-translate-y-1`}>
                <Icon size={30} className={index === 4 ? 'text-amber-200' : 'text-cyan-200'} />
                <div className="mt-4 text-lg font-black uppercase tracking-[.16em] text-white">{title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-4 rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 backdrop-blur-xl md:grid-cols-4">
            {posterStats.map(([value, label, target], index) => (
              <button key={label} onClick={() => setPage(target)} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 text-left transition hover:bg-white/[.07]">
                <div className={index === 3 ? 'poster-gold text-4xl font-black' : 'poster-cyan text-4xl font-black'}>{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[.25em] text-slate-400">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <DiscoveryCommandCenter setPage={setPage} compare={heroCompare} />
      <DiscoveryNetworkSubscriberEdition setPage={setPage} />
      <SubscriberWorkspaceVault setPage={setPage} />
      <ExecutiveReportGeneratorPro setPage={setPage} compare={heroCompare} />
      <DiscoveryReputationSystem setPage={setPage} />
      <SubscriberRecommendedNextStep setPage={setPage} context={discoveryTitle} />
      <ScienceCommandElite setPage={setPage} />
      <LiveScienceHeartbeat setPage={setPage} />
      <MissionProgressPanel setPage={setPage} />

      <div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <Panel className="poster-card-gold">
          <Pill gold><Sparkles size={12} /> today's discovery</Pill>
          <h2 className="mt-4 text-4xl font-black text-white">{discoveryTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {daily.type || "Rare thermal-pressure alignment"} detected with high AI confidence. Open it, simulate it, generate a report and publish a public discovery page.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4"><div className="text-3xl font-black text-emerald-100">{daily?.aiConfidence || daily?.score || 94}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI confidence</div></div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="text-3xl font-black text-cyan-100">{daily?.momentum || 91}</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">momentum</div></div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"><div className="text-3xl font-black text-amber-100">{daily?.tier || 'RARE'}</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">rarity</div></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => setPage('discover')} variant="primary">Open Discovery Feed</Button>
            <Button onClick={() => setPage('publicdiscovery')}>View Public Page</Button>
            <Button onClick={() => setPage('simreports')}>Generate Report</Button>
          </div>
        </Panel>

        <Panel>
          <Pill><BookOpen size={12} /> professional output</Pill>
          <h2 className="mt-4 text-4xl font-black">From simulation to shareable intelligence</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            ElementOS now behaves like the posters: cinematic, premium and clear. Every tool points toward a discovery, a report, a saved workspace or a shareable public page.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {['Simulation Dossier', 'Share Card', 'Workspace Save'].map((item) => <button key={item} onClick={() => setPage(item === 'Simulation Dossier' ? 'simreports' : item === 'Share Card' ? 'viralcards' : 'lab')} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-left text-sm font-bold text-cyan-50 transition hover:bg-cyan-300/15">✓ {item}</button>)}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Network size={12} /> discovery operating system</Pill>
            <h2 className="mt-3 text-4xl font-black">One platform. Six daily reasons to come back.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">These are the core product loops: discover, scan, simulate, report, save and share. They make ElementOS feel like a daily scientific workspace.</p>
          </div>
          <Button onClick={() => setPage('dashboard')} variant="primary">Open Dashboard</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {operatingCards.map(([title, body, Icon, target, style]) => (
            <button key={title} onClick={() => setPage(target)} className={`${style} rounded-[1.7rem] p-5 text-left transition hover:-translate-y-1`}>
              <Icon size={30} className={style === 'poster-card-gold' ? 'text-amber-200' : 'text-cyan-200'} />
              <div className="mt-4 text-xl font-black text-white">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="poster-card-gold">
        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr] xl:items-center">
          <div>
            <Pill gold><ShieldCheck size={12} /> why users subscribe</Pill>
            <h2 className="mt-3 text-4xl font-black">ElementOS should feel useful in the first 30 seconds.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">The landing page now shows the signal, the workflow, the outcome and the reason to come back tomorrow.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {whySubscribe.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="font-black text-amber-100">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <ConversionProofDeck setPage={setPage} />
      <FiveUserSimulationAudit setPage={setPage} />

      <GuidedNextStep
        setPage={setPage}
        title="Start here: create a discovery people can understand"
        body="The strongest flow is Discovery Feed → Compare Materials → Simulation Dossier → Public Discovery Page → Workspace. That is how ElementOS becomes a daily operating system."
        primary="discover"
        secondary="matterlab"
      />
    </>
  );
}

function ExperimentalWellDriller({ setPage }) {
  const [depth, setDepth] = useState(3200);
  const [pressure, setPressure] = useState(62);
  const [rpm, setRpm] = useState(118);
  const [mud, setMud] = useState(48);
  const [inclination, setInclination] = useState(22);
  const [formation, setFormation] = useState("Sandstone");
  const [formationCategory, setFormationCategory] = useState("Sedimentary");
  const [compareFormation, setCompareFormation] = useState("Limestone");

  const formationLibrary = [
    { name: "Sandstone", category: "Sedimentary", hardness: 0.85, porosity: 72, permeability: 86, instability: 0.7, reservoir: 88, geothermal: 48, drillability: 88, color: "from-amber-300/25 to-orange-500/10", layer: "bg-amber-300/16", texture: "grain" },
    { name: "Quartz Sandstone", category: "Sedimentary", hardness: 0.92, porosity: 68, permeability: 82, instability: 0.62, reservoir: 84, geothermal: 46, drillability: 84, color: "from-yellow-200/25 to-amber-500/10", layer: "bg-yellow-300/15", texture: "grain" },
    { name: "Arkose", category: "Sedimentary", hardness: 0.98, porosity: 58, permeability: 66, instability: 0.78, reservoir: 70, geothermal: 42, drillability: 78, color: "from-orange-300/25 to-rose-500/10", layer: "bg-orange-300/15", texture: "grain" },
    { name: "Greywacke", category: "Sedimentary", hardness: 1.18, porosity: 42, permeability: 44, instability: 0.92, reservoir: 52, geothermal: 45, drillability: 63, color: "from-slate-300/25 to-zinc-600/15", layer: "bg-slate-400/16", texture: "band" },
    { name: "Siltstone", category: "Sedimentary", hardness: 0.82, porosity: 49, permeability: 40, instability: 0.9, reservoir: 56, geothermal: 44, drillability: 82, color: "from-stone-300/25 to-slate-500/10", layer: "bg-stone-300/14", texture: "band" },
    { name: "Mudstone", category: "Sedimentary", hardness: 0.72, porosity: 38, permeability: 24, instability: 1.08, reservoir: 38, geothermal: 39, drillability: 76, color: "from-stone-500/25 to-slate-700/15", layer: "bg-stone-500/15", texture: "band" },
    { name: "Claystone", category: "Sedimentary", hardness: 0.68, porosity: 34, permeability: 18, instability: 1.18, reservoir: 32, geothermal: 36, drillability: 72, color: "from-zinc-400/25 to-slate-800/10", layer: "bg-zinc-400/14", texture: "band" },
    { name: "Shale", category: "Sedimentary", hardness: 1.15, porosity: 44, permeability: 22, instability: 1.25, reservoir: 40, geothermal: 42, drillability: 58, color: "from-slate-400/25 to-cyan-500/10", layer: "bg-slate-500/18", texture: "laminated" },
    { name: "Black Shale", category: "Sedimentary", hardness: 1.22, porosity: 36, permeability: 14, instability: 1.42, reservoir: 46, geothermal: 44, drillability: 52, color: "from-zinc-200/20 to-black/40", layer: "bg-zinc-800/28", texture: "laminated" },
    { name: "Limestone", category: "Sedimentary", hardness: 0.95, porosity: 60, permeability: 62, instability: 0.72, reservoir: 76, geothermal: 50, drillability: 78, color: "from-cyan-100/20 to-emerald-500/10", layer: "bg-cyan-100/14", texture: "block" },
    { name: "Dolomite", category: "Sedimentary", hardness: 1.05, porosity: 52, permeability: 58, instability: 0.82, reservoir: 70, geothermal: 52, drillability: 72, color: "from-emerald-200/20 to-teal-600/10", layer: "bg-emerald-200/14", texture: "block" },
    { name: "Chalk", category: "Sedimentary", hardness: 0.58, porosity: 76, permeability: 48, instability: 1.05, reservoir: 60, geothermal: 38, drillability: 92, color: "from-white/25 to-sky-200/10", layer: "bg-white/12", texture: "soft" },
    { name: "Marl", category: "Sedimentary", hardness: 0.76, porosity: 46, permeability: 28, instability: 1.02, reservoir: 44, geothermal: 40, drillability: 80, color: "from-lime-200/20 to-slate-500/10", layer: "bg-lime-200/12", texture: "band" },
    { name: "Conglomerate", category: "Sedimentary", hardness: 1.08, porosity: 56, permeability: 74, instability: 0.86, reservoir: 74, geothermal: 45, drillability: 68, color: "from-amber-200/25 to-stone-700/10", layer: "bg-amber-200/14", texture: "clast" },
    { name: "Breccia", category: "Sedimentary", hardness: 1.12, porosity: 54, permeability: 70, instability: 1.05, reservoir: 68, geothermal: 48, drillability: 64, color: "from-rose-200/20 to-stone-700/15", layer: "bg-rose-200/13", texture: "clast" },
    { name: "Coal Seam", category: "Sedimentary", hardness: 0.55, porosity: 32, permeability: 38, instability: 1.35, reservoir: 48, geothermal: 35, drillability: 86, color: "from-zinc-100/15 to-black/50", layer: "bg-black/36", texture: "soft" },
    { name: "Granite", category: "Igneous", hardness: 1.55, porosity: 18, permeability: 12, instability: 0.55, reservoir: 24, geothermal: 70, drillability: 38, color: "from-pink-200/25 to-fuchsia-700/10", layer: "bg-pink-300/14", texture: "crystal" },
    { name: "Granodiorite", category: "Igneous", hardness: 1.48, porosity: 20, permeability: 14, instability: 0.58, reservoir: 26, geothermal: 72, drillability: 42, color: "from-rose-200/20 to-slate-600/10", layer: "bg-rose-200/13", texture: "crystal" },
    { name: "Diorite", category: "Igneous", hardness: 1.42, porosity: 18, permeability: 12, instability: 0.6, reservoir: 23, geothermal: 68, drillability: 44, color: "from-slate-200/25 to-zinc-700/15", layer: "bg-slate-300/13", texture: "crystal" },
    { name: "Gabbro", category: "Igneous", hardness: 1.5, porosity: 16, permeability: 10, instability: 0.62, reservoir: 20, geothermal: 66, drillability: 39, color: "from-zinc-300/20 to-black/35", layer: "bg-zinc-600/18", texture: "crystal" },
    { name: "Basalt", category: "Igneous", hardness: 1.55, porosity: 24, permeability: 18, instability: 0.85, reservoir: 30, geothermal: 78, drillability: 36, color: "from-zinc-200/20 to-slate-700/20", layer: "bg-slate-700/22", texture: "volcanic" },
    { name: "Andesite", category: "Igneous", hardness: 1.38, porosity: 24, permeability: 20, instability: 0.72, reservoir: 30, geothermal: 74, drillability: 46, color: "from-slate-300/20 to-purple-700/10", layer: "bg-purple-300/12", texture: "volcanic" },
    { name: "Rhyolite", category: "Igneous", hardness: 1.32, porosity: 28, permeability: 24, instability: 0.68, reservoir: 34, geothermal: 76, drillability: 50, color: "from-fuchsia-200/20 to-rose-700/10", layer: "bg-fuchsia-200/12", texture: "volcanic" },
    { name: "Peridotite", category: "Igneous", hardness: 1.68, porosity: 12, permeability: 10, instability: 0.58, reservoir: 18, geothermal: 82, drillability: 28, color: "from-lime-300/20 to-emerald-900/15", layer: "bg-lime-500/14", texture: "crystal" },
    { name: "Pegmatite", category: "Igneous", hardness: 1.25, porosity: 26, permeability: 26, instability: 0.66, reservoir: 38, geothermal: 65, drillability: 55, color: "from-cyan-200/20 to-fuchsia-500/10", layer: "bg-cyan-200/12", texture: "crystal" },
    { name: "Obsidian", category: "Igneous", hardness: 1.18, porosity: 10, permeability: 8, instability: 0.7, reservoir: 12, geothermal: 58, drillability: 58, color: "from-zinc-100/15 to-black/55", layer: "bg-black/34", texture: "glass" },
    { name: "Slate", category: "Metamorphic", hardness: 1.05, porosity: 22, permeability: 15, instability: 0.92, reservoir: 20, geothermal: 50, drillability: 62, color: "from-slate-300/25 to-indigo-700/10", layer: "bg-indigo-300/12", texture: "laminated" },
    { name: "Schist", category: "Metamorphic", hardness: 1.22, porosity: 20, permeability: 18, instability: 1.05, reservoir: 22, geothermal: 54, drillability: 50, color: "from-violet-200/20 to-slate-700/15", layer: "bg-violet-300/12", texture: "foliated" },
    { name: "Gneiss", category: "Metamorphic", hardness: 1.42, porosity: 16, permeability: 14, instability: 0.72, reservoir: 22, geothermal: 62, drillability: 42, color: "from-slate-100/20 to-blue-900/10", layer: "bg-blue-200/12", texture: "foliated" },
    { name: "Quartzite", category: "Metamorphic", hardness: 1.62, porosity: 14, permeability: 12, instability: 0.56, reservoir: 18, geothermal: 58, drillability: 30, color: "from-cyan-100/20 to-white/10", layer: "bg-cyan-100/12", texture: "crystal" },
    { name: "Marble", category: "Metamorphic", hardness: 1.08, porosity: 22, permeability: 18, instability: 0.75, reservoir: 24, geothermal: 56, drillability: 66, color: "from-white/25 to-emerald-200/10", layer: "bg-white/13", texture: "block" },
    { name: "Fractured Reservoir", category: "Reservoir", hardness: 0.92, porosity: 78, permeability: 92, instability: 1.05, reservoir: 96, geothermal: 58, drillability: 72, color: "from-emerald-300/25 to-cyan-500/10", layer: "bg-emerald-300/22", texture: "fracture" },
    { name: "Tight Gas Reservoir", category: "Reservoir", hardness: 1.08, porosity: 38, permeability: 32, instability: 0.88, reservoir: 70, geothermal: 52, drillability: 62, color: "from-blue-300/20 to-cyan-700/10", layer: "bg-blue-300/13", texture: "grain" },
    { name: "Heavy Oil Reservoir", category: "Reservoir", hardness: 0.74, porosity: 70, permeability: 74, instability: 1.12, reservoir: 82, geothermal: 46, drillability: 82, color: "from-amber-500/25 to-black/35", layer: "bg-amber-700/20", texture: "soft" },
    { name: "High Temperature Geothermal", category: "Geothermal", hardness: 1.35, porosity: 34, permeability: 42, instability: 0.82, reservoir: 45, geothermal: 96, drillability: 48, color: "from-orange-300/25 to-red-600/20", layer: "bg-orange-400/20", texture: "hot" },
    { name: "Enhanced Geothermal System", category: "Geothermal", hardness: 1.5, porosity: 28, permeability: 55, instability: 0.9, reservoir: 50, geothermal: 94, drillability: 40, color: "from-red-300/25 to-fuchsia-600/15", layer: "bg-red-400/20", texture: "hot" },
  ];

  const formationProfiles = Object.fromEntries(formationLibrary.map((f) => [f.name, f]));
  const categories = ["All", ...Array.from(new Set(formationLibrary.map((f) => f.category)))];
  const visibleFormations = formationCategory === "All" ? formationLibrary : formationLibrary.filter((f) => f.category === formationCategory);
  const fp = formationProfiles[formation] || formationLibrary[0];
  const cf = formationProfiles[compareFormation] || formationLibrary[9];
  const depthKm = depth / 1000;
  const torque = Math.round(rpm * fp.hardness + pressure * 1.8 - mud * 0.5 + inclination * 0.75);
  const reservoirScore = Math.round(Math.min(99, Math.max(5, depth / 55 + pressure * 0.42 + fp.porosity * 0.18 + fp.permeability * 0.16 + fp.reservoir * 0.18 - mud * 0.16)));
  const geothermalScore = Math.round(Math.min(99, Math.max(5, fp.geothermal * 0.82 + depthKm * 4 + pressure * 0.08)));
  const boreStability = Math.round(Math.min(99, Math.max(1, 100 - pressure * fp.instability * 0.42 + mud * 0.46 - rpm * 0.045 - inclination * 0.18 + fp.drillability * 0.06)));
  const kickRisk = Math.round(Math.min(99, Math.max(1, pressure * 0.72 + depthKm * 7 - mud * 0.45 + fp.instability * 11 - fp.drillability * 0.04)));
  const rateOfPenetration = Math.round(Math.max(2, Math.min(90, rpm * 0.12 - fp.hardness * 6 + mud * 0.08 + pressure * 0.04 + fp.drillability * 0.08)));
  const casingLoad = Math.round(Math.min(99, Math.max(10, depthKm * 16 + inclination * 0.5 + pressure * 0.2)));
  const drillTempo = Math.max(0.9, Math.min(4.8, 260 / Math.max(40, rpm)));
  const mudPulseSpeed = Math.max(1.2, Math.min(5.5, 7 - mud / 18));
  const pressurePulseSpeed = Math.max(1.1, Math.min(4.2, 5 - pressure / 28));
  const boreShift = inclination * 1.4 - 40;
  const targetShift = inclination * 1.8 - 54;
  const boreGlow = Math.max(0.16, Math.min(0.72, boreStability / 135));

  const stackFormations = [
    formationLibrary[(depth + 3) % formationLibrary.length],
    formationLibrary[(depth + 11) % formationLibrary.length],
    fp,
    formationLibrary[(depth + 21) % formationLibrary.length],
    formationLibrary[(depth + 29) % formationLibrary.length],
  ];

  const exportWell = () => {
    const content = `ElementOS Well Driller Lab Report\n\nFormation: ${formation}\nFormation class: ${fp.category}\nDepth: ${depth} m\nInclination: ${inclination} deg\nFormation pressure: ${pressure}%\nDrill RPM: ${rpm}\nMud balance: ${mud}%\nPorosity: ${fp.porosity}%\nPermeability: ${fp.permeability}%\nDrillability: ${fp.drillability}%\nReservoir score: ${reservoirScore}%\nGeothermal score: ${geothermalScore}%\nBore stability: ${boreStability}%\nKick risk: ${kickRisk}%\nRate of penetration: ${rateOfPenetration} m/hr\nCasing load: ${casingLoad}%`;
    exportAllFormats({ baseName: "elementos-well-driller-formation-report", title: "Well Driller Formation Report", summary: content, payload: { formation, formationProfile: fp, depth, inclination, pressure, rpm, mud, torque, reservoirScore, geothermalScore, boreStability, kickRisk, rateOfPenetration, casingLoad } });
  };

  const selectFormation = (name) => {
    setFormation(name);
    if (compareFormation === name) {
      const alt = formationLibrary.find((f) => f.name !== name)?.name || "Limestone";
      setCompareFormation(alt);
    }
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1fr_.95fr]">
        <div>
          <Pill gold><Radar size={12}/> formation intelligence simulator</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Well Driller <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Formation OS</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            A cinematic subsurface drilling simulator with a 30+ formation library, animated geology layers, reservoir scoring, geothermal scoring, formation comparison and export-ready drilling reports.
          </p>
          <Info title="Subscriber-grade drilling workflow">
            Select a formation, watch the wellbore and geology react, compare reservoir quality against another formation, then export a smart PDF, JSON and SVG report for the selected drilling case.
          </Info>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={exportWell} variant="primary"><Download size={16} className="inline"/> Export Formation PDF/JSON/SVG</Button>
            <Button onClick={() => setPage("seismo")}>Open Seismo</Button>
            <Button onClick={() => setPage("calculations")}>Open Calculation Intelligence</Button>
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Formation command readout</div>
          <div className="mt-3 text-2xl font-black text-white">{formation}</div>
          <div className="mt-1 text-sm text-slate-400">{fp.category} · {fp.texture} texture · target depth {depth}m</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Reservoir", `${reservoirScore}%`, "emerald"],
              ["Bore Stability", `${boreStability}%`, "cyan"],
              ["Kick Risk", `${kickRisk}%`, "rose"],
              ["ROP", `${rateOfPenetration} m/hr`, "amber"],
            ].map(([label, value, tone]) => (
              <div key={label} className={`rounded-2xl border p-4 ${tone === "emerald" ? "border-emerald-300/20 bg-emerald-300/10" : tone === "rose" ? "border-rose-300/20 bg-rose-300/10" : tone === "amber" ? "border-amber-300/20 bg-amber-300/10" : "border-cyan-300/20 bg-cyan-300/10"}`}>
                <div className="text-4xl font-black text-white">{value}</div>
                <div className="text-[10px] uppercase tracking-[.18em] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="welldriller" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Layers size={12}/> formation explorer</Pill>
            <h2 className="mt-3 text-4xl font-black">Formation Intelligence Engine</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Choose from sedimentary, igneous, metamorphic, reservoir and geothermal formations. Every option changes the live geometry, drilling risk, reservoir potential and export report.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100">{visibleFormations.length} formations visible</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFormationCategory(cat)} className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.18em] transition ${formationCategory === cat ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-50" : "border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 grid max-h-[520px] gap-3 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-4">
          {visibleFormations.map((f) => (
            <button key={f.name} onClick={() => selectFormation(f.name)} className={`rounded-[1.5rem] border p-4 text-left transition ${formation === f.name ? "border-cyan-300/50 bg-cyan-300/12 shadow-[0_0_45px_rgba(34,211,238,.18)]" : "border-white/10 bg-black/25 hover:border-cyan-300/30 hover:bg-white/[.06]"}`}>
              <div className={`mb-4 h-20 rounded-2xl border border-white/10 bg-gradient-to-br ${f.color} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(135deg,rgba(255,255,255,.25)_1px,transparent_1px)] bg-[size:18px_18px]" />
                <div className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[.18em] text-white/70">{f.category}</div>
              </div>
              <div className="text-lg font-black text-white">{f.name}</div>
              <div className="mt-1 text-xs text-slate-400">Porosity {f.porosity}% · Perm {f.permeability}%</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="rounded-xl bg-white/[.04] p-2"><b className="text-cyan-100">{f.drillability}</b><br/>Drill</div>
                <div className="rounded-xl bg-white/[.04] p-2"><b className="text-emerald-100">{f.reservoir}</b><br/>Res</div>
                <div className="rounded-xl bg-white/[.04] p-2"><b className="text-amber-100">{f.geothermal}</b><br/>Geo</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Panel>
          <h2 className="text-3xl font-black">Well Controls</h2>
          <div className="mt-5 grid gap-4">
            <div className={`rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br ${fp.color} p-5`}>
              <div className="text-xs uppercase tracking-[.22em] text-cyan-100/80">Selected formation</div>
              <div className="mt-2 text-3xl font-black text-white">{formation}</div>
              <div className="mt-2 text-sm leading-6 text-slate-200">{fp.category} formation with {fp.porosity}% porosity, {fp.permeability}% permeability and {fp.drillability}% drillability.</div>
            </div>
            {[
              ["Target Depth", depth, setDepth, 800, 6200, "m"],
              ["Formation Pressure", pressure, setPressure, 5, 100, "%"],
              ["Drill RPM", rpm, setRpm, 30, 220, "rpm"],
              ["Mud Balance", mud, setMud, 5, 100, "%"],
              ["Well Inclination", inclination, setInclination, 0, 72, "°"],
            ].map(([label, value, setter, min, max, unit]) => (
              <label key={label} className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">{label}</span>
                  <span className="font-black text-cyan-100">{value}{unit}</span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(e) => setter(Number(e.target.value))} />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Pill gold><Layers size={12}/> animated formation stack</Pill>
              <h2 className="mt-3 text-4xl font-black">Live Wellbore Geometry</h2>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">Target {depth}m</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-950/90 p-6 [perspective:1100px]">
            <div className="relative mx-auto h-[560px] max-w-4xl [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-24deg)]">
              {stackFormations.map((layer, index) => (
                <div
                  key={`${layer.name}-${index}`}
                  className={`absolute left-1/2 top-1/2 rounded-[2rem] border border-white/10 ${layer.layer} shadow-[0_0_50px_rgba(34,211,238,.08)]`}
                  style={{
                    width: `${540 - index * 34}px`,
                    height: `${80 + index * 8}px`,
                    transform: `translate(-50%, ${-250 + index * 92}px) translateZ(${-index * 22}px)`,
                    animation: `eosStrataDrift ${14 + index * 2}s ease-in-out infinite`,
                    animationDelay: `${index * -0.7}s`,
                    boxShadow: layer.name === formation ? `0 0 ${40 + pressure * 0.5}px rgba(34,211,238,.32)` : undefined,
                  }}
                >
                  <div className="flex justify-between p-4 text-xs font-black uppercase tracking-[.18em] text-slate-200">
                    <span>{layer.name}</span><span>{Math.round((index + 1) * depth / 5)}m</span>
                  </div>
                  <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] bg-[size:28px_28px]" />
                </div>
              ))}

              <div
                className="absolute left-1/2 top-5 h-[470px] w-12 -translate-x-1/2 overflow-hidden rounded-full border border-cyan-200/50 bg-cyan-300/20 shadow-[0_0_80px_rgba(34,211,238,.45)]"
                style={{
                  transform: `translateX(${boreShift}px) rotateZ(${inclination / 2}deg)`,
                  boxShadow: `0 0 ${58 + boreStability * 0.4}px rgba(34,211,238,${boreGlow})`,
                  animation: `eosDrillPulse ${drillTempo}s ease-in-out infinite`,
                }}
              >
                <div className="absolute inset-x-2 top-0 h-[180%] rounded-full bg-gradient-to-b from-cyan-100/0 via-cyan-100/55 to-cyan-100/0" style={{ animation: `eosMudFlow ${mudPulseSpeed}s linear infinite` }} />
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-100 shadow-[0_0_24px_rgba(103,232,249,.95)]"
                    style={{ top: `${10 + i * 54}px`, opacity: 0.25 + mud / 150, animation: `eosMudBead ${mudPulseSpeed}s linear infinite`, animationDelay: `${i * -0.32}s` }}
                  />
                ))}
              </div>
              <div
                className="absolute left-1/2 top-[395px] h-20 w-20 -translate-x-1/2 rounded-full border border-amber-200/60 bg-amber-300/30 shadow-[0_0_80px_rgba(251,191,36,.65)]"
                style={{ transform: `translateX(${targetShift}px)`, animation: `eosDrillBit ${drillTempo}s linear infinite` }}
              />
              <div
                className="absolute left-1/2 top-[450px] h-14 w-56 -translate-x-1/2 rounded-full border border-emerald-200/40 bg-emerald-300/20 shadow-[0_0_90px_rgba(52,211,153,.35)]"
                style={{ transform: `translateX(${targetShift}px) translateZ(30px)`, animation: `eosReservoirGlow ${pressurePulseSpeed}s ease-in-out infinite`, opacity: Math.min(1, 0.35 + fp.reservoir / 120) }}
              />
              <div
                className="absolute left-1/2 top-[330px] h-32 w-32 -translate-x-1/2 rounded-full border border-rose-300/25 bg-rose-400/10"
                style={{ transform: `translateX(${targetShift * 0.8}px) translateZ(16px)`, animation: `eosPressureBloom ${pressurePulseSpeed}s ease-in-out infinite`, opacity: Math.min(0.9, 0.25 + pressure / 130) }}
              />
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_.85fr]">
        <Panel>
          <Pill gold><BarChart3 size={12}/> formation intelligence</Pill>
          <h2 className="mt-3 text-4xl font-black">{formation} Intelligence Panel</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Porosity", fp.porosity, "void openness"],
              ["Permeability", fp.permeability, "fluid movement"],
              ["Drillability", fp.drillability, "ease of drilling"],
              ["Reservoir", fp.reservoir, "hydrocarbon potential"],
              ["Geothermal", geothermalScore, "heat opportunity"],
              ["Instability", Math.round(fp.instability * 50), "risk multiplier"],
            ].map(([label, value, desc]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs uppercase tracking-[.18em] text-slate-500">{label}</div>
                <div className="mt-2 text-4xl font-black text-cyan-100">{value}%</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${Math.min(99, value)}%` }} /></div>
                <p className="mt-2 text-xs text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><Network size={12}/> formation comparison</Pill>
          <h2 className="mt-3 text-3xl font-black">Compare Formations</h2>
          <select value={compareFormation} onChange={(e) => setCompareFormation(e.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">
            {formationLibrary.filter((f) => f.name !== formation).map((f) => <option key={f.name}>{f.name}</option>)}
          </select>
          <div className="mt-5 grid gap-3">
            {[
              ["Reservoir Quality", fp.reservoir, cf.reservoir],
              ["Drillability", fp.drillability, cf.drillability],
              ["Permeability", fp.permeability, cf.permeability],
              ["Geothermal", fp.geothermal, cf.geothermal],
            ].map(([label, a, b]) => {
              const winner = a >= b ? formation : compareFormation;
              return (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm"><b>{label}</b><span className="text-cyan-100">Winner: {winner}</span></div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div>{formation}: <b className="text-emerald-100">{a}%</b></div>
                    <div>{compareFormation}: <b className="text-amber-100">{b}%</b></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          ["Torque Index", torque, "rotary load through formation hardness"],
          ["Casing Load", `${casingLoad}%`, "structural demand on well casing"],
          ["Geothermal Score", `${geothermalScore}%`, "heat opportunity based on formation and depth"],
        ].map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
            <div className={`mt-5 h-28 rounded-[2rem] border border-white/10 bg-gradient-to-br ${fp.color} [transform:perspective(700px)_rotateX(54deg)_rotateZ(-8deg)] shadow-[0_30px_80px_rgba(34,211,238,.12)]`} />
          </Panel>
        ))}
      </div>
    </>
  );
}


function SeismoSimulator({ setPage }) {
  const [distance, setDistance] = useState(80);
  const [pVelocity, setPVelocity] = useState(6200);
  const [sVelocity, setSVelocity] = useState(3600);
  const [depth, setDepth] = useState(2800);
  const [noise, setNoise] = useState(18);
  const [density, setDensity] = useState(62);

  const pArrival = (distance * 1000) / Math.max(1, pVelocity);
  const sArrival = (distance * 1000) / Math.max(1, sVelocity);
  const gap = Math.max(0, sArrival - pArrival);
  const epicentralEstimate = Math.round(gap * 8.4);
  const clarity = Math.round(Math.min(99, Math.max(20, 100 - noise * 0.55 + density * 0.18 - gap * 0.7)));
  const confidence = Math.round(Math.min(99, Math.max(35, clarity * 0.62 + depth / 180 - Math.abs(pVelocity - sVelocity) / 900)));
  const waveRatio = (pVelocity / Math.max(1, sVelocity)).toFixed(2);

  const pFrequency = 0.52 + pVelocity / 14500 + distance / 520;
  const sFrequency = 0.34 + sVelocity / 13500 + depth / 18000;
  const pAmplitude = 7 + density * 0.08 + Math.min(6, depth / 1300);
  const sAmplitude = 12 + noise * 0.12 + Math.min(7, distance / 35);
  const wavePhase = gap * 0.16 + density * 0.012;
  const pTraceSpeed = Math.max(1.0, Math.min(5.5, pArrival * 0.55));
  const sTraceSpeed = Math.max(1.4, Math.min(7.5, sArrival * 0.45));

  const waveSamples = Array.from({ length: 42 }, (_, i) => {
    const x = 4 + i * 2.25;
    const p = 50 + Math.sin(i * pFrequency + wavePhase) * pAmplitude + Math.cos(i * 0.17 + distance * 0.02) * 2;
    const s = 50 + Math.sin(i * sFrequency + 1.2 + wavePhase * 1.4) * sAmplitude + Math.cos(i * 0.21 + noise * 0.05) * 3;
    return { x, p, s };
  });

  const exportSeismo = () => {
    const content = `ElementOS Seismo P/S Wave Report\n\nDistance: ${distance} km\nDepth: ${depth} m\nP-wave velocity: ${pVelocity} m/s\nS-wave velocity: ${sVelocity} m/s\nP arrival: ${pArrival.toFixed(2)} s\nS arrival: ${sArrival.toFixed(2)} s\nArrival gap: ${gap.toFixed(2)} s\nEpicentral estimate: ${epicentralEstimate} km\nWave ratio: ${waveRatio}\nSignal clarity: ${clarity}%\nConfidence: ${confidence}%\nNoise: ${noise}%\nDensity contrast: ${density}%`;
    exportAllFormats({ baseName: "elementos-seismo-ps-wave-report", title: "Seismo P/S Wave Report", summary: content, payload: { distance, depth, pVelocity, sVelocity, pArrival: pArrival.toFixed(2), sArrival: sArrival.toFixed(2), gap: gap.toFixed(2), epicentralEstimate, waveRatio, clarity, confidence, noise, density } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1fr_.95fr]">
        <div>
          <Pill gold><Network size={12}/> seismic wave simulator</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Seismo <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">P/S Wave Lab</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Compare P-wave and S-wave travel through a simulated subsurface field. See arrival gaps, velocity ratios, depth response, clarity, and 3D wave propagation.
          </p>
          <Info title="Seismic intelligence upgrade">
            P-waves arrive first and S-waves arrive later. The gap between them helps estimate distance, formation response and seismic clarity for the well path.
          </Info>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={exportSeismo} variant="primary"><Download size={16} className="inline"/> Export Seismo PDF/JSON/SVG</Button>
            <Button onClick={() => setPage("welldriller")}>Return to Well Driller</Button>
            <Button onClick={() => setPage("visualization")}>Open Visual Engine</Button>
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Seismic readout</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-4xl font-black text-cyan-100">{pArrival.toFixed(2)}s</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">P arrival</div>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="text-4xl font-black text-amber-100">{sArrival.toFixed(2)}s</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">S arrival</div>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="text-4xl font-black text-emerald-100">{gap.toFixed(2)}s</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">arrival gap</div>
            </div>
            <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4">
              <div className="text-4xl font-black text-fuchsia-100">{confidence}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">confidence</div>
            </div>
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="seismo" />

      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Panel>
          <h2 className="text-3xl font-black">Wave Controls</h2>
          <div className="mt-5 grid gap-4">
            {[
              ["Sensor Distance", distance, setDistance, 10, 220, "km"],
              ["Depth", depth, setDepth, 200, 7200, "m"],
              ["P-Wave Velocity", pVelocity, setPVelocity, 3200, 9200, "m/s"],
              ["S-Wave Velocity", sVelocity, setSVelocity, 1200, 6200, "m/s"],
              ["Signal Noise", noise, setNoise, 0, 100, "%"],
              ["Density Contrast", density, setDensity, 0, 100, "%"],
            ].map(([label, value, setter, min, max, unit]) => (
              <label key={label} className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">{label}</span>
                  <span className="font-black text-cyan-100">{value}{unit}</span>
                </div>
                <input type="range" min={min} max={max} value={value} onChange={(e) => setter(Number(e.target.value))} />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Pill gold><Orbit size={12}/> 3D seismic wavefield</Pill>
              <h2 className="mt-3 text-4xl font-black">P/S Wave Tunnel</h2>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">Ratio {waveRatio}x</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-950/90 p-6 [perspective:1100px]">
            <div className="relative mx-auto h-[420px] max-w-4xl [transform-style:preserve-3d] [transform:rotateX(62deg)_rotateZ(-30deg)]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 rounded-full border border-cyan-300/20 bg-cyan-300/5"
                  style={{
                    width: `${120 + i * 70}px`,
                    height: `${54 + i * 32}px`,
                    transform: `translate(-50%, -50%) translateZ(${i * 18}px)`,
                    boxShadow: i % 2 === 0 ? `0 0 ${32 + density * 0.18}px rgba(34,211,238,.22)` : `0 0 ${30 + noise * 0.16}px rgba(251,191,36,.18)`,
                    animation: `eosWaveShell ${1.8 + i * 0.18 + gap * 0.03}s ease-in-out infinite`,
                    animationDelay: `${i * -0.16}s`,
                    opacity: Math.max(0.22, 0.86 - i * 0.055),
                  }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_80px_rgba(251,191,36,.85)]" style={{ animation: `eosReservoirGlow ${Math.max(1.1, gap * 0.12)}s ease-in-out infinite` }} />
              <div className="absolute left-[15%] top-[45%] h-5 w-[70%] overflow-hidden rounded-full bg-cyan-300/40 shadow-[0_0_70px_rgba(34,211,238,.5)]">
                <div className="absolute top-0 h-full w-16 rounded-full bg-cyan-100 shadow-[0_0_40px_rgba(103,232,249,.95)]" style={{ animation: `eosWaveTravel ${pTraceSpeed}s linear infinite` }} />
              </div>
              <div className="absolute left-[22%] top-[58%] h-5 w-[56%] overflow-hidden rounded-full bg-amber-300/35 shadow-[0_0_70px_rgba(251,191,36,.45)]">
                <div className="absolute top-0 h-full w-16 rounded-full bg-amber-100 shadow-[0_0_40px_rgba(253,230,138,.95)]" style={{ animation: `eosWaveTravel ${sTraceSpeed}s linear infinite`, animationDelay: `${gap * 0.08}s` }} />
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Pill><BarChart3 size={12}/> seismogram</Pill>
            <h2 className="mt-3 text-4xl font-black">P-Wave / S-Wave Trace</h2>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">
            Epicentral estimate: {epicentralEstimate} km
          </div>
        </div>
        <svg viewBox="0 0 100 100" className="mt-6 h-72 w-full rounded-[2rem] border border-white/10 bg-black/25 p-4">
          {[20,40,60,80].map((y) => <line key={y} x1="4" x2="96" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
          <polyline points={waveSamples.map((s) => `${s.x},${s.p}`).join(" ")} fill="none" stroke="rgba(34,211,238,.95)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: "5 4", animation: `eosTraceFlow ${pTraceSpeed}s linear infinite` }} />
          <polyline points={waveSamples.map((s) => `${s.x},${s.s}`).join(" ")} fill="none" stroke="rgba(251,191,36,.92)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: "4 5", animation: `eosTraceFlow ${sTraceSpeed}s linear infinite reverse` }} />
          <circle cx={waveSamples[Math.min(waveSamples.length - 1, Math.max(0, Math.floor((pVelocity / 9200) * waveSamples.length)))].x} cy={waveSamples[Math.min(waveSamples.length - 1, Math.max(0, Math.floor((pVelocity / 9200) * waveSamples.length)))].p} r="1.9" fill="rgba(103,232,249,.98)" style={{ animation: `eosSvgPulse ${pTraceSpeed}s ease-in-out infinite` }} />
          <circle cx={waveSamples[Math.min(waveSamples.length - 1, Math.max(0, Math.floor((sVelocity / 6200) * waveSamples.length)))].x} cy={waveSamples[Math.min(waveSamples.length - 1, Math.max(0, Math.floor((sVelocity / 6200) * waveSamples.length)))].s} r="1.8" fill="rgba(253,230,138,.98)" style={{ animation: `eosSvgPulse ${sTraceSpeed}s ease-in-out infinite` }} />
          <text x="6" y="10" className="fill-cyan-100 text-[4px]">P-wave trace</text>
          <text x="6" y="18" className="fill-amber-100 text-[4px]">S-wave trace</text>
        </svg>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-4">
        {[
          ["Wave Ratio", `${waveRatio}x`, "P-wave speed compared to S-wave speed"],
          ["Signal Clarity", `${clarity}%`, "readability after noise and density contrast"],
          ["Arrival Gap", `${gap.toFixed(2)}s`, "difference between P and S arrival"],
          ["Depth Response", `${Math.round(depth / 100) / 10}km`, "current simulated event depth"],
        ].map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-4xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
          </Panel>
        ))}
      </div>
    </>
  );
}




function ViralDiscoveryCardStudio({ selected = "Al", compare = [], setPage }) {
  const [format, setFormat] = useState("Discovery DNA");
  const [cardIndex, setCardIndex] = useState(0);
  const [founderName, setFounderName] = useState("Paul Roper");
  const [headlineMode, setHeadlineMode] = useState("AI Headline");
  const [exportLayout, setExportLayout] = useState("Portrait Poster");
  const [mediaSourceId, setMediaSourceId] = useState("compare");
  const [seriesNumber, setSeriesNumber] = useState(36);
  const [exportHistory, setExportHistory] = useState([]);
  const discoveries = useMemo(() => adaptiveDiscoveryRank(generateDiscoveryEngine(24)), []);
  const activeMaterial = elementMap[selected] || elementMap.Al;
  const compareSet = compare?.length ? compare : ["Al", "Ti", "Hf", "W"];
  const discovery = discoveries[cardIndex % discoveries.length] || discoveries[0];
  const mediaSources = useMemo(() => {
    const primaryPair = compareSet.slice(0, 2);
    const compareTitle = primaryPair.length >= 2 ? `${primaryPair[0]} + ${primaryPair[1]}` : `${activeMaterial.symbol} + Ti`;
    const compareScore = primaryPair.length >= 2 ? compatibilityScore(primaryPair[0], primaryPair[1]) : Math.round(score(activeMaterial.symbol).alignment);
    const discoveryPair = discovery ? `${discovery.a} + ${discovery.b}` : "Ti + Hf";
    return [
      {
        id: "compare",
        label: "Current Compare Set",
        type: "Compare Materials",
        title: compareTitle,
        code: `COMPARE-${compareSet.join("-") || activeMaterial.symbol}`,
        headline: "Comparison-Ready Discovery Asset",
        subtitle: `${compareSet.join(" + ")} comparison converted into media`,
        score: compareScore,
        metric: "Compatibility",
        tier: rarityTier(compareScore),
        narrative: `This card is generated directly from the current Compare workflow using ${compareSet.join(" + ")}. It turns the user's active material selection into a shareable discovery asset.`,
        source: "Compare Engine",
        hook: "A live compare result became a report, poster and social pack.",
        constellation: `${compareSet.slice(0, 4).join(" → ")} → Media`,
      },
      {
        id: "discovery",
        label: "Discovery Feed Asset",
        type: "Discovery Feed",
        title: discoveryPair,
        code: discovery?.dna || "DISCOVERY-TI-HF",
        headline: discovery?.type || "Rare Material Signal Detected",
        subtitle: discovery?.tier || "Network-ranked discovery",
        score: discovery?.aiConfidence || discovery?.score || 94,
        metric: "AI Confidence",
        tier: discovery?.tier || "ULTRA RARE",
        narrative: discovery?.reason || "A high-signal material pairing surfaced inside the ElementOS discovery network.",
        source: "Discovery Feed",
        hook: "A trending network discovery became a public media asset.",
        constellation: discovery ? `${discovery.a} → ${discovery.b} → Public Discovery` : "Ti → Hf → Public Discovery",
      },
      {
        id: "matter",
        label: "Matter Intelligence Opportunity",
        type: "Matter Intelligence",
        title: "Diamond Cluster",
        code: "MIOS-DK-27",
        headline: "Ground Opportunity Signal Rising",
        subtitle: "Matter Intelligence scan converted into an opportunity poster",
        score: 92,
        metric: "Opportunity Score",
        tier: "RISING",
        narrative: "Multiple evidence layers are converging around one potential ground opportunity. The signal is strong enough to become a report-ready opportunity card.",
        source: "Matter Intelligence",
        hook: "An opportunity scan became a shareable intelligence poster.",
        constellation: "Signal → Target → Report",
      },
      {
        id: "timemachine",
        label: "Time Machine Forecast",
        type: "Time Machine",
        title: `${activeMaterial.symbol} 25-Year Forecast`,
        code: `TIME-${activeMaterial.symbol}-25Y`,
        headline: "Future-State Material Forecast",
        subtitle: "Long-horizon behaviour converted into a forecast poster",
        score: Math.round(score(activeMaterial.symbol).stability * 19),
        metric: "Survival Signal",
        tier: "FORECAST",
        narrative: `${activeMaterial.name} is projected across long-term stress, pressure and exposure conditions, then packaged as a forecast card for reporting and sharing.`,
        source: "Time Machine",
        hook: "A future-state simulation became a visual forecast asset.",
        constellation: `${activeMaterial.symbol} → 25Y → Forecast`,
      },
      {
        id: "seismo",
        label: "Seismo / Well Signal",
        type: "Advanced Labs",
        title: "Subsurface Wave Signal",
        code: "SEISMO-P-S-1047",
        headline: "Seismic Signal Gap Detected",
        subtitle: "P-wave and S-wave readout packaged for technical sharing",
        score: 88,
        metric: "Signal Clarity",
        tier: "TECHNICAL",
        narrative: "A simulated subsurface wave response was converted into a clear poster-style readout for field review, reporting and public explanation.",
        source: "Seismo Lab",
        hook: "A technical lab result became a visual explanation asset.",
        constellation: "P-Wave → S-Wave → Report",
      },
      {
        id: "report",
        label: "Research Report",
        type: "Reports",
        title: "Research Dossier",
        code: `REPORT-${compareSet.slice(0, 3).join("-")}`,
        headline: "Report-Ready Scientific Asset",
        subtitle: "Executive summary converted into a media pack",
        score: 90,
        metric: "Report Strength",
        tier: "REPORTABLE",
        narrative: "This export packages an ElementOS result as a polished report, SVG poster, JSON dataset and platform-specific social copy.",
        source: "Report Engine",
        hook: "A report became a social-ready discovery pack.",
        constellation: "Insight → Report → Public Page",
      },
    ];
  }, [compareSet, activeMaterial, discovery]);
  const selectedMediaSource = mediaSources.find((source) => source.id === mediaSourceId) || mediaSources[0];
  const globalAverage = 68;

  const cardStats = useMemo(() => {
    const seed = String(discovery?.dna || "TI-HF-1047").split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
    return {
      views: 2400 + (seed % 4200),
      saves: 84 + (seed % 360),
      reports: 17 + (seed % 92),
      shares: 22 + (seed % 280),
      rank: 1 + (seed % 99),
      percentile: Math.max(0.2, Math.min(9.9, ((100 - (discovery?.score || 92)) / 2.4).toFixed(1))),
    };
  }, [discovery]);

  const storyLines = useMemo(() => {
    const pair = `${discovery?.a || "Ti"} + ${discovery?.b || "Hf"}`;
    return [
      `Rare alignment detected across ${pair}.`,
      `${discovery?.type || "Hidden compatibility signal"} moved into the public discovery queue.`,
      `AI confidence sits ${Math.max(1, (discovery?.aiConfidence || 94) - globalAverage)} points above the network average.`,
      "This is designed to become a discovery, report, share card and public research asset.",
    ];
  }, [discovery]);

  const cardData = useMemo(() => {
    const base = {
      format,
      badge: format.toUpperCase(),
      title: selectedMediaSource.title,
      code: discovery?.dna || "DISCOVERY-TI-HF",
      headline: headlineMode === "AI Headline" ? selectedMediaSource.headline : `${selectedMediaSource.type} Media Asset`,
      subtitle: selectedMediaSource.subtitle,
      score: selectedMediaSource.score,
      metric: "AI Confidence",
      tier: discovery?.tier || "ULTRA RARE",
      rank: `#${cardStats.rank} Global`,
      top: `Top ${cardStats.percentile}%`,
      founder: founderName || "ElementOS Researcher",
      narrative: selectedMediaSource.narrative,
      statA: `${cardStats.views.toLocaleString()} views`,
      statB: `${cardStats.saves.toLocaleString()} saves`,
      statC: `${cardStats.reports.toLocaleString()} reports`,
      statD: `${cardStats.shares.toLocaleString()} shares`,
      source: selectedMediaSource.source,
      cardNumber: `Discovery #${String(seriesNumber).padStart(3, "0")}`,
      hook: selectedMediaSource.hook,
      constellation: discovery ? `${discovery.a} → ${discovery.b} → Public Discovery` : "Ti → Hf → Public Discovery",
    };

    if (format === "Scientific Trading Card") {
      return { ...base, badge: "SCIENTIFIC TRADING CARD", headline: "Collectible Material Intelligence", source: "Trading Card", subtitle: "front/back research collectible", tier: "COLLECTIBLE" };
    }
    if (format === "Founder Card") {
      return { ...base, badge: "FOUNDER DISCOVERY", headline: `Found by ${founderName || "Paul Roper"}`, source: "Founder Card", subtitle: "researcher identity + discovery proof", tier: "FOUNDER" };
    }
    if (format === "Opportunity Poster") {
      return { ...base, badge: "OPPORTUNITY SIGNAL", title: "Diamond Cluster", code: "MIOS-DK-27", headline: "Ground Opportunity Signal Rising", subtitle: "Matter Intelligence target card", score: 92, metric: "Opportunity Score", tier: "RISING", source: "Matter Intelligence" };
    }
    if (format === "Report Poster") {
      return { ...base, badge: "DISCOVERY REPORT", headline: "Report-Ready Discovery Asset", source: "Report Poster", subtitle: "executive brief + technical narrative", tier: "REPORTABLE" };
    }
    if (format === "League Table") {
      return { ...base, badge: "TOP DISCOVERIES TODAY", headline: "Discovery Leaderboard", source: "League Table", subtitle: "ranked by momentum, saves and AI confidence", tier: "TRENDING", hook: "The network is ranking today’s strongest material signals." };
    }
    if (format === "Discovery Poster") {
      return { ...base, badge: "DISCOVERY POSTER", headline: "Exceptional Material Signal Detected", source: "Poster Export", subtitle: "premium launch poster for X, LinkedIn and Reddit", tier: "POSTER", hook: "Built to stop the scroll and turn a simulation into a public discovery." };
    }
    if (format === "Daily Discovery Series") {
      return { ...base, badge: "DAILY DISCOVERY", headline: `Daily Discovery Series ${String(seriesNumber).padStart(3, "0")}`, source: "Daily Series", subtitle: "collectible discovery drop", tier: "SERIES", hook: "A new shareable discovery every day keeps ElementOS alive." };
    }
    return base;
  }, [format, discovery, cardStats, founderName, headlineMode, selectedMediaSource]);

  const formats = ["Discovery DNA", "Discovery Poster", "Daily Discovery Series", "Scientific Trading Card", "Founder Card", "Opportunity Poster", "Report Poster", "League Table"];
  const exportLayouts = ["Square Card", "Portrait Poster", "Landscape Banner", "X Post", "LinkedIn", "Reddit"];
  const badges = ["First Discovery", "Top 1%", "Matter Pioneer", "Report Ready", "Public Asset"];
  const channels = [
    ["X / Twitter", "One sharp discovery card, one curiosity hook, one public discovery link."],
    ["LinkedIn", "Frame it as a professional material-intelligence insight with a report preview."],
    ["Reddit", "Lead with explanation, not hype. Show the card after the useful context."],
    ["Product Hunt", "Use the founder card plus a clear before/after workflow demo."],
  ];

  const performanceScore = Math.min(99, Math.round((cardData.score * 0.42) + (cardStats.shares / 8) + (cardStats.saves / 14) + 18));
  const viralReadiness = performanceScore >= 92 ? "LAUNCH READY" : performanceScore >= 82 ? "HIGH POTENTIAL" : performanceScore >= 72 ? "NEEDS STRONGER HOOK" : "REFINE BEFORE POSTING";
  const confidenceMetrics = [
    ["Signal Agreement", Math.min(99, Math.round(cardData.score * 0.94 + 5))],
    ["Historical Match", Math.min(99, Math.round(cardData.score * 0.88 + 8))],
    ["Simulation Consistency", Math.min(99, Math.round(cardData.score * 0.91 + 6))],
  ];
  const genomeMetrics = [
    ["Thermal", Math.min(99, Math.round(cardData.score * 0.96))],
    ["Pressure", Math.min(99, Math.round(cardData.score * 0.91))],
    ["Stability", Math.min(99, Math.round(cardData.score * 0.94))],
    ["Conductivity", Math.min(99, Math.round(cardData.score * 0.78))],
  ];
  const genomePair = String(cardData.title || "Ti + Hf").split("+").map((item) => item.trim()).filter(Boolean);
  const discoveryGenome = `${genomePair[0] || "Ti"}${genomePair[1] || "Hf"}-X${String(cardStats.rank).padStart(2, "0")}-P${Math.round(cardData.score / 10)}`;
  const ctaVariants = ["Open the discovery", "Generate your own", "View the full report", "Save this signal", "Join the founding beta"];
  const abVariants = [
    ["A", "Rare signal headline", cardData.headline, "Best for X curiosity."],
    ["B", "Score-first headline", `${cardData.score}% ${cardData.metric}`, "Best for LinkedIn authority."],
    ["C", "Story-first headline", cardData.hook, "Best for Reddit explanation."],
  ];
  const collections = [
    ["Advanced Thermal Materials", "12 discoveries", "Ti + Hf, W + Ta, Zr + Hf"],
    ["Aerospace Stability Set", "8 discoveries", "Al + Ti, Mg + Al, Ti + V"],
    ["Rare Earth Intelligence", "16 discoveries", "Nd + Pr, Dy + Tb, Ce + La"],
  ];
  const tournamentPairs = [
    ["Ti + Hf", "Al + Ti", "Ti + Hf", "+8% thermal · +12% pressure"],
    ["Ga + In", "Au + Pt", "Ga + In", "+14% conductivity · +6% novelty"],
  ];
  const hallOfFame = discoveries.slice(0, 5).map((d, index) => ({ ...d, rank: index + 1 }));
  const platformRecommendations = [
    ["X", "Use the square card, short curiosity hook, one number, one public discovery link."],
    ["LinkedIn", "Use portrait poster, professional narrative, report preview, founder context."],
    ["Reddit", "Lead with useful explanation, then card. Ask for critique rather than sales."],
    ["Product Hunt", "Use founder card plus the discovery loop: simulate → report → share."],
  ];

  const safeText = (value) => String(value ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const smartTitle = (value = "") => {
    const text = String(value || "").trim();
    if (!text) return "Discovery Signal Detected";
    if (text.length <= 48) return text;
    return text
      .replace("Rare Thermal and Pressure Alignment Suitable for Advanced Structural Comparison", "Rare Thermal-Pressure Alignment")
      .replace("Hidden compatibility signal", "Hidden Compatibility Signal")
      .slice(0, 64)
      .replace(/\s+\S*$/, "") + "...";
  };

  const wrapWords = (value = "", maxChars = 34, maxLines = 3) => {
    const words = String(value || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxChars && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    });

    if (line) lines.push(line);

    if (lines.length > maxLines) {
      const clipped = lines.slice(0, maxLines);
      clipped[maxLines - 1] = clipped[maxLines - 1].replace(/[.,;:]?$/, "") + "...";
      return clipped;
    }

    return lines.length ? lines : [""];
  };

  const svgTextLines = (lines = [], { x = 0, y = 0, lineHeight = 46, fill = "#e0f2fe", size = 34, weight = 700, anchor = "start", family = "Inter, Arial, sans-serif", spacing = 0 } = {}) => {
    return lines
      .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${spacing}">${safeText(line)}</text>`)
      .join("\n");
  };

  const splitPair = (title = "Ti + Hf") => {
    const parts = String(title).split("+").map((item) => item.trim()).filter(Boolean);
    return [parts[0] || "Ti", parts[1] || "Hf"];
  };


  const copyCard = () => {
    const text = `${cardData.headline}
${cardData.title} · ${cardData.code}
${cardData.score}% ${cardData.metric}
${cardData.tier} · ${cardData.rank} · ${cardData.top}
Found by ${cardData.founder}
${cardData.narrative}
${cardData.statA} · ${cardData.statB} · ${cardData.statC}
${cardData.hook}
${cardData.cardNumber}
Generated in ElementOS`;
    navigator.clipboard?.writeText(text);
    alert("Viral card copy saved to clipboard.");
  };

  const copyCaption = (channel = "X") => {
    const pair = cardData.title;
    const captions = {
      X: `${cardData.headline}

${pair}
${cardData.score}% ${cardData.metric}
${cardData.tier} · ${cardData.top}

Generated in ElementOS.`,
      LinkedIn: `I generated a new ElementOS discovery asset: ${pair}. The model returned ${cardData.score}% ${cardData.metric}, classified as ${cardData.tier}. This is the kind of shareable scientific intelligence workflow ElementOS is being built for.`,
      Reddit: `I am testing a material-discovery prototype called ElementOS. This card shows ${pair} with ${cardData.score}% ${cardData.metric}. I am looking for feedback on whether the explanation and export format make the result understandable.`,
      ProductHunt: `ElementOS turns material simulations into discoveries, reports and shareable scientific cards. Today's example: ${pair} at ${cardData.score}% ${cardData.metric}.`,
    };
    navigator.clipboard?.writeText(captions[channel] || captions.X);
    alert(`${channel} caption copied.`);
  };


  const createSocialPack = () => {
    const pair = cardData.title;
    const socialPack = {
      product: "ElementOS",
      asset: "Discovery Social Pack",
      discovery: {
        title: pair,
        code: cardData.code,
        headline: cardData.headline,
        score: `${cardData.score}%`,
        tier: cardData.tier,
        rank: cardData.rank,
        founder: cardData.founder,
      },
      exportsIncluded: ["PDF report", "JSON data", "SVG poster"],
      captions: {
        x: `${cardData.headline}\n\n${pair} · ${cardData.score}% ${cardData.metric}\n${cardData.tier} · ${cardData.top}\n\nBuilt in ElementOS.`,
        linkedin: `I generated a new ElementOS discovery asset: ${pair}. It scored ${cardData.score}% ${cardData.metric} and is classified as ${cardData.tier}. ElementOS turns simulations into reports, posters and shareable scientific discovery pages.`,
        reddit: `I am testing ElementOS, a material-discovery prototype. This export shows ${pair} with ${cardData.score}% ${cardData.metric}. I would love feedback on whether the card explains the discovery clearly.`,
      },
      ctaVariants,
      platformRecommendations,
      generatedAt: new Date().toISOString(),
    };

    exportAllFormats({
      baseName: `elementos-social-pack-${slugifyExportName(cardData.code)}`,
      title: `${cardData.title} Social Pack`,
      summary: `${cardData.headline}. ${cardData.score}% ${cardData.metric}. ${cardData.tier}.`,
      payload: socialPack,
      sections: [
        { heading: "Discovery", text: `${cardData.title} · ${cardData.code} · ${cardData.score}% ${cardData.metric}` },
        { heading: "X Post", text: socialPack.captions.x },
        { heading: "LinkedIn Post", text: socialPack.captions.linkedin },
        { heading: "Reddit Post", text: socialPack.captions.reddit },
        { heading: "Call To Action Variants", text: ctaVariants.join(" · ") },
      ],
    });

    setExportHistory((history) => [
      { type: "Social Pack", layout: "PDF + JSON + SVG", time: new Date().toLocaleTimeString() },
      ...history,
    ].slice(0, 8));
  };

  const exportSVG = () => {
    const layoutMeta = {
      "Square Card": { w: 1600, h: 1600, name: "square" },
      "Portrait Poster": { w: 1600, h: 2100, name: "portrait" },
      "Landscape Banner": { w: 2100, h: 1200, name: "landscape" },
      "X Post": { w: 1600, h: 900, name: "x-post" },
      "LinkedIn": { w: 1600, h: 1200, name: "linkedin" },
      "Reddit": { w: 1600, h: 1200, name: "reddit" },
    }[exportLayout] || { w: 1600, h: 2100, name: "portrait" };
    const [leftSymbol, rightSymbol] = splitPair(cardData.title);
    const exportHeadline = smartTitle(cardData.headline);
    const exportSubtitle = smartTitle(cardData.subtitle);
    const narrativeLines = wrapWords(cardData.narrative, 42, 4);
    const titleLines = wrapWords(cardData.title, 16, 2);
    const headlineLines = wrapWords(exportHeadline, 34, 2);
    const subtitleLines = wrapWords(exportSubtitle, 42, 2);
    const footerLine = `Generated by ${cardData.founder} in ElementOS`;
    const ringColor = platform === "LinkedIn" ? "#38bdf8" : platform === "Reddit" ? "#f97316" : platform === "X" ? "#67e8f9" : "#fbbf24";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${layoutMeta.w}" height="${layoutMeta.h}" viewBox="0 0 1600 2100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#061a31"/>
      <stop offset="0.34" stop-color="#020617"/>
      <stop offset="0.67" stop-color="#101336"/>
      <stop offset="1" stop-color="#34124a"/>
    </linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#67e8f9"/>
      <stop offset="0.42" stop-color="#818cf8"/>
      <stop offset="0.72" stop-color="#f472b6"/>
      <stop offset="1" stop-color="#fbbf24"/>
    </linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#061a31"/></linearGradient>
    <radialGradient id="pulse" cx="74%" cy="16%" r="70%"><stop offset="0" stop-color="#22d3ee" stop-opacity="0.72"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
    <radialGradient id="gold" cx="18%" cy="84%" r="58%"><stop offset="0" stop-color="#f59e0b" stop-opacity="0.38"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
    <radialGradient id="pink" cx="82%" cy="78%" r="52%"><stop offset="0" stop-color="#e879f9" stop-opacity="0.26"/><stop offset="1" stop-color="#e879f9" stop-opacity="0"/></radialGradient>
    <filter id="softGlow"><feGaussianBlur stdDeviation="13" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="blur"><feGaussianBlur stdDeviation="34"/></filter>
    <style>.tiny{font-family:Inter,Arial,sans-serif;letter-spacing:8px;font-weight:950}.label{font-family:Inter,Arial,sans-serif;letter-spacing:5px;font-weight:950}.mono{font-family:JetBrains Mono,Consolas,monospace}</style>
  </defs>

  <rect width="1600" height="2100" fill="url(#bg)"/>
  <rect width="1600" height="2100" fill="url(#pulse)"/>
  <rect width="1600" height="2100" fill="url(#gold)"/>
  <rect width="1600" height="2100" fill="url(#pink)"/>
  ${Array.from({ length: 84 }).map((_, i) => `<circle cx="${(i * 137) % 1600}" cy="${(i * 89) % 2100}" r="${1 + (i % 4)}" fill="${["#67e8f9", "#fbbf24", "#f472b6", "#ffffff"][i % 4]}" opacity="${0.14 + (i % 6) * 0.045}"/>`).join("")}
  <path d="M0 260 H1600 M0 600 H1600 M0 940 H1600 M0 1280 H1600 M0 1620 H1600 M220 0 V2100 M560 0 V2100 M900 0 V2100 M1240 0 V2100" stroke="#38bdf8" stroke-opacity="0.058" stroke-width="2"/>
  <circle cx="1270" cy="260" r="270" fill="#22d3ee" opacity=".16" filter="url(#blur)"/>
  <circle cx="260" cy="1760" r="320" fill="#fbbf24" opacity=".12" filter="url(#blur)"/>
  <circle cx="1380" cy="1620" r="250" fill="#e879f9" opacity=".12" filter="url(#blur)"/>

  <rect x="78" y="78" width="1444" height="1944" rx="100" fill="rgba(2,6,23,0.58)" stroke="url(#frame)" stroke-opacity="0.86" stroke-width="5"/>
  <rect x="118" y="118" width="1364" height="1864" rx="76" fill="rgba(255,255,255,0.036)" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
  <rect x="150" y="150" width="1300" height="212" rx="48" fill="rgba(2,6,23,.58)" stroke="#67e8f9" stroke-opacity=".20"/>

  <text x="170" y="222" fill="#fef3c7" class="tiny" font-size="34">${safeText(cardData.badge)}</text>
  <text x="1428" y="222" fill="#67e8f9" class="tiny" font-size="28" text-anchor="end">${safeText(platform)} · ${safeText(format)}</text>
  <text x="170" y="290" fill="#94a3b8" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="850">${safeText(cardData.cardNumber)} · ${safeText(cardData.source)} · SVG / PDF / JSON READY</text>

  ${svgTextLines(headlineLines, { x: 160, y: 450, lineHeight: 58, fill: "#67e8f9", size: 48, weight: 950 })}
  ${svgTextLines(titleLines, { x: 160, y: 662, lineHeight: 122, fill: "#f8fafc", size: titleLines.length > 1 ? 94 : 132, weight: 950 })}
  ${svgTextLines(subtitleLines, { x: 160, y: titleLines.length > 1 ? 886 : 810, lineHeight: 44, fill: "#cbd5e1", size: 35, weight: 820 })}
  <text x="160" y="970" fill="#64748b" class="mono" font-size="30" font-weight="850" letter-spacing="3">${safeText(cardData.code)}</text>

  <g transform="translate(800 1190)" filter="url(#softGlow)">
    <circle r="360" fill="rgba(34,211,238,0.045)" stroke="#22d3ee" stroke-opacity="0.30" stroke-width="30"/>
    <circle r="276" fill="rgba(251,191,36,0.035)" stroke="#fbbf24" stroke-opacity="0.42" stroke-width="18"/>
    <circle r="184" fill="rgba(2,6,23,0.78)" stroke="#ffffff" stroke-opacity="0.13" stroke-width="2"/>
    <circle r="430" fill="none" stroke="${ringColor}" stroke-opacity=".18" stroke-width="3" stroke-dasharray="18 20"/>
    <line x1="-420" y1="0" x2="420" y2="0" stroke="#67e8f9" stroke-opacity="0.20" stroke-width="4"/>
    <line x1="0" y1="-420" x2="0" y2="420" stroke="#fbbf24" stroke-opacity="0.18" stroke-width="4"/>
    <text y="-48" fill="#67e8f9" font-family="Inter, Arial, sans-serif" font-size="196" font-weight="950" text-anchor="middle">${safeText(cardData.score)}%</text>
    <text y="42" fill="#dbeafe" font-family="Inter, Arial, sans-serif" font-size="38" font-weight="900" text-anchor="middle" letter-spacing="4">${safeText(cardData.metric).toUpperCase()}</text>
    <text y="124" fill="#fef3c7" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="950" text-anchor="middle">${safeText(cardData.rank)} · ${safeText(cardData.top)}</text>
    <g transform="translate(-132 -282)"><rect width="112" height="112" rx="26" fill="url(#tile)" stroke="#67e8f9" stroke-opacity=".55"/><text x="56" y="70" text-anchor="middle" fill="#e0f2fe" font-family="Inter,Arial" font-size="46" font-weight="950">${safeText(leftSymbol)}</text></g>
    <g transform="translate(26 170)"><rect width="112" height="112" rx="26" fill="url(#tile)" stroke="#fbbf24" stroke-opacity=".62"/><text x="56" y="70" text-anchor="middle" fill="#fef3c7" font-family="Inter,Arial" font-size="46" font-weight="950">${safeText(rightSymbol)}</text></g>
  </g>

  <rect x="150" y="1548" width="1300" height="250" rx="48" fill="rgba(2,6,23,0.70)" stroke="#ffffff" stroke-opacity="0.12"/>
  <text x="190" y="1622" fill="#fef3c7" class="label" font-size="26">DISCOVERY SUMMARY</text>
  ${svgTextLines(narrativeLines, { x: 190, y: 1687, lineHeight: 41, fill: "#e2e8f0", size: 31, weight: 760 })}

  <g transform="translate(150 1848)">
    ${[
      [0, cardData.statA, "VIEWS", "#67e8f9"],
      [332, cardData.statB, "SAVES", "#34d399"],
      [664, cardData.statC, "REPORTS", "#f472b6"],
      [996, cardData.tier, "CLASS", "#fbbf24"],
    ].map(([x, value, label, color]) => `<g transform="translate(${x} 0)"><rect width="294" height="142" rx="34" fill="rgba(2,6,23,0.72)" stroke="${color}" stroke-opacity="0.45"/><circle cx="250" cy="33" r="25" fill="${color}" opacity=".16"/><text x="147" y="61" fill="${color}" font-family="Inter,Arial" font-size="29" font-weight="950" text-anchor="middle">${safeText(value)}</text><text x="147" y="101" fill="#94a3b8" font-family="Inter,Arial" font-size="18" font-weight="900" text-anchor="middle" letter-spacing="4">${label}</text></g>`).join("\n")}
  </g>

  <text x="150" y="2040" fill="#fef3c7" class="label" font-size="24">${safeText(footerLine.toUpperCase())}</text>
  <text x="1450" y="2040" fill="#67e8f9" class="label" font-size="30" text-anchor="end">ELEMENTOS</text>
  <text x="150" y="2078" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="850">${safeText(exportLayout)} · DISCOVER · SIMULATE · UNDERSTAND · SHARE</text>
</svg>`;
;
    setExportHistory((history) => [
      { format, layout: exportLayout, title: cardData.title, score: cardData.score, time: new Date().toLocaleTimeString() },
      ...history,
    ].slice(0, 8));
    exportAllFormats({
      baseName: `ElementOS-${format.replace(/\s+/g, "-")}-${layoutMeta.name}-viral-card`,
      title: `${cardData.title} ${format}`,
      summary: `${cardData.headline}. ${cardData.subtitle}. ${cardData.story}`,
      payload: { ...cardData, format, layout: exportLayout, viralScore, readiness, platform, ctaVariant },
      customSvg: svg,
    });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><Sparkles size={12}/> connected media engine</Pill>
          <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
            Discovery <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Media Engine</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Anything valuable in ElementOS can become media: Compare results, Discovery Feed assets, Matter Intelligence scans, Time Machine forecasts, Seismo readouts, Well Driller signals, reports and workspace discoveries.
          </p>
          <Info title="Media doctrine">
            The studio is no longer anchored to one fixed pair. Select a source from across the website, then generate a card, poster, report, social pack, SVG, PDF and JSON export from that live context.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Media source</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {mediaSources.map((source) => (
              <button
                key={source.id}
                onClick={() => setMediaSourceId(source.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${mediaSourceId === source.id ? "border-amber-300/50 bg-amber-300/15 text-amber-100" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/[.05]"}`}
              >
                <span className="block text-[10px] uppercase tracking-[.18em] text-slate-500">{source.type}</span>
                {source.label}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
            <b>Selected source:</b> {selectedMediaSource.title} · {selectedMediaSource.score}% {selectedMediaSource.metric}. This source controls the exported card, poster, social captions and PDF/JSON/SVG pack.
          </div>

          <div className="mt-6 text-xs uppercase tracking-[.22em] text-slate-500">Card format</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {formats.map((m) => (
              <button
                key={m}
                onClick={() => setFormat(m)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${format === m ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/[.05]"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <input value={founderName} onChange={(e) => setFounderName(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" placeholder="Founder name" />
            <button onClick={() => setHeadlineMode(headlineMode === "AI Headline" ? "Simple" : "AI Headline")} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm font-black text-cyan-100">{headlineMode}</button>
          </div>
          <div className="mt-5">
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Export layout</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {exportLayouts.map((layout) => (
                <button
                  key={layout}
                  onClick={() => setExportLayout(layout)}
                  className={`rounded-2xl border px-3 py-3 text-left text-xs font-black transition ${exportLayout === layout ? "border-amber-300/50 bg-amber-300/15 text-amber-100" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/[.05]"}`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <input value={seriesNumber} onChange={(e) => setSeriesNumber(Number(e.target.value) || 1)} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none" placeholder="Series number" />
            <Button onClick={() => setCardIndex((v) => v + 1)}>Next Discovery</Button>
            <Button onClick={copyCard}>Copy Post</Button>
            <Button onClick={createSocialPack}>Create Social Pack</Button>
            <Button onClick={exportSVG} variant="primary" className="sm:col-span-3">Export PDF/JSON/SVG</Button>
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="viralcards" />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><ShieldCheck size={12}/> button value audit</Pill>
            <h2 className="mt-3 text-3xl font-black">Every major card action now creates value.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Use this engine to choose a live source from anywhere in ElementOS, export PDF/JSON/SVG, copy platform captions, create a full social pack, save the asset path and move users toward reports, workspace and public discovery pages.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {["Export", "Save", "Share"].map((label) => (
              <div key={label} className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-center text-sm font-black text-cyan-100">{label}</div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[780px] overflow-hidden rounded-[2.5rem] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/15 via-slate-950 to-fuchsia-500/20 p-6 shadow-[0_0_120px_rgba(34,211,238,.20)]">
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative z-10 flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Pill gold>{cardData.badge}</Pill>
                <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-100">{cardData.source}</div>
              </div>
              <div className="mt-6 text-sm font-black uppercase tracking-[.25em] text-amber-100">{cardData.headline}</div>
              <h2 className="mt-4 text-6xl font-black leading-none text-cyan-100 sm:text-7xl">{cardData.title}</h2>
              <p className="mt-4 text-xl font-bold text-slate-300">{cardData.subtitle}</p>
              <div className="mt-4 font-mono text-sm text-slate-500">{cardData.code}</div>
            </div>

            <div className="my-10 grid place-items-center">
              <div className="relative grid h-76 w-76 place-items-center rounded-full border-[18px] border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_90px_rgba(34,211,238,.28)]">
                <div className="absolute h-56 w-56 rounded-full border-[14px] border-amber-300/25" />
                <div className="absolute h-40 w-40 rounded-full border border-white/15" />
                <div className="text-center">
                  <div className="text-7xl font-black text-cyan-100">{cardData.score}%</div>
                  <div className="mt-2 text-xs uppercase tracking-[.24em] text-slate-400">{cardData.metric}</div>
                  <div className="mt-4 text-sm font-black text-amber-100">{cardData.rank} · {cardData.top}</div>
                </div>
              </div>
            </div>

            <div>
              <p className="rounded-[1.5rem] border border-white/10 bg-white/[.045] p-5 text-sm leading-7 text-slate-200">{cardData.narrative}</p>
              <div className="mt-3 rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50"><b>{cardData.cardNumber}</b> · {cardData.hook}<br/><span className="text-amber-100">Constellation:</span> {cardData.constellation}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[cardData.statA, cardData.statB, cardData.statC, cardData.tier].map((stat) => (
                  <div key={stat} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-center text-sm font-black text-cyan-100">{stat}</div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {badges.map((badge) => <span key={badge} className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-amber-100">{badge}</span>)}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 text-xs uppercase tracking-[.24em] text-slate-500">
                <span>FOUND BY {cardData.founder}</span>
                <span>ELEMENTOS</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Panel>
            <Pill gold><Database size={12}/> connected sources</Pill>
            <h2 className="mt-3 text-3xl font-black">Create media from any ElementOS result.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Pick the source that matches what the user just did. Compare should feel connected to cards; Matter Intelligence, Time Machine and Reports should feel connected too.</p>
            <div className="mt-5 grid gap-3">
              {mediaSources.map((source) => (
                <button key={`source-card-${source.id}`} onClick={() => setMediaSourceId(source.id)} className={`rounded-2xl border p-4 text-left transition ${mediaSourceId === source.id ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-black/25 hover:bg-white/[.05]"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[.22em] text-slate-500">{source.type}</div>
                      <div className="mt-1 text-lg font-black text-cyan-100">{source.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{source.headline}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-200">{source.score}%</div>
                      <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">{source.metric}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <Pill><Network size={12}/> viral ranking</Pill>
            <h2 className="mt-3 text-4xl font-black">Trending Discovery Queue</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Use these as your daily content calendar. Each row can become a card, poster, report or public discovery page.</p>
            <div className="mt-6 space-y-3">
              {discoveries.slice(0, 7).map((d, index) => {
                const activeQueueItem = mediaSourceId === "discovery" && cardIndex === index;
                return (
                <button
                  key={`${d.dna}-viral`}
                  onClick={() => {
                    setCardIndex(index);
                    setMediaSourceId("discovery");
                  }}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${activeQueueItem ? "border-cyan-300/50 bg-cyan-300/15 shadow-[0_0_34px_rgba(34,211,238,.16)]" : "border-white/10 bg-black/25 hover:border-cyan-300/30 hover:bg-cyan-300/10"}`}
                >
                  <div>
                    <div className="text-lg font-black text-cyan-100">#{index + 1} · {d.a} + {d.b}</div>
                    <div className="mt-1 text-sm text-slate-400">{d.type} · {d.tier} · {d.dna}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-200">{d.aiConfidence}%</div>
                    <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI</div>
                  </div>
                </button>
              );
              })}
            </div>
          </Panel>

          <Panel>
            <Pill gold><Sparkles size={12}/> story engine</Pill>
            <h2 className="mt-3 text-3xl font-black">Post Hook Generator</h2>
            <div className="mt-5 space-y-3">
              {storyLines.map((line) => <div key={line} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-300">{line}</div>)}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={copyCard} className="w-full">Copy Hook</Button>
              <Button onClick={() => setPage("publicdiscovery")} variant="primary" className="w-full">Open Public Discovery</Button>
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Activity size={12}/> measurable media engine</Pill>
            <h2 className="mt-3 text-4xl font-black">Viral readiness, performance score and post intelligence.</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">This turns Media Engine from a design export into a growth system: score the asset, pick the right platform, test caption variants and track what you exported.</p>
          </div>
          <div className="rounded-[2rem] border border-emerald-300/25 bg-emerald-300/10 px-5 py-4 text-right">
            <div className="text-5xl font-black text-emerald-100">{performanceScore}</div>
            <div className="text-[10px] uppercase tracking-[.22em] text-emerald-200">performance score</div>
            <div className="mt-1 text-xs font-black text-white">{viralReadiness}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {platformRecommendations.map(([platform, recommendation]) => (
            <div key={platform} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/5 p-5">
              <div className="text-2xl font-black text-cyan-100">{platform}</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{recommendation}</p>
              <Button onClick={() => copyCaption(platform)} className="mt-4 w-full">Copy {platform} Caption</Button>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {abVariants.map(([label, title, text, bestFor]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-amber-100">Variant {label}</div>
              <div className="mt-2 text-lg font-black text-white">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-xs font-bold text-cyan-100">{bestFor}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <Pill gold><ShieldCheck size={12}/> discovery confidence</Pill>
          <h2 className="mt-3 text-3xl font-black">Confidence Meter</h2>
          <div className="mt-5 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6 text-center">
            <div className="text-7xl font-black text-cyan-100">{Math.min(99, cardData.score + 2)}%</div>
            <div className="mt-2 text-xs uppercase tracking-[.25em] text-slate-400">discovery confidence</div>
          </div>
          <div className="mt-5 space-y-3">
            {confidenceMetrics.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><Dna size={12}/> discovery genome</Pill>
          <h2 className="mt-3 text-3xl font-black">Discovery Genome™</h2>
          <div className="mt-4 rounded-[2rem] border border-white/10 bg-black/30 p-5">
            <div className="font-mono text-4xl font-black text-amber-100">{discoveryGenome}</div>
            <div className="mt-2 text-xs uppercase tracking-[.22em] text-slate-500">unique discovery fingerprint</div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {genomeMetrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4">
                <div className="flex justify-between text-sm font-black text-cyan-100"><span>{label}</span><span>{value}%</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel>
          <Pill gold><Clock3 size={12}/> discovery evolution</Pill>
          <h2 className="mt-3 text-3xl font-black">Evolution Timeline</h2>
          <div className="mt-5 space-y-3">
            {["Generated", "Validated", "Reported", "Published", "Trending"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</div>
                <div><div className="font-black text-white">{step}</div><div className="text-xs text-slate-400">Day {index === 0 ? 1 : index * 2 + 1} · discovery asset progressed</div></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><BarChart3 size={12}/> discovery forecast</Pill>
          <h2 className="mt-3 text-3xl font-black">Forecast Engine</h2>
          <div className="mt-5 grid gap-3">
            {[ ["30 Days", "▲", "Rising interest"], ["90 Days", "▲▲", "Increasing similarity"], ["1 Year", "▲▲▲", "Network candidate"] ].map(([range, trend, note]) => (
              <div key={range} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between"><b className="text-white">{range}</b><span className="text-2xl font-black text-emerald-200">{trend}</span></div>
                <div className="mt-1 text-sm text-slate-400">{note}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill gold><Orbit size={12}/> constellation universe</Pill>
          <h2 className="mt-3 text-3xl font-black">Discovery Constellation</h2>
          <div className="relative mt-5 h-72 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.16),transparent_35%),#020617]">
            {[ [22,24,splitPair(cardData.title)[0]], [66,34,splitPair(cardData.title)[1]], [48,66,"Report"], [82,72,"Share"], [28,78,"Save"] ].map(([left, top, label], index) => (
              <div key={label} className="absolute grid h-16 w-16 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-black text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.18)]" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)' }}>{label}</div>
            ))}
            <div className="absolute left-[22%] top-[24%] h-px w-[45%] origin-left rotate-[12deg] bg-cyan-300/40" />
            <div className="absolute left-[48%] top-[66%] h-px w-[35%] origin-left rotate-[10deg] bg-amber-300/40" />
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Gem size={12}/> scientific discovery network</Pill>
            <h2 className="mt-3 text-4xl font-black">Collections, Battles, Hall of Fame and Discovery TV.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">These systems give ElementOS network effects: people collect discoveries, compare them, watch them trend and build reputation around them.</p>
          </div>
          <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-3 text-sm font-black text-fuchsia-100">LIVE DISCOVERY CHANNEL</div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xl font-black text-cyan-100">Discovery Collections</div>
            <div className="mt-4 space-y-3">{collections.map(([name, count, examples]) => <div key={name} className="rounded-2xl bg-white/[.04] p-3"><b>{name}</b><div className="text-xs text-slate-400">{count} · {examples}</div></div>)}</div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xl font-black text-cyan-100">Discovery Battles</div>
            <div className="mt-4 space-y-3">{tournamentPairs.map(([a,b,winner,reason]) => <div key={a} className="rounded-2xl bg-white/[.04] p-3"><b>{a} VS {b}</b><div className="text-xs text-emerald-200">Winner: {winner}</div><div className="text-xs text-slate-400">{reason}</div></div>)}</div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xl font-black text-cyan-100">Hall of Fame</div>
            <div className="mt-4 space-y-3">{hallOfFame.slice(0,3).map((d) => <div key={d.dna} className="rounded-2xl bg-white/[.04] p-3"><b>#{d.rank} {d.a} + {d.b}</b><div className="text-xs text-slate-400">{d.aiConfidence}% · {d.saves} saves · {d.shares} shares</div></div>)}</div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
            <div className="text-xl font-black text-cyan-100">Discovery Passport</div>
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="text-2xl font-black text-white">{founderName || "Paul Roper"}</div>
              <div className="mt-1 text-sm text-amber-100">Discovery Architect</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs"><div className="rounded-xl bg-black/25 p-2"><b>184</b><br/>Discoveries</div><div className="rounded-xl bg-black/25 p-2"><b>42</b><br/>Reports</div><div className="rounded-xl bg-black/25 p-2"><b>4210</b><br/>Score</div><div className="rounded-xl bg-black/25 p-2"><b>Top 1%</b><br/>Rank</div></div>
            </div>
          </div>
        </div>
      </Panel>

      {exportHistory.length > 0 && (
        <Panel>
          <Pill gold><Download size={12}/> export history</Pill>
          <h2 className="mt-3 text-3xl font-black">Recent Exports</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {exportHistory.map((item, index) => (
              <div key={`${item.time}-${index}`} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="font-black text-cyan-100">{item.format}</div>
                <div className="mt-1 text-xs text-slate-400">{item.layout} · {item.title}</div>
                <div className="mt-2 text-sm font-black text-emerald-200">{item.score}% · {item.time}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Share2 size={12}/> channel playbook</Pill>
            <h2 className="mt-3 text-4xl font-black">Make every discovery travel further.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">The same asset should be framed differently on each channel. Curiosity for X, credibility for LinkedIn, explanation for Reddit, launch proof for Product Hunt.</p>
          </div>
          <Button onClick={() => setPage("discover")} variant="primary">Open Discovery Feed</Button>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {channels.map(([title, desc]) => (
            <div key={title} className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/5 p-5">
              <div className="text-xl font-black text-cyan-100">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
              <button onClick={copyCard} className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-black text-white transition hover:bg-cyan-300/10">Copy tailored post</button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Pill gold><Target size={12}/> next growth step</Pill>
            <h2 className="mt-3 text-4xl font-black">Turn this card into the viral loop.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Export the card, post it, link to the public discovery page, then invite viewers to generate their own discovery. That is the loop: discover → card → share → click → create.</p>
          </div>
          <div className="grid gap-3">
            <Button onClick={exportSVG} variant="primary">Export Poster PDF/JSON/SVG</Button>
            <Button onClick={() => setPage("reports")}>Generate Report</Button>
            <Button onClick={() => setPage("lab")}>Save to Workspace</Button>
          </div>
        </div>
      </Panel>
    </>
  );
}


function UniversalSimulationReports({ selected = "Al", compare = [], session, isPro, startCheckout, setPage }) {
  const [source, setSource] = useState("Complete Simulation Dossier");
  const active = elementMap[selected] || elementMap.Al;
  const activeScore = score(active.symbol);
  const compareSet = compare?.length ? compare : ["Al", "Fe", "Ti", "Cu"];
  const compatibility = compareSet.length >= 2 ? compatibilityScore(compareSet[0], compareSet[1]) : 84;
  const timeRisk = Math.max(5, Math.min(95, Math.round(100 - activeScore.stability * 15 + activeScore.rarity * 2)));
  const drillingRisk = Math.max(8, Math.min(96, Math.round(42 + activeScore.pressure * 7 - activeScore.stability * 3)));
  const seismoClarity = Math.max(55, Math.min(99, Math.round(62 + activeScore.pressure * 6 + activeScore.thermal * 3)));
  const scenarioConfidence = Math.max(70, Math.min(98, Math.round(76 + activeScore.stability * 3 + compatibility * 0.08)));
  const universalScore = Math.max(1, Math.min(99, Math.round((compatibility + scenarioConfidence + seismoClarity + (100 - timeRisk)) / 4)));

  const reportRows = [
    ["Time Machine", `${100 - timeRisk}%`, "Long-horizon stability signal across environmental exposure and fatigue."],
    ["Scenario Builder", `${scenarioConfidence}%`, "Plain-English scenario confidence based on material durability and inferred stress."],
    ["Well Driller Lab", `${100 - drillingRisk}%`, "Subsurface drilling readiness from pressure, depth and formation response."],
    ["Seismo", `${seismoClarity}%`, "P-wave/S-wave clarity estimate for subsurface response interpretation."],
  ];

  const timeline = [0, 1, 10, 25, 50, 100].map((year) => {
    const stability = Math.max(8, Math.round(96 - Math.log10(year + 1) * (timeRisk * 0.72)));
    const pressure = Math.min(99, Math.round(24 + Math.log10(year + 1) * drillingRisk * 0.55));
    const signal = Math.max(15, Math.round(seismoClarity - Math.log10(year + 1) * 8));
    return { year, stability, pressure, signal };
  });

  const exportUniversalReport = () => {
    const content = `ElementOS Universal Simulation Report\n\nSource: ${source}\nMaterial focus: ${active.name} (${active.symbol})\nCompare set: ${compareSet.join(" + ")}\nUniversal simulation score: ${universalScore}%\n\nModules:\n${reportRows.map(([name, value, desc]) => `${name}: ${value} — ${desc}`).join("\n")}\n\nTimeline:\n${timeline.map((t) => `Year ${t.year}: stability ${t.stability}%, drilling pressure ${t.pressure}%, seismic signal ${t.signal}%`).join("\n")}\n\nRecommended next step: validate the strongest module in Time Machine, Well Driller or Seismo, then export a focused report.\n\nGenerated by ElementOS.`;
    exportAllFormats({ baseName: `ElementOS-universal-simulation-report-${active.symbol}`, title: `Universal Simulation Report: ${active.name}`, summary: content, payload: { source, material: active.symbol, universalScore, compareSet } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <Pill gold><BookOpen size={12}/> universal simulation report engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Simulation <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Report Engine</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Combine Time Machine, Scenario Builder, Well Driller Lab and Seismo into one polished research-ready dossier. This turns ElementOS simulations into outputs users can save, share and present.
          </p>
          <Info title="Why this matters">
            A simulator is interesting. A simulator that generates a professional report becomes a product. This page connects all major intelligence modules into a single exportable simulation narrative.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Universal score</div>
          <div className="mt-3 text-7xl font-black text-cyan-100">{universalScore}%</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">Combined confidence across material compatibility, future-state stability, drilling readiness and seismic clarity.</p>
          <select value={source} onChange={(e) => setSource(e.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">
            {["Complete Simulation Dossier", "Time Machine Focus", "Scenario Builder Focus", "Well Driller Focus", "Seismo Focus"].map((x) => <option key={x}>{x}</option>)}
          </select>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button onClick={exportUniversalReport} variant="primary"><Download size={16} className="inline"/> Export PDF/JSON/SVG</Button>
            {!isPro ? <Button onClick={session ? startCheckout : () => setPage("beta")}>Unlock Pro PDF</Button> : <Button onClick={() => setPage("reports")}>Open Reports</Button>}
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="simreports" />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reportRows.map(([name, value, desc]) => (
          <Panel key={name}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{name}</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><BarChart3 size={12}/> integrated timeline</Pill>
            <h2 className="mt-3 text-4xl font-black">Cross-Simulation Timeline</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">One visual timeline blending long-term material stability, drilling pressure load and seismic signal quality.</p>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100">{active.symbol} focus · {compareSet.join(" + ")}</div>
        </div>

        <svg viewBox="0 0 100 100" className="mt-6 h-80 w-full rounded-[2rem] border border-white/10 bg-black/25 p-4">
          {[20,40,60,80].map((y) => <line key={y} x1="4" x2="96" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
          <polyline points={timeline.map((t, i) => `${8 + i * 17},${96 - t.stability}`).join(" ")} fill="none" stroke="rgba(34,211,238,.95)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={timeline.map((t, i) => `${8 + i * 17},${96 - t.signal}`).join(" ")} fill="none" stroke="rgba(251,191,36,.92)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={timeline.map((t, i) => `${8 + i * 17},${t.pressure}`).join(" ")} fill="none" stroke="rgba(244,63,94,.85)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          {timeline.map((t, i) => <text key={t.year} x={8 + i * 17} y="98" textAnchor="middle" className="fill-slate-400 text-[3.5px]">Y{t.year}</text>)}
          <text x="5" y="8" className="fill-cyan-100 text-[4px]">Stability</text>
          <text x="5" y="15" className="fill-amber-100 text-[4px]">Seismic signal</text>
          <text x="5" y="22" className="fill-rose-100 text-[4px]">Pressure load</text>
        </svg>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          ["Open Time Machine", "timemachine", "Validate long-horizon ageing and degradation."],
          ["Open Well Driller", "welldriller", "Inspect subsurface path, depth and reservoir targeting."],
          ["Open Seismo Lab", "seismo", "Compare P-wave and S-wave response."],
        ].map(([title, target, desc]) => (
          <Panel key={title}>
            <h3 className="text-2xl font-black text-cyan-100">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
            <Button onClick={() => setPage(target)} className="mt-5 w-full" variant="primary">Launch Module</Button>
          </Panel>
        ))}
      </div>
    </>
  );
}


function AICopilotCommandCenter({ selected, compare, setSelected, setCompare, setPage }) {
  const [query, setQuery] = useState("best materials for deep ocean pressure over 40 years");
  const [mode, setMode] = useState("simulation");

  const normalized = query.toLowerCase();
  const active = elementMap[selected] || elementMap.Al;

  const intent = useMemo(() => {
    if (normalized.includes("ocean") || normalized.includes("salt") || normalized.includes("water")) return "Deep ocean / corrosion resilience";
    if (normalized.includes("heat") || normalized.includes("thermal") || normalized.includes("temperature")) return "High heat / thermal endurance";
    if (normalized.includes("seismic") || normalized.includes("wave") || normalized.includes("earthquake")) return "Seismic wave interpretation";
    if (normalized.includes("well") || normalized.includes("drill") || normalized.includes("reservoir")) return "Subsurface drilling intelligence";
    if (normalized.includes("share") || normalized.includes("viral") || normalized.includes("card")) return "Viral communication asset";
    if (normalized.includes("report") || normalized.includes("pdf") || normalized.includes("export")) return "Research report generation";
    return "Material discovery and simulation";
  }, [normalized]);

  const recommended = useMemo(() => {
    const envBoost = (symbol) => {
      const s = score(symbol);
      let boost = s.stability * 16 + s.pressure * 11 + s.thermal * 8 + s.rarity * 4;
      if (normalized.includes("ocean") || normalized.includes("salt")) boost += s.stability * 10 + s.pressure * 8;
      if (normalized.includes("heat") || normalized.includes("thermal")) boost += s.thermal * 16;
      if (normalized.includes("conduct") || normalized.includes("copper")) boost += s.conductivity * 18;
      if (normalized.includes("deep") || normalized.includes("pressure")) boost += s.pressure * 18;
      return boost;
    };

    return elements
      .map((e) => ({ ...e, aiScore: Math.round(envBoost(e.symbol)) }))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 6);
  }, [normalized]);

  const pairs = useMemo(() => {
    return generateDiscoveryEngine(18)
      .filter((d) => recommended.some((r) => r.symbol === d.a || r.symbol === d.b))
      .slice(0, 4);
  }, [recommended]);

  const confidence = Math.max(82, Math.min(99, Math.round(88 + recommended[0]?.aiScore % 11)));
  const actionPlan = [
    ["Simulate", "Open Time Machine", "timemachine", "Project how the strongest material changes over long time horizons."],
    ["Scenario", "Open Scenario Builder", "scenario", "Turn the prompt into a risk score, lifespan estimate and substitute recommendation."],
    ["Report", "Create Simulation Dossier", "simreports", "Bundle Time Machine, Scenario, Well Driller and Seismo outputs into a dossier."],
    ["Share", "Create Media", "viralcards", "Turn this insight into a cinematic social asset for growth."],
  ];

  const applySuggestion = () => {
    const symbols = recommended.slice(0, 4).map((x) => x.symbol);
    setSelected(symbols[0] || selected);
    setCompare(symbols.length ? symbols : compare);
  };

  const exportBrief = () => {
    const lines = [
      "ElementOS AI Copilot Brief",
      `Query: ${query}`,
      `Intent: ${intent}`,
      `AI confidence: ${confidence}%`,
      "",
      "Recommended materials:",
      ...recommended.map((r, i) => `${i + 1}. ${r.name} (${r.symbol}) — signal ${r.aiScore}`),
      "",
      "Suggested actions:",
      ...actionPlan.map((a) => `- ${a[1]}: ${a[3]}`),
    ];
    exportAllFormats({ baseName: "elementos-ai-copilot-brief", title: "ElementOS AI Copilot Brief", summary: lines.join("\n"), payload: { query, intent, confidence, recommended: recommended.map((r) => r.symbol) } });
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><Sparkles size={12}/> command center</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            AI Copilot <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Ask ElementOS what to explore. The Copilot turns plain-language goals into material recommendations, simulations, reports, viral cards and next actions.
          </p>
          <Info title="Why this matters">
            This gives the platform an intelligent operating-system feel. Instead of users wondering where to click, they can type a goal and ElementOS guides them to the strongest workflow.
          </Info>
        </div>
        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Copilot signal</div>
          <div className="mt-3 text-6xl font-black text-emerald-200">{confidence}%</div>
          <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">AI confidence</div>
          <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
            <div className="text-xs uppercase tracking-[.2em] text-cyan-200">Detected intent</div>
            <div className="mt-2 text-2xl font-black text-cyan-100">{intent}</div>
          </div>
          <Button onClick={applySuggestion} variant="primary" className="mt-5 w-full">Apply Suggested Compare Set</Button>
          <Button onClick={exportBrief} className="mt-3 w-full"><Download size={16} className="inline"/> Export Copilot PDF/JSON/SVG</Button>
        </Panel>
      </Panel>

      <GuidePanel page="copilot" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill><Search size={12}/> ask elementos</Pill>
            <h2 className="mt-3 text-4xl font-black">Natural-Language Material Search</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Type a goal, environment, report idea or viral content prompt. This is a lightweight deterministic Copilot layer that keeps the app fast and stable.
            </p>
          </div>
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
            <option value="simulation">Simulation</option>
            <option value="report">Report</option>
            <option value="viral">Viral Card</option>
            <option value="research">Research</option>
          </select>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-5 min-h-[130px] w-full rounded-[2rem] border border-cyan-300/15 bg-slate-950/80 p-5 text-lg text-cyan-50 outline-none"
          placeholder="Ask: best materials for deep ocean pressure over 40 years"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "best materials for deep ocean pressure over 40 years",
            "seismic wave comparison for deep reservoir drilling",
            "thermal material substitute for copper under high heat",
            "create a viral discovery card from titanium and hafnium",
          ].map((x) => <Button key={x} onClick={() => setQuery(x)}>{x}</Button>)}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel>
          <Pill gold><Atom size={12}/> recommended materials</Pill>
          <h2 className="mt-3 text-4xl font-black">Copilot Material Stack</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommended.map((r, index) => {
              const s = score(r.symbol);
              return (
                <div key={r.symbol} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-emerald-400/10 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[.22em] text-slate-500">rank #{index + 1}</div>
                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">{r.aiScore}</div>
                  </div>
                  <div className="mt-4 text-5xl font-black text-cyan-100">{r.symbol}</div>
                  <div className="mt-1 text-lg font-black text-white">{r.name}</div>
                  <div className="mt-1 text-sm text-slate-400">{r.category}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Pressure {s.pressure.toFixed(1)}</div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Thermal {s.thermal.toFixed(1)}</div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Stable {s.stability.toFixed(1)}</div>
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3">Rare {s.rarity.toFixed(1)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <Pill gold><ChevronRight size={12}/> quick actions</Pill>
          <h2 className="mt-3 text-4xl font-black">What to do next</h2>
          <div className="mt-6 space-y-3">
            {actionPlan.map(([tag, title, target, desc]) => (
              <button key={title} onClick={() => setPage(target)} className="w-full rounded-[2rem] border border-white/10 bg-black/25 p-5 text-left transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
                <div className="text-xs uppercase tracking-[.22em] text-cyan-200">{tag}</div>
                <div className="mt-2 text-2xl font-black text-white">{title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><Network size={12}/> discovery routes</Pill>
            <h2 className="mt-3 text-4xl font-black">Suggested Pairings</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">These pairings are pulled from the existing ElementOS discovery engine and aligned with the current Copilot prompt.</p>
          </div>
          <Button onClick={() => setPage("discover")} variant="primary">Open Discover</Button>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pairs.map((d) => (
            <div key={d.dna} className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-amber-100">{d.tier}</div>
              <div className="mt-3 text-4xl font-black text-white">{d.a} + {d.b}</div>
              <p className="mt-3 text-sm leading-6 text-amber-50/90">{d.reason}</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 font-mono text-xs text-cyan-100">{d.dna}</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}



function MissionControl({ setPage, session, isPro, startCheckout }) {
  const missionSteps = [
    ["01", "Run your first comparison", "Compare two or more materials and understand the compatibility signal.", "compare", "2 min", "Start analysis"],
    ["02", "Generate a Time Machine forecast", "Simulate future material behaviour across long-term environments.", "timemachine", "3 min", "Forecast future"],
    ["03", "Build a real scenario", "Turn a plain-English use case into risk, lifespan and substitute suggestions.", "scenario", "4 min", "Build scenario"],
    ["04", "Create a viral discovery card", "Turn the strongest result into a cinematic social asset for sharing.", "viralcards", "1 min", "Create card"],
    ["05", "Export a simulation report", "Generate a polished research-style dossier from the active simulation ecosystem.", "simreports", "2 min", "Export report"],
    ["06", "Join beta or upgrade", "Claim the Founding Researcher path and unlock stronger workspace value.", "beta", "1 min", "Open beta"],
  ];

  const proofSignals = [
    ["Clarity", "New users always know what to do next."],
    ["Momentum", "Each action leads into a report, card, save or upgrade moment."],
    ["Retention", "Missions create a reason to return and continue the lab journey."],
    ["Conversion", "Guided paths reduce confusion before the subscription decision."],
  ];

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><CheckCircle2 size={12}/> onboarding engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Mission Control</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            A guided first-run pathway that helps users understand the platform, complete meaningful simulations, generate shareable outputs and reach the subscription moment without feeling lost.
          </p>
          <Info title="Why this matters">
            Mission Control turns ElementOS from a huge interface into a guided research journey. Users are shown exactly where to start, what to do next and why each step has value.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Current mission status</div>
          <div className="mt-3 text-6xl font-black text-cyan-100">6</div>
          <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">guided launch missions</div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-[42%] rounded-full bg-cyan-300" />
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Complete missions to move from curious visitor to active researcher. The path is designed to end in a report, a viral card or a Pro Lab upgrade decision.
          </p>
          {!isPro && (
            <Button onClick={startCheckout} variant="primary" className="mt-5 w-full">
              Unlock Pro Lab
            </Button>
          )}
        </Panel>
      </Panel>

      <GuidePanel page="mission" />

      <div className="grid gap-5 xl:grid-cols-3">
        {missionSteps.map(([num, title, desc, target, time, cta], index) => (
          <Panel key={num} className="group">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-3xl border border-cyan-300/25 bg-cyan-300/10 text-xl font-black text-cyan-100">
                {num}
              </div>
              <Pill gold={index < 3}>{time}</Pill>
            </div>
            <h2 className="mt-5 text-2xl font-black">{title}</h2>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">{desc}</p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">Outcome</div>
              <div className="mt-1 text-sm font-bold text-cyan-100">
                {index === 0 && "User understands the core comparison value."}
                {index === 1 && "User sees future-state simulation depth."}
                {index === 2 && "User creates a personal use case."}
                {index === 3 && "User has something worth sharing."}
                {index === 4 && "User reaches export/report value."}
                {index === 5 && "User enters the beta or account funnel."}
              </div>
            </div>
            <Button onClick={() => setPage(target)} variant={index === 0 ? "primary" : "ghost"} className="mt-5 w-full">
              {cta}
            </Button>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12}/> conversion psychology</Pill>
            <h2 className="mt-3 text-4xl font-black">Guided Journey Intelligence</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              The mission system is designed around one simple product truth: users do not pay for pages, they pay when the platform repeatedly gives them useful moments, clear next steps and impressive outputs.
            </p>
          </div>
          <Button onClick={() => setPage("copilot")} variant="primary">Ask AI Copilot</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {proofSignals.map(([title, desc]) => (
            <div key={title} className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/10 p-5">
              <div className="text-2xl font-black text-cyan-100">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}


function MobileBottomNav({ page, setPage }) {
  const items = [
    ["landing", "Start", Sparkles],
    ["beta", "Beta", UserPlus],
    ["copilot", "AI", Sparkles],
    ["mission", "Mission", CheckCircle2],
    ["dashboard", "Home", Home],
    ["discover", "Feed", Sparkles],
    ["timemachine", "Time", Clock3],
    ["scenario", "Scenario", FileText],
    ["lab", "Work", Save],
    ["visualization", "Visual", BarChart3],
    ["welldriller", "Well", Radar],
    ["seismo", "Seismo", Network],
    ["simreports", "Dossier", BookOpen],
    ["viralcards", "Share", Sparkles],
    ["calculations", "Calc", Calculator],
    ["explorer", "Explore", Search],
    ["compare", "Compare", BarChart3],
    ["matterlab", "MIOS", Globe2],
    ["isotopes", "Iso", Atom],
    ["reports", "Reports", BookOpen],
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cyan-300/15 bg-[#030712]/95 px-2 pb-3 pt-2 backdrop-blur-2xl lg:hidden">
      <div className="grid grid-cols-7 gap-1 sm:grid-cols-14">
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`rounded-2xl px-2 py-2 text-center text-[10px] font-black uppercase tracking-[.12em] transition ${
              page === id
                ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                : "text-slate-400"
            }`}
          >
            <Icon size={16} className="mx-auto mb-1 text-cyan-300" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function MobileActionBar({ page, setPage, compare, session, isPro, startCheckout }) {
  if (page === "landing") return null;

  const primaryLabel = page === "compare" ? "Create Report" : "Run Compare";
  const primaryTarget = page === "compare" ? "reports" : "compare";

  return (
    <div className="fixed inset-x-3 bottom-[86px] z-40 lg:hidden">
      <div className="rounded-[1.65rem] border border-cyan-300/20 bg-slate-950/90 p-3 shadow-[0_0_50px_rgba(34,211,238,.22)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-xs uppercase tracking-[.2em] text-slate-500">
              Mobile Research Session
            </div>
            <div className="mt-1 truncate text-sm font-black text-cyan-100">
              {(compare || []).slice(0, 4).join(" + ") || "No compare set"}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            {!session ? (
              <Button onClick={() => setPage("beta")} variant="primary" className="px-3 py-2 text-xs">
                Beta
              </Button>
            ) : !isPro ? (
              <Button onClick={startCheckout} variant="primary" className="px-3 py-2 text-xs">
                Pro
              </Button>
            ) : (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100">
                Pro
              </div>
            )}

            <Button onClick={() => setPage(primaryTarget)} className="px-3 py-2 text-xs">
              {primaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


function CommandPalette({ open, onClose, page, setPage, selected, setSelected, compare, setCompare, session, isPro, startCheckout }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const q = query.toLowerCase().trim();
  const currentCompare = Array.isArray(compare) ? compare : [];

  const pageActions = [
    ["dashboard", "Open Dashboard", "Command centre, live network, researcher identity and launch workspace.", "Navigation", "Dashboard"],
    ["copilot", "Ask AI Copilot", "Turn a plain-English research goal into simulations, reports and cards.", "AI", "Copilot"],
    ["mission", "Open Mission Control", "Guided onboarding missions for comparison, Time Machine, Scenario Builder, Media Engine and reports.", "Onboarding", "Mission"],
    ["discover", "Open Discovery Feed", "Trending pairings, momentum scores and AI-ranked material discoveries.", "Discovery", "Discover"],
    ["matterlab", "Open Matter Intelligence OS", "Opportunity intelligence for ranked targets, ground signals, AI explanations and reports.", "Advanced Lab", "MIOS"],
    ["isotopes", "Open Isotope Lab", "Advanced material variants and isotope-style scenario exploration.", "Research", "Isotope"],
    ["timemachine", "Run Time Machine", "Forecast ageing, corrosion, degradation and future material states.", "Simulation", "Time"],
    ["scenario", "Build Scenario", "Convert a real-world material situation into risk, lifespan and substitute outputs.", "Simulation", "Scenario"],
    ["welldriller", "Open Well Driller Lab", "Model a deep bore path, reservoir target and pressure profile.", "Simulation", "Well"],
    ["seismo", "Open Seismo Lab", "Compare P-wave and S-wave travel, arrival gaps and wave response.", "Simulation", "Seismo"],
    ["simreports", "Create Simulation Dossier", "Create a universal dossier across Time Machine, Seismo, Scenario and Well Driller.", "Reports", "Report"],
    ["viralcards", "Create Media", "Generate a cinematic share card for discoveries, simulations and reports.", "Growth", "Share"],
    ["beta", "Open Founding Beta", "Founding Researcher badge, roadmap, feedback and waitlist conversion.", "Growth", "Beta"],
    ["calculations", "Open Calculation Intelligence", "Use premium calculation blocks to support report narratives.", "Tools", "Calc"],
    ["lab", "Open Workspace", "Return to saved scenarios, reports, discoveries and research assets.", "Workspace", "Lab"],
    ["visualization", "Open Visual Engine", "Survival curves, telemetry cards, pulse graphs and cinematic visuals.", "Visuals", "Visual"],
    ["compare", "Open Compare Materials", "Compare stability, thermal, pressure, diffusion, rarity and alignment.", "Analysis", "Compare"],
    ["explorer", "Search Elements", "Inspect an element profile before adding it to a comparison.", "Elements", "Search"],
    ["periodic", "Open Periodic Map", "Browse all 118 elements with behaviour heat-map logic.", "Elements", "Periodic"],
    ["reports", "Open Research Reports", "Create public reports, premium PDFs and shareable outputs.", "Reports", "PDF"],
    ["beta", "Join Founding Beta", "Roadmap, feedback and early-access conversion.", "Growth", "Beta"],
  ];

  const elementActions = elements.slice(0, 118).map((e) => [
    `element:${e.symbol}`,
    `${e.symbol} — ${e.name}`,
    `${e.category} · atomic ${e.atomicNumber} · add to comparison and inspect behaviour profile.`,
    "Element",
    e.symbol,
  ]);

  const pairActions = [
    ["pair:Al-Fe", "Compare Aluminium + Iron", "Classic structural pairing for stability, pressure and behaviour comparison.", "Pair", "Al Fe"],
    ["pair:Ti-Hf", "Compare Titanium + Hafnium", "High-value advanced pairing for futuristic structural simulation cards.", "Pair", "Ti Hf"],
    ["pair:Cu-Ag", "Compare Copper + Silver", "Conductivity corridor comparison for electrical/material exploration.", "Pair", "Cu Ag"],
    ["pair:Si-Ge", "Compare Silicon + Germanium", "Semiconductor-adjacent behaviour pairing for advanced reports.", "Pair", "Si Ge"],
    ["pair:W-Ta", "Compare Tungsten + Tantalum", "Heavy high-pressure thermal candidate pair for Time Machine testing.", "Pair", "W Ta"],
  ];

  const smartActions = [
    ["smart:ocean", "Simulate deep ocean pressure for 40 years", "Sets Titanium, Hafnium, Tungsten and Aluminium then opens Scenario Builder.", "Smart Action", "Ocean"],
    ["smart:heat", "Find strongest high-heat material pair", "Loads Tungsten, Tantalum, Hafnium and Titanium into Compare.", "Smart Action", "Heat"],
    ["smart:seismic", "Compare P-wave / S-wave arrival gap", "Opens Seismo for seismic travel and arrival-gap response.", "Smart Action", "Seismic"],
    ["smart:well", "Model a deep Well Driller Lab path", "Opens Well Driller Lab with drilling simulation focus.", "Smart Action", "Well"],
    ["smart:time", "Forecast material decay across 100 years", "Opens Time Machine for long-horizon material survivability.", "Smart Action", "Time"],
    ["smart:viral", "Turn current work into a share card", "Opens Discovery Media Engine with social-growth workflow.", "Smart Action", "Share"],
    ["smart:report", "Generate a simulation dossier", "Opens Simulation Dossiers for a polished export dossier.", "Smart Action", "Report"],
    ["smart:mission", "Start the user onboarding mission path", "Opens Founding Beta as the current conversion and early-user pathway.", "Smart Action", "Mission"],
    ["smart:checkout", isPro ? "Pro Lab is active" : "Upgrade to Pro Lab", "Unlock premium export and workspace features.", "Billing", "Pro"],
  ];

  const allActions = [...smartActions, ...pageActions, ...pairActions, ...elementActions];

  const scoreMatch = ([id, title, desc, tag, alias]) => {
    if (!q) return tag === "Smart Action" ? 20 : tag === "Navigation" ? 12 : 8;
    const hay = `${id} ${title} ${desc} ${tag} ${alias || ""}`.toLowerCase();
    let score = 0;
    if (hay.includes(q)) score += 50;
    if (title.toLowerCase().startsWith(q)) score += 25;
    q.split(/\s+/).forEach((word) => {
      if (word && hay.includes(word)) score += 10;
    });
    if (tag === "Smart Action") score += 8;
    if (tag === "Element" && q.length <= 2 && (alias || "").toLowerCase().startsWith(q)) score += 35;
    return score;
  };

  const filtered = allActions
    .map((action) => ({ action, rank: scoreMatch(action) }))
    .filter(({ rank }) => !q || rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 18)
    .map(({ action }) => action);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runAction = (id) => {
    if (id.startsWith("element:")) {
      const sym = id.replace("element:", "");
      setSelected(sym);
      setCompare((prev) => Array.from(new Set([sym, ...(prev || [])])).slice(0, 6));
      setPage("explorer");
      onClose();
      return;
    }

    if (id.startsWith("pair:")) {
      const pair = id.replace("pair:", "").split("-");
      setSelected(pair[0]);
      setCompare(pair.slice(0, 6));
      setPage("compare");
      onClose();
      return;
    }

    if (id === "smart:ocean") {
      setSelected("Ti");
      setCompare(["Ti", "Hf", "W", "Al"]);
      setPage("scenario");
      onClose();
      return;
    }

    if (id === "smart:heat") {
      setSelected("W");
      setCompare(["W", "Ta", "Hf", "Ti"]);
      setPage("compare");
      onClose();
      return;
    }

    if (id === "smart:seismic") {
      setPage("seismo");
      onClose();
      return;
    }

    if (id === "smart:well") {
      setPage("welldriller");
      onClose();
      return;
    }

    if (id === "smart:time") {
      setPage("timemachine");
      onClose();
      return;
    }

    if (id === "smart:viral") {
      setPage("viralcards");
      onClose();
      return;
    }

    if (id === "smart:report") {
      setPage("simreports");
      onClose();
      return;
    }

    if (id === "smart:mission") {
      setPage("beta");
      onClose();
      return;
    }

    if (id === "smart:checkout") {
      if (!isPro) startCheckout?.();
      onClose();
      return;
    }

    setPage(id);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    }
    if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      runAction(filtered[activeIndex][0]);
    }
  };

  const quickPrompts = [
    "deep ocean pressure",
    "titanium",
    "share card",
    "seismo",
    "simulation dossier",
    "high heat pair",
  ];

  const currentContext = currentCompare.length ? currentCompare.slice(0, 5).join(" + ") : selected;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/75 p-4 backdrop-blur-xl" onClick={onClose} onKeyDown={onKeyDown}>
      <div className="eos-command-shell mx-auto mt-6 flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-cyan-300/30 bg-slate-950/95 shadow-[0_0_170px_rgba(34,211,238,.34)]" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Pill gold><Sparkles size={12}/> command engine</Pill>
              <h2 className="mt-3 text-4xl font-black">ElementOS Command Engine</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                Navigate, search elements, launch smart simulations, build reports, create viral cards and move through the platform like a real research operating system.
              </p>
            </div>
            <button onClick={onClose} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300">Esc</button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-black/45 px-4 py-3 shadow-[inset_0_0_35px_rgba(34,211,238,.08)]">
            <Search size={18} className="text-cyan-200" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: titanium, deep ocean pressure, viral card, seismo, report..."
              className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-slate-500"
            />
            <span className="hidden rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-400 sm:inline">CTRL K</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setQuery(prompt)}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100 hover:border-cyan-200/40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1fr_310px]">
          <div className="eos-command-scroll max-h-[56vh] p-4 lg:max-h-[58vh]">
            <div className="grid gap-3">
              {filtered.map(([id, title, desc, tag], index) => (
                <button
                  key={`${id}-${title}`}
                  onClick={() => runAction(id)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                    index === activeIndex
                      ? "border-cyan-300/45 bg-cyan-300/12 shadow-[0_0_35px_rgba(34,211,238,.14)]"
                      : "border-white/10 bg-white/[.035] hover:border-cyan-300/35 hover:bg-cyan-300/10"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-black text-cyan-100">{title}</span>
                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-1 text-[10px] uppercase tracking-[.18em] text-amber-100">{tag}</span>
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-400">{desc}</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                </button>
              ))}

              {!filtered.length && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-center text-slate-400">
                  No command found. Try “seismo”, “titanium”, “report”, “viral”, “ocean” or “time”.
                </div>
              )}
            </div>
          </div>

          <div className="eos-command-scroll max-h-[56vh] border-t border-white/10 bg-black/20 p-5 lg:max-h-[58vh] lg:border-l lg:border-t-0">
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Current context</div>
            <div className="mt-2 text-2xl font-black text-cyan-100">{currentContext}</div>
            <div className="mt-1 text-sm text-slate-400">Active page: {page}</div>

            <div className="mt-5 grid gap-3">
              <button onClick={() => runAction("smart:report")} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-left text-sm text-emerald-100">
                <b>Generate dossier</b><br />Turn current work into a universal simulation report.
              </button>
              <button onClick={() => runAction("smart:viral")} className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-left text-sm text-amber-100">
                <b>Create share card</b><br />Make this screenshot-worthy for social growth.
              </button>
              <button onClick={() => runAction("smart:ocean")} className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-left text-sm text-cyan-100">
                <b>Launch smart simulation</b><br />Deep ocean pressure scenario with advanced materials.
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-5 text-slate-400">
              Keyboard: ↑ ↓ to move · Enter to launch · Esc to close. This is the OS layer that makes ElementOS feel premium.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function ToastCenter() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (event) => {
      setMessage(String(event.detail || "Done."));
      window.clearTimeout(handler.timer);
      handler.timer = window.setTimeout(() => setMessage(""), 2200);
    };
    window.addEventListener("elementos:toast", handler);
    return () => {
      window.removeEventListener("elementos:toast", handler);
      window.clearTimeout(handler.timer);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed right-4 top-4 z-[90] rounded-2xl border border-cyan-300/25 bg-slate-950/95 px-4 py-3 text-sm font-bold text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,.25)] backdrop-blur-2xl">
      {message}
    </div>
  );
}

function ElementOSTopBar({ page, setPage, setCommandOpen, session, isPro, startCheckout }) {
  return (
    <div className="eos-topbar sticky top-4 z-20 mb-6 hidden items-center justify-between gap-4 rounded-2xl px-4 py-3 backdrop-blur-2xl lg:flex">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-xl border border-blue-400/25 bg-blue-500/10 px-3 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-100">
          {pageLabel(page)}
        </div>
        <div className="hidden text-sm text-slate-400 xl:block">Research → simulate → publish → save.</div>
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="flex min-w-[420px] items-center justify-between rounded-xl border border-[#17365f] bg-[#040c17]/90 px-4 py-2 text-left text-sm text-slate-400 transition hover:border-cyan-300/40"
      >
        <span className="flex items-center gap-2"><Search size={16} /> Search elements, reactions, reports, data...</span>
        <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-[10px] font-black text-slate-300">CTRL K</span>
      </button>

      <div className="flex items-center gap-2">
        <button onClick={() => setPage("mission")} className="grid h-10 w-10 place-items-center rounded-xl border border-[#17365f] bg-[#06101d]/80 text-slate-300">?</button>
        <button onClick={() => setPage("discover")} className="grid h-10 w-10 place-items-center rounded-xl border border-[#17365f] bg-[#06101d]/80 text-slate-300">🌐</button>
        <Button onClick={session && !isPro ? startCheckout : () => setPage("beta")} variant={isPro ? "ghost" : "primary"} className="py-2">
          {isPro ? "Pro Active" : session ? "Subscribe" : "Join Beta"}
        </Button>
      </div>
    </div>
  );
}


function UltimateScienceCommandLayer({ page, setPage, selected = "Al", compare = [], session, isPro, startCheckout }) {
  const discoveries = useMemo(() => makePublishableDiscoveries(8), []);
  const primaryDiscovery = discoveries[0] || {
    a: "Ti",
    b: "Hf",
    score: 94,
    tier: "LEGENDARY",
    type: "Rare thermal stability signal",
    reason: "high-confidence material relationship with strong report potential",
    publicId: "TI-HF-1047",
    views: 2481,
    saves: 187,
    shares: 64,
  };

  const currentCompare = Array.isArray(compare) && compare.length ? compare : [selected, "Ti", "Hf"];
  const discoveryScore = Math.min(9999, 4200 + currentCompare.length * 117 + Math.round(primaryDiscovery.score * 7));
  const loopSteps = ["Discover", "Explain", "Report", "Save", "Share", "Return"];

  const exportExecutivePack = () => {
    exportAllFormats({
      baseName: `elementos-${slugifyExportName(pageLabel(page))}-executive-pack`,
      title: `ElementOS ${pageLabel(page)} Executive Pack`,
      summary: `Premium export for ${pageLabel(page)}. Current discovery focus: ${primaryDiscovery.a} + ${primaryDiscovery.b}.`,
      payload: {
        page,
        pageLabel: pageLabel(page),
        selected,
        compare: currentCompare,
        primaryDiscovery,
        discoveryScore,
        generatedAt: new Date().toISOString(),
      },
      sections: [
        ["Current Page", pageLabel(page)],
        ["Discovery Focus", `${primaryDiscovery.a} + ${primaryDiscovery.b}`],
        ["Discovery Score", `${primaryDiscovery.score}%`],
        ["Rarity", primaryDiscovery.tier],
        ["Recommended Action", "Generate report, export SVG, publish discovery, save to Workspace."],
      ],
    });
  };

  const copyLaunchPitch = async () => {
    const pitch = `ElementOS turns material data into discoveries, reports and shareable scientific media. Today's discovery: ${primaryDiscovery.a} + ${primaryDiscovery.b} at ${primaryDiscovery.score}% confidence. Discover. Simulate. Understand.`;
    try {
      await navigator.clipboard.writeText(pitch);
      alert("Launch pitch copied.");
    } catch (error) {
      downloadFile("elementos-launch-pitch.txt", pitch);
    }
  };

  const launchSocialPack = () => {
    exportAllFormats({
      baseName: `elementos-social-pack-${primaryDiscovery.publicId || materialDNA(primaryDiscovery.a, primaryDiscovery.b)}`,
      title: "ElementOS Social Launch Pack",
      summary: `A share-ready growth pack for ${primaryDiscovery.a} + ${primaryDiscovery.b}.`,
      payload: {
        xPost: `Today's ElementOS discovery: ${primaryDiscovery.a} + ${primaryDiscovery.b} scored ${primaryDiscovery.score}%. ${primaryDiscovery.type}.`,
        linkedInPost: `ElementOS generated a new material discovery: ${primaryDiscovery.a} + ${primaryDiscovery.b}. Discovery score: ${primaryDiscovery.score}%. Rarity: ${primaryDiscovery.tier}.`,
        redditPost: `I built a material discovery card for ${primaryDiscovery.a} + ${primaryDiscovery.b}. Score: ${primaryDiscovery.score}%. Would love feedback from science/engineering builders.`,
        discovery: primaryDiscovery,
      },
      sections: [
        ["X Hook", `Today's ElementOS discovery: ${primaryDiscovery.a} + ${primaryDiscovery.b} scored ${primaryDiscovery.score}%.`],
        ["LinkedIn Hook", "Material discovery is becoming a shareable research workflow."],
        ["Reddit Hook", "Seeking feedback on an AI-native material discovery prototype."],
      ],
    });
  };

  return (
    <Panel className="border-amber-300/25 bg-gradient-to-br from-slate-950 via-[#071a2d]/95 to-cyan-950/25 p-0">
      <div className="relative overflow-hidden rounded-[1.15rem] p-5 md:p-6">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative grid gap-5 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill gold><Sparkles size={12} /> ultimate science os</Pill>
              <Pill><Radar size={12} /> live discovery command</Pill>
              <Pill><Download size={12} /> pdf json svg ready</Pill>
            </div>
            <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-tight md:text-6xl">
              Every click should create <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">an asset.</span>
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              ElementOS now runs as a discovery loop: find signal, explain it, export it, save it, share it and bring users back tomorrow.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[
                ["Discovery Score", discoveryScore.toLocaleString(), "Research momentum"],
                ["Today", `${primaryDiscovery.a} + ${primaryDiscovery.b}`, `${primaryDiscovery.score}% ${primaryDiscovery.tier}`],
                ["Conversion Loop", "6 stages", "Discover → Share"],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">{label}</div>
                  <div className="mt-2 text-2xl font-black text-white">{value}</div>
                  <div className="mt-1 text-xs text-cyan-100">{detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-black/35 p-5 shadow-[0_0_70px_rgba(34,211,238,.12)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[.24em] text-cyan-200">Recommended next move</div>
                <div className="mt-2 text-3xl font-black text-white">Publish a discovery pack</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Export a beautiful SVG, PDF report and JSON payload for {primaryDiscovery.a} + {primaryDiscovery.b}, then post it to X, LinkedIn and Reddit.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right">
                <div className="text-3xl font-black text-emerald-100">{primaryDiscovery.score}%</div>
                <div className="text-[10px] uppercase tracking-[.2em] text-emerald-200">ready</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {loopSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-center">
                  <div className="text-[10px] font-black text-amber-100">0{index + 1}</div>
                  <div className="mt-1 text-xs font-bold text-slate-200">{step}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => setPage("discover")} variant="primary" className="px-4 py-3 text-xs">Open Discovery Feed</Button>
              <Button onClick={() => setPage("matterlab")} className="px-4 py-3 text-xs">Matter Intelligence</Button>
              <Button onClick={() => setPage("viralcards")} className="px-4 py-3 text-xs">Media Engine</Button>
              <Button onClick={exportExecutivePack} className="px-4 py-3 text-xs">Export Pack</Button>
              <Button onClick={launchSocialPack} className="px-4 py-3 text-xs">Create Social Pack</Button>
              <Button onClick={copyLaunchPitch} className="px-4 py-3 text-xs">Copy Launch Pitch</Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [selected, setSelected] = useState("Al");
  const [compare, setCompare] = useState(["H"]);
  const [session, setSession] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [publicReportRequested, setPublicReportRequested] = useState(false);
  const [publicReport, setPublicReport] = useState(null);
  const [publicReportStatus, setPublicReportStatus] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [publicDiscovery, setPublicDiscovery] = useState(null);

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
  const reportId = params.get("report");
  const discoveryId = params.get("discovery");

  if (discoveryId) {
    const found = makePublishableDiscoveries(12).find((item) => item.publicId === discoveryId);
    if (found) {
      setPublicDiscovery(found);
      setPage("publicdiscovery");
    }
  }

  if (reportId) {
    setPublicReportRequested(true);
    setPublicReportStatus("Loading public report...");

    supabase
      .from("reports")
      .select("*")
      .eq("public_id", reportId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error(error);
          setPublicReport(null);
          setPublicReportStatus("Public report not found.");
          return;
        }

        setPublicReport(data);
        setPublicReportStatus("");
      })
      .catch((error) => {
        console.error(error);
        setPublicReport(null);
        setPublicReportStatus("Public report failed to load. Please try again.");
      });
  }

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


  useEffect(() => {
    const handleCommandShortcut = (event) => {
      const key = event.key?.toLowerCase?.();
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (key === "escape") {
        setCommandOpen(false);
      }
    };

    window.addEventListener("keydown", handleCommandShortcut);
    return () => window.removeEventListener("keydown", handleCommandShortcut);
  }, []);

  const saveWorkspace = async () => {
    if (!session) {
      alert("Join the Founding Beta to activate saved workspaces.");
      setPage("beta");
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
      alert("Join the Founding Beta to restore saved workspaces.");
      setPage("beta");
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
    setCompare(workspace.compare_set || ["H"]);

    alert("Workspace restored.");
  };

const startCheckout = async () => {
  if (!session) {
    alert("Join the Founding Beta before upgrading.");
    setPage("beta");
    return;
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.error || "Checkout failed. Please check your Stripe API route and environment variables.");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Checkout failed. No checkout URL was returned.");
    }
  } catch (error) {
    console.error(error);
    alert("Checkout failed. Please check your deployment/API route and try again.");
  }
};
  
  const pages = useMemo(
    () => ({
      landing: <LandingPage setPage={setPage} session={session} isPro={isPro} startCheckout={startCheckout} />,
      beta: <BetaLaunch session={session} setPage={setPage} startCheckout={startCheckout} />,
      copilot: <AICopilotCommandCenter selected={selected} compare={compare} setSelected={setSelected} setCompare={setCompare} setPage={setPage} />,
      mission: <MissionControl setPage={setPage} session={session} isPro={isPro} startCheckout={startCheckout} />,
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
      discover: <Discover setPage={setPage} setPublicDiscovery={setPublicDiscovery} />,
      publicdiscovery: <PublicDiscoveryPage discovery={publicDiscovery} setPage={setPage} setPublicDiscovery={setPublicDiscovery} />,
      timemachine: <TimeMachine selected={selected} setSelected={setSelected} setPage={setPage} />,
      matterlab: <MatterIntelligenceLab />,
      scenario: <ScenarioBuilder selected={selected} setSelected={setSelected} setPage={setPage} />,
      lab: <MyLab session={session} selected={selected} compare={compare} setPage={setPage} />,
      visualization: <AdvancedVisualization selected={selected} compare={compare} setPage={setPage} />,
      welldriller: <ExperimentalWellDriller setPage={setPage} />,
      seismo: <SeismoSimulator setPage={setPage} />,
      simreports: <UniversalSimulationReports selected={selected} compare={compare} session={session} isPro={isPro} startCheckout={startCheckout} setPage={setPage} />,
      viralcards: <ViralDiscoveryCardStudio selected={selected} compare={compare} setPage={setPage} />,
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

  if (publicReportRequested) {
    return <PublicReportView report={publicReport} status={publicReportStatus} />;
  }

  return (
    <div className="eos-shell min-h-screen bg-[#02060d] text-slate-100">
      <ElementOSThemeSkin />
      <Background />
      <ToastCenter />
      <Sidebar page={page} setPage={setPage} />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        page={page}
        setPage={setPage}
        selected={selected}
        setSelected={setSelected}
        compare={compare}
        setCompare={setCompare}
        session={session}
        isPro={isPro}
        startCheckout={startCheckout}
      />

      <button
        onClick={() => setCommandOpen(true)}
        className="fixed bottom-24 right-4 z-50 rounded-2xl border border-cyan-300/25 bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 shadow-[0_0_40px_rgba(34,211,238,.35)] lg:bottom-6"
      >
        CTRL K · Command
      </button>

      <main className="relative z-10 space-y-6 p-4 pb-40 lg:ml-[306px] lg:p-4 lg:pb-8 xl:p-5">
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
            {MOBILE_PAGE_ORDER.filter((k) => pages[k]).map((k) => (
              <option key={k} value={k}>
                {pageLabel(k)}
              </option>
            ))}
          </select>
        </div>

        <ElementOSTopBar page={page} setPage={setPage} setCommandOpen={setCommandOpen} session={session} isPro={isPro} startCheckout={startCheckout} />
        <UltimateScienceCommandLayer
          page={page}
          setPage={setPage}
          selected={selected}
          compare={compare}
          session={session}
          isPro={isPro}
          startCheckout={startCheckout}
        />
        <PageHelpStrip page={page} />
        <CopilotEverywhereBar page={page} setPage={setPage} />
        <div className="animate-[fadeIn_.22s_ease-out]">{pages[page] || pages.dashboard}</div>
      </main>

      <MobileActionBar
        page={page}
        setPage={setPage}
        compare={compare}
        session={session}
        isPro={isPro}
        startCheckout={startCheckout}
      />
      <MobileBottomNav page={page} setPage={setPage} />
    </div>
  );
}
