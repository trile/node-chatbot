let moment = require('moment');

let now = moment().utcOffset(7);

const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/* Function that return the available time slots for a specific to a date*/
function getAvailableDate(dateString, timezone, noOfDate, dayOffString, holidaysStr) {
    //Get the list of off days
    let offDays = [];
    dayOffString.split(',').map((dayStr) => {
      offDays.push(dayOfWeek.indexOf(dayStr))
    });

    //Get the list of holidays
    let holidays = holidaysStr.split(',');

    //Create a day interator with the appropriate date and timezone
    let dateIter = moment(dateString, 'DD/MM/YYYY');
    dateIter = dateIter.utcOffset(parseInt(timezone));
    let count = 0;
    let result = [];
    while (count < noOfDate) {
      //start from the next day
      dateIter.add(1, 'd');

      //exclude off day
      if ( offDays.includes(dateIter.day()) || holidays.includes(dateIter.format('D/M')) )
        continue;
      else {
        count++;
        result.push(dateIter.unix());
      }
    }
    return result;
}

/* Function that return the avaible appoinment slot for a specific date and time */
function getAvailableTime(dateString, startTimeStr, endTimeStr, intervalMinute, timezone) {

    let start = moment(dateString + ' ' + startTimeStr, 'DD/MM/YY hh:mm');
    let end = moment(dateString + ' ' + endTimeStr, 'DD/MM/YY hh:mm');

    var result = [];
    var slot = start;

    while (slot < end) {
        result.push(slot.unix());
        slot.add(intervalMinute, 'minutes');
    }

    return result;
}

// let res = getAvailableDate('18/09/2017', 7, 9, 'sat,sun', '1/1,30/4,2/9,20/9');
// res.map((date) => {
//   console.log(moment.unix(date).format('ddd DD/MM'))
// })

module.exports = {getAvailableDate, getAvailableTime};
