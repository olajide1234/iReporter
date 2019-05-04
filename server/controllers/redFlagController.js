import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement'; // eslint-disable-line no-unused-vars
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
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getRfDrStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='red-flag' AND owner_id = $1 AND status = 'draft'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getRfRsStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='red-flag' AND owner_id = $1 AND status = 'resolved'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getRfIvStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='red-flag' AND owner_id = $1 AND status = 'under-investigation'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getRfRjStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='red-flag' AND owner_id = $1 AND status = 'rejected'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}


async function getInDrStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='intervention' AND owner_id = $1 AND status = 'draft'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getInRsStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='intervention' AND owner_id = $1 AND status = 'resolved'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getInIvStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='intervention' AND owner_id = $1 AND status = 'under-investigation'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getInRjStats(req, res) {
  const text = `SELECT COUNT (id) FROM incidents WHERE type='intervention' AND owner_id = $1 AND status = 'rejected'`;

  try {
    const { rows } = await db.query(text, [req.user.id]);
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
    req.body.date,
    req.user.id,
    req.body.createdBy.trim(),
    req.body.type,
    req.body.dateOfIncident,
    req.body.title.trim(),
    req.body.comment.trim(),
    req.body.images,
    req.body.videos,
    req.body.location,
    'draft',
  ];

  const text = `INSERT INTO
     incidents(createdOn, owner_id, createdBy, type, dateOfIncident, title, comment, images, videos, location, status)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
  const text = `SELECT * FROM incidents WHERE type = 'red-flag' AND id = $1 AND owner_id = $2`;
  try {
    const { rows } = await db.query(text, [queryId, req.user.id]);
    return res.status(200)
      .send({
        status: 200,
        data: rows,
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

async function getSingleRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `SELECT * FROM incidents WHERE id = $1`;
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

async function getAllRecords(req, res) {
  const text = `SELECT * FROM incidents`;
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

// // Patch an red-flag record location
async function patchRecordLocation(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;
  const updateRedFlagRecord = `UPDATE incidents SET location=$2 WHERE id=$1 AND owner_id = $3 returning *`;
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
          message: 'Updated record’s location',
        }],
      });
  } catch (err) {
    return res.status(400).send(err);
  }
}

// // Patch a red-flag record comment
async function patchRecordComment(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment.trim();
  const updateRedFlagRecord = `UPDATE incidents SET comment=$2 WHERE id=$1 AND owner_id = $3 returning *`;
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
          message: 'Updated record’s comment',
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
  const updateRedFlagRecord = `UPDATE incidents SET status=$2 WHERE id=$1 AND type = 'red-flag' AND owner_id = $3 returning *`;
  const values = [
    requestId,
    updatedStatus,
    req.user.id,
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
async function deleteRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `DELETE FROM incidents WHERE id = $1 AND owner_id = $2 returning * `;
  try {
    const { rows } = await db.query(text, [queryId, req.user.id]);
    return res.status(200)
      .send({
        status: 204,
        data: [{
          id: rows[0].id,
          message: 'Record has been deleted',
        }],
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export {
  getAllRedFlagRecords,
  getRfDrStats,
  getRfRsStats,
  getRfIvStats,
  getRfRjStats,
  getInDrStats,
  getInIvStats,
  getInRjStats,
  getInRsStats,
  getAllRecords,
  getSingleRecord,
  postSingleRedFlagRecord,
  getSingleRedFlagRecord,
  patchRecordLocation,
  patchRecordComment,
  deleteRecord,
  patchRedFlagRecordStatus,
};
