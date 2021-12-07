import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = `
3,4,3,1,2
`
const simulateLanternFish = (start, daysToSimulate) => {
    const initialFish = start.trim().split(',').map(Number)
    let fishSchool = new Array(9).fill(0)
    for (const fish of initialFish) {
        fishSchool[fish]++
    }

    for (let day = 1; day <= daysToSimulate; day++) {
        let newSchool = new Array(9).fill(0)
        for (let i = 0; i <= 8; i++) {
            const fishCount = fishSchool[i]
            if (i === 0) {
                newSchool[6] = fishCount
                newSchool[8] = fishCount
            } else {
                newSchool[i - 1] += fishCount
            }
        }
        fishSchool = newSchool
    }
    return fishSchool.reduce((total, e) => total + e, 0)
}

assert.equal(simulateLanternFish(example, 80), 5934)
console.log('part 1', simulateLanternFish(readFile('input6.txt'), 80))
assert.equal(simulateLanternFish(example, 256), 26984457539)
console.log('part 2', simulateLanternFish(readFile('input6.txt'), 256))
