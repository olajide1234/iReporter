import express from 'express';
import * as checkIncidentPost from '../middlewares/checkIncidentPost';
import * as redFlagController from '../controllers/redFlagController';
import * as interventionController from '../controllers/interventionController';

import * as userController from '../controllers/userController';

const router = express.Router();

/**
 * @file  This files routes the different
 * API calls to middlewares and controllers.
 * It also conatins the initial welcome message.
 * @param {object} req
 * @param {object} res
 */

// // Welcome
// const welcomeMessage = (req, res) => {
//   const welcome = 'Welcome to Andela Bootcamp iReporter Project API, you can view the documentation here: https://olajideireporter.docs.apiary.io/';
//   res.status(200).send({
//     status: 200,
//     data: welcome,
//   });
// };
//
// router.get('/', welcomeMessage);

// user Routes
// API route to sign up
router.post(
  '/auth/signup',
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
  redFlagController.getAllRedFlagRecords,
);

//  API route to get single Red-flag record
router.get(
  '/records/red-flags/:id',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.getSingleRedFlagRecord,
);

// // POST Routes:
// API route to post a single Red-flag record
router.post(
  '/records/red-flags',
  checkIncidentPost.completeBody,
  redFlagController.postSingleRedFlagRecord,
);

// // PATCH Routes:
// API route to update a single Red-flag record location
router.patch(
  '/records/red-flags/:id/location',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkLocation,
  redFlagController.patchRedFlagRecordLocation,
);

// API route to update a single Red-flag record comment
router.patch(
  '/records/red-flags/:id/comment',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkComment,
  redFlagController.patchRedFlagRecordComment,
);

// API route to update a single red-flag record status
router.patch(
  '/records/red-flags/:id/status',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  checkIncidentPost.checkUsernameAndPasswordMatch,
  checkIncidentPost.isAdmin,
  redFlagController.patchRedFlagRecordStatus,
);

// // PUT Routes
//  API route to update a single Red-flag record
// router.put(
//   '/records/red-flags/:id',
//   checkIncidentPost.validID,
//   checkIncidentPost.completeBody,
//   redFlagController.putRedFlagRecord,
// );

// // DELETE Routes
// API route to delete a single Red-flag record
router.delete(
  '/records/red-flags/:id',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.deleteRedFlagRecord,
);

// Intervention Routes
// Get routes
//  API route to get all intervention record
router.get(
  '/records/interventions',
  interventionController.getAllInterventionRecords,
);

//  API route to get single intervention record
router.get(
  '/records/interventions/:id',
  checkIncidentPost.validID,
  interventionController.getSingleInterventionRecord,
);

// Post routes
// API route to post single intervention record
router.post(
  '/records/interventions',
  checkIncidentPost.completeBody,
  interventionController.postSingleInterventionRecord,
);

// Patch Routes

// API route to update a single intervention record location
router.patch(
  '/records/interventions/:id/location',
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkLocation,
  interventionController.patchInterventionRecordLocation,
);

// API route to update a single intervention record comment
router.patch(
  '/records/interventions/:id/comment',
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkComment,
  interventionController.patchInterventionRecordComment,
);


// API route to update a single intervention record status
router.patch(
  '/records/interventions/:id/status',
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  checkIncidentPost.checkUsernameAndPasswordMatch,
  checkIncidentPost.isAdmin,
  interventionController.patchInterventionRecordStatus,
);

// // DELETE Routes
// API route to delete a single intervention record
router.delete(
  '/records/interventions/:id',
  checkIncidentPost.validID,
  checkIncidentPost.findInterventionRecord,
  interventionController.deleteInterventionRecord,
);

module.exports = router;
