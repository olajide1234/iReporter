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
        id SERIAL PRIMARY KEY,
        owner_id INTEGER NOT NULL,
        createdOn DATE DEFAULT CURRENT_DATE,
        createdBy VARCHAR,
        type VARCHAR,
        dateOfIncident VARCHAR,
        title VARCHAR,
        comment VARCHAR,
        images VARCHAR,
        videos VARCHAR,
        location VARCHAR,
        status VARCHAR,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
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
};

/**
 * Create user tables
 */
const createUserTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        firstname VARCHAR,
        lastname VARCHAR,
        email VARCHAR UNIQUE NOT NULL,
        username VARCHAR UNIQUE NOT NULL,
        isAdmin BOOL,
        password VARCHAR NOT NULL
        registered TIMESTAMP,
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
};

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
};

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
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


const initializeDbForTest = () => {
  dropIncidentTables();
  dropUserTables();
  createUserTables();
  createIncidentTables();
};


module.exports = {
  createIncidentTables,
  createUserTables,
  dropIncidentTables,
  dropUserTables,
  initializeDbForTest,

};

require('make-runnable');
