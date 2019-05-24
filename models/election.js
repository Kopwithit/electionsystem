var mongoose = require('mongoose');

var ElectionSchema = new mongoose.Schema({
   name: String,
   code: String,
   created: {type: Date, default: Date.now },
   voters: [],
   owner: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
    candidates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'candidate'
        }
        ],   
    positions: [String]
});

module.exports = mongoose.model('election', ElectionSchema);
