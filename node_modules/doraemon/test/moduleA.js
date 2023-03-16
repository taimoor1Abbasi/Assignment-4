/*
 * @name: moduleA.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-11
 * @param: 
 * @todo: 
 * @changelog: 
 */
var Q = require("q");

var mod = {
    name: "moduleA",
    say: function() {
        var deferred = Q.defer();

        deferred.resolve("hello, world!");
        
        return deferred.promise;
    },
    sub: {
        smile: function() {
            console.log("Wahaha!");
        }
    },
    async: function() {
        var deferred = Q.defer();
        Q.delay(2000).then(function() {
            deferred.resolve({
                success: true,
                time: "2014-01-12 15:54:15"
            });
        });

        return deferred.promise;
    }
};

mod.a = {};
mod.b = {};

mod.a.a = mod.b.a = mod.a
mod.a.b = mod.b.b = mod.b

module.exports = exports = mod;
