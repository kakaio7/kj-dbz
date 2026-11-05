import { useEffect, useMemo, useState } from 'react'
import SafeImage from '../../components/ui/SafeImage'
import Button from '../../components/ui/Button'
import { APP_CONFIG } from '../../config/app'
import {
  readStoredNumberArray,
  readStoredString,
  writeStoredNumberArray,
  writeStoredString
} from '../../utils/storage'
import '../../components/DragonBalls.css'

const STORAGE_KEY = APP_CONFIG.storageKeys.dragonBalls
const WISH_KEY = APP_CONFIG.storageKeys.wish
const WISH_MAX_LENGTH = 140
const BALLS = [
  {
    id: 1,
    name: 'Esfera de 1 estrela',
    image: '/images/dragon-balls/esfera-1.svg',
    clue: 'O radar aponta para a primeira memória de Goku. Quem lhe deu a esfera de quatro estrelas?',
    question: 'Quem foi?',
    hint: 'Era o avô que criou Goku quando ele era pequeno.',
    answers: ['Vovô Gohan', 'Mestre Kame', 'Bardock', 'Bulma'],
    correctAnswer: 'Vovô Gohan'
  },
  {
    id: 2,
    name: 'Esfera de 2 estrelas',
    image: '/images/dragon-balls/esfera-2.svg',
    clue: 'Uma inventora genial encontrou um jeito de rastrear o ki das esferas.',
    question: 'Que aparelho ela criou?',
    hint: 'Bulma o usa para procurar as esferas no mapa.',
    answers: ['Scouter', 'Radar do Dragão', 'Cápsula Hoi-Poi', 'Máquina do Tempo'],
    correctAnswer: 'Radar do Dragão'
  },
  {
    id: 3,
    name: 'Esfera de 3 estrelas',
    image: '/images/dragon-balls/esfera-3.svg',
    clue: 'Para ficar mais forte, Goku e Kuririn treinaram sob a disciplina de um lendário mestre das artes marciais.',
    question: 'Quem foi o mestre?',
    hint: 'Seu apelido está ligado a uma tartaruga.',
    answers: ['Kami-Sama', 'Mestre Kame', 'Sr. Popo', 'Kaioh do Norte'],
    correctAnswer: 'Mestre Kame'
  },
  {
    id: 4,
    name: 'Esfera de 4 estrelas',
    image: '/images/dragon-balls/esfera-4.svg',
    clue: 'A lua cheia desperta uma transformação poderosa nos Saiyajins que ainda têm cauda.',
    question: 'Como se chama essa forma?',
    hint: 'É uma criatura gigante com aparência de macaco.',
    answers: ['Kaioken', 'Oozaru', 'Super Saiyajin', 'Instinto Superior'],
    correctAnswer: 'Oozaru'
  },
  {
    id: 5,
    name: 'Esfera de 5 estrelas',
    image: '/images/dragon-balls/esfera-5.svg',
    clue: 'O sinal do radar viajou até o mundo verde dos sábios criadores de esferas.',
    question: 'Qual é o planeta natal dos Namekuseijins?',
    hint: 'O nome do planeta é quase igual ao da raça.',
    answers: ['Vegeta', 'Yardrat', 'Namekusei', 'Terra'],
    correctAnswer: 'Namekusei'
  },
  {
    id: 6,
    name: 'Esfera de 6 estrelas',
    image: '/images/dragon-balls/esfera-6.svg',
    clue: 'No planeta Namekusei, um dragão imponente atende ao chamado de quem reúne as esferas.',
    question: 'Qual é o nome dele?',
    hint: 'O nome começa com “Por”.',
    answers: ['Shenlong', 'Porunga', 'Super Shenlong', 'Toronbo'],
    correctAnswer: 'Porunga'
  },
  {
    id: 7,
    name: 'Esfera de 7 estrelas',
    image: '/images/dragon-balls/esfera-7.svg',
    clue: 'A última leitura está quase estável. As esferas de Namekusei são conhecidas por conceder mais de um desejo.',
    question: 'Quantos desejos Porunga concedia originalmente?',
    hint: 'É a quantidade de dedos de uma mão.',
    answers: ['Um', 'Dois', 'Três', 'Sete'],
    correctAnswer: 'Três'
  }
]

function readCollection() {
  return readStoredNumberArray(STORAGE_KEY).filter(
    (id) => id >= 1 && id <= BALLS.length
  )
}

