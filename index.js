import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement';

/**
 * This is the prmary application file
 * which sets up the iReporter app.
 *
 * @file   This files sets up the port for
 * the iReporter app.
 * @param {object} req
 * @param {object} res
 *
 */


//  Set up the express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const router = require('./server/routers/router');

// Welcome
const welcomeMessage = (req, res) => {
  const welcome = 'Welcome to Andela Bootcamp iReporter Project API, you can view the documentation here: https://olajideireporter.docs.apiary.io/';
  res.status(200).send({
    status: 200,
    data: welcome,
  });
};

app.get('/', welcomeMessage);
app.use('/api/v1/records', router);
app.all('*', (req, res) => {
  res.status(404).send({
    message: 'Incorrect endpoint. We do not support that endpoint yet',
  });
});

// Set up port
const PORT = process.env.PORT || 2000;

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export our app for testing purposes
module.exports = app;
