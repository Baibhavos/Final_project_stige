const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { image: '', email: '', fname: '', lname: '', phoneno: '', password: '' };

  //Incorrect Email
  if(err.message === 'incorrect email') {
    errors.email = 'The email is not registered';
  }

  //Incorrect password
  if(err.message === 'incorrect password') {
    errors.password = 'Incorrect Password';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge,
  });
}

module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const {image, email, fname, lname, phoneno, password} = req.body;

    try{
        const user = await User.create({image, email, fname, lname, phoneno, password});
        // const user = await new User({
        //   image: req.body.image,
        //   email: req.body.email,
        //   fname: req.body.fname,
        //   lname: req.body.lname,
        //   phoneno: req.body.phoneno,
        //   password: req.body.password
        // })
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
        //console.log(err);
    } 
}


module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
    res.status(200).json({user: user._id});
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.profile_post = async (req, res) =>{
  const {email, fname, lname, phoneno, password} = req.body;

  try {
    User.findByIdAndUpdate({ _id: req.body.user_id}, {
      $set:{
        email: req.body.email,
        fname:req.body.fname,
        lname:req.body.lname,
        phoneno: req.body.phoneno
      }
    })
  }catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}