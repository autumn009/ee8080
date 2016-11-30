"use strict";

function logicalValue()
{
    this.value = null;
    // valueの値がHかLならそのまま返します。それ以外ならハイインピーダンス(Z)を返します。
    logicalValue.prototype.toString = function () {
        if (this.value == "H" || this.value == "L") return this.value;
        return "Z";
    }
}

var logics =
   [
       {
           name: "NOT",
           table: [[1, 0]]
       },
       {
           name: "AND",
           table: [[0, 0, 0, 1]]
       },
       {
           name: "OR",
           table: [[0, 1, 1, 1]]
       },
       {
           name: "XOR",
           table: [[0, 1, 1, 1]]
       }
   ];

function loaded() {
    for (var i = 0; i < logics.length; i++) {
        var sel = document.getElementById("typeSelector");
        var newOpt = new Option();
        newOpt.text = logics[i].name;
        sel.appendChild(newOpt);
    }
}


function typeSelector_Changed()
{

}

var t = new logicalValue();
t.value = "L";
alert(t.toString());
