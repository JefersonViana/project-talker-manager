const express = require('express');

const { readFileTalker, writeFileTalker } = require('../indexTalker');

const {
  validateAuth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  validateRateQuery,
  validateDateQuery,
  validateAllQueries,
  validateQueries,
  validateQAndRate,
  validateAllFalse,
} = require('../validations/validateTalker');
const getAllTalkersDb = require('../db/talkerDB');

const talkerRoutes = express();

talkerRoutes.get('/', async (req, res) => {
  const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json(getAllTalkerManagers);
});

talkerRoutes.get('/search',
  validateAuth,
  validateDateQuery,
  validateAllQueries,
  validateQueries,
  validateAllFalse,
  validateRateQuery,
  validateQAndRate,
  async (req, res) => {
    const { q } = req.query;
    const getAllTalkerManagers = await readFileTalker();
    let getTalkerById = '';
    if (q === '') {
      res.status(200).json(getAllTalkerManagers);
    } else {
      getTalkerById = getAllTalkerManagers.filter((talker) => talker.name.includes(q));
      res.status(200).json(getTalkerById);
    }
});

talkerRoutes.get('/db',
  async (req, res) => {
    const [results] = await getAllTalkersDb();
    const updateFormat = results.map((talker) => ({
      id: talker.id,
      name: talker.name,
      age: talker.age,
      talk: {
        rate: talker.talk_rate,
        watchedAt: talker.talk_watched_at,
      },
    }));
    return res.status(200).json(updateFormat);
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

talkerRoutes.put('/:id',
  validateAuth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
  async (req, res) => {
    const { id } = req.params;
    const getAllTalkerManagers = await readFileTalker();
    let OK = 'no';
    const getTalkerById = getAllTalkerManagers.map((talker) => {
      if (talker.id === Number(id)) {
        OK = 'yes';
        return { ...talker, ...req.body, id: Number(id) };
      }
      return talker;
    });
    if (OK === 'yes') {
      await writeFileTalker(getTalkerById);
      return res.status(200).json({ ...req.body, id: Number(id) });
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  });

talkerRoutes.delete('/:id',
  validateAuth,
  async (req, res) => {
    const { id } = req.params;
    const getAllTalkerManagers = await readFileTalker();
    const talkerDeleted = getAllTalkerManagers.findIndex((talker) => talker.id === Number(id));
    if (talkerDeleted > -1) {
      getAllTalkerManagers.splice(talkerDeleted, 1);
      await writeFileTalker(getAllTalkerManagers);
      return res.sendStatus(204);
    }
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  });

module.exports = talkerRoutes;
