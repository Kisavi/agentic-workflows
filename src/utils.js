const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Turns "2026-08-07" into "07-Aug-2026" - the display format we settled on
// for the Period metric tile. Returns an empty string for missing dates
// (e.g. a bot with zero trades has no period_start/period_end yet).
export function formatDate(isoDateString) {
  if (!isoDateString) return "";
  const [year, month, day] = isoDateString.split("-");
  const monthName = MONTH_NAMES[parseInt(month, 10) - 1];
  return `${day}-${monthName}-${year}`;
}

export function formatPeriod(start, end) {
  if (!start || !end) return "No trades yet";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

// Groups a bot's trade_history into year / month / day buckets for the
// performance bar chart. `granularity` is one of "year" | "month" | "day".
// For "month" and "day" we need to know which year/month the person has
// selected in the dropdowns - that's `selectedYear` / `selectedMonth`.
//
// Returns { labels, values } ready to hand to Chart.js, and never
// generates bars for periods that haven't happened yet (see the
// "latest" trimming below) - a common bug is showing empty Sep-Dec
// bars for the current year just because the year isn't over.
export function aggregateTradeHistory(tradeHistory, granularity, selectedYear, selectedMonth) {
  if (!tradeHistory || tradeHistory.length === 0) {
    return { labels: [], values: [] };
  }

  const parsed = tradeHistory.map((t) => ({
    date: new Date(t.date + "T00:00:00Z"),
    pnl: t.pnl,
  }));

  const latest = parsed.reduce((a, t) => (t.date > a ? t.date : a), parsed[0].date);

  if (granularity === "year") {
    const years = [...new Set(parsed.map((t) => t.date.getUTCFullYear()))].sort();
    const values = years.map((y) =>
      parsed.filter((t) => t.date.getUTCFullYear() === y).reduce((s, t) => s + t.pnl, 0)
    );
    return { labels: years.map(String), values };
  }

  if (granularity === "month") {
    const year = selectedYear;
    const lastMonth = year === latest.getUTCFullYear() ? latest.getUTCMonth() : 11;
    const months = MONTH_NAMES.slice(0, lastMonth + 1);
    const values = months.map((_, i) =>
      parsed
        .filter((t) => t.date.getUTCFullYear() === year && t.date.getUTCMonth() === i)
        .reduce((s, t) => s + t.pnl, 0)
    );
    return { labels: months, values };
  }

  // day
  const year = selectedYear;
  const month = selectedMonth;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const isLatestMonth = year === latest.getUTCFullYear() && month === latest.getUTCMonth();
  const lastDay = isLatestMonth ? latest.getUTCDate() : daysInMonth;
  const labels = Array.from({ length: lastDay }, (_, i) => String(i + 1));
  const values = labels.map((_, i) =>
    parsed
      .filter(
        (t) =>
          t.date.getUTCFullYear() === year &&
          t.date.getUTCMonth() === month &&
          t.date.getUTCDate() === i + 1
      )
      .reduce((s, t) => s + t.pnl, 0)
  );
  return { labels, values };
}

export function getAvailableYears(tradeHistory) {
  if (!tradeHistory || tradeHistory.length === 0) return [];
  const years = tradeHistory.map((t) => new Date(t.date + "T00:00:00Z").getUTCFullYear());
  return [...new Set(years)].sort();
}

export function getLatestYearMonth(tradeHistory) {
  if (!tradeHistory || tradeHistory.length === 0) {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() };
  }
  const dates = tradeHistory.map((t) => new Date(t.date + "T00:00:00Z"));
  const latest = dates.reduce((a, d) => (d > a ? d : a), dates[0]);
  return { year: latest.getUTCFullYear(), month: latest.getUTCMonth() };
}

export const MONTH_NAMES_EXPORT = MONTH_NAMES;
