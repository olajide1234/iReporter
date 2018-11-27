import express from 'express';
import bodyParser from 'body-parser';
import es6mapimplement from 'es6-map/implement';

// Data model
const redFlagRecords = new Map([
  [1, {
    id: 1,
    createdOn: 'Sample date',
    createdBy: 'Sample Creator', // represents the user who created this record
    type: 'Sample record type', // [red-flag, intervention]
    dateOfIncident: 'Sample date',
    title: 'Sample title',
    comment: 'Sample comment',
    Images: ['Sample Image'],
    Videos: ['Sample Video'],
    location: 'Sample record location', // Lat Long coordinates
    status: 'Sample status', // [draft, under investigation, resolved, rejected]
  }],
]);

const userList = new Map([
  ['admin', {
    id: 'Integer',
    firstname: 'String',
    lastname: 'String',
    othernames: 'String',
    email: 'String',
    phoneNumber: 'String',
    username: 'admin',
    registered: 'Date',
    isAdmin: true,
    password: 'encoded password',
  }],
]);

// Set up the express app
const app = express();

//  Setup bodyParser
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set up port
const PORT = 2000;

//  Diabled so as not to conflict mocha --watch.
//  Solution ref: http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
// if (!module.parent) {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
