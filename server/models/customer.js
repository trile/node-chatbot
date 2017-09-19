let mongoose = require('mongoose');

let CustomerSchema = new mongoose.Schema({
  messenger_user_id: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  first_name: {
    type:String
  },
  last_name: {
    type:String
  },
  locale: {
    type: String
  },
  phone_number: {
    type: String,
    trim: true
  },
  appointment: {
    type: Number
  }
});

let Customer = mongoose.model('Cusomter', CustomerSchema);

module.exports = {Customer};
