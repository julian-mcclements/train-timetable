const fs = require('fs');
const moment = require('moment');
const TestCaseIterator = require('./TestCaseIterator');
const Train = require('./Train');
const Station = require('./Station');
const findFirstReadyTrain = require('./findFirstReadyTrain');

const MINUTES_IN_A_DAY = 24 * 60;

const getOutputFilename = () => {
    const now = new Date(Date.now());
    return `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.OUT`;
};

const run = (input) => {

    const iterator = TestCaseIterator.create(input);
    const fileStreamWriter = fs.createWriteStream(`./output/${getOutputFilename()}`, {
        flags: 'a' 
      });
    let stationA, stationB;
    
    while(iterator.next()) {
        const { id, turnAround, fromAtoB, fromBtoA  } = iterator.currentItem();
        stationA = new Station(fromAtoB, turnAround);
        stationA.id = 'A';
        stationB = new Station(fromBtoA, turnAround);
        stationB.id = 'B';
        stationA.destination = stationB;
        stationB.destination = stationA;
        const stations = [stationA, stationB];
        const trains = [];
        const currentTime = moment("00:00", "HH:mm");
        
        for(let minIndex = 0; minIndex < MINUTES_IN_A_DAY; minIndex+= 1){

            trains.forEach((train) => {
                train.progress(currentTime);
            });

            stations.forEach(station => {
                const departures = station.trips.filter(trip => trip.depart.isSame(currentTime))
                if(departures.length === 0) {
                    return;
                }
                departures.forEach((nextTrip) => {
                    let readyTrain = findFirstReadyTrain(trains, station);
                    if(readyTrain === null) {
                        readyTrain = new Train(station.destination, nextTrip.arrive);
                        trains.push(readyTrain);
                        station.startTrainCount += 1;
                    }
                    else {
                        readyTrain.depart(station.destination, nextTrip.arrive)
                    }
                });
                station.trips = station.trips.slice(departures.length);
            });

            currentTime.add(1, 'minutes');
        }
        
        fileStreamWriter.write(`Case #${id}: ${stationA.startTrainCount} ${stationB.startTrainCount}\n`);
    }
    fileStreamWriter.end();
};

module.exports = {run};