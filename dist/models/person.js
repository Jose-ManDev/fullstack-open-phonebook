"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const url = process.env.MONGODB_URI;
(0, mongoose_1.set)("strictQuery", false);
console.log("Connecting to", url);
(0, mongoose_1.connect)(url)
    .then((result) => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.log("Error connecting to MongoDB", error);
});
const personSchema = new mongoose_1.Schema({
    name: { type: String, required: true, minlength: 3 },
    phone: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
        },
    },
});
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Person = (0, mongoose_1.model)("Person", personSchema);
exports.default = Person;
