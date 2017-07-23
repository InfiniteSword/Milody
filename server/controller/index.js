const work = require('./work');
const user = require('./user');

module.exports = function init (router) {
  work(router);
  user(router);
};
