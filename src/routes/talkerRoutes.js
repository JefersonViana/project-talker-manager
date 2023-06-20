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
} = require('../validations/validateTalker');

const talkerRoutes = express();

talkerRoutes.get('/', async (req, res) => {
  const getAllTalkerManagers = await readFileTalker();
  return res.status(200).json(getAllTalkerManagers);
});

// const caseOne = (arr, query) => {
//   const { q, rate, date } = query;
//   return arr.filter(({ name, talk: { rate: num, watchedAt } }) => (
//     name.includes(q) && rate >= Number(num) && watchedAt === date));
// };

// const caseTwo = (arr, query) => {
//   const { q, rate } = query;
//   return arr.filter(({ name, talk: { rate: num } }) => (
//     name.includes(q) && rate >= Number(num)
//   ));
// };

// const caseThree = (arr, query) => (
//   arr.filter(({ talk: { watchedAt } }) => watchedAt === query.date)
// );

talkerRoutes.get('/search',
  validateAuth,
  validateDateQuery,
  validateAllQueries,
  validateQueries,
  validateRateQuery,
  async (req, res) => {
    const { q, rate } = req.query;
    const getAllTalkerManagers = await readFileTalker();
    let getTalkerById = '';
    if (q && rate) {
      getTalkerById = getAllTalkerManagers.filter((talker) => talker.name.includes(q))
        .filter((talker) => talker.talk.rate >= Number(rate));
      res.status(200).json(getTalkerById);
    } else if (!q && rate) {
      getTalkerById = getAllTalkerManagers.filter((talker) => talker.talk.rate >= Number(rate));
      res.status(200).json(getTalkerById);
    } else {
      getTalkerById = getAllTalkerManagers.filter((talker) => talker.name.includes(q));
      return res.status(200).json(getTalkerById);
    }
  });

// // // // // // // // // /// // /// /// // // // // //// // // /// //
// const { q, rate } = req.query;
// const getAllTalkerManagers = await readFileTalker();
// let getTalkerById = '';
// if (q && rate) {
//   getTalkerById = getAllTalkerManagers.filter((talker) => talker.name.includes(q))
//     .filter((talker) => talker.talk.rate >= Number(rate));
//   res.status(200).json(getTalkerById);
// } else if (!q && rate) {
//   getTalkerById = getAllTalkerManagers.filter((talker) => talker.talk.rate >= Number(rate));
//   res.status(200).json(getTalkerById);
// } else {
//   getTalkerById = getAllTalkerManagers.filter((talker) => talker.name.includes(q));
//   return res.status(200).json(getTalkerById);
// }

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
