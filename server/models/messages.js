const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    static associate(models) {
      messages.belongsTo(models.users);
    }
  }

  messages.init(
    {
      messageBody: DataTypes.STRING,
      messagePriority: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'messages',
    }
  );

  return messages;
};
