const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category_field', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    field_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'field_type',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'category_field',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "category_field_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
