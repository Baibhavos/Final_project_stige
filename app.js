const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const dotenv = require("dotenv");
// const multer = require('multer');

dotenv.config();

const app = express();


app.use(express.static('public'));
//app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


app.set('view engine', 'ejs');


const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connected to DB'))
    .catch((err) => console.log(err));
//console.log('Started');


app.listen(3000);

app.get('*', checkUser);
app.get('/', (req,res) =>{
    res.render('home');
});

app.get('/signup', (req, res) =>{
    res.render('signup');
});

app.get('/login', (req, res) =>{
    res.render('login');
})

app.get('/course',  requireAuth, (req, res) =>{
    res.render('course');
})

app.get('/profile', (req, res) =>{
    res.render('profile');
})

app.get('/notes', (req, res) =>{
    res.render('notes');
})


//Image
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null,path.join('/images'));
//     },
//     filename: function(req, file, cb){
//         const name = Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
// });

// const upload = multer({storage: storage});

app.use(authRoutes);
