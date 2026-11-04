import { X, ExternalLink, BookOpen, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { dateLabel, labels, type Incident } from "../feeds";
export default function EventDetail({
  event,
  close,
  guide,
  onMap,
}: {
  event: Incident;
  close: () => void;
  guide: () => void;
  onMap: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} onCancel={close} className="detail-dialog">
      <button className="icon-button close" onClick={close} aria-label="Fermer">
        <X />
      </button>
      <p className="eyebrow">
        {labels[event.kind]} · {event.source}
      </p>
      <h2>{event.title}</h2>
      <p className="muted">Observation du {dateLabel(event.time)}</p>
      <div className="detail-stats">
        <div>
          <small>Source</small>
          <strong>{event.source}</strong>
        </div>
        <div>
          <small>
            {event.magnitude !== undefined ? "Magnitude" : "Nature"}
          </small>
          <strong>{event.magnitude ?? "Événement recensé"}</strong>
        </div>
      </div>
      <p>
        Ce point indique une localisation publiée par la source, pas un
        périmètre de danger. Les consignes locales restent prioritaires.
      </p>
      {event.depth !== undefined && (
        <p>Profondeur publiée : {event.depth.toFixed(1)} km</p>
      )}
      <button className="primary full" onClick={onMap}>
        <MapPin size={18} /> Voir sur la carte
      </button>
      <button className="full" onClick={guide}>
        <BookOpen size={18} /> Ouvrir les fiches utiles
      </button>
      <a
        className="source-link"
        href={event.url}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLink size={16} /> Publication source · Internet nécessaire
      </a>
      <button className="full" onClick={close}>
        Fermer
      </button>
    </dialog>
  );
}
