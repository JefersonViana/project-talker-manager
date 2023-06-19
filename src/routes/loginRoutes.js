const express = require('express');

// const { readFileTalker } = require('../indexTalker');
const generateToken = require('../crypto/generateToken');

const loginRoutes = express();

loginRoutes.post('/', async (req, res) => {
  // const { email, password } = req.body;
  const token = generateToken();
  // const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json({ token });
});

module.exports = loginRoutes;
