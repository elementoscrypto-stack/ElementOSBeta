import React, { useMemo, useState } from "react";

const rawElements = `H|Hydrogen|1|Nonmetal,He|Helium|2|Noble gas,Li|Lithium|3|Alkali metal,Be|Beryllium|4|Alkaline earth metal,B|Boron|5|Metalloid,C|Carbon|6|Nonmetal,N|Nitrogen|7|Nonmetal,O|Oxygen|8|Nonmetal,F|Fluorine|9|Halogen,Ne|Neon|10|Noble gas,Na|Sodium|11|Alkali metal,Mg|Magnesium|12|Alkaline earth metal,Al|Aluminium|13|Post-transition metal,Si|Silicon|14|Metalloid,P|Phosphorus|15|Nonmetal,S|Sulfur|16|Nonmetal,Cl|Chlorine|17|Halogen,Ar|Argon|18|Noble gas,K|Potassium|19|Alkali metal,Ca|Calcium|20|Alkaline earth metal,Sc|Scandium|21|Transition metal,Ti|Titanium|22|Transition metal,V|Vanadium|23|Transition metal,Cr|Chromium|24|Transition metal,Mn|Manganese|25|Transition metal,Fe|Iron|26|Transition metal,Co|Cobalt|27|Transition metal,Ni|Nickel|28|Transition metal,Cu|Copper|29|Transition metal,Zn|Zinc|30|Transition metal,Ga|Gallium|31|Post-transition metal,Ge|Germanium|32|Metalloid,As|Arsenic|33|Metalloid,Se|Selenium|34|Nonmetal,Br|Bromine|35|Halogen,Kr|Krypton|36|Noble gas,Rb|Rubidium|37|Alkali metal,Sr|Strontium|38|Alkaline earth metal,Y|Yttrium|39|Transition metal,Zr|Zirconium|40|Transition metal,Nb|Niobium|41|Transition metal,Mo|Molybdenum|42|Transition metal,Tc|Technetium|43|Transition metal,Ru|Ruthenium|44|Transition metal,Rh|Rhodium|45|Transition metal,Pd|Palladium|46|Transition metal,Ag|Silver|47|Transition metal,Cd|Cadmium|48|Post-transition metal,In|Indium|49|Post-transition metal,Sn|Tin|50|Post-transition metal,Sb|Antimony|51|Metalloid,Te|Tellurium|52|Metalloid,I|Iodine|53|Halogen,Xe|Xenon|54|Noble gas,Cs|Caesium|55|Alkali metal,Ba|Barium|56|Alkaline earth metal,La|Lanthanum|57|Lanthanide,Ce|Cerium|58|Lanthanide,Nd|Neodymium|60|Lanthanide,Hf|Hafnium|72|Transition metal,Ta|Tantalum|73|Transition metal,W|Tungsten|74|Transition metal,Pt|Platinum|78|Transition metal,Au|Gold|79|Transition metal,Pb|Lead|82|Post-transition metal,U|Uranium|92|Actinide`;

const elements = rawElements.split(",").map((row) => {
  const [symbol, name, atomicNumber, category] = row.split("|");
  return { symbol, name, atomicNumber: Number(atomicNumber), category };
});
const elementMap = Object.fromEntries(elements.map((e) => [e.symbol, e]));
const metrics = ["stability", "conductivity", "thermal", "diffusion", "pressure", "rarity", "alignment"];

function clamp(v, min = 0.35, max = 5) {
  return Math.max(min, Math.min(max, v));
}

