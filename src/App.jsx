import React, { useMemo, useState } from "react";

const elements = [
  { symbol: "Al", name: "Aluminium", density: 2.7, conductivity: 61, stability: 82 },
  { symbol: "Fe", name: "Iron", density: 7.87, conductivity: 17, stability: 74 },
  { symbol: "Ti", name: "Titanium", density: 4.51, conductivity: 6, stability: 91 },
  { symbol: "Cu", name: "Copper", density: 8.96, conductivity: 100, stability: 76 },
  { symbol: "W", name: "Tungsten", density: 19.3, conductivity: 31, stability: 94 },
  { symbol: "Hf", name: "Hafnium", density: 13.3, conductivity: 8, stability: 89 },
];

const pageOrder = [
  ["landing", "Landing"],
  ["dashboard", "Dashboard"],
  ["calculations", "Calculation Core"],
  ["welldriller", "Experimental Well Driller"],
  ["seismo", "Seismo"],
  ["about", "System Check"],
];

const sx = {
  app: { minHeight: "100vh", background: "radial-gradient(circle at top left, #164e63 0, transparent 32%), radial-gradient(circle at top right, #4c1d95 0, transparent 30%), #020617", color: "#e2e8f0", fontFamily: "Inter, ui-sans-serif, system-ui, Arial", display: "flex" },
  sidebar: { width: 300, padding: 20, borderRight: "1px solid rgba(103,232,249,.18)", background: "rgba(2,6,23,.88)", position: "sticky", top: 0, height: "100vh", boxSizing: "border-box" },
  main: { flex: 1, padding: 28, maxWidth: 1500, margin: "0 auto" },
  button: { width: "100%", padding: "13px 14px", borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.045)", color: "#e2e8f0", marginBottom: 8, textAlign: "left", cursor: "pointer", fontWeight: 800 },
  active: { background: "rgba(34,211,238,.16)", border: "1px solid rgba(103,232,249,.48)", color: "white" },
  panel: { border: "1px solid rgba(103,232,249,.18)", background: "rgba(255,255,255,.06)", borderRadius: 30, padding: 24, boxShadow: "0 0 70px rgba(34,211,238,.10)", marginBottom: 20, backdropFilter: "blur(14px)" },
  pill: { display: "inline-flex", border: "1px solid rgba(251,191,36,.35)", background: "rgba(251,191,36,.12)", color: "#fde68a", borderRadius: 999, padding: "6px 10px", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 900 },
  h1: { fontSize: "clamp(42px, 6vw, 88px)", lineHeight: .92, margin: "16px 0", color: "white", fontWeight: 950, letterSpacing: "-.05em" },
  h2: { fontSize: 34, margin: "0 0 12px", color: "white", fontWeight: 950, letterSpacing: "-.03em" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 },
  cta: { display: "inline-block", padding: "14px 18px", borderRadius: 18, border: 0, background: "#67e8f9", color: "#020617", fontWeight: 950, cursor: "pointer", marginRight: 10, marginTop: 10 },
  ghost: { display: "inline-block", padding: "14px 18px", borderRadius: 18, border: "1px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", color: "white", fontWeight: 900, cursor: "pointer", marginRight: 10, marginTop: 10 },
};

function Card({ children, style = {} }) {
  return <div style={{ ...sx.panel, ...style }}>{children}</div>;
}

function Landing({ setPage }) {
  return <>
    <Card>
      <span style={sx.pill}>ElementOS visible recovery build</span>
      <h1 style={sx.h1}>Material Intelligence, Seismo + Well Drilling</h1>
      <p style={{ fontSize: 20, lineHeight: 1.7, maxWidth: 850, color: "#cbd5e1" }}>
        This version is intentionally crash-safe: no Supabase import, no PDF library import, no risky runtime calls. It proves the app renders, then gives you the upgraded Calculation Core, Experimental Well Driller, and Seismo simulator.
      </p>
      <button style={sx.cta} onClick={() => setPage("calculations")}>Open Calculation Core</button>
      <button style={sx.ghost} onClick={() => setPage("welldriller")}>Open Well Driller</button>
      <button style={sx.ghost} onClick={() => setPage("seismo")}>Open Seismo</button>
    </Card>
    <div style={sx.grid3}>
      {["Calculation Core", "3D Well Design", "P/S Wave Simulator"].map((x, i) => <Card key={x}><span style={sx.pill}>0{i+1}</span><h2 style={{...sx.h2, marginTop: 14}}>{x}</h2><p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>Visible, safe, and wired into routing.</p></Card>)}
    </div>
  </>;
}

function Dashboard({ setPage }) {
  return <>
    <Card><span style={sx.pill}>Dashboard</span><h1 style={sx.h1}>Launch Workspace</h1><p style={{color:'#cbd5e1'}}>Use these visible buttons to verify routing works.</p></Card>
    <div style={sx.grid3}>
      {pageOrder.slice(2,5).map(([id,label]) => <Card key={id}><h2 style={sx.h2}>{label}</h2><button style={sx.cta} onClick={() => setPage(id)}>Open</button></Card>)}
    </div>
  </>;
}

