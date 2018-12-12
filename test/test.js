
// Require the dev-dependencies
import * as helpers from '../server/controllers/helpers';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');


// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

// Generate Token
var userToken = [];

// Test error handling
describe('GET /', () => {
  it('Return incorrect endpoint', (done) => {
    chai.request(app)
      .get('/wrong')
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.have.string('Incorrect');
        done(err);
      });
  });
});

// Test welcome message
describe('GET /', () => {
  it('Welcomes you to the API', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.string('iReporter Project API');
        done(err);
      });
  });
});

// Test sign up
describe('POST /api/v1/auth/signup', () => {
  it('Signup user successfully', (done) => {
    const signUpData = {
      // ID is auto generated sequence by db
      firstname: 'testFirstName',
      lastname: 'testLastName',
      othernames: 'testOtherNames',
      email: 'test@testt.com',
      phoneNumber: '08185334904',
      username: 'testUserr',
      isAdmin: true,
      password: 'testPassword1@@',
    };

    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signUpData)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].token);
        expect(res.body.data[0].user.id).to.be.a('number');
        done(err);
        userToken = res.body.data[0].token;
      });
  });
});

// Test sign in
describe('POST /api/v1/auth/signin', () => {
  it('Signin user successfully', (done) => {
    const signInData = {
      username: 'testUserr',
      password: 'testPassword1@@',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signInData)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].token);
        expect(res.body.data[0].user.id).to.be.a('number');
        done(err);
      });
  });

  it('Return wrong credentials complain', (done) => {
    const signInData = {
      username: 'testUser',
      password: 'wrongPassword',
    };

    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signInData)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.be.string('password');
        done(err);
      });
  });
});

// Test create a new red-flag record
describe('POST /api/v1/records/red-flags', () => {
  it('Successfully post a red-flag record', (done) => {
    const record = {
      createdBy: 'Tester',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };

    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Created');
        expect(res.body.data[0].new_record.title).to.have.string('Abacha');
        expect(res.body.data[0].new_record.comment).to.have.string('where');
        expect(res.body.data[0].new_record.images).to.have.string('www.image.cm');
        done(err);
      });
  });

  it('Return server error', (done) => {
    const record = {
      date: 'non-date-entry',
      createdBy: 'Tester',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };

    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        done(err);
      });
  });

  it('Returns that request is incomplete, no createdBy', (done) => {
    const record = {
      //  createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('createdBy');
        done(err);
      });
  });

  it('Returns that request is incomplete, no type', (done) => {
    const record = {
      createdBy: 'Test',
      //  type: 'Red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('type');
        done(err);
      });
  });

  it('Returns that request is incomplete, no dateOfIncident', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      //  dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('date');
        done(err);
      });
  });

  it('Returns that request is incomplete, no title', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      //  title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('title');
        done(err);
      });
  });

  it('Returns that request is incomplete, no comment', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      //  comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('comment');
        done(err);
      });
  });

  it('Returns that request is incomplete, no images', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      //  images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('image');
        done(err);
      });
  });

  it('Returns that request is incomplete, no videos', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      //  videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('video');
        done(err);
      });
  });

  it('Returns that request is incomplete, no location', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      // location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('location');
        done(err);
      });
  });

  it('Return that only admin can modify status', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'red-flag',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575',
      status: 'draft',
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('admin');
        done(err);
      });
  });
});

// Test get all red-flag records
describe('GET /api/v1/records/red-flags', () => {
  it('Gets all red-flag record', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('loot');
        expect(res.body.data[0].comment).to.have.string('where is');
        expect(res.body.data[0].type).to.have.string('red-flag');
        done(err);
      });
  });
});

