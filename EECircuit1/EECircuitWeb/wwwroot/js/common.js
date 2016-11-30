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

var t = new logicalValue();
t.value = "L";
alert(t.toString());
