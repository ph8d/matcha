module.exports = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('danger', 'You must log in to access that page!');
		return res.redirect('/users/login');
	}
};