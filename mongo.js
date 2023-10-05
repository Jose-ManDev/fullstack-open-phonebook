"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose = require("mongoose");
var processParameters = process.argv.length;
if (processParameters < 3) {
    console.log("Give password as an argument");
    process.exit(1);
}
var password = process.argv[2];
var MONGO_URL = "mongodb+srv://josdev:".concat(password, "@cluster0.zczkxzx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp");
(0, mongoose_1.set)("strictQuery", false);
(0, mongoose_1.connect)(MONGO_URL);
var personSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true }
});
var Person = (0, mongoose_1.model)("Person", personSchema);
switch (processParameters) {
    case 3: {
        Person.find({}).then(function (result) {
            console.log(result);
            mongoose.connection.close();
        });
        break;
    }
    case 5: {
        var person = new Person({
            name: process.argv[3],
            phone: process.argv[4]
        });
        person.save().then(function (result) {
            console.log("Added ".concat(result.name, ", number: ").concat(result.phone, " to the phonebook"));
            mongoose.connection.close();
        });
        break;
    }
    default: {
        console.log("Parameters are invalid");
    }
}
