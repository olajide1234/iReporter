import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement';

// Data model
const redFlagRecords = new Map([
  [1, {
    id: 1,
    createdOn: 'Sample date',
    createdBy: 'Sample Creator', // represents the user who created this record
    type: 'Sample record type', // [red-flag, intervention]
    dateOfIncident: 'Sample date',
    title: 'Sample title',
    comment: 'Sample comment',
    Images: ['Sample Image'],
    Videos: ['Sample Video'],
    location: 'Sample record location', // Lat Long coordinates
    status: 'Sample status', // [draft, under investigation, resolved, rejected]
  }],
]);

const userList = new Map([
  ['admin', {
    id: 'Integer',
    firstname: 'String',
    lastname: 'String',
    othernames: 'String',
    email: 'String',
    phoneNumber: 'String',
    username: 'admin',
    registered: 'Date',
    isAdmin: true,
    password: 'encoded password',
  }],
]);

// Set up the express app
const app = express();

//  Setup bodyParser
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get all red-flag records
app.get('/api/v1/red-flags', (req, res) => {
  const allRedFlagRecords = [...redFlagRecords.values()];
  res.status(200).send({
    status: 200,
    data: allRedFlagRecords,
  });
});

//  Get a single red-flag record
app.get('/api/v1/red-flags/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if ([...redFlagRecords.keys()].includes(id) && redFlagRecords.get(id) !== null) {
    return res.status(200).send({
      status: 200,
      data: [redFlagRecords.get(id)],
    });
  }
  return res.status(404).send({
    status: 404,
    error: 'Not found: Record not found',
  });
});

// Create new red-flag record
app.post('/api/v1/red-flags', (req, res) => {
  // Check request body for completeness
  if (!req.body.createdBy) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include creator\'s username or null as createdBy in body of request',
    });
  }
  if (!req.body.dateOfIncident) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include date of incident or null as dateOfIncident in body of request',
    });
  }
  if (!req.body.title) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include short title or null as title in body of request',
    });
  }
  if (!req.body.comment) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include narration of incident or null as comment in body of request',
    });
  }
  if (!req.body.images) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify image locations or null as images in body of request',
    });
  }
  if (!req.body.videos) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify video locations or null as videos in body of request',
    });
  }
  if (!req.body.location) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify location of incident or null as location in body of request',
    });
  }
  if (req.body.status) {
    if (req.body.createdBy !== 'admin') {
      return res.status(403).send({
        status: 403,
        error: 'Forbidden: Only admins can modify record status',
      });
    }
  }

  const newID = ([...redFlagRecords.keys()].length + 1) || 1;
  const record = {
    id: newID,
    createdOn: Date(),
    createdBy: req.body.createdBy, // represents the user who created this record
    type: 'red-flag', // [red-flag, intervention]
    dateOfIncident: req.body.dateOfIncident,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images,
    videos: req.body.videos,
    location: req.body.location, // Lat Long coordinates
    status: 'draft', // [draft, under investigation, resolved, rejected]
  };
  redFlagRecords.set(newID, record);
  return res.status(201).send({
    status: 201,
    data: [{
      id: newID,
      message: 'Created: Created red-flag record',
    }],
  });
});

//  Patch a red-flag record location
app.patch('/api/v1/red-flags/:id/location', (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;
  const recordFound = ([...redFlagRecords.keys()].includes(requestId)
  && redFlagRecords.get(requestId) !== null);

  //  Check that a valid record id is supplied
  if (Number.isNaN(requestId)) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include numeric ID of record in parameter',
    });
  }

  //  Confirm if record exists
  if (!recordFound) {
    return res.status(404).send({
      status: 404,
      error: 'Not found: Record not found',
    });
  }

  //  Confirm if new location record is supplied
  if (!req.body.location) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include new location or null as location in body of request',
    });
  }

  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: redFlagRecords.get(requestId).createdOn,
    createdBy: redFlagRecords.get(requestId).createdBy,
    type: 'red-flag', // [red-flag, intervention]
    dateOfIncident: redFlagRecords.get(requestId).dateOfIncident,
    title: redFlagRecords.get(requestId).title,
    comment: redFlagRecords.get(requestId).comment,
    images: redFlagRecords.get(requestId).images,
    videos: redFlagRecords.get(requestId).videos,
    location: updatedLocation, // Lat Long coordinates
    status: redFlagRecords.get(requestId).status,
  };

  redFlagRecords.set(requestId, updatedRecord);
  return res.status(200).send({
    status: 200,
    data: [{
      id: requestId,
      message: 'Updated red-flag record\'s location',
    }],
  });
});

