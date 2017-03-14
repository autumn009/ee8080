function update() {
    var x0 = $("#checka").prop('checked');
    var y0 = $("#checkb").prop('checked');
    var r = thefunc(x0, y0);
    $("#checkr").prop('checked', r);
    $("#checkr").checkboxradio("refresh");
    for (var x = 0; x < 2; x++) {
        for (var y = 0; y < 2; y++) {
            var col = "#ffffff";
            if (x == x0 && y == y0)
                col = "#00ffff";
            var id = "#t" + x.toString() + y.toString();
            $(id).attr("data-theme", col);
            $(id).css("background-color", col);
        }
    }
}
$("#checka").click(update);
$("#checkb").click(update);
var thefunc;
function setup(name, func, inputLabels, outputLabels) {
    if (!inputLabels)
        inputLabels = ["A", "B"];
    if (!outputLabels)
        outputLabels = ["Q"];
    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + name + ".png");
    $("#simname").text(name + "ゲート・シミュレーター");
    $("#tablename").text(name + "ゲート真理表");
    thefunc = func;
    $("#tableroot").empty();
    var table = document.createElement("table");
    $("#tableroot").append(table);
    var tr1 = document.createElement("tr");
    $(table).append(tr1);
    var thInput = document.createElement("th");
    $(thInput).text("INPUT");
    $(thInput).addClass("borderh");
    $(tr1).append(thInput);
    var thOutput = document.createElement("th");
    $(thOutput).text("OUTPUT");
    $(thOutput).addClass("borderh");
    $(tr1).append(thOutput);
    var tr2 = document.createElement("tr");
    $(table).append(tr2);
    var tdInput = document.createElement("td");
    $(tr2).append(tdInput);
    var tdOutput = document.createElement("td");
    $(tr2).append(tdOutput);
    var totalCount = Math.pow(2, inputLabels.length);
    // create Input table
    var tableInput = document.createElement("table");
    $(tdInput).append(tableInput);
    var trih = document.createElement("tr");
    $(tableInput).append(trih);
    for (var i = 0; i < inputLabels.length; i++) {
        var thi = document.createElement("th");
        $(thi).text(inputLabels[i]);
        $(thi).addClass("borderh");
        $(trih).append(thi);
    }
    for (var j = 0; j < totalCount; j++) {
        var trid = document.createElement("tr");
        $(tableInput).append(trid);
        var values = [];
        var t = j;
        for (var i = 0; i < inputLabels.length; i++) {
            values.unshift(((t & 1) != 0));
        }
        for (var i = 0; i < inputLabels.length; i++) {
            var thd = document.createElement("td");
            $(thd).addClass("border");
            $(thd).addClass("thick");
            $(thd).text(values[i] ? "1" : "0");
            $(trid).append(thd);
        }
    }
    // TBW
    // create output table
    var tableOutput = document.createElement("table");
    $(tdOutput).append(tableOutput);
    var troh = document.createElement("tr");
    $(tableOutput).append(troh);
    for (var i = 0; i < outputLabels.length; i++) {
        var tho = document.createElement("th");
        $(tho).text(outputLabels[i]);
        $(troh).append(tho);
    }
    // TBW
    $("#t00").text(func(0, 0));
    $("#t01").text(func(0, 1));
    $("#t10").text(func(1, 0));
    $("#t11").text(func(1, 1));
}
function andsetup() {
    setup("AND", function (input) {
        return [input[0] && input[1]];
    }, null, null);
}
$("#navor").click(function () {
    setup("OR", function (input) {
        return [input[0] || input[1]];
    }, null, null);
});
$("#navand").click(function () {
    andsetup();
});
andsetup();
$(document).on("mobileinit", function () {
    update();
});
//# sourceMappingURL=logic.js.map