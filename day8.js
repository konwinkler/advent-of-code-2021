import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = readFile('input8.example.txt')
const data = readFile('input8.txt')

const countingUniqueOutputDigits = (input) => {
    const outputDigits = input
        .trim()
        .split('\n')
        .flatMap(line => {
            return line
                .split('|')[1]
                .split(' ')
                .filter((e) => e !== '')
            })
    const uniques = outputDigits
        .filter((digit) => {
            return digit.length === 2 // one
                || digit.length === 4 // four
                || digit.length === 3 // seven
                || digit.length === 7 // eight
        })
    return uniques.length
}

assert.equal(countingUniqueOutputDigits(example), 26)
console.log('part 1', countingUniqueOutputDigits(data))