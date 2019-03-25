const request = require('supertest');
const mongo = require('./../mongoDB');
const app = require('./../app');
const TOKEN = '6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu';
const stub = {
  init: {
    event: 'init',
    options: {
      browser: 'Chrome',
      pageID: '609657ac-f58f-4339-b4fc-a95c3843c7ef',
      timestamp: 1553511226441,
      url: 'http://localhost:3000/',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
      userID: '82219ba6-4164-4673-835a-c81cb109c085',
    },
    click: {
      event: 'click',
      options: {
        type: 'click',
        height: 1080,
        pageID: '609657ac-f58f-4339-b4fc-a95c3843c7ef',
        timestamp: 1553511227517,
        userID: '82219ba6-4164-4673-835a-c81cb109c085',
        width: 1920,
        x: 55,
        y: 289,
      },
    },
  },
};

describe('General', () => {
  beforeAll(async (done) => {
    await mongo.connect();
    done();
  });
  afterAll((done) => {
    mongo.disconnect(done);
    app.close();
  });

  test('User init response return required keys', (done) => {
    request(app)
      .post('/init')
      .set('token', TOKEN)
      .send({ page: true, user: true })
      .then(function (res) {
        expect(JSON.stringify(Object.keys(res.body)))
          .toBe(JSON.stringify(['userID', 'pageID']));
        done();
      })
  });

  test('Collect request auth error. Check for "Access denied"', (done) => {
    request(app)
      .post('/collect')
      .send(stub.init)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.status).toBe(401);
        expect(res.text).toBe(JSON.stringify('Access denied'));
        done();
      })
  });

  test('Collect data request success', (done) => {
    request(app)
      .post('/collect')
      .set('token', TOKEN)
      .send(stub.init)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(function (res) {
        expect(res.status).toBe(200);
        expect(res.text).toBe(JSON.stringify('ok'));
        done();
      })
  });
});