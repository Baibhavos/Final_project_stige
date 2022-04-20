const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // image: {
    //   type: String,
    //   required: [true, 'Please upload your profile pic']
    // },
    email: {
        type: String,
        required: [true, 'Please enter an email:'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email:']
    },
    fname: {
        type: String,
        required: [true, 'Please enter your first name:'],
    },
    lname: {
        type: String,
        required: [true, 'Please enter your last name:'],
    },
    phoneno: {
        type: Number,
        required: [true, 'Please enter your Phone number:'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password:'],
        minlength: [6, 'Minimun password length must be 6 characters.']
    }
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post('save', function(doc, next) {
    console.log('New user created and saved', doc);
    next();
});

//static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};


const User = mongoose.model('user', userSchema);
module.exports = User;