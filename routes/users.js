const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const passport = require('passport');
const router = express.Router();

// user model 
require('../models/Users');
const User = mongoose.model('Users');


router.get('/login', (req,res)=> {
  res.render('users/login');
})

router.get('/register', (req, res)=>{
  res.render('users/register');
})

router.post('/register', (req,res) =>{
  let errors = [];
  if(req.body.password1 !== req.body.password2){
    errors.push({text:"password do not match !!"});
  }
  if(req.body.password1.length < 4){
    errors.push({text: "Password must be at least 4 characters long"})
  }
  if(errors.length > 0){
    res.render('users/register', {
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      password1:req.body.password1,
      password2: req.body.password2
    });
  }else{
    User.findOne({email:req.body.email})
      .then((user) => {
        if(user){
          req.flash('error_msg', 'Email already registered !!');
          res.redirect('/users/login');
        }else{
          let newUser = new User({
            name: req.body.name,
            email:req.body.email,
            password:req.body.password1
          })
          bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) =>{
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then((user) => {
                  req.flash('success_msg', 'You are now register and can login !!');
                  res.redirect('/users/login');
                }).catch((err) => {
                  console.log(err);
                  return;
                })
            });
          })
        }
      })
   
  }
});

module.exports = router;