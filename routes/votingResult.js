module.exports = (app, passport) => {
	app.get('/votes', (req, res) => {
		res.render('votes');
	});
};