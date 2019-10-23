const AudienceHelper = require('../utils/AudienceHelper');
const CandidateHelper = require('../utils/CandidateHelper');

module.exports = (app, drawObj, Match) => {
	app.get('/admin', (req, res) => {
		res.render('admin');
	});

	app.get('/admin/register', (req, res) => {
		res.render('register');
	});

	app.put('/admin/register', async (req, res) => {
		var { number } = req.body;
		var result = await AudienceHelper.newAudience(number);
		res.send(result);
	});

	app.post('/admin/draw/start', async (req, res) => {
		drawObj.state = 1;
		drawObj.winner = await AudienceHelper.getRandomAudience();
		res.status(200).end();
	});

	app.post('/admin/draw/end', (req, res) => {
		drawObj.state = 0;
		res.status(200).end();
	});

	app.put('/admin/candidate', async (req, res) => {
		var { id, name } = req.body;
		var result = await CandidateHelper.newCandidate(id, name);
		res.send(result);
	});

	app.post('/admin/candidate/addvote', async (req, res) => {
		var id = Number(req.body.id);
		var votes = Number(req.body.votes);
		var result = await CandidateHelper.addVote(votes, id, 'admin');
		res.send(result);
	});

	app.post('/admin/candidate/setvote', async (req, res) => {
		var id = Number(req.body.id);
		var votes = Number(req.body.votes);
		var result = await CandidateHelper.setVote(votes, id, 'admin');
		res.send(result);
	});

	app.post('/admin/candidate/setdisplay', async (req, res) => {
		if (req.body.candidates === '') {
			await Match.setCandidatesToDisplay([]);
		} else {
			await Match.setCandidatesToDisplay(req.body['candidates[]']);
		}
		res.send(Match.getCandidatesToDisplay());
	});

	app.post('/admin/match/start', async (req, res) => {
		Match.setCurrentCandidate(req.body.candidate);
		Match.startVoting();
		res.send({ state: Match.getState() });
	});

	app.post('/admin/match/end', async (req, res) => {
		Match.stopVoting();
		res.send({ state: Match.getState() });
	});
};
