'use strict';
const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required',
          },
        notEmpty: {
          msg: 'Please provide a title',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A description is required',
          },
          notEmpty: {
            msg: 'Please provide a description.'
          },
        },    
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   notNull: {
        //     msg: 'An estimate is required',
        //   },
        //   notEmpty: {
        //     msg: 'Please provide a estimate time to complete the course',
        //   },
        // },
      },
      materialsNeeded: {
            type: DataTypes.STRING,
            // allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        foreignKey: {
          fieldName: "id",
          allowNull: false,
        }
      },
    },
   
  { 
    sequelize, 
    // timestamps: false,
    
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

(async () => {
  try {
    await Course.sync();
    console.log('Course table synced successfully.');
  } catch (error) {
    console.error('Unable to sync course table successfully:', error);
  }
});