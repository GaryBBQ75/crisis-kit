import { useEffect, useState } from "react";
import { Download, Check, WifiOff, Database, Leaf } from "lucide-react";
import { get } from "idb-keyval";
import { dateLabel, sources } from "../feeds";
import type { FeedState } from "../useFeeds";
import type { LocalPack } from "./MapScreen";
import { reflexes } from "../content/reflexes";
export default function Offline({
  state,
  economy,
  setEconomy,
  goMap,
  offlineTest,
  setOfflineTest,
}: {
  offlineTest: boolean;
  setOfflineTest: (v: boolean) => void;
  state: FeedState;
  economy: boolean;
  setEconomy: (v: boolean) => void;
  goMap: () => void;
}) {
  const [ready, installed] = useState(false);
  const [pack, local] = useState<LocalPack | null>(null);
  const [message, msg] = useState("");
  useEffect(() => {
    get<LocalPack>("local-pois-v1").then((p) => local(p || null));
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .getRegistration()
        .then((r) => installed(!!r?.active));
  }, []);
  async function persist() {
    try {
      const ok = await navigator.storage?.persist?.();
      msg(
        ok
          ? "Stockage persistant accordé par le navigateur."
          : "Le navigateur gère la conservation. Évitez d’effacer les données du site.",
      );
    } catch {
      msg("Protection du stockage indisponible.");
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">L’ESSENTIEL RESTE AVEC VOUS</p>
          <h2>Sans connexion</h2>
          <p className="muted">Savoir ce qui est vraiment disponible.</p>
        </div>
        <WifiOff />
      </div>
      <section className="hero-card">
        <h3>
          {ready
            ? "Application installée en cache"
            : "Préparation du cache de l’application"}
        </h3>
        <p>
          {ready
            ? "Les écrans et guides sont enregistrés par le navigateur. Testez leur ouverture en mode avion avant d’en dépendre."
            : "Ouvrez cette application en ligne et attendez son chargement complet. Le mode hors ligne nécessite un premier accès réussi."}
        </p>
        <p className="small">
          Le navigateur peut supprimer ses données. Une coupure réseau n’empêche
          pas leur lecture, mais le téléphone doit rester alimenté.
        </p>
      </section>
      <section className="card">
        <h3>Essayer sans connexion</h3>
        <p>
          Simulez la coupure dans l’app : les sources et le fond de carte en
          ligne sont suspendus. Cela ne coupe pas le réseau du téléphone.
        </p>
        <button onClick={() => setOfflineTest(!offlineTest)}>
          {offlineTest ? "Terminer le test" : "Tester le mode hors ligne"}
        </button>
      </section>
      <section className="card">
        <h3>Sur cet appareil</h3>
        {[
          {
            title: `${reflexes.length} fiches embarquées`,
            text: "Incluses avec l’application",
            ok: ready,
          },
          {
            title: "Foyer, kit et plan familial",
            text: "Vos saisies sont conservées localement",
            ok: true,
          },
          {
            title: "Lieux utiles de proximité",
            text: pack
              ? `${pack.pois.length} points · ${dateLabel(pack.received)}`
              : "Aucun pack enregistré",
            ok: !!pack,
          },
          {
            title: "Tracé local simplifié des rues",
            text: pack?.roads?.length
              ? `${pack.roads.length} tronçons enregistrés · carte partielle`
              : "Aucun tracé enregistré · fond détaillé en ligne uniquement",
            ok: !!pack?.roads?.length,
          },
          ...sources.map((s) => ({
            title: s.name,
            text: state.feeds[s.id]
              ? `Dernier relevé reçu le ${dateLabel(state.feeds[s.id].received)}`
              : "Aucun relevé conservé",
            ok: !!state.feeds[s.id],
          })),
        ].map((r) => (
          <div className="source-row" key={r.title}>
            <div>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
            </div>
            {r.ok ? (
              <Check className="mint" />
            ) : (
              <span className="tag">À préparer</span>
            )}
          </div>
        ))}
        <button onClick={goMap}>
          <Download size={17} /> Préparer les lieux utiles
        </button>
      </section>
      <section className="card">
        <h3>
          <Leaf size={19} /> Mode économe
        </h3>
        <p>
          Arrête les actualisations automatiques et les animations. Les mises à
          jour manuelles restent possibles.
        </p>
        <button aria-pressed={economy} onClick={() => setEconomy(!economy)}>
          {economy ? "Désactiver" : "Activer"} le mode économe
        </button>
      </section>
      <section className="card">
        <h3>
          <Database size={19} /> Conservation des données
        </h3>
        <button onClick={persist}>Demander un stockage persistant</button>
        {message && <p role="status">{message}</p>}
        <p className="small muted">
          La position choisie reste locale. Le téléchargement des lieux transmet
          uniquement la zone à l’API OpenStreetMap. Les cartes en ligne
          contactent OpenStreetMap. Aucun compte requis.
        </p>
      </section>
    </>
  );
}
