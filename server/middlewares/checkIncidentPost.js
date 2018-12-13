import validator from 'validator';
import db from '../database/main';
import { compareHashAndTextPassword } from '../controllers/helpers';

/**
 * @file This is the middleware file for validating
 * API calls before passing to controllers.
 * @param {object} req
 * @param {object} res
 * @param {func} next
 *
 * @return {void}
 */

const completeBody = (req, res, next) => {
  let errorMessage = [];

  if (!req.body.type) {
    errorMessage.push('Include record type as type in body of request, alphabets only');
  }


  if ((!req.body.dateOfIncident) || !(validator.isISO8601(req.body.dateOfIncident))) {
    errorMessage.push('Include valid date as date of incident as YYYY-MM-DD in body of request');
  }

  if ((!req.body.title) || validator.isEmpty(req.body.title, { ignore_whitespace: true })) {
    errorMessage.push('Include short title as title in body of request');
  }

  if ((!req.body.comment) || validator.isEmpty(req.body.comment, { ignore_whitespace: true })) {
    errorMessage.push('Include narration of incident as comment in body of request');
  }

  if (req.body.images) {
    if (!validator.isURL(req.body.images)) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please include valid url as image location',
        });
    }
  }

  if (req.body.videos) {
    if (!validator.isURL(req.body.videos)) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please include valid url as video location',
        });
    }
  }

  if (!req.body.location) {
    errorMessage.push('Include location in body of request');
  }

  if (req.body.status) {
    if (req.body.createdBy !== 'admin') {
      errorMessage = {
        status: 403,
        error: 'Only admins can modify record status, please remove status from body of request',
      };
    }
  }

  if (errorMessage.length) return res.status(400).send({ status: 400, error: { ...errorMessage } });

  return next();
};

