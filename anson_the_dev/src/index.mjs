import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

const loggingMiddleWare = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;

  next();
};

app.use(loggingMiddleWare);

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

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3 - 10 characters"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    return res.send(mockUsers);
  }
);

app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  const result = validationResult(req);
  console.log(result);

  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const data = matchedData(req);
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };

  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];

  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
