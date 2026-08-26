import { useState, useEffect } from "react";
import BotCard from "./components/BotCard.jsx";

export default function App() {
  // Three pieces of state cover the three things that can happen while
  // loading: still waiting (loading), succeeded (bots has data), or
  // failed (error has a message). Only one is ever "active" at a time.
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect with an empty dependency array ([]) runs its function
  // exactly once, right after the component first renders - the
  // standard place to kick off a data fetch. import.meta.env.BASE_URL
  // is Vite's way of injecting the `base` path from vite.config.js, so
  // this works both locally (base "/") and once deployed to GitHub
  // Pages (base "/agentic-workflows/").
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

        // Sort by trade count, most-active first, so the strategies with
        // real track records show up before empty/new ones.
        results.sort((a, b) => b.trades - a.trades);
        setBots(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="page">
      <p className="page-title">Agentic workflows</p>
      <p className="page-subtitle">Live and backtested performance across all strategies</p>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && bots.map((bot) => <BotCard bot={bot} key={bot.id} />)}
    </div>
  );
}
