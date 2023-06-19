const express = require('express');

const { readFileTalker } = require('../indexTalker');

const talkerRoutes = express();

talkerRoutes.get('/', async (req, res) => {
  const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json(getAllTalkerManagers);
});

// talkerRoutes.get('/', () => {

// });

module.exports = talkerRoutes;
