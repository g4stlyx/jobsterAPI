const mongoose = require("mongoose");
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email adress",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6,
  },
  lastName:{
    type: String,
    trim:true,
    maxLength: 20,
    default:" ",
  },
  location:{
    type: String,
    trim:true,
    maxLength: 20,
    default:" ",
  }
});

// hashing passwords
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcyrpt.genSalt(10);
  this.password = await bcyrpt.hash(this.password, salt);
});

// create JWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

// compare password
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcyrpt.compare(candidatePassword,this.password)
    return isMatch
}

module.exports = mongoose.model("User", UserSchema);
