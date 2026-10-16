const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup');
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error logging out. Please try again.');
            return res.redirect('/listings');
        }
        req.flash('success', 'You have been logged out!');
        res.redirect('/listings');
    });
}; 

module.exports.signup = async (req, res) => {
   try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            console.error(err);
            req.flash('error', 'Error logging in after signup. Please try logging in manually.');
            return res.redirect('/login');
        }
        req.flash('success', 'Welcome to Wanderlust!');
        return res.redirect('/listings');
    });
   } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
   }
}