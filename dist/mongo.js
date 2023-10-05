"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const processParameters = process.argv.length;
if (processParameters < 3) {
    console.log("Give password as an argument");
    process.exit(1);
}
const password = process.argv[2];
const MONGO_URL = `mongodb+srv://josdev:${password}@cluster0.zczkxzx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;
(0, mongoose_1.set)("strictQuery", false);
(0, mongoose_1.connect)(MONGO_URL);
const personSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }
});
const Person = (0, mongoose_1.model)("Person", personSchema);
switch (processParameters) {
    case 3: {
        Person.find({}).then(result => {
            console.log(result);
            mongoose.connection.close();
        });
        break;
    }
    case 5: {
        const person = new Person({
            name: process.argv[3],
            phone: process.argv[4]
        });
        person.save().then(result => {
            console.log(`Added ${result.name}, number: ${result.phone} to the phonebook`);
            mongoose.connection.close();
        });
        break;
    }
    default: {
        console.log("Parameters are invalid");
    }
}
