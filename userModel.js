require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getContacts = async () => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query("SELECT first,last,id FROM clients", (error, results) => {
        if (error) {
          console.error("error", error);
          reject(error);
        }
        if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};
//create a new client record in the databsse
const createClient = (body) => {
  return new Promise(function (resolve, reject) {
    const { first, last, email, rate, occurrence, phonenumber } = body;

    pool.query(
      "INSERT INTO clients (first, last, email, rate, occurrence, phonenumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first, last, email, rate, occurrence, phonenumber],
      (error, results) => {
        if (error) {
          console.log("error createClientAPI: ", error);
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new client has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
//delete a client
const deleteClient = (id) => {
  return new Promise(function (resolve, reject) {
    pool.query("DELETE FROM clients WHERE id = $1", [id], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(`Client deleted with ID: ${id}`);
    });
  });
};
//update a client record
const updateClient = (id, body) => {
  return new Promise(function (resolve, reject) {
    const { name, email } = body;
    pool.query(
      "UPDATE clients SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id],
      (error, results) => {
        if (error) {
          reject(error);
        }
        if (results && results.rows) {
          resolve(`Client updated: ${JSON.stringify(results.rows[0])}`);
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};
module.exports = {
  getContacts,
  createClient,
  deleteClient,
  updateClient,
};