function CalculationCore() {
  const [force, setForce] = useState(1200);
  const [area, setArea] = useState(0.45);
  const [density, setDensity] = useState(2700);
  const [depth, setDepth] = useState(2400);
  const pressure = force / Math.max(area, 0.001);
  const hydro = density * 9.81 * depth;
  const stability = Math.max(1, Math.min(99, Math.round(100 - Math.log10(pressure + hydro) * 8)));
  return <>
    <Card><span style={sx.pill}>Calculation Core upgraded</span><h1 style={sx.h1}>The Calculation Core</h1><p style={{fontSize:18,color:'#cbd5e1'}}>A visible engineering calculator for pressure, hydrostatic load, stability, and report-style outputs.</p></Card>
    <div style={{display:'grid', gridTemplateColumns:'minmax(280px,420px) 1fr', gap:20}}>
      <Card><h2 style={sx.h2}>Inputs</h2>{[["Force N", force, setForce],["Area m²", area, setArea],["Density kg/m³", density, setDensity],["Depth m", depth, setDepth]].map(([label,val,set]) => <label key={label} style={{display:'block',margin:'14px 0',fontWeight:800}}>{label}<input value={val} onChange={e=>set(Number(e.target.value))} type="number" style={{width:'100%',marginTop:8,padding:14,borderRadius:14,border:'1px solid rgba(255,255,255,.15)',background:'#020617',color:'white'}} /></label>)}</Card>
      <Card><h2 style={sx.h2}>Outputs</h2><div style={sx.grid3}>{[["Surface pressure", pressure.toFixed(0)+" Pa"],["Hydrostatic pressure", hydro.toFixed(0)+" Pa"],["Stability index", stability+"%"]].map(([a,b])=><div key={a} style={{padding:18,borderRadius:22,background:'rgba(34,211,238,.10)',border:'1px solid rgba(103,232,249,.22)'}}><div style={{fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'#67e8f9'}}>{a}</div><div style={{fontSize:34,fontWeight:950,color:'white',marginTop:8}}>{b}</div></div>)}</div><Graph values={[pressure/1000, hydro/100000, stability]} /></Card>
    </div>
  </>;
}

function Graph({ values }) {
  const max = Math.max(...values, 1);
  return <div style={{height:220, marginTop:24, display:'flex', alignItems:'end', gap:16, transform:'perspective(700px) rotateX(16deg)', transformOrigin:'bottom'}}>{values.map((v,i)=><div key={i} style={{flex:1,height:Math.max(18,(v/max)*190),borderRadius:'18px 18px 6px 6px',background:'linear-gradient(180deg,#67e8f9,#2563eb)',boxShadow:'0 20px 40px rgba(34,211,238,.3)',border:'1px solid rgba(255,255,255,.25)'}} />)}</div>;
}

function WellDriller({ setPage }) {
  const [depth, setDepth] = useState(3200);
  const [bit, setBit] = useState(72);
  const [mud, setMud] = useState(1.15);
  const risk = Math.max(4, Math.min(96, Math.round(depth/80 + bit/2 - mud*18)));
  return <>
    <Card><span style={sx.pill}>Experimental Well Driller</span><h1 style={sx.h1}>3D Well Driller</h1><p style={{fontSize:18,color:'#cbd5e1'}}>Plan a well path, visualize layered geology, estimate drilling risk, and jump into Seismo for P/S-wave analysis.</p><button style={sx.cta} onClick={()=>setPage('seismo')}>Send to Seismo</button></Card>
    <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20}}>
      <Card><h2 style={sx.h2}>Drilling Controls</h2>{[["Target depth m",depth,setDepth],["Bit energy",bit,setBit],["Mud weight",mud,setMud]].map(([label,val,set])=><label key={label} style={{display:'block',margin:'14px 0',fontWeight:800}}>{label}<input value={val} onChange={e=>set(Number(e.target.value))} type="number" style={{width:'100%',marginTop:8,padding:14,borderRadius:14,border:'1px solid rgba(255,255,255,.15)',background:'#020617',color:'white'}} /></label>)}<div style={{fontSize:44,fontWeight:950,color:'#67e8f9'}}>Risk {risk}%</div></Card>
      <Card><h2 style={sx.h2}>3D Subsurface Model</h2><div style={{height:560, position:'relative', perspective:900, overflow:'hidden', borderRadius:28, background:'linear-gradient(180deg,#020617,#0f172a)'}}>
        {[0,1,2,3,4].map(i=><div key={i} style={{position:'absolute',left:'8%',right:'8%',top:40+i*86,height:70,transform:`rotateX(58deg) rotateZ(-2deg) translateZ(${i*14}px)`,background:['#78350f','#365314','#164e63','#581c87','#1e293b'][i],border:'1px solid rgba(255,255,255,.22)',boxShadow:'0 18px 45px rgba(0,0,0,.35)',borderRadius:18}} />)}
        <div style={{position:'absolute',left:'49%',top:28,width:34,height:470,borderRadius:999,background:'linear-gradient(90deg,#fef3c7,#f59e0b,#78350f)',boxShadow:'0 0 50px rgba(251,191,36,.55)',transform:'rotateX(10deg) rotateY(-18deg)'}} />
        <div style={{position:'absolute',left:'43%',top:430,width:140,height:72,borderRadius:'50%',background:'radial-gradient(circle,#22c55e,#064e3b 65%, transparent 70%)',boxShadow:'0 0 70px rgba(34,197,94,.5)'}} />
      </div></Card>
    </div>
  </>;
}

