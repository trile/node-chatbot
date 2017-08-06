const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Client} = require('../models/client');
const {clients, populateClients} = require('./seed/seed');

beforeEach(populateClients);

describe('GET /404error', () => {
  it('should receive 404 error', (done) => {
    let text = "Path not found";
    request(app)
      .get('/404error')
      .expect(404)
      .expect((res) => {
        expect(res.error.text).toBe(text);
      })
      .end(done);
  });
});

describe('POST /addclient', () => {
  let rejectText = 'Forbidden.';
  let testClient =
    {
      'messenger user id': '1234566789',
      'phone number': '090-123-4567'
    };
  let response_text = 'Cám ơn bạn!';

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/addclient`)
      .send(testClient)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(rejectText);
      })
      .end(done);
  })

  it('should create a new client in database', (done) => {

    request(app)
      .post(`/addclient?token=${process.env.API_TOKEN}`)
      .send(testClient)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_text);
      })
      .end((err)=> {
        if (err) done (err);

        Client.findOne({messenger_user_id: testClient["messenger user id"]}).then((client) => {
          expect(client).toExist();
          expect(client.phone).toBe(testClient.phone);
          done();
        }).catch((err) => done(err));
      });
  })
});

describe('POST /findclient', () => {
  let rejectText = 'Forbidden.';
  let testClient =
    {
      'messenger user id': '12345678987654321',
      'phone number': '123-456-7890'
    };
  let response_text = `Số điện thoại của bạn là ${testClient["phone number"]}, Bạn có muốn thay đổi số điện thoại của bạn không?`;

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/findclient`)
      .send({"messenger user id": testClient["messenger user id"]})
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(rejectText);
      })
      .end(done);
  })

  it('should find a client with specific messenger id', (done) => {
    request(app)
      .post(`/findclient?token=${process.env.API_TOKEN}`)
      .send({"messenger user id": testClient["messenger user id"]})
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].attachment.payload.text).toBe(response_text);
      })
      .end(done);
  })
})

describe('POST /updatephone', () =>{
  let rejectText = 'Forbidden.';
  let testClient =
    {
      'messenger user id': '12345678987654321',
      'phone number': '012-345-6789'
    };
  let responseText = `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${testClient["phone number"]}`

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/updatephone`)
      .send(testClient)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(rejectText);
      })
      .end(done);
  })

  it('should update a client with new phone number', (done) => {
    request(app)
      .post(`/updatephone?token=${process.env.API_TOKEN}`)
      .send(testClient)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(responseText);
      })
      .end(done);
  })
})
