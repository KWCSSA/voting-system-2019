const { sysLogger } = require('../../utils/Logger');

class SingleMatch {
	constructor() {
		this.currentCandidate = null;
		this.state = 0; //0 for idle, 1 for voting
		this.candidatesToDisplay = [];
	}

	setCurrentCandidate(candidate) {
		this.currentCandidate = candidate;
	}

	getCurrentCandidate() {
		return this.currentCandidate;
	}

	setCandidatesToDisplay(candidates) {
		console.log(candidates);
		this.candidatesToDisplay = candidates;
	}

	getCandidatesToDisplay() {
		return this.candidatesToDisplay;
	}

	startVoting() {
		sysLogger.log('info', `Voting started for Candidate ${this.currentCandidate}`);
		if (this.state !== 1) {
			this.state = 1;
		}
	}

	stopVoting() {
		sysLogger.log('info', `Voting stopped for Candidate ${this.currentCandidate}`);
		if (this.state === 1) {
			this.state = 0;
		}
	}

	getState() {
		return this.state;
	}
}

module.exports = SingleMatch;
