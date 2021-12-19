import * as fs from 'fs'
import * as assert from 'assert'

const maxHeight = (xLow, xMax, yLow, YMax) => {
    const inTarget= (x, y) => {
        return x >= xLow
            && x <= xMax
            && y>= yLow
            && y<= YMax
    }

    
}

assert.equal(maxHeight(20, 30, -10, -5))
// console.log('part 1', maxHeight(156, 202, -110, -69))

