import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const day = 15
const example = readFile(`day${day}/example`)
const data = readFile(`day${day}/input.txt`)

const createNeighbors = (current, map, width, height) => {
    const neighbors = []
    const { x, y, cost } = current
    if (x > 0) {
        neighbors.push({
            x: x - 1,
            y: y,
            cost: cost + map[y][x - 1]
        })
    }
    if (y > 0) {
        neighbors.push({
            x: x,
            y: y - 1,
            cost: cost + map[y - 1][x]
        })
    }
    if (x < width - 1) {
        neighbors.push({
            x: x + 1,
            y: y,
            cost: cost + map[y][x + 1]
        })
    }
    if (y < height - 1) {
        neighbors.push({
            x: x,
            y: y + 1,
            cost: cost + map[y + 1][x]
        })
    }
    return neighbors
}

const getNodeFromList = (neighbor, visited) => {
    return visited.find(node => node.x === neighbor.x && node.y === neighbor.y)
}

const lowestRiskPath = (input) => {
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
        if (current.x === width - 1 && current.y === height - 1) {
            return current.cost
        }

        // create neighbors
        const neighbors = createNeighbors(current, map, width, height)
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
    }
}

assert.equal(lowestRiskPath(example), 40)
console.log('part 1', lowestRiskPath(data))
