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

async function getAllRedFlagRecords(req, res) {
  const text = `SELECT * FROM incidents WHERE type = 'red-flag'`;

  try {
    const { rows } = await db.query(text);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

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
async function getSingleRedFlagRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `SELECT * FROM incidents WHERE type = 'red-flag' AND id = $1 `;
  try {
    const { rows } = await db.query(text, [queryId]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

// // Patch an red-flag record location
async function patchRedFlagRecordLocation(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;
  const updateRedFlagRecord = `UPDATE incidents SET location=$2 WHERE id=$1 AND type = 'red-flag' returning *`;
  const values = [
    requestId,
    updatedLocation,
  ];
  try {
    const response = await db.query(updateRedFlagRecord, values);
    return res.status(205)
      .send({
        status: 205,
        data: [{
          id: response.rows[0].id,
          message: 'Updated red-flag record’s location',
        }],
      });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// // Patch a red-flag record comment
async function patchRedFlagRecordComment(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment;
  const updateRedFlagRecord =`UPDATE incidents SET comment=$2 WHERE id=$1 AND type = 'red-flag' returning *`;
  const values = [
    requestId,
    updatedComment,
  ];
  try {
    const response = await db.query(updateRedFlagRecord, values);
    return res.status(200)
      .send({
        status: 200,
        data: [{
          id: response.rows[0].id,
          message: 'Updated red-flag record’s comment',
        }],
      });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// // Admin patch a red-flag record status
async function patchRedFlagRecordStatus(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedStatus = req.body.status;
  const updateRedFlagRecord = `UPDATE incidents SET status=$2 WHERE id=$1 AND type = 'red-flag' returning *`;
  const values = [
    requestId,
    updatedStatus,
  ];
  try {
    const response = await db.query(updateRedFlagRecord, values);
    return res.status(200)
      .send({
        status: 200,
        data: [{
          id: response.rows[0].id,
          message: 'Updated red-flag record’s status',
        }],
      });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// // Delete a single red-flag record
async function deleteRedFlagRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `DELETE FROM incidents WHERE type = 'red-flag' AND id = $1 returning * `;
  try {
    const { rows } = await db.query(text, [queryId]);
    return res.status(200)
      .send({
        status: 204,
        data: [{
          id: rows[0].id,
          message: 'Red-flag record has been deleted',
        }],
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

// // //  Update a record
// const putRedFlagRecord = (req, res) => {
//   const requestId = parseInt(req.params.id, 10);
//   const recordFound = ([...redFlagRecords.keys()].includes(requestId)
//   && redFlagRecords.get(requestId) !== null);
//
//   // Create new record if all parameters above are supplied and record not found
//   if (!recordFound) {
//     const newRecord = {
//       id: newID,
//       createdOn: Date(),
//       createdBy: req.body.createdBy, // represents the user who created this record
//       type: req.body.type, // [red-flag, intervention]
//       dateOfIncident: req.body.dateOfIncident,
//       title: req.body.title,
//       comment: req.body.comment,
//       images: req.body.images,
//       videos: req.body.videos,
//       location: req.body.location, // Lat Long coordinates
//       status: 'draft', // [draft, under investigation, resolved, rejected]
//     };
//     redFlagRecords.set(newID, newRecord);
//     return res.status(201).send({
//       status: 201,
//       data: [{
//         id: newID,
//         message: 'Created red-flag record',
//         new_record: newRecord,
//       }],
//     });
//   }
//
//   //  Or update record with details
//   //  Update record with details
//   const updatedRecord = {
//     id: requestId,
//     createdOn: Date(),
//     createdBy: req.body.createdBy, // represents the user who created this record
//     type: req.body.type, // [red-flag, intervention]
//     dateOfIncident: req.body.dateOfIncident,
//     title: req.body.title,
//     comment: req.body.comment,
//     images: req.body.images,
//     videos: req.body.videos,
//     location: req.body.location, // Lat Long coordinates
//     status: 'draft', // [draft, under investigation, resolved, rejected]
//   };
//
//   redFlagRecords.set(requestId, updatedRecord);
//   return res.status(200).send({
//     status: 200,
//     data: [{
//       id: requestId,
//       message: 'Updated red-flag record successfully',
//     }],
//   });
// };

export {
  getAllRedFlagRecords,
  postSingleRedFlagRecord,
  getSingleRedFlagRecord,
  patchRedFlagRecordLocation,
  patchRedFlagRecordComment,
  deleteRedFlagRecord,
  patchRedFlagRecordStatus,
};
