import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('input9.example.txt')
const data = readFile('input9.txt')

const sumRiskLevels = (input) => {
    const lines = input.trim().split('\n')
    const map = []
    for (const line of lines) {
        const row = line.split('').map(Number)
        map.push(row)
    }
    // console.table(map)

    const width = map[0].length
    const height = map.length
    const riskLevels = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const current = map[y][x]
            const left = (x > 0) ? map[y][x - 1] : Number.MAX_SAFE_INTEGER
            const right = (x < (width - 1)) ? map[y][x + 1] : Number.MAX_SAFE_INTEGER
            const up = (y > 0) ? map[y - 1][x] : Number.MAX_SAFE_INTEGER
            const down = (y < (height - 1)) ? map[y + 1][x] : Number.MAX_SAFE_INTEGER

            if (current < Math.min(...[left, right, up, down])) {
                riskLevels.push(current + 1)
            }
        }
    }
    // console.log(riskLevels)
    return riskLevels.reduce((a, b) => a + b, 0)
}

assert.equal(sumRiskLevels(example), 15)
console.log('part 1', sumRiskLevels(data))