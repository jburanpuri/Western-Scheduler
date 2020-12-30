const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) { //get token
    token = req.header('x-auth-token');
    //check token
    if(!token){
        return res.status(401).json({ msg: 'Authorization denied' });
    }

    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        
        req.user = decoded.user;
        next();
    } 
    catch(err){ //if not valid error 401 
        res.status(401).json({ msg: 'Invalid token' })
    }
};