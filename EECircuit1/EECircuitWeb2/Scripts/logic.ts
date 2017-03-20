
function update() {
    if (!thefunc) return;

    var input: boolean[] = [];
    for (var i = 0; i < checkCount; i++) {
        input.push($("#check" + i).prop("checked"));
    }
    var active: number = 0;
    for (var i = 0; i < checkCount; i++) {
        if (input[i]) active += Math.pow(2,i);
    }
    $(".trall").removeClass("active");
    $(".tr" + active).addClass("active");
    var output: boolean[] = thefunc(input);
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

function setupInputChecks(inputLabels: string[]) {
    var newCount: number = inputLabels.length;
    var currentCount = checkCount;
    var currentState: boolean[] = [];
    for (var i = 0; i < currentCount; i++) {
        currentState.push($("#check" + i).prop("checked"));
    }

    $("#inputCheckHolderTd").empty();
    var div = document.createElement("div");
    $(div).attr("data-role","fieldcontain");
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
        $(check).click(() => { update(); });
        $("#inputCheckHolder").append(check);
        var label = document.createElement("label");
        $(label).attr("for", "check" + i);
        var lbl = inputLabels[i];
        if (lbl.substring(0, 1) == "_")
        {
            var span = document.createElement("span");
            $(span).css("text-decoration", "overline");
            $(span).text(lbl.substring(1));
            $(label).append(span);
        }
        else
        {
            $(label).text(lbl);
        }
        $(label).css("width","3em");
        $("#inputCheckHolder").append(label);
    }
    $("#inputCheckHolderTd").trigger('create');
    checkCount = newCount;
}

function setupOutputFlags(outputLabels: string[]) {
    var newCount: number = outputLabels.length;

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

class LogicTableUnit {
    public outputValues: boolean[] = [];
}

class LogicTable {
    public logicTables: LogicTableUnit[] = [];
}

function createLogicalTable(ignoreableInputLabels: string[], inputLabels: string[], outputLabels: string[]): LogicTable {
    var table = new LogicTable();
    for (var i = 0; i < Math.pow(2,ignoreableInputLabels.length); i++) {
        var unit = new LogicTableUnit();
        var inputValues: boolean[] = [];
        var t = i;
        for (var j = 0; j < inputLabels.length; j++) {
            inputValues.push(((t & 1) != 0));
            t = t >> 1;
        }
        for (var j = 0; j < Math.pow(2, inputLabels.length); j++) {
            unit.outputValues.push(thefunc(inputValues));
        }
        table.logicTables.push(unit);
    }
    return table;
}
function optimizeTable(table: LogicTable)
{

}

function createLabel(label:string)
{
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

function createHtmlTable(logicTable: LogicTable, ignoreableInputLabels: string[], inputLabels: string[], outputLabels: string[])
{
    var expand = false;
    if (inputLabels.length + outputLabels.length <= 3) expand = true;

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

    var count= 0;
    for (var j = 0; j < logicTable.logicTables.length; j++) {
        for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
            var trid = document.createElement("tr");
            $(trid).addClass("tr" + count);
            $(trid).addClass("trall");
            $(tableInput).append(trid);
            var values: boolean[] = [];
            var t = k;
            for (var i = 0; i < inputLabels.length; i++) {
                values.push(((t & 1) != 0));
                t = t >> 1;
            }
            var t = j;
            for (var i = 0; i < ignoreableInputLabels.length; i++) {
                values.push(((t & 1) != 0));
                t = t >> 1;
            }
            for (var i = 0; i < values.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand) $(thd).addClass("thick");
                $(thd).addClass(values[i] ? "one" : "zero");
                $(thd).text(values[i] ? "1" : "0");
                $(trid).append(thd);
            }
            count++;
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
        for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
            var trod = document.createElement("tr");
            $(trod).addClass("tr" + count);
            $(trod).addClass("trall");
            $(tableOutput).append(trod);
            var values: boolean[] = [];
            var t = k;
            for (var i = 0; i < inputLabels.length; i++) {
                values.push(((t & 1) != 0));
                t = t >> 1;
            }
            var t = j;
            for (var i = 0; i < ignoreableInputLabels.length; i++) {
                values.push(((t & 1) != 0));
                t = t >> 1;
            }
            var results: boolean[] = thefunc(values);
            for (var i = 0; i < outputLabels.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand) $(thd).addClass("thick");
                $(thd).addClass("result");
                $(thd).addClass(results[i] ? "one" : "zero");
                $(thd).text(results[i] ? "1" : "0");
                $(trod).append(thd);
            }
            count++;
        }
    }
}

function setup(name: string, pictureName: string, func, ignoreableInputLabels: string[], inputLabels: string[], outputLabels: string[]) {
    if (!ignoreableInputLabels) ignoreableInputLabels = [];
    if (!inputLabels) inputLabels = ["A", "B"];
    if (!outputLabels) outputLabels = ["Q"];

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
    setup("AND GATE", "AND", (input: boolean[]): boolean[] => {
        return [input[0] && input[1]];
    }, null, null, null);
}

$("#navnot").click(() => {
    setup("NOT GATE", "NOT", (input: boolean[]): boolean[] => {
        return [!input[0]];
    }, null, ["A"], null);
});
$("#navor").click(() => {
    setup("OR GATE", "OR", (input: boolean[]): boolean[] => {
        return [input[0] || input[1]];
    }, null, null, null);
});
$("#navand").click(() => {
    andsetup();
});
$("#navand4").click(() => {
    setup("AND(4Input) GATE", "AND(4Input)", (input: boolean[]): boolean[] => {
        return [input[0] && input[1] && input[2] && input[3]];
    }, null, ["A", "B", "C", "D"], null);
});
$("#navxor").click(() => {
    setup("XOR GATE", "XOR", (input: boolean[]): boolean[] => {
        return [input[0] !== input[1]];
    }, null, null, null);
});
$("#navnor").click(() => {
    setup("NOR GATE", "NOR", (input: boolean[]): boolean[] => {
        return [!(input[0] || input[1])];
    }, null, null, null);
});
$("#navnand").click(() => {
    setup("NAND GATE", "NAND", (input: boolean[]): boolean[] => {
        return [!(input[0] && input[1])];
    }, null, null, null);
});
$("#navdec").click(() => {
    setup("DECODER", "DECODER", (input: boolean[]): boolean[] => {
        var n = -1;
        if (input[3] && !input[4] && !input[5]) n = (input[0] ? 1 : 0) + (input[1] ? 2 : 0) + (input[2] ? 4 : 0)
        return [n != 0, n != 1, n != 2, n != 3, n != 4, n != 5, n != 6, n != 7];
    }, ["A", "B", "C"], ["G1", "_G2A", "_G2B"], ["_Y0", "_Y1", "_Y2", "_Y3", "_Y4", "_Y5", "_Y6", "_Y7"]);
});

$(document).on("pagecreate", function () {
    andsetup();
    update();
});
