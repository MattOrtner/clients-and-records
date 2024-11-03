require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getTodos = async (req) => {
  try {
    return await new Promise(function (resolve, reject) {
      pool.query(
        `SELECT * from todos WHERE user_id = ${req.params.userId}`,
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
  } catch (error) {
    throw new Error("getTodos error internal server error");
  }
};

const createTodo = (req) => {
  return new Promise(function (resolve, reject) {
    const { id, content, index, userId } = req.body;
    pool.query(
      "INSERT INTO todos( content, id, user_id, index) VALUES ($1, $2, $3, $4) RETURNING *",
      [content, id, userId, index],
      (error, results) => {
        if (error) {
          console.log("error createTodo: ", error);
          reject(error);
        }
        if (results && results.rows) {
          resolve(
            `A new todo has been added: ${JSON.stringify(results.rows[0])}`
          );
        } else {
          reject(new Error("No results found"));
        }
      }
    );
  });
};

module.exports = {
  getTodos,
  createTodo,
};
