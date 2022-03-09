//Authentization middleware

 const debug = require('debug')('books:auth');
 const { User } = require('../models');
 
 // Basic Authentication
  
 const basic = async (req, res, next) => {
     debug("Hello from auth.basic!");
 
     // make sure Authorization header exists
     if (!req.headers.authorization) {
         debug("Authorization header missing");
 
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization required',
         });
     }
 
     debug("Authorization header: %o", req.headers.authorization);
 

     const [authSchema, base64Payload] = req.headers.authorization.split(' ');
 
     // if authSchema !== basic, then out
     if (authSchema.toLowerCase() !== "basic") {
         debug("Authorization schema isn't basic");
 
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization required',
         });
     }
 
     // decode payload from base64
     const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii');
     // decodedPayload = "username:password"
 
     // split decoded payload into "<username>:<password>"
     const [username, password] = decodedPayload.split(':');
 
     // check if a user with this username and password exists
     const user = await new User({ username, password }).fetch({ require: false });
     if (!user) {
         return res.status(401).send({
             status: 'fail',
             data: 'Authorization failed',
         });
     }
 
     // attach the user to request
     req.user = user;
 
     // pass on (Request)
     next();
 }
 
 module.exports = {
     basic,
 }
 