const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
require("dotenv").config();
const user_model = require("./userModel");
const session_model = require("./sessionModel");
const task_model = require("./taskModel");

const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [FRONTEND_URL, "http://localhost:3000"];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors(corsOptions));

// USER ROUTES
app.post("/signup", (req, res) => {
  user_model
    .signUpUser(req)
    .then((response) => res.status(201).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/login", (req, res) => {
  user_model
    .signInUser(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

// TODOS ROUTES
app.get("/:userId/tasks", (req, res) => {
  task_model
    .getTasks(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/tasks", (req, res) => {
  task_model
    .createTask(req)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.delete("/tasks", (req, res) => {
  task_model
    .deleteTask(req)
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

app.get("/clients/:clientId/profile", (req, res) => {
  user_model
    .getClientProfile(req)
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

app.delete("/:clientId/sessions/:sessionId", (req, res) => {
  session_model
    .deleteSession(req.params.sessionId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.put("/:clientId/sessions/:sessionId", (req, res) => {
  session_model
    .updateSession(req.params.sessionId, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.get("/:userId/sessions/unpaid", (req, res) => {
  session_model
    .getUnpaidSessions(req.params.userId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
