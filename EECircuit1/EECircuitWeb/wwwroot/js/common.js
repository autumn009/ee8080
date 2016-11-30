"use strict";

function test() {
    test.prototype.doit = function () {
        alert('here')
    }
}

var t = new test();
t.doit();
