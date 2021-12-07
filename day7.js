import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = `
16,1,2,0,4,2,7,1,2,14
`
const cache = new Map()
const fuelIncreasingCost = (steps) => {
    if (steps === 0) {
        return 0
    } else {
        if (cache.has(steps)) {
            return cache.get(steps)
        }
        const cost = fuelIncreasingCost(steps - 1) + steps
        cache.set(steps, cost)
        return cost
    }
}

const calculateFuelCost = (positions, target, simple) => {
    let totalCost = 0
    for (const position of positions) {
        const steps = Math.abs(target - position)
        if (simple) {
            totalCost += steps
        } else {
            totalCost += fuelIncreasingCost(steps)
        }
    }
    return totalCost
}

const alignCrabs = (input, simple = true) => {
    const startingPositions = input.trim().split(',').map(Number)
    const rightMostCrab = Math.max(...startingPositions)
    let lowestFuelCost = Number.MAX_SAFE_INTEGER
    for (let i = 0; i <= rightMostCrab; i++) {
        const fuelCost = calculateFuelCost(startingPositions, i, simple)
        lowestFuelCost = Math.min(fuelCost, lowestFuelCost)
    }
    return lowestFuelCost
}

assert.equal(alignCrabs(example), 37)
console.log('part 1', alignCrabs(readFile('input7.txt')))
assert.equal(alignCrabs(example, false), 168)
console.log('part 2', alignCrabs(readFile('input7.txt'), false))
