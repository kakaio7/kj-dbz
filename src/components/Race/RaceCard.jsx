export default function RaceCard({ raca }) {
  if (!raca) return null

  return (
    <div className="race-card">

      <div className="race-title">
        <span>{raca.raca}</span>
        <span className="energy-icon">⚡</span>
      </div>

      <div className="race-content">

        <div className="race-image">
          <img
            src={raca.imagem}
            alt={raca.raca}
          />
        </div>

        <div className="race-info">

          <p>
            <strong>Origem:</strong>
            {raca.origem}
          </p>

          <p>
            <strong>Habilidade:</strong>
            {raca.habilidade}
          </p>

          <p>
            <strong>Personalidade:</strong>
            {raca.personalidade}
          </p>

          <p>
            <strong>Transformações:</strong>
            {raca.transformacoes}
          </p>

        </div>

      </div>

    </div>
  )
}
