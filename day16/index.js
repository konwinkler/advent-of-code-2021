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

const calculate = (packet) => {
    switch (packet.typeID) {
        case 0:
            return packet.subPackets
                .reduce((total, subPacket) => {
                    return total + calculate(subPacket)
                }, 0)
        case 1:
            return packet.subPackets
                .reduce((total, subPacket) => {
                    return total * calculate(subPacket)
                }, 1)
        case 2:
            return packet.subPackets
                .reduce((total, subPacket) => {
                    return Math.min(total, calculate(subPacket))
                }, Number.MAX_SAFE_INTEGER)
        case 3:
            return packet.subPackets
                .reduce((total, subPacket) => {
                    return Math.max(total, calculate(subPacket))
                }, Number.MIN_SAFE_INTEGER)
        case 4:
            return packet.value
        case 5:
            const a = calculate(packet.subPackets[0])
            const b = calculate(packet.subPackets[1])
            return (a > b) ? 1 : 0
        case 6:
            const c = calculate(packet.subPackets[0])
            const d = calculate(packet.subPackets[1])
            return (c < d) ? 1 : 0
        case 7:
            const e = calculate(packet.subPackets[0])
            const f = calculate(packet.subPackets[1])
            return (e === f) ? 1 : 0    
    }
}

const calculatePacket = (input) => {
    const binary = input.split('')
        .map((hex) => {
            return hexMapping[hex]
        })
        .join('')

    const top = parsePacket(binary, 0)
    const result = calculate(top)
    return result 
}

assert.equal(sumVersions('D2FE28'), 6)
assert.equal(sumVersions('8A004A801A8002F478'), 16)
assert.equal(sumVersions('620080001611562C8802118E34'), 12)
assert.equal(sumVersions('C0015000016115A2E0802F182340'), 23)
assert.equal(sumVersions('A0016C880162017C3686B18A3D4780'), 31)
console.log('part 1', sumVersions(data))

assert.equal(calculatePacket('C200B40A82'), 3)
assert.equal(calculatePacket('04005AC33890'), 54)
assert.equal(calculatePacket('880086C3E88112'), 7)
assert.equal(calculatePacket('CE00C43D881120'), 9)
assert.equal(calculatePacket('D8005AC2A8F0'), 1)
assert.equal(calculatePacket('F600BC2D8F'), 0)
assert.equal(calculatePacket('9C005AC2F8F0'), 0)
assert.equal(calculatePacket('9C0141080250320F1802104A08'), 1)
console.log('part 2', calculatePacket(data))
