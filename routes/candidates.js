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
            res.render('candidates/new', { election: foundElection, title: 'New Candidate'});
       }
    });    
});
      
//CREATE POST ROUTE
router.post('/', (req, res) => {
    Election.findById(req.params.id, (err, foundElection) => {
       if(err) {
           console.log(err);
       } else { 
           Candidate.create({name: req.body.name, position: req.body.position, votes: 0}, (err, candidate) => {
               if(err) {
                   console.log(err);
               } else {
                    candidate.election = req.params.id;
                    candidate.save();
                    foundElection.candidates.push(candidate);
                    foundElection.save();
                    res.redirect('/elections/' + foundElection._id);  
               }
           });
       }
    });       
});

module.exports = router;