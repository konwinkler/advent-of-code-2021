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

console.log(gammaDelta(example))
console.log(gammaDelta(readFile('input3.txt')))

// console.log(endTravelWithAim(example))
// console.log(endTravelWithAim(readFile('input2.txt')))
