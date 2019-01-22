const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require("connect-flash");
const path = require('path');
const session  = require("express-session");
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');


// Define Routes ...................................................
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body-Parser initialization.......................
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Method OverRide Middleware...........................
app.use(methodOverride('_method'))

// Static file directory..............
// it sets the public folder to express static folder
app.use(express.static(path.join(__dirname,'public')));


// express-session configured............
app.use(session({
  secret: 'sagar',
  resave: true,
  saveUninitialized: true,
}))

// Passport session middleware..................
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Declaring global variable .............
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

mongoose.Promise = global.Promise;


// DB config
const db = require('./config/database');
// Declare Database..
mongoose.connect(db.mongoURI, {useNewUrlParser: true}).then(() => {
  console.log('MongoDB Connected')
}).catch((err) => console.log(err));


// Home Route.....
app.get("/", (req, res)=>{
  const title = "Welcome"
  res.render('index');
});

// About Route .....
app.get("/about", (req,res)=>{
  res.render('about');
})




app.use('/ideas', ideas);
app.use('/users', users);


app.listen(process.env.PORT || 3000, ()=>{
  console.log("At port 3000")
})