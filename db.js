// Courtesy: https://www.codementor.io/olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-and-postgresql-db-masuu56t7

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config(); // Imports .env config

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('I am connected to db'); // eslint-disable-line no-console
});

// Create tables

const createTables = () => {
  const queryTextIncident =
  `CREATE TABLE IF NOT EXISTS
    incidents(
      id INTEGER PRIMARY KEY,
      createdOn DATE
      createdBy VARCHAR
      type VARCHAR
      dateOfIncident DATE
      title VARCHAR
      comment VARCHAR
      images VARCHAR
      videos VARCHAR
      location VARCHAR
      status VARCHAR
    )`;

  const queryTextUser =
    `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        firstname VARCHAR
        lastname VARCHAR
        othernames VARCHAR
        email VARCHAR
        phoneNumber INTEGER
        username VARCHAR
        registered DATE
        isAdmin BOOL
      )`;

  pool.query(queryTextIncident)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(queryTextUser)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


//  Drop tables
const dropTables = () => {
  const queryTextIncident = 'DROP TABLE IF EXISTS incidents';
  const queryTextUsers = 'DROP TABLE IF EXISTS users';

  pool.query(queryTextIncident)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(queryTextUsers)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
