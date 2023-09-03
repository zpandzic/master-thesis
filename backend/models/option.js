const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('option', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_field_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category_field',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'option',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "option_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
