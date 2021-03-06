const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// Denrto de um controller existe no máximo 5 métodos:
// index: Lista todos cadstros
// show: Lista um único cadastro específico
// store: criar um cadastro
// update: atualiza um cadastro
// destroy: deleta um cadastro

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiRes = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { login: name, avatar_url, bio } = apiRes.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    dev = await Dev.update({
      techs: techsArray,
      location,
    });

    dev = await Dev.findOne({ github_username });

    return res.json(dev);
  },

  async destroy(req, res) {
    const { github_username } = req.query;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      return res.status(400).json({
        error: "Dev doesn't exist in database.",
      });
    }

    dev = await Dev.deleteOne({ github_username });

    return res.json({ message: 'Dev deleted successfully!' });
  },
};
