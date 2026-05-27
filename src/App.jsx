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
      description: "The graph shows which materials are behaviour-adjacent to your selected element. It helps users find substitute and neighbouring materials.",
      next: "Click nearby nodes to explore substitute paths.",
    },
    universe: {
      title: "What the similarity universe does",
      description: "This view finds materials that behave similarly in alloy, conductive or thermal contexts. It turns discovery into a guided search path.",
      next: "Select a mode, then follow the strongest similarity matches.",
    },
    isotopes: {
      title: "What isotope lab does",
      description: "Use this area to explore isotope-style scenarios and advanced material variations inside the ElementOS research workflow.",
      next: "Run a scenario, then export or compare the strongest signal.",
    },
    calculations: {
      title: "What calculation core does",
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
      title: "What Share Card Studio does",
      description: "Share Card Studio turns discoveries, Time Machine forecasts, Scenario Builder results, Well Driller paths and Seismo readouts into cinematic share cards for social growth.",
      next: "Choose a source, generate a card, export SVG or copy the social post text, then share it with a public report link.",
    },
    simreports: {
      title: "What Simulation Dossiers do",
      description: "Simulation Dossiers combine Time Machine, Scenario Builder, Well Driller Lab and Seismo outputs into one polished research-ready simulation dossier.",
      next: "Choose a simulation source, review the combined intelligence cards, then export the universal report.",
    },
    reports: {
      title: "What reports do",
      description: "Reports turn your comparisons into exportable, shareable research assets with summaries, compatibility scores and premium PDF output.",
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
      <button className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-cyan-300 hover:text-slate-950">{plan.cta}</button>
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
  const [active, setActive] = useState("Home");
  const [moduleIndex, setModuleIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [savedTargets, setSavedTargets] = useState(["DK-27"]);
  const [reportReady, setReportReady] = useState(false);

  const selectedModule = miModules[moduleIndex];
  const selectedTarget = miTargets[targetIndex];

  const aiLine = useMemo(() => {
    if (scanning) return "Analyzing public layers, private survey data, geometry, and historical similarity...";
    return `${selectedTarget.id} is ranked highly because ${selectedTarget.reasons[0].toLowerCase()}, ${selectedTarget.reasons[1].toLowerCase()}, and multiple datasets agree.`;
  }, [scanning, selectedTarget]);

  const runScan = () => {
    setScanning(true);
    setReportReady(false);
    setTimeout(() => {
      setTargetIndex((value) => (value + 1) % miTargets.length);
      setScanning(false);
      setReportReady(true);
      setOnboarded(true);
    }, 1700);
  };

  const toggleSaveTarget = () => {
    setSavedTargets((previous) => previous.includes(selectedTarget.id) ? previous.filter((id) => id !== selectedTarget.id) : [...previous, selectedTarget.id]);
  };

  const showUpgrade = active === "Marketplace" || active === "Team";
  const showMapArea = active === "Home" || active === "Discovery Map" || active === "AI Assistant";
  const showTargetsArea = active === "Home" || active === "Targets";
  const showProjectsArea = active === "Home" || active === "Projects";
  const showReportsArea = active === "Home" || active === "Reports" || active === "Discovery Playbooks";
  const showPlansArea = active === "Home" || active === "Settings";

  return (
    <div className="min-h-screen bg-[#020617] p-4 text-slate-100 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <MISidebar active={active} setActive={setActive} />
        <main className="space-y-6">
          <MIDashboardHeader active={active} setActive={setActive} />

          {!onboarded && (
            <section className="rounded-[2rem] border border-cyan-300/10 bg-gradient-to-br from-cyan-950/25 via-slate-950 to-slate-950 p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div><h2 className="text-xl font-black text-white">Your first discovery workflow</h2><p className="mt-1 text-sm text-slate-400">Run one scan to unlock the full demo flow: target explanation, report preview, and project save.</p></div>
                <button onClick={runScan} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">Start guided scan</button>
              </div>
              <div className="grid gap-3 md:grid-cols-5">
                {miOnboardingSteps.map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-slate-300"><span className="mb-2 block text-xs font-black text-cyan-200">STEP {index + 1}</span>{step}</div>)}
              </div>
            </section>
          )}

          <section className="grid gap-4 md:grid-cols-4">
            {miKpis.map(([label, value, change]) => <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4"><div className="text-xs text-slate-500">{label}</div><div className="mt-2 text-3xl font-black text-white">{value}</div><div className="mt-1 text-xs font-bold text-cyan-200">{change}</div></div>)}
          </section>

          <header className="relative overflow-hidden rounded-[2.75rem] border border-cyan-300/10 bg-gradient-to-br from-slate-950 via-[#07111f] to-cyan-950/50 p-6 shadow-[0_0_140px_rgba(34,211,238,0.12)] md:p-8">
            <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
              <div>
                <div className="mb-5 flex flex-wrap gap-2">
                  <MIPill>Exploration Intelligence</MIPill>
                  <MIPill>AI target ranking</MIPill>
                  <MIPill>Reports + workspaces</MIPill>
                </div>
                <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-7xl">
                  Find the next opportunity hidden in the ground.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                  Matter Intelligence OS combines geological data, historical discoveries, signal agreement, and AI ranking to identify the most promising miTargets. Discover faster, explain decisions, and generate miReports.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Input</div>
                    <div className="font-black text-white">Geology + telemetry</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Maps, magnetics, gravity, satellite layers, drill logs, private datasets.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Engine</div>
                    <div className="font-black text-white">AI signal agreement</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">The system looks for places where independent signals point to the same opportunity.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Output</div>
                    <div className="font-black text-white">Ranked opportunities</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Clear target scores, explanations, miReports, timelines, and team actions.</p>
                  </div>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button onClick={runScan} className="rounded-[1.5rem] bg-cyan-300 px-8 py-5 text-lg font-black text-slate-950 shadow-2xl shadow-cyan-950/40 transition hover:scale-[1.02] hover:bg-cyan-200">
                    {scanning ? "ANALYZING..." : "RUN DISCOVERY SCAN"}
                  </button>
                  <button onClick={() => setActive("Targets")} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-8 py-5 text-lg font-black text-white transition hover:bg-white/[0.1]">
                    View opportunities
                  </button>
                </div>
              </div>

              <div className="rounded-[2rem] border border-cyan-300/10 bg-black/30 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-slate-500">What it actually does</div>
                    <div className="mt-1 text-2xl font-black text-white">Opportunity Command Center</div>
                  </div>
                  <div className="rounded-2xl bg-cyan-300 p-3 text-slate-950"><Radar size={24} /></div>
                </div>
                <div className="space-y-3">
                  {[
                    ["1", "Choose what you want to discover", "Diamonds, gold, lithium, copper, uranium, rare earths, groundwater, geothermal, or custom."],
                    ["2", "Connect or select data layers", "Public maps, survey files, satellite feeds, drilling history, and private exploration data."],
                    ["3", "AI ranks the strongest opportunities", "Targets rise when multiple signals agree and historical patterns look similar."],
                    ["4", "Generate a report", "Export a plain-English target explanation for teams, investors, or field review."],
                  ].map(([num, title, body]) => (
                    <div key={num} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{num}</div>
                        <div>
                          <div className="font-black text-cyan-100">{title}</div>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {active === "Home" && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-white">What would you like to discover?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Pick an opportunity type. MIOS changes the playbook, signal model, and target ranking language around that goal.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                {miModules.map((mod, index) => <MIModuleCard key={mod.name} mod={mod} selected={moduleIndex === index} onClick={() => setModuleIndex(index)} />)}
              </div>
            </section>
          )}

          {showMapArea && (
            <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <MIDiscoveryEarth scanning={scanning} selectedModule={selectedModule} />
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><Bot size={22} /> AI Assistant</h2>
                  <p className="mb-4 text-sm leading-6 text-slate-400">Ask plain-English questions about miTargets, signals, miReports, miProjects, and material profiles. This turns complex exploration data into usable answers.</p>
                  <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="mb-2 text-xs uppercase tracking-widest text-cyan-200/70">Plain-language answer</div><p className="text-sm leading-6 text-cyan-50">{aiLine}</p></div>
                  <div className="mt-4 grid gap-2">
                    {["Why is this target ranked highly?", "Generate investor report", "Show similar discoveries"].map((question) => <button key={question} className="rounded-xl bg-white/[0.04] px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/[0.08]">{question}</button>)}
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><Waves size={22} /> Signal Agreement</h2>
                  <p className="mb-4 text-sm leading-6 text-slate-400">A target becomes more useful when independent datasets point toward the same conclusion. This score shows how strongly the evidence layers agree.</p>
                  {miSignalLabels.map((label, index) => {
                    const value = miSignalValues[index];
                    return <div key={label} className="mb-3"><div className="mb-1 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${value}%` }} /></div></div>;
                  })}
                </div>
              </div>
            </section>
          )}

          {showTargetsArea && (
            <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><Target size={22} /> Ranked Targets</h2>
                <p className="mb-4 text-sm leading-6 text-slate-400">Targets are possible opportunities sorted by signal strength, historical similarity, geometry, and confidence. Start here when deciding what deserves attention.</p>
                <div className="space-y-3">{miTargets.map((target, index) => <MITargetCard key={target.id} target={target} active={targetIndex === index} onClick={() => setTargetIndex(index)} />)}</div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-black"><ClipboardList size={22} /> Why This Target?</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Instead of showing raw data alone, MIOS explains why a target deserves attention and converts the strongest evidence into plain language.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={toggleSaveTarget} className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/[0.1]">{savedTargets.includes(selectedTarget.id) ? "Saved" : "Save target"}</button>
                    <button className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200"><Share2 size={14} className="mr-1 inline" />Share</button>
                    <button onClick={() => setReportReady(true)} className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950"><Download size={14} className="mr-1 inline" />Generate report</button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-black/25 p-4"><div className="text-xs text-slate-500">Target</div><div className="text-2xl font-black text-cyan-100">{selectedTarget.id}</div></div>
                  <div className="rounded-2xl bg-black/25 p-4"><div className="text-xs text-slate-500">Discovery Score</div><div className="text-3xl font-black text-cyan-100">{selectedTarget.confidence}</div><div className="mt-1 text-[10px] font-bold text-cyan-200">Top ranked opportunity</div></div>
                  <div className="rounded-2xl bg-black/25 p-4"><div className="text-xs text-slate-500">Glyph</div><div className="font-mono text-2xl text-fuchsia-100">{selectedTarget.glyph}</div></div>
                  <div className="rounded-2xl bg-black/25 p-4"><div className="text-xs text-slate-500">Depth</div><div className="text-lg font-black text-cyan-100">{selectedTarget.depth}</div></div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {selectedTarget.reasons.map((reason) => <div key={reason} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300"><ShieldCheck size={16} className="mr-2 inline text-cyan-200" />{reason}</div>)}
                </div>
                <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-5">
                  <h3 className="mb-2 font-black text-cyan-100">Discovery DNA</h3>
                  <p className="mb-4 text-sm leading-6 text-slate-400">This breaks the opportunity into the evidence layers that make it interesting.</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {miSignalLabels.map((label, index) => {
                      const value = miSignalValues[index];
                      return <div key={label}><div className="mb-1 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{value}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${value}%` }} /></div></div>;
                    })}
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
                  <h3 className="mb-2 font-black text-cyan-100">Discovery Timeline</h3>
                  <p className="mb-4 text-sm leading-6 text-slate-400">Many discoveries begin as weak signals and become stronger as more information arrives. This miTimeline shows how confidence evolved.</p>
                  <div className="grid gap-3 md:grid-cols-5">
                    {miTimeline.map(([year, text]) => <div key={year} className="rounded-2xl bg-white/[0.035] p-3"><div className="text-sm font-black text-white">{year}</div><div className="mt-1 text-xs leading-5 text-slate-400">{text}</div></div>)}
                  </div>
                </div>
              </div>
            </section>
          )}

          {showProjectsArea && (
            <section className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 lg:col-span-2">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><BriefcaseBusiness size={22} /> Projects</h2>
                <p className="mb-4 text-sm leading-6 text-slate-400">Projects organize discoveries. Store miTargets, miReports, notes, comments, team activity, and decision history in one place.</p>
                <div className="grid gap-3 md:grid-cols-3">{miProjects.map((project) => <div key={project.name} className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="font-black text-white">{project.name}</div><div className="mt-2 text-sm text-slate-400">{project.miTargets} miTargets · {project.miReports} miReports · {project.members} members</div><div className="mt-3 text-xs font-bold text-cyan-200">{project.status}</div></div>)}</div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><LineChart size={22} /> Opportunity Feed</h2>
                <p className="mb-4 text-sm leading-6 text-slate-400">Opportunity changes as new information arrives. The feed highlights confidence increases, saved miTargets, generated miReports, and new signal matches.</p>
                <div className="space-y-3">{miDiscoveryFeed.slice(0, 3).map((item) => <MIFeedCard key={item.title} item={item} />)}</div>
              </div>
            </section>
          )}

          {showReportsArea && (
            <>
              {reportReady && (
                <section className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-slate-950 p-6 shadow-2xl shadow-cyan-950/20">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h2 className="text-2xl font-black text-white">Report Preview Ready</h2><p className="mt-2 text-sm text-slate-400">A subscriber-grade report has been generated for {selectedTarget.id}. This is the moment that makes the app feel useful.</p></div>
                    <div className="flex gap-2"><button className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-200">Preview</button><button className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">Export PDF</button></div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-black/30 p-4"><div className="text-xs text-slate-500">Target</div><div className="text-xl font-black text-cyan-100">{selectedTarget.id}</div></div>
                    <div className="rounded-2xl bg-black/30 p-4"><div className="text-xs text-slate-500">Discovery Score</div><div className="text-xl font-black text-cyan-100">{selectedTarget.confidence}</div></div>
                    <div className="rounded-2xl bg-black/30 p-4"><div className="text-xs text-slate-500">Main reason</div><div className="text-sm font-bold text-cyan-100">{selectedTarget.reasons[0]}</div></div>
                    <div className="rounded-2xl bg-black/30 p-4"><div className="text-xs text-slate-500">Recommended action</div><div className="text-sm font-bold text-cyan-100">Field review</div></div>
                    <div className="rounded-2xl bg-black/30 p-4 md:col-span-4"><div className="text-xs text-slate-500">Why this matters</div><div className="mt-1 text-sm leading-6 text-slate-300">This target ranks as a strong opportunity because multiple independent evidence layers agree. It deserves additional review before any field or drilling decision.</div></div>
                  </div>
                </section>
              )}

              <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><FileText size={22} /> Reports</h2>
                  <p className="mb-4 text-sm leading-6 text-slate-400">Reports transform complex analysis into a format suitable for management, investors, partners, and field teams.</p>
                  <div className="grid gap-3 md:grid-cols-2">{miReports.map((report) => <div key={report.name} className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="flex items-center justify-between"><div className="font-black text-white">{report.name}</div>{report.locked && <Lock size={16} className="text-slate-500" />}</div><div className="mt-2 text-sm text-slate-400">{report.type} · {report.pages} pages</div><button className="mt-4 rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-cyan-300 hover:text-slate-950">Generate</button></div>)}</div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
                  <h2 className="mb-2 flex items-center gap-2 text-xl font-black"><Compass size={22} /> Product Language</h2>
                  <p className="mb-4 text-sm leading-6 text-slate-400">These are the terms that make the product memorable, translated into simple exploration language.</p>
                  <div className="grid gap-3">{miDefinitions.map(([term, text]) => <div key={term} className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="font-black text-cyan-100">{term}</div><p className="mt-1 text-sm leading-6 text-slate-400">{text}</p></div>)}</div>
                </div>
              </section>
            </>
          )}

          {active === "Discovery Playbooks" && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-white">Discovery Playbooks</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Each playbook explains what conditions MIOS is searching for, why those clues matter, and what makes a target worth reviewing.</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {miMaterialGuides.map((guide) => (
                  <div key={guide.name} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                    <div className="mb-2 text-xl font-black text-cyan-100">{guide.name}</div>
                    <p className="mb-4 text-sm leading-6 text-slate-400">{guide.purpose}</p>
                    <div className="space-y-2">
                      {guide.clues.map((clue) => <div key={clue} className="rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-slate-300"><ShieldCheck size={14} className="mr-2 inline text-cyan-200" />{clue}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === "Home" && (
            <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-[2rem] border border-cyan-300/10 bg-cyan-300/5 p-6">
                <h2 className="text-2xl font-black text-white">Why subscribers use MIOS</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">Subscribers stay because the platform keeps turning complex data into clear next actions.</p>
                <div className="mt-5 grid gap-3">
                  {miSubscriberReasons.map((reason) => <div key={reason} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300"><ShieldCheck size={16} className="mr-2 inline text-cyan-200" />{reason}</div>)}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
                <h2 className="text-2xl font-black text-white">How MIOS thinks</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">The platform follows a simple chain: data comes in, signals are compared, opportunities are ranked, and decisions become clearer.</p>
                <div className="mt-5 grid gap-3">
                  {miThinkingFlow.map(([stage, text], index) => (
                    <div key={stage} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</div>
                        <div>
                          <div className="font-black text-cyan-100">{stage}</div>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {showUpgrade && (
            <section className="rounded-[2rem] border border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-950/20 via-slate-950 to-cyan-950/20 p-6">
              <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
                <div>
                  <h2 className="text-3xl font-black text-white">Unlock the full collaborative OS</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">Marketplace publishing, advanced team roles, private model sharing, and enterprise dataset controls are premium features.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm text-slate-400">Recommended</div>
                  <div className="mt-1 text-2xl font-black text-cyan-100">Enterprise Discovery Cloud</div>
                  <button onClick={() => setActive("Settings")} className="mt-4 w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950">View upgrade options</button>
                </div>
              </div>
            </section>
          )}

          {showPlansArea && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-5"><h2 className="text-2xl font-black text-white">Choose a plan</h2><p className="mt-2 text-sm leading-6 text-slate-400">Built for solo explorers, Pro teams, and enterprise discovery programs.</p></div>
              <div className="grid gap-4 md:grid-cols-3">{miPlans.map((plan) => <MIPlanCard key={plan.name} plan={plan} />)}</div>
            </section>
          )}

          <footer className="pb-6 text-center text-xs text-slate-500">Matter Intelligence OS V6 is a React prototype for a subscription exploration-intelligence platform. Real deployment requires verified data, model validation, domain experts, and appropriate licensing.</footer>
        </main>
      </div>
    </div>
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
  graph: "Similarity Graph",
  universe: "Material Universe",
  scenario: "Scenario Builder",
  visualization: "Visual Engine",
  calculations: "Calculation Studio",
  timemachine: "Time Machine",
  seismo: "Seismo Lab",
  welldriller: "Well Driller Lab",
  isotopes: "Isotope Lab",
  matterlab: "Matter Intelligence OS",
  simreports: "Simulation Dossiers",
  viralcards: "Share Card Studio",
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
function Panel({ children, className = "" }) {
  return (
    <div className={`eos-panel relative overflow-hidden rounded-[1.15rem] border border-[#123257] bg-[#06101d]/88 p-5 shadow-[0_0_0_1px_rgba(35,120,255,.06),0_18px_80px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.05)] backdrop-blur-2xl ${className}`}>
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

  return (
    <button
      onClick={onClick}
      className={`eos-button rounded-xl px-4 py-3 font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,145,255,.22)] active:translate-y-0 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
function Info({ title, children }) { return <div className="mt-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm text-cyan-50"><div className="mb-1 text-xs font-black uppercase tracking-[.22em] text-cyan-200">{title}</div><div className="leading-6 text-slate-200">{children}</div></div>; }
function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#02060d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_3%,rgba(0,116,255,.22),transparent_28%),radial-gradient(circle_at_80%_9%,rgba(98,0,255,.15),transparent_31%),radial-gradient(circle_at_52%_90%,rgba(0,212,255,.10),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[.34] bg-[linear-gradient(rgba(0,170,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,170,255,.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,13,.18)_45%,rgba(2,6,13,.92)_100%)]" />
      <div className="absolute left-[18%] top-[-18rem] h-[42rem] w-[42rem] rounded-full bg-cyan-500/12 blur-3xl" />
      <div className="absolute right-[-8rem] top-[14%] h-[32rem] w-[32rem] rounded-full bg-blue-700/16 blur-3xl" />
      <div className="eos-scanline absolute inset-0" />
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
      @keyframes eosSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes eosSpinReverse { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(-360deg); } }
      @keyframes eosPulse { 0%,100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.06); } }
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
        ["graph", "Similarity Graph", Network],
        ["universe", "Material Universe", Orbit],
      ],
    },
    {
      id: "simulations",
      label: "Simulations",
      icon: BarChart3,
      items: [
        ["scenario", "Scenario Builder", FileText],
        ["visualization", "Visual Engine", BarChart3],
        ["calculations", "Calculation Studio", Calculator],
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
        ["viralcards", "Share Card Studio", Sparkles],
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
  return <><Panel className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><div><Pill gold><Sparkles size={12}/> production preview</Pill><h1 className="mt-4 text-5xl font-black sm:text-7xl">ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Material Intelligence Platform</span></h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Explore, compare and publish material behaviour. ElementOS now feels like a subscriber-ready research workspace: accounts, live simulation, visual comparison, graph intelligence and exportable reports.</p><Info title="Positioning upgrade">Public language has been cleaned up. The product now leads with material intelligence, simulation, research reports and workspace value instead of internal prototype wording.</Info></div><Panel><h2 className="text-2xl font-black">Start Here</h2>{[["Run First Simulation", "scenario", FileText], ["Matter Intelligence OS", "matterlab", Globe2], ["AI Copilot", "copilot", Sparkles], ["Mission Control", "mission", CheckCircle2], ["Discovery Feed", "discover", Sparkles], ["Compare Materials", "compare", BarChart3], ["Isotope Lab", "isotopes", Atom], ["Time Machine", "timemachine", Clock3], ["Well Driller Lab", "welldriller", Radar], ["Seismo Lab", "seismo", Network], ["Simulation Dossiers", "simreports", BookOpen], ["Share Card Studio", "viralcards", Sparkles], ["Calculation Studio", "calculations", Calculator], ["Workspace", "lab", Save], ["Visual Engine", "visualization", BarChart3], ["Behaviour Atlas", "atlas", Radar], ["Founding Beta", "beta", UserPlus], ["Research Reports", "reports", FileText]].map(([label, id, Icon], i) => <Button key={id} onClick={() => setPage(id)} className="mt-3 w-full" variant={i === 1 ? "primary" : "ghost"}><Icon className="inline" size={16}/> {label}</Button>)}{session && <div className="mt-4 grid gap-3"><Button onClick={saveWorkspace} variant="primary" className="w-full"><Save size={16} className="inline"/> Save Workspace</Button><Button onClick={loadWorkspace} className="w-full">Restore Workspace</Button></div>}{!session && <Button onClick={() => setPage("beta")} variant="primary" className="mt-4 w-full"><UserPlus size={16} className="inline"/> Join Founding Beta</Button>}{session && !isPro && <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-100">Billing</div><Button onClick={startCheckout} variant="primary" className="w-full"><Sparkles size={16} className="inline"/> Upgrade to Pro Lab</Button><p className="mt-3 text-xs leading-5 text-amber-100/80">Unlock premium PDF exports and Pro workspace features through Stripe Sandbox.</p></div>}{session && isPro && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab Active</div>}</Panel></Panel><div className="grid gap-6 xl:grid-cols-4">{[["118", "elements"], ["7", "behaviour metrics"], ["4", "export modes"], ["Live", "simulation layer"]].map(([a,b]) => <Panel key={b}><div className="text-4xl font-black text-cyan-100">{a}</div><div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{b}</div></Panel>)}</div>
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


function DiscoveryOSFeed({ discoveries = [], setPage }) {
  const ranked = discoveries.length ? discoveries : adaptiveDiscoveryRank(generateDiscoveryEngine(12));
  const spotlight = dailyDiscovery(ranked) || ranked[0];
  const publishable = ranked.slice(0, 9).map((d, index) => ({
    ...d,
    publicId: `${d.a}-${d.b}-${d.dna?.split("-").pop() || "OS"}-${1047 + index}`.toUpperCase(),
  }));

  const copyText = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      return;
    }
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  };

  const saveDiscovery = (discovery) => {
    try {
      const existing = JSON.parse(localStorage.getItem("elementos_saved_discoveries") || "[]");
      const next = [
        {
          id: discovery.publicId,
          pair: `${discovery.a} + ${discovery.b}`,
          score: discovery.score,
          confidence: discovery.aiConfidence,
          reason: discovery.reason,
          createdAt: new Date().toISOString(),
        },
        ...existing.filter((item) => item.id !== discovery.publicId),
      ].slice(0, 50);
      localStorage.setItem("elementos_saved_discoveries", JSON.stringify(next));
    } catch (error) {
      console.error("Unable to save discovery", error);
    }
  };

  const discoveryUrl = (discovery) => `${window.location.origin}${window.location.pathname}?discovery=${discovery.publicId}`;

  return (
    <>
      <Panel className="border-amber-300/20 bg-gradient-to-br from-amber-300/10 via-[#06101d]/95 to-cyan-400/10">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr] xl:items-center">
          <div>
            <Pill gold><Sparkles size={12}/> discovery OS</Pill>
            <h2 className="mt-3 text-5xl font-black sm:text-6xl">
              Turn every simulation into a <span className="bg-gradient-to-r from-amber-100 via-white to-cyan-200 bg-clip-text text-transparent">publishable discovery.</span>
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              The new Discovery Feed connects ElementOS together: compare materials, generate a discovery, save it to the workspace, create a report and share a public research link.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                ["1", "Run"],
                ["2", "Discover"],
                ["3", "Report"],
                ["4", "Share"],
              ].map(([num, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-2xl font-black text-cyan-100">{num}</div>
                  <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-black/35 p-6">
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">Today's discovery</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{spotlight?.a} + {spotlight?.b}</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{spotlight?.reason}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-cyan-300/10 p-3"><div className="text-2xl font-black text-cyan-100">{spotlight?.score}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">score</div></div>
              <div className="rounded-2xl border border-white/10 bg-emerald-300/10 p-3"><div className="text-2xl font-black text-emerald-200">{spotlight?.aiConfidence}%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI</div></div>
              <div className="rounded-2xl border border-white/10 bg-amber-300/10 p-3"><div className="text-2xl font-black text-amber-100">{spotlight?.momentum}</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">momentum</div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => setPage("compare")} variant="primary">Run Simulation</Button>
              <Button onClick={() => setPage("reports")}>Generate Report</Button>
              <Button onClick={() => copyText(`ElementOS Discovery: ${spotlight?.a} + ${spotlight?.b} — ${spotlight?.score}% score. ${spotlight?.reason}`)}>Copy Share Text</Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill><Network size={12}/> public discovery feed</Pill>
            <h2 className="mt-3 text-4xl font-black">Latest Publishable Results</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Each card now behaves like a research asset: it has an ID, a share link, a report path, a workspace save action and a clear next step.
            </p>
          </div>
          <Button onClick={() => setPage("viralcards")} variant="primary">Create Share Card</Button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {publishable.map((discovery, index) => (
            <div key={discovery.publicId} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-black/30 to-slate-950 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">{discovery.publicId}</div>
                  <div className="mt-2 text-3xl font-black text-white">{discovery.a} + {discovery.b}</div>
                  <div className="mt-1 text-sm text-cyan-100">{discovery.type}</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xl font-black text-emerald-100">{discovery.score}%</div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{discovery.reason}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-black/25 p-3"><b className="text-cyan-100">{discovery.aiConfidence}%</b><br/><span className="text-[10px] uppercase tracking-[.16em] text-slate-500">AI</span></div>
                <div className="rounded-xl bg-black/25 p-3"><b className="text-emerald-200">+{discovery.velocity}%</b><br/><span className="text-[10px] uppercase tracking-[.16em] text-slate-500">velocity</span></div>
                <div className="rounded-xl bg-black/25 p-3"><b className="text-amber-100">{discovery.shares}</b><br/><span className="text-[10px] uppercase tracking-[.16em] text-slate-500">shares</span></div>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Button onClick={() => { saveDiscovery(discovery); setPage("lab"); }}>Save to Workspace</Button>
                <Button onClick={() => copyText(discoveryUrl(discovery))}>Copy Public URL</Button>
                <Button onClick={() => setPage("reports")}>Open Report</Button>
                <Button onClick={() => setPage(index % 2 ? "timemachine" : "scenario")} variant="primary">Next Step</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><CheckCircle2 size={12}/> guided next step</Pill>
            <h2 className="mt-3 text-3xl font-black">What should the user do next?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              ElementOS now gives a simple path instead of leaving users stranded: simulate, forecast, report, share, save.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            ["Compare Materials", "Find a strong pair", "compare"],
            ["Time Machine", "Forecast long-term behavior", "timemachine"],
            ["Simulation Dossier", "Package the result", "simreports"],
            ["Share Card Studio", "Make it viral", "viralcards"],
            ["Workspace", "Save the asset", "lab"],
          ].map(([title, desc, target]) => (
            <button key={title} onClick={() => setPage(target)} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan-300/30 hover:bg-cyan-300/10">
              <div className="text-sm font-black text-cyan-100">{title}</div>
              <div className="mt-2 text-xs leading-5 text-slate-400">{desc}</div>
            </button>
          ))}
        </div>
      </Panel>
    </>
  );
}

function Discover({ setPage }) {
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
      <RealTimeNetworkPanel discoveries={discoveries} setPage={setPage} />
      <DiscoveryOSFeed discoveries={discoveries} setPage={setPage} />

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
              <Button onClick={() => navigator.clipboard.writeText(`I discovered ${today?.a} + ${today?.b} on ElementOS before 98% of researchers.`)}>Copy Share Card</Button>
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
                  <Button onClick={() => navigator.clipboard.writeText(`${generateDiscoveryHeadline(d)} — AI confidence ${d.aiConfidence}% — velocity +${d.velocity}%`)}>Copy</Button>
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
  const [scenarioText, setScenarioText] = useState("Your first guided simulation for 25 years under high pressure");
  const [material, setMaterial] = useState(selected || "Ti");
  const [environment, setEnvironment] = useState("Saltwater / coastal");
  const [duration, setDuration] = useState(25);
  const [intensity, setIntensity] = useState(62);

  const normalized = scenarioText.toLowerCase();

  const detectedMaterial = useMemo(() => {
    const found = elements.find((e) =>
      normalized.includes(e.name.toLowerCase()) ||
      normalized.includes(e.symbol.toLowerCase())
    );
    return found?.symbol || material;
  }, [scenarioText, material]);

  const activeMaterial = elementMap[detectedMaterial] || elementMap[material] || elementMap.Ti;
  const activeScore = score(activeMaterial.symbol);

  const inferredEnvironment = useMemo(() => {
    if (normalized.includes("salt") || normalized.includes("ocean") || normalized.includes("sea") || normalized.includes("coastal")) return "Saltwater / coastal";
    if (normalized.includes("heat") || normalized.includes("hot") || normalized.includes("industrial")) return "Industrial heat";
    if (normalized.includes("space") || normalized.includes("vacuum")) return "Space / vacuum";
    if (normalized.includes("pressure") || normalized.includes("deep") || normalized.includes("compression")) return "High pressure";
    if (normalized.includes("cold") || normalized.includes("cryo")) return "Cryogenic";
    if (normalized.includes("lab") || normalized.includes("storage")) return "Lab storage";
    return environment;
  }, [scenarioText, environment, normalized]);

  const inferredYears = useMemo(() => {
    const match = normalized.match(/(\d+)\s*(year|years|yr|yrs)/);
    if (match) return Math.max(1, Math.min(500, Number(match[1])));
    return duration;
  }, [normalized, duration]);

  const environmentRisk = {
    "Lab storage": 0.55,
    "Saltwater / coastal": 1.45,
    "Industrial heat": 1.35,
    "High pressure": 1.25,
    "Space / vacuum": 1.05,
    "Cryogenic": 0.85,
  }[inferredEnvironment] || 1;

  const stressWords = ["extreme", "high", "pressure", "heat", "stress", "corrosion", "salt", "industrial", "deep", "load"];
  const wordStress = stressWords.reduce((sum, word) => sum + (normalized.includes(word) ? 5 : 0), 0);
  const scenarioIntensity = Math.max(10, Math.min(100, intensity + wordStress));

  const durabilitySignal = activeScore.stability * 15 + activeScore.pressure * 8 + activeScore.thermal * 7 + activeScore.conductivity * 3;
  const exposureLoad = environmentRisk * 14 + Math.log10(inferredYears + 1) * 19 + scenarioIntensity * 0.42;
  const riskScore = Math.max(4, Math.min(96, Math.round(exposureLoad - durabilitySignal * 0.18 + 42)));
  const survivalYears = Math.max(2, Math.round((durabilitySignal / Math.max(1, environmentRisk * scenarioIntensity)) * 22));
  const failureProbability = Math.max(1, Math.min(99, Math.round(riskScore * 0.72 + inferredYears * environmentRisk * 0.22)));
  const confidence = Math.max(72, Math.min(98, Math.round(100 - Math.abs(50 - scenarioIntensity) * 0.28 - environmentRisk * 3 + activeScore.stability * 1.8)));
  const remainingIntegrity = Math.max(3, Math.min(99, Math.round(100 - failureProbability * 0.62)));

  const failureMode =
    inferredEnvironment.includes("Saltwater") ? "corrosion and surface pitting" :
    inferredEnvironment.includes("heat") ? "thermal fatigue and conductivity drift" :
    inferredEnvironment.includes("pressure") ? "compression fatigue and pressure drift" :
    inferredEnvironment.includes("Space") ? "radiation exposure and thermal cycling" :
    inferredEnvironment.includes("Cryogenic") ? "cold brittleness and contraction stress" :
    "slow environmental ageing";

  const substitutes = elements
    .filter((e) => e.symbol !== activeMaterial.symbol)
    .map((e) => {
      const s = score(e.symbol);
      const fit = Math.round(s.stability * 12 + s.pressure * 8 + s.thermal * 6 - environmentRisk * 5 - Math.abs(s.rarity - activeScore.rarity) * 2);
      return { ...e, fit: Math.max(1, Math.min(99, fit)) };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 4);

  const timeline = [0, Math.max(1, Math.round(inferredYears * 0.25)), Math.max(1, Math.round(inferredYears * 0.5)), inferredYears].map((year) => {
    const ageing = Math.log10(year + 1) * environmentRisk * 17 + scenarioIntensity * 0.12;
    return {
      year,
      integrity: Math.max(3, Math.round(100 - ageing - riskScore * 0.18)),
      risk: Math.min(99, Math.round(riskScore * (0.35 + year / Math.max(1, inferredYears) * 0.65))),
    };
  });

  const verdict = riskScore >= 72 ? "High-risk scenario" : riskScore >= 45 ? "Manageable with protection" : "Strong scenario candidate";

  const exportScenario = () => {
    const content = `ElementOS Scenario Builder Report\n\nScenario: ${scenarioText}\nMaterial: ${activeMaterial.name} (${activeMaterial.symbol})\nEnvironment: ${inferredEnvironment}\nDuration: ${inferredYears} years\nRisk score: ${riskScore}%\nFailure probability: ${failureProbability}%\nEstimated survival: ${survivalYears} years\nRemaining integrity: ${remainingIntegrity}%\nAI confidence: ${confidence}%\nLikely failure mode: ${failureMode}\nRecommended substitute: ${substitutes[0]?.name} (${substitutes[0]?.symbol})\n\nVerdict: ${verdict}\n\nTimeline:\n${timeline.map((t) => `Year ${t.year}: integrity ${t.integrity}%, risk ${t.risk}%`).join("\n")}\n\nGenerated by ElementOS Scenario Builder`;
    downloadFile(`${activeMaterial.symbol}-scenario-builder-report.txt`, content);
  };

  const runDetected = () => {
    setMaterial(detectedMaterial);
    setEnvironment(inferredEnvironment);
    setDuration(inferredYears);
    setSelected?.(detectedMaterial);
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <Pill gold><FileText size={12}/> AI scenario engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Scenario <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Builder</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Type a real-world material situation and ElementOS converts it into risk, lifespan, failure probability, timeline drift and substitute recommendations.
          </p>
          <Info title="Plain-English simulation">
            This page is designed for users who do not know where to start. They describe a situation, then ElementOS turns it into a structured material decision report.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Scenario result</div>
          <h2 className="mt-3 text-4xl font-black text-cyan-100">{activeMaterial.symbol} · {verdict}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-rose-100">Risk score</div>
              <div className="mt-2 text-4xl font-black text-rose-100">{riskScore}%</div>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="text-xs uppercase tracking-[.2em] text-emerald-100">Survival estimate</div>
              <div className="mt-2 text-4xl font-black text-emerald-100">{survivalYears}y</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">Likely failure mode: <b>{failureMode}</b>. AI confidence: <b>{confidence}%</b>.</p>
          <Button onClick={exportScenario} variant="primary" className="mt-5 w-full">Export Scenario Report</Button>
        </Panel>
      </Panel>

      <GuidePanel page="scenario" />

      <Panel>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <div>
            <h2 className="text-3xl font-black">Describe your material scenario</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Example: “Aluminium bracket in coastal air for 10 years” or “Copper wire under industrial heat for 25 years”.</p>
            <textarea
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              className="mt-5 min-h-[150px] w-full rounded-[2rem] border border-white/10 bg-black/30 p-5 text-lg leading-8 outline-none focus:border-cyan-300/40"
              placeholder="Describe the material, environment and timescale..."
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={runDetected} variant="primary"><Sparkles size={16} className="inline"/> Run Scenario</Button>
              <Button onClick={() => setPage("timemachine")}><Clock3 size={16} className="inline"/> Open Time Machine</Button>
              <Button onClick={() => navigator.clipboard.writeText(`ElementOS Scenario: ${scenarioText} · Risk ${riskScore}% · Survival ${survivalYears} years`)}>Copy Summary</Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/10 p-5">
            <div className="text-xs uppercase tracking-[.22em] text-cyan-200">Detected inputs</div>
            <div className="mt-4 space-y-3">
              {[
                ["Material", `${activeMaterial.name} (${activeMaterial.symbol})`],
                ["Environment", inferredEnvironment],
                ["Duration", `${inferredYears} years`],
                ["Intensity", `${scenarioIntensity}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">{label}</div>
                  <div className="mt-1 text-xl font-black text-cyan-100">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-4">
        {[
          ["Failure probability", `${failureProbability}%`, "Likelihood of unacceptable degradation within the scenario window."],
          ["Remaining integrity", `${remainingIntegrity}%`, "Estimated usable material integrity at the end of the scenario."],
          ["AI confidence", `${confidence}%`, "Confidence in the scenario classification based on available simulated signals."],
          ["Best substitute", substitutes[0] ? `${substitutes[0].symbol}` : "—", substitutes[0] ? `${substitutes[0].name} has the strongest replacement fit.` : "No substitute found."],
        ].map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-4xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><Clock3 size={12}/> scenario timeline</Pill>
            <h2 className="mt-3 text-4xl font-black">Future-State Projection</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">A simple timeline showing how risk rises and integrity falls across the scenario period.</p>
          </div>
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100">{verdict}</div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {timeline.map((t) => (
            <div key={t.year} className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">Year {t.year}</div>
              <div className="mt-3 text-4xl font-black text-emerald-200">{t.integrity}%</div>
              <div className="mt-1 text-sm text-slate-400">integrity remaining</div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/40">
                <div className="h-full rounded-full bg-cyan-300" style={{ width: `${t.integrity}%` }} />
              </div>
              <div className="mt-3 text-sm text-rose-100">Risk: {t.risk}%</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <Panel>
          <Pill gold><Sparkles size={12}/> substitute engine</Pill>
          <h2 className="mt-3 text-3xl font-black">Recommended Substitutes</h2>
          <div className="mt-5 space-y-3">
            {substitutes.map((s) => (
              <div key={s.symbol} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div>
                  <div className="text-xl font-black text-cyan-100">{s.symbol} · {s.name}</div>
                  <div className="mt-1 text-sm text-slate-400">replacement fit for {inferredEnvironment}</div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xl font-black text-emerald-100">{s.fit}%</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Pill><FileText size={12}/> AI recommendation</Pill>
          <h2 className="mt-3 text-3xl font-black">Scenario Decision Summary</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {activeMaterial.name} in <b>{inferredEnvironment}</b> for <b>{inferredYears} years</b> is classified as <b>{verdict}</b>. The main concern is <b>{failureMode}</b>. ElementOS recommends evaluating <b>{substitutes[0]?.name}</b> as the first substitute candidate and sending this scenario into the Time Machine for a longer future-state view.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => setPage("timemachine")} variant="primary">Open Time Machine</Button>
            <Button onClick={exportScenario}>Export Report</Button>
          </div>
        </Panel>
      </div>
    </>
  );
}


function TimeMachine({ selected, setSelected, setPage }) {
  const [material, setMaterial] = useState(selected || "Al");
  const [environment, setEnvironment] = useState("Coastal air");
  const [stress, setStress] = useState(55);
  const [temperature, setTemperature] = useState(35);
  const [pressure, setPressure] = useState(40);
  const [humidity, setHumidity] = useState(62);
  const [radiation, setRadiation] = useState(18);

  const base = elementMap[material] || elementMap.Al;
  const baseScore = score(material);

  const environmentProfiles = {
    "Lab storage": { corrosion: 0.45, heat: 0.45, pressure: 0.35, radiation: 0.15, label: "controlled low-risk environment" },
    "Coastal air": { corrosion: 1.35, heat: 0.75, pressure: 0.6, radiation: 0.22, label: "salt, humidity and surface oxidation exposure" },
    "Industrial heat": { corrosion: 0.9, heat: 1.65, pressure: 0.95, radiation: 0.28, label: "thermal cycling, hot surfaces and fatigue" },
    "High pressure": { corrosion: 0.7, heat: 0.85, pressure: 1.75, radiation: 0.2, label: "compression, cyclic loading and stress concentration" },
    "Cryogenic": { corrosion: 0.45, heat: 0.35, pressure: 0.9, radiation: 0.18, label: "cold contraction and brittleness challenge" },
    "Space exposure": { corrosion: 0.25, heat: 1.25, pressure: 0.35, radiation: 1.45, label: "radiation, thermal swing and vacuum-like exposure" },
  };

  const profile = environmentProfiles[environment] || environmentProfiles["Coastal air"];
  const horizons = [0, 1, 5, 10, 25, 50, 100];

  const resilience = Math.round(
    Math.min(
      99,
      Math.max(
        12,
        baseScore.stability * 15 +
          baseScore.pressure * 7 +
          baseScore.thermal * 6 +
          baseScore.conductivity * 2 -
          profile.corrosion * 8 -
          stress * 0.075 -
          temperature * 0.055 -
          pressure * 0.055 -
          humidity * profile.corrosion * 0.055 -
          radiation * profile.radiation * 0.08
      )
    )
  );

  const timeline = horizons.map((year) => {
    const ageing = Math.log10(year + 1) * (profile.corrosion * 11 + profile.heat * 8 + profile.pressure * 7 + profile.radiation * 6);
    const load = stress * 0.04 + temperature * 0.045 + pressure * 0.04 + humidity * profile.corrosion * 0.035 + radiation * profile.radiation * 0.05;
    const stability = Math.max(2, Math.round(resilience - ageing - load));
    const corrosion = Math.min(99, Math.round(year * profile.corrosion * 0.52 + humidity * profile.corrosion * 0.23));
    const fatigue = Math.min(99, Math.round(year * profile.heat * 0.43 + temperature * 0.24 + stress * 0.08));
    const pressureDrift = Math.min(99, Math.round(year * profile.pressure * 0.39 + pressure * 0.2));
    const radiationDrift = Math.min(99, Math.round(year * profile.radiation * 0.35 + radiation * 0.26));
    return { year, stability, corrosion, fatigue, pressureDrift, radiationDrift };
  });

  const finalState = timeline[timeline.length - 1];
  const survivalYear = Math.max(2, Math.round((resilience / Math.max(0.5, profile.corrosion + profile.heat + profile.pressure + profile.radiation)) * 6.8));
  const futureVerdict = finalState.stability >= 72 ? "Excellent long-horizon candidate" : finalState.stability >= 48 ? "Strong candidate with protection" : finalState.stability >= 28 ? "Conditional candidate with monitoring" : "High-risk across long horizons";
  const timeRisk = Math.max(1, Math.min(99, Math.round(100 - finalState.stability + finalState.corrosion * 0.22 + finalState.fatigue * 0.18)));

  const recommended = elements
    .filter((e) => e.symbol !== material)
    .map((e) => {
      const s = score(e.symbol);
      const durability = Math.round(s.stability * 13 + s.pressure * 7 + s.thermal * 6 - profile.corrosion * 5 - profile.radiation * 3);
      return { ...e, durability: Math.max(1, Math.min(99, durability)) };
    })
    .sort((a, b) => b.durability - a.durability)
    .slice(0, 5);

  const chartPoints = timeline
    .map((t, index) => {
      const x = 8 + (index / Math.max(1, timeline.length - 1)) * 84;
      const y = 92 - t.stability * 0.78;
      return `${x},${Math.max(12, Math.min(92, y))}`;
    })
    .join(" ");

  const exportTimeline = () => {
    const content = `ElementOS Time Machine Report\n\nMaterial: ${base.name} (${base.symbol})\nEnvironment: ${environment}\nScenario: ${profile.label}\nResilience Index: ${resilience}%\n100-Year Risk: ${timeRisk}%\nPredicted survival horizon: ${survivalYear} years\nVerdict: ${futureVerdict}\n\nInputs:\nStress: ${stress}%\nTemperature: ${temperature} C\nPressure: ${pressure}%\nHumidity: ${humidity}%\nRadiation: ${radiation}%\n\nTimeline:\n${timeline.map((t) => `Year ${t.year}: stability ${t.stability}%, corrosion ${t.corrosion}%, fatigue ${t.fatigue}%, pressure drift ${t.pressureDrift}%, radiation drift ${t.radiationDrift}%`).join("\n")}\n\nGenerated by ElementOS Time Machine`;
    downloadFile(`${base.symbol}-time-machine-report.txt`, content);
  };

  const setMaterialAndSelected = (value) => {
    setMaterial(value);
    setSelected?.(value);
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><Clock3 size={12}/> temporal material simulator</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Time <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Machine</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Project how a material evolves across corrosion, fatigue, pressure drift, radiation exposure and environmental ageing. This page now behaves like a cinematic future-state lab.
          </p>
          <Info title="Temporal intelligence upgrade">
            Choose a material and environment, tune the exposure controls, then inspect the survival curve, future-state cards, 3D time tunnel and recommended long-horizon substitutes.
          </Info>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={exportTimeline} variant="primary"><Download size={16} className="inline"/> Export Time Report</Button>
            <Button onClick={() => setPage("scenario")}>Send to Scenario Builder</Button>
            <Button onClick={() => setPage("visualization")}>Open Visual Engine</Button>
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Future-state verdict</div>
          <div className="mt-3 text-5xl font-black text-cyan-100">{base.symbol}</div>
          <div className="mt-2 text-xl font-black text-white">{base.name}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="text-3xl font-black text-emerald-100">{resilience}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">resilience</div>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="text-3xl font-black text-amber-100">{survivalYear}y</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">survival</div>
            </div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
              <div className="text-3xl font-black text-rose-100">{timeRisk}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">100y risk</div>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-300">{futureVerdict}. Environment profile: {profile.label}.</p>
        </Panel>
      </Panel>

      <GuidePanel page="timemachine" />

      <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <h2 className="text-3xl font-black">Temporal Controls</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[.2em] text-slate-500">Material</span>
              <select value={material} onChange={(e) => setMaterialAndSelected(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">
                {elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[.2em] text-slate-500">Environment</span>
              <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">
                {Object.keys(environmentProfiles).map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>
            {[
              ["Stress Load", stress, setStress, "%"],
              ["Temperature", temperature, setTemperature, "°C"],
              ["Pressure Load", pressure, setPressure, "%"],
              ["Humidity / Corrosion Feed", humidity, setHumidity, "%"],
              ["Radiation / Field Exposure", radiation, setRadiation, "%"],
            ].map(([label, value, setter, unit]) => (
              <label key={label} className="grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">{label}</span>
                  <span className="font-black text-cyan-100">{value}{unit}</span>
                </div>
                <input type="range" min="0" max="100" value={value} onChange={(e) => setter(Number(e.target.value))} />
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Pill><Radar size={12}/> 3D time tunnel</Pill>
              <h2 className="mt-3 text-3xl font-black">Future-State Simulation</h2>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">LIVE</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-950/80 p-6 [perspective:1100px]">
            <div className="relative mx-auto h-[360px] max-w-3xl [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-32deg)]">
              {timeline.map((t, index) => (
                <div
                  key={t.year}
                  className="absolute left-1/2 top-1/2 grid place-items-center rounded-[2rem] border border-cyan-300/25 bg-cyan-300/10 text-center shadow-[0_0_40px_rgba(34,211,238,.14)]"
                  style={{
                    width: `${300 + index * 28}px`,
                    height: `${72 + index * 8}px`,
                    transform: `translate(-50%, -50%) translateZ(${index * 28}px)`,
                    opacity: 1 - index * 0.075,
                  }}
                >
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-100">Year {t.year}</div>
                  <div className="text-2xl font-black text-white">{t.stability}%</div>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_80px_rgba(251,191,36,.85)]" />
            </div>
          </div>

          <svg viewBox="0 0 100 100" className="mt-6 h-64 w-full rounded-[2rem] border border-white/10 bg-black/25 p-4">
            <polyline points={chartPoints} fill="none" stroke="rgba(34,211,238,.95)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={timeline.map((t, i) => `${8 + (i / Math.max(1, timeline.length - 1)) * 84},${92 - t.corrosion * .65}`).join(" ")} fill="none" stroke="rgba(251,191,36,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {[20,40,60,80].map((y) => <line key={y} x1="6" x2="94" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />)}
            {timeline.map((t, i) => <text key={t.year} x={8 + (i / Math.max(1, timeline.length - 1)) * 84} y="98" textAnchor="middle" className="fill-slate-400 text-[3px]">{t.year}</text>)}
          </svg>
        </Panel>
      </div>

      <Panel>
        <h2 className="text-4xl font-black">Temporal Milestone Cards</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {timeline.slice(1).map((t) => (
            <div key={t.year} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-black/35 to-amber-400/10 p-5">
              <div className="text-xs uppercase tracking-[.22em] text-slate-500">year {t.year}</div>
              <div className="mt-3 text-4xl font-black text-cyan-100">{t.stability}%</div>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <div>Corrosion: <b className="text-amber-100">{t.corrosion}%</b></div>
                <div>Fatigue: <b className="text-rose-100">{t.fatigue}%</b></div>
                <div>Pressure drift: <b className="text-cyan-100">{t.pressureDrift}%</b></div>
                <div>Radiation drift: <b className="text-fuchsia-100">{t.radiationDrift}%</b></div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <h2 className="text-3xl font-black">Best Long-Horizon Substitutes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {recommended.map((e) => (
            <button key={e.symbol} onClick={() => setMaterialAndSelected(e.symbol)} className="rounded-[2rem] border border-cyan-300/15 bg-cyan-300/10 p-5 text-left transition hover:scale-[1.02]">
              <div className="text-4xl font-black text-cyan-100">{e.symbol}</div>
              <div className="mt-1 text-sm text-slate-300">{e.name}</div>
              <div className="mt-4 text-2xl font-black text-emerald-200">{e.durability}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">future fit</div>
            </button>
          ))}
        </div>
      </Panel>
    </>
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
  const [layer, setLayer] = useState("conductivity"); const [cat, setCat] = useState("All");
  return <><Panel><Pill gold><Layers size={12}/> full element map</Pill><h1 className="mt-4 text-5xl font-black">Periodic Table</h1><Info title="Heat layers">Switch between behaviour metrics to reveal material response patterns across all 118 elements.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(l => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{l === "alignment" ? "Alignment" : l}</Button>)}<select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select></div></Panel><GuidePanel page="periodic" /><Panel className="overflow-auto"><div className="grid min-w-[1050px] gap-2">{periodicRows.map((row, ri) => <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: "repeat(18,minmax(0,1fr))" }}>{row.map((sym, i) => { const el = sym ? elementMap[sym] : null; const inactive = el && cat !== "All" && el.category !== cat; return el ? <button key={sym} onClick={() => setSelected(sym)} className={`h-16 rounded-2xl border transition hover:scale-110 ${selected === sym ? "ring-2 ring-white" : ""} ${inactive ? "opacity-25" : ""}`} style={heatStyle(score(sym)[layer], layer === "alignment" ? 100 : 5)}><div className="text-[9px]">{el.atomicNumber}</div><b>{sym}</b><div className="text-[9px]">{score(sym)[layer].toFixed(layer === "alignment" ? 0 : 1)}</div></button> : <div key={i} className="h-16 rounded-2xl border border-cyan-300/5 bg-cyan-300/[.01]"/>; })}</div>)}</div></Panel></>;
}

function Compare({ compare, setCompare, setPage }) {
  const [candidate, setCandidate] = useState("Al");
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
            onClick={() => {
              setCompare([]);
              setTimeout(() => setCompare(["Al", "Fe", "Cu", "Ti"]), 10);
            }}
          >
            Reset
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
                        downloadFile(
                          `${sym}-${next}-compatibility.txt`,
                          `${sym} + ${next}\nCompatibility: ${value}%\nTier: ${tier}\nDNA: ${dna}`
                        )
                      }
                    >
                      Export
                    </Button>

                    <Button
                      variant="primary"
                      onClick={() =>
                        navigator.clipboard.writeText(
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
                          navigator.clipboard.writeText(
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
  const [layer, setLayer] = useState("conductivity"); const [environment, setEnvironment] = useState("Lab air"); const selectedElement = elementMap[selected] || elementMap.Al; const selectedScore = score(selected);
  const fieldCells = Array.from({ length: 128 }, (_, i) => { const e = elements[(i * 7) % elements.length]; const wave = Math.sin(i / 5) * 0.35; return { element: e, value: Math.max(0.2, Math.min(layer === "alignment" ? 100 : 5, score(e.symbol)[layer] + wave)) }; });
  const top = elements.map(e => ({ ...e, metrics: score(e.symbol) })).sort((a, b) => b.metrics[layer] - a.metrics[layer]).slice(0, 8);
  return <><Panel><Pill gold><Radar size={12}/> live simulation layer</Pill><h1 className="mt-4 text-5xl font-black">Behaviour Atlas</h1><Info title="Now useful">This is no longer another periodic table. It is a live material field map for seeing behaviour intensity, environmental context and top-ranked materials.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(l => <Button key={l} onClick={() => setLayer(l)} variant={layer === l ? "primary" : "ghost"}>{l === "alignment" ? "Alignment" : l}</Button>)}<select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 outline-none">{["Lab air", "Vacuum", "High pressure", "Salt exposure", "High temperature", "Cryogenic"].map(x => <option key={x}>{x}</option>)}</select></div></Panel><GuidePanel page="atlas" /><div className="grid gap-6 xl:grid-cols-[1fr_420px]"><Panel><div className="flex items-center justify-between"><h2 className="text-3xl font-black">Behaviour Field Map</h2><Pill gold>{environment}</Pill></div><div className="mt-6 grid grid-cols-8 gap-2 md:grid-cols-12 xl:grid-cols-16">{fieldCells.map((cell, i) => <button key={`${cell.element.symbol}-${i}`} onClick={() => setSelected(cell.element.symbol)} className={`aspect-square rounded-2xl border text-xs font-black transition hover:scale-110 ${selected === cell.element.symbol ? "ring-2 ring-white" : "border-white/10"}`} style={heatStyle(cell.value, layer === "alignment" ? 100 : 5)}>{cell.element.symbol}</button>)}</div></Panel><Panel><h2 className="text-2xl font-black">Selected Telemetry</h2><div className="mt-4 text-6xl font-black text-cyan-100">{selectedElement.symbol}</div><div className="text-2xl font-black">{selectedElement.name}</div><RadarChart data={selectedScore}/><p className="text-sm leading-7 text-slate-300">In {environment}, {selectedElement.name} shows a {selectedScore[layer] > (layer === "alignment" ? 65 : 3.5) ? "strong" : "moderate"} {layer} signal.</p></Panel></div><Panel><h2 className="text-3xl font-black">Top Materials for {layer}</h2><div className="mt-5 grid gap-3 md:grid-cols-4">{top.map((e, i) => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-left"><div className="text-xs text-slate-500">#{i + 1}</div><div className="text-2xl font-black text-cyan-100">{e.symbol}</div><div className="text-sm text-slate-400">{e.name}</div></button>)}</div></Panel></>;
}
function BehaviourGraph({ selected, setSelected }) {
  const [metric, setMetric] = useState("conductivity"); const selectedScore = score(selected);
  const related = elements.filter(e => e.symbol !== selected).map(e => { const s = score(e.symbol); const distance = Math.abs(s.stability - selectedScore.stability) + Math.abs(s.conductivity - selectedScore.conductivity) + Math.abs(s.thermal - selectedScore.thermal) + Math.abs(s.diffusion - selectedScore.diffusion); return { ...e, metrics: s, similarity: Math.max(0, 100 - distance * 13) }; }).sort((a,b) => b.similarity - a.similarity).slice(0, 18);
  const nodes = related.map((e, i) => ({ ...e, x: 50 + Math.cos(i / related.length * Math.PI * 2) * (20 + (i % 5) * 5), y: 50 + Math.sin(i / related.length * Math.PI * 2) * (20 + (i % 5) * 5) }));
  return <><Panel><Pill gold><Network size={12}/> relationship intelligence</Pill><h1 className="mt-4 text-5xl font-black">Behaviour Graph</h1><Info title="Reason to exist">The graph explains which materials are behaviour-adjacent to the selected element and gives a similarity ranking.</Info><div className="mt-4 flex flex-wrap gap-2">{metrics.map(m => <Button key={m} onClick={() => setMetric(m)} variant={metric === m ? "primary" : "ghost"}>{m === "alignment" ? "Alignment" : m}</Button>)}</div></Panel><GuidePanel page="graph" /><div className="grid gap-6 xl:grid-cols-[1fr_430px]"><Panel><div className="relative h-[660px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/35"><svg className="absolute inset-0 h-full w-full">{nodes.map(n => <line key={n.symbol} x1="50%" y1="50%" x2={`${n.x}%`} y2={`${n.y}%`} stroke="rgba(34,211,238,.22)" strokeWidth="2"/>)}</svg><div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-amber-300/30 bg-amber-300/10 text-3xl font-black text-amber-100">{selected}</div>{nodes.map(n => <button key={n.symbol} onClick={() => setSelected(n.symbol)} className="absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-cyan-300/20 bg-slate-950/85 text-sm font-black text-cyan-100 transition hover:scale-125" style={{ left: `${n.x}%`, top: `${n.y}%`, boxShadow: `0 0 ${10 + (n.metrics[metric] / (metric === "alignment" ? 100 : 5)) * 40}px rgba(34,211,238,.35)` }}>{n.symbol}</button>)}</div></Panel><Panel><h2 className="text-2xl font-black">Closest Matches</h2><div className="mt-4 space-y-2">{related.slice(0, 8).map(e => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3 text-left"><span><b className="text-cyan-100">{e.symbol}</b> <span className="text-slate-400">{e.name}</span></span><span className="font-black text-emerald-200">{e.similarity.toFixed(0)}%</span></button>)}</div></Panel></div></>;
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
  const [density, setDensity] = useState(7850);
  const [volume, setVolume] = useState(0.42);
  const [force, setForce] = useState(12500);
  const [area, setArea] = useState(0.18);
  const [distance, setDistance] = useState(75);
  const [time, setTime] = useState(14);

  const mass = density * volume;
  const pressure = force / Math.max(area, 0.001);
  const velocity = distance / Math.max(time, 0.001);
  const energy = 0.5 * mass * velocity * velocity;
  const signal = Math.round(Math.min(99, Math.max(1, pressure / 1800 + energy / 25000)));

  const exportCalc = () => {
    downloadFile(
      "elementos-calculation-core-report.txt",
      `ElementOS Calculation Core Report\n\nDensity: ${density} kg/m3\nVolume: ${volume} m3\nMass: ${mass.toFixed(2)} kg\nForce: ${force} N\nArea: ${area} m2\nPressure: ${pressure.toFixed(2)} Pa\nDistance: ${distance} m\nTime: ${time} s\nVelocity: ${velocity.toFixed(2)} m/s\nEnergy proxy: ${energy.toFixed(2)} J\nTelemetry signal: ${signal}%`
    );
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><Calculator size={12}/> premium calculation engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">Calculation <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Core</span></h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">A serious engineering-style calculation page for mass, pressure, velocity, kinetic energy and simulation signal. This is now designed to support reports, drilling scenarios, Seismo analysis and material decisions.</p>
          <Info title="What to do here">Change the physical inputs, watch the output cards update instantly, then export a calculation report for your research workflow.</Info>
        </div>
        <Panel>
          <h2 className="text-3xl font-black">Live Inputs</h2>
          <div className="mt-5 grid gap-4">
            {[
              ["Density", density, setDensity, 500, 20000, "kg/m³"],
              ["Volume", volume, setVolume, 0.05, 3, "m³"],
              ["Force", force, setForce, 100, 50000, "N"],
              ["Area", area, setArea, 0.02, 2, "m²"],
              ["Distance", distance, setDistance, 1, 250, "m"],
              ["Time", time, setTime, 1, 60, "s"],
            ].map(([label, value, setter, min, max, unit]) => (
              <label key={label} className="block text-sm text-slate-300">
                <div className="flex justify-between"><span>{label}</span><b className="text-cyan-100">{Number(value).toFixed(label === "Volume" || label === "Area" ? 2 : 0)} {unit}</b></div>
                <input type="range" min={min} max={max} step={label === "Volume" || label === "Area" ? 0.01 : 1} value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-3 w-full" />
              </label>
            ))}
          </div>
        </Panel>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-4">
        {[
          ["Mass", `${mass.toFixed(1)} kg`, "density × volume"],
          ["Pressure", `${pressure.toFixed(0)} Pa`, "force ÷ area"],
          ["Velocity", `${velocity.toFixed(2)} m/s`, "distance ÷ time"],
          ["Energy", `${energy.toFixed(0)} J`, "kinetic proxy"],
        ].map(([title, value, desc]) => (
          <Panel key={title}><div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div><div className="mt-3 text-4xl font-black text-cyan-100">{value}</div><p className="mt-2 text-sm text-slate-400">{desc}</p></Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Pill><BarChart3 size={12}/> visual calculation telemetry</Pill><h2 className="mt-3 text-4xl font-black">Calculation Signal Surface</h2><p className="mt-2 text-sm leading-6 text-slate-400">A premium visual readout connecting pressure, mass and energy into one simulation confidence layer.</p></div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-3xl font-black text-emerald-100">{signal}%</div>
        </div>
        <div className="mt-8 grid h-64 grid-cols-12 items-end gap-2 rounded-[2rem] border border-white/10 bg-black/25 p-5">
          {Array.from({ length: 12 }).map((_, i) => {
            const h = Math.max(12, Math.min(100, signal + Math.sin(i * 0.9) * 22 + i * 2));
            return <div key={i} className="rounded-t-2xl bg-cyan-300/80 shadow-[0_0_30px_rgba(34,211,238,.35)]" style={{ height: `${h}%` }} />;
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><Button onClick={exportCalc} variant="primary"><Download size={16} className="inline"/> Export Calculation Report</Button></div>
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
            Join beta to save reports to the cloud. PDF export is a Pro Lab feature.
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
                  <div className="flex flex-wrap gap-2">
                    {r.public_id && (
                      <Button
                        onClick={() => {
                          const url = `${window.location.origin}/?report=${r.public_id}`;
                          navigator.clipboard.writeText(url);
                          setStatus("Public share link copied.");
                        }}
                      >
                        Share Link
                      </Button>
                    )}

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
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
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
                onClick={() => navigator.clipboard.writeText(window.location.href)}
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
  const active = elementMap[material] || elementMap.Ti;
  const s = score(active.symbol);
  const years = [0, 1, 5, 10, 25, 50, 75, 100];
  const baseResilience = Math.round(s.stability * 14 + s.pressure * 9 + s.thermal * 7 + s.conductivity * 4);
  const curve = years.map((year, index) => {
    const decay = Math.log10(year + 1) * (8 + (5 - s.stability) * 4) + index * 1.2;
    const survival = Math.max(7, Math.min(99, Math.round(baseResilience - decay)));
    const thermal = Math.max(4, Math.min(99, Math.round(s.thermal * 18 - Math.log10(year + 1) * 9 + 30)));
    const pressure = Math.max(4, Math.min(99, Math.round(s.pressure * 18 - Math.log10(year + 1) * 7 + 26)));
    const confidence = Math.max(61, Math.min(98, Math.round(survival * 0.68 + thermal * 0.18 + pressure * 0.14)));
    return { year, survival, thermal, pressure, confidence };
  });

  const latest = curve[curve.length - 1];
  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${12 + i * 48} ${120 - p.survival}`).join(" ");
  const thermalPath = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${12 + i * 48} ${120 - p.thermal}`).join(" ");
  const pressurePath = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${12 + i * 48} ${120 - p.pressure}`).join(" ");

  const visualCards = [
    ["100-year survival", `${latest.survival}%`, "Long-horizon structural signal"],
    ["Thermal pulse", `${latest.thermal}%`, "Projected heat-response retention"],
    ["Pressure evolution", `${latest.pressure}%`, "Compression and stress signal"],
    ["AI waveform", `${latest.confidence}%`, "Confidence-weighted visual telemetry"],
  ];

  const exportVisual = () => {
    const content = `ElementOS Advanced Visualization Report\n\nMaterial: ${active.name} (${active.symbol})\nMode: ${mode}\n\n${curve.map((p) => `Year ${p.year}: survival ${p.survival}%, thermal ${p.thermal}%, pressure ${p.pressure}%, AI confidence ${p.confidence}%`).join("\n")}\n\nGenerated by ElementOS Visual Intelligence Engine`;
    downloadFile(`${active.symbol}-visual-intelligence-report.txt`, content);
  };

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <Pill gold><BarChart3 size={12}/> advanced visualization</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Visual <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Intelligence Engine</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Turn material scenarios into cinematic survival curves, degradation timelines, thermal pulses, pressure evolution graphs and AI confidence waveforms.
          </p>
          <Info title="What this page does">
            This page makes ElementOS visually unforgettable. It converts your material model into chart-ready visuals for demos, screenshots, reports and investor presentations.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Selected material</div>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
            {elements.map((e) => <option key={e.symbol} value={e.symbol}>{e.symbol} — {e.name}</option>)}
          </select>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Survival Curve", "Thermal Pulse", "Pressure Evolution", "AI Waveform"].map((m) => (
              <Button key={m} onClick={() => setMode(m)} variant={mode === m ? "primary" : "ghost"}>{m}</Button>
            ))}
          </div>
          <Button onClick={exportVisual} variant="primary" className="mt-5 w-full"><Download size={16} className="inline"/> Export Visual Report</Button>
        </Panel>
      </Panel>

      <GuidePanel page="visualization" />

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill><Sparkles size={12}/> cinematic telemetry</Pill>
            <h2 className="mt-3 text-4xl font-black">{active.name} Visual Timeline</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              The survival curve tracks material integrity across a 100-year horizon. Secondary traces show thermal response and pressure stability drifting over time.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-bold text-emerald-100">
            AI confidence {latest.confidence}%
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-cyan-300/15 bg-black/30 p-5">
          <svg viewBox="0 0 360 140" className="h-72 w-full overflow-visible">
            {[20, 40, 60, 80, 100].map((y) => (
              <line key={y} x1="12" x2="348" y1={120 - y} y2={120 - y} stroke="rgba(255,255,255,.08)" />
            ))}
            <path d={path} fill="none" stroke="rgba(34,211,238,.95)" strokeWidth="4" strokeLinecap="round" />
            <path d={thermalPath} fill="none" stroke="rgba(251,191,36,.78)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" />
            <path d={pressurePath} fill="none" stroke="rgba(52,211,153,.78)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 7" />
            {curve.map((p, i) => (
              <g key={p.year}>
                <circle cx={12 + i * 48} cy={120 - p.survival} r="4" fill="rgba(34,211,238,.95)" />
                <text x={12 + i * 48} y="136" textAnchor="middle" className="fill-slate-400 text-[8px]">Y{p.year}</text>
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[.18em] text-slate-400">
            <span className="text-cyan-100">● Survival</span>
            <span className="text-amber-100">● Thermal</span>
            <span className="text-emerald-100">● Pressure</span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-4">
        {visualCards.map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-cyan-300" style={{ width: value }} />
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><Network size={12}/> visual relationship map</Pill>
            <h2 className="mt-3 text-4xl font-black">Relationship Pulse Map</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">A cinematic snapshot of materials visually adjacent to {active.name} for reports, demos and discovery navigation.</p>
          </div>
          <Button onClick={() => setPage("scenario")} variant="primary">Build Scenario</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {generateRecommendations([active.symbol])[0]?.matches.concat(generateDiscoveryEngine(3).map(d => ({ symbol: d.b, name: d.bName, similarity: d.score, reason: d.type }))).slice(0,5).map((m) => (
            <div key={`${m.symbol}-visual`} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-5">
              <div className="text-4xl font-black text-cyan-100">{m.symbol}</div>
              <div className="mt-1 text-sm text-slate-300">{m.name}</div>
              <div className="mt-4 text-3xl font-black text-emerald-200">{Math.round(m.similarity)}%</div>
              <div className="mt-2 text-xs uppercase tracking-[.18em] text-slate-500">pulse match</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{m.reason}</p>
            </div>
          ))}
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
    downloadFile("elementos-my-lab-summary.txt", content);
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
          <Button onClick={exportLabSummary} variant="primary" className="mt-5 w-full">Export Lab Summary</Button>
        </Panel>
      </Panel>

      <GuidePanel page="lab" />

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
                  <Button onClick={() => navigator.clipboard.writeText(`${scenario.title} · Risk ${scenario.risk}% · Survival ${scenario.survival} years`)} variant="primary">Share</Button>
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
              <Button className="mt-4 w-full" onClick={() => navigator.clipboard.writeText(`${report.pair} · ${report.score}% · ${report.type}`)}>Copy Card</Button>
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
  const [feature, setFeature] = useState("Viral discovery cards for Seismo, Time Machine and Well Driller");
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
    ["Now", "Viral Cards + Universal Simulation Dossiers", "Turn every discovery into a shareable output."],
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

ElementOS is an AI-native exploratory simulation platform for material intelligence, Time Machine forecasts, Seismo wave modelling, Well Driller simulations, Scenario Builder reports and viral discovery cards.

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
      "- Viral discovery cards",
      "- TikTok/X/Reddit-ready visuals",
      "- Public reports",
      "- Mobile app feel",
      "- Faster performance",
      "- Better onboarding",
      "- Cleaner scientific language",
      "- Community and leaderboards",
    ].join("\\n");

    downloadFile(`elementos-beta-brief-${founderNumber}.txt`, content);
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
            <Button onClick={() => setPage("viralcards")} variant="primary">Create Viral Card</Button>
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
              <Button onClick={exportBetaBrief}>Export Beta Brief</Button>
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
            ["Viral Cards", "Can users create a card they would actually post?", "viralcards"],
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

function LandingPage({ setPage, session, isPro, startCheckout }) {
  const showcases = [
    ["Matter Intelligence OS", "Explore opportunity intelligence, ground signals, ranked targets, AI explanations, reports and project workspaces.", Globe2, "matterlab"],
    ["Isotope Lab", "Inspect advanced material variants and isotope-style scenario logic without hiding it inside experimental tools.", Atom, "isotopes"],
    ["Scenario Builder", "Type real-world material situations and receive risk scores, failure modes, lifespan estimates and substitute suggestions.", FileText, "scenario"],
    ["Time Machine", "Simulate how materials age across 1, 10, 50 and 100-year horizons under corrosion, heat, pressure and stress.", Clock3, "timemachine"],
  ];

  const stats = [
    ["118", "elements mapped"],
    ["7", "behaviour metrics"],
    ["100y", "time horizons"],
    ["Pro", "export workflow"],
  ];

  const plans = [
    ["Explorer", "$19/mo", "For solo material exploration", ["Element explorer", "Discovery feed", "Basic compare tools"]],
    ["Pro Lab", "$49/mo", "For serious saved research", ["Premium exports", "Scenario reports", "Saved workspace", "Time Machine workflows"]],
    ["Research Team", "$149/mo", "For teams and demos", ["Team-ready positioning", "Advanced visual reports", "Shared research workflows", "Enterprise-style dashboards"]],
  ];

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><Sparkles size={12} /> material intelligence operating system</Pill>
          <h1 className="mt-5 text-5xl font-black sm:text-7xl">
            The operating system for <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">material intelligence</span>
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Explore 118 elements, compare material behaviour, simulate future conditions, discover hidden relationships, generate research reports and build a permanent workspace for decisions that matter.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => setPage("mission")} variant="primary">Start Guided Tour</Button>
            <Button onClick={() => setPage("scenario")}>Run First Simulation</Button>
            <Button onClick={() => setPage("matterlab")}>Open Matter Intelligence OS</Button>
          </div>
          <Info title="Why people keep ElementOS open">
            ElementOS tells users what to do next: choose a material, compare it, run a simulation, create a dossier, save the result and share the discovery.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Start here</div>
          <h2 className="mt-3 text-4xl font-black text-cyan-100">Your first guided simulation</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">ElementOS guides the user from an idea to a report: pick a material, run a scenario, inspect the risk signal, then save or publish the result.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4"><div className="text-3xl font-black text-rose-100">34%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">risk</div></div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4"><div className="text-3xl font-black text-emerald-100">82y</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">survival</div></div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4"><div className="text-3xl font-black text-cyan-100">94%</div><div className="text-[10px] uppercase tracking-[.2em] text-slate-500">confidence</div></div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/30">
            <div className="h-full w-[82%] rounded-full bg-cyan-300" />
          </div>
          <div className="mt-4 text-sm text-slate-400">Visual survival curve · corrosion timeline · exportable result card</div>
        </Panel>
      </Panel>

      <GuidedNextStep
        setPage={setPage}
        title="Start here: build your first material decision"
        body="ElementOS works best when users follow one clear loop: choose a material, compare it, simulate the environment, generate a dossier and save the strongest result to Workspace."
        primary="mission"
        secondary="matterlab"
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(([value, label]) => (
          <Panel key={label}>
            <div className="text-4xl font-black text-cyan-100">{value}</div>
            <div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{label}</div>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill gold><Sparkles size={12} /> platform showcase</Pill>
            <h2 className="mt-3 text-4xl font-black">A guided path from curiosity to permanent research value</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Each core page now points users toward a next action: discover, compare, simulate, report, save and share.</p>
          </div>
          <Button onClick={() => setPage("dashboard")} variant="primary">Start Here</Button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {showcases.map(([title, desc, Icon, target]) => (
            <button key={title} onClick={() => setPage(target)} className="rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/10 via-slate-950 to-fuchsia-400/10 p-5 text-left transition hover:scale-[1.02] hover:border-cyan-300/35">
              <Icon size={24} className="text-cyan-300" />
              <h3 className="mt-4 text-2xl font-black text-cyan-100">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
              <div className="mt-5 text-xs font-black uppercase tracking-[.2em] text-amber-100">Open feature →</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
          <div>
            <Pill gold><CheckCircle2 size={12} /> why users upgrade</Pill>
            <h2 className="mt-3 text-4xl font-black">From curiosity to permanent workspace</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">The product path is simple: visitors run a guided simulation, understand the output, save the strongest discoveries, then return because the workspace keeps getting more valuable.</p>
            <div className="mt-5 space-y-3">
              {["Understand materials faster", "Create scenario reports", "Save discoveries in Workspace", "Export professional PDFs", "Use Time Machine, Isotope Lab and Matter Intelligence OS"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-cyan-100"><CheckCircle2 size={15} className="mr-2 inline text-emerald-300" />{item}</div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map(([name, price, desc, bullets], index) => (
              <div key={name} className={`rounded-[2rem] border p-5 ${index === 1 ? "border-amber-300/30 bg-amber-300/10" : "border-white/10 bg-black/25"}`}>
                <div className="text-2xl font-black text-cyan-100">{name}</div>
                <div className="mt-2 text-4xl font-black text-emerald-200">{price}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
                <div className="mt-5 space-y-2">
                  {bullets.map((b) => <div key={b} className="text-sm text-slate-300">✓ {b}</div>)}
                </div>
                <Button onClick={index === 1 ? startCheckout : () => setPage("mission")} variant={index === 1 ? "primary" : "ghost"} className="mt-5 w-full">
                  {index === 1 ? "Upgrade Pro" : "Start Guided Path"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel>
        <Pill><BookOpen size={12} /> FAQ</Pill>
        <h2 className="mt-3 text-4xl font-black">Questions visitors will ask</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Is this for engineers only?", "No. The interface explains each page clearly so beginners can try scenarios while advanced users explore deeper comparison logic."],
            ["What does the Time Machine do?", "It projects material behaviour across future time horizons under exposure, heat, pressure, stress and corrosion-style conditions."],
            ["Why use Workspace?", "Workspace turns one-off experiments into a permanent research library of saved simulations, reports, discoveries and next steps."],
            ["What makes Pro useful?", "Pro positioning focuses on premium exports, reusable reports, saved research assets and professional visual outputs."],
          ].map(([q, a]) => (
            <div key={q} className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xl font-black text-cyan-100">{q}</div>
              <p className="mt-3 text-sm leading-7 text-slate-400">{a}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function ExperimentalWellDriller({ setPage }) {
  const [depth, setDepth] = useState(3200);
  const [pressure, setPressure] = useState(62);
  const [rpm, setRpm] = useState(118);
  const [mud, setMud] = useState(48);
  const [inclination, setInclination] = useState(22);
  const [formation, setFormation] = useState("Layered sandstone");

  const formationProfiles = {
    "Layered sandstone": { hardness: 0.85, porosity: 72, instability: 0.7, color: "from-amber-300/20 to-orange-500/10" },
    "Shale pressure zone": { hardness: 1.15, porosity: 44, instability: 1.25, color: "from-slate-400/20 to-cyan-500/10" },
    "Basalt cap rock": { hardness: 1.55, porosity: 24, instability: 0.85, color: "from-zinc-200/20 to-slate-700/20" },
    "Carbonate reservoir": { hardness: 0.95, porosity: 82, instability: 0.75, color: "from-emerald-300/20 to-cyan-500/10" },
  };

  const fp = formationProfiles[formation] || formationProfiles["Layered sandstone"];
  const depthKm = depth / 1000;
  const torque = Math.round(rpm * fp.hardness + pressure * 1.8 - mud * 0.5 + inclination * 0.75);
  const reservoirScore = Math.round(Math.min(99, Math.max(5, depth / 55 + pressure * 0.42 + fp.porosity * 0.18 - mud * 0.16)));
  const boreStability = Math.round(Math.min(99, Math.max(1, 100 - pressure * fp.instability * 0.42 + mud * 0.46 - rpm * 0.045 - inclination * 0.18)));
  const kickRisk = Math.round(Math.min(99, Math.max(1, pressure * 0.72 + depthKm * 7 - mud * 0.45 + fp.instability * 11)));
  const rateOfPenetration = Math.round(Math.max(2, Math.min(80, rpm * 0.12 - fp.hardness * 6 + mud * 0.08 + pressure * 0.04)));
  const casingLoad = Math.round(Math.min(99, Math.max(10, depthKm * 16 + inclination * 0.5 + pressure * 0.2)));

  const strata = [
    ["Surface cap", 12, "bg-cyan-300/15"],
    ["Clay seal", 16, "bg-slate-400/15"],
    ["Sand channel", 18, "bg-amber-300/15"],
    ["Pressure lens", 20, "bg-rose-300/15"],
    ["Target reservoir", 24, "bg-emerald-300/20"],
  ];

  const exportWell = () => downloadFile(
    "elementos-experimental-well-driller-report.txt",
    `ElementOS Well Driller Lab Report\n\nFormation: ${formation}\nDepth: ${depth} m\nInclination: ${inclination} deg\nFormation pressure: ${pressure}%\nDrill RPM: ${rpm}\nMud balance: ${mud}%\nTorque index: ${torque}\nReservoir score: ${reservoirScore}%\nBore stability: ${boreStability}%\nKick risk: ${kickRisk}%\nRate of penetration: ${rateOfPenetration} m/hr\nCasing load: ${casingLoad}%`
  );

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1fr_.95fr]">
        <div>
          <Pill gold><Radar size={12}/> experimental subsurface simulator</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Experimental <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Well Driller</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            A cinematic subsurface drilling simulator for wellbore geometry, formation pressure, mud balance, kick risk, target reservoir quality and seismic readiness.
          </p>
          <Info title="3D drilling intelligence">
            This page now shows a visible 3D-style wellbore, layered geology, drilling telemetry, reservoir target scoring and direct handoff into Seismo for P-wave/S-wave analysis.
          </Info>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={exportWell} variant="primary"><Download size={16} className="inline"/> Export Well Report</Button>
            <Button onClick={() => setPage("seismo")}>Open Seismo</Button>
            <Button onClick={() => setPage("calculations")}>Open Calculation Core</Button>
          </div>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Drilling command readout</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div className="text-4xl font-black text-emerald-100">{reservoirScore}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">reservoir score</div>
            </div>
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-4xl font-black text-cyan-100">{boreStability}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">bore stability</div>
            </div>
            <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
              <div className="text-4xl font-black text-rose-100">{kickRisk}%</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">kick risk</div>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
              <div className="text-4xl font-black text-amber-100">{rateOfPenetration}</div>
              <div className="text-[10px] uppercase tracking-[.18em] text-slate-500">m/hr rop</div>
            </div>
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="welldriller" />

      <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <Panel>
          <h2 className="text-3xl font-black">Well Controls</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[.2em] text-slate-500">Formation</span>
              <select value={formation} onChange={(e) => setFormation(e.target.value)} className="rounded-2xl border border-white/10 bg-black/30 p-4 outline-none">
                {Object.keys(formationProfiles).map((k) => <option key={k}>{k}</option>)}
              </select>
            </label>
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
              <Pill gold><Layers size={12}/> 3D subsurface profile</Pill>
              <h2 className="mt-3 text-4xl font-black">Live Wellbore Geometry</h2>
            </div>
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">Target {depth}m</div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-slate-950/90 p-6 [perspective:1100px]">
            <div className="relative mx-auto h-[520px] max-w-4xl [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-24deg)]">
              {strata.map(([label, height, cls], index) => (
                <div
                  key={label}
                  className={`absolute left-1/2 top-1/2 rounded-[2rem] border border-white/10 ${cls} shadow-[0_0_50px_rgba(34,211,238,.08)]`}
                  style={{
                    width: `${500 - index * 32}px`,
                    height: `${height * 7}px`,
                    transform: `translate(-50%, ${-230 + index * 78}px) translateZ(${-index * 22}px)`,
                  }}
                >
                  <div className="p-4 text-xs font-black uppercase tracking-[.2em] text-slate-300">{label}</div>
                </div>
              ))}

              <div
                className="absolute left-1/2 top-5 h-[450px] w-12 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-cyan-300/20 shadow-[0_0_80px_rgba(34,211,238,.45)]"
                style={{ transform: `translateX(${inclination * 1.4 - 40}px) rotateZ(${inclination / 2}deg)` }}
              />
              <div
                className="absolute left-1/2 top-[380px] h-20 w-20 -translate-x-1/2 rounded-full border border-amber-200/60 bg-amber-300/30 shadow-[0_0_80px_rgba(251,191,36,.65)]"
                style={{ transform: `translateX(${inclination * 1.8 - 54}px)` }}
              />
              <div
                className="absolute left-1/2 top-[430px] h-14 w-52 -translate-x-1/2 rounded-full border border-emerald-200/40 bg-emerald-300/20 shadow-[0_0_90px_rgba(52,211,153,.35)]"
                style={{ transform: `translateX(${inclination * 1.8 - 54}px) translateZ(30px)` }}
              />
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          ["Torque Index", torque, "rotary load through formation hardness"],
          ["Casing Load", `${casingLoad}%`, "structural demand on well casing"],
          ["Porosity Signal", `${fp.porosity}%`, "estimated reservoir openness"],
        ].map(([title, value, desc]) => (
          <Panel key={title}>
            <div className="text-xs uppercase tracking-[.22em] text-slate-500">{title}</div>
            <div className="mt-3 text-5xl font-black text-cyan-100">{value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
            <div className="mt-5 h-28 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-black/30 to-fuchsia-400/10 [transform:perspective(700px)_rotateX(54deg)_rotateZ(-8deg)] shadow-[0_30px_80px_rgba(34,211,238,.12)]" />
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

  const waveSamples = Array.from({ length: 42 }, (_, i) => {
    const x = 4 + i * 2.25;
    const p = 50 + Math.sin(i * 0.75) * (10 + density * 0.05);
    const s = 50 + Math.sin(i * 0.43 + 1.2) * (18 + noise * 0.08);
    return { x, p, s };
  });

  const exportSeismo = () => downloadFile(
    "elementos-seismo-ps-wave-report.txt",
    `ElementOS Seismo P/S Wave Report\n\nDistance: ${distance} km\nDepth: ${depth} m\nP-wave velocity: ${pVelocity} m/s\nS-wave velocity: ${sVelocity} m/s\nP arrival: ${pArrival.toFixed(2)} s\nS arrival: ${sArrival.toFixed(2)} s\nArrival gap: ${gap.toFixed(2)} s\nEpicentral estimate: ${epicentralEstimate} km\nWave ratio: ${waveRatio}\nSignal clarity: ${clarity}%\nConfidence: ${confidence}%\nNoise: ${noise}%\nDensity contrast: ${density}%`
  );

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
            <Button onClick={exportSeismo} variant="primary"><Download size={16} className="inline"/> Export Seismo Report</Button>
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
                    boxShadow: i % 2 === 0 ? "0 0 42px rgba(34,211,238,.16)" : "0 0 42px rgba(251,191,36,.12)",
                  }}
                />
              ))}
              <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_80px_rgba(251,191,36,.85)]" />
              <div className="absolute left-[15%] top-[45%] h-5 w-[70%] rounded-full bg-cyan-300/40 shadow-[0_0_70px_rgba(34,211,238,.5)]" />
              <div className="absolute left-[22%] top-[58%] h-5 w-[56%] rounded-full bg-amber-300/35 shadow-[0_0_70px_rgba(251,191,36,.45)]" />
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
          <polyline points={waveSamples.map((s) => `${s.x},${s.p}`).join(" ")} fill="none" stroke="rgba(34,211,238,.95)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={waveSamples.map((s) => `${s.x},${s.s}`).join(" ")} fill="none" stroke="rgba(251,191,36,.92)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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
  const [mode, setMode] = useState("Discovery");
  const [cardIndex, setCardIndex] = useState(0);
  const discoveries = useMemo(() => adaptiveDiscoveryRank(generateDiscoveryEngine(16)), []);
  const activeMaterial = elementMap[selected] || elementMap.Al;
  const compareSet = compare?.length ? compare : ["Al", "Ti", "Hf", "W"];
  const discovery = discoveries[cardIndex % discoveries.length] || discoveries[0];
  const compatibility = compareSet.length >= 2 ? compatibilityScore(compareSet[0], compareSet[1]) : 92;

  const cardData = useMemo(() => {
    const base = {
      label: "ElementOS Viral Card",
      badge: "AI-NATIVE SIMULATION",
      title: `${discovery?.a || "Ti"} + ${discovery?.b || "Hf"}`,
      subtitle: discovery?.type || "Rare material pathway",
      score: discovery?.aiConfidence || 94,
      metric: "AI confidence",
      statA: `+${discovery?.velocity || 42}% velocity`,
      statB: `${discovery?.shares?.toLocaleString?.() || "1,284"} shares`,
      statC: discovery?.tier || "ULTRA RARE",
      narrative: discovery?.reason || "High-signal material pairing with strong discovery potential.",
    };

    if (mode === "Time Machine") {
      return {
        ...base,
        badge: "TIME MACHINE FORECAST",
        title: `${activeMaterial.name} (${activeMaterial.symbol})` ,
        subtitle: "100-year survivability simulation",
        score: Math.max(55, Math.min(98, Math.round(score(activeMaterial.symbol).stability * 18 + score(activeMaterial.symbol).pressure * 5))),
        metric: "future stability",
        statA: "100 year horizon",
        statB: "thermal fatigue mapped",
        statC: "FORECAST",
        narrative: "Projected material behaviour across corrosion, fatigue, heat and pressure exposure.",
      };
    }

    if (mode === "Seismo") {
      return {
        ...base,
        badge: "SEISMO WAVE CARD",
        title: "P-Wave / S-Wave Field",
        subtitle: "arrival gap and subsurface clarity",
        score: 91,
        metric: "signal clarity",
        statA: "P-wave fast path",
        statB: "S-wave lag detected",
        statC: "SEISMIC",
        narrative: "A cinematic seismic readout designed for sharing wave speed, arrival gap and depth response.",
      };
    }

    if (mode === "Well Driller") {
      return {
        ...base,
        badge: "EXPERIMENTAL WELL DRILLER",
        title: "Deep Well Pathway",
        subtitle: "bore path, strata and pressure load",
        score: 88,
        metric: "drill confidence",
        statA: "target reservoir",
        statB: "pressure profile",
        statC: "SUBSURFACE",
        narrative: "A shareable subsurface simulation card showing wellbore direction, formation layers and drilling signal.",
      };
    }

    if (mode === "Scenario") {
      return {
        ...base,
        badge: "SCENARIO BUILDER CARD",
        title: `${compareSet.slice(0, 2).join(" + ")}`,
        subtitle: "real-world material scenario",
        score: Math.max(50, Math.min(99, compatibility)),
        metric: "scenario fit",
        statA: "risk mapped",
        statB: "lifespan estimated",
        statC: "REPORTABLE",
        narrative: "Plain-English material situation transformed into a premium shareable simulation output.",
      };
    }

    return base;
  }, [mode, discovery, activeMaterial, compareSet, compatibility]);

  const safeText = (value) => String(value ?? "").replace(/[&<>\"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const exportSVG = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#061827"/><stop offset="0.45" stop-color="#020617"/><stop offset="1" stop-color="#2b123f"/></linearGradient>
    <radialGradient id="pulse" cx="50%" cy="35%" r="60%"><stop offset="0" stop-color="#22d3ee" stop-opacity="0.55"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="1600" fill="url(#bg)"/>
  <circle cx="820" cy="360" r="420" fill="url(#pulse)"/>
  <circle cx="240" cy="1240" r="360" fill="#f59e0b" opacity="0.12"/>
  <rect x="86" y="86" width="1028" height="1428" rx="70" fill="rgba(255,255,255,0.055)" stroke="#22d3ee" stroke-opacity="0.35" stroke-width="3"/>
  <text x="120" y="170" fill="#fef3c7" font-family="Arial" font-size="32" font-weight="800" letter-spacing="8">${safeText(cardData.badge)}</text>
  <text x="120" y="330" fill="#e0f2fe" font-family="Arial" font-size="92" font-weight="900">${safeText(cardData.title)}</text>
  <text x="120" y="405" fill="#94a3b8" font-family="Arial" font-size="38" font-weight="700">${safeText(cardData.subtitle)}</text>
  <circle cx="600" cy="735" r="250" fill="none" stroke="#22d3ee" stroke-opacity="0.25" stroke-width="24"/>
  <circle cx="600" cy="735" r="186" fill="none" stroke="#f59e0b" stroke-opacity="0.30" stroke-width="18"/>
  <text x="600" y="725" fill="#67e8f9" font-family="Arial" font-size="150" font-weight="900" text-anchor="middle">${safeText(cardData.score)}%</text>
  <text x="600" y="790" fill="#cbd5e1" font-family="Arial" font-size="34" font-weight="800" text-anchor="middle">${safeText(cardData.metric)}</text>
  <rect x="130" y="1040" width="285" height="150" rx="34" fill="#020617" stroke="#22d3ee" stroke-opacity="0.35"/>
  <rect x="457" y="1040" width="285" height="150" rx="34" fill="#020617" stroke="#22d3ee" stroke-opacity="0.35"/>
  <rect x="784" y="1040" width="285" height="150" rx="34" fill="#020617" stroke="#f59e0b" stroke-opacity="0.45"/>
  <text x="272" y="1125" fill="#e0f2fe" font-family="Arial" font-size="34" font-weight="900" text-anchor="middle">${safeText(cardData.statA)}</text>
  <text x="600" y="1125" fill="#e0f2fe" font-family="Arial" font-size="34" font-weight="900" text-anchor="middle">${safeText(cardData.statB)}</text>
  <text x="927" y="1125" fill="#fef3c7" font-family="Arial" font-size="34" font-weight="900" text-anchor="middle">${safeText(cardData.statC)}</text>
  <text x="120" y="1325" fill="#cbd5e1" font-family="Arial" font-size="34" font-weight="700">${safeText(cardData.narrative).slice(0, 82)}</text>
  <text x="120" y="1450" fill="#22d3ee" font-family="Arial" font-size="34" font-weight="900" letter-spacing="5">ELEMENTOS.AI</text>
</svg>`;
    downloadFile(`ElementOS-${mode.replace(/\s+/g, "-")}-viral-card.svg`, svg, "image/svg+xml");
  };

  const copyCard = () => {
    const text = `${cardData.title}\n${cardData.badge}\n${cardData.score}% ${cardData.metric}\n${cardData.statA} · ${cardData.statB} · ${cardData.statC}\n${cardData.narrative}\nGenerated in ElementOS`;
    navigator.clipboard?.writeText(text);
    alert("Viral card copy saved to clipboard.");
  };

  const modes = ["Discovery", "Time Machine", "Scenario", "Seismo", "Well Driller"];

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <div>
          <Pill gold><Sparkles size={12}/> viral growth engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Viral <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Card Studio</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Turn discoveries, Time Machine forecasts, Seismo readouts, Well Driller paths and Scenario Builder outputs into cinematic share cards for X, Reddit, LinkedIn, TikTok screenshots and public reports.
          </p>
          <Info title="Growth doctrine">
            People share visuals, not dashboards. This studio turns every strong simulation into a social asset with rarity, AI confidence, telemetry and exportable SVG cards.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Card source</div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${mode === m ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-black/20 text-slate-300"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={() => setCardIndex((v) => v + 1)}>Next Card</Button>
            <Button onClick={copyCard}>Copy Text</Button>
            <Button onClick={exportSVG} variant="primary">Export SVG</Button>
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="viralcards" />

      <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[720px] overflow-hidden rounded-[2.5rem] border border-cyan-300/25 bg-gradient-to-br from-cyan-400/15 via-slate-950 to-fuchsia-500/20 p-6 shadow-[0_0_120px_rgba(34,211,238,.20)]">
          <div className="absolute -right-28 top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative z-10 flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Pill gold>{cardData.badge}</Pill>
                <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-cyan-100">Share-ready</div>
              </div>
              <h2 className="mt-8 text-6xl font-black leading-none text-cyan-100 sm:text-7xl">{cardData.title}</h2>
              <p className="mt-4 text-xl font-bold text-slate-300">{cardData.subtitle}</p>
            </div>

            <div className="my-10 grid place-items-center">
              <div className="relative grid h-72 w-72 place-items-center rounded-full border-[18px] border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_90px_rgba(34,211,238,.28)]">
                <div className="absolute h-52 w-52 rounded-full border-[14px] border-amber-300/25" />
                <div className="absolute h-36 w-36 rounded-full border border-white/15" />
                <div className="text-center">
                  <div className="text-7xl font-black text-cyan-100">{cardData.score}%</div>
                  <div className="mt-2 text-xs uppercase tracking-[.24em] text-slate-400">{cardData.metric}</div>
                </div>
              </div>
            </div>

            <div>
              <p className="rounded-[1.5rem] border border-white/10 bg-white/[.045] p-5 text-sm leading-7 text-slate-200">{cardData.narrative}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[cardData.statA, cardData.statB, cardData.statC].map((stat) => (
                  <div key={stat} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-center text-sm font-black text-cyan-100">{stat}</div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 text-xs uppercase tracking-[.24em] text-slate-500">
                <span>ELEMENTOS.AI</span>
                <span>{mode}</span>
              </div>
            </div>
          </div>
        </div>

        <Panel>
          <Pill><Network size={12}/> viral ranking</Pill>
          <h2 className="mt-3 text-4xl font-black">Trending Card Queue</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Use these cards as your content engine: export one SVG, post it, and send users back into the matching simulation page.
          </p>
          <div className="mt-6 space-y-3">
            {discoveries.slice(0, 7).map((d, index) => (
              <div key={`${d.dna}-viral`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div>
                  <div className="text-lg font-black text-cyan-100">#{index + 1} · {d.a} + {d.b}</div>
                  <div className="mt-1 text-sm text-slate-400">{d.type} · {d.tier}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-200">{d.aiConfidence}%</div>
                  <div className="text-[10px] uppercase tracking-[.2em] text-slate-500">AI</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => setPage("discover")} className="w-full">Open Discover</Button>
            <Button onClick={() => setPage("simreports")} variant="primary" className="w-full">Open Reports</Button>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {[
          ["X / Twitter", "Post one compact card with a sharp hook and link to the public report."],
          ["Reddit", "Use the card as proof-of-concept visual, then explain the simulation plainly."],
          ["LinkedIn", "Frame cards as exploratory material intelligence reports."],
          ["TikTok", "Screen-record the card generation and export moment."],
        ].map(([title, desc]) => (
          <Panel key={title}>
            <div className="text-xl font-black text-cyan-100">{title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
          </Panel>
        ))}
      </div>
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
    downloadFile(`ElementOS-universal-simulation-report-${active.symbol}.txt`, content);
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
            <Button onClick={exportUniversalReport} variant="primary"><Download size={16} className="inline"/> Export Report</Button>
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
    ["Share", "Create Share Card", "viralcards", "Turn this insight into a cinematic social asset for growth."],
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
    downloadFile("elementos-ai-copilot-brief.txt", lines.join("\n"));
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
          <Button onClick={exportBrief} className="mt-3 w-full"><Download size={16} className="inline"/> Export Copilot Brief</Button>
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
    ["mission", "Open Mission Control", "Guided onboarding missions for comparison, Time Machine, Scenario Builder, Viral Cards and reports.", "Onboarding", "Mission"],
    ["discover", "Open Discovery Feed", "Trending pairings, momentum scores and AI-ranked material discoveries.", "Discovery", "Discover"],
    ["matterlab", "Open Matter Intelligence OS", "Opportunity intelligence for ranked targets, ground signals, AI explanations and reports.", "Advanced Lab", "MIOS"],
    ["isotopes", "Open Isotope Lab", "Advanced material variants and isotope-style scenario exploration.", "Research", "Isotope"],
    ["timemachine", "Run Time Machine", "Forecast ageing, corrosion, degradation and future material states.", "Simulation", "Time"],
    ["scenario", "Build Scenario", "Convert a real-world material situation into risk, lifespan and substitute outputs.", "Simulation", "Scenario"],
    ["welldriller", "Open Well Driller Lab", "Model a deep bore path, reservoir target and pressure profile.", "Simulation", "Well"],
    ["seismo", "Open Seismo Lab", "Compare P-wave and S-wave travel, arrival gaps and wave response.", "Simulation", "Seismo"],
    ["simreports", "Create Simulation Dossier", "Create a universal dossier across Time Machine, Seismo, Scenario and Well Driller.", "Reports", "Report"],
    ["viralcards", "Create Share Card", "Generate a cinematic share card for discoveries, simulations and reports.", "Growth", "Share"],
    ["beta", "Open Founding Beta", "Founding Researcher badge, roadmap, feedback and waitlist conversion.", "Growth", "Beta"],
    ["calculations", "Open Calculation Studio", "Use premium calculation blocks to support report narratives.", "Tools", "Calc"],
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
    ["smart:viral", "Turn current work into a share card", "Opens Share Card Studio with social-growth workflow.", "Smart Action", "Share"],
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
      <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-slate-950/95 shadow-[0_0_140px_rgba(34,211,238,.28)]" onClick={(e) => e.stopPropagation()}>
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

        <div className="grid max-h-[66vh] overflow-hidden lg:grid-cols-[1fr_310px]">
          <div className="overflow-y-auto p-4">
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

          <div className="border-t border-white/10 bg-black/20 p-5 lg:border-l lg:border-t-0">
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

export default function App() {
  const [page, setPage] = useState("landing");
  const [selected, setSelected] = useState("Al");
  const [compare, setCompare] = useState(["Al", "Fe", "Cu", "Ti"]);
  const [session, setSession] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [publicReportRequested, setPublicReportRequested] = useState(false);
  const [publicReport, setPublicReport] = useState(null);
  const [publicReportStatus, setPublicReportStatus] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

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
    setCompare(workspace.compare_set || ["Al", "Fe", "Cu", "Ti"]);

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
      discover: <Discover setPage={setPage} />,
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
        <PageHelpStrip page={page} />
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
