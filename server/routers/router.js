import express from 'express';
import checkIncidentPost from '../middlewares/checkIncidentPost';
import redFlagController from '../controllers/redFlagController';

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

// // GET Routes:
// API route to get all Red-flag records
router.get(
  '/red-flags',
  redFlagController.getAllRedFlagRecords,
);

//  API route to get single Red-flag record
router.get(
  '/red-flags/:id',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.getSingleRedFlagRecord,
);


// // POST Routes:
// API route to post a single Red-flag record
router.post(
  '/red-flags',
  checkIncidentPost.completeBody,
  redFlagController.postSingleRedFlagRecord,
);


// // PATCH Routes:
// API route to update a single Red-flag record location
router.patch(
  '/red-flags/:id/location',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.patchRedFlagRecordLocation,
);

// API route to update a single Red-flag record comment
router.patch(
  '/red-flags/:id/comment',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.patchRedFlagRecordComment,
);

// // PUT Routes
//  API route to update a single Red-flag record
router.put(
  '/red-flags/:id',
  checkIncidentPost.validID,
  checkIncidentPost.completeBody,
  redFlagController.putRedFlagRecord,
);

// // DELETE Routes
// API route to delete a single Red-flag record
router.delete(
  '/red-flags/:id',
  checkIncidentPost.validID,
  checkIncidentPost.findRedFlagRecord,
  redFlagController.deleteRedFlagRecord,
);

module.exports = router;
