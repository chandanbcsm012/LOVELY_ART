const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, "LOVER");
        req.userData =  decode;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth faield"
        })
    }
}