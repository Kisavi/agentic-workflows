import { useState, useEffect } from "react";
import BotCard from "./components/BotCard.jsx";
import BotSelector from "./components/BotSelector.jsx";
import ModeToggle from "./components/ModeToggle.jsx";
import BotChecklist from "./components/BotChecklist.jsx";
import CompareTable from "./components/CompareTable.jsx";
import CompareEquityChart from "./components/CompareEquityChart.jsx";
import RankingTable from "./components/RankingTable.jsx";

export default function App() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // "single" shows one bot's full card via a dropdown; "compare" shows
  // a checklist + side-by-side table for whichever bots are checked.
  const [mode, setMode] = useState("single");
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedSlugs, setSelectedSlugs] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const manifestRes = await fetch(`${import.meta.env.BASE_URL}data/manifest.json`);
        if (!manifestRes.ok) throw new Error("Could not load manifest.json");
        const manifest = await manifestRes.json();

        const results = await Promise.all(
          manifest.map((slug) =>
            fetch(`${import.meta.env.BASE_URL}data/${slug}.json`).then((r) => {
              if (!r.ok) throw new Error(`Could not load ${slug}.json`);
              return r.json();
            })
          )
        );

        results.sort((a, b) => b.trades - a.trades);
        setBots(results);
        if (results.length > 0) {
          setSelectedSlug(results[0].id);
          setSelectedSlugs([results[0].id, results[1]?.id].filter(Boolean));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function toggleCompareSlug(slug) {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const selectedBot = bots.find((b) => b.id === selectedSlug);
  const compareBots = bots.filter((b) => selectedSlugs.includes(b.id));

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <p className="page-title">Agentic workflows</p>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Live and backtested performance across all strategies
          </p>
        </div>
        {!loading && !error && bots.length > 0 && <ModeToggle mode={mode} onChange={setMode} />}
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && mode === "single" && selectedBot && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <BotSelector bots={bots} selectedSlug={selectedSlug} onChange={setSelectedSlug} />
          </div>
          <BotCard bot={selectedBot} />
        </>
      )}

      {!loading && !error && mode === "compare" && (
        <div className="card">
          <RankingTable
            bots={bots}
            onSelectBot={(slug) =>
              setSelectedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
            }
          />
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px" }}>
            Or pick specific strategies to compare side by side:
          </p>
          <BotChecklist bots={bots} selectedSlugs={selectedSlugs} onToggle={toggleCompareSlug} />
          {compareBots.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Select at least one strategy above.</p>
          )}
          {compareBots.length > 0 && (
            <>
              <CompareTable bots={compareBots} />
              <CompareEquityChart bots={compareBots} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

