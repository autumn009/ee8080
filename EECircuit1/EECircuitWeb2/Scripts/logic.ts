
function update() {
    var x0 = $("#checka").prop('checked');
    var y0 = $("#checkb").prop('checked');
    var r = thefunc(x0, y0);
    $("#checkr").prop('checked', r);
    $("#checkr").checkboxradio("refresh");

    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < 2; y++) {
            var col = "#ffffff";
            if (x == x0 && y == y0) col = "#00ffff";
            var id = "#t" + x.toString() + y.toString();
            $(id).attr("data-theme", col);
            $(id).css("background-color", col);
        }
    }
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
$(document).on("mobileinit", function () {
    update();
});


