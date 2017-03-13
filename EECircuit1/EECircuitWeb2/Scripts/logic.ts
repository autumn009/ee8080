﻿
function update() {
    var r = thefunc($("#checka").prop('checked'), $("#checkb").prop('checked'));
    $("#checkr").prop('checked', r);
    $("#checkr").checkboxradio("refresh");
}

$("#checka").click(update);
$("#checkb").click(update);

var thefunc;

function setup(name: string, func) {
    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + name + ".png");
    $("#simname").text(name +"ゲート・シミュレーター");
    $("#tablename").text(name + "ゲート真理表");

    thefunc = func;
    $("#t00").text(func(0, 0));
    $("#t01").text(func(0, 1));
    $("#t10").text(func(1, 0));
    $("#t11").text(func(1, 1));
}

function andsetup()
{
    setup("AND", (a: boolean, b: boolean): boolean => {
        return a && b;
    });
}

$("#navor").click(() => {
    setup("OR",(a: boolean, b: boolean): boolean => {
        return a || b;
    });
});
$("#navand").click(() => {
    andsetup();
});

andsetup();