module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });
  return User;
};
