require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getSession = async (sessionId) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT * FROM sessions WHERE id=${sessionId}`,
        (error, results) => {
          if (error) {
            console.error("error", error);
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

const getClientSessions = async (clientId) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT * FROM sessions WHERE client_id=${clientId}`,
        (error, results) => {
          if (error) {
            console.error("error", error);
            reject(error);
          }
          if (results && results.rows) {
            resolve(results.rows);
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

const createSession = (clientId, body) => {
  return new Promise(function (resolve, reject) {
    const { notes, session_date, paid } = body;
    pool.query(
      "INSERT INTO sessions (client_id, notes, session_date, paid) VALUES ($1, $2, $3, $4) RETURNING *",
      [clientId, notes, session_date, paid],
      (error, results) => {
        if (error) {
          console.log("error createClientAPI: ", error);
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new session has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

const deleteSession = (sessionId) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      `DELETE FROM sessions WHERE id = ${sessionId}`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Session deleted with ID: ${sessionId}`);
      }
    );
  });
};

const updateSession = (sessionId, body) => {
  console.log("sessionId: ", sessionId);
  console.log("body: ", body);
  const fields = [];
  const values = [];
  let query = "UPDATE sessions SET ";

  for (let key in body) {
    fields.push(`${key} = $${values.length + 1}`);
    values.push(body[key]);
  }

  query += fields.join(", ") + `WHERE id = ${sessionId} RETURNING *`;

  return new Promise(function (resolve, reject) {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      }
      if (results && results.rows) {
        resolve(`Session updated: ${JSON.stringify(results.rows[0])}`);
      } else {
        reject(new Error("No results found"));
      }
    });
  });
};

module.exports = {
  getSession,
  getClientSessions,
  createSession,
  deleteSession,
  updateSession,
};
