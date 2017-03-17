function update() {
    if (!thefunc)
        return;
    var input = [];
    for (var i = 0; i < checkCount; i++) {
        input.push($("#check" + i).prop("checked"));
    }
    var active = 0;
    for (var i = 0; i < checkCount; i++) {
        if (input[i])
            active += Math.pow(2, i);
    }
    for (var i = 0; i < Math.pow(2, checkCount); i++) {
        if (i == active) {
            $("#tri" + i).addClass("active");
            $("#tro" + i).addClass("active");
        }
        else {
            $("#tri" + i).removeClass("active");
            $("#tro" + i).removeClass("active");
        }
    }
    var output = thefunc(input);
    for (var i = 0; i < output.length; i++) {
        var img = $("#flag" + i);
        img.removeClass("flag-on");
        img.removeClass("flag-off");
        if (output[i])
            img.addClass("flag-on");
        else
            img.addClass("flag-off");
    }
}
var checkCount = 0;
function setupInputChecks(inputLabels) {
    var newCount = inputLabels.length;
    var currentCount = checkCount;
    var currentState = [];
    for (var i = 0; i < currentCount; i++) {
        currentState.push($("#check" + i).prop("checked"));
    }
    $("#inputCheckHolderTd").empty();
    var div = document.createElement("div");
    $(div).attr("data-role", "fieldcontain");
    $("#inputCheckHolderTd").append(div);
    var fc = document.createElement("fieldset");
    $(fc).attr("data-role", "controlgroup");
    $(fc).attr("id", "inputCheckHolder");
    $(div).append(fc);
    for (var i = 0; i < newCount; i++) {
        var check = document.createElement("input");
        $(check).attr("type", "checkbox");
        $(check).attr("name", "check" + i);
        $(check).attr("id", "check" + i);
        if (currentState[i]) {
            $(check).attr("checked", "checked");
        }
        $(check).click(function () { update(); });
        $("#inputCheckHolder").append(check);
        var label = document.createElement("label");
        $(label).attr("for", "check" + i);
        var lbl = inputLabels[i];
        if (lbl.substring(0, 1) == "_") {
            var span = document.createElement("span");
            $(span).css("text-decoration", "overline");
            $(span).text(lbl.substring(1));
            $(label).append(span);
        }
        else {
            $(label).text(lbl);
        }
        $(label).css("width", "3em");
        $("#inputCheckHolder").append(label);
    }
    $("#inputCheckHolderTd").trigger('create');
    checkCount = newCount;
}
function setupOutputFlags(outputLabels) {
    var newCount = outputLabels.length;
    $("#outputCheckHolderTd").empty();
    var table = document.createElement("table");
    $("#outputCheckHolderTd").append(table);
    for (var i = 0; i < newCount; i++) {
        var tr = document.createElement("tr");
        $(table).append(tr);
        var td = document.createElement("td");
        $(tr).append(td);
        var img = document.createElement("img");
        $(img).addClass("flag-off");
        $(img).attr("id", "flag" + i);
        $(td).append(img);
        $(td).append(" ");
        var lbl = outputLabels[i];
        if (lbl.substring(0, 1) == "_") {
            var span = document.createElement("span");
            $(span).css("text-decoration", "overline");
            $(span).text(lbl.substring(1));
            $(td).append(span);
        }
        else {
            $(td).append(lbl);
        }
        $(td).append(" ");
    }
}
var thefunc;
function setup(name, pictureName, func, inputLabels, outputLabels) {
    if (!inputLabels)
        inputLabels = ["A", "B"];
    if (!outputLabels)
        outputLabels = ["Q"];
    thefunc = func;
    var expand = false;
    if (inputLabels.length + outputLabels.length <= 3)
        expand = true;
    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + pictureName + ".png");
    $("#simname").text(name + "・シミュレーター");
    $("#tablename").text(name + "真理表");
    setupInputChecks(inputLabels);
    setupOutputFlags(outputLabels);
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
        if (inputLabels[i].substring(0, 1) == "_") {
            var span = document.createElement("span");
            $(span).css("text-decoration", "overline");
            $(span).text(inputLabels[i].substring(1));
            $(thi).append(span);
        }
        else {
            $(thi).text(inputLabels[i]);
        }
        $(thi).addClass("borderh");
        $(trih).append(thi);
    }
    for (var j = 0; j < totalCount; j++) {
        var trid = document.createElement("tr");
        $(trid).attr("id", "tri" + j);
        $(tableInput).append(trid);
        var values = [];
        var t = j;
        for (var i = 0; i < inputLabels.length; i++) {
            values.push(((t & 1) != 0));
            t = t >> 1;
        }
        for (var i = 0; i < inputLabels.length; i++) {
            var thd = document.createElement("td");
            $(thd).addClass("border");
            if (expand)
                $(thd).addClass("thick");
            $(thd).addClass(values[i] ? "one" : "zero");
            $(thd).text(values[i] ? "1" : "0");
            $(trid).append(thd);
        }
    }
    // create output table
    var tableOutput = document.createElement("table");
    $(tdOutput).append(tableOutput);
    var troh = document.createElement("tr");
    $(tableOutput).append(troh);
    for (var i = 0; i < outputLabels.length; i++) {
        var tho = document.createElement("th");
        if (outputLabels[i].substring(0, 1) == "_") {
            var span = document.createElement("span");
            $(span).css("text-decoration", "overline");
            $(span).text(outputLabels[i].substring(1));
            $(tho).append(span);
        }
        else {
            $(tho).text(outputLabels[i]);
        }
        $(tho).addClass("borderh");
        $(tho).addClass("result");
        $(troh).append(tho);
    }
    for (var j = 0; j < totalCount; j++) {
        var trod = document.createElement("tr");
        $(trod).attr("id", "tro" + j);
        $(tableOutput).append(trod);
        var values = [];
        var t = j;
        for (var i = 0; i < inputLabels.length; i++) {
            values.push(((t & 1) != 0));
            t = t >> 1;
        }
        var results = thefunc(values);
        for (var i = 0; i < outputLabels.length; i++) {
            var thd = document.createElement("td");
            $(thd).addClass("border");
            if (expand)
                $(thd).addClass("thick");
            $(thd).addClass("result");
            $(thd).addClass(results[i] ? "one" : "zero");
            $(thd).text(results[i] ? "1" : "0");
            $(trod).append(thd);
        }
    }
    update();
}
function andsetup() {
    setup("AND GATE", "AND", function (input) {
        return [input[0] && input[1]];
    }, null, null);
}
$("#navnot").click(function () {
    setup("NOT GATE", "NOT", function (input) {
        return [!input[0]];
    }, ["A"], null);
});
$("#navor").click(function () {
    setup("OR GATE", "OR", function (input) {
        return [input[0] || input[1]];
    }, null, null);
});
$("#navand").click(function () {
    andsetup();
});
$("#navand4").click(function () {
    setup("AND(4Input) GATE", "AND(4Input)", function (input) {
        return [input[0] && input[1] && input[2] && input[3]];
    }, ["A", "B", "C", "D"], null);
});
$("#navxor").click(function () {
    setup("XOR GATE", "XOR", function (input) {
        return [input[0] !== input[1]];
    }, null, null);
});
$("#navnor").click(function () {
    setup("NOR GATE", "NOR", function (input) {
        return [!(input[0] || input[1])];
    }, null, null);
});
$("#navnand").click(function () {
    setup("NAND GATE", "NAND", function (input) {
        return [!(input[0] && input[1])];
    }, null, null);
});
$("#navdec").click(function () {
    setup("DECODER", "DECODER", function (input) {
        var n = -1;
        if (input[3] && !input[4] && !input[5])
            n = (input[0] ? 1 : 0) + (input[1] ? 2 : 0) + (input[2] ? 4 : 0);
        return [n != 0, n != 1, n != 2, n != 3, n != 4, n != 5, n != 6, n != 7];
    }, ["A", "B", "C", "G1", "_G2A", "_G2B"], ["_Y0", "_Y1", "_Y2", "_Y3", "_Y4", "_Y5", "_Y6", "_Y7"]);
});
$(document).on("pagecreate", function () {
    andsetup();
    update();
});
//# sourceMappingURL=logic.js.map