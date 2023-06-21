const express = require('express');

const { readFileTalker, writeFileTalker } = require('../indexTalker');
const { validateAuth, validateRateBody } = require('../validations/validateTalker');

const rateRoutes = express();

rateRoutes.patch('/:id',
  validateAuth,
  validateRateBody,
  async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    const getAllTalkers = await readFileTalker();
    const talkerUpdate = getAllTalkers.map((talker) => {
      if (talker.id === Number(id)) {
        return { id: Number(id),
          name: talker.name,
          age: talker.age,
          talk: {
            watchedAt: talker.talk.watchedAt,
            rate,
          },
        };
      }
      return talker;
    });
    await writeFileTalker(talkerUpdate);
    res.sendStatus(204);
});

module.exports = rateRoutes;
