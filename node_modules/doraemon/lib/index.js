/*
 * @name: index.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-11
 * @param: 
 * @todo: 
 * @changelog: 
 */
module.exports = exports = function(options) {
    return {
        http: require("./http"),
        add: require("./module").add,
        require: require("./module").require(options)
    };
};
