import * as fs from 'fs'
import * as assert from 'assert'
import * as util from 'util'

const example = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const parseNumbersToDraw = (input) => {
    const firstLine = input.trim().split('\n')[0]
    return firstLine.split(',').map(Number)
}

const parseBoards = (input) => {
    const lines = input.trim().split('\n')
    // first line is numbers
    // boards are always 5 x 5

    const boards = []
    const end = lines.length
    let pointer = 2 // start of first board
    while (pointer < end) {
        const board = []
        for (let index = pointer; index < (pointer + 5); index++) {
            const row = lines[index]
                .split(' ')
                .filter(content => content !== '') // 2 spaces produce an empty entry which should be ignored
                .map(Number)
                .map(value => {
                    return {
                        value,
                        marked: false,
                        [util.inspect.custom]: function (depth) { return `${(this.marked) ? '#' : ''}${this.value}` }
                    }
                })
            board.push(row)
        }
        boards.push(board)
        // 5 lines of board plus an empty line
        pointer += 6
    }
    return boards
}

const markNumber = (board, number) => {
    for (const row of board) {
        for (const entry of row) {
            if (entry.value === number) {
                entry.marked = true
            }
        }
    }
}

const isBoardWinning = (board) => {
    // check all rows
    for (const row of board) {
        let winning = true
        for (const entry of row) {
            if (entry.marked === false) {
                winning = false
                break
            }
        }
        if (winning) {
            return true
        }
    }
    // check all colums
    for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
        let winning = true
        for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
            if (board[rowIndex][columnIndex].marked === false) {
                winning = false
                break
            }
        }
        if (winning) {
            return true
        }
    }
    return false
}

const findUnmarkedNumbers = (board) => {
    const unmarkedNumbers = []
    for (const row of board) {
        for (const entry of row) {
            if (entry.marked === false) {
                unmarkedNumbers.push(entry.value)
            }
        }
    }
    return unmarkedNumbers
}

const bingo = (numbersToDraw, boards) => {
    // console.log(numbersToDraw + '\n')

    while (numbersToDraw.length > 0) {
        // draw next number
        const number = numbersToDraw.shift()
        // console.log(`draw ${number}`)
        // mark number in all boards
        for (const board of boards) {
            markNumber(board, number)
        }
        // console.log('board status')
        // console.log(boards)
        // check if game over
        for (const board of boards) {
            if (isBoardWinning(board)) {
                // calculate score
                const unmarkedNumbers = findUnmarkedNumbers(board)
                // console.log(`unmarked numbers `, unmarkedNumbers)
                return unmarkedNumbers.reduce((total, current) => {
                    return total + current
                }, 0) * number
            }
        }
    }
}

assert.equal(bingo(parseNumbersToDraw(example), parseBoards(example)), 4512)
console.log(`part 1`, bingo(parseNumbersToDraw(readFile('input4.txt')), parseBoards(readFile('input4.txt'))))