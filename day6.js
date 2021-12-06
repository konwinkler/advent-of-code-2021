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
    const fishSchool = start.trim().split(',').map(Number)
    for (let day = 1; day <= daysToSimulate; day++) {
        const end = fishSchool.length
        for (let i = 0; i < end; i++) {
            fishSchool[i]--
            if (fishSchool[i] === -1) {
                fishSchool[i] = 6
                fishSchool.push(8)
            }
        }
        // console.log(`day ${day}`)
        // console.log(fishSchool)
    }
    return fishSchool.length
}

assert.equal(simulateLanternFish(example, 80), 5934)
console.log(simulateLanternFish(readFile('input6.txt'), 80))
