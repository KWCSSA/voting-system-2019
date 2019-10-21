const mongoose = require('mongoose');

const AudienceModel = mongoose.model('audience');
const { sysLogger } = require('../utils/Logger');
const TwilioHelper = require('./TwilioHelper');

module.exports.newAudience = async number => {
	var count = await AudienceModel.countDocuments({ number });
	if (count > 0) {
		sysLogger.log('error', `Trying to register phone number: ${number}, but already exist in database`);
		return { error: 'Error: Audience already exist' };
	}
	var audience = new AudienceModel({ number, votes: [] });
	sysLogger.log('info', `New phone number registered: ${number}`);
	var msgResult = await TwilioHelper.sendMessage(
		number,
		'Your phone number is registered for an upcoming KWCSSA Event'
	);
	return { error: msgResult.error, audience: await audience.save() };
};

module.exports.addVote = async (number, candidateID) => {
	var audience = await AudienceModel.findOne({ number });
	audience.votes.push(candidateID);
	audience.save();
};

module.exports.checkVoteExist = async (number, candidateID) => {
	var audience = await AudienceModel.findOne({ number });
	return audience.votes.includes(candidateID);
};

module.exports.checkAudienceExist = async number => {
	var count = await AudienceModel.countDocuments({ number });
	return count > 0;
};

module.exports.getRandomAudience = async () => {
	var audiences = await AudienceModel.find({});
	audiences = audiences.map(audience => audience.number);
	var winner = audiences[Math.floor(Math.random() * audiences.length)];
	sysLogger.log('info', `New prize winner drew: ${winner}`);
	return winner;
};