function score(sym) {
  const e = elementMap[sym] || elementMap.Al;
  const n = e.atomicNumber;
  const metal = e.category.toLowerCase().includes("metal") || ["Lanthanide", "Actinide"].includes(e.category);
  const noble = e.category === "Noble gas";
  const heavy = n > 80;
  return {
    stability: clamp((noble ? 4.7 : metal ? 3.7 : 2.55) + ((n % 7) - 3) * 0.09 - (heavy ? 0.35 : 0)),
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

function tier(v) {
  if (v >= 95) return "LEGENDARY";
  if (v >= 88) return "ULTRA RARE";
  if (v >= 78) return "RARE";
  if (v >= 65) return "UNCOMMON";
  return "COMMON";
}

function materialDNA(a, b) {
  return `${a}-${b}-${Math.abs(a.charCodeAt(0) * 7 + b.charCodeAt(0) * 13).toString(16).toUpperCase()}`;
}

function downloadFile(name, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function discoveries(limit = 12) {
  const out = [];
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const a = elements[i];
      const b = elements[j];
      const s = compatibilityScore(a.symbol, b.symbol);
      const seed = a.atomicNumber * 13 + b.atomicNumber * 17;
      out.push({
        a: a.symbol,
        b: b.symbol,
        aName: a.name,
        bName: b.name,
        score: Math.min(99, Math.max(1, s + (seed % 8) - 3)),
        ai: Math.min(99, Math.max(72, s + (seed % 11))),
        velocity: 8 + (seed % 61),
        views: 420 + (seed % 4200),
        shares: 22 + (seed % 650),
        dna: materialDNA(a.symbol, b.symbol),
      });
    }
  }
  return out.sort((x, y) => y.score + y.velocity - (x.score + x.velocity)).slice(0, limit);
}

function Panel({ children, className = "" }) {
  return <section className={`panel ${className}`}>{children}</section>;
}
function Pill({ children }) {
  return <span className="pill">{children}</span>;
}
function Button({ children, onClick, className = "", primary = false }) {
  return <button onClick={onClick} className={`btn ${primary ? "primary" : ""} ${className}`}>{children}</button>;
}
function Stat({ value, label }) {
  return <div className="stat"><b>{value}</b><span>{label}</span></div>;
}

function MiniChart({ values = [40, 68, 55, 82, 71] }) {
  return <div className="miniChart">{values.map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</div>;
}

function LineGraph({ values = [92, 88, 79, 67, 54], label = "survival curve" }) {
  const w = 360;
  const h = 140;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / 100) * h}`).join(" ");
  return <div className="graph3d"><svg viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><polyline points={pts} fill="none" stroke="white" strokeOpacity=".22" strokeWidth="12" strokeLinecap="round"/></svg><span>{label}</span></div>;
}

function WaveGraph({ pSpeed, sSpeed, distance }) {
  const pTime = distance / pSpeed;
  const sTime = distance / sSpeed;
  return <div className="waveBox"><div className="wave p"><span style={{ width: `${Math.min(96, pSpeed * 13)}%` }} /></div><div className="wave s"><span style={{ width: `${Math.min(96, sSpeed * 17)}%` }} /></div><div className="waveLegend"><b>P arrival: {pTime.toFixed(1)}s</b><b>S arrival: {sTime.toFixed(1)}s</b><b>Gap: {(sTime - pTime).toFixed(1)}s</b></div></div>;
}

function Landing({ setPage }) {
  return <>
    <Panel className="hero">
      <Pill>AI-native material intelligence</Pill>
      <h1>ElementOS turns materials into simulations, scenarios and future-state intelligence.</h1>
      <p>Explore elements, compare behaviour, simulate ageing, drill virtual wells, model seismic waves and export research-ready results.</p>
      <div className="actions"><Button primary onClick={() => setPage("dashboard")}>Launch Workspace</Button><Button onClick={() => setPage("scenario")}>Try Scenario Builder</Button><Button onClick={() => setPage("well")}>Open Well Driller</Button></div>
    </Panel>
    <div className="grid4">
      <Stat value="118" label="elements"/><Stat value="AI" label="discovery engine"/><Stat value="3D" label="well + seismo visuals"/><Stat value="Pro" label="report workflow"/>
    </div>
    <Panel><h2>What you can do</h2><div className="cards4">{[
      ["Time Machine", "Project material ageing across long horizons."],
      ["Scenario Builder", "Turn plain-English situations into risk, lifespan and substitute insights."],
      ["Well Driller", "Model depth, strata, pressure, heat and reservoir confidence."],
      ["Seismo", "Compare P-wave and S-wave travel times through the Earth."],
    ].map(([a,b]) => <div className="card" key={a}><h3>{a}</h3><p>{b}</p></div>)}</div></Panel>
  </>;
}

function Dashboard({ setPage }) {
  return <>
    <Panel className="hero small"><Pill>workspace</Pill><h1>ElementOS Command Centre</h1><p>Start from discovery, scenarios, calculations, wells or seismic simulation.</p></Panel>
    <div className="grid3">{[
      ["Discover", "AI-ranked material pairings", "discover"],
      ["Scenario Builder", "Risk and lifespan from plain English", "scenario"],
      ["Experimental Well Driller", "3D subsurface drilling intelligence", "well"],
      ["Seismo", "P-wave / S-wave simulator", "seismo"],
      ["Calculation Core", "Premium engineering calculation page", "calculations"],
      ["Visual Engine", "Survival curves and telemetry", "visualization"],
    ].map(([a,b,p]) => <Panel key={a}><h2>{a}</h2><p>{b}</p><Button primary onClick={() => setPage(p)}>Open</Button></Panel>)}</div>
  </>;
}

function Discover({ setPage }) {
  const data = useMemo(() => discoveries(12), []);
  return <>
    <Panel className="hero small"><Pill>adaptive discovery</Pill><h1>Discovery Feed</h1><p>AI-ranked material pairings with confidence, velocity and share metrics.</p></Panel>
    <div className="cards3">{data.map(d => <Panel key={d.dna} className="discovery"><Pill>{tier(d.score)}</Pill><h2>{d.a} + {d.b}</h2><b className="score">{d.score}%</b><p>{d.aName} + {d.bName} has a strong behavioural compatibility signal.</p><div className="row"><span>AI {d.ai}%</span><span>+{d.velocity}% velocity</span><span>{d.shares} shares</span></div><Button onClick={() => setPage("compare")}>Compare</Button></Panel>)}</div>
  </>;
}

function Explorer({ selected, setSelected, setPage }) {
  const [q, setQ] = useState("");
  const filtered = elements.filter(e => `${e.symbol} ${e.name} ${e.category}`.toLowerCase().includes(q.toLowerCase()));
  const s = score(selected);
  return <><Panel><h1>Element Explorer</h1><p>Search any element, inspect behaviour, then send it into Compare or Time Machine.</p><input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search elements..."/></Panel><div className="split"><Panel><div className="list">{filtered.map(e => <button key={e.symbol} onClick={() => setSelected(e.symbol)} className={selected===e.symbol ? "active" : ""}><b>{e.symbol}</b> {e.name}<small>{e.category}</small></button>)}</div></Panel><Panel><h1>{selected}</h1><h2>{elementMap[selected]?.name}</h2><div className="metrics">{metrics.map(k => <Stat key={k} value={k==="alignment" ? s[k].toFixed(0) : s[k].toFixed(2)} label={k}/>)}</div><Button primary onClick={() => setPage("compare")}>Compare {selected}</Button></Panel></div></>;
}

function Compare({ selected }) {
  const [a, setA] = useState(selected || "Al");
  const [b, setB] = useState("Ti");
  const s = compatibilityScore(a,b);
  return <><Panel className="hero small"><Pill>compare engine</Pill><h1>{a} + {b}</h1><p>Compare material behaviour across stability, conductivity, thermal response, diffusion, pressure, rarity and alignment.</p></Panel><Panel><div className="toolbar"><select value={a} onChange={e=>setA(e.target.value)}>{elements.map(e=><option key={e.symbol}>{e.symbol}</option>)}</select><select value={b} onChange={e=>setB(e.target.value)}>{elements.map(e=><option key={e.symbol}>{e.symbol}</option>)}</select></div><div className="resultBig"><b>{s}%</b><span>{tier(s)} compatibility</span><small>{materialDNA(a,b)}</small></div><div className="grid2"><Panel><h2>{a} metrics</h2><MiniChart values={Object.values(score(a)).slice(0,6).map(v=>v*18)}/></Panel><Panel><h2>{b} metrics</h2><MiniChart values={Object.values(score(b)).slice(0,6).map(v=>v*18)}/></Panel></div></Panel></>;
}

function TimeMachine({ selected }) {
  const [mat, setMat] = useState(selected || "Ti");
  const [env, setEnv] = useState("Coastal air");
  const [stress, setStress] = useState(55);
  const s = score(mat);
  const load = env === "Coastal air" ? 1.3 : env === "Industrial heat" ? 1.6 : env === "Space exposure" ? 1.1 : 0.7;
  const base = Math.round(s.stability*15 + s.pressure*8 + s.thermal*6 - stress*.12 - load*8);
  const vals = [0,1,10,50,100].map(y => Math.max(4, Math.min(99, Math.round(base - Math.log10(y+1)*load*24))));
  return <><Panel className="hero small"><Pill>temporal material intelligence</Pill><h1>Time Machine</h1><p>Simulate future-state material survival across 1, 10, 50 and 100 years.</p></Panel><Panel><div className="toolbar"><select value={mat} onChange={e=>setMat(e.target.value)}>{elements.map(e=><option key={e.symbol}>{e.symbol}</option>)}</select><select value={env} onChange={e=>setEnv(e.target.value)}>{["Lab storage","Coastal air","Industrial heat","High pressure","Space exposure"].map(x=><option key={x}>{x}</option>)}</select><label>Stress {stress}<input type="range" min="0" max="100" value={stress} onChange={e=>setStress(+e.target.value)}/></label></div><LineGraph values={vals} label={`${mat} survival over time`} /><div className="cards5">{[0,1,10,50,100].map((y,i)=><Stat key={y} value={`${vals[i]}%`} label={`year ${y}`}/>)}</div></Panel></>;
}

function ScenarioBuilder({ selected, setPage }) {
  const [text, setText] = useState("Titanium hull in saltwater for 25 years under high pressure");
  const norm = text.toLowerCase();
  const mat = elements.find(e => norm.includes(e.name.toLowerCase()) || norm.includes(e.symbol.toLowerCase()))?.symbol || selected || "Ti";
  const years = Number(norm.match(/(\d+)\s*(year|years|yr|yrs)/)?.[1] || 25);
  const envRisk = norm.includes("salt") || norm.includes("ocean") ? 1.45 : norm.includes("heat") ? 1.35 : norm.includes("pressure") ? 1.25 : 0.8;
  const sc = score(mat);
  const risk = Math.max(4, Math.min(96, Math.round(44 + envRisk*14 + Math.log10(years+1)*16 - sc.stability*6)));
  const survival = Math.max(2, Math.round((sc.stability*sc.pressure*sc.thermal*22) / (risk/10)));
  const failure = Math.min(99, Math.round(risk*.74 + years*envRisk*.2));
  return <><Panel className="hero small"><Pill>scenario builder</Pill><h1>AI Scenario Builder</h1><p>Type a real-world material situation. ElementOS estimates risk, lifespan and failure mode.</p></Panel><Panel><textarea className="textarea" value={text} onChange={e=>setText(e.target.value)} /><div className="grid4"><Stat value={mat} label="detected material"/><Stat value={`${risk}%`} label="risk score"/><Stat value={`${survival} yrs`} label="survival estimate"/><Stat value={`${failure}%`} label="failure probability"/></div><LineGraph values={[100, 100-risk*.25, 100-risk*.45, 100-risk*.7, 100-risk*.9]} label="scenario integrity curve"/><div className="actions"><Button primary onClick={()=>setPage("timemachine")}>Send to Time Machine</Button><Button onClick={()=>downloadFile("scenario-report.txt", `ElementOS Scenario Report\n\n${text}\nMaterial: ${mat}\nRisk: ${risk}%\nSurvival: ${survival} years\nFailure probability: ${failure}%`)}>Export Report</Button></div></Panel></>;
}

function MyLab({ setPage }) {
  const saved = ["Titanium hull in saltwater", "Copper under industrial heat", "Aluminium in coastal air", "Seismic drill zone model"];
  return <><Panel className="hero small"><Pill>workspace memory</Pill><h1>My Lab</h1><p>Saved scenarios, reports, favourites and recent simulations.</p></Panel><div className="cards2">{saved.map((s,i)=><Panel key={s}><h2>{s}</h2><p>Saved case #{i+1}. Reopen in Scenario Builder or export as a report.</p><Button primary onClick={()=>setPage("scenario")}>Open</Button></Panel>)}</div></>;
}

function VisualEngine({ selected }) {
  const vals = [96, 88, 74, 61, 49];
  return <><Panel className="hero small"><Pill>advanced visuals</Pill><h1>Visual Engine</h1><p>Cinematic telemetry cards, survival curves and AI pulse visualizations.</p></Panel><div className="grid2"><Panel><h2>Survival Curve</h2><LineGraph values={vals} /></Panel><Panel><h2>AI Pulse</h2><div className="pulseOrb"><span>{selected}</span></div></Panel></div><Panel><h2>Telemetry Surface</h2><div className="surface3d">{Array.from({length: 24}).map((_,i)=><i key={i} style={{height:`${20+(i*17)%90}%`}}/> )}</div></Panel></>;
}

function CalculationCore() {
  const [mass,setMass]=useState(100);
  const [density,setDensity]=useState(7.85);
  const [pressure,setPressure]=useState(120);
  const [area,setArea]=useState(4);
  const volume = mass / density;
  const force = pressure * area;
  const energy = 0.5 * mass * Math.pow(pressure/100,2);
  return <><Panel className="hero small"><Pill>calculation core</Pill><h1>Calculation Core</h1><p>A premium engineering calculation cockpit for density, volume, force, pressure and telemetry-style output.</p></Panel><Panel><div className="grid4 inputs"><label>Mass<input type="number" value={mass} onChange={e=>setMass(+e.target.value)}/></label><label>Density<input type="number" value={density} onChange={e=>setDensity(+e.target.value)}/></label><label>Pressure<input type="number" value={pressure} onChange={e=>setPressure(+e.target.value)}/></label><label>Area<input type="number" value={area} onChange={e=>setArea(+e.target.value)}/></label></div><div className="grid3"><Stat value={volume.toFixed(2)} label="volume"/><Stat value={force.toFixed(2)} label="force"/><Stat value={energy.toFixed(2)} label="energy index"/></div><LineGraph values={[mass%100, density*10, pressure%100, area*15, energy%100]} label="calculation telemetry"/><Button primary onClick={()=>downloadFile("calculation-report.txt", `ElementOS Calculation Report\nMass ${mass}\nDensity ${density}\nVolume ${volume}\nPressure ${pressure}\nArea ${area}\nForce ${force}\nEnergy ${energy}`)}>Export Calculation Report</Button></Panel></>;
}

function WellDriller({ setPage }) {
  const [depth,setDepth]=useState(3200);
  const [pressure,setPressure]=useState(66);
  const [heat,setHeat]=useState(72);
  const reservoir = Math.max(8, Math.min(97, Math.round(depth/55 + pressure*.28 - heat*.12)));
  const risk = Math.max(3, Math.min(96, Math.round(pressure*.5 + heat*.35 + depth/180)));
  return <><Panel className="hero small"><Pill>experimental geosystem</Pill><h1>Experimental Well Driller</h1><p>3D-style drilling scene with depth, strata, pressure, heat and reservoir confidence.</p></Panel><div className="split"><Panel><div className="toolbar vertical"><label>Depth {depth}m<input type="range" min="500" max="8000" value={depth} onChange={e=>setDepth(+e.target.value)}/></label><label>Pressure {pressure}<input type="range" min="0" max="100" value={pressure} onChange={e=>setPressure(+e.target.value)}/></label><label>Heat {heat}<input type="range" min="0" max="100" value={heat} onChange={e=>setHeat(+e.target.value)}/></label></div><div className="grid2"><Stat value={`${reservoir}%`} label="reservoir confidence"/><Stat value={`${risk}%`} label="drill risk"/></div><Button primary onClick={()=>setPage("seismo")}>Open Seismo</Button></Panel><Panel><div className="well3d"><div className="strata s1"></div><div className="strata s2"></div><div className="strata s3"></div><div className="bore" style={{height:`${Math.min(92,depth/85)}%`}}></div><div className="bit"></div><div className="reservoir"></div></div></Panel></div></>;
}

function Seismo({ setPage }) {
  const [distance,setDistance]=useState(360);
  const [p,setP]=useState(6.2);
  const [s,setS]=useState(3.6);
  const gap = distance/s - distance/p;
  return <><Panel className="hero small"><Pill>seismic simulator</Pill><h1>Seismo</h1><p>P-wave and S-wave simulator for travel time, arrival gap and 3D-style seismic wavefields.</p></Panel><div className="split"><Panel><div className="toolbar vertical"><label>Distance {distance} km<input type="range" min="50" max="1200" value={distance} onChange={e=>setDistance(+e.target.value)}/></label><label>P-wave speed {p} km/s<input type="range" min="4" max="9" step="0.1" value={p} onChange={e=>setP(+e.target.value)}/></label><label>S-wave speed {s} km/s<input type="range" min="2" max="6" step="0.1" value={s} onChange={e=>setS(+e.target.value)}/></label></div><WaveGraph pSpeed={p} sSpeed={s} distance={distance}/><div className="grid3"><Stat value={`${(distance/p).toFixed(1)}s`} label="P arrival"/><Stat value={`${(distance/s).toFixed(1)}s`} label="S arrival"/><Stat value={`${gap.toFixed(1)}s`} label="arrival gap"/></div><Button primary onClick={()=>setPage("well")}>Back to Well Driller</Button></Panel><Panel><div className="seismo3d"><div className="core"></div><div className="ring r1"></div><div className="ring r2"></div><div className="ring r3"></div><div className="wavePlane pplane">P</div><div className="wavePlane splane">S</div></div></Panel></div></>;
}

function Reports() {
  return <><Panel className="hero small"><Pill>reports</Pill><h1>Reports</h1><p>Export simulation summaries and report-ready analysis.</p></Panel><Panel><h2>Generate Summary</h2><p>Create a simple text report from your current ElementOS session.</p><Button primary onClick={()=>downloadFile("elementos-report.txt", "ElementOS Research Report\n\nGenerated from the stable full-working App.jsx build.")}>Export Report</Button></Panel></>;
}

function Account() {
  const [email,setEmail]=useState("paulresearcher@elementos.ai");
  return <><Panel className="hero small"><Pill>account</Pill><h1>Account</h1><p>Stable demo account panel. Reconnect Supabase/Stripe only after the UI stays stable.</p></Panel><Panel><input className="input" value={email} onChange={e=>setEmail(e.target.value)}/><div className="resultBig"><b>Pro Lab</b><span>{email}</span><small>Demo account active</small></div></Panel></>;
}

function Periodic() {
  return <><Panel className="hero small"><Pill>periodic map</Pill><h1>Periodic Table</h1><p>Compact working element map.</p></Panel><div className="periodic">{elements.map(e=><div key={e.symbol}><b>{e.symbol}</b><small>{e.atomicNumber}</small></div>)}</div></>;
}
function SimplePage({ title, text }) { return <><Panel className="hero small"><Pill>ElementOS</Pill><h1>{title}</h1><p>{text}</p></Panel><Panel><MiniChart/><p>This page is stable and ready for deeper rebuild once core routing is safe.</p></Panel></>; }

const nav = [
  ["landing","Landing"],["dashboard","Dashboard"],["discover","Discover"],["scenario","Scenario Builder"],["timemachine","Time Machine"],["well","Well Driller"],["seismo","Seismo"],["calculations","Calculation Core"],["visualization","Visual Engine"],["lab","My Lab"],["explorer","Explorer"],["periodic","Periodic"],["compare","Compare"],["reports","Reports"],["account","Account"]
];

function App() {
  const [page,setPage] = useState("landing");
  const [selected,setSelected] = useState("Al");
  const render = () => {
    switch(page){
      case "landing": return <Landing setPage={setPage}/>;
      case "dashboard": return <Dashboard setPage={setPage}/>;
      case "discover": return <Discover setPage={setPage}/>;
      case "scenario": return <ScenarioBuilder selected={selected} setPage={setPage}/>;
      case "timemachine": return <TimeMachine selected={selected}/>;
      case "well": return <WellDriller setPage={setPage}/>;
      case "seismo": return <Seismo setPage={setPage}/>;
      case "calculations": return <CalculationCore/>;
      case "visualization": return <VisualEngine selected={selected}/>;
      case "lab": return <MyLab setPage={setPage}/>;
      case "explorer": return <Explorer selected={selected} setSelected={setSelected} setPage={setPage}/>;
      case "periodic": return <Periodic/>;
      case "compare": return <Compare selected={selected}/>;
      case "reports": return <Reports/>;
      case "account": return <Account/>;
      default: return <Dashboard setPage={setPage}/>;
    }
  };
  return <div className="app"><Style/><aside><h2>ElementOS</h2><p>stable full build</p>{nav.map(([id,label])=><button key={id} className={page===id?"on":""} onClick={()=>setPage(id)}>{label}</button>)}</aside><main>{render()}</main><div className="mobileNav">{nav.slice(0,8).map(([id,label])=><button key={id} className={page===id?"on":""} onClick={()=>setPage(id)}>{label.split(" ")[0]}</button>)}</div></div>;
}

function Style(){return <style>{`
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#020617;color:#e5faff;font-family:Inter,ui-sans-serif,system-ui,Segoe UI,Arial,sans-serif}.app{min-height:100vh;background:radial-gradient(circle at 20% 0%,rgba(34,211,238,.22),transparent 30%),radial-gradient(circle at 85% 15%,rgba(168,85,247,.18),transparent 30%),#020617}aside{position:fixed;left:0;top:0;bottom:0;width:290px;padding:22px;border-right:1px solid rgba(103,232,249,.16);background:rgba(2,6,23,.9);backdrop-filter:blur(18px);overflow:auto}aside h2{margin:0;color:#a5f3fc;letter-spacing:.16em;text-transform:uppercase}aside p{color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.2em}aside button{display:block;width:100%;margin:8px 0;padding:13px 14px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:#dff;cursor:pointer;text-align:left;font-weight:800}aside button.on,aside button:hover{background:rgba(34,211,238,.16);border-color:rgba(103,232,249,.35);color:#fff}main{margin-left:290px;padding:28px;display:grid;gap:22px}.panel{border:1px solid rgba(103,232,249,.16);background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(255,255,255,.035));border-radius:32px;padding:24px;box-shadow:0 0 70px rgba(34,211,238,.10),inset 0 1px 0 rgba(255,255,255,.08);overflow:hidden}.hero{padding:38px;min-height:300px;display:flex;flex-direction:column;justify-content:center;background:radial-gradient(circle at top right,rgba(250,204,21,.15),transparent 28%),radial-gradient(circle at bottom left,rgba(34,211,238,.22),transparent 36%),rgba(255,255,255,.06)}.hero.small{min-height:210px}.hero h1{font-size:clamp(38px,6vw,86px);line-height:.95;margin:18px 0;background:linear-gradient(90deg,#a5f3fc,#fff,#fde68a);-webkit-background-clip:text;color:transparent}.hero p,p{color:#b6c8d6;line-height:1.7}.pill{display:inline-flex;width:max-content;border:1px solid rgba(251,191,36,.3);background:rgba(251,191,36,.1);color:#fde68a;border-radius:999px;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.18em;font-weight:900}.btn{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#e8ffff;border-radius:18px;padding:12px 16px;font-weight:900;cursor:pointer}.btn.primary{background:#67e8f9;color:#06121f}.btn:hover{transform:translateY(-1px);border-color:rgba(103,232,249,.5)}.actions,.toolbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.vertical{flex-direction:column;align-items:stretch}.grid2,.cards2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.grid3,.cards3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.grid4,.cards4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.cards5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}.split{display:grid;grid-template-columns:420px 1fr;gap:18px}.stat{border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.24);border-radius:24px;padding:20px}.stat b{display:block;font-size:34px;color:#a5f3fc}.stat span{font-size:11px;text-transform:uppercase;letter-spacing:.17em;color:#94a3b8}.card{border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.22);border-radius:24px;padding:20px}.discovery .score,.resultBig b{font-size:72px;color:#86efac;display:block}.resultBig{text-align:center;padding:30px;border-radius:30px;background:radial-gradient(circle,rgba(34,211,238,.18),rgba(0,0,0,.15));border:1px solid rgba(103,232,249,.22)}.resultBig span,.resultBig small{display:block;color:#b6c8d6}.input,.textarea,select,input{width:100%;border:1px solid rgba(255,255,255,.12);background:#07111f;color:#eaffff;border-radius:16px;padding:12px}.textarea{min-height:150px;font-size:16px}.inputs label,label{color:#cbd5e1;font-weight:800}.row{display:flex;gap:10px;flex-wrap:wrap}.row span{background:rgba(34,211,238,.1);border:1px solid rgba(103,232,249,.15);padding:8px 10px;border-radius:999px}.miniChart{height:150px;display:flex;gap:10px;align-items:end}.miniChart i{flex:1;border-radius:12px 12px 0 0;background:linear-gradient(#67e8f9,#0e7490);box-shadow:0 0 25px rgba(34,211,238,.35)}.graph3d{height:220px;border-radius:28px;border:1px solid rgba(103,232,249,.18);background:linear-gradient(135deg,rgba(8,47,73,.4),rgba(0,0,0,.2));transform:perspective(900px) rotateX(7deg);display:grid;place-items:center;color:#67e8f9;position:relative}.graph3d svg{width:90%;height:70%}.graph3d span{position:absolute;bottom:14px;color:#cbd5e1;text-transform:uppercase;letter-spacing:.15em;font-size:11px}.surface3d{height:260px;display:flex;align-items:end;gap:8px;padding:30px;border-radius:30px;background:linear-gradient(135deg,rgba(14,116,144,.18),rgba(30,41,59,.25));transform:perspective(900px) rotateX(10deg) rotateY(-8deg)}.surface3d i{flex:1;background:linear-gradient(#fde68a,#22d3ee,#312e81);border-radius:10px 10px 0 0;box-shadow:0 0 22px rgba(34,211,238,.3)}.pulseOrb{height:260px;display:grid;place-items:center}.pulseOrb span{width:180px;height:180px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#fff,#67e8f9 35%,#312e81 70%,transparent);box-shadow:0 0 60px rgba(34,211,238,.6);font-size:44px;font-weight:1000;animation:pulse 2.2s infinite}@keyframes pulse{50%{transform:scale(1.08);filter:hue-rotate(80deg)}}.well3d{height:620px;border-radius:34px;background:linear-gradient(180deg,#0f172a,#1e293b,#292524,#111827);position:relative;overflow:hidden;transform:perspective(1000px) rotateX(5deg) rotateY(-7deg);box-shadow:inset 0 0 90px rgba(0,0,0,.45),0 30px 80px rgba(0,0,0,.35)}.strata{position:absolute;left:-8%;right:-8%;height:22%;transform:skewY(-5deg);opacity:.95}.s1{top:15%;background:linear-gradient(90deg,#7c2d12,#c2410c,#78350f)}.s2{top:38%;background:linear-gradient(90deg,#334155,#64748b,#1e293b)}.s3{top:62%;background:linear-gradient(90deg,#065f46,#0f766e,#064e3b)}.bore{position:absolute;top:4%;left:50%;width:58px;transform:translateX(-50%);background:linear-gradient(90deg,#111827,#e5e7eb,#475569);border-radius:999px;box-shadow:0 0 40px rgba(251,191,36,.25)}.bit{position:absolute;left:50%;bottom:18%;width:90px;height:45px;transform:translateX(-50%);background:linear-gradient(90deg,#f97316,#fde68a,#f97316);clip-path:polygon(50% 100%,0 0,100% 0);filter:drop-shadow(0 0 18px #f59e0b)}.reservoir{position:absolute;left:15%;right:15%;bottom:8%;height:70px;border-radius:50%;background:radial-gradient(circle,#fde68a,#f97316,transparent 70%);filter:blur(.3px);box-shadow:0 0 45px rgba(251,191,36,.5)}.seismo3d{height:560px;border-radius:34px;background:radial-gradient(circle at center,#0f766e,#0f172a 48%,#020617);position:relative;overflow:hidden;transform:perspective(900px) rotateX(8deg);box-shadow:inset 0 0 90px rgba(0,0,0,.55)}.core{position:absolute;inset:42%;border-radius:50%;background:#fde68a;box-shadow:0 0 50px #fde68a}.ring{position:absolute;border:3px solid rgba(103,232,249,.35);border-radius:50%;inset:20%;animation:ripple 3s infinite}.r2{inset:29%;animation-delay:.5s;border-color:rgba(251,191,36,.35)}.r3{inset:10%;animation-delay:1s;border-color:rgba(167,139,250,.35)}@keyframes ripple{50%{transform:scale(1.08);opacity:.55}}.wavePlane{position:absolute;width:120px;height:120px;border-radius:24px;display:grid;place-items:center;font-size:42px;font-weight:1000}.pplane{left:15%;top:25%;background:rgba(34,211,238,.25);box-shadow:0 0 40px rgba(34,211,238,.5)}.splane{right:14%;bottom:22%;background:rgba(251,191,36,.22);box-shadow:0 0 40px rgba(251,191,36,.45)}.waveBox{display:grid;gap:14px}.wave{height:34px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.wave span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#67e8f9,#fff)}.wave.s span{background:linear-gradient(90deg,#fbbf24,#fff)}.waveLegend{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.waveLegend b{padding:12px;border-radius:16px;background:rgba(255,255,255,.06)}.periodic{display:grid;grid-template-columns:repeat(auto-fit,minmax(72px,1fr));gap:10px}.periodic div{border:1px solid rgba(103,232,249,.15);background:rgba(34,211,238,.08);padding:12px;border-radius:16px}.periodic b,.periodic small{display:block}.list{max-height:600px;overflow:auto}.list button{width:100%;margin:5px 0;text-align:left;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;border-radius:16px;padding:12px}.list button.active{background:rgba(34,211,238,.18)}.list small{display:block;color:#94a3b8}.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.mobileNav{display:none}@media(max-width:900px){aside{display:none}main{margin-left:0;padding:14px;padding-bottom:92px}.split,.grid2,.grid3,.grid4,.cards2,.cards3,.cards4,.cards5{grid-template-columns:1fr}.mobileNav{display:flex;position:fixed;left:0;right:0;bottom:0;gap:4px;overflow:auto;background:#020617;border-top:1px solid rgba(103,232,249,.2);padding:8px;z-index:20}.mobileNav button{white-space:nowrap;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#dff;padding:10px}.mobileNav button.on{background:#67e8f9;color:#06121f}.hero{padding:24px}.hero h1{font-size:44px}.well3d,.seismo3d{height:420px}}
`}</style>}

export default App;
