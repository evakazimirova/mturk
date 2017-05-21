const crypto = require('crypto');

module.exports = {
  encryptPassword: (password) => {
    return crypto.createHash('sha1').update(password).digest('hex');
  },
  generateTokenFromJSON: (input) => {
    return crypto.createHash('sha1').update(JSON.stringify(input) + new Date()).digest('hex');
  }
};