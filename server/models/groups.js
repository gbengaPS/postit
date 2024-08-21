const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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

  groups.associate = (models) => {
    groups.belongsToMany(models.users, {
      through: models.groupMembers,
      foreignKey: 'groupId',
      onDelete: 'cascade',
    });
    groups.hasMany(models.messages, { foreignKey: 'groupId' });
  };

  return groups;
};
