import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// A fixed color per line, cycled if there are more bots than colors -
// keeps each bot visually consistent if the selection changes.
const COLORS = ["#199e70", "#378ade", "#d85a30", "#e34948", "#7f77dd", "#eda100"];

export default function CompareEquityChart({ bots }) {
  // Comparing by trade INDEX rather than calendar date is the fairer
  // comparison here - two bots with very different start dates and
  // trade counts can still be compared on "how equity grew per trade",
  // which a shared date axis would distort (one bot's curve would be
  // squeezed into a fraction of the timeline).
  const maxTrades = Math.max(...bots.map((b) => b.trade_history?.length || 0), 1);

  const datasets = bots.map((bot, i) => ({
    label: bot.name,
    data: (bot.trade_history || []).map((t) => t.equity),
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: "transparent",
    tension: 0.3,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHitRadius: 12,
    borderWidth: 2,
  }));

  const data = {
    labels: Array.from({ length: maxTrades }, (_, i) => i + 1),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 10, boxHeight: 10, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.dataset.label}: $${item.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Trade #", font: { size: 11 } } },
      y: {
        ticks: { callback: (v) => "$" + v.toLocaleString() },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <>
      <p className="chart-label">Equity by trade number</p>
      <div className="chart-wrap" style={{ height: 220 }}>
        <Line data={data} options={options} />
      </div>
    </>
  );
}
