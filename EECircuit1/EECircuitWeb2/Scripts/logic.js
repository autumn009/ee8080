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
    $(".trall").removeClass("active");
    $(".tr" + active).addClass("active");
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
var LogicTableUnit = (function () {
    function LogicTableUnit() {
        this.outputValues = [];
        this.canShurink = false;
    }
    return LogicTableUnit;
}());
var LogicTable = (function () {
    function LogicTable() {
        this.logicTables = [];
    }
    return LogicTable;
}());
function createLogicalTable(ignoreableInputLabels, inputLabels, outputLabels) {
    var table = new LogicTable();
    var count = 0;
    for (var i = 0; i < Math.pow(2, inputLabels.length); i++) {
        var unit = new LogicTableUnit();
        for (var j = 0; j < Math.pow(2, ignoreableInputLabels.length); j++) {
            var inputValues = [];
            var t = count++;
            for (var k = 0; k < inputLabels.length + ignoreableInputLabels.length; k++) {
                inputValues.push(((t & 1) != 0));
                t = t >> 1;
            }
            var n = thefunc(inputValues);
            unit.outputValues.push(n);
        }
        table.logicTables.push(unit);
    }
    return table;
}
function optimizeTable(table) {
    for (var i = 0; i < table.logicTables.length; i++) {
        var t = [];
        for (var j = 0; j < table.logicTables[i].outputValues.length; j++) {
            var n = 0;
            for (var k = 0; k < table.logicTables[i].outputValues[j].length; k++) {
                n <<= 1;
                n |= (!table.logicTables[i].outputValues[j][k]) ? 0 : 1;
            }
            t.push(n);
        }
        table.logicTables[i].canShurink = true;
        for (var j = 1; j < t.length; j++) {
            if (t[0] != t[j]) {
                table.logicTables[i].canShurink = false;
                break;
            }
        }
    }
}
function createLabel(label) {
    var thi = document.createElement("th");
    if (label.substring(0, 1) == "_") {
        var span = document.createElement("span");
        $(span).css("text-decoration", "overline");
        $(span).text(label.substring(1));
        $(thi).append(span);
    }
    else {
        $(thi).text(label);
    }
    $(thi).addClass("borderh");
    return thi;
}
function createHtmlTable(logicTable, ignoreableInputLabels, inputLabels, outputLabels) {
    var expand = false;
    if (inputLabels.length + outputLabels.length <= 3)
        expand = true;
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
    for (var i = 0; i < ignoreableInputLabels.length; i++) {
        $(trih).append(createLabel(ignoreableInputLabels[i]));
    }
    for (var i = 0; i < inputLabels.length; i++) {
        $(trih).append(createLabel(inputLabels[i]));
    }
    var count = 0;
    for (var j = 0; j < logicTable.logicTables.length; j++) {
        if (logicTable.logicTables[j].canShurink) {
            var trid = document.createElement("tr");
            $(trid).addClass("trall");
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                $(trid).addClass("tr" + count);
                count++;
            }
            $(tableInput).append(trid);
            for (var i = 0; i < ignoreableInputLabels.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand)
                    $(thd).addClass("thick");
                $(thd).addClass("ex");
                $(thd).text("X");
                $(trid).append(thd);
            }
            var values = [];
            var t = j;
            for (var i = 0; i < inputLabels.length; i++) {
                values.push(((t & 1) != 0));
                t = t >> 1;
            }
            for (var i = 0; i < values.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand)
                    $(thd).addClass("thick");
                $(thd).addClass(values[i] ? "one" : "zero");
                $(thd).text(values[i] ? "1" : "0");
                $(trid).append(thd);
            }
        }
        else {
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                var trid = document.createElement("tr");
                $(trid).addClass("tr" + count);
                $(trid).addClass("trall");
                $(tableInput).append(trid);
                var values = [];
                var t = k;
                for (var i = 0; i < ignoreableInputLabels.length; i++) {
                    values.push(((t & 1) != 0));
                    t = t >> 1;
                }
                var t = j;
                for (var i = 0; i < inputLabels.length; i++) {
                    values.push(((t & 1) != 0));
                    t = t >> 1;
                }
                for (var i = 0; i < values.length; i++) {
                    var thd = document.createElement("td");
                    $(thd).addClass("border");
                    if (expand)
                        $(thd).addClass("thick");
                    $(thd).addClass(values[i] ? "one" : "zero");
                    $(thd).text(values[i] ? "1" : "0");
                    $(trid).append(thd);
                }
                count++;
            }
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
    var count = 0;
    for (var j = 0; j < logicTable.logicTables.length; j++) {
        if (logicTable.logicTables[j].canShurink) {
            var trod = document.createElement("tr");
            $(trod).addClass("trall");
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                $(trod).addClass("tr" + count);
                count++;
            }
            $(tableOutput).append(trod);
            var results = logicTable.logicTables[j].outputValues[0];
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
        else {
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                var trod = document.createElement("tr");
                $(trod).addClass("tr" + count);
                $(trod).addClass("trall");
                $(tableOutput).append(trod);
                var results = logicTable.logicTables[j].outputValues[k];
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
                count++;
            }
        }
    }
}
function setup(name, pictureName, func, ignoreableInputLabels, inputLabels, outputLabels) {
    if (!ignoreableInputLabels)
        ignoreableInputLabels = [];
    if (!inputLabels)
        inputLabels = ["A", "B"];
    if (!outputLabels)
        outputLabels = ["Q"];
    thefunc = func;
    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + pictureName + ".png");
    $("#simname").text(name + "・シミュレーター");
    $("#tablename").text(name + "真理表");
    setupInputChecks(ignoreableInputLabels.concat(inputLabels));
    setupOutputFlags(outputLabels);
    var table = createLogicalTable(ignoreableInputLabels, inputLabels, outputLabels);
    optimizeTable(table);
    createHtmlTable(table, ignoreableInputLabels, inputLabels, outputLabels);
    update();
}
function andsetup() {
    setup("AND GATE", "AND", function (input) {
        return [input[0] && input[1]];
    }, null, null, null);
}
$("#navnot").click(function () {
    setup("NOT GATE", "NOT", function (input) {
        return [!input[0]];
    }, null, ["A"], null);
});
$("#navor").click(function () {
    setup("OR GATE", "OR", function (input) {
        return [input[0] || input[1]];
    }, null, null, null);
});
$("#navand").click(function () {
    andsetup();
});
$("#navand4").click(function () {
    setup("AND(4Input) GATE", "AND(4Input)", function (input) {
        return [input[0] && input[1] && input[2] && input[3]];
    }, null, ["A", "B", "C", "D"], null);
});
$("#navxor").click(function () {
    setup("XOR GATE", "XOR", function (input) {
        return [input[0] !== input[1]];
    }, null, null, null);
});
$("#navnor").click(function () {
    setup("NOR GATE", "NOR", function (input) {
        return [!(input[0] || input[1])];
    }, null, null, null);
});
$("#navnand").click(function () {
    setup("NAND GATE", "NAND", function (input) {
        return [!(input[0] && input[1])];
    }, null, null, null);
});
$("#navdec").click(function () {
    setup("DECODER", "DECODER", function (input) {
        var n = -1;
        if (input[3] && !input[4] && !input[5])
            n = (input[0] ? 1 : 0) + (input[1] ? 2 : 0) + (input[2] ? 4 : 0);
        return [n != 0, n != 1, n != 2, n != 3, n != 4, n != 5, n != 6, n != 7];
    }, ["A", "B", "C"], ["G1", "_G2A", "_G2B"], ["_Y0", "_Y1", "_Y2", "_Y3", "_Y4", "_Y5", "_Y6", "_Y7"]);
});
$("#navsel").click(function () {
    setup("SELECTOR", "SELECTOR", function (input) {
        if (!input[6]) {
            var n = (input[0] ? 1 : 0) + (input[1] ? 2 : 0);
            switch (n) {
                case 0: return [input[2]];
                case 1: return [input[3]];
                case 2: return [input[4]];
                case 3: return [input[5]];
            }
        }
        return [false];
    }, ["S1", "S2", "L0", "L1", "L2", "L3"], ["_E"], ["Z"]);
});
$("#navadd").click(function () {
    setup("ADD with Carry", "ADDER", function (input) {
        var a = input[0] ? 1 : 0;
        var b = input[1] ? 1 : 0;
        var c = input[2] ? 1 : 0;
        var sum = a + b + c;
        var s = false;
        var cout = false;
        if ((sum & 1) != 0)
            s = true;
        if ((sum & 2) != 0)
            cout = true;
        return [s, cout];
    }, null, ["A", "B", "C-in"], ["S", "C-out"]);
});
$("#nav2comp").click(function () {
    setup("Two's complement (3 digit)", "TWOCOMP", function (input) {
        var a1 = input[0] ? 1 : 0;
        var a2 = input[1] ? 2 : 0;
        var a3 = input[2] ? 4 : 0;
        var sum = ((a1 + a2 + a3) + 1) % 8;
        var z1 = false;
        var z2 = false;
        var z3 = false;
        if ((sum & 1) != 0)
            z1 = true;
        if ((sum & 2) != 0)
            z2 = true;
        if ((sum & 4) != 0)
            z3 = true;
        return [z1, z2, z3];
    }, null, ["A1", "A2", "A3"], ["Z1", "Z2", "Z3"]);
});
$(document).on("pagecreate", function () {
    andsetup();
    update();
});
//# sourceMappingURL=logic.js.map