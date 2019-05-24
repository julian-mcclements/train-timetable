class Station {

    constructor(trips, turnaround) {
        this.trips = trips;
        this.turnaround = turnaround;
        this.startTrainCount = 0;
        this._destination = null;
    }

    get destination() {
        return this._destination;
    }

    set destination(newDestination) {
        this._destination = newDestination;
    }
};

module.exports = Station;