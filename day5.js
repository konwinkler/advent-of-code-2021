import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const example = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

const parseInput = (input) => {
    const result = []
    const lines = input.trim().split('\n')
    for (const line of lines) {
        const groups = line.split(' ')
        const start = groups[0].split(',').map(Number)
        const end = groups[2].split(',').map(Number)
        result.push({
            start: {
                x: start[0],
                y: start[1]
            },
            end: {
                x: end[0],
                y: end[1]
            }    
        })
    }
    return result
}

const countOverlappingLines = (lines, filter = true) => {
    if (filter) {
        lines = lines.filter(line => {
            return line.start.x === line.end.x || line.start.y === line.end.y
        })
    }
    // console.log(lines)
    // determine size of board
    const width = lines.reduce((total, current) => Math.max(total, current.start.x, current.end.x), 0) + 1
    const height = lines.reduce((total, current) => Math.max(total, current.start.y, current.end.y), 0) + 1

    // create empty board
    let board = []
    for (let i = 0; i < height; i++) {
        const row = Array(width).fill(0)
        board.push(row)
    }

    // increment field on board where lines are
    for (const line of lines) {
        // determine direction of line
        let direction = {
            x: 0,
            y: 0
        }
        if (line.end.x > line.start.x) {
            direction.x = 1
        }
        if (line.end.y > line.start.y) {
            direction.y = 1
        }
        if (line.end.x < line.start.x) {
            direction.x = -1
        } 
        if (line.end.y < line.start.y) {
            direction.y = -1
        }
        // console.log(line)

        // step through line
        let current = line.start
        board[current.y][current.x]++
        while (current.x !== line.end.x || current.y !== line.end.y) {
            current.x += direction.x
            current.y += direction.y
            board[current.y][current.x]++
        }
        // console.table(board)
    }
    // count all fields which got incremented more than once
    let counter = 0
    for (const row of board) {
        for (const field of row) {
            if (field > 1) {
                counter++
            }
        }
    }
    return counter
}

assert.equal(countOverlappingLines(parseInput(example)), 5)
console.log(`part 1 ${countOverlappingLines(parseInput(readFile('input5.txt')))}`)
assert.equal(countOverlappingLines(parseInput(example), false), 12)
console.log(`part 2 ${countOverlappingLines(parseInput(readFile('input5.txt')), false)}`)
