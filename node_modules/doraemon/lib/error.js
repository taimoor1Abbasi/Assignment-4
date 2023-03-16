/*
 * @name: error.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-12
 * @param: 
 * @todo: 
 * @changelog: 
 */
var util = require("util");

var DoraemonError = function (msg) {
  Error.captureStackTrace(this, Error || this)
  this.message = msg || 'Doraemon Error'
}

util.inherits(DoraemonError, Error)
DoraemonError.prototype.name = 'Doraemon Error'

module.exports = exports = DoraemonError;
