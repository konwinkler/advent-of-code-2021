import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = `
16,1,2,0,4,2,7,1,2,14
`

const calculateFuelCost = (positions, target) => {
    let cost = 0
    for (const position of positions) {
        cost += Math.abs(target - position)
    }
    return cost
}

const alignCrabs = (input) => {
    const startingPositions = input.trim().split(',').map(Number)
    const rightMostCrab = Math.max(...startingPositions)
    let lowestFuelCost = Number.MAX_SAFE_INTEGER
    for (let i = 0; i <= rightMostCrab; i++) {
        const fuelCost = calculateFuelCost(startingPositions, i)
        lowestFuelCost = Math.min(fuelCost, lowestFuelCost)
    }
    return lowestFuelCost
}

assert.equal(alignCrabs(example), 37)
console.log('part 1', alignCrabs(readFile('input7.txt')))

