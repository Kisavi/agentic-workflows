export default function BotSelector({ bots, selectedSlug, onChange }) {
  return (
    <select
      value={selectedSlug}
      onChange={(e) => onChange(e.target.value)}
      style={{ fontSize: 14, height: 36, padding: "0 10px", minWidth: 220 }}
    >
      {bots.map((bot) => (
        <option key={bot.id} value={bot.id}>
          {bot.name} - {bot.symbol}
        </option>
      ))}
    </select>
  );
}
