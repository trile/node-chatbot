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
  it('should create a new client in database', (done) => {
    let testClient =
        {
          "messenger user id": "1234566789",
          "phone number": "090-123-4567"
        };
    let response_text = "Cám ơn bạn!";
    request(app)
      .post('/addclient')
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
  it('should find a client with specific messenger id', (done) => {
    let testClient =
      {
        "messenger user id": "12345678987654321",
        "phone number": "123-456-7890"
      };
    let response_text = `Số điện thoại của bạn là ${testClient["phone number"]}, Bạn có muốn thay đổi số điện thoại của bạn không?`
    request(app)
      .post('/findclient')
      .send({"messenger user id": testClient["messenger user id"]})
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].attachment.payload.text).toBe(response_text);
      })
      .end(done);
  })
})

describe('POST /updatephone', () =>{
  it('should update a client with new phone number', (done) => {
    let testClient =
      {
        "messenger user id": "12345678987654321",
        "phone number": "012-345-6789"
      };
    let response_text = `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${testClient["phone number"]}`
    request(app)
      .post('/updatephone')
      .send(testClient)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_text);
      })
      .end(done);
  })
})
