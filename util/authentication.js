
function createUserSession(req, user, action){
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;
    req.session.save(action); //executes action once the session is saved
}

function destroyUserAuthSession(req, user, action){
    req.session.uid = null;
    // req.session.save(); //express does this automatically when we don't have any action to be performed
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession,
}