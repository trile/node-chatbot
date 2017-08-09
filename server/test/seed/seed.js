const {ObjectID} = require('mongodb');

const {Customer} = require('./../../models/customer');

const customerId1 = new ObjectID();
const customerId2 = new ObjectID();

const customers = [
  {
    _id: customerId1,
    messenger_user_id: '12345678987654321',
    phone_number: '123-456-7890'
  },
  {
    _id: customerId2,
    messenger_user_id: '98765432123456789'
  }
]

const populateCustomers = (done) => {
  Customer.remove({}).then(()=> {
    return Customer.insertMany(customers);
  }).then(() => done());
};

module.exports = {customers, populateCustomers};
