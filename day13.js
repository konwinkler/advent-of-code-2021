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

const dotsAfterFolds = (input, amountFolds) => {
    let dots = []
    const folds = []
    const lines = input.trim().split('\n')
    let finishedDotsParsing = false
    for (const line of lines) {
        if (line === '') {
            finishedDotsParsing = true
        } else {
            if (!finishedDotsParsing) {
                const [x, y] = line.split(',').map(Number)
                dots.push({x, y})
            } else {
                const [axis, lineNumber] = line.split('fold along ')[1].split('=')
                folds.push({
                    axis,
                    line: Number(lineNumber)
                })
            }
        }
    }
    // console.log(dots)
    // console.log(folds)

    // make a single fold
    const fold = folds[0]
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
    return newDots.length
}

assert.equal(dotsAfterFolds(example, 1), 17)
console.log('part 1', dotsAfterFolds(data, 1))
