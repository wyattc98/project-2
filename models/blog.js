module.exports = function(sequelize, DataTypes) {
  var Blog = sequelize.define("Blog", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    uid: DataTypes.INTEGER
  });
  return Blog;
};
