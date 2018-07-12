const express = require('express');
const router = express.Router();

// Displaying the registration page
router.get('/register', function (req, res) {
    res.render('register', {title: 'Register'});
});

// Form validation and actual registration
router.post('/register', function(req, res) {

});

module.exports = router;