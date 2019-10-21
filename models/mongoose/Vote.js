const mongoose = require('mongoose');
const { Schema } = mongoose;
const voteSchema = new Schema({
	from: Number, // Audience phone number
	to: String, // Candidate
	timestamp: String
});

mongoose.model('vote', voteSchema);
