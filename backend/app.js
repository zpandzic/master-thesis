// Dependencies
const express = require('express');
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Controllers
const categoryRouter = require('./controllers/category.controller');
const usersRouter = require('./controllers/user.controller');
const authRouter = require('./controllers/auth.controller');
const fieldTypesRouter = require('./controllers/field_type.controller');
const categoryField = require('./controllers/category_field.controller');
const post = require('./controllers/post.controller');
const user_filter = require('./controllers/user_filter.controller');

// Initialize App
const app = express();

// Middleware Configuration
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route Configuration
app.use('/auth', authRouter); // Authentication routes
app.use('/user', usersRouter); // User-related routes
app.use('/categories', categoryRouter); // Category-related routes
app.use('/field_types', fieldTypesRouter); // Field type-related routes
app.use('/category_field', categoryField); // Category field-related routes
app.use('/post', post); // Post-related routes
app.use('/user_filter', user_filter); // User filter-related routes

// Error Handling: 404 Not Found
app.use((req, res, next) => {
  next(createError(404));
});

// Error Handling: General Error
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).send(`Error: ${err}`);
});

// Export App
module.exports = app;
