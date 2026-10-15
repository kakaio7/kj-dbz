import { useState } from "react"
import "./TransformationSimulator.css"

const transformacoes = [
  {
    id: "base",
    nome: "Saiyajin Base",
    imagem: "/images/transformations/saiyajin-base.png",
    multiplicador: 1,
    cor: "#e5e7eb",
    descricao: "A forma natural de um guerreiro Saiyajin."
  },
  {
    id: "oozaru",
    nome: "Oozaru",
    imagem: "/images/transformations/oozaru.png",
    multiplicador: 10,
    cor: "#a855f7",
    descricao: "A transformação em macaco gigante."
  },
  {
    id: "ssj",
    nome: "Super Saiyajin",
    imagem: "/images/transformations/super-saiyajin.png",
    multiplicador: 50,
    cor: "#facc15",
    descricao: "Uma transformação lendária de poder extraordinário."
  },
  {
    id: "ssj2",
    nome: "Super Saiyajin 2",
    imagem: "/images/transformations/super-saiyajin-2.png",
    multiplicador: 100,
    cor: "#60a5fa",
    descricao: "Uma evolução com energia intensa e relâmpagos."
  },
  {
    id: "ssj3",
    nome: "Super Saiyajin 3",
    imagem: "/images/transformations/super-saiyajin-3.png",
    multiplicador: 400,
    cor: "#f59e0b",
    descricao: "Uma forma de grande poder e alto consumo de energia."
  },
  {
    id: "god",
    nome: "Super Saiyajin God",
    imagem: "/images/transformations/super-saiyajin-god.png",
    multiplicador: null,
    cor: "#ef4444",
    descricao: "Uma transformação que utiliza o ki divino."
  },
  {
    id: "blue",
    nome: "Super Saiyajin Blue",
    imagem: "/images/transformations/super-saiyajin-blue.png",
    multiplicador: null,
    cor: "#38bdf8",
    descricao: "O poder Super Saiyajin combinado com o ki divino."
  },
  {
    id: "ultra",
    nome: "Instinto Superior",
    imagem: "/images/transformations/instinto-superior.png",
    multiplicador: null,
    cor: "#c084fc",
    descricao: "Um estado avançado de reação e domínio corporal."
  }
]

export default function TransformationSimulator() {
  const [selecionada, setSelecionada] = useState(transformacoes[0])
  const [poderBase, setPoderBase] = useState(1000)
  const [poderDivino, setPoderDivino] = useState(1000000)
  const [imagemErro, setImagemErro] = useState(false)

  const poderFinal = selecionada.multiplicador !== null
    ? poderBase * selecionada.multiplicador
    : poderDivino

  function selecionarTransformacao(forma) {
    setSelecionada(forma)
    setImagemErro(false)
  }

  function reiniciar() {
    setSelecionada(transformacoes[0])
    setPoderBase(1000)
    setPoderDivino(1000000)
    setImagemErro(false)
  }

  return (
    <section className="transformation-section" id="transformacoes">
      <header className="transformation-header">
        <span className="transformation-eyebrow">
          KJ-DBZ // EVOLUÇÃO SAIYAJIN
        </span>

        <h2>
          SIMULADOR DE <span>TRANSFORMAÇÕES</span>
        </h2>

        <p>
          Selecione uma forma, ajuste seu poder e acompanhe a evolução
          da energia Saiyajin.
        </p>
      </header>

      <div className="transformation-layout">
        <aside className="transformation-sidebar">
          <h3>Formas disponíveis</h3>

          <div className="transformation-options">
            {transformacoes.map((forma) => (
              <button
                key={forma.id}
                type="button"
                className={`transformation-option ${
                  selecionada.id === forma.id ? "selected" : ""
                }`}
                style={{ "--transformation-color": forma.cor }}
                onClick={() => selecionarTransformacao(forma)}
              >
                <span className="transformation-option-dot" />
                <span>{forma.nome}</span>
                <span className="transformation-option-arrow">›</span>
              </button>
            ))}
          </div>
        </aside>

        <article
          className="transformation-display"
          style={{ "--transformation-color": selecionada.cor }}
        >
          <div className="transformation-info">
            <span className="transformation-eyebrow">
              FORMA SELECIONADA
            </span>

            <h3>{selecionada.nome}</h3>
            <p>{selecionada.descricao}</p>

            <div className="transformation-power">
              <span>NÍVEL DE PODER</span>

              <strong>
                {poderFinal.toLocaleString("pt-BR")}
              </strong>

              <small>
                {selecionada.multiplicador !== null
                  ? `Multiplicador ilustrativo: ×${selecionada.multiplicador}`
                  : "Poder divino personalizado"}
              </small>
            </div>
          </div>

          <div className="transformation-portrait">
            <div className="transformation-aura" />

            {!imagemErro ? (
              <img
                key={selecionada.imagem}
                src={selecionada.imagem}
                alt={selecionada.nome}
                className="transformation-image"
                onError={() => setImagemErro(true)}
              />
            ) : (
              <div className="transformation-image-placeholder">
                <span>IMAGEM NÃO ENCONTRADA</span>
                <strong>{selecionada.nome}</strong>
                <small>
                  {selecionada.imagem}
                </small>
              </div>
            )}
          </div>
        </article>
      </div>

      <div className="transformation-controls">
        <div className="transformation-slider-group">
          <label htmlFor="power-base">
            Poder base
            <strong>{poderBase.toLocaleString("pt-BR")}</strong>
          </label>

          <input
            id="power-base"
            type="range"
            min="100"
            max="100000"
            step="100"
            value={poderBase}
            onChange={(event) => setPoderBase(Number(event.target.value))}
          />

          <div className="transformation-range-labels">
            <span>100</span>
            <span>100.000</span>
          </div>
        </div>

        {selecionada.multiplicador === null && (
          <div className="transformation-slider-group">
            <label htmlFor="power-divine">
              Poder divino
              <strong>{poderDivino.toLocaleString("pt-BR")}</strong>
            </label>

            <input
              id="power-divine"
              type="range"
              min="1000"
              max="100000000"
              step="1000"
              value={poderDivino}
              onChange={(event) =>
                setPoderDivino(Number(event.target.value))
              }
            />

            <div className="transformation-range-labels">
              <span>1.000</span>
              <span>100.000.000</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className="transformation-reset"
          onClick={reiniciar}
        >
          ↻ Reiniciar simulador
        </button>
      </div>
    </section>
  )
}