export default function DragonBalls() {
  const [collected, setCollected] = useState(readCollection)
  const [notice, setNotice] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [activePuzzleId, setActivePuzzleId] = useState(null)
  const [radarActivated, setRadarActivated] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [puzzleFeedback, setPuzzleFeedback] = useState('')
  const [showSummon, setShowSummon] = useState(false)
  const [wishGranted, setWishGranted] = useState(false)
  const [wishDraft, setWishDraft] = useState('')
  const [wishText, setWishText] = useState(() =>
    readStoredString(WISH_KEY, '', WISH_MAX_LENGTH)
  )
  const [storageError, setStorageError] = useState(false)
  const complete = collected.length === BALLS.length
  const nextBall = BALLS.find((ball) => !collected.includes(ball.id)) ?? null
  const activePuzzle = BALLS.find((ball) => ball.id === activePuzzleId) ?? null
  const wishUsed = Boolean(wishText)
  const progress = useMemo(() => Math.round((collected.length / 7) * 100), [collected])

  useEffect(() => {
    writeStoredNumberArray(STORAGE_KEY, collected)
  }, [collected])

  function openPuzzle(ball) {
    if (ball.id !== nextBall?.id) {
      return
    }

    setActivePuzzleId(ball.id)
    setRadarActivated(false)
    setShowHint(false)
    setPuzzleFeedback('')
    setConfirmReset(false)
  }

  function closePuzzle() {
    setActivePuzzleId(null)
    setRadarActivated(false)
    setShowHint(false)
    setPuzzleFeedback('')
  }

  function answerPuzzle(answer) {
    if (!activePuzzle || !radarActivated) {
      return
    }

    if (answer !== activePuzzle.correctAnswer) {
      setPuzzleFeedback('Sinal incorreto! Releia a pista e tente outra resposta.')
      return
    }

    const updated = [...new Set([...collected, activePuzzle.id])].sort((a, b) => a - b)
    setCollected(updated)
    setNotice(`${activePuzzle.name} encontrada! O Radar detectou o próximo sinal.`)
    closePuzzle()

    if (updated.length === BALLS.length && !wishUsed) {
      setShowSummon(true)
    }
  }

  function resetCollection() {
    setCollected([])
    setNotice('Coleção reiniciada. Boa sorte na busca!')
    setConfirmReset(false)
    setShowSummon(false)
    closePuzzle()
  }

  function grantWish(event) {
    event.preventDefault()
    const wish = wishDraft.trim().slice(0, WISH_MAX_LENGTH)

    if (!wish || wishUsed) {
      return
    }

    if (!writeStoredString(WISH_KEY, wish, WISH_MAX_LENGTH)) {
      setStorageError(true)
      return
    }

    setWishText(wish)
    setWishDraft('')
    setStorageError(false)
    setWishGranted(true)
    setNotice('Seu único desejo foi concedido e salvo neste navegador.')
  }

  return (
    <section className="feature-section dragon-section" id="esferas">
      <div className="feature-heading">
        <div>
          <p className="eyebrow">BUSCA MÍSTICA // DB-07</p>
          <h2>COLEÇÃO DAS <span>ESFERAS DO DRAGÃO</span></h2>
        </div>
        <span className="dragon-count">{collected.length.toString().padStart(2, '0')} / 07 COLETADAS</span>
      </div>

      <p className="feature-intro">
        Siga os sinais do Radar do Dragão, resolva os enigmas inspirados nas aventuras de Goku e encontre as esferas em sequência. Seu progresso fica salvo neste navegador.
      </p>

      <div className="dragon-progress">
        <div className="dragon-progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="dragon-progress-labels">
          <span>{nextBall ? `PRÓXIMO SINAL: ESFERA ${nextBall.id}` : 'TODOS OS SINAIS ENCONTRADOS'}</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <div className="dragon-grid">
        {BALLS.map((ball) => {
          const hasBall = collected.includes(ball.id)
          const isNext = nextBall?.id === ball.id
          const locked = !hasBall && !isNext

          return (
            <article
              className={`dragon-ball-card ${hasBall ? 'collected' : ''} ${isNext ? 'radar-target' : ''} ${locked ? 'ball-locked' : ''}`}
              key={ball.id}
              style={{ '--ball-index': ball.id }}
            >
              <button
                className="dragon-ball-button"
                type="button"
                onClick={() => openPuzzle(ball)}
                disabled={!isNext}
                aria-label={hasBall ? `${ball.name} encontrada` : locked ? `${ball.name} bloqueada` : `Ativar radar para encontrar ${ball.name}`}
                aria-current={isNext ? 'step' : undefined}
                title={locked ? 'Resolva os enigmas anteriores para localizar esta esfera.' : undefined}
              >
                <div className="dragon-ball-art">
                  <div className="dragon-ball-glow" />
                  <SafeImage
                    src={ball.image}
                    alt={ball.name}
                    className="dragon-ball-image"
                    fallbackClassName="ball-placeholder"
                    fallbackText={`★ ${ball.id}`}
                  />
                  <span className="ball-check">{hasBall ? '✓' : locked ? '⌑' : '⌁'}</span>
                </div>

                <div className="dragon-ball-info">
                  <span className="ball-number">ESFERA // 0{ball.id}</span>
                  <h3>{ball.name}</h3>
                  <p>{hasBall ? 'Sinal confirmado' : locked ? 'Sinal bloqueado' : 'Sinal detectado — ativar radar'}</p>
                </div>
              </button>

              <div className="ball-challenge">
                <span>{hasBall ? 'ESFERA LOCALIZADA' : locked ? 'AGUARDANDO SINAL ANTERIOR' : 'PISTA DO RADAR'}</span>
                <p>{hasBall ? 'O sinal desta esfera foi confirmado.' : locked ? 'Continue a busca em ordem para revelar o próximo sinal.' : 'Ative o radar para receber a pista e resolver o enigma.'}</p>
                <button
                  type="button"
                  onClick={() => openPuzzle(ball)}
                  disabled={!isNext}
                >
                  {hasBall ? 'Encontrada' : locked ? 'Bloqueada' : 'Ativar radar'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {notice && <p className="dragon-notice" role="status">{notice}</p>}

      {complete ? (
        <div className="guardian-unlocked">
          <div className="guardian-symbol" aria-hidden="true">✦</div>
          <div>
            <p className="eyebrow">COLEÇÃO COMPLETA</p>
            <h3>As sete esferas foram reunidas!</h3>
            <p>
              {wishUsed
                ? `Seu desejo foi concedido: “${wishText}”`
                : 'Uma energia ancestral despertou. Você tem direito a um único desejo.'}
            </p>
          </div>
          {wishUsed ? (
            <span className="wish-stamp">DESEJO<br />CONCEDIDO</span>
          ) : (
            <Button onClick={() => setShowSummon(true)}>
              Invocar guardião
            </Button>
          )}
        </div>
      ) : (
        <div className="dragon-locked">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>O Guardião do Desejo aguarda sua coleção</strong>
            <p>Faltam {7 - collected.length} esfera(s) para completar o conjunto.</p>
          </div>
        </div>
      )}

      {wishUsed && (
        <p className="wish-used-note" role="status">
          O desejo único desta coleção já foi concedido neste navegador.
        </p>
      )}

      <div className="dragon-actions">
        {confirmReset ? (
          <>
            <span>Tem certeza que deseja apagar seu progresso?</span>
            <Button onClick={resetCollection}>Sim, reiniciar</Button>
            <Button variant="ghost" className="subtle-button" onClick={() => setConfirmReset(false)}>
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="ghost" className="subtle-button" onClick={() => setConfirmReset(true)}>
            ↻ Reiniciar coleção
          </Button>
        )}
      </div>

      {activePuzzle && (
        <div
          className="puzzle-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePuzzle()
          }}
        >
          <section
            className="puzzle-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="puzzle-title"
          >
            <button
              type="button"
              className="wish-close"
              aria-label="Fechar enigma"
              onClick={closePuzzle}
            >
              ×
            </button>

            <div className={`radar-scan ${radarActivated ? 'radar-scan--active' : ''}`} aria-hidden="true">
              <span className="radar-sweep" />
              <span className="radar-crosshair radar-crosshair--horizontal" />
              <span className="radar-crosshair radar-crosshair--vertical" />
              <span className="radar-signal">{radarActivated ? '●' : '⌁'}</span>
              <span className="radar-coordinates">DB-{String(activePuzzle.id).padStart(2, '0')}</span>
            </div>

            <p className="wish-kicker">RADAR DO DRAGÃO // SINAL {activePuzzle.id} DE 7</p>
            <h3 id="puzzle-title">{radarActivated ? activePuzzle.question : 'Sinal de esfera detectado'}</h3>

            {!radarActivated ? (
              <>
                <p className="puzzle-clue">{activePuzzle.clue}</p>
                <Button onClick={() => {
                  setRadarActivated(true)
                  setPuzzleFeedback('')
                }}>
                  Iniciar varredura
                </Button>
              </>
            ) : (
              <>
                <p className="puzzle-clue">{activePuzzle.clue}</p>
                <div className="puzzle-answers">
                  {activePuzzle.answers.map((answer) => (
                    <button
                      type="button"
                      key={answer}
                      onClick={() => answerPuzzle(answer)}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="puzzle-hint-button"
                  aria-expanded={showHint}
                  onClick={() => setShowHint((visible) => !visible)}
                >
                  {showHint ? 'Ocultar dica' : 'Pedir uma dica'}
                </button>
                {showHint && <p className="puzzle-hint">{activePuzzle.hint}</p>}
                {puzzleFeedback && <p className="puzzle-feedback" role="status">{puzzleFeedback}</p>}
              </>
            )}

            <p className="wish-footnote">Cada esfera só é liberada ao resolver seu enigma. As respostas erradas não consomem tentativas.</p>
          </section>
        </div>
      )}

      {showSummon && complete && (!wishUsed || wishGranted) && (
        <div
          className="wish-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSummon(false)
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setShowSummon(false)
            }
          }}
        >
          <section
            className="wish-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wish-title"
          >
            <button
              type="button"
              className="wish-close"
              aria-label={wishGranted ? 'Fechar celebração' : 'Adiar desejo'}
              onClick={() => {
                setShowSummon(false)
                setWishGranted(false)
              }}
            >
              ×
            </button>

            <div className={`wish-stage ${wishGranted ? 'wish-stage--granted' : ''}`} aria-hidden="true">
              <span className="wish-lightning lightning-one" />
              <span className="wish-lightning lightning-two" />
              <span className="wish-ring ring-one" />
              <span className="wish-ring ring-two" />
              <span className="wish-ring ring-three" />
              <SafeImage
                src="/images/dragon-balls/shenlong.png"
                alt=""
                className={`wish-dragon-image ${wishGranted ? 'wish-dragon-image--departing' : ''}`}
                fallbackClassName="wish-dragon-fallback"
                fallbackText="O GUARDIÃO DO DESEJO"
              />
              <span className="wish-particle particle-one" />
              <span className="wish-particle particle-two" />
              <span className="wish-particle particle-three" />
              <span className="wish-particle particle-four" />
            </div>

            {wishGranted ? (
              <div className="wish-result" role="status" aria-live="polite">
                <p className="wish-kicker">A ENERGIA FOI LIBERADA</p>
                <h3 id="wish-title">SEU DESEJO FOI CONCEDIDO!</h3>
                <p className="wish-result-quote">“{wishText}”</p>
                <p className="wish-description">
                  O Guardião ergue voo em um clarão de energia. As sete esferas agora repousam até uma nova jornada.
                </p>
                <Button onClick={() => {
                  setShowSummon(false)
                  setWishGranted(false)
                }}>
                  Continuar
                </Button>
              </div>
            ) : (
              <>
                <p className="wish-kicker">AS SETE ESFERAS RESPONDERAM</p>
                <h3 id="wish-title">O Guardião do Desejo despertou</h3>
                <p className="wish-description">
                  Uma presença ancestral envolve o céu em energia. Escreva um desejo — esta oportunidade só pode ser usada uma vez.
                </p>

                <form className="wish-form" onSubmit={grantWish}>
                  <label htmlFor="wish-message">Seu único desejo</label>
                  <textarea
                    id="wish-message"
                    value={wishDraft}
                    onChange={(event) => setWishDraft(event.target.value.slice(0, WISH_MAX_LENGTH))}
                    placeholder="Escreva seu desejo..."
                    maxLength={WISH_MAX_LENGTH}
                    rows={3}
                    required
                    autoFocus
                  />
                  <div className="wish-form-footer">
                    <span>{wishDraft.length}/{WISH_MAX_LENGTH}</span>
                    <Button type="submit" disabled={!wishDraft.trim()}>
                      Conceder meu desejo
                    </Button>
                  </div>
                  {storageError && (
                    <p className="wish-error" role="alert">
                      Não foi possível salvar seu desejo neste navegador. Libere o armazenamento local e tente novamente.
                    </p>
                  )}
                </form>

                <p className="wish-footnote">
                  Experiência local de entretenimento; o desejo fica salvo apenas neste navegador.
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
