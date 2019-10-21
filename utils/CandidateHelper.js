const mongoose = require('mongoose');

const CandidateModel = mongoose.model('candidate');
const { sysLogger } = require('../utils/Logger');

module.exports.newCandidate = async (id, name) => {
	var count = await CandidateModel.countDocuments({ id });
	if (count > 0) {
		sysLogger.log('error', `Trying to add new candidate: ${id} ${name}, but already exist in database`);
		return { error: 'Error: Candidate already exist' };
	}
	var candidate = new CandidateModel({ id, name, vote: 0 });
	sysLogger.log('info', `New candidate added: ${id} ${name}`);
	return { error: null, audience: await candidate.save() };
};

module.exports.addVote = async (voteCount, candidateID, source) => {
	var candidate = await CandidateModel.findOne({ id: candidateID });
	sysLogger.log('info', `Candidate ${candidate.id} ${candidate.name} added ${voteCount} votes, from source: ${source}`);
	candidate.vote += voteCount;
	return await candidate.save();
};

module.exports.setVote = async (voteCount, candidateID) => {
	var candidate = await CandidateModel.findOne({ id: candidateID });
	sysLogger.log(
		'info',
		`Candidate ${candidate.id} ${candidate.name} vote updated to ${voteCount} votes, from source: admin`
	);
	candidate.vote = voteCount;
	return await candidate.save();
};

module.exports.getAllCandidates = async () => {
	var candidates = await CandidateModel.find({});
	return candidates;
};
