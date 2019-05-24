const moment = require('moment');
const Station = require('../src/Station');
const Train = require('../src/Train');
const findFirstReadyTrain = require('../src/findFirstReadyTrain');

describe('findFirstReadyTrain', ()=> {

    const stationA = new Station([], 5); 
    const stationB = new Station([], 5); 

    const turnaroundTrain = (station, arrival) => {
        const train = new Train(station, arrival);
        train.progress(arrival);
        return train;
    }

    const readyTrain = (station, arrival) => {
        const train = new Train(station, arrival);
        train.progress(arrival);
        train.progress(arrival.add(station.turnaround, 'minutes'));
        return train;
    }

    class TestCase {

        constructor(trains, expectedResult) {
            this.trains = trains;
            this.expectedResult = expectedResult;
        }
    }

    let firstReadyTrainAtA;
    let secondReadyTrainAtA;
    let firstReadyTrainAtB;
    let trainInTransit;
    let trainInTurnaround;

    beforeAll(()=>{
        firstReadyTrainAtA = readyTrain(stationA, moment("10:30", "HH:mm"));
        secondReadyTrainAtA = readyTrain(stationA, moment("11:00", "HH:mm"));
        firstReadyTrainAtB = readyTrain(stationB, moment("10:15", "HH:mm"));
        trainInTransit = new Train(stationA, moment("10:00", "HH:mm"));
        trainInTurnaround = turnaroundTrain(stationA, moment("10:15", "HH:mm"));
    });

    it('Should find the first ready train at a station', ()=>{
        const testCases = [
            new TestCase([firstReadyTrainAtA], readyTrain(stationA, moment("10:30", "HH:mm"))),
            new TestCase([firstReadyTrainAtA, trainInTransit, trainInTurnaround], readyTrain(stationA, moment("10:30", "HH:mm"))),
            new TestCase([secondReadyTrainAtA, firstReadyTrainAtA], readyTrain(stationA, moment("10:30", "HH:mm"))),
            new TestCase([firstReadyTrainAtB, firstReadyTrainAtA], readyTrain(stationA, moment("10:30", "HH:mm"))),
        ]; 
        testCases.forEach(testCase => expect(findFirstReadyTrain(testCase.trains, stationA)).toEqual(testCase.expectedResult));
    });

    it('Should return null if there is no ready train at the station', ()=>{
        const testCases = [
            new TestCase([], null),
            new TestCase([trainInTransit, trainInTurnaround], null),
            new TestCase([firstReadyTrainAtB], null)
        ];
        testCases.forEach(testCase => expect(findFirstReadyTrain(testCase.trains, stationA)).toBe(testCase.expectedResult));
    });
});