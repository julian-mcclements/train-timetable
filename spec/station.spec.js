const moment = require('moment');
const Station = require('../src/Station');

describe("Station", function() {
    const turnaround = 5;
    const trips = [
        { 
            depart: moment("09:00", "HH:mm"), 
            arrive: moment("10:30", "HH:mm") 
        }
    ];

    it("A station can be instantiated", () => {
        const station = new Station(trips, turnaround);
        expect(station).not.toBe(null);
        expect(station.turnaround).toBe(5);
        expect(station.trips.length).toBe(trips.length);
        expect(station.trips[0]).toEqual(trips[0]);
        expect(station.startTrainCount).toBe(0);
    });
});