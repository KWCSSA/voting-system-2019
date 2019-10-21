const mongoose = require('mongoose');

const VoteModel = mongoose.model('vote');
const AudienceHelper = require('./AudienceHelper');
const CandidateHelper = require('./CandidateHelper');
const TwilioHelper = require('./TwilioHelper');
const { sysLogger } = require('../utils/Logger');

module.exports.handleNewVote = async (from, timestamp, Match) => {
	var targetCandidateID = Number(Match.getCurrentCandidate().split('-')[0]);
	if (Match.getState() === 1) {
		if (!await AudienceHelper.checkAudienceExist(from)) {
			return { error: 'Error: Audience does not exist' };
		}
		if (await AudienceHelper.checkVoteExist(from, targetCandidateID)) {
			sysLogger.log('error', `Audience ${from} voted more than once to Candidate ${targetCandidateID}, vote dropped`);
		} else {
			var vote = new VoteModel({ from, to: Match.getCurrentCandidate(), timestamp });
			await AudienceHelper.addVote(from, targetCandidateID);
			sysLogger.log('info', `Audience ${from} voted for ${targetCandidateID}`);
			await CandidateHelper.addVote(1, targetCandidateID, 'audience');
			await vote.save();
			await TwilioHelper.sendMessage(from, `You have voted on candidate ${targetCandidateID}`);
		}
		return { error: null };
	} else {
		sysLogger.error(
			`Audience ${from} attempted to vote for candidate ${targetCandidateID || ''} while voting is not open`
		);
		TwilioHelper.sendMessage(from, `Voting is not open right now`);
	}
};
