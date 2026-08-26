export default function ModeToggle({ mode, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--surface-tile)", borderRadius: 8, padding: 4 }}>
      {["single", "compare"].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: mode === m ? "var(--surface-card)" : "transparent",
            fontWeight: mode === m ? 500 : 400,
            color: "var(--text-primary)",
            boxShadow: mode === m ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {m === "single" ? "View one" : "Compare"}
        </button>
      ))}
    </div>
  );
}
