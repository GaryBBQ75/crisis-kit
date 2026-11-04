import { useEffect, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Globe,
  Map,
  Backpack,
  BookOpen,
  ArrowLeft,
  Wifi,
  WifiOff,
  Leaf,
  Download,
} from "lucide-react";
import Dashboard, { Prepare } from "./screens/Dashboard";
import Board from "./screens/Board";
import MapScreen from "./screens/MapScreen";
import Offline from "./screens/Offline";
import Profile from "./screens/Profile";
import Checklist from "./screens/Checklist";
import Reflexes from "./screens/Reflexes";
import Family from "./screens/Family";
import FirstAid from "./screens/FirstAid";
import EventDetail from "./components/EventDetail";
import { useFeeds } from "./useFeeds";
import { usePersisted } from "./store";
import type { Incident, Position } from "./feeds";
export type Screen =
  | "home"
  | "situation"
  | "map"
  | "prepare"
  | "profile"
  | "checklist"
  | "reflexes"
  | "family"
  | "firstaid"
  | "offline";
const navigation = [
  { id: "home", label: "Accueil", icon: LayoutDashboard },
  { id: "situation", label: "Situation", icon: Globe },
  { id: "map", label: "Carte", icon: Map },
  { id: "prepare", label: "Préparation", icon: Backpack },
  { id: "reflexes", label: "Fiches réflexes", icon: BookOpen },
];
const titles: Partial<Record<Screen, string>> = {
  profile: "Mon foyer",
  checklist: "Mon kit de préparation",
  family: "Mon plan familial",
  firstaid: "Urgence médicale",
};
export default function App() {
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const handler = () => setStorageError(true);
    window.addEventListener("storage-error", handler);
    return () => window.removeEventListener("storage-error", handler);
  }, []);
  const [screen, setScreen] = useState<Screen>("home");
  const [position, setPosition] = usePersisted<Position | null>(
    "watch-position",
    null,
  );
  const [economy, setEconomy] = usePersisted("economy", false);
  const [offlineTest, setOfflineTest] = useState(false);
  const feedState = useFeeds(economy || offlineTest);
  const state = { ...feedState, online: feedState.online && !offlineTest };
  const [selected, select] = useState<Incident | null>(null);
  const [focus, setFocus] = useState<Position | null>(null);
  function go(s: Screen) {
    setScreen(s);
    window.scrollTo({ top: 0 });
    if (s === "map") setFocus(null);
  }
  useEffect(() => {
    document.title =
      screen === "home"
        ? "Crisis Kit · Préparer, comprendre, agir"
        : `Crisis Kit · ${navigation.find((n) => n.id === screen)?.label || titles[screen] || "Hors ligne"}`;
  }, [screen]);
  return (
    <div className={`shell ${economy ? "economy" : ""}`}>
      <aside className="sidebar">
        <button className="brand" onClick={() => go("home")}>
          <span className="brand-icon">
            <Shield size={23} />
          </span>
          <span>
            crisis<span className="brand-light">kit</span>
            <small>PRÉPARER. COMPRENDRE. AGIR.</small>
          </span>
        </button>
        <nav aria-label="Navigation principale">
          {navigation.map((n) => (
            <button
              key={n.id}
              className={
                screen === n.id ||
                (n.id === "prepare" &&
                  ["profile", "family", "checklist"].includes(screen))
                  ? "nav-active"
                  : ""
              }
              onClick={() => go(n.id as Screen)}
            >
              <n.icon size={20} />
              {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => go("offline")}>
            <Download size={18} /> Mes données hors ligne
          </button>
          <p>
            <span className="status-dot" /> Vos préparatifs restent sur cet
            appareil
          </p>
          <small>Version de travail · 0.2</small>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => go("home")}>
            <Shield size={23} /> crisiskit
          </button>
          <span className="desktop-only breadcrumb">
            Votre espace de préparation
          </span>
          <div className="topbar-right">
            <span className="network-pill">
              {state.online ? <Wifi size={14} /> : <WifiOff size={14} />}{" "}
              {state.online ? "Connecté" : "Hors ligne"}
            </span>
            <button
              className={`icon-button ${economy ? "mint" : ""}`}
              aria-label={
                economy
                  ? "Désactiver le mode économe"
                  : "Activer le mode économe"
              }
              onClick={() => setEconomy(!economy)}
            >
              <Leaf size={18} />
            </button>
          </div>
        </header>
        <main key={screen}>
          {offlineTest && (
            <div className="notice" role="status">
              Test hors ligne : les connexions de l’app sont suspendues.{" "}
              <button
                className="text-button"
                onClick={() => setOfflineTest(false)}
              >
                Revenir en ligne
              </button>
            </div>
          )}
          {storageError && (
            <p className="notice" role="alert">
              Le stockage local est indisponible ou plein. Vos dernières
              modifications peuvent ne pas être conservées. Vérifiez l’espace
              disponible avant de fermer l’application.
            </p>
          )}
          {titles[screen] && (
            <>
              <button className="text-button" onClick={() => go("prepare")}>
                <ArrowLeft size={16} /> Préparation
              </button>
              <div className="page-heading">
                <h2>{titles[screen]}</h2>
              </div>
            </>
          )}
          {screen === "home" && (
            <Dashboard
              go={go}
              state={state}
              position={position}
              onSelect={select}
            />
          )}
          {screen === "situation" && (
            <Board state={state} position={position} onSelect={select} />
          )}
          {screen === "map" && (
            <MapScreen
              events={state.events}
              position={position}
              setPosition={setPosition}
              focus={focus}
              onSelect={select}
              online={state.online}
            />
          )}
          {screen === "prepare" && <Prepare go={go} />}
          {screen === "profile" && <Profile />}
          {screen === "checklist" && <Checklist />}
          {screen === "family" && <Family />}
          {screen === "reflexes" && <Reflexes />}
          {screen === "firstaid" && <FirstAid />}
          {screen === "offline" && (
            <Offline
              offlineTest={offlineTest}
              setOfflineTest={setOfflineTest}
              state={state}
              economy={economy}
              setEconomy={setEconomy}
              goMap={() => go("map")}
            />
          )}
          <footer>
            Conçu pour se préparer. Les consignes des autorités locales restent
            prioritaires.
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Navigation mobile">
        {navigation.map((n) => (
          <button
            key={n.id}
            className={screen === n.id ? "nav-active" : ""}
            onClick={() => go(n.id as Screen)}
          >
            <n.icon size={20} />
            <span>
              {n.id === "reflexes"
                ? "Réflexes"
                : n.id === "prepare"
                  ? "Mon kit"
                  : n.label}
            </span>
          </button>
        ))}
      </nav>
      {selected && (
        <EventDetail
          event={selected}
          close={() => select(null)}
          guide={() => {
            select(null);
            go("reflexes");
          }}
          onMap={() => {
            setScreen("map");
            setFocus(selected);
            select(null);
          }}
        />
      )}
    </div>
  );
}
