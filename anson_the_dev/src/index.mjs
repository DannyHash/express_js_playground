import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const mockUsers = [
  {
    id: 1,
    username: "danny",
    displayName: "Danny",
  },
  {
    id: 2,
    username: "debbie",
    displayName: "Debbie",
  },
  {
    id: 3,
    username: "nimi",
    displayName: "Nimi",
  },
  {
    id: 4,
    username: "marv",
    displayName: "Marv",
  },
  {
    id: 5,
    username: "issy",
    displayName: "Issy",
  },
  {
    id: 6,
    username: "happy",
    displayName: "Happy",
  },
  {
    id: 7,
    username: "mathew",
    displayName: "Mathew",
  },
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello world!" });
});

app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  console.log(req.body);

  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };

  mockUsers.push(newUser);

  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);

  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. Invalid id" });

  const findUser = mockUsers.find((user) => user.id === parsedId);

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers[findUserIndex] = { id: parsedId, ...body };

  return res.sendStatus(200);
});

app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
