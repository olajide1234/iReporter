
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js');

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

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


// Test get all red-flag records
describe('GET /api/v1/records/red-flags', () => {
  it('Gets all red-flag record', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('police');
        expect(res.body.data[0].comment).to.have.string('Unilag');
        expect(res.body.data[0].type).to.have.string('Red-flag');
        done(err);
      });
  });
});

// Test get specific red-flag records
describe('GET /api/v1/records/red-flags/<id>', () => {
  it('Gets specific red-flag record', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags/1')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.be.a('Object');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0].title).to.have.string('police');
        expect(res.body.data[0].comment).to.have.string('Unilag');
        expect(res.body.data[0].type).to.have.string('Red-flag');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .get('/api/v1/records/red-flags/2')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});

// Test create a new red-flag record
describe('POST /api/v1/records/red-flags', () => {
  // it('Successfully post a red-flag record', (done) => {
  //   const record = {
  //     createdBy: 'Test',
  //     type: 'Red-flag',
  //     dateOfIncident: '24 April 2017',
  //     title: 'Abacha loot',
  //     comment: 'where is Abacha loot?',
  //     images: 'image-location.cm',
  //     videos: 'video-location,cm',
  //     location: 'long -14131, lat 6575', // Lat Long coordinates
  //   };
  //
  //
  //   chai.request(app)
  //     .post('/api/v1/records/red-flags')
  //     .send(record)
  //     .end((err, res) => {
  //       expect(res.body.status).to.be.equal(201);
  //       expect(res.body.data).to.be.a('Array');
  //       expect(res.body.data[0].id).to.be.a('Number');
  //       expect(res.body.data[0].message).to.have.string('Created');
  //       expect(res.body.data[0].new_record.title).to.have.string('Abacha');
  //       expect(res.body.data[0].new_record.comment).to.have.string('where');
  //       expect(res.body.data[0].new_record.images).to.have.string('image-location.cm');
  //       done(err);
  //     });
  // });

  it('Returns that request is incomplete, no createdBy', (done) => {
    const record = {
      //  createdBy: 'Test',
      type: 'Red-flag',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      //  dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      //  title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      //  comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      //  images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      //  videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      // location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
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
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575',
      status: 'draft',
    };


    chai.request(app)
      .post('/api/v1/records/red-flags')
      .send(record)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('admin');
        done(err);
      });
  });
});

//  Test patch a red-flag record location
describe('PATCH /api/v1/records/red-flags/:id/location', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/xyz/location')
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
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new location is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/1/location')
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
      .send(newLocation)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('updated');
        done(err);
      });
  });
});

//  Test patch a red-flag record comments
describe('PATCH /api/v1/records/red-flags/:id/comment', () => {
  it('Return a Bad request response, include numeric ID in param', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/xyz/comment')
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
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });

  it('Returns that new comment is not supplied', (done) => {
    chai.request(app)
      .patch('/api/v1/records/red-flags/1/comment')
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
      .send(newComment)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(205);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('updated');
        done(err);
      });
  });
});

// Test put a new red-flag record
describe('PUT /api/v1/records/red-flags', () => {
  it('Successfully update a red-flag record', (done) => {
    const recordToPut = {
      createdBy: 'Updated Test',
      type: 'Red-flag',
      dateOfIncident: 'Updated 24 April 2017',
      title: 'Updated Abacha loot',
      comment: 'Updated where is Abacha loot?',
      images: 'Updated image-location.cm',
      videos: 'Updated video-location,cm',
      location: 'Updated long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Updated');
        done(err);
      });
  });

  it('Successfully create a red-flag record', (done) => {
    const recordToPut = {
      createdBy: 'Updated Test',
      type: 'Red-flag',
      dateOfIncident: 'Updated 24 April 2017',
      title: 'Updated Abacha loot',
      comment: 'Updated where is Abacha loot and Abiola ?',
      images: 'Updated image-location.cm',
      videos: 'Updated video-location,cm',
      location: 'Updated long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/4')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body.data).to.be.a('Array');
        expect(res.body.data[0].id).to.be.a('Number');
        expect(res.body.data[0].message).to.have.string('Created');
        expect(res.body.data[0].new_record.comment).to.have.string('Abiola');
        expect(res.body.data[0].new_record.images).to.have.string('Updated image-location.cm');
        done(err);
      });
  });

  it('Returns that request is incomplete, no createdBy', (done) => {
    const recordToPut = {
      //  createdBy: 'Test',
      type: 'Red-flag',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('createdBy');
        done(err);
      });
  });

  it('Returns that request is incomplete, no type', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      //  type: 'Red-flag',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('type');
        done(err);
      });
  });

  it('Returns that request is incomplete, no dateOfIncident', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      //  dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('dateOfIncident');
        done(err);
      });
  });

  it('Returns that request is incomplete, no title', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      //  title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('title');
        done(err);
      });
  });

  it('Returns that request is incomplete, no comment', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      //  comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('comment');
        done(err);
      });
  });

  it('Returns that request is incomplete, no images', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      //  images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('image');
        done(err);
      });
  });

  it('Returns that request is incomplete, no videos', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      //  videos: 'video-location,cm',
      location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('videos');
        done(err);
      });
  });

  it('Returns that request is incomplete, no location', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      // location: 'long -14131, lat 6575', // Lat Long coordinates
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(400);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('location');
        done(err);
      });
  });

  it('Return that only admin can modify status', (done) => {
    const recordToPut = {
      createdBy: 'Test',
      dateOfIncident: '24 April 2017',
      title: 'Abacha loot',
      comment: 'where is Abacha loot?',
      images: 'image-location.cm',
      videos: 'video-location,cm',
      location: 'long -14131, lat 6575',
      status: 'draft',
    };


    chai.request(app)
      .put('/api/v1/records/red-flags/1')
      .send(recordToPut)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(403);
        expect(res.body).to.be.a('Object');
        expect(res.body.error).to.have.string('admins');
        done(err);
      });
  });
});

//  Test delete a red-flag record comments
describe('DELETE/api/v1/records/red-flags/:id', () => {
  it('Return red-flag record successfully deleted', (done) => {
    chai.request(app)
      .delete('/api/v1/records/red-flags/1')
      .end((err, res) => {
        expect(res.body.status).to.be.a('Number');
        expect(res.body).to.be.a('Object');
        expect(res.body.message).to.have.string('deleted');
        done(err);
      });
  });

  it('Returns a Not found response', (done) => {
    chai.request(app)
      .delete('/api/v1/records/red-flags/5')
      .end((err, res) => {
        expect(res.body.status).to.be.equal(404);
        expect(res.body.error).to.have.string('not found', 'Does not contain Not found in response');
        done(err);
      });
  });
});
