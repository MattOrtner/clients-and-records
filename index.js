const express = require("express");
const app = express();
const port = 3001;

const clients_model = require("./userModel");
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

app.get("/clients", (req, res) => {
  clients_model
    .getContacts()
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.post("/clients", (req, res) => {
  clients_model
    .createClient(req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.put("/clients/:id", (req, res) => {
  clients_model
    .updateClient(req.params.id, req.body)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.delete("/clients/:id", (req, res) => {
  clients_model
    .deleteClient(req.params.id)
    .then((response) => res.status(200).send(response))
    .catch((error) => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
