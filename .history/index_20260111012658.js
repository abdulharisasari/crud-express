const express = require("express");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const result = "Hello, World!";
  res.json(result);
});


// GET all users
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users ORDER BY id");
  res.json(result.rows);
});

// GET user by id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  res.json(result.rows[0]);
});

// CREATE user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.json(result.rows[0]);
});

// UPDATE user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  );
  res.json(result.rows[0]);
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
  res.json({ message: "User deleted" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
