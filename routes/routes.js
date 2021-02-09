'use strict';

const express = require('express');

// import middleware
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser }  = require('../middleware/auth-user');

// Get references to our models.
const { User, 
        Course } = require('../models');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users. IF AND ONLY IF request is succesfully authenticated
router.get('/users', authenticateUser,  asyncHandler(async(req, res) => {
  try {
    const user = req.currentUser;
    
    res.status(200)
      .json({ 
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        id: user.id
    });
  
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || 
        error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
      
      res.status(400)
        .json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  
  try {
    await User.create(req.body);
    res.location('/')
    .status(201)
    .end();
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || 
        error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400)
      .json({ errors });   
    } else {
      throw error;
    }
  }
}));

// A /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.

// Main route for page load and search query
// A GET route that retrieves the list of courses.

router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { 
      exclude: [
        'createdAt', 
        'updatedAt', 
        'userId'
      ]},
    include: [{
      model: User,
      attributes: {
        exclude: [
          'createdAt', 
          'updatedAt', 
          'password'
        ]
      }
    }]
  });

  res.status(200)
    .json({
    courses
  });
}));

// A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.

router.get('/courses/:id', asyncHandler(async (req, res) => {
  const courses = await Course.findByPk( req.params.id , {
    attributes: { 
      exclude: [
        'createdAt', 
        'updatedAt', 
        'userId'
        ]
      },
    include: [
      {
      model: User,
      attributes: { 
        exclude: [
          'createdAt', 
          'updatedAt', 
          'password'
        ]
      }
    }]
  });

  res.status(200).json({
    courses
  });
}));


  // A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
 
router.post('/courses',  authenticateUser, asyncHandler(async (req, res) => {
  try {
    const course = await Course.create(req.body);
    
    res.location(`/courses/${course.id}`)
        .status(201)
        .end();
    } catch (error) {
      console.log('ERROR: ', error.name);
  
      if ( error.name === 'SequelizeValidationError' || 
           error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        
        res.status(400)
        .json({ errors });   
      } else {
        throw error;
      }
    }
}));

// A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.
router.put('/courses/:id', authenticateUser, asyncHandler( async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  try {
     if (course) {
        
        if(req.currentUser.id === course.userId) {
           await course.update(req.body);
           res.status(204)
            .end();
        } else {
           res.status(403)
            .json({
              message: "You shall not pass! Access prohibited --Forbidden"
             })
        }
     } else {
        res.status(404)
          .json({
           message: "That course is not in our database"
          })
     }
  } catch(error) {
     if (error.name === 'SequelizeValidationError' || 
        error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
     } else {
        throw error;
     }
  }

}));



// A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.



router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if (req.currentUser.id == course.userId) {
      await course.destroy();
      res.status(204).send();
    } else {
      res.status(403).json({ Forbidden: "Unauthorized User" });
    }
  } else {
    res.status(404).send();
  }
}));








module.exports = router;

