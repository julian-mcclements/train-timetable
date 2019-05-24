const OperationalStatus = require('./OperationalStatus');

const compareFinishTime = (train1, train2) => {
    const diff = train1.finishTime.diff(train2.finishTime);
    if (diff === 0){
        return diff;
    }
    return diff < 0 ? -1 : 1;
}

const findFirstReadyTrain = (trains, station) => {
    const readyTrains = trains.filter(
        (train) => train.station === station && train.status === OperationalStatus.Ready)
        .sort(compareFinishTime);
    return readyTrains.length === 0 ? null : readyTrains[0];
}

module.exports = findFirstReadyTrain;