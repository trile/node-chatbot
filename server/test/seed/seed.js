const {ObjectID} = require('mongodb');

const {Client} = require('./../../models/client');

const clientId = new ObjectID();

const clients = [
  {
    _id: clientId,
    messenger_user_id: '12345678987654321',
    phone_number: '123-456-7890'
  }
]

const populateClients = (done) => {
  Client.remove({}).then(()=> {
    return Client.insertMany(clients);
  }).then(() => done());
};

module.exports = {clients, populateClients};
