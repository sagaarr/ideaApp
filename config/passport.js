const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Load user model 
const User = mongoose.model('Users');

module.exports = function(passport){
  passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match the user
    User.findOne({
      email:email
    }).then((user) => {
      if(!user){
        //     done(error, user, message) Its a function
        return done(null, false, {message:"User not found"})
      }

      // Match the password
      //    .compare(password that was dcrypted at the beggining to the incrypted password obtainded by that Perticular user model [.then(user)])
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user)
        }else{
          return done(null, false, {message:"Password is not correct"})
        }
      })
    })
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}