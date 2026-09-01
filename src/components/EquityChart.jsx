import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";

// Chart.js is a plugin-based library - you have to explicitly "register"
// which pieces you use (line elements, the scales, tooltips, etc.) or it
// throws a runtime error. This only needs to happen once per app, so it
// lives at module scope (runs when the file is first imported), not
// inside the component function.
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

export default function EquityChart({ tradeHistory }) {
  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <>
        <p className="chart-label">Account equity</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No trades yet.</p>
      </>
    );
  }

  const data = {
    labels: tradeHistory.map((_, i) => i + 1),
    datasets: [
      {
        data: tradeHistory.map((t) => t.equity),
        borderColor: "#199e70",
        backgroundColor: "rgba(25,158,112,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#199e70",
        pointHitRadius: 12,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // "index" + intersect:false means hovering ANYWHERE along the
    // x-axis near a point triggers its tooltip - without this, a
    // reader would have to land a pixel-perfect hover on an invisible
    // point (pointRadius: 0) to see anything at all.
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const i = items[0].dataIndex;
            const t = tradeHistory[i];
            return t.date ? `Trade #${i + 1} - ${t.date}` : `Trade #${i + 1}`;
          },
          label: (item) => `Equity: $${item.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: {
        ticks: { callback: (v) => "$" + v.toLocaleString() },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <>
      <p className="chart-label">Account equity</p>
      <div className="chart-wrap">
        <Line data={data} options={options} />
      </div>
    </>
  );
}
