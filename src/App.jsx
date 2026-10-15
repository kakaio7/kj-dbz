import { useEffect, useMemo, useState } from "react"
import { racas } from "./data/racas"
import Scouter from "./components/Race/Scouter"
import TransformationSimulator from "./components/TransformationSimulator"
import DragonBalls from "./components/DragonBalls"
import "./App.css"

const FAVORITES_KEY = "kj-dbz-favorites-v1"

export default function App() {
  const [busca, setBusca] = useState("")
  const [origem, setOrigem] = useState("todas")
  const [ordem, setOrdem] = useState("az")
  const [somenteFavoritas, setSomenteFavoritas] = useState(false)
  const [selecionada, setSelecionada] = useState(null)
  const [alvoScouterId, setAlvoScouterId] = useState(
    String(racas[0]?.id ?? "")
  )

  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
    } catch {
      return []
    }
  })

  const alvoScouter = racas.find(
    (raca) => raca.id === Number(alvoScouterId)
  ) ?? null

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos))
  }, [favoritos])

  const origens = useMemo(
    () => [...new Set(racas.map((raca) => raca.origem))].sort(),
    []
  )

  const listaFiltrada = useMemo(() => {
    const lista = racas.filter((raca) => {
      const texto = [
        raca.raca,
        raca.origem,
        raca.habilidade,
        raca.personalidade,
        raca.transformacoes
      ].join(" ").toLowerCase()

      const correspondeBusca = texto.includes(busca.toLowerCase().trim())
      const correspondeOrigem =
        origem === "todas" || raca.origem === origem
      const correspondeFavorito =
        !somenteFavoritas || favoritos.includes(raca.id)

      return correspondeBusca && correspondeOrigem && correspondeFavorito
    })

    return [...lista].sort((a, b) =>
      ordem === "za"
        ? b.raca.localeCompare(a.raca)
        : a.raca.localeCompare(b.raca)
    )
  }, [busca, origem, ordem, somenteFavoritas, favoritos])

  function alternarFavorito(id) {
    setFavoritos((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    )
  }

  function rolarAte(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  function sortearRaca() {
    const lista = listaFiltrada.length ? listaFiltrada : racas
    const sorteada = lista[Math.floor(Math.random() * lista.length)]

    if (!sorteada) return

    setSelecionada(sorteada)

    setTimeout(() => {
      rolarAte("ficha-raca")
    }, 50)
  }

  function abrirFicha(raca) {
    setSelecionada(raca)

    setTimeout(() => {
      rolarAte("ficha-raca")
    }, 50)
  }

  function limparFiltros() {
    setBusca("")
    setOrigem("todas")
    setOrdem("az")
    setSomenteFavoritas(false)
  }

  return (
    <main className="app-shell" id="topo">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#topo" aria-label="KJ-DBZ início">
          <span className="brand-mark">KJ</span>

          <span>
            KJ<span className="brand-accent">-DBZ</span>
            <small>DATABASE // MULTIVERSO</small>
          </span>
        </a>

        <nav aria-label="Navegação principal">
          <a href="#explorar">Explorar</a>
          <a href="#scouter">Scouter</a>
          <a href="#transformacoes">Transformações</a>
          <a href="#esferas">Esferas do Dragão</a>
          <a href="#ficha-raca">Ficha da raça</a>
        </nav>

        <div className="top-status">
          <span className="status-dot" />
          SISTEMA ONLINE
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ARQUIVO INTERGALÁCTICO // 001</p>

          <h1>
            EXPLORE O
            <br />
            <span>MULTIVERSO</span>
          </h1>

          <p className="hero-description">
            Descubra as raças, habilidades e origens que formam o universo
            de Dragon Ball. Pesquise, filtre e monte sua própria coleção.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#explorar">
              Explorar raças <span>↘</span>
            </a>

            <button
              className="button button-ghost"
              type="button"
              onClick={sortearRaca}
            >
              🎲 Sortear raça
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{String(racas.length).padStart(2, "0")}</strong>
              <span>RAÇAS NO ARQUIVO</span>
            </div>

            <div>
              <strong>{String(favoritos.length).padStart(2, "0")}</strong>
              <span>FAVORITAS</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>POSSIBILIDADES</span>
            </div>
          </div>
        </div>

        <div className="hero-art" aria-label="Energia KJ-DBZ">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />

          <div className="energy-core">
            KJ<span>DBZ</span>
          </div>

          <span className="floating-label label-top">
            POWER // UNKNOWN
          </span>

          <span className="floating-label label-bottom">
            UNIVERSE DATABASE
          </span>
        </div>
      </section>

      <section className="scouter-section" id="scouter">
        <div className="scouter-section-copy">
          <p className="eyebrow">TECNOLOGIA SAIYAJIN // Z-09</p>

          <h2>
            SCOUTER DE <span>PODER</span>
          </h2>

          <p>
            Escolha uma raça, trave o alvo e faça uma leitura de ki com
            um scouter inspirado no equipamento dos Saiyajins.
          </p>

          <label className="scouter-target-select">
            SELECIONE O ALVO

            <select
              value={alvoScouterId}
              onChange={(event) => setAlvoScouterId(event.target.value)}
            >
              {racas.map((raca) => (
                <option key={raca.id} value={raca.id}>
                  {raca.raca} — {raca.origem}
                </option>
              ))}
            </select>
          </label>

          <div className="scouter-tip">
            <span>●</span> LEITURA SIMULADA // VALORES FICTÍCIOS
          </div>
        </div>

        <Scouter raca={alvoScouter} />
      </section>

      <TransformationSimulator />

      <DragonBalls />

      <section className="explore-section" id="explorar">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BANCO DE DADOS</p>
            <h2>
              Arquivo de <span>raças</span>
            </h2>
          </div>

          <p className="result-count">
            {listaFiltrada.length} RESULTADO(S) ENCONTRADO(S)
          </p>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <span>⌕</span>

            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar raça, habilidade, origem..."
              aria-label="Buscar raças"
            />

            {busca && (
              <button
                type="button"
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
              >
                ×
              </button>
            )}
          </label>

          <select
            value={origem}
            onChange={(event) => setOrigem(event.target.value)}
            aria-label="Filtrar por origem"
          >
            <option value="todas">Todas as origens</option>

            {origens.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={ordem}
            onChange={(event) => setOrdem(event.target.value)}
            aria-label="Ordenar raças"
          >
            <option value="az">Nome: A → Z</option>
            <option value="za">Nome: Z → A</option>
          </select>

          <button
            type="button"
            className={`filter-favorites ${
              somenteFavoritas ? "active" : ""
            }`}
            onClick={() => setSomenteFavoritas((atual) => !atual)}
          >
            ★ Favoritas <span>{favoritos.length}</span>
          </button>
        </div>

        {listaFiltrada.length > 0 ? (
          <div className="race-grid">
            {listaFiltrada.map((raca, index) => {
              const favorita = favoritos.includes(raca.id)
              const escolhida = selecionada?.id === raca.id

              return (
                <article
                  className={`race-tile ${escolhida ? "chosen" : ""}`}
                  key={raca.id}
                  style={{
                    "--delay": `${Math.min(index, 12) * 35}ms`
                  }}
                >
                  <button
                    type="button"
                    className={`favorite-button ${
                      favorita ? "is-favorite" : ""
                    }`}
                    onClick={() => alternarFavorito(raca.id)}
                    aria-label={
                      favorita
                        ? `Remover ${raca.raca} dos favoritos`
                        : `Favoritar ${raca.raca}`
                    }
                    title={
                      favorita
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                    }
                  >
                    {favorita ? "★" : "☆"}
                  </button>

                  <button
                    type="button"
                    className="tile-main"
                    onClick={() => abrirFicha(raca)}
                  >
                    <div className="tile-image">
                      <img
                        src={raca.imagem}
                        alt={raca.raca}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none"
                        }}
                      />

                      <span className="tile-number">
                        #{String(raca.id).padStart(3, "0")}
                      </span>
                    </div>

                    <div className="tile-info">
                      <span className="tile-kicker">
                        RAÇA CATALOGADA
                      </span>

                      <h3>{raca.raca}</h3>
                      <p>{raca.habilidade}</p>

                      <span className="tile-link">
                        VER FICHA <b>↗</b>
                      </span>
                    </div>
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>Nenhuma raça encontrada</h3>

            <p>
              Tente outro nome ou remova os filtros aplicados.
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <section className="detail-section" id="ficha-raca">
        <div className="section-heading">
          <div>
            <p className="eyebrow">REGISTRO DETALHADO</p>
            <h2>
              Ficha da <span>raça</span>
            </h2>
          </div>

          <span className="classified">▣ ARQUIVO // DBZ</span>
        </div>

        {selecionada ? (
          <div className="detail-card">
            <div className="detail-portrait">
              <img
                src={selecionada.imagem}
                alt={selecionada.raca}
              />

              <span>
                REGISTRO #{String(selecionada.id).padStart(3, "0")}
              </span>
            </div>

            <div className="detail-content">
              <div className="detail-title-row">
                <div>
                  <p className="eyebrow">DADOS CONFIRMADOS</p>
                  <h3>{selecionada.raca}</h3>
                </div>

                <button
                  type="button"
                  className={`detail-fav ${
                    favoritos.includes(selecionada.id)
                      ? "is-favorite"
                      : ""
                  }`}
                  onClick={() => alternarFavorito(selecionada.id)}
                >
                  {favoritos.includes(selecionada.id)
                    ? "★ Salva nos favoritos"
                    : "☆ Adicionar aos favoritos"}
                </button>
              </div>

              <p className="detail-description">
                Informações catalogadas sobre esta raça no universo
                de Dragon Ball.
              </p>

              <div className="detail-facts">
                <div>
                  <span>ORIGEM</span>
                  <strong>{selecionada.origem}</strong>
                </div>

                <div>
                  <span>HABILIDADE PRINCIPAL</span>
                  <strong>{selecionada.habilidade}</strong>
                </div>

                <div>
                  <span>PERSONALIDADE</span>
                  <strong>{selecionada.personalidade}</strong>
                </div>

                <div>
                  <span>TRANSFORMAÇÕES</span>
                  <strong>{selecionada.transformacoes}</strong>
                </div>
              </div>

              <button
                type="button"
                className="button button-ghost"
                onClick={() => setSelecionada(null)}
              >
                Fechar ficha ×
              </button>
            </div>
          </div>
        ) : (
          <div className="detail-placeholder">
            <span className="placeholder-icon">⌁</span>

            <div>
              <h3>Selecione uma raça para acessar o registro</h3>

              <p>
                Clique em qualquer card do arquivo para visualizar
                os dados completos.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer id="sobre">
        <a className="brand footer-brand" href="#topo">
          <span className="brand-mark">KJ</span>

          <span>
            KJ<span className="brand-accent">-DBZ</span>
            <small>DATABASE // MULTIVERSO</small>
          </span>
        </a>

        <p>
          Projeto de fã, sem vínculo oficial com Dragon Ball ou seus
          detentores.
        </p>

        <a href="#topo" className="back-top">
          VOLTAR AO TOPO ↑
        </a>
      </footer>
    </main>
  )
}