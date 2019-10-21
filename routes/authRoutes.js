module.exports = (app, passport) => {
	app.get('/login', (req, res) => {
		res.render('login');
	});

	app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
		res.redirect('/admin');
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/login');
	});
};
