const initModels = require('../models/init-models.js');
const { Sequelize } = require('sequelize');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

let sequelize = new Sequelize(process.env.DATABASE_URL);

const models = initModels(sequelize);

module.exports = { ...models, sequelize };
