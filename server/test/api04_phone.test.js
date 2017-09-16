const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Customer} = require('../models/customer');
const {customers, populateSamples} = require('./seed/seed');

beforeEach(populateSamples);


/* ================ */

describe('POST /api/phone/check', () => {
  let reject403 = 'Forbidden.';
  let reject400 = 'Bad request: No messenger id.';

  let body =
    {
      'messenger user id': '5555555555'
    };

  let response_text = `Số điện thoại của bạn là 123-456-7890, Bạn có muốn thay đổi số điện thoại của bạn không?`;

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/phone/check`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  })

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/phone/check?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400);
      })
      .end(done);
  });

  it('should find a customer with specific messenger id', (done) => {
    request(app)
      .post(`/api/phone/check?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_text);
      })
      .end(done);
  })
})

/* ================ */

describe('POST /api/phone/set', () =>{
  let reject403 = 'Forbidden.';
  let reject400_1 = 'Bad request: No messenger id.';
  let reject400_2 = 'Bad request: No phone number.';

  let body =
    {
      'messenger user id': '5555555555',
      'phone number': '012-345-6789'
    };
  let responseText = `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${body["phone number"]}. Số này chính xác rồi hay bạn muốn thay đổi?`

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/phone/set`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  });

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/phone/set?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_1);
      })
      .end(done);
  });

  it ('should return 400 if there is no phone number in request', (done) => {
    request(app)
      .post(`/api/phone/set?token=${process.env.API_TOKEN}`)
      .send({'messenger user id':'98765432123456789'})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_2);
      })
      .end(done);
  })

  it('should update a customer with new phone number', (done) => {
    request(app)
      .post(`/api/phone/set?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(responseText);
      })
      .end(done);
  })
})
