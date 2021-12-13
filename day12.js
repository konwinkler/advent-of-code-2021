import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example1 = readFile('input12.example1.txt')
const example2 = readFile('input12.example2.txt')
const example3 = readFile('input12.example3.txt')
const data = readFile('input12.txt')

const isBigCave = (name) => {
    const firstLetter = name.charCodeAt(0)
    return firstLetter >= 65 && firstLetter <= 90
}

const smallCaveVisitedTwice = (path) => {
    const copy = path.slice().sort()
    for (let i = 0; i < copy.length - 1; i++) {
        if (!isBigCave(copy[i]) && (copy[i] === copy[i + 1])) {
            return true
        }
    }
    return false
}

const countPathsStartingAt = (connections, current, pathTaken, twice) => {
    if (current === 'end') {
        return 1
    }
    let paths = 0
    const nextOptions = connections.get(current)
    for (const option of nextOptions) {
        if (isBigCave(option)) {
            paths += countPathsStartingAt(connections, option, [...pathTaken, current], twice)
        } else {
            // small cave
            if (!pathTaken.includes(option)) {
                paths += countPathsStartingAt(connections, option, [...pathTaken, current], twice)
            } else if (twice) {
                // a single small cave can be visited twice
                if (option !== 'start' && !smallCaveVisitedTwice([...pathTaken, current])) {
                    paths += countPathsStartingAt(connections, option, [...pathTaken, current], twice)
                }
            }
        }
    }
    return paths
}

const countPaths = (input, twice = false) => {
    const connections = new Map()
    const lines = input.trim().split('\n')
    for (const line of lines) {
        const [source, target] =line.split('-')
        if (connections.has(source)) {
            connections.set(source, [...connections.get(source), target])
        } else {
            connections.set(source, [target])
        }
        if (connections.has(target)) {
            connections.set(target, [...connections.get(target), source])
        } else {
            connections.set(target, [source])
        }
    }
    // console.log(connections)
    return countPathsStartingAt(connections, 'start', [], twice)
}

assert.equal(countPaths(example1), 10)
assert.equal(countPaths(example2), 19)
assert.equal(countPaths(example3), 226)
console.log('part 1', countPaths(data))

assert.equal(countPaths(example1, true), 36)
assert.equal(countPaths(example2, true), 103)
assert.equal(countPaths(example3, true), 3509)
console.log('part 2', countPaths(data, true))
