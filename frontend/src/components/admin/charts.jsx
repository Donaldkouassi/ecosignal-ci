import React, { useState } from "react";

// Graphiques du tableau de bord, dessinés en SVG/HTML léger.
// Couleurs : « signalés » en indigo, « collectés » en vert (paire validée pour le daltonisme).
export const SERIES = {
  signales: { label: "Signalés", color: "#5b6fb0" },
  collectes: { label: "Collectés", color: "#10a35a" },
};

function Tooltip({ tip }) {
  if (!tip) return null;
  return (
    <div className="chart-tip" style={{ left: tip.x, top: tip.y }} role="status">
      <strong>{tip.title}</strong>
      {tip.rows.map((row) => (
        <span key={row.label}>
          <i style={{ background: row.color }} aria-hidden="true" />
          {row.label}&nbsp;: <b>{row.value}</b>
        </span>
      ))}
    </div>
  );
}

/* Signalés et collectés par mois : barres groupées, une seule échelle. */
export function MonthlyChart({ data }) {
  const [tip, setTip] = useState(null);
  const width = 560;
  const height = 220;
  const pad = { top: 16, right: 8, bottom: 28, left: 28 };
  const max = Math.max(1, ...data.flatMap((d) => [d.total, d.collectes || 0]));
  const step = Math.ceil(max / 4) || 1;
  const top = step * 4;
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const band = innerW / Math.max(data.length, 1);
  const barW = Math.min(18, band / 3.2);
  const y = (v) => pad.top + innerH - (v / top) * innerH;

  return (
    <div className="chart-wrap">
      <ul className="chart-legend">
        {Object.values(SERIES).map((s) => (
          <li key={s.label}><i style={{ background: s.color }} aria-hidden="true" />{s.label}</li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Signalements et collectes par mois sur six mois" onMouseLeave={() => setTip(null)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={pad.left} x2={width - pad.right} y1={y(i * step)} y2={y(i * step)} className="grid-line" />
            <text x={pad.left - 8} y={y(i * step) + 4} className="axis-label" textAnchor="end">{i * step}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = pad.left + band * i + band / 2;
          const bars = [
            { key: "signales", value: d.total, x: cx - barW - 1 },
            { key: "collectes", value: d.collectes || 0, x: cx + 1 },
          ];
          return (
            <g key={d.mois}>
              {bars.map((b) => (
                <rect
                  key={b.key}
                  x={b.x}
                  y={y(b.value)}
                  width={barW}
                  height={Math.max(0, y(0) - y(b.value))}
                  rx="3"
                  fill={SERIES[b.key].color}
                />
              ))}
              <text x={cx} y={height - 8} className="axis-label" textAnchor="middle">{d.label}</text>
              {/* Zone de survol plus large que les barres */}
              <rect
                x={pad.left + band * i}
                y={pad.top}
                width={band}
                height={innerH}
                className="hit-area"
                onMouseEnter={() =>
                  setTip({
                    x: `${((cx) / width) * 100}%`,
                    y: 0,
                    title: d.label,
                    rows: [
                      { label: "Signalés", value: d.total, color: SERIES.signales.color },
                      { label: "Collectés", value: d.collectes || 0, color: SERIES.collectes.color },
                    ],
                  })
                }
              />
            </g>
          );
        })}
      </svg>
      <Tooltip tip={tip} />
      <table className="sr-only">
        <caption>Signalements et collectes par mois</caption>
        <thead><tr><th>Mois</th><th>Signalés</th><th>Collectés</th></tr></thead>
        <tbody>{data.map((d) => <tr key={d.mois}><td>{d.label}</td><td>{d.total}</td><td>{d.collectes || 0}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

/* Barres horizontales : total par entrée, avec la part collectée en vert. */
export function ProgressBars({ rows, onSelect, selected, unit = "signalements" }) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <ul className="progress-bars">
      {rows.map((r) => {
        const content = (
          <>
            <span className="pb-label">{r.label}</span>
            <span className="pb-track" aria-hidden="true">
              <span className="pb-total" style={{ width: `${(r.total / max) * 100}%` }}>
                {r.done != null && <span className="pb-done" style={{ width: `${(r.done / r.total) * 100}%` }} />}
              </span>
            </span>
            <span className="pb-value">
              {r.total}
              {r.done != null && <small> dont {r.done} collecté{r.done > 1 ? "s" : ""}</small>}
            </span>
          </>
        );
        return (
          <li key={r.label}>
            {onSelect ? (
              <button
                type="button"
                className="pb-row"
                aria-pressed={selected === r.label}
                aria-label={`${r.label} : ${r.total} ${unit}${r.done != null ? `, ${r.done} collectés` : ""}`}
                onClick={() => onSelect(selected === r.label ? null : r.label)}
              >
                {content}
              </button>
            ) : (
              <div className="pb-row">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
