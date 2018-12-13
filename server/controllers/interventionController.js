import express from 'express';
import bodyParser from 'body-parser';
import transporter from 'nodemailer';
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

// // Get all intervention records
async function getAllInterventionRecords(req, res) {
  const text = `SELECT * FROM incidents WHERE type = 'intervention' AND owner_id =$1`;

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

// // Create new intervention record
async function postSingleInterventionRecord(req, res) {
  const values = [
    // ID is auto generated sequence by db
    req.user.id,
    req.user.id,
    'intervention',
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
          message: 'Created incident record',
          new_record: rows[0],
        }],
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

// // Get a single intervention record
async function getSingleInterventionRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `SELECT * FROM incidents WHERE type = 'intervention' AND id = $1 AND owner_id = $2 `;
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

// // Patch an intervention record location
async function patchInterventionRecordLocation(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedLocation = req.body.location;
  const updateInterventionRecord = `UPDATE incidents SET location=$2 WHERE id=$1 AND type = 'intervention' AND owner_id = $3 returning *`;
  const values = [
    requestId,
    updatedLocation,
    req.user.id,
  ];
  try {
    const response = await db.query(updateInterventionRecord, values);
    return res.status(205)
      .send({
        status: 205,
        data: [{
          id: response.rows[0].id,
          message: 'Updated intervention record’s location',
        }],
      });
  } catch (err) {
    return res.status(500).send(err);
  }
}

// // Patch an intervention record comment
async function patchInterventionRecordComment(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedComment = req.body.comment;
  const updateInterventionRecord =`UPDATE incidents SET comment=$2 WHERE id=$1 AND type = 'intervention' AND owner_id = $3 returning *`;
  const values = [
    requestId,
    updatedComment,
    req.user.id,
  ];
  try {
    const response = await db.query(updateInterventionRecord, values);
    return res.status(205)
      .send({
        status: 205,
        data: [{
          id: response.rows[0].id,
          message: 'Updated intervention record’s comment',
        }],
      });
  } catch (err) {
    return res.status(500).send(err);
  }
}

// // Admin patch an intervention record status
async function patchInterventionRecordStatus(req, res) {
  const requestId = parseInt(req.params.id, 10);
  const updatedStatus = req.body.status;
  const updateInterventionRecord = `UPDATE incidents SET status=$2 WHERE id=$1 AND type = 'intervention' returning *`;
  const values = [
    requestId,
    updatedStatus,
  ];
  try {
    const response = await db.query(updateInterventionRecord, values);

    // const mailOptions = {
    //   from: 'andelatester@gmail.com',
    //   to: 'ayinlaolajide@gmail.com',
    //   subject: 'iReporter: Admin has updated your status', // Subject line
    //   html: 'Hooray! The admin at iReporter has updated the status of your record',
    // };
    //
    // transporter.sendMail(mailOptions);

    return res.status(200)
      .send({
        status: 200,
        data: [{
          id: response.rows[0].id,
          message: 'Updated intervention record’s status',
        }],
      });
  } catch (err) {
    return res.status(500).send(err);
  }
}

// // Delete a single intervention record
async function deleteInterventionRecord(req, res) {
  const queryId = parseInt(req.params.id, 10);
  const text = `DELETE FROM incidents WHERE type = 'intervention' AND id = $1 AND owner_id = $2 returning * `;
  try {
    const { rows } = await db.query(text, [queryId, req.user.id]);
    return res.status(200)
      .send({
        status: 204,
        data: [{
          id: rows[0].id,
          message: 'Intervention record has been deleted',
        }],
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}


export {
  postSingleInterventionRecord,
  getAllInterventionRecords,
  getSingleInterventionRecord,
  patchInterventionRecordLocation,
  patchInterventionRecordComment,
  patchInterventionRecordStatus,
  deleteInterventionRecord,
};
