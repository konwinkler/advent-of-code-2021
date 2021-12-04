import * as fs from 'fs';

const example = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const gammaDelta = (input) => {
    const lines = input.trim().split('\n')
    // keep count of all the bits
    const countBits = new Array(lines[0].length).fill(0)
    for (const line of lines) {
        const bits = line.split('')
        for (const [index, bit] of bits.entries()) {
            countBits[index] += Number(bit)
        }
    }
    // console.log(countBits)
    const halfWay = lines.length / 2
    let gamma = ''
    let delta = ''
    for (const count of countBits) {
        if (count > halfWay) {
            gamma += '1'
            delta += '0'
        } else {
            gamma += '0'
            delta += '1'
        }
    }
    console.log(`gamme ${gamma}`)
    console.log(`delta ${delta}`)

    return parseInt(gamma, 2) * parseInt(delta, 2)
}

const findCommon = (lines, index, tieBreaker) => {
    let counter = 0
    for (const line of lines) {
        counter += line[index]
    }
    const middle = lines.length / 2
    // based on tieBreaker being 0 or 1 the return values are flipped
    if (counter === middle) {
        return tieBreaker
    } else if (counter > middle) {
        return tieBreaker
    } else {
        return 1 - tieBreaker
    }
}

const oxygenCO2 = (input) => {
    let lines = input
        .trim()
        .split('\n')
        .map((line) => {
            return line.split('').map(Number)
        })

    let currentIndex = 0
    while (lines.length > 1) {
        // find most common bit
        const mostCommon = findCommon(lines, currentIndex, 1)
        // filter out the others
        const filtered = lines.filter((line) => line[currentIndex] === mostCommon)
        // go to next index
        currentIndex++
        lines = filtered
    }
    const oxygen = lines[0].join('')
    console.log(`oxygen ${oxygen}`)

    lines = input
        .trim()
        .split('\n')
        .map((line) => {
            return line.split('').map(Number)
        })
    currentIndex = 0
    while (lines.length > 1) {
        // find least common bit
        const leastCommon = findCommon(lines, currentIndex, 0)
        // filter out the others
        const filtered = lines.filter((line) => line[currentIndex] === leastCommon)
        // go to next index
        currentIndex++
        lines = filtered
    }
    const co2 = lines[0].join('')
    console.log(`co2    ${co2}`)

    return parseInt(oxygen, 2) * parseInt(co2, 2)
}

console.log(gammaDelta(example))
console.log(gammaDelta(readFile('input3.txt')))

console.log(oxygenCO2(example))
console.log(oxygenCO2(readFile('input3.txt')))
