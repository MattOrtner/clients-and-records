const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
});

const signInUser = async (req) => {
  const { email, pass } = req.body;
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT email, password, id, first FROM users WHERE email = $1;",
        [email],
        (error, results) => {
          if (error) {
            console.error("loginQuery callback: ", error);
            reject(error);
          }
          const response = results.rows[0];
          if (response.password === pass) {
            resolve({ status: 200, id: response.id, first: response.first });
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error_1");
  }
};

const getClient = async (req) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT first, last, email, phone_number, id FROM clients WHERE id = $1",
        [req.params.clientId],
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

const getClientProfile = async (req) => {
  const { clientId } = req.params;
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        "SELECT first, last, email, phone_number, rate FROM clients WHERE id = $1",
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
//create a new client record in the databsse
const createClient = (userId, body) => {
  return new Promise(function (resolve, reject) {
    const { first, last, email, rate, occurrence, phonenumber } = body;
    pool.query(
      "INSERT INTO clients (first, last, email, rate, occurrence, phone_number, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [first, last, email, rate, occurrence, phonenumber, userId],
      (error, results) => {
        if (error) {
          console.log("error createClientAPI: ", error);
          reject(error);
        }
        if (results && results.rows) {
          // resolve(
          //   `A new client has been added: ${JSON.stringify(results.rows[0])}`
          // );
          // console.log("results.rows[0]: ", results.rows[0]);
          // return results.rows[0];
          resolve(results.rows[0]);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
//delete a client
const deleteClient = (params) => {
  const { userId, clientId } = params;
  return new Promise(function (resolve, reject) {
    pool.query(
      "DELETE FROM clients WHERE id = $1 AND user_id = $2",
      [clientId, userId],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(`Client deleted with ID: ${clientId}`);
      }
    );
  });
};

//update a client record
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
  signInUser,
  getClient,
  getClientProfile,
  getClients,
  createClient,
  deleteClient,
  updateClient,
};
