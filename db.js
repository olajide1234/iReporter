const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create incident Tables
 */
const createIncidentTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      incidents(
        id INTEGER PRIMARY KEY,
        createdOn VARCHAR,
        createdBy VARCHAR,
        type VARCHAR,
        dateOfIncident VARCHAR,
        title VARCHAR,
        comment VARCHAR,
        images VARCHAR,
        videos VARCHAR,
        location VARCHAR,
        status VARCHAR
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create user tables
 */
const createUserTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id INTEGER PRIMARY KEY,
        firstname VARCHAR,
        lastname VARCHAR,
        othernames VARCHAR,
        email VARCHAR,
        phoneNumber INTEGER,
        username VARCHAR,
        registered TIMESTAMP,
        isAdmin BOOL,
        password VARCHAR
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop incident tables
 */
const dropIncidentTables = () => {
  const queryText = 'DROP TABLE IF EXISTS incidents';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop user tables
 */
const dropUserTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createIncidentTables,
  createUserTables,
  dropIncidentTables,
  dropUserTables,
};

require('make-runnable');
