const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerLoad = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
}

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
    }
}

const loadLogin = async (req, res) => {
    try{
        res.render('login');
    }
    catch(error){
        console.log(error.message);
    }
}

const login = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email: email});
        if (userData){
            console.log("Received password during login:", password); // Debugging log
            console.log("Stored hashed password:", userData.password);
            const passwordMatch = bcrypt.compare(password, userData.password);
            if (passwordMatch){
                req.session.user = userData;
                res.redirect('/dashboard');
            } else{
                res.render('login', {message: 'Invalid email or password!'});
            }
        } else{
            res.render('login', {message: 'Invalid email or password!'});
        }
    }
    catch(error){
        console.log(error.message);
        res.render('login', { message: 'Login failed. Please try again.' });
    }
}

const logout = async (req, res) => {
    try{
        req.session.destroy();
        res.redirect('/');
    }
    catch(error){
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try{
        res.render('dashboard', {user: req.session.user});
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard
}