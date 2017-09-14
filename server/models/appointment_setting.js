let mongoose = require('mongoose');

let AppointmentSettingSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true
  },
  open_time: {
    type: String,
  },
  close_time: {
    type: String,
  },
  timezone: {
    type: String,
  },
  duration: {
    type: Number
  },
  fallback_block: {
    type: String
  }
});

let AppointmentSetting = mongoose.model('AppoinmentSetting', AppointmentSettingSchema);

module.exports = {AppointmentSetting};
