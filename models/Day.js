'use strict';
module.exports = (sequelize, DataTypes) => {
  const Day = sequelize.define('Day', {
    date: {
      type:DataTypes.DATEONLY,
      validate: {
        isDate: {args: true, msg: "Please provide a valid date"}
      }
    }
  }, {});
  Day.associate = function(models) {
    // associations can be defined here
    Day.hasMany(models.Food, { onDelete: 'cascade', hooks:true });
    Day.belongsTo(models.User);
  };
  return Day;
};