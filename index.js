const express = require("express");
const app = express();
const port = 3001;

const user_model = require("./userModel");
const session_model = require("./sessionModel");
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `*`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  next();
});

app.get("/:userId/clients/:clientId", (req, res) => {
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

app.post("/:userId/clients/:clientId/createSession", (req, res) => {
  session_model
    .createSession(req.params.clientId, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.get("/:userId/clients/:clientId/sessions", (req, res) => {
  session_model
    .getClientSessions(req.params.clientId)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
