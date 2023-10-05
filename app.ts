import dotenv from "dotenv";
dotenv.config();

import express, { ErrorRequestHandler, response } from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person";
import db from "mongoose";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("./frontend"));
app.use(
  morgan(function (tokens, req, res) {
    if (req.method === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    } else {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ");
    }
  })
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: "name or number are missing",
    });
  }

  const person = new Person({
    name: body.name,
    phone: body.phone,
  });

  person
    .save()
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person: Person = {
    name: body.name,
    phone: body.phone,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

app.get("/info/", (request, response, next) => {
  Person.count()
    .then((result) => {
      response.send(
        `<div><p>Phonebook has info for ${result} people</p><p>${new Date()}</p></div>`
      );
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
});

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error.message);

  switch (error.name) {
    case "CastError": {
      return response.status(400).send({ error: "malformed id" });
    }
    case "ValidationError": {
      return response.status(400).send({ error: "validation error" });
    }
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`
  );
});
