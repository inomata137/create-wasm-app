import { Universe, Cell } from 'wasm-game-of-life'
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg'

const CELL_SIZE = 2
const GRID_COLOR = '#CCCCCC'
const DEAD_COLOR = '#FFFFFF'
const ALIVE_COLOR = '#000000'

const universe = Universe.new()
const width = universe.width()
const height = universe.height()

/** @type {HTMLParagraphElement} */
const label = document.getElementById('game-of-life-label')

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('game-of-life-canvas')
canvas.height = (CELL_SIZE + 1) * height + 1
canvas.width = (CELL_SIZE + 1) * width + 1

const ctx = canvas.getContext('2d')

let frame = 0
const start = Date.now()

const renderLoop = () => {
  universe.tick()
  drawGrid()
  drawCells()
  label.innerText = `frame: ${frame} fps: ${1000 * frame / Math.max(1, Date.now() - start)}`
  frame += 1

  requestAnimationFrame(renderLoop)
}

const drawGrid = () => {
  ctx.beginPath()
  ctx.strokeStyle = GRID_COLOR

  for (let i = 0; i <= width; ++i) {
    const x = i * (CELL_SIZE + 1) + 1
    ctx.moveTo(x, 0)
    ctx.lineTo(x, (CELL_SIZE + 1) * height + 1)
  }

  for (let j = 0; j <= height; ++j) {
    const y = j * (CELL_SIZE + 1) + 1
    ctx.moveTo(0, y)
    ctx.lineTo((CELL_SIZE + 1) * width + 1, y)
  }

  ctx.stroke()
}

const drawCells = () => {
  const cellsPtr = universe.cells()
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height)

  ctx.beginPath()

  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      const idx = getIdx(row, col)

      ctx.fillStyle = cells[idx] === Cell.Dead
        ? DEAD_COLOR
        : ALIVE_COLOR

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      )
    }

    ctx.stroke()
  }
}

const getIdx = (r, c) => {
  return r * width + c
}

renderLoop()
