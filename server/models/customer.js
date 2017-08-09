let mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
  messenger_user_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone_number: {
    type: String,
    trim: true
  }
});

let Customer = mongoose.model('Cusomter', CustomerSchema);

module.exports = {Customer};
