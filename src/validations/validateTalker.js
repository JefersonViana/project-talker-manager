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

module.exports = {
  validateAuth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchAt,
  validateRate,
};