import express from 'express';
import * as checkIncidentPost from '../middlewares/checkIncidentPost';
import * as redFlagController from '../controllers/redFlagController';
import * as interventionController from '../controllers/interventionController';

import * as userController from '../controllers/userController';
import verifyToken from '../middlewares/auth';

const router = express.Router();

/**
 * @file  This files routes the different
 * API calls to middlewares and controllers.
 * It also conatins the initial welcome message.
 * @param {object} req
 * @param {object} res
 */

// Welcome
const welcomeMessage = (req, res) => {
  const welcome = 'Welcome to Andela Bootcamp iReporter Project API, you can view the documentation here: https://olajideireporter.docs.apiary.io/';
  res.status(200).send({
    status: 200,
    data: welcome,
  });
};

router.get('/', welcomeMessage);

// user Routes
// API route to sign up
router.post(
  '/auth/signup',
  checkIncidentPost.completeSignUpBody,
  checkIncidentPost.checkUsernameExists,
  checkIncidentPost.checkEmailExists,
  checkIncidentPost.checkValidEmail,
  checkIncidentPost.checkValidPassword,
  userController.signUp,
);

// API route to sign in
router.post(
  '/auth/signin',
  checkIncidentPost.checkUsernameAndPasswordMatch,
  userController.signIn,
);

// Red-flag routes
// // GET Routes:
// API route to get all Red-flag records
router.get(
  '/records/red-flags',
  verifyToken,
  redFlagController.getAllRedFlagRecords,
);

//  API route to get single Red-flag record
router.get(
  '/records/red-flags/:id',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.getSingleRedFlagRecord,
);

// // POST Routes:
// API route to post a single Red-flag record
router.post(
  '/records/red-flags',
  verifyToken,
  checkIncidentPost.completeBody,
  checkIncidentPost.checkRequestTypeIsRedFlag,
  redFlagController.postSingleRedFlagRecord,
);

// // PATCH Routes:
// API route to update a single Red-flag record location
router.patch(
  '/records/red-flags/:id/location',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  checkIncidentPost.checkLocation,
  redFlagController.patchRedFlagRecordLocation,
);

// API route to update a single Red-flag record comment
router.patch(
  '/records/red-flags/:id/comment',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  checkIncidentPost.checkComment,
  redFlagController.patchRedFlagRecordComment,
);

// API route to update a single red-flag record status
router.patch(
  '/records/red-flags/:id/status',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkStatus,
  checkIncidentPost.isAdmin,
  checkIncidentPost.checkStatusChangeType,
  redFlagController.patchRedFlagRecordStatus,
);


// // DELETE Routes
// API route to delete a single Red-flag record
router.delete(
  '/records/red-flags/:id',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  redFlagController.deleteRedFlagRecord,
);

// Intervention Routes
// Get routes
//  API route to get all intervention record
router.get(
  '/records/interventions',
  verifyToken,
  interventionController.getAllInterventionRecords,
);

//  API route to get single intervention record
router.get(
  '/records/interventions/:id',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  interventionController.getSingleInterventionRecord,
);

// Post routes
// API route to post single intervention record
router.post(
  '/records/interventions',
  verifyToken,
  checkIncidentPost.completeBody,
  checkIncidentPost.checkRequestTypeIsIntervention,
  interventionController.postSingleInterventionRecord,
);

// Patch Routes

// API route to update a single intervention record location
router.patch(
  '/records/interventions/:id/location',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  checkIncidentPost.checkLocation,
  interventionController.patchInterventionRecordLocation,
);

// API route to update a single intervention record comment
router.patch(
  '/records/interventions/:id/comment',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  checkIncidentPost.checkComment,
  interventionController.patchInterventionRecordComment,
);


// API route to update a single intervention record status
router.patch(
  '/records/interventions/:id/status',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.isAdmin,
  checkIncidentPost.checkStatusChangeType,
  interventionController.patchInterventionRecordStatus,
);

// // DELETE Routes

// API route to delete a single intervention record
router.delete(
  '/records/interventions/:id',
  verifyToken,
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkIfCurrentStatusIsDraft,
  interventionController.deleteInterventionRecord,
);

module.exports = router;
