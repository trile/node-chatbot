let mongoose = require('mongoose');

let AppointmentSettingSchema = new mongoose.Schema({
  client_email: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  duration: {
    type: Number
  },
  open_morning: {
    type: String,
    trim: true
  },
  close_morning: {
    type: String,
    trim: true
  },

  open_afternoon: {
    type: String,
    trim: true
  },

  close_afternoon: {
    type: String,
    trim: true
  },

  open_evening: {
    type: String,
    trim: true
  },
  close_evening: {
    type: String,
    trim: true
  },

  day_off: {
    type: String,
    trim: true
  }
});

let AppointmentSetting = mongoose.model('AppoinmentSetting', AppointmentSettingSchema);

module.exports = {AppointmentSetting};
