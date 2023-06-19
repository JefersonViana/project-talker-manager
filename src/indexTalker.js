const fs = require('fs').promises;
const { join } = require('path');

const PATH = '/talker.json';

const readFileTalker = async () => {
  const response = await fs.readFile(join(__dirname, PATH), 'utf-8');
  return Number(response.length) === 0 ? [] : JSON.parse(response);
};

module.exports = {
  readFileTalker,
};
