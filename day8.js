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

const encodings = new Map([
    [parseInt('1110111', 2), '0'],
    [parseInt('0010010', 2), '1'],
    [parseInt('1011101', 2), '2'],
    [parseInt('1011011', 2), '3'],
    [parseInt('0111010', 2), '4'],
    [parseInt('1101011', 2), '5'],
    [parseInt('1101111', 2), '6'],
    [parseInt('1010010', 2), '7'],
    [parseInt('1111111', 2), '8'],
    [parseInt('1111011', 2), '9'],
])

const decode = (digit, solution) => {
    let mapped = ''
    for (const e of solution) {
        if (digit.includes(e)) {
            mapped += '1'
        } else {
            mapped += '0'
        }
    }
    const parseMapped = parseInt(mapped, 2)
    if (encodings.has(parseMapped)) {
        return encodings.get(parseMapped)
    } else {
        return undefined
    }
}

const segments = 'abcdefg'.split('')
const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
  }
const combinations = permutator(segments).map(e => e.join(''))

const findDecoding = (scrambledDigits) => {
    for (const combination of combinations) {
        let valid = true
        for (const d of scrambledDigits) {
            if (decode(d, combination) === undefined) {
                valid = false
                break;
            }
        }
        if (valid) {
            return combination
        }
    }
}

const sumOfDecodedOutputs = (input) => {
    const lines = input.trim().split('\n')
    const rows = []
    for (const line of lines) {
        const [before, after] = line.split('|').map(e => e.trim())
        const beforeIndividual = before.split(' ')
        const afterIndividual = after.split(' ')
        rows.push({
            output: afterIndividual,
            all: [...beforeIndividual, ...afterIndividual]
        })
    }

    let sum = 0
    for (const row of rows) {
        const solution = findDecoding(row.all)
        let value = ''
        for (const digit of row.output) {
            value += decode(digit, solution)
        }
        sum += parseInt(value, 10)
    }

    return sum
}

/**
 * general for part 2:
 * loop through all the mapping options (factorial 10)
 *   * what's the data structure for a mapping?
 * check if it conflicts with any of the digits in a line
 * to check: 
 */

const simple = 'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'
assert.equal(sumOfDecodedOutputs(simple), 5353)
assert.equal(sumOfDecodedOutputs(example), 61229)
console.log('part 2', sumOfDecodedOutputs(data))