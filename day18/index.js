import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const day = 18
const example = readFile(`day${day}/example`)
const example2 = readFile(`day${day}/example2`)
const data = readFile(`day${day}/input.txt`)

const print = (number) => {
    if (number.hasPair) {
        return `[${print(number.left)},${print(number.right)}]`
    } else {
        return `${number.value}`
    }
}

const findTopLevelComma = (text) => {
    let depthCounter = 0
    for (let i = 0; i < text.length; i++) {
        const letter = text[i]
        if (letter === ',' && depthCounter === 0) {
            return i
        } else if (letter === '[') {
            depthCounter++
        } else if (letter === ']') {
            depthCounter--
        }
    }
    assert.fail(`could not find comma top level in ${text}`)
}
assert.equal(findTopLevelComma('[1,2],[[3,4],5]'), 5)

const parseNumber = (text, parent = undefined) => {
    if (text.length === 1) {
        // this is just a regular number
        return {
            value: parseInt(text, 10),
            parent
        }
    }
    // always enclosed by [ and ] so those can be trimmed
    const trimmed = text.slice(1, -1)
    let commaPointer = findTopLevelComma(trimmed)

    const number = {
        left: undefined,
        right: undefined,
        hasPair: true,
        parent
    }
    number.left = parseNumber(trimmed.slice(0, commaPointer), number)
    number.right = parseNumber(trimmed.slice(commaPointer + 1), number)
    return number
}

const needsExploding = (number, depth = 0) => {
    if (number.hasPair) {
        if (depth >= 4) {
            return {
                value: true,
                number
            }
        } else {
            return needsExploding(number.left, depth + 1)
                || needsExploding(number.right, depth + 1)
        }
    } else {
        return { value: false }
    }
}
assert.equal(needsExploding(parseNumber('[[[[[9,8],1],2],3],4]')).value, true)
assert.equal(needsExploding(parseNumber('[[[1,2],3],4]')).value, false)

const needsSplit = (number) => {
    if (number.hasPair) {
        const leftResult = needsSplit(number.left)
        if (leftResult.result) {
            return leftResult
        }
        const rightResult = needsSplit(number.right)
        if (rightResult.result) {
            return rightResult
        }
        return {
            result: false
        }
    } else {
        const result = number.value >= 10
        return {
            number,
            result
        }
    }
}
assert.equal(needsSplit(parseNumber('[[[1,2],3],4]')).result, false)

const addRight = (number) => {
    const addRight = number.right.value
    // go up until current is left arm
    let current = number
    while (current.parent !== undefined && current.parent.left !== current) {
        current = current.parent
    }
    current = current.parent
    if (current === undefined || !current.hasPair) {
        return
    }
    // go down 1 right
    current = current.right
    // go down left until number
    while (current.hasPair) {
        current = current.left
    }
    current.value = current.value + addRight
}
const addRightTest = () => {
    const number = parseNumber('[[1,2],3]')
    addRight(number.left)
    assert.equal(number.right.value, 5)
    const secondNumber = parseNumber('[1,[2,3]]')
    addRight(secondNumber.right)
    assert.equal(secondNumber.left.value, 1)
}
addRightTest()

const addLeft = (number) => {
    const addLeft = number.left.value
    let current = number
    while (current.parent !== undefined && current.parent.right !== current) {
        current = current.parent
    }
    current = current.parent
    if (current === undefined || !current.hasPair) {
        return
    }
    current = current.left
    while (current.hasPair) {
        current = current.right
    }
    current.value = current.value + addLeft
}
const addLeftTest = () => {
    const number = parseNumber('[[1,2],3]')
    addLeft(number.left)
    assert.equal(number.right.value, 3)
    const secondNumber = parseNumber('[1,[2,3]]')
    addLeft(secondNumber.right)
    assert.equal(secondNumber.left.value, 3)
}
addLeftTest()

const explode = (number) => {
    addRight(number)
    addLeft(number)
    const parent = number.parent
    number.parent = undefined
    const replacement = {
        value: 0,
        parent,
    }
    if (parent.left === number) {
        parent.left = replacement
    } else if (parent.right === number) {
        parent.right = replacement
    } else {
        assert.fail('could not explode number due to parent connection')
    }
}
const explodeTest = () => {
    const number = parseNumber('[[1,2],3]')
    explode(number.left)
    assert.equal(number.right.value, 5)
    assert.equal(number.left.value, 0)
    const secondNumber = parseNumber('[1,[2,3]]')
    explode(secondNumber.right)
    assert.equal(secondNumber.left.value, 3)
    assert.equal(secondNumber.right.value, 0)
}
explodeTest()

const split = (number) => {
    const { value } = number
    const leftValue = Math.floor(value / 2)
    const rightValue = Math.ceil(value / 2)
    number.hasPair = true
    number.left = {
        parent: number,
        value: leftValue
    }
    number.right = {
        parent: number,
        value: rightValue
    }
}
const splitTest = () => {
    const number = {
        hasPair: false,
        value: 10
    }
    split(number)
    assert.equal(number.left.value, 5)
    assert.equal(number.right.value, 5)
}
splitTest()

const add = (left, right) => {
    let number = {
        hasPair: true,
        left,
        right
    }
    left.parent = number
    right.parent = number
    let reductionHappened = true
    while (reductionHappened) {
        reductionHappened = false
        const explodingTest = needsExploding(number)
        if (explodingTest.value) {
            reductionHappened = true
            number = explode(explodingTest.number)
            break
        }
        const splittingTest = needsSplit(number)
        if (splittingTest.result) {
            reductionHappened = true
            number = split(splittingTest.number)
            break
        }
    }
    return number
}

const addMagnitude = (number) => {
    if (number.hasPair) {
        return addMagnitude(number.left) * 3
            + addMagnitude(number.right) * 2
    } else {
        return number.value
    }
}
assert.equal(addMagnitude(parseNumber('[[1,2],[[3,4],5]]')), 143)
assert.equal(addMagnitude(parseNumber('[[[[0,7],4],[[7,8],[6,0]]],[8,1]]')), 1384)
assert.equal(addMagnitude(parseNumber('[[[[1,1],[2,2]],[3,3]],[4,4]]')), 445)
assert.equal(addMagnitude(parseNumber('[[[[3,0],[5,3]],[4,4]],[5,5]]')), 791)
assert.equal(addMagnitude(parseNumber('[[[[5,0],[7,4]],[5,5]],[6,6]]')), 1137)
assert.equal(addMagnitude(parseNumber('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')), 3488)

const magnitude = (input) => {
    const lines = input.trim().split('\n')
    const numbers = []
    for (const line of lines) {
        numbers.push(parseNumber(line))
    }

    let sum = numbers.shift()
    console.log(print(sum))
    while (numbers.length > 0) {
        sum = add(sum, numbers.shift())
        console.log(print(sum))
    }

    return addMagnitude(sum)
}


assert.equal(magnitude(example2), 3488)
// assert.equal(magnitude(example), 4140)