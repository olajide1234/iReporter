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

// Create new user - sign up
async function signUp(req, res) {
  const values = [
    req.body.id,
    req.body.firstname,
    req.body.lastname,
    req.body.othernames,
    req.body.email,
    req.body.phoneNumber,
    req.body.username,
    req.body.date,
    req.body.isAdmin,
    req.body.password,
  ];

  const text = `INSERT INTO
     users(id, firstname, lastname, othernames, email, phoneNumber, username, registered, isAdmin, password)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     returning *`;

  try {
    const { rows } = await db.query(text, values);
    return res.status(201)
      .send({
        status: 201,
        data: [{
          token: 'Put token here',
          user: rows[0],
        }],
      });
  } catch (err) {
    return res.status(400)
      .send({
        status: 500,
        error: err,
      });
  }
}

// // Returning user sign in
async function signIn(req, res) {
  const queryPassword = req.body.password;

  const text = `SELECT * FROM users WHERE username = $1`;

  try {
    const { rows } = await db.query(text, [req.body.username]);

    if (rows[0].password !== queryPassword) {
      return res
        .send({
          status: 404,
          data: 'Username and password do not match',
        });
    }

    if (rows[0].password === queryPassword) {
      return res.status(200)
        .send({
          status: 200,
          data: [{
            token: 'Put token here',
            user: rows[0],
          }],
        });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
}

export {
  signUp,
  signIn,
};
