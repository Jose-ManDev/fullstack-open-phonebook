"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const person_1 = __importDefault(require("./models/person"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("./frontend"));
app.use((0, morgan_1.default)(function (tokens, req, res) {
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
    person_1.default.find({}).then((persons) => {
        response.json(persons);
    });
});
app.get("/api/persons/:id", (request, response, next) => {
    person_1.default.findById(request.params.id)
        .then((person) => {
        response.json(person);
    })
        .catch((error) => {
        console.error(error);
        next(error);
    });
});
app.delete("/api/persons/:id", (request, response, next) => {
    person_1.default.findByIdAndDelete(request.params.id)
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
    const person = new person_1.default({
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
    const person = {
        name: body.name,
        phone: body.phone,
    };
    person_1.default.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((person) => {
        response.json(person);
    })
        .catch((error) => {
        console.error(error);
        next(error);
    });
});
app.get("/info/", (request, response, next) => {
    person_1.default.count()
        .then((result) => {
        response.send(`<div><p>Phonebook has info for ${result} people</p><p>${new Date()}</p></div>`);
    })
        .catch((error) => {
        console.error(error);
        next(error);
    });
});
app.use((request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
});
const errorHandler = (error, request, response, next) => {
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
    console.log(`[\x1b[36m server\x1b[0m ]: Server is running at\x1b[32m http://localhost:${PORT} \x1b[0m`);
});
