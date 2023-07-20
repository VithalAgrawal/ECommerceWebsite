const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validationUtil = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            // errorMessage: '',
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        };
    }

    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {

    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city
    };

    //validate user input
    if (
        !validationUtil.userDetailsAreValid(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal, req.body.city)
        || !validationUtil.emailIsConfirmed(req.body.email, req.body['confirm-email'])
    ) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage: 'Invalid input! Please check your input and try again.',
                ...enteredData
            },
            function () {
                res.redirect('/signup');
            });
        return;
    }

    const user = new User(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal, req.body.city);

    try { //errors in asynchronous functions need to be handled with try/catch
        //check if user already exists
        const existsAlready = await user.existsAlready();
        if (existsAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage: 'User already exists! Please login instead.',
                    ...enteredData
                },
                function () {
                    res.redirect('/signup');
                }
            )
            return;
        }
        await user.signup();
    } catch (error) {
        next(error); // Pass error to default error handling middleware
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: '',
        };
    }

    res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password);

    let existingUser;

    try { //errors in asynchronous functions need to be handled with try/catch
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        next(error); // Pass error to default error handling middleware
        return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid Credentials! Please check your credentials. If user does not exist, sign up instead.',
        email: user.email,
        password: user.password
    };

    if (!existingUser) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                res.redirect('/login');
            }
        )
        return;
    }

    let passwordIsCorrect;

    try { //errors in asynchronous functions need to be handled with try/catch
        passwordIsCorrect = await user.hasSamePassword(existingUser.password);
    } catch (error) {
        next(error); // Pass error to default error handling middleware
        return;
    }

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(
            req,
            sessionErrorData,
            function () {
                res.redirect('/login');
            }
        )
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout,
}