const {ObjectID} = require('mongodb');

const {Customer} = require('../../models/customer');
const {AppointmentSetting} = require('./../../models/appointment_setting');

const customerId1 = new ObjectID();
const customerId2 = new ObjectID();
const customerId3 = new ObjectID();

const appointmentId1 = new ObjectID();

const customers = [
  {
    _id: customerId1,
    messenger_user_id: '12345678987654321',
  },
  {
     _id: customerId2,
    messenger_user_id: '98765432123456789',
    locale: 'en_US'
  },
  {
    _id: customerId3,
    messenger_user_id: '5555555555',
    locale: 'vi_VN',
    phone_number: '123-456-7890'
  }
];

const appointments = [
  {
    _id: appointmentId1,
    email: 'test@next-bot.com',
    open_time: '8AM',
    close_time: '6PM',
    timezone: '7',
    fallback_block: 'Default Appointment Message'
  }
];

const populateSamples = (done) => {

  let customerRemoveP = Customer.remove({});
  let appointmentRemoveP = AppointmentSetting.remove({});

  Promise.all([customerRemoveP, appointmentRemoveP])
  .then(() => {
     let customerInsertP = Customer.insertMany(customers);
     let appoinmentInsertP = AppointmentSetting.insertMany(appointments);

     return Promise.all([customerInsertP, appoinmentInsertP])

  })
    .then(() => done());
};


// const populateCustomers = (done) => {
//   Customer.remove({}).then(() => {
//     return Customer.insertMany(customers);
//   }).then(() => done());
// };
//
// const populateAppointments = (done) => {
//   Appointment.remove({}).then(() => {
//     return Appointment.insertMany(appointments);
//   }).then(()=> done());
// }


module.exports = {customers, populateSamples};
