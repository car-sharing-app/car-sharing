module.exports = function canReservationBeDone(actualReservations, newFrom, newTo) {
    for (let i = 0; i < actualReservations.length; i++) {
        if (actualReservations[i].from.getTime() >= newFrom.getTime()
            && actualReservations[i].from.getTime() <= newTo.getTime()) {
            return false;
        }

        if (actualReservations[i].to.getTime() >= newFrom.getTime()
            && actualReservations[i].to.getTime() <= newTo.getTime()) {
            return false;
        }
    }

    return true;
}