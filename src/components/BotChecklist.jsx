export default function BotChecklist({ bots, selectedSlugs, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
      {bots.map((bot) => {
        const checked = selectedSlugs.includes(bot.id);
        return (
          <label
            key={bot.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              padding: "6px 12px",
              borderRadius: 8,
              border: "0.5px solid var(--border)",
              background: checked ? "var(--surface-tile)" : "var(--surface-card)",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" checked={checked} onChange={() => onToggle(bot.id)} />
            {bot.name}
          </label>
        );
      })}
    </div>
  );
}