//  Patch a red-flag record comment
app.patch('/api/v1/red-flags/:id/comment', (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment;
  const recordFound = ([...redFlagRecords.keys()].includes(requestId)
  && redFlagRecords.get(requestId) !== null);

  //  Check that a valid record id is supplied
  if (Number.isNaN(requestId)) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include numeric ID of record in parameter',
    });
  }

  //  Confirm if record exists
  if (!recordFound) {
    return res.status(404).send({
      status: 404,
      error: 'Not found: Record not found',
    });
  }

  //  Confirm if new comment is supplied
  if (!req.body.comment) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include new comment or null as comment in body of request',
    });
  }

  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: redFlagRecords.get(requestId).createdOn,
    createdBy: redFlagRecords.get(requestId).createdBy,
    type: 'red-flag', // [red-flag, intervention]
    dateOfIncident: redFlagRecords.get(requestId).dateOfIncident,
    title: redFlagRecords.get(requestId).title,
    comment: updatedComment,
    images: redFlagRecords.get(requestId).images,
    videos: redFlagRecords.get(requestId).videos,
    location: redFlagRecords.get(requestId).location,
    status: redFlagRecords.get(requestId).status,
  };

  redFlagRecords.set(requestId, updatedRecord);
  return res.status(200).send({
    status: 200,
    data: [{
      id: requestId,
      message: 'Updated red-flag record\'s comment',
    }],
  });
});

//  Delete a record
app.delete('/api/v1/red-flags/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if ([...redFlagRecords.keys()].includes(id) && redFlagRecords.get(id) !== null) {
    redFlagRecords.set(id, null);
    return res.status(200).send({
      status: id,
      message: 'No content: Red-flag record has been deleted',
    });
  }
  return res.status(404).send({
    status: 404,
    error: 'Not found: Red-flag record not found',
  });
});

//   Update a record
app.put('/api/v1/red-flags/:id', (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const recordFound = ([...redFlagRecords.keys()].includes(requestId)
  && redFlagRecords.get(requestId) !== null);

  //  Require all for a put request, different for patch
  // Check request body for completeness
  if (Number.isNaN(parseInt(req.params.id, 10))) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include numeric ID of record in parameter',
    });
  }

  if (!req.body.createdBy) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include creator\'s username or null as createdBy in body of request',
    });
  }
  if (!req.body.dateOfIncident) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include date of incident or null as dateOfIncident in body of request',
    });
  }
  if (!req.body.title) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include short title or null as title in body of request',
    });
  }
  if (!req.body.comment) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include narration of incident or null as comment in body of request',
    });
  }
  if (!req.body.images) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify image locations or null as image in body of request',
    });
  }
  if (!req.body.videos) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify video locations or null as videos in body of request',
    });
  }
  if (!req.body.location) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Specify location of incident or null as location in body of request',
    });
  }
  if (req.body.status) {
    if (req.body.createdBy !== 'admin') {
      return res.status(403).send({
        status: 403,
        error: 'Forbidden: Only admins can modify record status',
      });
    }
  }

  // Create new record if all parameters above are supplied and record not found
  if (!recordFound) {
    const newID = ([...redFlagRecords.keys()].length + 1) || 1;
    const record = {
      id: newID,
      createdOn: Date(),
      createdBy: req.body.createdBy, // represents the user who created this record
      type: 'red-flag', // [red-flag, intervention]
      dateOfIncident: req.body.dateOfIncident,
      title: req.body.title,
      comment: req.body.comment,
      images: req.body.images,
      videos: req.body.videos,
      location: req.body.location, // Lat Long coordinates
      status: 'draft', // [draft, under investigation, resolved, rejected]
    };
    redFlagRecords.set(newID, record);
    return res.status(201).send({
      status: 201,
      data: [{
        id: newID,
        message: 'Created: Created red-flag record',
      }],
    });
  }

  //  Or update record with details
  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: Date(),
    createdBy: req.body.createdBy, // represents the user who created this record
    type: 'red-flag', // [red-flag, intervention]
    dateOfIncident: req.body.dateOfIncident,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images,
    videos: req.body.videos,
    location: req.body.location, // Lat Long coordinates
    status: 'draft', // [draft, under investigation, resolved, rejected]
  };

  redFlagRecords.set(requestId, updatedRecord);
  return res.status(200).send({
    status: 200,
    data: [{
      id: requestId,
      message: 'Updated red-flag record successfully',
    }],
  });
});

// Set up port
const PORT = process.env.PORT || 2000;

//  Diabled so as not to conflict mocha --watch.
//  Solution ref: http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if (!module.parent) {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export our app for testing purposes
module.exports = app.listen(PORT);
