'use strict';
const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init({
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
      unique: true,
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
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An password is required',
        },
        notEmpty: {
          msg: 'Please provide a password',
        },
        len: {
          args: [8, 129],
          msg: 'the message should be at least 8 characters long.'
        }
      }
    },
    confirmedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val){
          if(val === this.password){
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue('confirmedPassword', hashedPassword);
          }
          
        }, 
        validate: {
          notNull: {
            msg: 'Both passwords must match'
          }
        }
        
    },
    
  }, { sequelize,
  timestamps: false,
 });


  User.associate = (models) => {

    User.hasMany(models.Course, {
      foreignKey: 'id',
      sourcekey: 'userId',
    })  
  };


  return User;
};