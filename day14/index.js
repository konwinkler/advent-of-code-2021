import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('day14/example')
const data = readFile('day14/input')

const cache = new Map()
const collect = (input, rules) => {
    if (cache.has(input)) {
        return cache.get(input)
    }
    const [letters, depth] = input.split(',')
    if (depth === '0') {
        return {
            [letters[0]]: 1
        }
    }
    const deeper = Number(depth) - 1
    for (const rule of rules) {
        if (letters === rule.pair) {
            const left = collect(`${letters[0] + rule.insert},${deeper}`, rules)
            const right = collect(`${rule.insert + letters[1]},${deeper}`, rules)
            const result = {...left, ...right}
            for (const key of Object.keys(left)) {
                if (left[key] !== undefined && right[key] !== undefined) {
                    result[key] += left[key]
                }
            }
            cache.set(input, result)
            return result
        }
    }
    return collect(`${letters},${deeper}`, rules)
}

const quantityMostMinusLeast = (input, steps) => {
    const lines = input.trim().split('\n')
    const polymer = lines[0].split('')
    let rules = []
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        const [pair, insert] = line.split(' -> ')
        rules.push({ 
            pair, 
            insert 
        })
    }
    const template = []
    for (let i = 0; i < polymer.length - 1; i++) {
        template.push(`${polymer[i] + polymer[i + 1]},${steps}`)
    }

    const counter = new Map()
    for (const pair of template) {
        const pairCounter = collect(pair, rules)
        // console.log(`pair ${pair}, counter ${JSON.stringify(pairCounter)}`)
        for (const key of Object.keys(pairCounter)) {
            if (counter.has(key)) {
                counter.set(key, counter.get(key) + pairCounter[key])
            } else {
                counter.set(key, pairCounter[key])
            }
        }
    }
    const last = polymer[polymer.length - 1]
    if (counter.has(last)) {
        counter.set(last, counter.get(last) + 1)
    } else {
        counter.set(last, 1)
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
cache.clear()
console.log('part 1', quantityMostMinusLeast(data, 10))
cache.clear()

assert.equal(quantityMostMinusLeast(example, 40), 2188189693529)
cache.clear()
console.log('part 2', quantityMostMinusLeast(data, 40))
cache.clear()
