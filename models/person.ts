import { Schema, model, connect, set } from "mongoose";

const url = process.env.MONGODB_URI as string;

set("strictQuery", false);
console.log("Connecting to", url);

connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

interface Person {
  name: string;
  phone: string;
}

const personSchema = new Schema<Person>({
  name: { type: String, required: true, minlength: 3 },
  phone: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v: string) {
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

const Person = model<Person>("Person", personSchema);

export default Person;
