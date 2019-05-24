const moment = require('moment');
const OperationalStatus = require('../src/OperationalStatus');
const Station = require('../src/Station');
const Train = require('../src/Train');

describe("Train", function() {
    
    const turnaround = 5;
    const destination = new Station([], turnaround);
    const arrival = moment("10:30", "HH:mm");
    let train;

    beforeEach(() => {
       train = new Train(destination, arrival);
    });

    it("A train is created starting a new journey", () => {
        expect(train).not.toBe(null);
        expect(train.status).toEqual(OperationalStatus.Transit);
        expect(train.destination).toBe(destination);
        expect(train.finishTime).toEqual(moment("10:30", "HH:mm"));
        expect(train.station).toBeNull();
        expect(train.turnaround).toBe(5);
    });

    it("A train can finish a journey", () => {
        train.progress(moment("10:30", "HH:mm"));
        expect(train.status).toEqual(OperationalStatus.Turnaround);
        expect(train.station).toBe(destination);
        expect(train.finishTime.isSame(moment("10:35", "HH:mm"))).toEqual(true);
        expect(train.destination).toBeNull();
    });

    it("A train can be turned around", () => {
        // Arrived at station.
        train.progress(moment("10:30", "HH:mm"));
        // Finished turn around.
        train.progress(moment("10:35", "HH:mm"));
        expect(train.status).toEqual(OperationalStatus.Ready);
    });

    it("A train can depart on a new journey", () => {
        const newDestination = new Station([], 10);
        // Arrived at station.
        train.progress(moment("10:30", "HH:mm"));
        // Finished turn around.
        train.progress(moment("10:35", "HH:mm"));
        // Train departed on new trip.
        train.depart(newDestination, moment("11:00", "HH:mm"));
        expect(train.status).toEqual(OperationalStatus.Transit);
        expect(train.destination).toBe(newDestination);
        expect(train.finishTime).toEqual(moment("11:00", "HH:mm"));
        expect(train.station).toBeNull();
        expect(train.turnaround).toBe(10);
    });

    it("Train arriving at a station with zero turnaround become immediately ready", ()=>{
        const destinationWithZeroTurnaround = new Station([], 0);
        train = new Train(destinationWithZeroTurnaround, arrival);
        train.progress(moment("10:30", "HH:mm"));
        expect(train.status).toEqual(OperationalStatus.Ready);
    });
});