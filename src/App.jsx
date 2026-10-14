import { useMemo, useState, useEffect } from "react"
import { racas } from "./data/racas"
import Scouter from "./components/Race/Scouter"
import "./App.css"

const FAVORITES_KEY = "kj-dbz-favorites-v1"

export default function App() {
  const [busca, setBusca] = useState("")
  const [origem, setOrigem] = useState("todas")
  const [ordem, setOrdem] = useState("az")
  const [somenteFavoritas, setSomenteFavoritas] = useState(false)
  const [selecionada, setSelecionada] = useState(null)
  const [alvoScouterId, setAlvoScouterId] = useState(String(racas[0]?.id ?? ""))
  const alvoScouter = racas.find((raca) => raca.id === Number(alvoScouterId)) ?? null
  const [favoritos, setFavoritos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos))
  }, [favoritos])

  const origens = useMemo(() => [...new Set(racas.map((r) => r.origem))].sort(), [])
  const listaFiltrada = useMemo(() => {
    let lista = racas.filter((raca) => {
      const texto = `${raca.raca} ${raca.origem} ${raca.habilidade} ${raca.personalidade} ${raca.transformacoes}`.toLowerCase()
      return texto.includes(busca.toLowerCase().trim()) &&
        (origem === "todas" || raca.origem === origem) &&
        (!somenteFavoritas || favoritos.includes(raca.id))
    })
    return [...lista].sort((a, b) => ordem === "za" ? b.raca.localeCompare(a.raca) : a.raca.localeCompare(b.raca))
  }, [busca, origem, ordem, somenteFavoritas, favoritos])

  function alternarFavorito(id) {
    setFavoritos((atuais) => atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id])
  }

  function sortearRaca() {
    const lista = listaFiltrada.length ? listaFiltrada : racas
    setSelecionada(lista[Math.floor(Math.random() * lista.length)])
    document.querySelector("#ficha-raca")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#topo" aria-label="KJ-DBZ início"><span className="brand-mark">KJ</span><span>KJ<span className="brand-accent">-DBZ</span><small>DATABASE // MULTIVERSO</small></span></a>
        <nav><a href="#explorar">Explorar</a><a href="#scouter">Scouter</a><a href="#ficha-raca">Ficha da raça</a><a href="#sobre">Sobre</a></nav>
        <div className="top-status"><span className="status-dot" /> SISTEMA ONLINE</div>
      </header>

      <section className="hero" id="topo">
        <div className="hero-copy"><p className="eyebrow">ARQUIVO INTERGALÁCTICO // 001</p>
          <h1>EXPLORE O<br /><span>MULTIVERSO</span></h1>
          <p className="hero-description">Descubra as raças, habilidades e origens que formam o universo de Dragon Ball. Pesquise, filtre e monte sua própria coleção.</p>
          <div className="hero-actions"><a className="button button-primary" href="#explorar">Explorar raças <span>↘</span></a><button className="button button-ghost" onClick={sortearRaca}>🎲 Sortear raça</button></div>
          <div className="hero-stats"><div><strong>{racas.length.toString().padStart(2, "0")}</strong><span>RAÇAS NO ARQUIVO</span></div><div><strong>{favoritos.length.toString().padStart(2, "0")}</strong><span>FAVORITAS</span></div><div><strong>∞</strong><span>POSSIBILIDADES</span></div></div>
        </div>
        <div className="hero-art" aria-label="Ilustração abstrata de energia"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="energy-core">KJ<span>DBZ</span></div><span className="floating-label label-top">POWER // UNKNOWN</span><span className="floating-label label-bottom">UNIVERSE DATABASE</span></div>
      </section>

      <section className="scouter-section" id="scouter">
        <div className="scouter-section-copy">
          <p className="eyebrow">TECNOLOGIA SAIYAJIN // Z-09</p>
          <h2>SCOUTER DE <span>PODER</span></h2>
          <p>Escolha uma raça, trave o alvo e faça uma leitura de ki com um scouter inspirado no equipamento dos Saiyajins.</p>
          <label className="scouter-target-select">SELECIONE O ALVO
            <select value={alvoScouterId} onChange={(e) => setAlvoScouterId(e.target.value)}>
              {racas.map((raca) => <option key={raca.id} value={raca.id}>{raca.raca} — {raca.origem}</option>)}
            </select>
          </label>
          <div className="scouter-tip"><span>●</span> LEITURA SIMULADA // VALORES FICTÍCIOS</div>
        </div>
        <Scouter raca={alvoScouter} />
      </section>

      <section className="explore-section" id="explorar">
        <div className="section-heading"><div><p className="eyebrow">BANCO DE DADOS</p><h2>Arquivo de <span>raças</span></h2></div><p className="result-count">{listaFiltrada.length} RESULTADO(S) ENCONTRADO(S)</p></div>
        <div className="toolbar">
          <label className="search-box"><span>⌕</span><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar raça, habilidade, origem..." aria-label="Buscar raças" />{busca && <button onClick={() => setBusca("")} aria-label="Limpar busca">×</button>}</label>
          <select value={origem} onChange={(e) => setOrigem(e.target.value)} aria-label="Filtrar por origem"><option value="todas">Todas as origens</option>{origens.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select value={ordem} onChange={(e) => setOrdem(e.target.value)} aria-label="Ordenar raças"><option value="az">Nome: A → Z</option><option value="za">Nome: Z → A</option></select>
          <button className={`filter-favorites ${somenteFavoritas ? "active" : ""}`} onClick={() => setSomenteFavoritas(!somenteFavoritas)}>★ Favoritas <span>{favoritos.length}</span></button>
        </div>

        {listaFiltrada.length ? <div className="race-grid">{listaFiltrada.map((raca, index) => {
          const favorita = favoritos.includes(raca.id)
          return <article className={`race-tile ${selecionada?.id === raca.id ? "chosen" : ""}`} key={raca.id} style={{ "--delay": `${Math.min(index, 12) * 35}ms` }}>
            <button className={`favorite-button ${favorita ? "is-favorite" : ""}`} onClick={() => alternarFavorito(raca.id)} aria-label={favorita ? `Remover ${raca.raca} dos favoritos` : `Favoritar ${raca.raca}`} title={favorita ? "Remover dos favoritos" : "Adicionar aos favoritos"}>{favorita ? "★" : "☆"}</button>
            <button className="tile-main" onClick={() => { setSelecionada(raca); setTimeout(() => document.querySelector("#ficha-raca")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50) }}>
              <div className="tile-image"><img src={raca.imagem} alt={raca.raca} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} /><span className="tile-number">#{String(raca.id).padStart(3, "0")}</span></div>
              <div className="tile-info"><span className="tile-kicker">RAÇA CATALOGADA</span><h3>{raca.raca}</h3><p>{raca.habilidade}</p><span className="tile-link">VER FICHA <b>↗</b></span></div>
            </button>
          </article>
        })}</div> : <div className="empty-state"><span>⌕</span><h3>Nenhuma raça encontrada</h3><p>Tente outro nome ou remova os filtros aplicados.</p><button className="button button-primary" onClick={() => { setBusca(""); setOrigem("todas"); setSomenteFavoritas(false) }}>Limpar filtros</button></div>}
      </section>

      <section className="detail-section" id="ficha-raca">
        <div className="section-heading"><div><p className="eyebrow">REGISTRO DETALHADO</p><h2>Ficha da <span>raça</span></h2></div><span className="classified">▣ ARQUIVO // DBZ</span></div>
        {selecionada ? <div className="detail-card"><div className="detail-portrait"><img src={selecionada.imagem} alt={selecionada.raca} /><span>REGISTRO #{String(selecionada.id).padStart(3, "0")}</span></div><div className="detail-content"><div className="detail-title-row"><div><p className="eyebrow">DADOS CONFIRMADOS</p><h3>{selecionada.raca}</h3></div><button className={`detail-fav ${favoritos.includes(selecionada.id) ? "is-favorite" : ""}`} onClick={() => alternarFavorito(selecionada.id)}>{favoritos.includes(selecionada.id) ? "★ Salva nos favoritos" : "☆ Adicionar aos favoritos"}</button></div><p className="detail-description">Informações catalogadas sobre esta raça no universo de Dragon Ball.</p><div className="detail-facts"><div><span>ORIGEM</span><strong>{selecionada.origem}</strong></div><div><span>HABILIDADE PRINCIPAL</span><strong>{selecionada.habilidade}</strong></div><div><span>PERSONALIDADE</span><strong>{selecionada.personalidade}</strong></div><div><span>TRANSFORMAÇÕES</span><strong>{selecionada.transformacoes}</strong></div></div><button className="button button-ghost" onClick={() => setSelecionada(null)}>Fechar ficha ×</button></div></div> : <div className="detail-placeholder"><span className="placeholder-icon">⌁</span><div><h3>Selecione uma raça para acessar o registro</h3><p>Clique em qualquer card do arquivo para visualizar os dados completos.</p></div></div>}
      </section>

      <footer id="sobre"><a className="brand footer-brand" href="#topo"><span className="brand-mark">KJ</span><span>KJ<span className="brand-accent">-DBZ</span><small>DATABASE // MULTIVERSO</small></span></a><p>Projeto de fã, sem vínculo oficial com Dragon Ball ou seus detentores.</p><a href="#topo" className="back-top">VOLTAR AO TOPO ↑</a></footer>
    </main>
  )
}
