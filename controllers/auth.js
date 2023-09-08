const User = require("../models/User");
const { BadRequestError, UnauthorizedError } = require("../errors/index");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(201).json({
      user: {
        email: user.email,
        lastName: user.lastName,
        name: user.name,
        location: user.location,
        token,
      },
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = user.createJWT();
  res.status(200).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      location: user.location,
      token,
    }});
}

  const updateUser = async (req, res) => {
    const {email,name,lastName,location} = req.body
    if (!email ||!name ||!lastName ||!location) {
      throw new BadRequestError("Please provide email, name, lastName and location");
    }

    const user = await User.findOne({_id:req.user.userId});
    user.email = email;
    user.name = name;
    user.lastName = lastName;
    user.location = location;

    await user.save();
    const token = user.createJWT();

    res.status(200).json({user:{
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      location: user.location,
      token
    }});
  }

module.exports = {
  register,
  login,
  updateUser
};
