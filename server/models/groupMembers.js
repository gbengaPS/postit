const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class groupMembers extends Model {
    static associate(models) {}
  }
  groupMembers.init(
    {
      addedBy: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'groupMembers',
    }
  );

  return groupMembers;
};
