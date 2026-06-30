import { useMemo, useState } from "react";

import Background from "./components/layout/Background.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import MobileNav from "./components/layout/MobileNav.jsx";
import PageShell from "./components/layout/PageShell.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import ElementExplorer from "./pages/ElementExplorer.jsx";
import PeriodicTable from "./pages/PeriodicTable.jsx";
import CompareEngine from "./pages/CompareEngine.jsx";
import BehaviourAtlas from "./pages/BehaviourAtlas.jsx";
import BehaviourGraph from "./pages/BehaviourGraph.jsx";
import SimilarityUniverse from "./pages/SimilarityUniverse.jsx";
import IsotopeLab from "./pages/IsotopeLab.jsx";
import CalculationCore from "./pages/CalculationCore.jsx";
import Reports from "./pages/Reports.jsx";
import Discover from "./pages/Discover.jsx";
import TimeMachine from "./pages/TimeMachine.jsx";
import SeismoLab from "./pages/SeismoLab.jsx";
import WellDriller from "./pages/WellDriller.jsx";
import MatterIntelligenceOS from "./pages/MatterIntelligenceOS.jsx";
import MissionConsole from "./pages/MissionConsole.jsx";
import Pricing from "./pages/Pricing.jsx";

const pages = {
  dashboard: Dashboard,
  explorer: ElementExplorer,
  periodic: PeriodicTable,
  compare: CompareEngine,
  atlas: BehaviourAtlas,
  graph: BehaviourGraph,
  universe: SimilarityUniverse,
  isotope: IsotopeLab,
  calculator: CalculationCore,
  reports: Reports,
  discover: Discover,
  timeMachine: TimeMachine,
  seismo: SeismoLab,
  wellDriller: WellDriller,
  matterOS: MatterIntelligenceOS,
  mission: MissionConsole,
  pricing: Pricing,
};

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedElement, setSelectedElement] = useState("Al");
  const [compareElements, setCompareElements] = useState(["Al", "Fe", "Cu", "Ti"]);

  const ActivePage = useMemo(() => pages[activePage] || Dashboard, [activePage]);

  const appState = {
    activePage,
    setActivePage,
    selectedElement,
    setSelectedElement,
    compareElements,
    setCompareElements,
  };

  return (
    <div className="app-root">
      <Background />

      <div className="app-frame">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <PageShell>
          <ActivePage {...appState} />
        </PageShell>
      </div>

      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
