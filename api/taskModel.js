require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: true,
});

const getTasks = async (req) => {
  try {
    const results = await pool.query("SELECT * from tasks WHERE user_id = $1", [
      req.params.userId,
    ]);
    if (results && results.rows) {
      return results.rows;
    } else {
      return [];
    }
  } catch (error) {
    console.error("error", error);
    throw new Error("getTodos error internal server error");
  }
};

const createTask = async (req) => {
  try {
    const { id, content, index, userId } = req.body;
    const results = await pool.query(
      "INSERT INTO tasks( content, id, user_id, index) VALUES ($1, $2, $3, $4) RETURNING *",
      [content, id, userId, index]
    );
    if (results && results.rows) {
      return results.rows[0];
    } else {
      throw new Error("Failed to create todo");
    }
  } catch (error) {
    console.error("error", error);
    throw new Error("Internal server error");
  }
};

const deleteTask = async (req) => {
  const { id } = req.body;
  try {
    const results = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    if (results && results.rowCount > 0) {
      return `Todo with id ${id} has been deleted`;
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("error deleteTodo: ", error);
    throw error;
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
};
