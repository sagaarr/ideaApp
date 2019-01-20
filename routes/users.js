const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();



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
    res.send("PASSED");
  }
});

module.exports = router;