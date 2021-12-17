import * as fs from 'fs'
import * as assert from 'assert'

const readFile = (fileName) => {
    return fs.readFileSync(fileName, 'utf8')
}

const day = 16
const data = readFile(`day${day}/input.txt`)

const hexMapping = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
}

const parseValue = (binary, pointer) => {
    let valueBinary = ''
    let groupStart = '1'
    while (groupStart === '1') {
        groupStart = binary.slice(pointer, pointer + 1)
        pointer++
        valueBinary += binary.slice(pointer, pointer + 4)
        pointer += 4
    }
    return {
        lastPointer: pointer,
        value: parseInt(valueBinary, 2)
    }
}

const parsePacket = (binary, pointer) => {
    const version = parseInt(binary.slice(pointer, pointer + 3), 2)
    pointer += 3
    const typeID = parseInt(binary.slice(pointer, pointer + 3), 2)
    pointer += 3
    if (typeID === 4) {
        // literal type
        let valueBinary = ''
        let groupStart = '1'
        while (groupStart === '1') {
            groupStart = binary.slice(pointer, pointer + 1)
            pointer++
            valueBinary += binary.slice(pointer, pointer + 4)
            pointer += 4
        }
        return {
            version,
            typeID,
            value: parseInt(valueBinary, 2),
            lastPointer: pointer
        }
    } else {
        // operator type
        const subPackets = []
        const lengthTypeID = binary[pointer]
        pointer++
        if (lengthTypeID === '0') {
            const length = parseInt(binary.slice(pointer, pointer + 15), 2)
            pointer += 15
            const oldPointer = pointer
            while (pointer < oldPointer + length) {
                const subPacket = parsePacket(binary, pointer)
                subPackets.push(subPacket)
                pointer = subPacket.lastPointer
            }
            return {
                version,
                typeID,
                lengthTypeID,
                subPackets: subPackets,
                lastPointer: pointer
            }
        } else if (lengthTypeID === '1') {
            const amountSubPackets = parseInt(binary.slice(pointer, pointer + 11), 2)
            pointer += 11
            let count = 0
            while (count < amountSubPackets) {
                const subPacket = parsePacket(binary, pointer)
                count++
                subPackets.push(subPacket)
                pointer = subPacket.lastPointer
            }
            return {
                version,
                typeID,
                lengthTypeID,
                subPackets: subPackets,
                lastPointer: pointer 
            }
        }
    }
}

const getVersion = (packet) => {
    let sum = 0
    if (packet.typeID !== 4) {
        for (const subPacket of packet.subPackets) {
            sum += getVersion(subPacket)
        }
    }
    return sum + packet.version
}

const sumVersions = (input) => {
    const binary = input.split('')
        .map((hex) => {
            return hexMapping[hex]
        })
        .join('')

    const top = parsePacket(binary, 0)

    const sumVersion = getVersion(top)

    return sumVersion
}

assert.equal(sumVersions('D2FE28'), 6)
assert.equal(sumVersions('8A004A801A8002F478'), 16)
assert.equal(sumVersions('620080001611562C8802118E34'), 12)
assert.equal(sumVersions('C0015000016115A2E0802F182340'), 23)
assert.equal(sumVersions('A0016C880162017C3686B18A3D4780'), 31)
console.log('part 1', sumVersions(data))
