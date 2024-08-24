const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class groups extends Model {
    static associate(models) {
      groups.belongsToMany(models.users, {
        through: models.groupMembers,
        foreignKey: 'groupId',
        onDelete: 'cascade',
      });
      groups.hasMany(models.messages, { foreignKey: 'groupId' });
    }
  }
  groups.init(
    {
      groupName: DataTypes.STRING,
      groupDescription: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'groups',
    }
  );

  return groups;
};
