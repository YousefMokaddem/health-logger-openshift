'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username:{
      type: DataTypes.STRING,
      validate:{
        notEmpty: {args: true, msg: "Please provide a value for username"},
        isAlphanumeric: {args: true, msg: "Username may only contain alphanumeric characters"}
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {args: true, msg: "Please provide a valid email address"}
      }
    },
    password: DataTypes.STRING //validate on client side, as bcrypt will change the password before adding to db
  }, {});
  User.associate = function(models) {
    // User hasMany Foods that they create, users can edit and delete foods they created
    User.hasMany(models.Food);
    // User hasMany Days that they create and can add and remove foods to for logging
    User.hasMany(models.Day);
  };
  return User;
};