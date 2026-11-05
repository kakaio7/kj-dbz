import { useEffect, useMemo, useState } from 'react'
import { racas } from './data/racas'
import Scouter from './components/Race/Scouter'
import TransformationSimulator from './features/transformations/TransformationSimulator'
import DragonBalls from './features/collection/DragonBalls'
import Button from './components/ui/Button'
import SafeImage from './components/ui/SafeImage'
import { APP_CONFIG } from './config/app'
import { readStoredNumberArray, writeStoredNumberArray } from './utils/storage'
import './App.css'

const FAVORITES_KEY = APP_CONFIG.storageKeys.favorites

function FavoriteStar({ filled = false }) {
  return (
    <svg
      className={`favorite-star ${filled ? 'is-filled' : ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m12 2.8 2.84 5.76 6.36.92-4.6 4.49 1.09 6.33L12 17.31l-5.69 2.99 1.09-6.33-4.6-4.49 6.36-.92L12 2.8Z" />
    </svg>
  )
}

export default function App() {
  const [busca, setBusca] = useState('')
  const [origem, setOrigem] = useState('todas')
  const [ordem, setOrdem] = useState('az')
  const [somenteFavoritas, setSomenteFavoritas] = useState(false)
  const [selecionada, setSelecionada] = useState(null)
  const [alvoScouterId, setAlvoScouterId] = useState(String(racas[0]?.id ?? ''))

  const [favoritos, setFavoritos] = useState(() => readStoredNumberArray(FAVORITES_KEY))

  const alvoScouter = racas.find((raca) => raca.id === Number(alvoScouterId)) ?? null

  useEffect(() => {
    writeStoredNumberArray(FAVORITES_KEY, favoritos)
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
      ].join(' ').toLowerCase()

      const correspondeBusca = texto.includes(busca.toLowerCase().trim())
      const correspondeOrigem = origem === 'todas' || raca.origem === origem
      const correspondeFavorito = !somenteFavoritas || favoritos.includes(raca.id)

      return correspondeBusca && correspondeOrigem && correspondeFavorito
    })

    return [...lista].sort((a, b) =>
      ordem === 'za' ? b.raca.localeCompare(a.raca) : a.raca.localeCompare(b.raca)
    )
  }, [busca, origem, ordem, somenteFavoritas, favoritos])

  const temFiltrosAtivos = Boolean(
    busca.trim() || origem !== 'todas' || ordem !== 'az' || somenteFavoritas
  )

  function alternarFavorito(id) {
    setFavoritos((atuais) => {
      const numericId = Number(id)
      return atuais.includes(numericId)
        ? atuais.filter((item) => item !== numericId)
        : [...atuais, numericId]
    })
  }

  function rolarAte(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  function sortearRaca() {
    const lista = listaFiltrada.length ? listaFiltrada : racas
    const sorteada = lista[Math.floor(Math.random() * lista.length)]

    if (!sorteada) return

    setSelecionada(sorteada)
    setTimeout(() => rolarAte('ficha-raca'), 50)
  }

  function abrirFicha(raca) {
    setSelecionada(raca)
    setTimeout(() => rolarAte('ficha-raca'), 50)
  }

  function limparFiltros() {
    setBusca('')
    setOrigem('todas')
    setOrdem('az')
    setSomenteFavoritas(false)
  }

  return (
    <main className="app-shell" id="topo">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#topo" aria-label="KJ-DBZ início">
          <img className="brand-mark" src="/favicon.svg" alt="" />
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
            Descubra as raças, habilidades e origens que formam o universo de Dragon Ball. Pesquise, filtre e monte sua própria coleção.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#explorar">
              Explorar raças <span>↘</span>
            </a>

            <Button variant="ghost" onClick={sortearRaca}>🎲 Sortear raça</Button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>{String(racas.length).padStart(2, '0')}</strong>
              <span>RAÇAS NO ARQUIVO</span>
            </div>
            <div>
              <strong>{String(favoritos.length).padStart(2, '0')}</strong>
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
          <div className="energy-core">KJ<span>DBZ</span></div>
          <span className="floating-label label-top">POWER // UNKNOWN</span>
          <span className="floating-label label-bottom">UNIVERSE DATABASE</span>
        </div>
      </section>

      <section className="scouter-section" id="scouter">
        <div className="scouter-section-copy">
          <p className="eyebrow">TECNOLOGIA SAIYAJIN // Z-09</p>
          <h2>SCOUTER DE <span>PODER</span></h2>
          <p>Escolha uma raça, trave o alvo e faça uma leitura de ki com um scouter inspirado no equipamento dos Saiyajins.</p>

          <label className="scouter-target-select">
            SELECIONE O ALVO
            <select value={alvoScouterId} onChange={(event) => setAlvoScouterId(event.target.value)}>
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
            <h2>Arquivo de <span>raças</span></h2>
            <p className="explore-intro">
              Escolha um povo do universo e descubra sua origem, seus dons e sua energia.
            </p>
          </div>
          <div className="explore-count" aria-live="polite">
            <strong>{String(listaFiltrada.length).padStart(2, '0')}</strong>
            <span>de {racas.length} registros</span>
          </div>
        </div>

        <div className="toolbar">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Ex.: Saiyajin, Namekusei, regeneração..."
              aria-label="Buscar raças por nome, origem ou habilidade"
            />

            {busca && (
              <button type="button" onClick={() => setBusca('')} aria-label="Limpar busca">
                ×
              </button>
            )}
          </label>

          <div className="toolbar-controls">
            <label className="toolbar-field">
              <span>ORIGEM</span>
              <select value={origem} onChange={(event) => setOrigem(event.target.value)} aria-label="Filtrar por origem">
                <option value="todas">Todas as origens</option>
                {origens.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="toolbar-field">
              <span>ORDENAR</span>
              <select value={ordem} onChange={(event) => setOrdem(event.target.value)} aria-label="Ordenar raças">
                <option value="az">Nome: A → Z</option>
                <option value="za">Nome: Z → A</option>
              </select>
            </label>

            <button
              type="button"
              className={`filter-favorites ${somenteFavoritas ? 'active' : ''}`}
              onClick={() => setSomenteFavoritas((atual) => !atual)}
              aria-pressed={somenteFavoritas}
            >
              <FavoriteStar filled={somenteFavoritas} />
              Favoritas
              <b>{favoritos.length}</b>
            </button>
          </div>
        </div>

        {temFiltrosAtivos && (
          <div className="active-filters">
            <span>
              {somenteFavoritas ? 'Exibindo favoritas' : 'Filtros aplicados'}
              {busca.trim() ? ` · “${busca.trim()}”` : ''}
              {origem !== 'todas' ? ` · ${origem}` : ''}
            </span>
            <button type="button" onClick={limparFiltros}>Limpar filtros <b>×</b></button>
          </div>
        )}

        {listaFiltrada.length > 0 ? (
          <div className="race-grid">
            {listaFiltrada.map((raca, index) => {
              const favorita = favoritos.includes(raca.id)
              const escolhida = selecionada?.id === raca.id

              return (
                <article
                  className={`race-tile ${escolhida ? 'chosen' : ''}`}
                  key={raca.id}
                  style={{ '--delay': `${Math.min(index, 12) * 35}ms`, '--card-index': index }}
                >
                  <div className="tile-toolbar">
                    <span className="tile-kicker">{escolhida ? 'ALVO SELECIONADO' : 'RAÇA CATALOGADA'}</span>
                    <button
                      type="button"
                      className={`favorite-button ${favorita ? 'is-favorite' : ''}`}
                      onClick={() => alternarFavorito(raca.id)}
                      aria-label={favorita ? `Remover ${raca.raca} dos favoritos` : `Favoritar ${raca.raca}`}
                      aria-pressed={favorita}
                      title={favorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <FavoriteStar filled={favorita} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="tile-main"
                    onClick={() => abrirFicha(raca)}
                    aria-pressed={escolhida}
                    aria-label={`Ver ficha de ${raca.raca}, origem ${raca.origem}`}
                  >
                    <div className="tile-image">
                      <SafeImage
                        src={raca.imagem}
                        alt={raca.raca}
                        className="tile-image-element"
                        fallbackText="IMAGEM INDISPONÍVEL"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="tile-number">#{String(raca.id).padStart(3, '0')}</span>
                      <span className="tile-origin">{raca.origem}</span>
                    </div>

                    <div className="tile-info">
                      <h3>{raca.raca}</h3>
                      <p>{raca.habilidade}</p>
                      <span className="tile-link">
                        <span>{escolhida ? 'FICHA ABERTA' : 'EXPLORAR FICHA'}</span>
                        <b aria-hidden="true">{escolhida ? '✓' : '↗'}</b>
                      </span>
                    </div>
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <span aria-hidden="true">⌕</span>
            <h3>Nenhuma raça encontrada</h3>
            <p>Tente outro nome ou remova os filtros aplicados.</p>
            <Button onClick={limparFiltros}>Limpar filtros</Button>
          </div>
        )}
      </section>

      <section className="detail-section" id="ficha-raca">
        <div className="section-heading">
          <div>
            <p className="eyebrow">REGISTRO DETALHADO</p>
            <h2>Ficha da <span>raça</span></h2>
          </div>
          <span className="classified">▣ ARQUIVO // DBZ</span>
        </div>

        {selecionada ? (
          <div className="detail-card">
            <div className="detail-portrait">
              <SafeImage
                src={selecionada.imagem}
                alt={selecionada.raca}
                className="detail-image"
                fallbackText="IMAGEM INDISPONÍVEL"
                decoding="async"
              />
              <span>REGISTRO #{String(selecionada.id).padStart(3, '0')}</span>
            </div>

            <div className="detail-content">
              <div className="detail-title-row">
                <div>
                  <p className="eyebrow">DADOS CONFIRMADOS</p>
                  <h3>{selecionada.raca}</h3>
                </div>

                <button type="button" className={`detail-fav ${favoritos.includes(selecionada.id) ? 'is-favorite' : ''}`} onClick={() => alternarFavorito(selecionada.id)}>
                  <FavoriteStar filled={favoritos.includes(selecionada.id)} />
                  {favoritos.includes(selecionada.id) ? 'Salva nos favoritos' : 'Adicionar aos favoritos'}
                </button>
              </div>

              <p className="detail-description">Informações catalogadas sobre esta raça no universo de Dragon Ball.</p>

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

              <Button variant="ghost" onClick={() => setSelecionada(null)}>Fechar ficha ×</Button>
            </div>
          </div>
        ) : (
          <div className="detail-placeholder">
            <span className="placeholder-icon">⌁</span>
            <div>
              <h3>Selecione uma raça para acessar o registro</h3>
              <p>Clique em qualquer card do arquivo para visualizar os dados completos.</p>
            </div>
          </div>
        )}
      </section>

      <footer id="sobre">
        <a className="brand footer-brand" href="#topo">
          <img className="brand-mark" src="/favicon.svg" alt="" />
          <span>
            KJ<span className="brand-accent">-DBZ</span>
            <small>DATABASE // MULTIVERSO</small>
          </span>
        </a>

        <p>Projeto de fã, sem vínculo oficial com Dragon Ball ou seus detentores.</p>

        <a href="#topo" className="back-top">VOLTAR AO TOPO ↑</a>
      </footer>
    </main>
  )
}
