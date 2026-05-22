import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { supabase } from "./supabaseClient";
import {
  Atom, BarChart3, BookOpen, Calculator, CheckCircle2, ChevronRight, Clock3, Download,
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
    growthstudio: {
      title: "What Growth Studio does",
      description: "Growth Studio turns ElementOS into a launch machine: viral content ideas, platform-specific posts, screenshot briefs, onboarding experiments and weekly launch tasks.",
      next: "Pick a channel, copy a post, export the content calendar, then send users into Viral Cards or Beta Launch.",
    },
    dashboard: {
      title: "What this dashboard does",
      description: "This is your command centre. Start a comparison, open the discovery feed, save your workspace, or upgrade to Pro Lab when you are ready to export premium reports.",
      next: "Click Run Compare to test materials, or Discover to browse AI-ranked pairings.",
    },
    discover: {
      title: "What the discovery feed does",
      description: "This page ranks material pairings by compatibility, AI confidence, momentum, views, shares and saves. It is designed to feel like a living research network.",
      next: "Pick a discovery, copy the share card, compare it, or generate a report.",
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
      title: "What Experimental Well Driller does",
      description: "The Experimental Well Driller models a deep subsurface bore path, drilling load, formation pressure, reservoir depth and seismic-readiness using clear visual simulation cards.",
      next: "Adjust depth and formation pressure, inspect the 3D-style well profile, then open Seismo to compare P-wave and S-wave behaviour.",
    },
    seismo: {
      title: "What Seismo does",
      description: "Seismo compares P-wave and S-wave travel through a simulated subsurface field so users can understand arrival gaps, wave speed and depth response.",
      next: "Tune distance, depth and wave speeds, then export the seismic readout or return to Well Driller.",
    },
    lab: {
      title: "What My Lab does",
      description: "My Lab collects saved scenarios, favourite materials, recent simulations and report-ready discovery assets in one workspace-style page.",
      next: "Review saved scenario cards, reopen Scenario Builder or Time Machine, then export your strongest cases.",
    },
    visualization: {
      title: "What Advanced Visualization does",
      description: "The Advanced Visualization Engine turns scenarios, time horizons and material metrics into survival curves, degradation timelines, AI confidence waveforms and cinematic telemetry cards.",
      next: "Pick a material, inspect the survival curve, compare the pulse cards, then export the visual telemetry summary.",
    },
    viralcards: {
      title: "What Viral Card Studio does",
      description: "Viral Card Studio turns discoveries, Time Machine forecasts, Scenario Builder results, Well Driller paths and Seismo readouts into cinematic share cards for social growth.",
      next: "Choose a source, generate a card, export SVG or copy the social post text, then share it with a public report link.",
    },
    simreports: {
      title: "What Universal Simulation Reports do",
      description: "Universal Simulation Reports combine Time Machine, Scenario Builder, Experimental Well Driller and Seismo outputs into one polished research-ready simulation dossier.",
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
      next: "Create an account, sign in, then return to the dashboard.",
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
  const items = [["landing", "Landing", Sparkles], ["beta", "Beta Launch", UserPlus], ["copilot", "AI Copilot", Sparkles], ["growthstudio", "Growth Studio", Network], ["dashboard", "Dashboard", Home], ["discover", "Discover", Sparkles], ["timemachine", "Time Machine", Clock3], ["scenario", "Scenario Builder", FileText], ["welldriller", "Experimental Well Driller", Radar], ["seismo", "Seismo", Network], ["simreports", "Simulation Reports", BookOpen], ["viralcards", "Viral Cards", Sparkles], ["calculations", "Calculation Core", Calculator], ["lab", "My Lab", Save], ["visualization", "Visual Engine", BarChart3], ["login", "Account", Lock], ["explorer", "Explorer", Search], ["periodic", "Periodic Table", Layers], ["compare", "Compare", BarChart3], ["atlas", "Behaviour Atlas", Radar], ["graph", "Behaviour Graph", Network], ["universe", "Similarity Universe", Orbit], ["isotopes", "Isotope Lab", Atom], ["reports", "Reports", BookOpen]];
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-[310px] overflow-y-auto border-r border-cyan-300/15 bg-[#030712]/90 p-5 backdrop-blur-2xl lg:block"><div className="mb-7"><div className="text-2xl font-black tracking-[.22em] text-cyan-100">ElementOS</div><div className="text-[10px] uppercase tracking-[.3em] text-slate-500">material intelligence platform</div></div><div className="space-y-2">{items.map(([id, label, Icon]) => <button key={id} onClick={() => setPage(id)} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${page === id ? "border-cyan-300/30 bg-cyan-400/10 text-white" : "border-white/5 bg-white/[.025] text-slate-300"}`}><span className="flex items-center gap-3"><Icon size={16} className="text-cyan-300"/>{label}</span><ChevronRight size={14}/></button>)}</div></aside>;
}


function Dashboard({ setPage, saveWorkspace, loadWorkspace, session, isPro, startCheckout }) {
  return <><Panel className="grid gap-8 xl:grid-cols-[1.15fr_.85fr]"><div><Pill gold><Sparkles size={12}/> production preview</Pill><h1 className="mt-4 text-5xl font-black sm:text-7xl">ElementOS <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Material Intelligence Platform</span></h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">Explore, compare and publish material behaviour. ElementOS now feels like a subscriber-ready research workspace: accounts, live simulation, visual comparison, graph intelligence and exportable reports.</p><Info title="Positioning upgrade">Public language has been cleaned up. The product now leads with material intelligence, simulation, research reports and workspace value instead of internal prototype wording.</Info></div><Panel><h2 className="text-2xl font-black">Launch Workspace</h2>{[["Create Account", "login", UserPlus], ["Beta Launch", "beta", UserPlus], ["AI Copilot", "copilot", Sparkles], ["Growth Studio", "growthstudio", Network], ["Discover", "discover", Sparkles], ["Time Machine", "timemachine", Clock3], ["Scenario Builder", "scenario", FileText], ["Well Driller", "welldriller", Radar], ["Seismo", "seismo", Network], ["Simulation Reports", "simreports", BookOpen], ["Viral Card Studio", "viralcards", Sparkles], ["Calculation Core", "calculations", Calculator], ["My Lab", "lab", Save], ["Visual Engine", "visualization", BarChart3], ["Run Compare", "compare", BarChart3], ["Open Live Atlas", "atlas", Radar], ["Isotope Lab", "isotopes", Atom], ["Generate Report", "reports", FileText]].map(([label, id, Icon], i) => <Button key={id} onClick={() => setPage(id)} className="mt-3 w-full" variant={i === 1 ? "primary" : "ghost"}><Icon className="inline" size={16}/> {label}</Button>)}{session && <div className="mt-4 grid gap-3"><Button onClick={saveWorkspace} variant="primary" className="w-full"><Save size={16} className="inline"/> Save Workspace</Button><Button onClick={loadWorkspace} className="w-full">Restore Workspace</Button></div>}{!session && <Button onClick={() => setPage("login")} variant="primary" className="mt-4 w-full"><Lock size={16} className="inline"/> Sign in to Upgrade</Button>}{session && !isPro && <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"><div className="mb-3 text-xs font-black uppercase tracking-[.18em] text-amber-100">Billing</div><Button onClick={startCheckout} variant="primary" className="w-full"><Sparkles size={16} className="inline"/> Upgrade to Pro Lab</Button><p className="mt-3 text-xs leading-5 text-amber-100/80">Unlock premium PDF exports and Pro workspace features through Stripe Sandbox.</p></div>}{session && isPro && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 size={16} className="mr-2 inline"/> Pro Lab Active</div>}</Panel></Panel><div className="grid gap-6 xl:grid-cols-4">{[["118", "elements"], ["7", "behaviour metrics"], ["4", "export modes"], ["Live", "simulation layer"]].map(([a,b]) => <Panel key={b}><div className="text-4xl font-black text-cyan-100">{a}</div><div className="mt-1 text-xs uppercase tracking-[.22em] text-slate-500">{b}</div></Panel>)}</div>
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
  const [scenarioText, setScenarioText] = useState("Titanium hull in saltwater for 25 years under high pressure");
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

      <GuidePanel page="login" />

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
      alert("Please sign in before saving reports.");
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
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100">
        <Background />
        <main className="relative z-10 mx-auto max-w-5xl space-y-6 p-6 lg:p-10">
          <Panel>
            <Pill gold><BookOpen size={12}/> public report</Pill>
            <h1 className="mt-4 text-5xl font-black">ElementOS Public Report</h1>
            <p className="mt-4 text-slate-300">{status || "Loading report..."}</p>
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
    <div className="min-h-screen bg-[#020617] text-slate-100">
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
      title: "Titanium hull in saltwater",
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
    const content = `ElementOS My Lab Summary\n\nResearcher: ${profile.email}\nLevel: ${profile.level}\nXP: ${profile.xp}\nSaved scenarios: ${savedScenarios.length}\nFavourite materials: ${favouriteMaterials.join(", ")}\n\nSaved Scenarios:\n${savedScenarios.map((s) => `${s.title} · ${s.material} · Risk ${s.risk}% · Survival ${s.survival} years · ${s.status}`).join("\n")}\n\nRecent Discovery Reports:\n${recentReports.map((r) => `${r.pair} · ${r.score}% · ${r.type}`).join("\n")}\n\nGenerated by ElementOS My Lab`;
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
            My Lab gives users a reason to return. It turns one-off simulations into a persistent research library with saved cases, reusable materials and exportable summaries.
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
    ["Now", "Viral Cards + Universal Simulation Reports", "Turn every discovery into a shareable output."],
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
            <Button onClick={() => setPage("simreports")}>Open Simulation Reports</Button>
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


function LandingPage({ setPage, session, isPro, startCheckout }) {
  const showcases = [
    ["Time Machine", "Simulate how materials age across 1, 10, 50 and 100-year horizons under corrosion, heat, pressure and stress.", Clock3, "timemachine"],
    ["Scenario Builder", "Type real-world material situations and receive risk scores, failure modes, lifespan estimates and substitute suggestions.", FileText, "scenario"],
    ["Visual Engine", "Turn survival curves, degradation timelines and AI confidence signals into cinematic dashboard visuals.", BarChart3, "visualization"],
    ["AI Discovery", "Browse ranked material pairings, rare compatibility signals, velocity trends and discovery cards.", Sparkles, "discover"],
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
          <Pill gold><Sparkles size={12} /> AI material intelligence SaaS</Pill>
          <h1 className="mt-5 text-5xl font-black sm:text-7xl">
            Predict, compare and explain material behaviour with <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">ElementOS</span>
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            ElementOS helps users explore elements, compare material behaviour, simulate future degradation, build real-world scenarios and export research-ready reports from one cinematic workspace.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button onClick={() => setPage("scenario")} variant="primary">Try Scenario Builder</Button>
            <Button onClick={() => setPage("timemachine")}>Open Time Machine</Button>
            {!session ? (
              <Button onClick={() => setPage("login")}>Start Free</Button>
            ) : !isPro ? (
              <Button onClick={startCheckout}>Upgrade Pro</Button>
            ) : (
              <Button onClick={() => setPage("dashboard")}>Enter Workspace</Button>
            )}
          </div>
          <Info title="What is ElementOS?">
            A material intelligence operating system for turning element data, compatibility scores, environmental exposure and long-term simulation into understandable decisions, visuals and reports.
          </Info>
        </div>

        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">Live product demo</div>
          <h2 className="mt-3 text-4xl font-black text-cyan-100">Titanium hull in saltwater</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">Scenario Builder detects material, environment and time horizon, then generates a risk score, survival estimate and recommended substitute path.</p>
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
            <h2 className="mt-3 text-4xl font-black">Built for discovery, simulation and conversion</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Each core page gives visitors a clear reason to sign up: discover materials, simulate long-term behaviour, build scenarios and save results inside My Lab.</p>
          </div>
          <Button onClick={() => setPage("dashboard")} variant="primary">Launch Workspace</Button>
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
            <h2 className="mt-3 text-4xl font-black">From curiosity to saved research</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">The conversion path is simple: visitors try public demos, create an account to save work, then upgrade when they need reports, exports and persistent research history.</p>
            <div className="mt-5 space-y-3">
              {["Understand materials faster", "Create scenario reports", "Save discoveries in My Lab", "Export professional PDFs", "Use Time Machine and visual telemetry"].map((item) => (
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
                <Button onClick={index === 1 ? startCheckout : () => setPage("login")} variant={index === 1 ? "primary" : "ghost"} className="mt-5 w-full">
                  {index === 1 ? "Upgrade Pro" : "Start"}
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
            ["Why create an account?", "Accounts unlock saved workspaces, My Lab history, scenario collections and subscription-ready research continuity."],
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
    `ElementOS Experimental Well Driller Report\n\nFormation: ${formation}\nDepth: ${depth} m\nInclination: ${inclination} deg\nFormation pressure: ${pressure}%\nDrill RPM: ${rpm}\nMud balance: ${mud}%\nTorque index: ${torque}\nReservoir score: ${reservoirScore}%\nBore stability: ${boreStability}%\nKick risk: ${kickRisk}%\nRate of penetration: ${rateOfPenetration} m/hr\nCasing load: ${casingLoad}%`
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
    ["Experimental Well Driller", `${100 - drillingRisk}%`, "Subsurface drilling readiness from pressure, depth and formation response."],
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
            Combine Time Machine, Scenario Builder, Experimental Well Driller and Seismo into one polished research-ready dossier. This turns ElementOS simulations into outputs users can save, share and present.
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
            {!isPro ? <Button onClick={session ? startCheckout : () => setPage("login")}>Unlock Pro PDF</Button> : <Button onClick={() => setPage("reports")}>Open Reports</Button>}
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
          ["Open Seismo", "seismo", "Compare P-wave and S-wave response."],
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
    ["Report", "Create Simulation Report", "simreports", "Bundle Time Machine, Scenario, Well Driller and Seismo outputs into a dossier."],
    ["Share", "Create Viral Card", "viralcards", "Turn this insight into a cinematic social asset for growth."],
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


function GrowthStudio({ setPage }) {
  const [channel, setChannel] = useState("TikTok");
  const [focus, setFocus] = useState("Time Machine");
  const [audience, setAudience] = useState("curious engineers, AI explorers and materials nerds");

  const channelPlans = {
    TikTok: {
      hook: "What happens to Titanium after 100 years under pressure?",
      format: "9–18 second vertical clip with a fast zoom into the simulation result.",
      cta: "Comment a material pair and I’ll simulate it next.",
    },
    X: {
      hook: "I built an AI-native material simulation lab called ElementOS.",
      format: "4-tweet thread with one screenshot, one result card and one public report link.",
      cta: "Reply with a material scenario and I’ll run it through the engine.",
    },
    Reddit: {
      hook: "I’m building an exploratory materials simulation platform and looking for brutal feedback.",
      format: "Transparent builder post: what it does, what is experimental, what feedback is needed.",
      cta: "What page would you test first: Time Machine, Seismo, or Well Driller?",
    },
    LinkedIn: {
      hook: "ElementOS turns material comparison into a visual simulation workflow.",
      format: "Professional product update with use cases, screenshots and beta invitation.",
      cta: "DM me if you want beta access or want to test a materials scenario.",
    },
  };

  const plan = channelPlans[channel] || channelPlans.TikTok;
  const contentPack = [
    `Channel: ${channel}`,
    `Feature focus: ${focus}`,
    `Audience: ${audience}`,
    `Hook: ${plan.hook}`,
    `Format: ${plan.format}`,
    `CTA: ${plan.cta}`,
    "",
    "7-Day Launch Sprint:",
    "Day 1: Post Time Machine screenshot + founder story.",
    "Day 2: Post Seismo P/S wave simulator clip.",
    "Day 3: Post Well Driller 3D depth card.",
    "Day 4: Post Viral Discovery Card example.",
    "Day 5: Ask users to comment scenarios to simulate.",
    "Day 6: Publish top 3 user-requested results.",
    "Day 7: Invite Founding Researchers into beta.",
  ].join("\n");

  const socialPost =
    channel === "TikTok"
      ? `${plan.hook}\n\nI’m building ElementOS — an AI-native simulation lab for material behaviour, time forecasts, seismic waves and subsurface experiments.\n\n${plan.cta}`
      : channel === "Reddit"
      ? `${plan.hook}\n\nElementOS currently includes Time Machine, Scenario Builder, Seismo, Experimental Well Driller, Viral Cards and universal simulation reports. It is exploratory rather than certified engineering software, and I’m trying to make the UX genuinely useful.\n\n${plan.cta}`
      : `${plan.hook}\n\nToday’s focus: ${focus}. ElementOS turns complex simulation ideas into visual cards, reports and shareable research workflows.\n\n${plan.cta}`;

  const contentIdeas = [
    ["Time Machine clip", "Show one material degrading across 1, 10, 50 and 100 years."],
    ["Seismo split-screen", "P-wave beats S-wave, then show the arrival gap as the hook."],
    ["Well Driller depth reveal", "Animate down through strata and end on a reservoir target."],
    ["Viral card challenge", "Ask followers to suggest the weirdest material pair."],
    ["Founder build log", "Show the product evolving and ask for beta testers."],
    ["Report export flex", "Generate a polished simulation dossier from one scenario."],
  ];

  return (
    <>
      <Panel className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <Pill gold><Network size={12}/> growth engine</Pill>
          <h1 className="mt-4 text-5xl font-black sm:text-7xl">
            Growth Studio <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Launch Command Center</span>
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Turn ElementOS pages into content, screenshots, beta invites and share loops. This is the place to plan TikTok/X/Reddit/LinkedIn clips that send users into Viral Cards, reports and beta signup.
          </p>
          <Info title="Why this matters">
            Users do not share dashboards; they share moments. Growth Studio converts Time Machine, Seismo, Well Driller and Viral Cards into repeatable social hooks.
          </Info>
        </div>
        <Panel>
          <div className="text-xs uppercase tracking-[.22em] text-slate-500">launch score</div>
          <div className="mt-3 text-7xl font-black text-emerald-200">92%</div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Strong because your product already has screenshotable pages, exportable reports, a beta path and viral cards. Next multiplier: consistent clips and public report links.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button onClick={() => setPage("viralcards")} variant="primary">Create Viral Card</Button>
            <Button onClick={() => setPage("beta")}>Open Beta Launch</Button>
          </div>
        </Panel>
      </Panel>

      <GuidePanel page="growthstudio" />

      <Panel>
        <div className="grid gap-5 xl:grid-cols-4">
          <label className="space-y-2">
            <div className="text-xs uppercase tracking-[.2em] text-slate-500">Channel</div>
            <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
              {Object.keys(channelPlans).map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="space-y-2">
            <div className="text-xs uppercase tracking-[.2em] text-slate-500">Feature focus</div>
            <select value={focus} onChange={(e) => setFocus(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none">
              {["Time Machine", "Seismo", "Experimental Well Driller", "Viral Cards", "Scenario Builder", "Simulation Reports"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="space-y-2 xl:col-span-2">
            <div className="text-xs uppercase tracking-[.2em] text-slate-500">Audience</div>
            <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950 p-3 outline-none" />
          </label>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
            <div className="text-xs uppercase tracking-[.22em] text-cyan-200">Recommended hook</div>
            <div className="mt-3 text-3xl font-black text-cyan-100">{plan.hook}</div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{plan.format}</p>
            <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100"><b>CTA:</b> {plan.cta}</div>
          </div>
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
            <div className="text-xs uppercase tracking-[.22em] text-amber-100">Copy-ready post</div>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-100">{socialPost}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => navigator.clipboard.writeText(socialPost)} variant="primary">Copy Post</Button>
              <Button onClick={() => downloadFile("elementos-growth-plan.txt", contentPack)}>Export Growth Plan</Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Pill><Sparkles size={12}/> screenshot strategy</Pill>
            <h2 className="mt-3 text-4xl font-black">What Users Should Screenshot</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Each item below is designed to create curiosity and send people into a shareable report, card or beta signup.</p>
          </div>
          <Button onClick={() => setPage("simreports")} variant="primary">Generate Report</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contentIdeas.map(([title, desc], index) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
              <div className="text-xs uppercase tracking-[.2em] text-slate-500">content idea #{index + 1}</div>
              <div className="mt-3 text-2xl font-black text-cyan-100">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/40"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${72 + index * 4}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-5 xl:grid-cols-3">
          {[
            ["Traffic loop", "Post clip → viewer comments scenario → you simulate → export card → viewer shares."],
            ["Conversion loop", "Viral card → public report → beta badge → account → paid exports."],
            ["Retention loop", "Daily discovery → saved lab → leaderboard → weekly report challenge."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-5">
              <div className="text-xl font-black text-emerald-100">{title}</div>
              <p className="mt-3 text-sm leading-6 text-emerald-50/90">{desc}</p>
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
    ["growthstudio", "Growth", Network],
    ["dashboard", "Home", Home],
    ["discover", "Discover", Sparkles],
    ["timemachine", "Time", Clock3],
    ["scenario", "Scenario", FileText],
    ["lab", "Lab", Save],
    ["visualization", "Visual", BarChart3],
    ["welldriller", "Well", Radar],
    ["seismo", "Seismo", Network],
    ["simreports", "Reports+", BookOpen],
    ["viralcards", "Cards", Sparkles],
    ["calculations", "Calc", Calculator],
    ["explorer", "Explore", Search],
    ["compare", "Compare", BarChart3],
    ["reports", "Reports", BookOpen],
    ["login", "Account", Lock],
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
  if (page === "login" || page === "landing") return null;

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
              <Button onClick={() => setPage("login")} variant="primary" className="px-3 py-2 text-xs">
                Sign In
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

export default function App() {
  const [page, setPage] = useState("landing");
  const [selected, setSelected] = useState("Al");
  const [compare, setCompare] = useState(["Al", "Fe", "Cu", "Ti"]);
  const [session, setSession] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [publicReportRequested, setPublicReportRequested] = useState(false);
  const [publicReport, setPublicReport] = useState(null);
  const [publicReportStatus, setPublicReportStatus] = useState("");

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
          setPublicReportStatus("Public report not found.");
          return;
        }

        setPublicReport(data);
        setPublicReportStatus("");
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
      landing: <LandingPage setPage={setPage} session={session} isPro={isPro} startCheckout={startCheckout} />,
      beta: <BetaLaunch session={session} setPage={setPage} startCheckout={startCheckout} />,
      copilot: <AICopilotCommandCenter selected={selected} compare={compare} setSelected={setSelected} setCompare={setCompare} setPage={setPage} />,
      growthstudio: <GrowthStudio setPage={setPage} />,
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
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <Background />
      <Sidebar page={page} setPage={setPage} />

      <main className="relative z-10 space-y-6 p-4 pb-40 lg:ml-[310px] lg:p-8 lg:pb-8">
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

        <PageHelpStrip page={page} />
        {pages[page] || pages.dashboard}
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
