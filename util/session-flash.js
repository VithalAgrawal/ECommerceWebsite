
function getSessionData(req){
    const sessionData = req.session.flashData;

    req.session.flashData = null;  // Clear flash data

    return sessionData;
}

function flashDataToSession(req, data, action){
    req.session.flashData = data;
    req.session.save(action); 
}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
};