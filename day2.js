import * as fs from 'fs';

const example = `
forward 5
down 5
forward 8
up 3
down 8
forward 2
`

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8')
}

const endTravel = (input) => {
    const lines = input.trim().split('\n')
    const instructions = lines.map(line => {
        const code = line[0]
        const amount = Number(line[line.length - 1])
        return {
            code,
            amount
        }
    })

    // console.log(lines)

    let depth = 0
    let horizontal = 0

    for (const instruction of instructions) {
        switch (instruction.code) {
            case 'f':
                horizontal += instruction.amount
                break
            case 'd':
                depth += instruction.amount
                break;
            case 'u':
                depth -= instruction.amount
                break
        }
    }

    return depth * horizontal
}


(() => {
    console.log(endTravel(example))
    console.log(endTravel(readFile('input2.txt')))

    // console.log(threeMeasure(example))
    // console.log(threeMeasure(readFile('input1.txt')))
})()