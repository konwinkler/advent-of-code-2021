import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const day = 15
const example = readFile(`day${day}/example`)
const data = readFile(`day${day}/input.txt`)

const wrapCost = (i) => {
    return (i - 1) % 9 + 1
}

const getCost = (map, x, y, width, height, multiply) => {
    if (multiply === 1) {
        return map[y][x]
    }
    const realX = x % width
    const realY = y % height
    const offset = Math.floor(x / width) + Math.floor(y / height)
    return wrapCost(map[realY][realX] + offset)
}

const createNeighbors = (current, map, width, height, multiply) => {
    const neighbors = []
    const { x, y, cost } = current
    if (x > 0) {
        neighbors.push({
            x: x - 1,
            y: y,
            cost: cost + getCost(map, x - 1, y, width, height, multiply)
        })
    }
    if (y > 0) {
        neighbors.push({
            x: x,
            y: y - 1,
            cost: cost + getCost(map, x, y - 1, width, height, multiply)
        })
    }
    if (x < width * multiply - 1) {
        neighbors.push({
            x: x + 1,
            y: y,
            cost: cost + getCost(map, x + 1, y, width, height, multiply)
        })
    }
    if (y < height * multiply - 1) {
        neighbors.push({
            x: x,
            y: y + 1,
            cost: cost + getCost(map, x, y + 1, width, height, multiply)
        })
    }
    return neighbors
}

const getNodeFromList = (neighbor, visited) => {
    return visited.find(node => node.x === neighbor.x && node.y === neighbor.y)
}

const lowestRiskPath = (input, multiply = 1) => {
    const lines = input.trim().split('\n')
    const map = lines.map(line => line.split('').map(Number))

    const width = map[0].length
    const height = map.length
    let current = {
        x: 0,
        y: 0,
        cost: 0
    }
    const visited = []
    const nextQueue = []
    // take element with lowest cost
    while (current !== undefined) {
        // if goal then we are done
        if (current.x === width * multiply - 1 && current.y === height * multiply - 1) {
            return current.cost
        }

        // create neighbors
        const neighbors = createNeighbors(current, map, width, height, multiply)
        for (const neighbor of neighbors) {

            if (getNodeFromList(neighbor, visited) === undefined) {
                const queued = getNodeFromList(neighbor, nextQueue)
                if (queued === undefined) {
                    nextQueue.push(neighbor)
                } else {
                    queued.cost = Math.min(queued.cost, neighbor.cost)
                }
            }
        }
        // sort visited by cost
        nextQueue.sort((a, b) => a.cost - b.cost)

        visited.push(current)
        current = nextQueue.shift()
        if (visited.length % 10000 === 0) {
            console.log(`visited ${visited.length} nodes`)
        }
    }
}

assert.equal(lowestRiskPath(example), 40)
console.log('part 1', lowestRiskPath(data))

assert.equal(lowestRiskPath(example, 5), 315)
console.log('part 2', lowestRiskPath(data, 5))

