'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');

const { models } = require('../db');

// Get references to our models.
const { User, Course } = models;


// const { User, Course} = require('../db');
// const model = require('../db');


//for protected routes, importing the auth-user middleware
const { authenticateUser }  = require('../middleware/auth-user');




const { sequelize } = require('../db');





// Construct a router instance.
const router = express.Router();

// Route that returns a list of users. IF AND ONLY IF request is succesfully authenticated
router.get('/users', authenticateUser,  asyncHandler(async(req, res) => {
  const user = req.currentUser;

  res.json({
    name: user.name,
    username: user.username
  })

}));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));


// A /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code.
// Main route for page load and search query
router.get('/courses', asyncHandler(async (req, res) => {
  
    const courses = await Course.findAll({
      include: [
        {
          model: User, //associates the Course model with the User model
          as: 'Course Attending',
        },
      ],
    });

    const resultCourses = courses.map( movie => movie.get({plain: true}));

    const users = await User.findAll({
      include: [
        {
          model: Course,
          as: 'Course Attending',
        },
      ],
    });

    resultUsers = JSON.stringify(users, null, 2);

    res.json({resultCourses}, {resultUsers});
    process.exit();

  } ))
  
  









// A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code.

// A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.

// A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.

// A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.











module.exports = router;