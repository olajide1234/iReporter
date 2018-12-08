import express from 'express';
import bodyParser from 'body-parser';
import db from '../database/main';

const router = express.Router();
/**
 * @file This is the primary contoller file for
 * user related activities
 * @param {object} req
 * @param {object} res
 * @param {func} next
 */

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// // Create new user - sign up
async function signUp(req, res) {
  const values = [
    1234,
    req.body.firstname,
    req.body.lastname,
    req.body.othernames,
    req.body.email,
    req.body.phoneNumber,
    req.body.username,
    req.body.date,
    req.body.isAdmin,
    'testpassword',
  ];

  const text = `INSERT INTO
     users(id, firstname, lastname, othernames, email, phoneNumber, username, registered, isAdmin, password)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning *`;

  try {
    const { rows } = await db.query(text, values);
    return res.status(201).send(rows[0]);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export {
  signUp,
};
