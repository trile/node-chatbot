const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Customer} = require('../models/customer');
const {customers, populateSamples} = require('./seed/seed');

beforeEach(populateSamples);


/* ================ */

describe('POST /api/customer/setup', () => {
  let reject403 = 'Forbidden.';
  let reject400 = 'Bad request: No messenger id.';

  let bodyNew = // new id not in the system
    {
      'messenger user id': '8888888888',
    };

  let bodyNoLocale = // id is in the system but no locale set
    {
      'messenger user id': '12345678987654321',
    };

  let bodyWithLocale = // id is in the sytem with locate set to en_US
    {
      'messenger user id': '98765432123456789'
    };

  let response_dual_lang = "Chào bạn! Hi there!";
  let response_eng = "Hello {{first name}}!";

  it('should reject permission of there no api token', (done) => {
    request(app)
      .post(`/api/customer/setup`)
      .send({})
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  });

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400);
      })
      .end(done);
  });

  it('should create a new customer he/she is not yet in the system', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send(bodyNew)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_dual_lang);
      })
      .end((err) => {
        if (err) return done (err);

        Customer.findOne({messenger_user_id: bodyNew["messenger user id"]}).then((customer) => {
          expect(customer).toExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should use dual language greeting if customer locale is not set', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send(bodyNoLocale)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_dual_lang);
      })
      .end(done);
  });

  it('should use proper language if customer locale is set', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send(bodyWithLocale)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_eng);
      })
      .end(done);
  });

  it('should set Chatfuel user property if customer locate is set', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send(bodyWithLocale)
      .expect(200)
      .expect((res) => {
        expect(res.body.set_attributes['language']).toBe('en_US');
      })
      .end(done);
  });

  it('should redirect to proper block of customer locate is set', (done) => {
    request(app)
      .post(`/api/customer/setup?token=${process.env.API_TOKEN}`)
      .send(bodyWithLocale)
      .expect(200)
      .expect((res) => {
        expect(res.body.redirect_to_blocks[0]).toBe("Initiate Conversation");
      })
      .end(done);
  });

})
