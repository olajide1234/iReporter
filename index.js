import express from 'express';

//  Set up the express app
const app = express();

// Routers
const redFlagController = require('./server/controllers/redFlagController');
const welcomeController = require('./server/controllers/welcomeController');

app.use('/api/v1/red-flags', redFlagController);
app.use('/', welcomeController);

// Set up port
const PORT = process.env.PORT || 2000;

if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export our app for testing purposes
module.exports = app;
