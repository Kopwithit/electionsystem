const express           = require('express'),
      router            = express.Router(),
      MessagingResponse = require('twilio').twiml.MessagingResponse,
      Election          = require('../models/election'),
      Candidate         = require('../models/candidate');
      
let votingUsers = [];

//CREATE POST ROUTE
router.post('/', (req, res) => {
    const twiml = new MessagingResponse();
    let find = votingUsers.find((element) => {
       return element.number == req.body.From;
    });
    //Determins if number is voting
    if (find) {
        let user = votingUsers.find((element) => {
            if(element.number == req.body.From) {
                return element;
            }
        });
        if (user.position != null) {
            Election.findById(user.election).populate('candidates').exec((err, foundElection) => {
                if (err) {
                    console.log(err);
                } else {
                    let currentCandidates = []
                    foundElection.candidates.find((element) => {
                        if (element.position == user.position) {
                            currentCandidates.push({name: element.name, id: element._id })
                        }  
                    });
                    //First candidate entry
                    if (!user.voting) { 
                        twiml.message('Reply with number for vote for ' + user.position + ': ' + formatOptions(currentCandidates, user));  
                        res.writeHead(200, { 'Content-Type': 'text/xml' });
                        res.end(twiml.toString());                          
                        user.voting = true;
                        findAndUpdate(user);
                    } else {
                        const receivedText = req.body.Body;
                        //Checks for valid response
                        if (isNaN(receivedText) || parseInt(receivedText) > currentCandidates.length || parseInt(receivedText) < 1) {
                            twiml.message('Incorrect input!'); 
                            res.writeHead(200, { 'Content-Type': 'text/xml' });
                            res.end(twiml.toString());                              
                        } else {
                            Candidate.findOneAndUpdate(
                                { _id: currentCandidates[parseInt(receivedText) - 1].id}, 
                                { $inc: { votes: 1 } }, 
                                (err, foundCandidate) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    if (user.current == user.total) {
                                        twiml.message('Thanks for voting!');
                                        foundElection.voters.push(user.number);
                                        foundElection.save();
                                        findAndRemove(user);
                                    } else {
                                        user.current += 1;
                                        user.position = foundElection.positions[user.current];
                                        currentCandidates = [];
                                        foundElection.candidates.find((element) => {
                                            if (element.position == user.position) {
                                                currentCandidates.push({name: element.name, id: element._id });
                                            }  
                                        });                                        
                                        twiml.message('Reply with number for vote for ' + user.position + ': ' + formatOptions(currentCandidates, user)); 
                                        findAndUpdate(user);
                                    }
                                    res.writeHead(200, { 'Content-Type': 'text/xml' });
                                    res.end(twiml.toString());                                      
                                }
                            });
                        }
                    }
                }
            });                
        }
    } else if (req.body.Body.charAt() == '@') {
            let code = req.body.Body.slice(1);
            Election.findOne({ code: code }).populate('candidates').exec((err, foundElection) => {
               if (err) {
                   console.log(err);
                } else {
                    //Checks for existing election
                    if(foundElection == null) {
                        twiml.message('Unknown election code! Visit http://elections.maxkopitz.com:8080/elections to find valid election code :)');
                        res.writeHead(200, { 'Content-Type': 'text/xml' });
                        res.end(twiml.toString());                          
                    }
                    else {
                        let from = req.body.From;
                        let alreadyVoted = false;
                        alreadyVoted = foundElection.voters.find((element) => {
                            if (element == from) {
                                return true;
                            }
                        });
                        if (alreadyVoted) {
                            twiml.message('You have already voted!');
                        } else {
                            twiml.message('Voting in the ' + foundElection.name + ' election! Reply when ready.');
                            votingUsers.push({
                                number: req.body.From,
                                election: foundElection._id,
                                position: foundElection.positions[0],
                                current: 0,
                                total: foundElection.positions.length - 1,
                                voting: false
                            });
                        }
                        res.writeHead(200, { 'Content-Type': 'text/xml' });
                        res.end(twiml.toString());                          
                    }
            }
        });            
    } else {
        twiml.message('Please enter an election! @[CODE]');
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());          
    }
});

function findAndUpdate(user) {
    votingUsers.forEach((element) => {
       if(element.number == user.number) {
           element = user;
       } 
    });
}
function findAndRemove(user) {
    votingUsers.forEach((element) => {
       if (element.number == user.number) {
           votingUsers.splice(votingUsers.indexOf(element));
       } 
    });
}
function formatOptions(candidates, user) {
    let formated = '';
    let i = 1;
    candidates.forEach((element) => {
        formated += '('+ i + ' - ' + element.name + ') ';
        i++;
    });
    return formated;
}

module.exports = router;