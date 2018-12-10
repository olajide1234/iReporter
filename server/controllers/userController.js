import express from 'express';
import bodyParser from 'body-parser';
import db from '../database/main';
import * as helpers from './helpers';

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

// Create new user - sign up
async function signUp(req, res) {
  const hashPassword = helpers.generateHashPassword(req.body.password);

  const values = [
    // ID is auto-generated sequence by DB
    req.body.firstname,
    req.body.lastname,
    req.body.othernames,
    req.body.email,
    req.body.phoneNumber,
    req.body.username,
    req.body.date,
    req.body.isAdmin,
    hashPassword,
  ];

  const text = `INSERT INTO
     users(firstname, lastname, othernames, email, phoneNumber, username, registered, isAdmin, password)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning *`;

  try {
    const { rows } = await db.query(text, values);
    const userToken = helpers.generateToken(rows[0].id);
    return res.status(201)
      .send({
        status: 201,
        data: [{
          token: userToken,
          user: rows[0],
        }],
      });
  } catch (err) {
    return res.status(500)
      .send({
        status: 500,
        error: err,
      });
  }
}

// // Returning user sign in
async function signIn(req, res) {
  const queryUsername = req.body.username;
  const text = `SELECT * FROM users WHERE username = $1`;

  try {
    const { rows } = await db.query(text, [queryUsername]);
    const userToken = helpers.generateToken(rows[0].id);
    return res.status(200)
      .send({
        status: 200,
        data: [{
          token: userToken,
          user: rows[0],
        }],
      });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export {
  signUp,
  signIn,
};
