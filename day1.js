import * as fs from 'fs';

const example = `
199
200
208
210
200
207
240
269
260
263
`

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8')
}

const depthIncreases = (input) => {
    const depths = input.trim().split('\n').map(Number)

    let increases = 0
    for (let i = 1; i < depths.length; i++) {
        const previous = depths[i - 1]
        const current = depths[i]
        if (current > previous) {
            increases++
            // console.log(`increase ${current} > ${previous}`)
        }
    }

    return increases
}

const threeMeasure = (input) => {
    const depths = input.trim().split('\n').map(Number)

    let increases = 0
    for (let i = 3; i < depths.length; i++) {
        const previous = depths[i - 3] + depths[i - 2] + depths[i - 1]
        const current = depths[i - 2] + depths[i - 1] + depths[i]
        if (current > previous) {
            increases++
            // console.log(`increase ${current} > ${previous}`)
        }
    }

    return increases
}

console.log(depthIncreases(example))
console.log(depthIncreases(readFile('input1.txt')))

console.log(threeMeasure(example))
console.log(threeMeasure(readFile('input1.txt')))
