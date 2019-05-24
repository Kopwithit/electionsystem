var mongoose = require('mongoose');

var CandidateSchema = new mongoose.Schema({
   name: String,
   position: String,
   votes: Number,
   election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election"
   }
});

module.exports = mongoose.model('candidate', CandidateSchema);