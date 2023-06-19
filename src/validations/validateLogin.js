const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if ('email' in req.body) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email) ? next()
    : res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if ('password' in req.body) {
    return password.length > 5 ? next()
    : res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
};

module.exports = {
  validateEmail,
  validatePassword,
};
