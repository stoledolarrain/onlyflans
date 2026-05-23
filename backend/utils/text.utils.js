const sha1 = require("sha1");

const sha1Encode = (text) => {
  return sha1(text);
};

module.exports = {
  sha1Encode,
};