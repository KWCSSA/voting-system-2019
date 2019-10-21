const AudienceHelper = require('../utils/AudienceHelper');

module.exports = (app, drawObj) => {
	app.get('/draw', (req, res) => {
		res.render('draw');
	});

	app.get('/draw/state', (req, res) => {
		res.send({ state: drawObj.state });
	});

	app.get('/draw/result', (req, res) => {
		res.send({ winner: drawObj.winner });
	});
};
