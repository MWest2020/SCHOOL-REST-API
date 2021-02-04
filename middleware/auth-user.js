'use strict';

// Middleware to authenticate the request using Basic Authentication.
const auth = require('basic-auth');
//importing library to use compareSync() from bcrypt
const bcrypt = require('bcrypt');

// Get references to our model.
const { User } = require('../models');

//exports authenticateUser async function
exports.authenticateUser = async (req, res, next) => {
    //store error messages form else clauses
    let message; 

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    
    // If the user's credentials are available...
    if(credentials){
        // Attempt to retrieve the user from the data store
       const user = await User.findOne({
           where: { 
               emailAddress: credentials.name
            }
       });
       
       //if data is retrieved from user(user doesn't return undefined), store the comparison of ... 
       if(user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password)//stored in the user model
            
            if(authenticated){
                //if passwords match
                console.log('Authentication successful');
                //store the user on the Request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`
            }
       } else {
           message = `User not found for ${credentials.name}`
       }

    } else {message = 'Auth header not found';
}
    
    //if message variable has a message stored - It will return warning message along with 401 status and the Access Denied message
    if(message){
        console.warn(message);
        res.status(401).json({
            message: 'Access Denied'
        })//intentionally vague and not returning specifics about password or username, etc
    } else{
        next();
    }
};