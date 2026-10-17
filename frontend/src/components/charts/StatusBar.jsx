import React from "react";

const SEGMENTS = [
  { key: "en_attente", label: "En attente", color: "var(--status-serious)" },
  { key: "en_cours", label: "En cours", color: "var(--status-warning)" },
  { key: "resolu", label: "Résolus", color: "var(--status-good)" },
];

function StatusBar({ enAttente, enCours, resolus, caption }) {
  const total = enAttente + enCours + resolus;
  const values = { en_attente: enAttente, en_cours: enCours, resolu: resolus };

  if (total === 0) {
    return <p className="chart-empty">Aucun signalement à afficher pour le moment.</p>;
  }

  return (
    <div role="img" aria-label={caption}>
      <div className="status-bar-track" aria-hidden="true">
        {SEGMENTS.map((segment) => {
          const value = values[segment.key];
          if (value <= 0) return null;
          const percent = (value / total) * 100;
          return (
            <div
              key={segment.key}
              className="status-bar-segment"
              style={{ width: `${percent}%`, background: segment.color }}
              title={`${segment.label} — ${value} (${Math.round(percent)}%)`}
            >
              {percent >= 12 && <span>{Math.round(percent)}%</span>}
            </div>
          );
        })}
      </div>
      <ul className="status-bar-legend">
        {SEGMENTS.map((segment) => (
          <li key={segment.key}>
            <span className="legend-dot" style={{ background: segment.color }} aria-hidden="true" />
            {segment.label} <strong>{values[segment.key]}</strong>
          </li>
        ))}
      </ul>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {SEGMENTS.map((segment) => (
            <tr key={segment.key}>
              <th scope="row">{segment.label}</th>
              <td>{values[segment.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusBar;
