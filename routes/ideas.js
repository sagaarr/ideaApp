const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema Models..
require('../models/idea');
const Idea = mongoose.model('Ideas')

// list all ideas ....
router.get('/', (req, res) => {
  Idea.find({})
  .sort({date:'descending'})
  .then((ideas) => {
    res.render('ideas/show', {ideas:ideas});
  })
})


// Add Ideas Form render form...................
router.get('/add', (req,res)=> {
  res.render('ideas/add');
})

// Edit Form .....................
router.get('/edit/:id' , (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then((idea) => {
    res.render('ideas/edit', {idea:idea});
  })
 
})

//  Post req. to save the idea to the dataBase  from (/ideas/add form)
router.post('/', (req,res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text:"Please put some title"});
  }
  if(!req.body.details){
    errors.push({text:"Please put some details"});
  }

  if(errors.length > 0){
        res.render('ideas/add',{
          errors:errors,
          //  Here we got the title and details that user filled before we are sending them back to the user.
          title:req.body.title,
          details:req.body.details
          });
  }else{
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    // Create a model from existing model from the schema that we defined.
    new Idea(newUser)
    //save the user using promises ie; using .save() method 
      .save()
      // here .then contains the data that is saved and send back from the mongodb
      .then((idea) => {
        // check if you like console.log(idea)
        console.log(idea);
        // redirect to show the saved ideas
        req.flash('success_msg', "idea Added")
        res.redirect('/ideas')
      })
  }
})

// Edit form process ...
router.put("/:id" , (req,res) => {
  Idea.findOne({
    _id:req.params.id
  }).then((idea) => {
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        req.flash('success_msg', "idea Updated")
        res.redirect('/ideas')
      });
  });
});

router.delete('/:id', (req, res) => {
  Idea.findByIdAndDelete({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', "idea Successfully Removed");
    res.redirect('/ideas')
  })
})


module.exports = router;