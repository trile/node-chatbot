let mongoose = require('mongoose');

let ClientSchema = new mongoose.Schema({
  client_name: {
    type: String,
    unique: true,
    require: true,
    trim: true
  },
  locale: {
    type: String
  },
  phone_number: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  }
})

let Client = mongoose.model('Client', ClientSchema);

module.exports = {Client};
