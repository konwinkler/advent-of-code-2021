import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('day14/example')
const data = readFile('day14/input')

const quantityMostMinusLeast = (input, steps) => {
    const lines = input.trim().split('\n')
    const polymer = lines[0].split('')
    let rules = []
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        const [pair, insert] = line.split(' -> ')
        rules.push({ 
            pair: pair.split(''), 
            insert 
        })
    }
    for (let step = 1; step <= steps; step++) {
        for (let i = 0; i < polymer.length - 1; i++) {
            for (const rule of rules) {
                if (polymer[i] === rule.pair[0] && polymer[i + 1] === rule.pair[1]) {
                    polymer.splice(i + 1, 0, rule.insert)
                    i++
                    break
                }
            }
        }
        // console.log(`step ${step} ${polymer.join('')}`)
    }
    const counter = new Map()
    for (const element of polymer) {
        if (counter.has(element)) {
            counter.set(element, counter.get(element) + 1)
        } else {
            counter.set(element, 1)
        }
    }
    let most = 0
    let least = Number.MAX_SAFE_INTEGER
    for (const value of counter.values()) {
        most = Math.max(most, value)
        least = Math.min(least, value)
    }
    return most - least
}

assert.equal(quantityMostMinusLeast(example, 10), 1588)
console.log('part 1', quantityMostMinusLeast(data, 10))
