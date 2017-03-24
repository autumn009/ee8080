
function update() {
    if (!thefunc) return;

    var input: Logic[] = [];
    for (var i = 0; i < checkCount; i++) {
        input.push(booleanToLogic($("#check" + i).prop("checked")));
    }
    var active: number = 0;
    for (var i = 0; i < checkCount; i++) {
        if (input[i] == Logic.H) active += Math.pow(2, i);
    }
    $(".trall").removeClass("active");
    $(".tr" + active).addClass("active");
    var output: Logic[] = thefunc(input);
    for (var i = 0; i < output.length; i++) {
        var val = output[i];
        if (val == null) continue;    // unchanged
        if (val == Logic.Invert0) {     // for overline Q
            var img0 = $("#flag0");
            if (img0.hasClass("flag-on"))
                val = Logic.L;
            else if (img0.hasClass("flag-off"))
                val = Logic.H;
            else
                val = Logic.Z;
        }
        var img = $("#flag" + i);
        img.removeClass("flag-on");
        img.removeClass("flag-off");
        img.removeClass("flag-highz");
        if (val == Logic.L)
            img.addClass("flag-off");
        else if (val == Logic.H)
            img.addClass("flag-on");
        else
            img.addClass("flag-highz");
    }
}

var checkCount = 0;

function setupInputChecks(inputLabels: string[]) {
    var newCount: number = inputLabels.length;
    var currentCount = checkCount;
    var currentState: Logic[] = [];
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
    public outputValues: Logic[][] = [];
    public canShurink: boolean = false;
}

class LogicTable {
    public logicTables: LogicTableUnit[] = [];
}

