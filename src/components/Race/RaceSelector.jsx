export default function RaceSelector({ racas, onSelect }) {
  return (
    <select
      className="dbz-select"
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Selecione uma raça...</option>

      {racas.map((raca, index) => (
        <option key={raca.id} value={index}>
          {raca.raca}
        </option>
      ))}
    </select>
  )
}