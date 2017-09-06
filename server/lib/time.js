let moment = require('moment');

let now = moment().utcOffset(7);

console.log(now.weekday()); //get day of the weekday
console.log(now.format("DD/MM/YY")); //get day of the weekday


/* Function that return the available time slots for a specific to a date*/

function getAvailabeTimeSlot(dateString, intervalMinute, offsetToNow) {

    let start = moment(dateString, 'DD/MM/YYYY');
    start = start.utcOffset(7).hour(3).minute(0).second(0);
    console.log(start);

    let limit = moment().utcOffset(7).add(offsetToNow, 'hours')

    let end = start.clone().hour(18).minute(0).second(0)
    let startBreak = start.clone().hour(11).minute(59).second(0)
    let endBreak = start.clone().hour(12).minute(59).second(0)

    // Round starting time closet internal
    start.minutes(Math.ceil(start.minutes() / intervalMinute) * intervalMinute);

    var result = [];

    var slot = moment(start);

    while (slot<= end) {
        if (slot>startBreak && slot<endBreak) {
          slot.add(intervalMinute, 'minutes');
          continue;
        }
        if (slot > limit ) {
          result.push(slot.format('HH:mm'));
        }
        slot.add(intervalMinute, 'minutes');
    }

    return result;
}

console.log(getAvailabeTimeSlot('03/09/2017', 60, 3));


// var getTimeLeft = function(){
//   var now = moment();
//   var deadline = now.clone().hour(12).minute(0).second(0);
//   if (now.isAfter(deadline)) {
//     // disable RSVP button here
//     return 'Closed';
//   } else {
//     // enable RSVP button here
//     // returns “in x hours”, “in x minutes”, “in a few seconds”
//     return deadline.from(now);
//   }
// };
