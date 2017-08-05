let mongoose = require('mongoose');

let ClientSchema = new mongoose.Schema({
  messenger_user_id: {
    type: String,
    required: true,
    trim: true
  },
  phone_number: {
    type: String,
    required: true,
    trim: true
  }
});

let Client = mongoose.model('Client', ClientSchema);

module.exports = {Client};
