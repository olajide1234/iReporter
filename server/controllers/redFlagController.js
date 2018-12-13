import express from 'express';
import bodyParser from 'body-parser';
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
// const newID = ([...redFlagRecords.keys()].length + 1) || 1;

// // Get all Red-flag records

async function getAllRedFlagRecords(req, res) {
  const text = `SELECT * FROM incidents WHERE type = 'red-flag' AND owner_id = $1`;

  try {
    const { rows } = await db.query(text, [req.user.id]);

    if (!rows.length) {
      return res.status(200)
        .send({
          status: 200,
          error: 'No records yet',
        });
    }

    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

// // Create new Red-flag record
async function postSingleRedFlagRecord(req, res) {
  const values = [
    // ID is auto generated sequence by db
    req.user.id,
    req.user.id,
    req.body.type,
    req.body.dateOfIncident,
    req.body.title,
    req.body.comment,
    req.body.images,
    req.body.videos,
    req.body.location,
    'pending',
  ];

  const text = `INSERT INTO
     incidents(owner_id, createdBy, type, dateOfIncident, title, comment, images, videos, location, status)
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
    return res.status(500).send(error);
  }
}

// // Get a single Red-flag record
async function getSingleRedFlagRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `SELECT * FROM incidents WHERE type = 'red-flag' AND id = $1 AND owner_id = $2`;
  try {
    const { rows } = await db.query(text, [queryId, req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

// // Patch an red-flag record location
async function patchRedFlagRecordLocation(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;
  const updateRedFlagRecord = `UPDATE incidents SET location=$2 WHERE id=$1 AND type = 'red-flag' AND owner_id = $3 returning *`;
  const values = [
    requestId,
    updatedLocation,
    req.user.id,
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
    return res.status(500).send(err);
  }
}

// // Patch a red-flag record comment
async function patchRedFlagRecordComment(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment;
  const updateRedFlagRecord =`UPDATE incidents SET comment=$2 WHERE id=$1 AND type = 'red-flag' AND owner_id = $3 returning *`;
  const values = [
    requestId,
    updatedComment,
    req.user.id,
  ];
  try {
    const response = await db.query(updateRedFlagRecord, values);
    return res.status(205)
      .send({
        status: 205,
        data: [{
          id: response.rows[0].id,
          message: 'Updated red-flag record’s comment',
        }],
      });
  } catch (err) {
    return res.status(500).send(err);
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
    return res.status(500).send(err);
  }
}

// // Delete a single red-flag record
async function deleteRedFlagRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `DELETE FROM incidents WHERE type = 'red-flag' AND id = $1 AND owner_id = $2 returning * `;
  try {
    const { rows } = await db.query(text, [queryId, req.user.id]);
    return res.status(200)
      .send({
        status: 204,
        data: [{
          id: rows[0].id,
          message: 'Red-flag record has been deleted',
        }],
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export {
  getAllRedFlagRecords,
  postSingleRedFlagRecord,
  getSingleRedFlagRecord,
  patchRedFlagRecordLocation,
  patchRedFlagRecordComment,
  deleteRedFlagRecord,
  patchRedFlagRecordStatus,
};
