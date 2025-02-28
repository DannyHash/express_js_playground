import express from "express";

const app = express();

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
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello world!" });
});

app.get("/api/users", (req, res) => {
  res.send(mockUsers);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. Invalid id" });

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
