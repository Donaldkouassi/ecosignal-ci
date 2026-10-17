import React from "react";

function BarChart({ data, orientation = "horizontal", color = "var(--green-600)", caption }) {
  if (!data || data.length === 0) {
    return <p className="chart-empty">Aucune donnée à afficher pour le moment.</p>;
  }

  const max = Math.max(1, ...data.map((item) => item.total));

  const table = (
    <table className="sr-only">
      <caption>{caption}</caption>
      <tbody>
        {data.map((item) => (
          <tr key={item.label}>
            <th scope="row">{item.label}</th>
            <td>{item.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (orientation === "vertical") {
    return (
      <div role="img" aria-label={caption}>
        <div className="bar-chart-columns" aria-hidden="true">
          {data.map((item) => (
            <div className="bar-chart-column" key={item.label}>
              <span className="bar-chart-value">{item.total}</span>
              <div className="bar-chart-track-vertical">
                <span
                  className="bar-chart-fill"
                  style={{ height: `${(item.total / max) * 100}%`, background: color }}
                  title={`${item.label} — ${item.total}`}
                />
              </div>
              <span className="bar-chart-label">{item.label}</span>
            </div>
          ))}
        </div>
        {table}
      </div>
    );
  }

  return (
    <div role="img" aria-label={caption}>
      <ul className="bar-chart-rows" aria-hidden="true">
        {data.map((item) => (
          <li className="bar-chart-row" key={item.label}>
            <span className="bar-chart-label">{item.label}</span>
            <div className="bar-chart-track">
              <span
                className="bar-chart-fill"
                style={{ width: `${(item.total / max) * 100}%`, background: color }}
                title={`${item.label} — ${item.total}`}
              />
            </div>
            <span className="bar-chart-value">{item.total}</span>
          </li>
        ))}
      </ul>
      {table}
    </div>
  );
}

export default BarChart;
