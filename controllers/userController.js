const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register page load
const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.status(500).render('error', { message: 'An error occurred while loading the registration page.' });
        }
    }
}

// Register user
const register = async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/'+req.file.filename,
            password: passwordHash
        });

        await user.save();
        res.render('register', {message: 'User registered successfully!'});
    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.render('register', { message: 'Registration failed. Please try again.' });
        }
    }
}

// Load login page
const loadLogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.status(500).render('error', { message: 'An error occurred while loading the login page.' });
        }
    }
}

// Handle login
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.render('login', { message: 'Please enter both email and password.' });
        }

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user = userData;
                return res.redirect('/dashboard');
            } else {
                return res.render('login', { message: 'Invalid email or password!' });
            }
        } else {
            return res.render('login', { message: 'Invalid email or password!' });
        }
    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.render('login', { message: 'Login failed. Please try again.' });
        }
    }
}

// Handle logout
const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err.message);
                return res.status(500).render('error', { message: 'Logout failed. Please try again.' });
            }
            res.redirect('/');
        });
    } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
            res.status(500).render('error', { message: 'Logout failed. Please try again.' });
        }
    }
}

// Load dashboard
const loadDashboard = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            console.log('User not logged in, redirecting to /');
            return res.status(400).render('error', { message: 'You must be logged in to access the dashboard.' });
        }

        const users = await User.find({ _id: { $nin: [req.session.user._id] } });
        console.log('Users found:', users);
        return res.render('dashboard', { user: req.session.user, users: users });
    } catch (error) {
        console.log('Error in loadDashboard:', error.message);
        if (!res.headersSent) {
            console.log('Rendering error page');
            return res.status(500).render('error', { message: 'An error occurred while loading the dashboard.' });
        }
    }
};



module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard
}
