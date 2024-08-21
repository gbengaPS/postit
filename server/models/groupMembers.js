const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class groupMembers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
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
