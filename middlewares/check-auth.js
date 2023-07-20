
function checkAuthStatus(req, res, next){
    const uid = req.session.uid;
    if(!uid){ //user not logged in
        return next();
    } 
    
    res.locals.uid = uid;
    res.locals.isAuth = true;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = checkAuthStatus;