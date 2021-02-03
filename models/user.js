'use strict';
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

const PROTECTED_ATTRIBUTES = ['password'];

module.exports = (sequelize) => {
  class User extends Model {
    



  } // https://github.com/sequelize/sequelize/issues/2132

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
          args: [8, 129],
          msg: 'the message should be at least 8 characters long.'
        }
      },
      set(val) {
        
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        
      },
      
    },
    // confirmedPassword: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     set(val){
    //       if(val === this.password){
    //         const hashedPassword = bcrypt.hashSync(val, 10);
    //         this.setDataValue('confirmedPassword', hashedPassword);
    //       }
          
    //     }, 
    //     validate: {
    //       notNull: {
    //         msg: 'Both passwords must match'
    //       }
    //     }
        
    // },
    
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


(async () => {
  try {
    await User.sync();
    console.log('Users table synced successfully.');
  } catch (error) {
    console.error('Unable to sync Users table successfully:', error);
  }
});