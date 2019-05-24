const express           = require('express'),
      app               = express(),
      mongoose          = require('mongoose'),
      bodyParser        = require('body-parser'),
      Election          = require('./models/election'),
      Candidate         = require('./models/candidate'),
      methodOverRide    = require('method-override'),
      voteRoutes        = require('./routes/vote'),
      indexRoutes       = require('./routes/index'),
      candidatesRoutes  = require('./routes/candidates'),
      positionsRoutes   = require('./routes/positions'),
      electionRoutes    = require('./routes/elections');
/*
    SETUP
*/
mongoose.connect('mongodb://localhost/elections', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverRide("_method"));

/*
  ROUTES
*/
app.use('/', indexRoutes);
app.use('/elections/:id/candidates/', candidatesRoutes);
app.use('/elections/:id/positions/', positionsRoutes);
app.use('/elections/', electionRoutes);
app.use('/vote/', voteRoutes);

/*
  SERVER
*/
app.listen(8080, () => {
   console.log('Listening'); 
});