const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

// /**
//  * Create incident Tables
//  */
//   const incidentTableSchema =
//     `CREATE TABLE IF NOT EXISTS
//       incidents(
//         id SERIAL PRIMARY KEY,
//         owner_id INTEGER NOT NULL,
//         createdOn DATE DEFAULT CURRENT_DATE,
//         createdBy VARCHAR,
//         type VARCHAR,
//         dateOfIncident VARCHAR,
//         title VARCHAR,
//         comment VARCHAR,
//         images VARCHAR,
//         videos VARCHAR,
//         location VARCHAR,
//         status VARCHAR,
//         FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
//       )`;
//
//
// /**
//  * Create user tables
//  */
//   const userTableSchema =
//     `CREATE TABLE IF NOT EXISTS
//       users(
//         id SERIAL PRIMARY KEY,
//         firstname VARCHAR,
//         lastname VARCHAR,
//         othernames VARCHAR,
//         email VARCHAR UNIQUE NOT NULL,
//         phoneNumber BIGINT,
//         username VARCHAR UNIQUE NOT NULL,
//         registered TIMESTAMP,
//         isAdmin BOOL,
//         password VARCHAR NOT NULL
//       )`;
