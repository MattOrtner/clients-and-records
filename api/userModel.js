const { comparePassword } = require("./incryption");

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // ssl: true,
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
          const isMatch = comparePassword(pass, response.password);
          if (isMatch) {
            resolve({
              status: 200,
              id: response.id,
              first: response.first,
              email: response.email,
            });
          } else {
            reject(new Error("No results found"));
          }
        }
      );
    });
  } catch (error_1) {
    console.error("userModel error: ", error_1);
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

const createClient = (userId, body) => {
  return new Promise(function (resolve, reject) {
    const { first, last, email, rate, phonenumber } = body;
    pool.query(
      "INSERT INTO clients (first, last, email, rate, phone_number, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first, last, email, rate, phonenumber, userId],
      (error, results) => {
        if (error) {
          console.log("error createClientAPI: ", error);
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows[0]);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

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
        resolve({ id: clientId, message: "Client deleted successfully" });
      }
    );
  });
};

//update a client record
const updateClient = (params, body) => {
  console.log("body", body);
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
    ` WHERE id = ${clientId} AND user_id = ${userId} RETURNING *`;
  console.log("query", query);
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
