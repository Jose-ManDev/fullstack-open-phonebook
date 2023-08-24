"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const persons_1 = require("./public/persons");
const generateId_1 = __importDefault(require("./utils/generateId"));
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let persons = persons_1.initialPersons;
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("./dist"));
app.use(morgan(function (tokens, req, res) {
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
    }
    else {
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
}));
app.get("/api/persons", (request, response) => {
    response.json(persons);
});
app.get("/api/persons/:id", (request, response) => {
    const ID = Number(request.params.id);
    const person = persons.find((person) => person.id === ID);
    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end("Person not found");
    }
});
app.get("/info", (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p></div>`);
});
app.delete("/api/persons/:id", (request, response) => {
    const ID = Number(request.params.id);
    persons = persons.filter((person) => person.id !== ID);
    response.status(204).end();
});
app.post("/api/persons", (request, response) => {
    const body = request.body;
    if (!body.name || !body.phone) {
        return response.status(400).json({
            error: "name or number are missing",
        });
    }
    if (persons.find((person) => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }
    const person = {
        id: (0, generateId_1.default)(),
        name: body.name,
        phone: body.phone,
    };
    persons = persons.concat(person);
    response.json(person);
});
app.listen(PORT, () => {
    console.log(`[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`);
});
