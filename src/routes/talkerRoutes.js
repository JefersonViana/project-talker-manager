const express = require('express');

const { readFileTalker, writeFileTalker } = require('../indexTalker');

const {
  validateAuth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
} = require('../validations/validateTalker');

const talkerRoutes = express();

talkerRoutes.get('/', async (req, res) => {
  const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json(getAllTalkerManagers);
});

talkerRoutes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const getAllTalkerManagers = await readFileTalker();
  const getTalkerById = getAllTalkerManagers.find((talker) => talker.id === Number(id));
  if (getTalkerById) return res.status(200).json(getTalkerById);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

talkerRoutes.post('/',
  validateAuth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  async (req, res) => {
  const getAllTalkers = await readFileTalker();
  getAllTalkers.push({
    id: getAllTalkers[getAllTalkers.length - 1].id + 1,
    ...req.body,
  });
  await writeFileTalker(getAllTalkers);
  res.status(201).json(getAllTalkers[getAllTalkers.length - 1]);
});

module.exports = talkerRoutes;
