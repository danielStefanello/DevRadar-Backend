const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/mongo-dev-position', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
});

// express sempre tem que vir antes do routes
// express need write before routes
app.use(express.json());
app.use(routes);

app.listen(3333);
