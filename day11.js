import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('input11.example.txt')
const data = readFile('input11.txt')

const applyAll = (map, treatment) => {
    const height = map.length
    const width = map[0].length
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x ++) {
            treatment(x, y)
        }
    } 
}

const countFlashes = (input, steps) => {
    const map = input
        .trim()
        .split('\n')
        .map(l => {
            return l.split('').map(Number)
        })

    let total = 0
    let firstTotal
    const maxPossibleFlashes = map.length * map[0].length
    for (let step = 1; step <= steps; step++) {
        // increment all
        applyAll(map, (x, y) => {
            map[y][x]++
        })

        let flashes = true
        let countFlashesThisStep = 0
        while (flashes) {
            flashes = false
            applyAll(map, (x, y) => {
                // flash if higher than 9
                if (map[y][x] > 9) {
                    flashes = true
                    total++
                    countFlashesThisStep++
                    if (countFlashesThisStep >= maxPossibleFlashes) {
                        firstTotal = step
                    }
                    map[y][x] = '#'
                    // increment sorrounding
                    applyAll(map, (g, h) => {
                        const value = map[h][g]
                        const horizontalDifference = Math.abs(g - x)
                        const verticalDifference = Math.abs(h - y)
                        if (value !== '#' && (horizontalDifference <= 1 && verticalDifference <= 1)) {
                            map[h][g]++
                        }
                    })
                }
            })
            if (firstTotal !== undefined) {
                return {
                    total,
                    firstTotal
                }
            }
        }

        // reset all flashed to 0
        applyAll(map, (x, y) => {
            if (map[y][x] === '#') {
                map[y][x] = 0
            }
        })
        // console.log(`step ${step}`)
        // console.table(map)
    }

    return {
        total,
        firstTotal: 0
    }
}

assert.equal(countFlashes(example, 100)['total'], 1656)
console.log('part 1', countFlashes(data, 100)['total'])

assert.equal(countFlashes(example, 1000)['firstTotal'], 195)
console.log('part 2', countFlashes(data, 1000)['firstTotal'])
