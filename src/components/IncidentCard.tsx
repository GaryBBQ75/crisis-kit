import {
  ArrowUpRight,
  Flame,
  Activity,
  CloudLightning,
  Mountain,
  Waves,
  Globe,
} from "lucide-react";
import {
  colors,
  labels,
  dateLabel,
  distance,
  type Incident,
  type Position,
} from "../feeds";
const icons = {
  earthquake: Activity,
  wildfire: Flame,
  storm: CloudLightning,
  volcano: Mountain,
  flood: Waves,
  other: Globe,
};
export default function IncidentCard({
  event,
  position,
  onClick,
}: {
  event: Incident;
  position: Position | null;
  onClick: () => void;
}) {
  const Icon = icons[event.kind];
  return (
    <button className="event-row" onClick={onClick}>
      <span className="event-icon" style={{ color: colors[event.kind] }}>
        <Icon size={21} />
      </span>
      <span className="event-content">
        <span className="event-meta">
          {labels[event.kind]} · {event.source}
        </span>
        <strong>
          {event.magnitude !== undefined &&
            `M ${event.magnitude.toFixed(1)} · `}
          {event.title}
        </strong>
        <span className="event-meta">
          {dateLabel(event.time)}
          {position &&
            ` · ${Math.round(distance(position, event)).toLocaleString("fr-FR")} km`}
        </span>
      </span>
      <ArrowUpRight size={17} />
    </button>
  );
}
