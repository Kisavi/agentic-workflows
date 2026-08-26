import MetricsGrid from "./MetricsGrid.jsx";
import EquityChart from "./EquityChart.jsx";
import PerformanceChart from "./PerformanceChart.jsx";

const STATUS_LABELS = {
  live_forward_test: "Live forward-test",
  shelved: "Shelved",
  backtest_only: "Backtest only",
};

export default function BotCard({ bot }) {
  const badgeClass = bot.status === "live_forward_test" ? "badge-live" : "badge-shelved";
  const statusLabel = STATUS_LABELS[bot.status] || bot.status;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          {bot.name} - {bot.symbol}
        </span>
        <span className={`badge ${badgeClass}`}>{statusLabel}</span>
      </div>

      <MetricsGrid bot={bot} />
      <EquityChart tradeHistory={bot.trade_history} />
      <PerformanceChart tradeHistory={bot.trade_history} />
    </div>
  );
}
