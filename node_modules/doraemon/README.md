Doraemon
========

[![Build Status](https://travis-ci.org/4simple/Doraemon.png?branch=master)](https://travis-ci.org/4simple/Doraemon)

A module API data mock tool.

You can use Doraemon to mock unfinished module api data.

## Install

    npm install doraemon

## Usage

### define module

    // ./moduleA.js
    module.exports = {
        say: function(what) {
        }
    };


### add module    

    
    var D = require("doraemon")({
        mock: true,
        dataPath: "./__MOCKS__/",
        q: true
    });
    
    // add module
    D.add("moduleA", require("moduleA"));
    
    // require module
    D.require("moduleA").say()
    .then(function(data) {
        console.log(data); // ouput "hello, world!"
    })
    .fail(function(e) {
        //
    }); 

#### mock file

./__MOCKS__/moduleA.say.js

    module.exports = exports = "hello, world!";
