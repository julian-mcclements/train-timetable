const moment = require('moment');
const OperationalStatus = require('./OperationalStatus');

class Train {

    constructor(destination, finishTime) {
        this._initialise(destination, finishTime);
    }

    _initialise(destination, finishTime) {
        this.status = OperationalStatus.Transit;
        this.station = null;
        this.destination = destination;
        this.finishTime = moment(finishTime);
        this.turnaround = destination.turnaround;
    }

    progress(currentTime){
        if(!this.finishTime.isSame(currentTime)){
            return;
        }
        switch(this.status) {
            case OperationalStatus.Transit:
                if(this.turnaround === 0) {
                    this.status = OperationalStatus.Ready;
                }
                else{
                    this.status = OperationalStatus.Turnaround;
                    this.finishTime = this.finishTime.add(this.turnaround, 'minutes');
                }
                this.station = this.destination;
                this.destination = null;
                break;
            case OperationalStatus.Turnaround:
                this.status = OperationalStatus.Ready;
            default:
        }
    }

    depart(destination, finishTime) {
        this._initialise(destination, finishTime);
    }
};

module.exports = Train;