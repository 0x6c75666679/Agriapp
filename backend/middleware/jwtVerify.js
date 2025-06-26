const jwt = require('jsonwebtoken');
require('dotenv').config()


const verify = async (req , res , next ) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)

    if(!authHeader){
        return res.status(403).json({message : "Some phishy wrong here"});
    }

    try {
        
        const decode = jwt.verify(authHeader , process.env.JWT);
        console.log(decode.id)
        req.user = { id: decode.id , email: decode.email };
        return next();

    }catch(err){
        return res.status(500).json({ message : "Internal server error"})
    }
}

module.exports = {
    verify
}