const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.belongsToMany(models.groups, {
        through: models.groupMembers,
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
      users.hasMany(models.messages);
    }
  }

  users.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      profilePicUrl: DataTypes.STRING,
      username: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'users',
    }
  );

  users.beforeCreate((user) => {
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  });

  return users;
};
