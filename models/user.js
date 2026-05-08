const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({});

//plugin adds username and password fields to the schema and also adds some methods to the schema for authentication

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);