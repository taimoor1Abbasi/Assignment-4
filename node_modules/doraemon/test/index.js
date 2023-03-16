/*
 * @name: index.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2014-01-11
 * @param: 
 * @todo: 
 * @changelog: 
 */
var path = require("path");
var D = require("../")({mock: true, q: true, dataPath: path.join(__dirname, "data")});

D.add("moduleA", require("./moduleA"));

var A = D.require("moduleA");

//A = require("./moduleA");

//console.log(A.name);
//console.log(A.data);
A.say().then(function(data) {
    console.log("say:")
    console.log(data);
});

A.async().then(function(data) {
    console.log("async:")
    console.log(data);
})
.fail(function(err) {
    console.log(err);
});
