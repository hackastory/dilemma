var mob = require("./mob"),
    mobUtil = require("./mobUtil");

process.on('uncaughtException', function (err) {
    mobUtil.error(err);
});

module.exports = mob;