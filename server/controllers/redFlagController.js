import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const redFlagRecords = require('../models/incidents');

// Get all red-flag records
router.get('/', (req, res) => {
  const allRedFlagRecords = [...redFlagRecords.values()];
  res.status(200).send({
    status: 200,
    data: allRedFlagRecords,
  });
});

// Create new red-flag record
router.post('/', (req, res) => {
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

//  Get a single red-flag record
router.get('/:id', (req, res) => {
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

//  Patch a red-flag record location
router.patch('/:id/location', (req, res) => {
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
  return res.status(205).send({
    status: 205,
    data: [{
      id: requestId,
      message: 'Updated red-flag record\'s location',
    }],
  });
});

//  Patch a red-flag record comment
router.patch('/:id/comment', (req, res) => {
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
  return res.status(205).send({
    status: 205,
    data: [{
      id: requestId,
      message: 'Updated red-flag record\'s comment',
    }],
  });
});

//  Delete a record
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if ([...redFlagRecords.keys()].includes(id) && redFlagRecords.get(id) !== null) {
    redFlagRecords.set(id, null);
    return res.status(200).send({
      status: 200,
      message: 'No content: Red-flag record has been deleted',
    });
  }
  return res.status(404).send({
    status: 404,
    error: 'Not found: Red-flag record not found',
  });
});

//   Update a record
router.put('/:id', (req, res) => {
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


module.exports = router;
