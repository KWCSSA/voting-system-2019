const mongoose = require('mongoose');
const { Schema } = mongoose;
const candidateSchema = new Schema({
	id: Number,
	name: String,
	vote: Number
});

mongoose.model('candidate', candidateSchema);
