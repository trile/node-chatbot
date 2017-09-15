let moment = require('moment');

let now = moment().utcOffset(7);

// console.log(now.weekday()); //get day of the weekday
// console.log(now.format("DD/MM/YY")); //get day of the weekday


/* Function that return the available time slots for a specific to a date*/

function getAvailableDate(dateString, timezone, noOfDate) {
    let dateIter = moment(dateString, 'DD/MM/YYYY');
    dateIter = dateIter.utcOffset(parseInt(timezone));
    let count = 0;
    let result = [];
    while (count < noOfDate) {
      dateIter.add(1, 'd');
      if (dateIter.day() === 6 || dateIter.day() ===0)
        continue;
      else {
        count++;
        result.push(dateIter.unix());
      }
    }
    return result;
}

function getAvailableTime(dateString, startTimeStr, endTimeStr, intervalMinute, timezone) {

    let start = moment(dateString + ' ' + startTimeStr, 'DD/MM/YY hh:mm').utcOffset(timezone);
    let end = moment(dateString + ' ' + endTimeStr, 'DD/MM/YY hh:mm').utcOffset(timezone);

    var result = [];
    var slot = start;

    while (slot < end) {
        result.push(slot.unix());
        slot.add(intervalMinute, 'minutes');
    }

    return result;
}

// result = getAvailabeTime('03/09/2017', '9:00', '17:00', 60, '7', '12:00', "13:00");
// result.map( (time)=> {
//   console.log(moment.unix(time).format('MM-DD hh:mm'))
// })

module.exports = {getAvailableDate, getAvailableTime};
