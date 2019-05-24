const express   = require('express'),
      router    = express.Router(),
      Election  = require('../models/election'),
      Candidate = require('../models/candidate');

//NEW ROUTE
router.get('/new', (req, res) => {
    res.render('elections/new', {title: 'New Election'});
});

//INDEX ROUTE
router.get('/', (req, res) => {
    Election.find({}, (err, allElections) => {
        if (err) {
            console.log(err);
        } else {
            res.render('elections/index', {elections: allElections, title: 'Elections'});     
        }
    })
});

//SHOW ROUTE
router.get('/:id', (req, res) => {
    Election.findById(req.params.id).populate('candidates').exec((err, foundElection) => {
        if(err) {
            console.log(err);
        } else {
            res.render('elections/show', {election: foundElection, title: foundElection.name});
        }
    });
});

//EDIT ROUTE
router.get('/:id/edit', (req, res) => {
    Election.findById(req.params.id).populate('candidates').exec((err, foundElection) => {
        if(err) {
            console.log(err);
        } else {
            res.render('elections/edit', {election: foundElection, title: foundElection.name + ' - Edit'});
        }
    });
});

//CREATE ROUTE
router.post('/', (req, res) => {
    let name = req.body.name;
    let code = req.body.code;
    let newElection = {
        name: name,
        code: code
    }
    Election.create(newElection, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/elections');
        }
    });
});

//UPDATE ROUTE
router.put('/:id', (req, res) => {
    let newData = { name: req.body.name, code: req.body.code };
    Election.findByIdAndUpdate(req.params.id, {$set: newData}, (err, foundElection) => {
       if(err) {
           console.log(err);
       } else {
           res.redirect('/elections/' + foundElection._id);
       }
    });
});

//DELETE ROUTE
router.delete('/:id', (req, res) => {
   Election.findByIdAndRemove(req.params.id, (err, election) => {
      if(err) {
          console.log(err);
      } else {
          res.redirect('/elections');
      }
   }); 
});

module.exports = router;