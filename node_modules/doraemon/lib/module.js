/*
 * @name: module.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-11
 * @param: 
 * @todo: 
 * @changelog: 
 */
var util = require("util");
var mock = require("./mock");
var MODS = {};

var OPTIONS = {
    mock: false
};

function _addMethod(name, func) {
    MODS[name] = function() {
        return OPTIONS.mock ? mock(name) : func.apply(null, arguments);
    }
}

function _addObject(name, obj, receiver, keys) {
    receiver = receiver || MODS;
    receiver[name] = {};
    keys = keys ? keys + "." : "";

    if (obj["__DORAEMON__"]) {
        receiver[name] = obj;
        return;
    }

    obj["__DORAEMON__"] = true;


    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) {
            return;
        }

        if (typeof obj[key] === "function") {
            receiver[name][key] = (function(name, key, func) {
                return function() {
                    return OPTIONS.mock ? mock(keys + name + "." + key) : func.apply(obj, arguments);
                }
            })(name, key, obj[key])
        }
        /*
         *o = {}
         *o.a = {}
         *o.b = {}
         *o.a.a = o.b.a = o.a
         *o.a.b = o.b.b = o.b
         */
        else if (typeof obj[key] === "object" && Object.prototype.toString.call(obj[key]) !== "[object Null]" && obj[key] !== obj && obj[key][name] !== obj) {
            _addObject(key, obj[key], receiver[name], keys + name);
        }
        else {
            receiver[name][key] = OPTIONS.mock ? mock(keys + name + "." + key) : obj[key];
        }
    }
}

module.exports = exports = {
    add: function(name, definition, noMock) {

        if (typeof name !== "string") throw TypeError();

        if (!OPTIONS.mock || !!noMock) {
            MODS[name] = definition;
            return
        }

        /*
         * todo: 自动分析出name对应的module路径require
         *if (typeof definition === "undefined") {
         *    definition = require(name);
         *}
         */

        if (typeof definition === "function") {
            _addMethod(name, definition);
        }
        else if (typeof definition === "object") {
            _addObject(name, definition);
        }
        else {
            MODS[name] = OPTIONS.mock ? mock(name) : definition;
        }
    },
    require: function(options) {
        options = options || {};
        OPTIONS.mock = options && !!options.mock;
        mock = require("./mock")({
            path: options.dataPath,
            q: !!options.q
        });

        return function (name) {
            if (typeof name !== "string") throw TypeError();
            return MODS[name];
        };
    }
};
