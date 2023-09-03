const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_field_value', {
    id: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'post',
        key: 'id'
      }
    },
    category_field_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category_field',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'post_field_value',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "post_field_value_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
