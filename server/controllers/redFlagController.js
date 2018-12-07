import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement'; // eslint-disable-line no-unused-vars
import redFlagRecords from '../models/incidents';

const router = express.Router();
/**
 * @file This is the primary contoller file for
 * calls to the API
 * @param {object} req
 * @param {object} res
 * @param {func} next
 */

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Global constants
const newID = ([...redFlagRecords.keys()].length + 1) || 1;

// // Get all Red-flag records
exports.getAllRedFlagRecords = (req, res) => {
  const allRedFlagRecords = [...redFlagRecords.values()];
  res.status(200).send({
    status: 200,
    data: allRedFlagRecords,
  });
};

// // Create new Red-flag record
exports.postSingleRedFlagRecord = (req, res) => {
  const record = {
    id: newID,
    createdOn: Date(),
    createdBy: req.body.createdBy, // represents the user who created this record
    type: req.body.type, // [red-flag, intervention]
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
      message: 'Created red-flag record',
      new_record: record,
    }],
  });
};

// // Get a single Red-flag record
exports.getSingleRedFlagRecord = (req, res) => {
  const id = parseInt(req.params.id, 10);
  return res.status(200).send({
    status: 200,
    data: [redFlagRecords.get(id)],
  });
};

// // Patch a red-flag record location
exports.patchRedFlagRecordLocation = (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;

  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: redFlagRecords.get(requestId).createdOn,
    createdBy: redFlagRecords.get(requestId).createdBy,
    type: req.body.type, // [red-flag, intervention]
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
      message: 'Successfully updated red-flag record\'s location',
    }],
  });
};

// //  Patch a red-flag record comment
exports.patchRedFlagRecordComment = (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment;

  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: redFlagRecords.get(requestId).createdOn,
    createdBy: redFlagRecords.get(requestId).createdBy,
    type: req.body.type, // [red-flag, intervention]
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
      message: 'Successfully updated red-flag record\'s comment',
    }],
  });
};

// //  Delete a record
exports.deleteRedFlagRecord = (req, res) => {
  const id = parseInt(req.params.id, 10);
  redFlagRecords.set(id, null);
  return res.status(200).send({
    status: 200,
    message: 'Red-flag record has been successfully deleted',
  });
};

// //  Update a record
exports.putRedFlagRecord = (req, res) => {
  const requestId = parseInt(req.params.id, 10);
  const recordFound = ([...redFlagRecords.keys()].includes(requestId)
  && redFlagRecords.get(requestId) !== null);

  // Create new record if all parameters above are supplied and record not found
  if (!recordFound) {
    const newRecord = {
      id: newID,
      createdOn: Date(),
      createdBy: req.body.createdBy, // represents the user who created this record
      type: req.body.type, // [red-flag, intervention]
      dateOfIncident: req.body.dateOfIncident,
      title: req.body.title,
      comment: req.body.comment,
      images: req.body.images,
      videos: req.body.videos,
      location: req.body.location, // Lat Long coordinates
      status: 'draft', // [draft, under investigation, resolved, rejected]
    };
    redFlagRecords.set(newID, newRecord);
    return res.status(201).send({
      status: 201,
      data: [{
        id: newID,
        message: 'Created red-flag record',
        new_record: newRecord,
      }],
    });
  }

  //  Or update record with details
  //  Update record with details
  const updatedRecord = {
    id: requestId,
    createdOn: Date(),
    createdBy: req.body.createdBy, // represents the user who created this record
    type: req.body.type, // [red-flag, intervention]
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
};
