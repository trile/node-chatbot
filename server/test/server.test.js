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
        expect(res.body.messages[0].attachment.payload.text).toBe(response_text);
      })
      .end(done);
  })
})

/* ================ */

describe('POST /api/phone/add', () => {
  let reject403 = 'Forbidden.';
  let reject400_1 = 'Bad request: No messenger id.';
  let reject400_2 = 'Bad request: No phone number.';

  let body =
    {
      'messenger user id': '98765432123456789',
      'phone number': '090-123-4567'
    };
  let response_text = 'Thank you!';

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/phone/add`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  })

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/phone/add?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_1);
      })
      .end(done);
  });

  it ('should return 400 if there is no phone number in request', (done) => {
    request(app)
      .post(`/api/phone/add?token=${process.env.API_TOKEN}`)
      .send({'messenger user id':'98765432123456789'})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_2);
      })
      .end(done);
  });

  it('should add a new phone number for a customer', (done) => {

    request(app)
      .post(`/api/phone/add?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(response_text);
      })
      .end((err) => {
        if (err) return done (err);

        Customer.findOne({messenger_user_id: body["messenger user id"]})
        .then((customer) => {
          expect(customer).toExist();
          expect(customer.phone).toBe(body.phone);
          done();
        }).catch((err) => done(err));
      });
  })
});

/* ================ */

describe('POST /api/phone/update', () =>{
  let reject403 = 'Forbidden.';
  let reject400_1 = 'Bad request: No messenger id.';
  let reject400_2 = 'Bad request: No phone number.';

  let body =
    {
      'messenger user id': '5555555555',
      'phone number': '012-345-6789'
    };
  let responseText = `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${body["phone number"]}`

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/phone/update`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  });

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/phone/update?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_1);
      })
      .end(done);
  });

  it ('should return 400 if there is no phone number in request', (done) => {
    request(app)
      .post(`/api/phone/update?token=${process.env.API_TOKEN}`)
      .send({'messenger user id':'98765432123456789'})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400_2);
      })
      .end(done);
  })

  it('should update a customer with new phone number', (done) => {
    request(app)
      .post(`/api/phone/update?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(responseText);
      })
      .end(done);
  })
})

/* ================ */

describe('POST /api/appointment/setup', () =>{
  let reject403 = 'Forbidden.';
  let reject400 = 'Bad request: No messenger id.';

  let body =
    {
      'messenger user id': '98765432123456789',
      'appointment fallback email': 'test@ovc_chatbot.com',
      'appointment open time': '8AM',
      'appointment close time': '6PM',
      'appointment fallback block': 'Default Appoinment Message'
    };
  let responseText = `Cảm ơn bạn, chúng tôi đã cập nhật số điện thoại mới của bạn là ${body["phone number"]}`

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/appointment/setup`)
      .send(body)
      .expect(403)
      .expect((res) => {
        expect(res.error.text).toBe(reject403);
      })
      .end(done);
  });

  it('should return 400 if there is no messenger id', (done) => {
    request(app)
      .post(`/api/appointment/setup?token=${process.env.API_TOKEN}`)
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.error.text).toBe(reject400);
      })
      .end(done);
  });

  it ('should return 200 if successfully setup Appointment Setting', (done) => {
    request(app)
      .post(`/api/appointment/setup?token=${process.env.API_TOKEN}`)
      .send(body)
      .expect(200)
      .expect((res) => {
      })
      .end(done);
  })

})
