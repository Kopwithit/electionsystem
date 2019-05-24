const express   = require('express'),
      router    = express.Router({mergeParams: true}),
      Election  = require('../models/election'),
      Candidate = require('../models/candidate');
      
//NEW ROUTE
router.get('/new', (req, res) => {
    Election.findById(req.params.id, (err, foundElection) => {
       if(err) {
           console.log(err);
       } else { 
            res.render('positions/new', { election: foundElection, title: 'New Position'});
       }
    });    
});
      
//CREATE POST ROUTE
router.post('/', (req, res) => {
    Election.findById(req.params.id, (err, foundElection) => {
       if (err) {
            console.log(err);   
       } else {
           foundElection.positions.push(req.body.position);
           foundElection.save();
           res.redirect('/elections/' + foundElection._id);
       }
    });     
});

module.exports = router;