function createLogicalTable(ignoreableInputLabels: string[], inputLabels: string[], outputLabels: string[]): LogicTable {
    var table = new LogicTable();
    var count: number = 0;
    for (var i = 0; i < Math.pow(2,inputLabels.length); i++) {
        var unit = new LogicTableUnit();
        for (var j = 0; j < Math.pow(2, ignoreableInputLabels.length); j++) {
            var inputValues: Logic[] = [];
            var t = count++;
            for (var k = 0; k < inputLabels.length + ignoreableInputLabels.length; k++) {
                inputValues.push(booleanToLogic((t & 1) != 0));
                t = t >> 1;
            }
            var n: Logic[] = thefunc(inputValues);
            unit.outputValues.push(n);
        }
        table.logicTables.push(unit);
    }
    return table;
}
function optimizeTable(table: LogicTable) {
    for (var i = 0; i < table.logicTables.length; i++) {
        var t: number[] = [];
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

function createHtmlTable(logicTable: LogicTable, ignoreableInputLabels: string[], inputLabels: string[], outputLabels: string[]) {
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
                if (expand) $(thd).addClass("thick");
                $(thd).addClass("ex");
                $(thd).text("X");
                $(trid).append(thd);
            }
            var values: Logic[] = [];
            var t = j;
            for (var i = 0; i < inputLabels.length; i++) {
                values.push(booleanToLogic((t & 1) != 0));
                t = t >> 1;
            }
            for (var i = 0; i < values.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand) $(thd).addClass("thick");
                switch (values[i]) {
                    case Logic.L:
                        $(thd).addClass("zero");
                        $(thd).text("0");
                        break;
                    case Logic.H:
                        $(thd).addClass("one");
                        $(thd).text("1");
                        break;
                    default:
                        $(thd).addClass("highz");
                        $(thd).text("Hi-Z");
                        break;
                }
                $(trid).append(thd);
            }
        }
        else {
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                var trid = document.createElement("tr");
                $(trid).addClass("tr" + count);
                $(trid).addClass("trall");
                $(tableInput).append(trid);
                var values: Logic[] = [];
                var t = k;
                for (var i = 0; i < ignoreableInputLabels.length; i++) {
                    values.push(booleanToLogic((t & 1) != 0));
                    t = t >> 1;
                }
                var t = j;
                for (var i = 0; i < inputLabels.length; i++) {
                    values.push(booleanToLogic((t & 1) != 0));
                    t = t >> 1;
                }
                for (var i = 0; i < values.length; i++) {
                    var thd = document.createElement("td");
                    $(thd).addClass("border");
                    if (expand) $(thd).addClass("thick");
                    switch (values[i]) {
                        case Logic.L:
                            $(thd).addClass("zero");
                            $(thd).text("0");
                            break;
                        case Logic.H:
                            $(thd).addClass("one");
                            $(thd).text("1");
                            break;
                        default:
                            $(thd).addClass("highz");
                            $(thd).text("Hi-Z");
                            break;
                    }
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
            var results: Logic[] = logicTable.logicTables[j].outputValues[0];
            for (var i = 0; i < outputLabels.length; i++) {
                var thd = document.createElement("td");
                $(thd).addClass("border");
                if (expand) $(thd).addClass("thick");
                $(thd).addClass("result");
                switch (results[i]) {
                    case Logic.L:
                        $(thd).addClass("zero");
                        $(thd).text("0");
                        break;
                    case Logic.H:
                        $(thd).addClass("one");
                        $(thd).text("1");
                        break;
                    default:
                        $(thd).addClass("highz");
                        $(thd).text("Hi-Z");
                        break;
                }
                $(trod).append(thd);
            }
        }
        else {
            for (var k = 0; k < logicTable.logicTables[j].outputValues.length; k++) {
                var trod = document.createElement("tr");
                $(trod).addClass("tr" + count);
                $(trod).addClass("trall");
                $(tableOutput).append(trod);
                var results: Logic[] = logicTable.logicTables[j].outputValues[k];
                for (var i = 0; i < outputLabels.length; i++) {
                    var thd = document.createElement("td");
                    $(thd).addClass("border");
                    if (expand) $(thd).addClass("thick");
                    $(thd).addClass("result");
                    switch (results[i]) {
                        case Logic.L:
                            $(thd).addClass("zero");
                            $(thd).text("0");
                            break;
                        case Logic.H:
                            $(thd).addClass("one");
                            $(thd).text("1");
                            break;
                        default:
                            $(thd).addClass("highz");
                            $(thd).text("Hi-Z");
                            break;
                    }

                    $(trod).append(thd);
                }
                count++;
            }
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
    setup("AND GATE", "AND", (input: Logic[]): Logic[] => {
        return [booleanToLogic(logicToBoolean(input[0]) && logicToBoolean(input[1]))];
    }, null, null, null);
}

$("#navnot").click(() => {
    setup("NOT GATE", "NOT", (input: Logic[]): Logic[] => {
        if (input[0] == Logic.Z) return [Logic.Z];
        return [booleanToLogic(!logicToBoolean(input[0]))];
    }, null, ["A"], null);
});
$("#navoc").click(() => {
    setup("OPEN CORRECTOR NOT GATE", "OCNOT", (input: Logic[]): Logic[] => {
        if (input[0] == Logic.L) return [Logic.H];
        return [Logic.Z];
    }, null, ["A"], null);
});
$("#navor").click(() => {
    setup("OR GATE", "OR", (input: Logic[]): Logic[] => {
        return [booleanToLogic(logicToBoolean(input[0]) || logicToBoolean(input[1]))];
    }, null, null, null);
});
$("#navand").click(() => {
    andsetup();
});
$("#navand4").click(() => {
    setup("AND(4Input) GATE", "AND(4Input)", (input: Logic[]): Logic[] => {
        return [booleanToLogic(logicToBoolean(input[0]) && logicToBoolean(input[1]) && logicToBoolean(input[2]) && logicToBoolean(input[3]))];
    }, null, ["A", "B", "C", "D"], null);
});
$("#navxor").click(() => {
    setup("XOR GATE", "XOR", (input: Logic[]): Logic[] => {
        return [booleanToLogic(logicToBoolean(input[0]) !== logicToBoolean(input[1]))];
    }, null, null, null);
});
$("#navnor").click(() => {
    setup("NOR GATE", "NOR", (input: Logic[]): Logic[] => {
        return [booleanToLogic(!(logicToBoolean(input[0]) || logicToBoolean(input[1])))];
    }, null, null, null);
});
$("#navnand").click(() => {
    setup("NAND GATE", "NAND", (input: Logic[]): Logic[] => {
        return [booleanToLogic(!(logicToBoolean(input[0]) && logicToBoolean(input[1])))];
    }, null, null, null);
});
$("#navdec").click(() => {
    setup("DECODER", "DECODER", (input: Logic[]): Logic[] => {
        var n = -1;
        if (logicToBoolean(input[3]) && !logicToBoolean(input[4]) && !logicToBoolean(input[5])) {
            n = (logicToBoolean(input[0]) ? 1 : 0) + (logicToBoolean(input[1]) ? 2 : 0) + (logicToBoolean(input[2]) ? 4 : 0)
        }
        return booleanToLogicArray([n != 0, n != 1, n != 2, n != 3, n != 4, n != 5, n != 6, n != 7]);
    }, ["A", "B", "C"], ["G1", "_G2A", "_G2B"], ["_Y0", "_Y1", "_Y2", "_Y3", "_Y4", "_Y5", "_Y6", "_Y7"]);
});
$("#navsel").click(() => {
    setup("SELECTOR", "SELECTOR", (input: Logic[]): Logic[] => {
        if (!logicToBoolean(input[6])) {
            var n = (logicToBoolean(input[0]) ? 1 : 0) + (logicToBoolean(input[1]) ? 2 : 0);
            switch (n) {
                case 0: return [input[2]];
                case 1: return [input[3]];
                case 2: return [input[4]];
                case 3: return [input[5]];
            }
        }
        return booleanToLogicArray([false]);
    }, ["S1", "S2", "L0", "L1", "L2", "L3"], ["_E"],  ["Z"]);
});
$("#navadd").click(() => {
    setup("ADD with Carry", "ADDER", (input: Logic[]): Logic[] => {
        var a = logicToBoolean(input[0]) ? 1 : 0;
        var b = logicToBoolean(input[1]) ? 1 : 0;
        var c = logicToBoolean(input[2]) ? 1 : 0;
        var sum = a + b + c;
        var s = false;
        var cout = false;
        if ((sum & 1) != 0) s = true;
        if ((sum & 2) != 0) cout = true;
        return booleanToLogicArray([s, cout]);
    }, null, ["A", "B", "C-in"], ["S", "C-out"]);
});
$("#nav2comp").click(() => {
    setup("Two's complement (3 digit)", "TWOCOMP", (input: Logic[]): Logic[] => {
        var a1 = logicToBoolean(input[0]) ? 1 : 0;
        var a2 = logicToBoolean(input[1]) ? 2 : 0;
        var a3 = logicToBoolean(input[2]) ? 4 : 0;
        var sum = ((a1 + a2 + a3)+1) % 8;
        var z1 = false;
        var z2 = false;
        var z3 = false;
        if ((sum & 1) != 0) z1 = true;
        if ((sum & 2) != 0) z2 = true;
        if ((sum & 4) != 0) z3 = true;
        return booleanToLogicArray([z1, z2, z3]);
    }, null, ["A1", "A2", "A3"], ["Z1", "Z2", "Z3"]);
});
$("#navbuf").click(() => {
    setup("3 STATE BUFFER", "TRIBUFFER", (input: Logic[]): Logic[] => {
        if (input[1] == Logic.L) return [input[0]];
        return [Logic.Z];
    }, null, ["A", "_E"], ["Y"]);
});
$("#navdff").click(() => {
    setup("D FLIPFLOP", "DFF", (input: Logic[]): Logic[] => {
        if (input[1] == Logic.H) return [input[0], Logic.Invert0];
        return [null, Logic.Invert0];
    }, null, ["D", "C"], ["Q", "_Q"]);
    // rewriting table
    $("#tableroot").empty();
    $("#tableroot").append($("#dfftable").html());
});
$("#navtff").click(() => {
    setup("T FLIPFLOP", "TFF", (input: Logic[]): Logic[] => {
        if (input[0] == Logic.H) return [
            $("#flag0").hasClass("flag-off") ? Logic.H : Logic.L, Logic.Invert0];
        return [null, Logic.Invert0];
    }, null, ["T"], ["Q", "_Q"]);
    // rewriting table
    $("#tableroot").empty();
    $("#tableroot").append($("#tfftable").html());
});
$("#navjkff").click(() => {
    setup("JK FLIPFLOP", "JKFF", (input: Logic[]): Logic[] => {
        var q = !$("#flag0").hasClass("flag-off");
        if (input[0] == Logic.L && input[1] == Logic.L && !q) return [Logic.L, Logic.Invert0];
        if (input[0] == Logic.L && input[1] == Logic.L && q) return [Logic.H, Logic.Invert0];
        if (input[0] == Logic.L && input[1] == Logic.H) return [Logic.L, Logic.Invert0];
        if (input[0] == Logic.H && input[1] == Logic.L) return [Logic.H, Logic.Invert0];
        if (input[0] == Logic.H && input[1] == Logic.H && !q) return [Logic.H, Logic.Invert0];
        if (input[0] == Logic.H && input[1] == Logic.H && q) return [Logic.L, Logic.Invert0];
        // 来ないはずである
    }, null, ["J", "K"], ["Q", "_Q"]);
    // rewriting table
    $("#tableroot").empty();
    $("#tableroot").append($("#jkfftable").html());
});
$("#navrsff").click(() => {
    setup("RS FLIPFLOP", "RSFF", (input: Logic[]): Logic[] => {
        var q = !$("#flag0").hasClass("flag-off");
        if (input[0] == Logic.L && input[1] == Logic.L) return [q ? Logic.H : Logic.L, Logic.Invert0];
        if (input[0] == Logic.L && input[1] == Logic.H) return [Logic.L, Logic.Invert0];
        if (input[0] == Logic.H && input[1] == Logic.L) return [Logic.H, Logic.Invert0];
        if (input[0] == Logic.H && input[1] == Logic.H) return [(Math.random() < 0.5) ? Logic.L : Logic.H, Logic.Invert0];
        // 来ないはずである
    }, null, ["S", "R"], ["Q", "_Q"]);
    // rewriting table
    $("#tableroot").empty();
    $("#tableroot").append($("#rsfftable").html());
});
$("#navdlatch").click(() => {
    setup("D LATCH", "DLATCH", (input: Logic[]): Logic[] => {
        var q = !$("#flag0").hasClass("flag-off");
        if (input[1] == Logic.L) return [q ? Logic.H : Logic.L, Logic.Invert0];
        if (input[1] == Logic.H && input[0] == Logic.L) return [Logic.L, Logic.Invert0];
        if (input[1] == Logic.H && input[0] == Logic.H) return [Logic.H, Logic.Invert0];
        // 来ないはずである
    }, null, ["D", "E"], ["Q", "_Q"]);
    // rewriting table
    $("#tableroot").empty();
    $("#tableroot").append($("#dlatchtable").html());
});
$(document).on("pagecreate", function () {
    andsetup();
    update();
});
