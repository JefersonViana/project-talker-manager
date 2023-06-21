const connection = require('./connection');

const getAllTalkersDb = () => connection.execute(
  'SELECT * FROM talkers;',
);

module.exports = getAllTalkersDb;
