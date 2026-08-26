import { formatPeriod } from "../utils.js";

// A "presentational" component: it takes data via props and renders it,
// with no state or logic of its own. This is a common React pattern -
// keep components that just display things simple, and push calculation
// logic (like formatPeriod) into plain utility functions instead.
export default function MetricsGrid({ bot }) {
  const pnlClass = bot.current_pnl >= 0 ? "positive" : "negative";
  const ddClass = bot.max_drawdown_pct < 0 ? "negative" : "";

  // Each tile is { label, value, className }. Building this as an array
  // and mapping over it avoids repeating the same JSX block 10 times.
  const tiles = [
    { label: "Starting balance", value: `$${bot.starting_balance.toLocaleString()}` },
    { label: "Current equity", value: `$${bot.current_equity.toLocaleString()}` },
    {
      label: "Current P&L",
      value: `${bot.current_pnl >= 0 ? "+" : ""}$${bot.current_pnl.toLocaleString()}`,
      className: pnlClass,
    },
    { label: "Win rate", value: `${bot.win_rate_pct}%` },
    { label: "Profit factor", value: bot.profit_factor ?? "-" },
    {
      label: "Net R",
      value: `${bot.net_r >= 0 ? "+" : ""}${bot.net_r}R`,
      className: bot.net_r >= 0 ? "positive" : "negative",
    },
    { label: "Trades", value: bot.trades },
    {
      label: "Max drawdown",
      value: `${bot.max_drawdown_pct}%`,
      className: ddClass,
    },
    {
      label: "Risk per trade",
      value: bot.risk_per_trade_pct != null ? `${bot.risk_per_trade_pct}%` : "Fixed $",
    },
    {
      label: "Period",
      value: formatPeriod(bot.period_start, bot.period_end),
      small: true,
    },
  ];

  return (
    <div className="metrics-grid">
      {tiles.map((tile) => (
        <div className="metric-tile" key={tile.label}>
          <p className="metric-label">{tile.label}</p>
          <p className={`metric-value ${tile.small ? "small" : ""} ${tile.className || ""}`}>
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}
