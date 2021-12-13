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

const countPathsStartingAt = (connections, current, pathTaken) => {
    if (current === 'end') {
        return 1
    }
    let paths = 0
    const nextOptions = connections.get(current)
    for (const option of nextOptions) {
        if (isBigCave(option)) {
            paths += countPathsStartingAt(connections, option, [...pathTaken, current])
        } else {
            // small cave, only if not visited before
            if (!pathTaken.includes(option)) {
                paths += countPathsStartingAt(connections, option, [...pathTaken, current])
            }
        }
    }
    return paths
}

const countPaths = (input) => {
    const connections = new Map()
    const lines = input.trim().split('\n')
    for (const line of lines) {
        const [source, target] =line.split('-')
        if (connections.has(source)) {
            connections.set(source, [...connections.get(source), target])
        } else {
            connections.set(source, [target])
        }
        if (source !== 'start' && target !== 'end') {
            if (connections.has(target)) {
                connections.set(target, [...connections.get(target), source])
            } else {
                connections.set(target, [source])
            }
        }
    }
    // console.log(connections)
    return countPathsStartingAt(connections, 'start', [])
}

assert.equal(countPaths(example1), 10)
assert.equal(countPaths(example2), 19)
assert.equal(countPaths(example3), 226)
console.log('part 1', countPaths(data))
