'use strict';

// Middleware to authenticate the request using Basic Authentication.
const auth = require('basic-auth');
//importing library to user compareSync() from bcrypt
const bcrypt = require('bcrypt');
//importing the User model module 
const { User } = require('../db')



//exports authenticateUser aysnc function
exports.authenticateUser = async (req, res, next) => {
    //store error messages form else clauses
    let message; 

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    
   
    // If the user's credentials are available...
    if(credentials){
        // Attempt to retrieve the user from the data store
       const user = await User.findOne({
           where: { username: credentials.name}
       });
       
       //if data is retrieved from user(user doesn't return undefined), store the comparison of ... 
       if(user){
            const authenticated = bcrypt.compareSync(credentials.pass//stored in Authorization header
            , user.confirmedPassword)//stored in the user model
            if(authenticated){
                //if passwords match
                console.log('Authentication successful');

                //store the user on the Request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for username: ${user.username}`
            }
       } else {
           message = `User not found for ${credentials.name}`
       }

    } else {message = 'Auth header not found';
    }
    
    
  
    // If user authentication failed...
       // Return a response with a 401 Unauthorized HTTP status code.
    
    
    //if message variable has a message stored
    if(message){
        console.warn(message);
        res.status(401).json({
            message: 'Access Denied'
        })//intentionally vague and not returning specifics about password or username, etc
    } else{
        next();
    }



  };

