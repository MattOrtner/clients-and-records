const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: true,
});

const getSession = async (sessionId) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT sessions.date, sessions.time, sessions.notes, sessions.paid , clients.first, clients.last FROM sessions JOIN clients ON sessions.client_id = clients.id WHERE sessions.id = $1",
        [sessionId],
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

const getClientSessions = async ({ userId, clientId }) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM sessions WHERE client_id=$1",
        [clientId],
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
    const { date, time, paid } = body;
    pool.query(
      "INSERT INTO sessions (client_id, date, time, paid) VALUES ($1, $2, $3, $4) RETURNING *",
      [clientId, date, time, paid],
      (error, results) => {
        if (error) {
          console.log("error createClientAPI: ", error);
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
};

const deleteSession = (sessionId) => {
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM sessions WHERE id = $1",
      [sessionId],
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
  const values = [];
  const fields = [];
  let query = "UPDATE sessions SET ";

  for (let key in body) {
    fields.push(`${key} = $${values.length + 1}`);
    values.push(body[key]);
  }

  query += fields.join(", ") + ` WHERE id = $${values.length + 1} RETURNING *`;
  values.push(sessionId);

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

const getUnpaidSessions = (userId) => {
  if (!userId) {
    return Promise.reject(new Error("Undefined userId"));
  }
  return new Promise(function (resolve, reject) {
    pool.query(
      `SELECT sessions.id AS session_id, first, last, date, time, client_id FROM sessions
       INNER JOIN clients ON sessions.client_id = clients.id 
       WHERE clients.user_id = $1 AND sessions.paid = false`,
      [userId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(console.error("No results found"));
        }
      }
    );
  });
};

module.exports = {
  getSession,
  getClientSessions,
  createSession,
  deleteSession,
  updateSession,
  getUnpaidSessions,
};
