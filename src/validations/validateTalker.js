const { readFileTalker } = require('../indexTalker');

const validateAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if ('authorization' in req.headers) {
    return authorization.length === 16 && typeof authorization === 'string'
      ? next() : res.status(401).json({ message: 'Token inválido' });
  }
  return res.status(401).json({ message: 'Token não encontrado' });
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if ('name' in req.body && name.length > 0) {
    return name.length > 2 && typeof name === 'string'
      ? next() : res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  return res.status(400).json({ message: 'O campo "name" é obrigatório' });
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if ('age' in req.body && age) {
    return Number.isInteger(age) && age > 17
      ? next() : res.status(400).json({
        message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
      });
  }
  return res.status(400).json({ message: 'O campo "age" é obrigatório' });
};

const validateTalk = (req, res, next) => (
  'talk' in req.body ? next() : res.status(400).json({ message: 'O campo "talk" é obrigatório' })
);

const validateWatchAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  if ('watchedAt' in req.body.talk && watchedAt) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return regex.test(watchedAt)
      ? next() : res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
  }
  return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
};

const validateRate = (req, res, next) => {
  const { rate } = req.body.talk;
  if ('rate' in req.body.talk) {
    const valid = [rate > 0, rate < 6, Number.isInteger(rate)];
    return valid.every((i) => i === true) ? next()
      : res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return res.status(400).json(
    { message: 'O campo "rate" é obrigatório' },
  );
};

const validateRateBody = (req, res, next) => {
  const { rate } = req.body;
  if ('rate' in req.body) {
    const valid = [rate > 0, rate < 6, Number.isInteger(rate)];
    return valid.every((i) => i === true) ? next()
      : res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return res.status(400).json(
    { message: 'O campo "rate" é obrigatório' },
  );
};

const validateRateQuery = (req, res, next) => {
  const { rate } = req.query;
  const num = Number(rate);
  if ('rate' in req.query) {
    const valid = [num > 0, num < 6, Number.isInteger(num)];
    return valid.every((i) => i === true) ? next()
      : res.status(400).json({ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' });
  }
  return res.status(400).json(
    { message: 'O campo "rate" é obrigatório' },
  );
};

const validateDateQuery = async (req, res, next) => {
  const { date } = req.query;
  const talkers = await readFileTalker();
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (date === '') {
    res.status(200).json(talkers);
  } else if (!regex.test(date)) {
    res.status(400).json({ message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
  } else {
    next();
  }
};

const validateAllQueries = async (req, res, next) => {
  const { date, q, rate } = req.query;
  const valid = [['date', 'rate', 'q'], ['date', 'rate']];
  const talkers = await readFileTalker();
  let response = '';
  if (valid[0].every((query) => query in req.query)) {
    response = talkers.filter(({ name, talk: { rate: num, watchedAt } }) => (
      date === watchedAt && num >= Number(rate) && name.includes(q)
    ));
    res.status(200).json(response);
  } else if (valid[1].every((query) => query in req.query)) {
    response = talkers.filter(({ talk: { rate: num, watchedAt } }) => (
      date === watchedAt && num === Number(rate)
    ));
    res.status(200).json(response);
  } else {
    next();
  }
};

const validateQueries = async (req, res, next) => {
  const { date, q } = req.query;
  const valid = [['date', 'q']];
  const talkers = await readFileTalker();
  if (valid[0].every((query) => query in req.query)) {
    const response = talkers.filter(({ name, talk: { watchedAt } }) => (
      date === watchedAt && name.includes(q)
    ));
    res.status(200).json(response);
  } else if ('date' in req.query) {
    res.status(200).json(talkers.filter(({ talk }) => talk.watchedAt === date));
  } else {
    next();
  }
};

module.exports = {
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
  validateRateBody,
};
