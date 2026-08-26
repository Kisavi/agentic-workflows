import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import {
  aggregateTradeHistory,
  getAvailableYears,
  getLatestYearMonth,
  MONTH_NAMES_EXPORT as MONTH_NAMES,
} from "../utils.js";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip);

export default function PerformanceChart({ tradeHistory }) {
  // useState holds values that change over time and cause a re-render
  // when updated - here, which granularity/year/month the person has
  // picked from the dropdowns. We initialize year/month to the latest
  // trade's date so the chart opens showing recent activity, not 2018.
  const { year: latestYear, month: latestMonth } = getLatestYearMonth(tradeHistory);
  const [granularity, setGranularity] = useState("year");
  const [selectedYear, setSelectedYear] = useState(latestYear);
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);

  const years = getAvailableYears(tradeHistory);

  // useMemo re-runs the aggregation only when its dependencies change,
  // rather than on every render - a small performance habit, though on
  // a dataset this size it wouldn't matter much either way. Good to
  // know the pattern for when it does matter.
  const { labels, values } = useMemo(
    () => aggregateTradeHistory(tradeHistory, granularity, selectedYear, selectedMonth),
    [tradeHistory, granularity, selectedYear, selectedMonth]
  );

  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <>
        <p className="chart-label">Performance</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No trades yet.</p>
      </>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map((v) => (v >= 0 ? "#199e70" : "#e34948")),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v) => (v < 0 ? "-$" + Math.abs(v) : "$" + v) },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <>
      <div className="controls-row">
        <p className="chart-label" style={{ margin: 0 }}>
          Performance
        </p>
        <div className="controls-group">
          <select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="day">Day</option>
          </select>
          {granularity !== "year" && (
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
          {granularity === "day" && (
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="chart-wrap performance">
        <Bar data={data} options={options} />
      </div>
    </>
  );
}
