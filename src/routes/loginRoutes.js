const express = require('express');

// const { readFileTalker } = require('../indexTalker');
const generateToken = require('../crypto/generateToken');
const { validateEmail, validatePassword } = require('../validations/validateLogin');

const loginRoutes = express();

loginRoutes.post('/',
  validateEmail,
  validatePassword,
  async (req, res) => {
  // const { email, password } = req.body;
  const token = generateToken();
  // const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json({ token });
});

module.exports = loginRoutes;