function Seismo({ setPage }) {
  const [distance, setDistance] = useState(120);
  const [pSpeed, setPSpeed] = useState(6.2);
  const [sSpeed, setSSpeed] = useState(3.6);
  const pTime = distance / pSpeed;
  const sTime = distance / sSpeed;
  const lag = sTime - pTime;
  return <>
    <Card><span style={sx.pill}>Seismo</span><h1 style={sx.h1}>P-Wave / S-Wave Simulator</h1><p style={{fontSize:18,color:'#cbd5e1'}}>Compare seismic wave travel times and visualize a 3D wave tunnel through subsurface layers.</p><button style={sx.cta} onClick={()=>setPage('welldriller')}>Back to Well Driller</button></Card>
    <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20}}>
      <Card><h2 style={sx.h2}>Wave Controls</h2>{[["Distance km",distance,setDistance],["P-wave km/s",pSpeed,setPSpeed],["S-wave km/s",sSpeed,setSSpeed]].map(([label,val,set])=><label key={label} style={{display:'block',margin:'14px 0',fontWeight:800}}>{label}<input value={val} onChange={e=>set(Number(e.target.value))} type="number" step="0.1" style={{width:'100%',marginTop:8,padding:14,borderRadius:14,border:'1px solid rgba(255,255,255,.15)',background:'#020617',color:'white'}} /></label>)}<div style={{fontSize:30,fontWeight:950,color:'#67e8f9'}}>Lag {lag.toFixed(2)}s</div></Card>
      <Card><h2 style={sx.h2}>3D Wavefield</h2><div style={{height:520,position:'relative',perspective:900,overflow:'hidden',borderRadius:28,background:'radial-gradient(circle at center,#0f172a,#020617)'}}>
        {[0,1,2,3,4,5].map(i=><div key={i} style={{position:'absolute',left:80+i*85,top:150+Math.sin(i)*26,width:120,height:120,borderRadius:'50%',border:'3px solid rgba(103,232,249,.8)',transform:`rotateX(68deg) translateZ(${i*24}px)`,boxShadow:'0 0 40px rgba(34,211,238,.35)'}} />)}
        {[0,1,2,3,4,5].map(i=><div key={'s'+i} style={{position:'absolute',left:80+i*85,top:270+Math.cos(i)*18,width:95,height:95,borderRadius:'50%',border:'3px solid rgba(251,191,36,.8)',transform:`rotateX(68deg) translateZ(${i*18}px)`,boxShadow:'0 0 40px rgba(251,191,36,.35)'}} />)}
        <div style={{position:'absolute',left:40,right:40,bottom:60,height:16,borderRadius:999,background:'linear-gradient(90deg,#67e8f9,#fbbf24)',boxShadow:'0 0 60px rgba(103,232,249,.4)'}} />
      </div><div style={sx.grid3}>{[["P arrival",pTime.toFixed(2)+'s'],["S arrival",sTime.toFixed(2)+'s'],["S-P lag",lag.toFixed(2)+'s']].map(([a,b])=><div key={a} style={{padding:16,borderRadius:20,background:'rgba(255,255,255,.05)',marginTop:12}}><b>{a}</b><div style={{fontSize:28,fontWeight:950,color:'#67e8f9'}}>{b}</div></div>)}</div></Card>
    </div>
  </>;
}

function SystemCheck() {
  return <Card><span style={sx.pill}>System check</span><h1 style={sx.h1}>If you can see this, React is rendering.</h1><p style={{fontSize:18,color:'#cbd5e1'}}>If your full app is blank but this file renders, the issue is inside the larger App.jsx runtime code. If this is also blank, the problem is likely src/main.jsx, index.html root, CSS overlay, or deployment caching.</p></Card>;
}

export default function App() {
  const [page, setPage] = useState("landing");
  const Current = useMemo(() => ({ landing: Landing, dashboard: Dashboard, calculations: CalculationCore, welldriller: WellDriller, seismo: Seismo, about: SystemCheck }[page] || Landing), [page]);
  return <div style={sx.app}>
    <aside style={sx.sidebar}>
      <div style={{fontSize:26,fontWeight:950,color:'#cffafe',letterSpacing:'.18em',marginBottom:4}}>ElementOS</div>
      <div style={{fontSize:11,letterSpacing:'.25em',textTransform:'uppercase',color:'#64748b',marginBottom:22}}>safe visible build</div>
      {pageOrder.map(([id,label]) => <button key={id} onClick={()=>setPage(id)} style={{...sx.button, ...(page===id?sx.active:{})}}>{label}</button>)}
    </aside>
    <main style={sx.main}>
      <Current setPage={setPage} />
    </main>
  </div>;
}
