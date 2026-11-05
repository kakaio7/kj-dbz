import React from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import App from '../App'
import DragonBalls from '../features/collection/DragonBalls'
import TransformationSimulator from '../features/transformations/TransformationSimulator'
import { APP_CONFIG } from '../config/app'
import { readStoredNumberArray } from '../utils/storage'

describe('storage helpers', () => {
  it('sanitizes localStorage values before returning them', () => {
    window.localStorage.setItem('test-ids', JSON.stringify(['1', '3', 'abc', -5, 7, null, 0]))

    expect(readStoredNumberArray('test-ids')).toEqual([1, 3, 7, 0])
  })
})

describe('App', () => {
  it('renders the main race catalog section', () => {
    render(React.createElement(App))
    expect(screen.getByRole('heading', { name: /arquivo de/i })).toBeInTheDocument()
  })

  it('updates favorite controls and filters the race archive', () => {
    const { container } = render(React.createElement(App))
    const cards = container.querySelectorAll('.race-tile')
    const cardFavorites = container.querySelectorAll('.tile-toolbar > .favorite-button')

    expect(cardFavorites).toHaveLength(cards.length)
    expect([...cardFavorites].every((button) => button.querySelector('.favorite-star'))).toBe(true)

    const raceCard = screen.getByRole('button', { name: /Ver ficha de Saiyajin/i })
    fireEvent.click(raceCard)
    expect(raceCard).toHaveAttribute('aria-pressed', 'true')
    expect(raceCard.closest('.race-tile')).toHaveClass('chosen')

    const favoriteButton = screen.getByRole('button', { name: 'Favoritar Saiyajin' })
    fireEvent.click(favoriteButton)

    const savedFavorite = screen.getByRole('button', { name: 'Remover Saiyajin dos favoritos' })
    expect(savedFavorite).toHaveAttribute('aria-pressed', 'true')
    expect(savedFavorite.querySelector('svg')).toHaveClass('is-filled')

    fireEvent.click(savedFavorite)
    const removedFavorite = screen.getByRole('button', { name: 'Favoritar Saiyajin' })
    expect(removedFavorite).toHaveAttribute('aria-pressed', 'false')
    expect(removedFavorite.querySelector('svg')).not.toHaveClass('is-filled')
    fireEvent.click(removedFavorite)

    fireEvent.change(screen.getByRole('textbox', { name: /buscar raças/i }), {
      target: { value: 'Namekuseijin' }
    })

    expect(screen.getByRole('button', { name: /Ver ficha de Namekuseijin/i }))
      .toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Ver ficha de Saiyajin/i }))
      .not.toBeInTheDocument()
  })
})

describe('TransformationSimulator', () => {
  it('updates the power level when a transformation is selected', () => {
    render(React.createElement(TransformationSimulator))

    fireEvent.click(screen.getByText('Super Saiyajin').closest('button'))

    expect(screen.getByText('50.000')).toBeInTheDocument()
  })

  it('resets the selected form and power controls to their initial values', () => {
    const { container } = render(React.createElement(TransformationSimulator))

    fireEvent.click(screen.getByText('Super Saiyajin').closest('button'))
    fireEvent.change(screen.getByLabelText(/Poder base/), { target: { value: '5000' } })
    fireEvent.click(screen.getByText('Super Saiyajin God').closest('button'))
    fireEvent.change(screen.getByLabelText(/Poder divino/), { target: { value: '2000000' } })

    fireEvent.click(screen.getByRole('button', { name: /reiniciar simulador/i }))

    expect(screen.getByRole('button', { name: /Saiyajin Base/i }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(container.querySelector('.transformation-power strong')).toHaveTextContent('1.000')
    expect(screen.getByLabelText(/Poder base/)).toHaveValue('1000')
    expect(screen.queryByLabelText(/Poder divino/)).not.toBeInTheDocument()
  })
})

describe('DragonBalls wish', () => {
  it('unlocks one wish after the final sphere and remembers it', () => {
    window.localStorage.setItem(
      APP_CONFIG.storageKeys.dragonBalls,
      JSON.stringify([1, 2, 3, 4, 5, 6])
    )

    render(React.createElement(DragonBalls))
    fireEvent.click(screen.getByRole('button', { name: 'Ativar radar para encontrar Esfera de 7 estrelas' }))
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar varredura' }))
    fireEvent.click(screen.getByRole('button', { name: 'Três' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByAltText('')).toHaveAttribute(
      'src',
      '/images/dragon-balls/shenlong.png'
    )

    fireEvent.change(screen.getByLabelText('Seu único desejo'), {
      target: { value: 'Que todos tenham saúde' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Conceder meu desejo' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'SEU DESEJO FOI CONCEDIDO!' })).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText(/Que todos tenham saúde/)).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem('kj-dbz-wish-v1'))).toBe('Que todos tenham saúde')
    expect(screen.queryByRole('button', { name: 'Invocar guardião' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/Seu desejo foi concedido/)).toBeInTheDocument()
  })

  it('requires solving the current riddle before revealing the next sphere', () => {
    render(React.createElement(DragonBalls))

    expect(screen.getByText(/PRÓXIMO SINAL: ESFERA 1/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Esfera de 2 estrelas bloqueada' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Ativar radar para encontrar Esfera de 1 estrela' }))
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar varredura' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mestre Kame' }))

    expect(screen.getByRole('status')).toHaveTextContent(/Sinal incorreto/)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Vovô Gohan' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText(/PRÓXIMO SINAL: ESFERA 2/)).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(APP_CONFIG.storageKeys.dragonBalls))).toEqual([1])
  })
})
