import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('input10.example.txt')
const data = readFile('input10.txt')

const syntaxErrorScore = (input) => {
    const lines = input.trim().split('\n').map(l => l.split(''))

    const corrupted = []
    let stack = []
    for (const line of lines) {
        for (const element of line) {
            let stop = false
            switch (element) {
                case '(':
                    stack.unshift(')')
                    break
                case '[':
                    stack.unshift(']')
                    break
                case '{':
                    stack.unshift('}')
                    break
                case '<':
                    stack.unshift('>')
                    break
                default:
                    if (element !== stack.shift()) {
                        corrupted.push(element)
                        stop = true
                    }
            }
            if (stop) {
                break
            }
        }
        stack = []
    }
    const points = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    }
    return corrupted.reduce((total, e) => {
            return total + points[e]
        }, 0)
}

const incompleteScore = (input) => {
    const lines = input.trim().split('\n').map(l => l.split(''))

    const completions = []
    let stack = []
    for (const line of lines) {
        let corrupted = false
        for (const element of line) {
            switch (element) {
                case '(':
                    stack.unshift(')')
                    break
                case '[':
                    stack.unshift(']')
                    break
                case '{':
                    stack.unshift('}')
                    break
                case '<':
                    stack.unshift('>')
                    break
                default:
                    if (element !== stack.shift()) {
                        corrupted = true
                    }
            }
            if (corrupted) {
                break
            }
        }
        if (!corrupted) {
            completions.push(stack)
        }

        stack = []
    }
    const points = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    }
    // console.log(completions)
    const scores = completions.map((completion) => {
        return completion.reduce((total, element) => {
            return total * 5 + points[element]
        }, 0)
    })
    // console.log(scores)
    scores.sort((a, b) => a - b)
    return scores[(scores.length - 1) / 2]
}

assert.equal(syntaxErrorScore(example), 26397)
console.log('part 1', syntaxErrorScore(data))

assert.equal(incompleteScore(example), 288957)
console.log('part 2', incompleteScore(data))