import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement'; // eslint-disable-line no-unused-vars
import redFlagRecords from '../models/incidents';
import db from '../database/main';

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
const getAllRedFlagRecords = (req, res) => {
  const allRedFlagRecords = [...redFlagRecords.values()];
  res.status(200).send({
    status: 200,
    data: allRedFlagRecords,
  });
};

// // Create new Red-flag record
async function postSingleRedFlagRecord(req, res) {
  const values = [
    // ID is auto generated sequence by db
    Date(),
    req.body.createdBy,
    req.body.type,
    req.body.dateOfIncident,
    req.body.title,
    req.body.comment,
    req.body.images,
    req.body.videos,
    req.body.location,
    'draft',
  ];

  const text = `INSERT INTO
     incidents(createdOn, createdBy, type, dateOfIncident, title, comment, images, videos, location, status)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning *`;

  try {
    const { rows } = await db.query(text, values);
    return res.status(201)
      .send({
        status: 201,
        data: [{
          id: rows[0].id,
          message: 'Created red-flag record',
          new_record: rows[0],
        }],
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

// // Get a single Red-flag record
const getSingleRedFlagRecord = (req, res) => {
  const id = parseInt(req.params.id, 10);
  return res.status(200).send({
    status: 200,
    data: [redFlagRecords.get(id)],
  });
};

// // Patch a red-flag record location
const patchRedFlagRecordLocation = (req, res) => {
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
const patchRedFlagRecordComment = (req, res) => {
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
const deleteRedFlagRecord = (req, res) => {
  const id = parseInt(req.params.id, 10);
  redFlagRecords.set(id, null);
  return res.status(200).send({
    status: 200,
    message: 'Red-flag record has been successfully deleted',
  });
};

// //  Update a record
const putRedFlagRecord = (req, res) => {
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

export {
  getAllRedFlagRecords,
  postSingleRedFlagRecord,
  getSingleRedFlagRecord,
  patchRedFlagRecordLocation,
  patchRedFlagRecordComment,
  deleteRedFlagRecord,
  putRedFlagRecord,
};