// Test get specific red-flag records
describe('GET /api/v1/records/red-flags/<id>', () => {
  it('Gets specific red-flag record', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags/1')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('loot');
        expect(res.body.data[0].comment).to.have.string('where is');
        expect(res.body.data[0].type).to.have.string('red-flag');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags/2')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});

//  Test patch a red-flag record location
describe('PATCH /api/v1/records/red-flags/:id/location', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/xyz/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/5/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new location is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/1/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('location', 'No new location supplied');
        done(err);
      });
  });


  it('Successfully update red-flag record location', (done) => {
    const newLocation = {
      location: 'long -14131, lat 6575',
    };

    chai.request(app)
      .patch('/api/v1/records/red-flags/1/location')
      .set('x-access-token', userToken)
      .send(newLocation)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Test patch a red-flag record comments
describe('PATCH /api/v1/records/red-flags/:id/comment', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/xyz/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/5/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new comment is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/1/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('comment', 'No new comment supplied');
        done(err);
      });
  });

  it('Successfully update red-flag record comment', (done) => {
    const newComment = {
      comment: 'Make Nigeria great',
    };

    chai.request(app)
      .patch('/api/v1/records/red-flags/1/comment')
      .set('x-access-token', userToken)
      .send(newComment)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Patch a red-flag record status
describe('PATCH /api/v1/records/red-flags/:id/status', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/xyz/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/5/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new status is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/1/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('status', 'No new status supplied');
        done(err);
      });
  });

  it('Successfully update red-flag record status', (done) => {
    const newComment = {
      status: 'under-investigation',
    };

    chai.request(app)
      .patch('/api/v1/records/red-flags/1/status')
      .set('x-access-token', userToken)
      .send(newComment)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Test delete a red-flag record
describe('DELETE/api/v1/records/red-flags/:id', () => {
  it('Return red-flag record successfully deleted', (done) => {
    chai.request(app)
      .delete('/api/v1/records/red-flags/1')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.a('Number');
        expect(res.body).to.be.a('Object');
        expect(res.body.data[0].message).to.have.string('deleted');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .delete('/api/v1/records/red-flags/5')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});


/*
Intervention record tests start hereb

*/


// Test create a new intervention record
describe('POST /api/v1/records/interventions', () => {
  it('Successfully post an intervention record', (done) => {
    const record = {
      createdBy: 'Tester',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };

    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Created');
        expect(res.body.data[0].new_record.title).to.have.string('Abacha');
        expect(res.body.data[0].new_record.comment).to.have.string('where');
        expect(res.body.data[0].new_record.images).to.have.string('image-location.cm');
        done(err);
      });
  });

  it('Return server error', (done) => {
    const record = {
      date: 'non-date-entry',
      createdBy: 'Tester',
      type: 'intervention',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };

    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done(err);
      });
  });

  it('Returns that request is incomplete, no createdBy', (done) => {
    const record = {
      //  createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('createdBy');
        done(err);
      });
  });

  it('Returns that request is incomplete, no type', (done) => {
    const record = {
      createdBy: 'Test',
      //  type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('type');
        done(err);
      });
  });

  it('Returns that request is incomplete, no dateOfIncident', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      //  dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('date');
        done(err);
      });
  });

  it('Returns that request is incomplete, no title', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      //  title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('title');
        done(err);
      });
  });

  it('Returns that request is incomplete, no comment', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      //  comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('comment');
        done(err);
      });
  });

  it('Returns that request is incomplete, no images', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      //  images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('image');
        done(err);
      });
  });

  it('Returns that request is incomplete, no videos', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      //  videos: 'www.location.com',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('video');
        done(err);
      });
  });

  it('Returns that request is incomplete, no location', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      // location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('location');
        done(err);
      });
  });

  it('Return that only admin can modify status', (done) => {
    const record = {
      createdBy: 'Test',
      type: 'intervention',
      dateOfIncident: '24 April 2020',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'www.image.com',
      videos: 'www.location.com',
      location: 'long -14131, lat 6575',
      status: 'draft',
    };


    chai.request(app)
      .post('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('admin');
        done(err);
      });
  });
});

// Test get all intervention records
describe('GET /api/v1/records/interventions', () => {
  it('Gets all intervention record', (done) => {
    chai.request(app)
      .get('/api/v1/records/interventions')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('loot');
        expect(res.body.data[0].comment).to.have.string('where is');
        expect(res.body.data[0].type).to.have.string('intervention');
        done(err);
      });
  });
});

// Test get specific intervention records
describe('GET /api/v1/records/interventions/<id>', () => {
  it('Gets specific intervention record', (done) => {
    chai.request(app)
      .get('/api/v1/records/interventions/2')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('loot');
        expect(res.body.data[0].comment).to.have.string('where is');
        expect(res.body.data[0].type).to.have.string('intervention');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .get('/api/v1/records/interventions/5')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});

//  Test patch a intervention record location
describe('PATCH /api/v1/records/interventions/:id/location', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/xyz/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/5/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new location is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/2/location')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('location', 'No new location supplied');
        done(err);
      });
  });

  it('Successfully update intervention record location', (done) => {
    const newLocation = {
      location: 'long -14131, lat 6575',
    };

    chai.request(app)
      .patch('/api/v1/records/interventions/2/location')
      .set('x-access-token', userToken)
      .send(newLocation)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Test patch a intervention record comments
describe('PATCH /api/v1/records/interventions/:id/comment', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/xyz/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/5/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new comment is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/2/comment')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('comment', 'No new comment supplied');
        done(err);
      });
  });

  it('Successfully update intervention record comment', (done) => {
    const newComment = {
      comment: 'Make Nigeria great',
    };

    chai.request(app)
      .patch('/api/v1/records/interventions/2/comment')
      .set('x-access-token', userToken)
      .send(newComment)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Patch a intervention record status
describe('PATCH /api/v1/records/interventions/:id/status', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/xyz/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('numeric');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/5/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new status is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/interventions/2/status')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body.error).to.have.string('Status', 'No new status supplied');
        done(err);
      });
  });

  it('Successfully update intervention record status', (done) => {
    const newComment = {
      status: 'under-investigation',
    };

    chai.request(app)
      .patch('/api/v1/records/interventions/2/status')
      .set('x-access-token', userToken)
      .send(newComment)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });
});

//  Test delete a intervention record
describe('DELETE/api/v1/records/interventions/:id', () => {
  it('Return intervention record successfully deleted', (done) => {
    chai.request(app)
      .delete('/api/v1/records/interventions/2')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.a('Number');
        expect(res.body).to.be.a('Object');
        expect(res.body.data[0].message).to.have.string('deleted');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .delete('/api/v1/records/interventions/5')
      .set('x-access-token', userToken)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});
