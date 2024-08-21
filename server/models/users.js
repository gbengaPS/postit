const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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

  users.associate = (models) => {
    users.belongsToMany(models.groups, {
      through: models.groupMembers,
      foreingKey: 'userId',
      onDelete: 'cascade',
    });
    users.hasMany(models.messages);
  };

  return users;
};
