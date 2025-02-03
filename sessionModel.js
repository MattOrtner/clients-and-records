const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
});

const getSession = async (sessionId) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM sessions WHERE id=$1",
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
    // CONFIRM CLIENT BELONGS TO USER
    // const user = await new Promise(function (resolve, reject) {
    //   pool.query(`SELECT user_id FROM clients WHERE id=${clientId}`);
    // });
    // console.log("user", user);
    // if (user[0].id !== userId) {
    //   throw new Error("Client does not belong to user");
    // }
    // console.log("client", client);
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

module.exports = {
  getSession,
  getClientSessions,
  createSession,
  deleteSession,
  updateSession,
};
