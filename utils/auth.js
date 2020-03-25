const crypto = require('crypto');

//creates encrypted version of our plain text
const hashPassword = (plainText) => {
  return crypto.createHmac('sha256', 'secret key')
      .update(plainText)
      .digest('hex');
}

module.exports = { hashPassword };
