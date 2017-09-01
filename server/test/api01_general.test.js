const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Customer} = require('../models/customer');
const {customers, populateCustomers} = require('./seed/seed');

beforeEach(populateCustomers);

describe('GET /404error', () => {
  it('should receive 404 error', (done) => {
    let reject404 = "Path not found";
    request(app)
      .get('/404error')
      .expect(404)
      .expect((res) => {
        expect(res.error.text).toBe(reject404);
      })
      .end(done);
  });
});
