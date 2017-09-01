const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Customer} = require('../models/customer');
const {customers, populateCustomers} = require('./seed/seed');

beforeEach(populateCustomers);


/* ================ */

describe('POST /api/locale/set', () => {
  let reject403 = 'Forbidden.';
  let reject400_1 = 'Bad request: No messenger id.';
  let reject400_2 = 'Bad request: No language.';

  let body = {
    'messenger user id': '12345678987654321',
    'language': 'en_US'
  }

  let response_text = "Thank you! Your preferred language has been set!";

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/locale/set`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  })

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/locale/set?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_1);
      })
      .end(done);
  });

  it('should return 400 if there is no language in the request', (done) => {
    request(app)
      .post(`/api/locale/set?token=${process.env.API_TOKEN}`)
      .send({'messenger user id': '12345678987654321'})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_2);
      })
      .end(done);
  });

  it('should set proper language for given customer', (done) => {
    request(app)
      .post(`/api/locale/set?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_text);
      })
      .end((err) => {
        if (err) return done(err);

        Customer.findOne({messenger_user_id: body["messenger user id"]})
          .then((customer) => {
            expect(customer.locale).toBe(body.language);
            done();
          })
          .catch((err) => done(err))
      });
  });

  it('should set Chatfuel user property', (done) => {
    request(app)
      .post(`/api/locale/set?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.set_attributes['language']).toBe('en_US');
      })
      .end((err) => {
        if (err) return done(err);

        Customer.findOne({messenger_user_id: body["messenger user id"]})
          .then((customer) => {
            expect(customer.locale).toBe(body.language);
            done();
          })
          .catch((err) => done(err))
      });
  });

  it('should redirect to proper block', (done) => {
    request(app)
      .post(`/api/locale/set?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.redirect_to_blocks[0]).toBe("Finish Customer Locale");
      })
      .end((err) => {
        if (err) return done(err);

        Customer.findOne({messenger_user_id: body["messenger user id"]})
          .then((customer) => {
            expect(customer.locale).toBe(body.language);
            done();
          })
          .catch((err) => done(err))
      });
  });

});
