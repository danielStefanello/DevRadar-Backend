const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  'mongodb://mongodb:mongodb@localhost:27017/mongo-dev-position?authSource=admin',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(`MongoDB connected`);
});

// express sempre tem que vir antes do routes
// express need write before routes

// app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
