const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Customer} = require('../models/customer');
const {AppointmentSetting} = require('../models/appointment_setting');
const {customers, populateCustomers, populateAppointments} = require('./seed/seed');

beforeEach(populateCustomers, populateAppointments);

/* ================ */

describe('POST /api/appointment/setup', () =>{
  let reject403 = 'Forbidden.';
  let reject400 = 'Bad request: No messenger id.';

  let body_new =
    {
      'messenger user id': '98765432123456789',
      'appointment fallback email': 'new.test@ovc_chatbot.com',
      'appointment open time': '8AM',
      'appointment close time': '6PM',
      'appointment fallback block': 'Default Appoinment Message'
    };

    let body_update =
      {
        'messenger user id': '98765432123456789',
        'appointment fallback email': 'test@next-bot.com',
        'appointment open time': '10AM',
        'appointment close time': '4PM',
        'appointment fallback block': 'Default Appointment Message'
      };

  let responseText = 'Completed set up appointment settings';

  it ('should reject permission if there is no api token', (done) => {
    request(app)
      .post(`/api/appointment/setup`)
      .send(body_new)
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

  it ('should return 200 if successfully create new Appointment Setting', (done) => {
    request(app)
      .post(`/api/appointment/setup?token=${process.env.API_TOKEN}`)
      .send(body_new)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(responseText);
      })
      .end(done);
  });

  it ('should return 200 if successfully update old Appointment Setting', (done) => {
    request(app)
      .post(`/api/appointment/setup?token=${process.env.API_TOKEN}`)
      .send(body_update)
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe(responseText);
      })
      .end((err) => {
        if (err) return done(err);

        AppointmentSetting.findOne({email: body_update['appointment fallback email']})
          .then((appointmentSetting) => {
            expect(appointmentSetting.open_time).toBe('10AM');
            done();
          })
          .catch((err) => done(err));
      });
  })

})
