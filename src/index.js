const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb://localhost:27017/mongo-dev-position', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
});

// express sempre tem que vir antes do routes
// express need write before routes

// app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
