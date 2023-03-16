/*
 * @name: mock.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-11
 * @param: 
 * @todo: 
 * @changelog: 
 */
var fs = require("fs");
var path = require("path");
var util = require("util");
var Q = require("q");
var DoraemonError = require("./error");
var DATAPATH, USEQ;

module.exports = exports = function(options) {
    DATAPATH = options && options.path;
    USEQ = options.q;
    return function(api) {
        var file = path.join(DATAPATH, api + ".js"),
            ret;
        var deferred = USEQ ? Q.defer() : null;

        try {
            if (fs.existsSync(file)) {
                require.cache[file] = null;
                ret = require(file);
            }
            else {
                deferred && deferred.reject(new DoraemonError("No mock data."));
            }
        }
        catch (e) {
            ret = e;
            deferred && deferred.reject(e);
        }
        

        if (USEQ) {
            deferred.resolve(ret);
            return deferred.promise;
        }

        return ret;
    };
};
