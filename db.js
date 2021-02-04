//FOR FUTURE REFERENCE -- MAKE IT CONVENTION TO STORE MODELS LIKE THIS


// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.user = require('../models/user.js')(sequelize, Sequelize);
// db.course = require('../models/course.js')(sequelize, Sequelize);
// db.index = require('../models/index.js')(sequelize, Sequelize);

// 'use strict'

// const Sequelize = require('sequelize'); 
// const env = require('./env');
// const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
//   host: env.DATABASE_HOST,
//   port: env.DATABASE_PORT,
//   dialect: env.DATABASE_DIALECT,
//   define: {
//     underscored: true
//   }
// });

// // Connect all the models/tables in the database to a db object, 
// //so everything is accessible via one object
// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// //Models/tables
// db.user = require('../models/user.js')(sequelize, Sequelize);
// db.course = require('../models/course.js')(sequelize, Sequelize);


// //Relations
// db.course.belongsTo(db.user);
// db.users.hasMany(db.course);

// module.exports = db;