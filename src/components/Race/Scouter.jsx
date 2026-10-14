import { useEffect, useRef, useState } from "react"
import "./Scouter.css"

const POWER_LEVELS = {
  Saiyajin: [8500, 15000],
  Namekuseijin: [3200, 9000],
  Majin: [12000, 50000],
  "Shin-Jin": [18000, 75000],
  Anjo: [900000, 999999],
  Arcosiano: [7000, 120000],
  Androide: [10000, 65000],
  Humano: [5, 1800],
  Dragão: [50000, 300000],
  Animal: [10, 900],
  Ogro: [500, 4000],
  "Homem Peixe": [300, 2500],
  "Alpha-Seijin": [700, 5000],
  "Ankoku-Seijin": [1200, 12000],
  Apur: [400, 3500],
  Arliano: [200, 2200],
  Bas: [600, 5000],
  Beenz: [800, 6500],
  "Beppa-Seijin": [500, 4200],
  Boter: [900, 7000],
  Fada: [100, 3000],
  Saibaiman: [1200, 1800],
}

const formatPower = (value) => new Intl.NumberFormat("pt-BR").format(value)

export default function Scouter({ raca }) {
  const [scanning, setScanning] = useState(false)
  const [power, setPower] = useState(null)
  const [status, setStatus] = useState("AGUARDANDO ALVO")
  const timerRef = useRef(null)

  useEffect(() => {
    setPower(null)
    setScanning(false)
    setStatus(raca ? "ALVO DETECTADO — PRONTO PARA ESCANEAR" : "AGUARDANDO ALVO")
    return () => window.clearTimeout(timerRef.current)
  }, [raca])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const scanPower = () => {
    if (!raca || scanning) return
    setScanning(true)
    setPower(null)
    setStatus("ESCANEANDO NÍVEL DE ENERGIA...")

    timerRef.current = window.setTimeout(() => {
      const [min, max] = POWER_LEVELS[raca.raca] ?? [100, 10000]
      const reading = Math.floor(min + Math.random() * (max - min + 1))
      setPower(reading)
      setScanning(false)
      setStatus(reading >= 50000 ? "⚠ NÍVEL DE PODER EXTREMO" : reading >= 10000 ? "NÍVEL DE PODER ELEVADO" : "LEITURA CONCLUÍDA")
    }, 1650)
  }

  return (
    <section className={`scouter-panel ${scanning ? "is-scanning" : ""}`} aria-label="Scouter de poder">
      <div className="scouter-topline">
        <span className="scouter-dot" /> SCOUTER // KJ-DBZ
        <span className="scouter-version">MODEL Z-09</span>
      </div>

      <div className="scouter-screen">
        <div className="scouter-screen-grid" />
        <div className="scouter-screen-header">
          <span>POWER LEVEL ANALYSIS</span>
          <span className="scouter-live"><i /> {scanning ? "SCANNING" : power ? "LOCKED" : "STANDBY"}</span>
        </div>

        <div className="scouter-target">
          <div className={`target-reticle ${scanning ? "reticle-spin" : ""}`}>
            <span className="reticle-cross horizontal" />
            <span className="reticle-cross vertical" />
            <span className="reticle-corner corner-tl" />
            <span className="reticle-corner corner-tr" />
            <span className="reticle-corner corner-bl" />
            <span className="reticle-corner corner-br" />
            <span className="target-symbol">{raca ? raca.raca.slice(0, 1).toUpperCase() : "?"}</span>
            {scanning && <span className="scan-line" />}
          </div>
          <div className="target-details">
            <span className="tiny-label">TARGET IDENTIFIED</span>
            <strong>{raca ? raca.raca.toUpperCase() : "NENHUM ALVO"}</strong>
            <span className="target-origin">{raca ? `ORIGEM: ${raca.origem.toUpperCase()}` : "SELECIONE UMA RAÇA ACIMA"}</span>
            <span className="target-status">{status}</span>
          </div>
        </div>

        <div className="power-readout">
          <div className="power-label"><span>NÍVEL DE PODER</span><span>PL</span></div>
          <div className={`power-number ${scanning ? "power-flicker" : ""}`} aria-live="polite">
            {scanning ? "CALCULANDO..." : power !== null ? formatPower(power) : "--- ---"}
          </div>
          <div className="power-meter" aria-label={power !== null ? `Leitura de poder ${power}` : "Aguardando leitura"}>
            <div className="power-meter-fill" style={{ width: power !== null ? `${Math.max(3, Math.min(100, (power / 100000) * 100))}%` : scanning ? "72%" : "0%" }} />
          </div>
          <div className="meter-scale"><span>0</span><span>50K</span><span>100K+</span></div>
        </div>

        <div className="scouter-footer"><span>KI SIGNATURE: {power !== null ? "CONFIRMADA" : "--"}</span><span>SYS: {scanning ? "PROCESSANDO" : "OPERACIONAL"}</span></div>
      </div>

      <div className="scouter-controls">
        <button className="scan-button" onClick={scanPower} disabled={!raca || scanning}>
          <span className="button-icon">{scanning ? "◌" : "⌁"}</span>
          {scanning ? "ESCANEANDO ALVO..." : power !== null ? "ESCANEAR NOVAMENTE" : "MEDIR NÍVEL DE PODER"}
        </button>
        <p>Leitura fictícia para entretenimento — os valores são estimativas do sistema.</p>
      </div>
    </section>
  )
}
