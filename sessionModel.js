require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getClient = async (req) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT * FROM clients WHERE id=${req.params.clientId} AND user_id=${req.params.userId}`,
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

const getClients = async (req) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT first,last,id FROM clients WHERE user_id=${req.params.userId}`,
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
//create a new session record in the databsse
const createSession = (clientId, body) => {
  console.log("clientId: ", clientId);
  console.log("body: ", body);

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
//delete a session
const deleteClient = (params) => {
  const { userId, clientId } = params;
  return new Promise(function (resolve, reject) {
    pool.query(
      `DELETE FROM clients WHERE id = ${clientId} AND user_id = ${userId}`,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Client deleted with ID: ${clientId}`);
      }
    );
  });
};

//update a session record
const updateClient = (params, body) => {
  const fields = [];
  const values = [];
  const clientId = params.clientId;
  const userId = params.userId;
  let query = "UPDATE clients SET ";

  for (let key in body) {
    fields.push(`${key} = $${values.length + 1}`);
    values.push(body[key]);
  }

  query +=
    fields.join(", ") +
    `WHERE id = ${clientId} AND user_id = ${userId} RETURNING *`;

  return new Promise(function (resolve, reject) {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      }
      if (results && results.rows) {
        resolve(`Client updated: ${JSON.stringify(results.rows[0])}`);
      } else {
        reject(new Error("No results found"));
      }
    });
  });
};

module.exports = {
  getClient,
  getClients,
  createSession,
  deleteClient,
  updateClient,
};
