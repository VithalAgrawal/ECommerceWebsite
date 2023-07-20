
function addCsrfToken(req, res, next){
    res.locals.csrfToken = req.csrfToken(); //generates csrftoken and allows to set variable named csrftoken that is exposed to all views automatically with help of locals property
    next(); //once the middleware is executed, the request for which it was executed is able to reach the next middleware or route handler
}

module.exports = addCsrfToken;