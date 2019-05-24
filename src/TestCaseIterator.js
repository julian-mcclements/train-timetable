const fs = require('fs');
const moment = require('moment');

class TestCase {
    constructor(id, turnAround, fromAtoB, fromBtoA){
        this.id = id;
        this.turnAround = turnAround;
        this.fromAtoB = fromAtoB;
        this.fromBtoA = fromBtoA;
    }
}

class TestCaseIterator {

    constructor(lines) {
        this._lines = lines;
        this._ubound = this._lines.length - 1;
        this._currentLineIndex = 1; // Skip reading the number of tests in the file.
        this._currentTestCaseId = 1;
    }

    _isOutOfRange() {
        return this._currentLineIndex >= this._ubound;
    }

    _readLine() {
        return this._lines[this._currentLineIndex++];
    }

    _readLineAsInt() {
        return parseInt(this._lines[this._currentLineIndex++], 10);
    }

    _readTrips(tripCount) {
        const trips = [];
        for(let index = 1; index <= tripCount; index++){
            const [depart, arrive] = 
                this._readLine().split(' ').map(str => moment(str, "HH:mm"));
            trips.push({depart, arrive});
        }
        return trips.sort((trip1, trip2) => {
            if(trip1.depart < trip2.depart) {
                return -1;
            }
            if(trip1.depart > trip2.depart) {
                return 1;
            }
            return 0;
        });
    }

    currentItem() {
        if(this._isOutOfRange()) {
            return null;
        }
        const turnAround = this._readLineAsInt();
        const [aToBTripCount, bToATripCount] = 
            this._readLine().split(' ').map(str => parseInt(str, 10));
        const fromAtoB = this._readTrips(aToBTripCount);
        const fromBtoA = this._readTrips(bToATripCount);
        return new TestCase(this._currentTestCaseId++, turnAround, fromAtoB, fromBtoA);
    }

    next(){
        return !this._isOutOfRange();
    }

    static create(path) {
        const WIN_NEWLINE = "\r\n";
        const UNIX_NEWLINE = "\n";
        try {  
            const content = fs.readFileSync(path, 'utf8');
            const newLine = content.indexOf(WIN_NEWLINE) !== -1 ? WIN_NEWLINE : UNIX_NEWLINE;
            return new TestCaseIterator(content.split(newLine));
        } catch(e) {
            console.log('Error:', e.message, e.stack);
        }
    }

}

module.exports = TestCaseIterator;