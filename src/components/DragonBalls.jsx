import { useEffect, useMemo, useState } from "react"
import "./DragonBalls.css"

const STORAGE_KEY = "kj-dbz-dragon-balls-v1"
const BALLS = Array.from({ length: 7 }, (_, index) => ({ id: index + 1, name: `Esfera de ${index + 1} estrela${index === 0 ? "" : "s"}`, image: `/images/dragon-balls/esfera-${index + 1}.svg`, challenge: ["Encontre a primeira esfera no arquivo de raças.", "Faça uma leitura no Scouter.", "Abra a ficha de uma raça.", "Favorite uma raça Saiyajin ou outra raça.", "Explore o simulador de transformações.", "Compare duas formas Saiyajin.", "Complete sua coleção e invoque Shenlong."][index] }))

function readCollection() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}

export default function DragonBalls() {
  const [collected, setCollected] = useState(readCollection)
  const [notice, setNotice] = useState("")
  const [confirmReset, setConfirmReset] = useState(false)
  const complete = collected.length === 7
  const progress = useMemo(() => Math.round((collected.length / 7) * 100), [collected])

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(collected)) }, [collected])

  function toggleBall(id) {
    const isCollected = collected.includes(id)
    setCollected((current) => isCollected ? current.filter((item) => item !== id) : [...current, id].sort((a, b) => a - b))
    setNotice(isCollected ? `Esfera ${id} removida da coleção.` : `Esfera ${id} adicionada à coleção!`)
    setConfirmReset(false)
  }

  function resetCollection() {
    setCollected([])
    setNotice("Coleção reiniciada. Boa sorte na busca!")
    setConfirmReset(false)
  }

  return (
    <section className="feature-section dragon-section" id="esferas">
      <div className="feature-heading"><div><p className="eyebrow">BUSCA MÍSTICA // DB-07</p><h2>COLEÇÃO DAS <span>ESFERAS DO DRAGÃO</span></h2></div><span className="dragon-count">{collected.length.toString().padStart(2, "0")} / 07 COLETADAS</span></div>
      <p className="feature-intro">Reúna as sete Esferas do Dragão para completar sua coleção. Clique em uma esfera para marcar ou desmarcar como encontrada. Seu progresso fica salvo neste navegador.</p>
      <div className="dragon-progress"><div className="dragon-progress-track"><span style={{ width: `${progress}%` }} /></div><div className="dragon-progress-labels"><span>PROGRESSO DA COLEÇÃO</span><strong>{progress}%</strong></div></div>
      <div className="dragon-grid">{BALLS.map((ball) => { const hasBall = collected.includes(ball.id); return <article className={`dragon-ball-card ${hasBall ? "collected" : ""}`} key={ball.id}>
        <button className="dragon-ball-button" onClick={() => toggleBall(ball.id)} aria-pressed={hasBall} aria-label={`${hasBall ? "Remover" : "Coletar"} ${ball.name}`}>
          <div className="dragon-ball-art"><div className="dragon-ball-glow"/><img src={ball.image} alt={ball.name} onError={(event) => { event.currentTarget.style.display = "none" }}/><div className="ball-placeholder"><span>{"★".repeat(ball.id)}</span><small>ESFERA {ball.id}</small></div><span className="ball-check">{hasBall ? "✓" : "+"}</span></div>
          <div className="dragon-ball-info"><span className="ball-number">ESFERA // 0{ball.id}</span><h3>{ball.name}</h3><p>{hasBall ? "Adicionada à coleção" : "Ainda não coletada"}</p></div>
        </button>
        <div className="ball-challenge"><span>MISSÃO SUGERIDA</span><p>{ball.challenge}</p><button onClick={() => toggleBall(ball.id)}>{hasBall ? "Desmarcar" : "Marcar como encontrada"}</button></div>
      </article> })}</div>
      {notice && <p className="dragon-notice" role="status">{notice}</p>}
      {complete ? <div className="shenlong-unlocked"><div className="shenlong-symbol">龍</div><div><p className="eyebrow">COLEÇÃO COMPLETA</p><h3>As sete esferas foram reunidas!</h3><p>Shenlong foi invocado — imagine seu desejo e continue explorando o universo KJ-DBZ.</p></div><span className="wish-stamp">DESEJO<br/>DESBLOQUEADO</span></div> : <div className="dragon-locked"><span>龍</span><div><strong>Shenlong aguarda sua coleção</strong><p>Faltam {7 - collected.length} esfera(s) para completar o conjunto.</p></div></div>}
      <div className="dragon-actions">{confirmReset ? <><span>Tem certeza que deseja apagar seu progresso?</span><button onClick={resetCollection}>Sim, reiniciar</button><button className="subtle-button" onClick={() => setConfirmReset(false)}>Cancelar</button></> : <button className="subtle-button" onClick={() => setConfirmReset(true)}>↻ Reiniciar coleção</button>}</div>
    </section>
  )
}
