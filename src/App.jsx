import { useState } from "react"
import { racas } from "./data/racas"
import RaceSelector from "./components/RaceSelector"
import RaceCard from "./components/RaceCard"
import "./App.css"

function App() {
  const [racaSelecionada, setRacaSelecionada] = useState(null)

  const mostrarRaca = (index) => {
    if (index === "") {
      setRacaSelecionada(null)
      return
    }

    setRacaSelecionada(racas[index])
  }

  return (
    <div className="app">
      <div className="energy-bg"></div>

      <h1>🐉 UNIVERSO DAS RAÇAS DBZ 🐉</h1>

      <RaceSelector
        racas={racas}
        onSelect={mostrarRaca}
      />

      <RaceCard raca={racaSelecionada} />
    </div>
  )
}

export default App