const ROWS = [
  { label: "Trades", get: (b) => b.trades },
  { label: "Win rate", get: (b) => `${b.win_rate_pct}%` },
  { label: "Profit factor", get: (b) => b.profit_factor ?? "-" },
  {
    label: "Net R",
    get: (b) => `${b.net_r >= 0 ? "+" : ""}${b.net_r}R`,
    className: (b) => (b.net_r >= 0 ? "positive" : "negative"),
  },
  { label: "Max drawdown", get: (b) => `${b.max_drawdown_pct}%` },
  { label: "Current equity", get: (b) => `$${b.current_equity.toLocaleString()}` },
  {
    label: "Current P&L",
    get: (b) => `${b.current_pnl >= 0 ? "+" : ""}$${b.current_pnl.toLocaleString()}`,
    className: (b) => (b.current_pnl >= 0 ? "positive" : "negative"),
  },
];

export default function CompareTable({ bots }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 12px", color: "var(--text-secondary)" }}></th>
            {bots.map((b) => (
              <th
                key={b.id}
                style={{ textAlign: "left", padding: "8px 12px", fontWeight: 500, whiteSpace: "nowrap" }}
              >
                {b.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} style={{ borderTop: "0.5px solid var(--border)" }}>
              <td style={{ padding: "8px 12px", color: "var(--text-secondary)" }}>{row.label}</td>
              {bots.map((b) => (
                <td
                  key={b.id}
                  className={row.className ? `metric-value ${row.className(b)}` : ""}
                  style={{ padding: "8px 12px" }}
                >
                  {row.get(b)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
