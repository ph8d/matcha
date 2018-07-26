exports.index = (req, res) => {
    res.render('home');
};

exports.about = (req, res) => {
    console.log(req.user); // Just making sure that authentication actually works
    res.render('about');
};