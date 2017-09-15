let mongoose = require('mongoose');

let AppointmentSettingSchema = new mongoose.Schema({
  client_email: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
  },
  duration: {
    type: Number
  },
  open_morning: {
    type: String,
  },
  close_morning: {
    type: String,
  },

  open_afternoon: {
    type: String,
  },
  
  close_afternoon: {
    type: String,
  },

  open_evening: {
    type: String,
  },
  close_evening: {
    type: String,
  }
});

let AppointmentSetting = mongoose.model('AppoinmentSetting', AppointmentSettingSchema);

module.exports = {AppointmentSetting};
