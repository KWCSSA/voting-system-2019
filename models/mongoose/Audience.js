const mongoose = require('mongoose');
const { Schema } = mongoose;
const audienceSchema = new Schema({
	number: String,
	votes: Array
});

mongoose.model('audience', audienceSchema);
