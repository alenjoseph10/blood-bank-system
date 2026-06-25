const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FILE_PATH = path.join(__dirname, '../db_fallback.json');

// Ensure fallback file exists with default schema structure
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify({ users: [], donors: [], requests: [] }, null, 2)
  );
}

function readData() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], donors: [], requests: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error writing to fallback JSON database:', err);
  }
}

function isConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  readData,
  writeData,
  isConnected
};
