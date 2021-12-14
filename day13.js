import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'
import { O_TRUNC } from 'constants'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('input13.example.txt')
const data = readFile('input13.txt')

const alreadyExists = (dots, dot) => {
    return dots.some((element) => {
        return element.x === dot.x && element.y === dot.y
    })
}

const dotsAfterFolds = (input, stopAfterOne = false) => {
    let dots = []
    let folds = []
    const lines = input.trim().split('\n')
    let finishedDotsParsing = false
    for (const line of lines) {
        if (line === '') {
            finishedDotsParsing = true
        } else {
            if (!finishedDotsParsing) {
                const [x, y] = line.split(',').map(Number)
                dots.push({ x, y })
            } else {
                const [axis, lineNumber] = line.split('fold along ')[1].split('=')
                folds.push({
                    axis,
                    line: Number(lineNumber)
                })
            }
        }
    }
    if (stopAfterOne) {
        folds = [folds[0]]
    }

    for (const fold of folds) {
        let newDots = []
        for (const dot of dots) {
            if (fold.axis === 'y') {
                if (dot.y >= fold.line) {
                    const diff = dot.y - fold.line
                    const newY = fold.line - diff
                    const newDot = {
                        x: dot.x,
                        y: newY
                    }
                    if (alreadyExists(dots, newDot)) {
                        // do nothing so dot gets removed
                    } else {
                        newDots.push(newDot)
                    }
                } else {
                    // keep dot
                    newDots.push(dot)
                }
            } else {
                if (dot.x >= fold.line) {
                    const diff = dot.x - fold.line
                    const newX = fold.line - diff
                    const newDot = {
                        x: newX,
                        y: dot.y
                    }
                    if (alreadyExists(dots, newDot)) {
                        // do nothing so dot gets removed
                    } else {
                        newDots.push(newDot)
                    }
                } else {
                    // keep dot
                    newDots.push(dot)
                }
            }
        }
        dots = newDots
    }
    // pretty print
    if (!stopAfterOne) {
        const { width, height } = dots.reduce((max, current) => {
            return {
                width: Math.max(current.x, max.width),
                height: Math.max(current.y, max.height)
            }
        }, { width: 0, height: 0 })
        const board = []
        for (let i = 0; i < height + 1; i++) {
            const row = Array(width + 1).fill('.')
            board.push(row)
        }
        for (const dot of dots) {
            board[dot.y][dot.x] = '#'
        }
        console.log(board.map(row => row.join('')).join('\n'))
    }

    return dots.length
}

assert.equal(dotsAfterFolds(example, true), 17)
console.log('part 1', dotsAfterFolds(data, true))

assert.equal(dotsAfterFolds(example), 16)
console.log('')
console.log('part 2', dotsAfterFolds(data))
