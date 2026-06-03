export default function RaceCard({ raca }) {
  if (!raca) return null

  return (
    <div className="race-card">
      <h2>{raca.raca}</h2>

      <div className="info-grid">
        <p><strong>ID:</strong> {raca.id}</p>
        <p><strong>Origem:</strong> {raca.origem}</p>
        <p><strong>Habilidade:</strong> {raca.habilidade}</p>
        <p><strong>Personalidade:</strong> {raca.personalidade}</p>
        <p><strong>Transformações:</strong> {raca.transformacoes}</p>
      </div>
    </div>
  )
}