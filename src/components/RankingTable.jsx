import { useState, useMemo } from "react";

// For every metric here, a HIGHER raw value is better - including
// max_drawdown_pct, since drawdowns are stored as negative numbers
// (e.g. -1.29 vs -15.98). A smaller drawdown is a less-negative number,
// which is naturally "higher" - so one consistent "sort descending"
// rule works for every column without special-casing drawdown.
const RANK_OPTIONS = [
  { key: "profit_factor", label: "Profit factor" },
  { key: "net_r", label: "Net R" },
  { key: "max_drawdown_pct", label: "Max drawdown (best first)" },
  { key: "win_rate_pct", label: "Win rate" },
  { key: "trades", label: "Trades" },
  { key: "current_equity", label: "Current equity" },
];

export default function RankingTable({ bots, onSelectBot }) {
  const [rankBy, setRankBy] = useState("profit_factor");

  const ranked = useMemo(() => {
    return [...bots].sort((a, b) => {
      const av = a[rankBy] ?? -Infinity;
      const bv = b[rankBy] ?? -Infinity;
      return bv - av;
    });
  }, [bots, rankBy]);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div className="controls-row">
        <p className="chart-label" style={{ margin: 0 }}>
          Leaderboard
        </p>
        <select value={rankBy} onChange={(e) => setRankBy(e.target.value)}>
          {RANK_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              Rank by: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "var(--text-secondary)" }}>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>#</th>
              <th style={{ textAlign: "left", padding: "8px 12px" }}>Strategy</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>Trades</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>Win %</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>PF</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>Net R</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>Max DD</th>
              <th style={{ textAlign: "right", padding: "8px 12px" }}>Equity</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((bot, i) => (
              <tr
                key={bot.id}
                onClick={() => onSelectBot && onSelectBot(bot.id)}
                style={{
                  borderTop: "0.5px solid var(--border)",
                  cursor: onSelectBot ? "pointer" : "default",
                  background: i === 0 ? "var(--success-bg)" : "transparent",
                }}
              >
                <td style={{ padding: "8px 12px", fontWeight: 500 }}>{i + 1}</td>
                <td style={{ padding: "8px 12px", whiteSpace: "nowrap" }}>
                  {bot.name} - {bot.symbol}
                </td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{bot.trades}</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{bot.win_rate_pct}%</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{bot.profit_factor ?? "-"}</td>
                <td
                  style={{
                    padding: "8px 12px",
                    textAlign: "right",
                    color: bot.net_r >= 0 ? "var(--success-text)" : "var(--danger-text)",
                  }}
                >
                  {bot.net_r >= 0 ? "+" : ""}
                  {bot.net_r}R
                </td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>{bot.max_drawdown_pct}%</td>
                <td style={{ padding: "8px 12px", textAlign: "right" }}>
                  ${bot.current_equity.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
