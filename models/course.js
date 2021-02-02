'use strict';
const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required',
        },
        notEmpty: {
          msg: 'Please provide a title',
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'An email address is required',
        },
        isEmail: {
          msg: 'Please provide a valid email address',
        }
      }    
    },
    estimatedTime: {
      type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: 'An password is required',
    //     },
    //     notEmpty: {
    //       msg: 'Please provide a password',
    //     },
    //     len: {
    //       args: [8, 129],
    //       msg: 'the message should be at least 8 characters long.'
    //     }
    //   }
    },
    materialsNeeded: {
        type: DataTypes.STRING,
        // allowNull: false,
        // set(val){
        //   if(val === this.password){
        //     const hashedPassword = bcrypt.hashSync(val, 10);
        //     this.setDataValue('confirmedPassword', hashedPassword);
        //   }
          
        // }, 
        // userID: {
          
        // }
        
    },
    userId: {
      type: DataTypes.INTEGER,
      foreignKey: {
        fieldName: "id",
        allowNull: false,
      }
    }
  }, { 
    sequelize, 
    timestamps: false,
    
   });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName:'id',
        allowNull: false,
      },
  });
  };
  return Course;
};