const checkRequestTypeIsRedFlag = (req, res, next) => {
  let errorMessage;
  if (!(req.body.type === 'red-flag')) {
    errorMessage = {
      status: 400,
      error: 'Incident type can only be red-flag',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

const checkRequestTypeIsIntervention = (req, res, next) => {
  let errorMessage;
  if (!(req.body.type === 'intervention')) {
    errorMessage = {
      status: 400,
      error: 'Incident type can only be intervention',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

const checkStatusChangeType = (req, res, next) => {
  let errorMessage;
  if (!(req.body.status === 'under-investigation' || req.body.status === 'rejected' || req.body.status === 'resolved' || req.body.status === 'pending')) {
    errorMessage = {
      status: 400,
      error: 'Status can only be pending, under-investigation, rejected or resolved',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

const validID = (req, res, next) => {
  //  Check that a valid record id is supplied
  const requestId = req.params.id;

  if ((Number.isNaN(requestId)) || (requestId < 1 || !(requestId % 1 === 0))) {
    return res.status(400).send({
      status: 400,
      error: 'Include numeric ID of record in parameter',
    });
  }

  return next();
};


async function findRedFlagRecord(req, res, next) {
  // Find Intervention Record
  const requestId = parseInt(req.params.id, 10);

  const findRedFlagRecordQuery = `SELECT * FROM incidents WHERE type = 'red-flag' AND id=$1`;

  try {
    const { rows } = await db.query(findRedFlagRecordQuery, [requestId]);
    if (!rows[0]) {
      return res.status(404).send({
        status: 404,
        error: 'Record not found',
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }

  return next();
}

async function findInterventionRecord(req, res, next) {
  // Find Intervention Record
  const requestId = parseInt(req.params.id, 10);

  const findInterventionRecordQuery = `SELECT * FROM incidents WHERE type = 'intervention' AND id=$1`;

  try {
    const { rows } = await db.query(findInterventionRecordQuery, [requestId]);
    if (!rows[0]) {
      return res.status(404).send({
        status: 404,
        error: 'Record not found',
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }

  return next();
}

const checkLocation = (req, res, next) => {
  let errorMessage;

  if (!req.body.location || validator.isEmpty(req.body.location, { ignore_whitespace: true })) {
    errorMessage = {
      status: 400,
      error: 'Include new location in body of request',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

const checkStatus = (req, res, next) => {
  let errorMessage;

  if (!req.body.status || validator.isEmpty(req.body.status, { ignore_whitespace: true })) {
    errorMessage = {
      status: 400,
      error: 'Include new status in body of request',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

const checkComment = (req, res, next) => {
  let errorMessage;

  if (!req.body.comment || validator.isEmpty(req.body.comment, { ignore_whitespace: true })) {
    errorMessage = {
      status: 400,
      error: 'Include new comment as comment in body of request',
    };
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

// // Check valid username
async function checkUsernameAndPasswordMatch(req, res, next) {
  const queryUsername = req.body.username;
  const queryPassword = req.body.password;
  const text = `SELECT * FROM users WHERE username = $1 `;

  try {
    const { rows } = await db.query(text, [queryUsername]);

    if (!rows[0]) {
      return res.status(401)
        .send({
          status: 401,
          error: 'Please enter a valid username.',
        });
    }

    if (!compareHashAndTextPassword(rows[0].password, queryPassword)) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Username and password do not match',
        });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
  return next();
}

// // Check if admin
async function isAdmin(req, res, next) {
  const userId = req.user.id;

  const text = `SELECT * FROM users WHERE id = $1`;

  try {
    const { rows } = await db.query(text, [userId]);
    if (rows[0].isadmin !== true) {
      return res.status(403)
        .send({
          status: 403,
          data: 'You are not an admin',
        });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
  return next();
}

// Check if current status of record is pending
async function checkIfCurrentStatusIsPending(req, res, next) {
  // Find Intervention Record
  const requestId = parseInt(req.params.id, 10);

  const findRecordQuery = `SELECT * FROM incidents WHERE id=$1`;

  try {
    const { rows } = await db.query(findRecordQuery, [requestId]);
    if (!(rows[0].status === 'pending')) {
      return res.status(403).send({
        status: 403,
        error: 'Record cannot be edited or deleted once admin has changed status',
      });
    }
  } catch (err) {
    return res.status(400).send(err);
  }

  return next();
}

// Sign in validations
const completeSignInBody = (req, res, next) => {
  const errorMessage = [];

  if (!req.body.username || validator.isEmpty(req.body.username, { ignore_whitespace: true })) {
    errorMessage.push('Please input username');
  }

  if (req.body.username) {
    if (req.body.username.trim() !== req.body.username) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please remove leading and trailing spaces from username',
        });
    }
  }

  if (!req.body.password) {
    errorMessage.push('Please input password');
  }

  if (errorMessage.length) return res.status(400).send({ status: 400, error: { ...errorMessage } });

  return next();
};


// // Signup validations
//   check for valid email input
const completeSignUpBody = (req, res, next) => {
  const errorMessage = [];

  if ((!req.body.firstname)
  || validator.isEmpty(req.body.firstname, { ignore_whitespace: true })) {
    errorMessage.push('Include firstname in body of request');
  }

  if ((!req.body.lastname)
  || validator.isEmpty(req.body.lastname, { ignore_whitespace: true })) {
    errorMessage.push('Include lastname in body of request');
  }

  if ((!req.body.email) || (!(validator.isEmail(req.body.email)))) {
    errorMessage.push('Include valid email email in body of request');
  }

  if (!req.body.username) {
    errorMessage.push('Please select a username');
  }

  if (req.body.username) {
    if (req.body.username.trim() !== req.body.username) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please remove leading and trailing spaces from username',
        });
    }
  }

  if (req.body.phoneNumber) {
    if ((!validator.isMobilePhone(req.body.phoneNumber))) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please enter a valid mobile number',
        });
    }
  }

  if (!req.body.password) {
    errorMessage.push('Please select a password;');
  }

  if (req.body.password) {
    const { password } = req.body;
    if ((!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) || validator.isEmpty(password, { ignore_whitespace: true })) || (req.body.password.trim() !== req.body.password)) {
      return res.status(400)
        .send({
          status: 400,
          data: 'Please include password which must fulfil following conditions: At least 1 lowercase alphabet, at least 1 uppercase alphabet, at least one special character. Entire password must be eight characters or longer and no leading or trailing spaces',
        });
    }
  }

  if (errorMessage.length) return res.status(400).send({ status: 400, error: { ...errorMessage } });

  return next();
};

// const checkValidEmail = (req, res, next) => {
//   if (!(validator.isEmail(req.body.email))) {
//     return res.status(400)
//       .send({
//         status: 400,
//         data: 'Please enter a valid email',
//       });
//   }
//   return next();
// };

// const checkValidPassword = (req, res, next) => {
//   const { password } = req.body;
//   if ((!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) || validator.isEmpty(password, { ignore_whitespace: true }))) {
//     return res.status(400)
//       .send({
//         status: 400,
//         data: 'Please include password which must fulfil following conditions: At least 1 lowercase alphabet, at least 1 uppercase alphabet, at least one special character.Entire password must be eight characters or longer',
//       });
//   }
//   return next();
// };

// // Check username exists
async function checkUsernameExists(req, res, next) {
  const queryUsername = req.body.username;
  const text = `SELECT * FROM users WHERE username = $1 `;

  try {
    const { rows } = await db.query(text, [queryUsername]);

    if (rows[0]) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Username exists, please try another username',
        });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
  return next();
}

// // Check email exists
async function checkEmailExists(req, res, next) {
  const queryEmail = req.body.email;
  const text = `SELECT * FROM users WHERE email = $1 `;

  try {
    const { rows } = await db.query(text, [queryEmail]);

    if (rows[0]) {
      return res.status(400)
        .send({
          status: 400,
          error: 'Email exists, please try another email',
        });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
  return next();
}

export {
  completeBody,
  validID,
  findRedFlagRecord,
  findInterventionRecord,
  checkLocation,
  checkComment,
  isAdmin,
  checkUsernameAndPasswordMatch,
  checkRequestTypeIsRedFlag,
  checkRequestTypeIsIntervention,
  checkStatusChangeType,
  checkStatus,
  checkIfCurrentStatusIsPending,
  completeSignUpBody,
  checkUsernameExists,
  checkEmailExists,
  completeSignInBody,
};
