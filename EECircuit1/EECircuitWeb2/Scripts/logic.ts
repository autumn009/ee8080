
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

function setup(name: string, func, inputLabels: string[], outputLabels: string[]) {
    if (!inputLabels) inputLabels = ["A","B"];
    if (!outputLabels) outputLabels = ["Q"];

    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + name + ".png");
    $("#simname").text(name +"ゲート・シミュレーター");
    $("#tablename").text(name + "ゲート真理表");

    thefunc = func;
    var table = document.createElement("table");
    $("#tableroot").append(table);
    var tr1 = document.createElement("tr");
    $(table).append(tr1);
    var thInput = document.createElement("th");
    $(thInput).text("INPUT");
    $(thInput).addClass("border");
    $(tr1).append(thInput);
    var thOutput = document.createElement("th");
    $(thOutput).text("OUTPUT");
    $(thOutput).addClass("border");
    $(tr1).append(thOutput);
    var tr2 = document.createElement("tr");
    $(table).append(tr2);
    var tdInput = document.createElement("td");
    $(tr2).append(tdInput);
    var tdOutput = document.createElement("td");
    $(tr2).append(tdOutput);

    // TBW create Input table


    // TBW create output table



    $("#t00").text(func(0, 0));
    $("#t01").text(func(0, 1));
    $("#t10").text(func(1, 0));
    $("#t11").text(func(1, 1));
}

function andsetup()
{
    setup("AND", (a: boolean, b: boolean): boolean => {
        return a && b;
    },null,null);
}

$("#navor").click(() => {
    setup("OR",(a: boolean, b: boolean): boolean => {
        return a || b;
    }, null, null);
});
$("#navand").click(() => {
    andsetup();
});

andsetup();
$(document).on("mobileinit", function () {
    update();
});


