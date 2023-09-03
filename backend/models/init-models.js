var DataTypes = require("sequelize").DataTypes;
var _category = require("./category");
var _category_field = require("./category_field");
var _field_type = require("./field_type");
var _option = require("./option");
var _post = require("./post");
var _post_field_value = require("./post_field_value");
var _role = require("./role");
var _user = require("./user");
var _user_filter = require("./user_filter");

function initModels(sequelize) {
  var category = _category(sequelize, DataTypes);
  var category_field = _category_field(sequelize, DataTypes);
  var field_type = _field_type(sequelize, DataTypes);
  var option = _option(sequelize, DataTypes);
  var post = _post(sequelize, DataTypes);
  var post_field_value = _post_field_value(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_filter = _user_filter(sequelize, DataTypes);

  category.belongsTo(category, { as: "parent", foreignKey: "parent_id"});
  category.hasMany(category, { as: "categories", foreignKey: "parent_id"});
  category_field.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(category_field, { as: "category_fields", foreignKey: "category_id"});
  post.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(post, { as: "posts", foreignKey: "category_id"});
  user_filter.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(user_filter, { as: "user_filters", foreignKey: "category_id"});
  option.belongsTo(category_field, { as: "category_field", foreignKey: "category_field_id"});
  category_field.hasMany(option, { as: "options", foreignKey: "category_field_id"});
  post_field_value.belongsTo(category_field, { as: "category_field", foreignKey: "category_field_id"});
  category_field.hasMany(post_field_value, { as: "post_field_values", foreignKey: "category_field_id"});
  category_field.belongsTo(field_type, { as: "field_type", foreignKey: "field_type_id"});
  field_type.hasMany(category_field, { as: "category_fields", foreignKey: "field_type_id"});
  post_field_value.belongsTo(post, { as: "post", foreignKey: "post_id"});
  post.hasMany(post_field_value, { as: "post_field_values", foreignKey: "post_id"});
  user.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(user, { as: "users", foreignKey: "role_id"});
  post.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(post, { as: "posts", foreignKey: "user_id"});
  user_filter.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(user_filter, { as: "user_filters", foreignKey: "user_id"});

  return {
    category,
    category_field,
    field_type,
    option,
    post,
    post_field_value,
    role,
    user,
    user_filter,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
