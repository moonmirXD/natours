const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlenth: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a confirm password'],
    minlenth: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'The passwords must match!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
