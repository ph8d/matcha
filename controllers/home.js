exports.index = (req, res) => {
    console.log(req.user); // Just making sure that authentication actually works
    res.render('home');
};

exports.about = (req, res) => {
    res.render('about');
};