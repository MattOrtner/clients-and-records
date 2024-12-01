const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

const user_model = require("./userModel");
const session_model = require("./sessionModel");
const todos_model = require("./todosModel");

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  next();
});

// USER ROUTES
app.post("/login", (req, res) => {
  user_model
    .signInUser(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

// TODOS ROUTES
app.get("/:userId/todos", (req, res) => {
  todos_model
    .getTodos(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/todos", (req, res) => {
  todos_model
    .createTodo(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.delete("/todos", (req, res) => {
  todos_model
    .deleteTodo(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

// CLIENT ROUTES
app.get("/clients/:clientId", (req, res) => {
  user_model
    .getClient(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.get("/:userId/clients", (req, res) => {
  user_model
    .getClients(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/:userId/clients", (req, res) => {
  user_model
    .createClient(req.params.userId, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.put("/:userId/clients/:clientId", (req, res) => {
  user_model
    .updateClient(req.params, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.delete("/:userId/clients/:clientId", (req, res) => {
  user_model
    .deleteClient(req.params)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

// SESSION ROUTES

app.post("/sessions/create-session/:clientId", (req, res) => {
  session_model
    .createSession(req.params.clientId, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.get("/:userId/clients/sessions/:clientId", (req, res) => {
  session_model
    .getClientSessions(req.params)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.get("/:userId/clients/:clientId/sessions/:sessionId", (req, res) => {
  session_model
    .getSession(req.params.sessionId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.delete("/:userId/clients/:clientId/sessions/:sessionId", (req, res) => {
  session_model
    .deleteSession(req.params.sessionId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.put("/:userId/clients/:clientId/sessions/:sessionId", (req, res) => {
  session_model
    .updateSession(req.params.sessionId, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
