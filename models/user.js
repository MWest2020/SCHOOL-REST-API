'use strict';
// imports modules from sequelize to use the dataype validation and the models to instantialize
const { DataTypes, Model } = require('sequelize');
// standard module for hashing passwords
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required',
        },
        notEmpty: {
          msg: 'Please provide a first name',
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required',
        },
        notEmpty: {
          msg: 'Please provide a last name',
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "The email address you registered already exists in our database"
      },
      validate: {
        notNull: {
          msg: 'An email address is required',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        }
      }    
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
        len: {
          args: [8, 129], //don't like the max length of 20 because of security reasons. 
          msg: 'the message should be at least 8 characters long.'
        }
      },
      set(val) {  
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
    },
  }, 
  { 
    sequelize,
  });


  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName:'id',
        allowNull: false,
      },
    });  
  };

  return User;
};