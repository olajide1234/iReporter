import redFlagRecords from '../models/incidents';

/**
 * @file This is the middleware file for validating
 * API calls before passing to controllers.
 * @param {object} req
 * @param {object} res
 * @param {func} next
 *
 * @return {void}
 */

exports.completeBody = (req, res, next) => {
  let errorMessage;

  if (!req.body.createdBy) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Include creator\'s username or null as createdBy in body of request',
    };
  }

  if (!req.body.dateOfIncident) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Include date of incident or null as dateOfIncident in body of request',
    };
  }

  if (!req.body.title) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Include short title or null as title in body of request',
    };
  }

  if (!req.body.comment) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Include narration of incident or null as comment in body of request',
    };
  }

  if (!req.body.images) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Specify image locations or null as images in body of request',
    };
  }

  if (!req.body.videos) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Specify video locations or null as videos in body of request',
    };
  }

  if (!req.body.location) {
    errorMessage = {
      status: 400,
      error: 'Bad request: Specify location of incident or null as location in body of request',
    };
  }

  if (req.body.status) {
    if (req.body.createdBy !== 'admin') {
      errorMessage = {
        status: 403,
        error: 'Forbidden: Only admins can modify record status, please remove status from body of request',
      };
    }
  }

  if (errorMessage) return res.status(errorMessage.status).send(errorMessage);

  return next();
};

exports.validID = (req, res, next) => {
  //  Check that a valid record id is supplied
  const requestId = parseInt(req.params.id, 10);

  if (Number.isNaN(requestId)) {
    return res.status(400).send({
      status: 400,
      error: 'Bad request: Include numeric ID of record in parameter',
    });
  }

  return next();
};

exports.findRedFlagRecord = (req, res, next) => {
  // Find RedFlagRecord
  const requestId = parseInt(req.params.id, 10);

  const recordFound = ([...redFlagRecords.keys()].includes(requestId)
    && redFlagRecords.get(requestId) !== null);

  if (!recordFound) {
    return res.status(404).send({
      status: 404,
      error: 'Not found: Record not found',
    });
  }
  return next();
};
