var logic;
(function (logic) {
    var lastInputState;
    function update() {
        if (!thefunc)
            return;
        var input = [];
        for (var i = 0; i < checkCount; i++) {
            input.push(booleanToLogic($("#check" + i).prop("checked")));
        }
        var active = 0;
        for (var i = 0; i < checkCount; i++) {
            if (input[i] == Logic.H)
                active += Math.pow(2, i);
        }
        $(".trall").removeClass("active");
        $(".tr" + active).addClass("active");
        var output = thefunc(input);
        lastInputState = input;
        for (var i = 0; i < output.length; i++) {
            var val = output[i];
            if (val == null)
                continue; // unchanged
            if (val == Logic.Invert0) { // for overline Q
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
    function setupInputChecks(inputLabels) {
        lastInputState = [];
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
            lastInputState.push(currentState[i]);
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
            $(img).attr("src", "data:image/png;base64,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");
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
    var LogicTableUnit = /** @class */ (function () {
        function LogicTableUnit() {
            this.outputValues = [];
            this.canShurink = false;
        }
        return LogicTableUnit;
    }());
    var LogicTable = /** @class */ (function () {
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
                    inputValues.push(booleanToLogic((t & 1) != 0));
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
                    values.push(booleanToLogic((t & 1) != 0));
                    t = t >> 1;
                }
                for (var i = 0; i < values.length; i++) {
                    var thd = document.createElement("td");
                    $(thd).addClass("border");
                    if (expand)
                        $(thd).addClass("thick");
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
                    var values = [];
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
                        if (expand)
                            $(thd).addClass("thick");
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
                var results = logicTable.logicTables[j].outputValues[0];
                for (var i = 0; i < outputLabels.length; i++) {
                    var thd = document.createElement("td");
                    $(thd).addClass("border");
                    if (expand)
                        $(thd).addClass("thick");
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
                    var results = logicTable.logicTables[j].outputValues[k];
                    for (var i = 0; i < outputLabels.length; i++) {
                        var thd = document.createElement("td");
                        $(thd).addClass("border");
                        if (expand)
                            $(thd).addClass("thick");
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
        $("#simname").text(name + "・Simulator");
        $("#tablename").text(name + " Truth Table(真理表)");
        setupInputChecks(ignoreableInputLabels.concat(inputLabels));
        setupOutputFlags(outputLabels);
        var table = createLogicalTable(ignoreableInputLabels, inputLabels, outputLabels);
        optimizeTable(table);
        createHtmlTable(table, ignoreableInputLabels, inputLabels, outputLabels);
        update();
    }
    function andsetup() {
        setup("AND GATE", "AND", function (input) {
            return [booleanToLogic(logicToBoolean(input[0]) && logicToBoolean(input[1]))];
        }, null, null, null);
    }
    $("#navnot").click(function () {
        setup("NOT GATE", "NOT", function (input) {
            if (input[0] == Logic.Z)
                return [Logic.Z];
            return [booleanToLogic(!logicToBoolean(input[0]))];
        }, null, ["A"], null);
    });
    $("#navoc").click(function () {
        setup("OPEN COLLECTOR NOT GATE", "OCNOT", function (input) {
            if (input[0] == Logic.L)
                return [Logic.H];
            return [Logic.Z];
        }, null, ["A"], null);
    });
    $("#navor").click(function () {
        setup("OR GATE", "OR", function (input) {
            return [booleanToLogic(logicToBoolean(input[0]) || logicToBoolean(input[1]))];
        }, null, null, null);
    });
    $("#navand").click(function () {
        andsetup();
    });
    $("#navand4").click(function () {
        setup("AND(4Input) GATE", "AND(4Input)", function (input) {
            return [booleanToLogic(logicToBoolean(input[0]) && logicToBoolean(input[1]) && logicToBoolean(input[2]) && logicToBoolean(input[3]))];
        }, null, ["A", "B", "C", "D"], null);
    });
    $("#navxor").click(function () {
        setup("XOR GATE", "XOR", function (input) {
            return [booleanToLogic(logicToBoolean(input[0]) !== logicToBoolean(input[1]))];
        }, null, null, null);
    });
    $("#navnor").click(function () {
        setup("NOR GATE", "NOR", function (input) {
            return [booleanToLogic(!(logicToBoolean(input[0]) || logicToBoolean(input[1])))];
        }, null, null, null);
    });
    $("#navnand").click(function () {
        setup("NAND GATE", "NAND", function (input) {
            return [booleanToLogic(!(logicToBoolean(input[0]) && logicToBoolean(input[1])))];
        }, null, null, null);
    });
    $("#navdec").click(function () {
        setup("DECODER", "DECODER", function (input) {
            var n = -1;
            if (logicToBoolean(input[3]) && !logicToBoolean(input[4]) && !logicToBoolean(input[5])) {
                n = (logicToBoolean(input[0]) ? 1 : 0) + (logicToBoolean(input[1]) ? 2 : 0) + (logicToBoolean(input[2]) ? 4 : 0);
            }
            return booleanToLogicArray([n != 0, n != 1, n != 2, n != 3, n != 4, n != 5, n != 6, n != 7]);
        }, ["A", "B", "C"], ["G1", "_G2A", "_G2B"], ["_Y0", "_Y1", "_Y2", "_Y3", "_Y4", "_Y5", "_Y6", "_Y7"]);
    });
    $("#navsel").click(function () {
        setup("SELECTOR", "SELECTOR", function (input) {
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
        }, ["S1", "S2", "L0", "L1", "L2", "L3"], ["_E"], ["Z"]);
    });
    $("#navadd").click(function () {
        setup("ADD with Carry", "ADDER", function (input) {
            var a = logicToBoolean(input[0]) ? 1 : 0;
            var b = logicToBoolean(input[1]) ? 1 : 0;
            var c = logicToBoolean(input[2]) ? 1 : 0;
            var sum = a + b + c;
            var s = false;
            var cout = false;
            if ((sum & 1) != 0)
                s = true;
            if ((sum & 2) != 0)
                cout = true;
            return booleanToLogicArray([s, cout]);
        }, null, ["A", "B", "C-in"], ["S", "C-out"]);
    });
    $("#nav2comp").click(function () {
        setup("Two's complement (3 digit)", "TWOCOMP", function (input) {
            var a1 = logicToBoolean(input[0]) ? 1 : 0;
            var a2 = logicToBoolean(input[1]) ? 2 : 0;
            var a3 = logicToBoolean(input[2]) ? 4 : 0;
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
            return booleanToLogicArray([z1, z2, z3]);
        }, null, ["A1", "A2", "A3"], ["Z1", "Z2", "Z3"]);
    });
    $("#navbuf").click(function () {
        setup("3 STATE BUFFER", "TRIBUFFER", function (input) {
            if (input[1] == Logic.L)
                return [input[0]];
            return [Logic.Z];
        }, null, ["A", "_E"], ["Y"]);
    });
    $("#navdff").click(function () {
        setup("D FLIPFLOP", "DFF", function (input) {
            if (input[1] != lastInputState[1]) {
                if (input[1] == Logic.H)
                    return [input[0], Logic.Invert0];
            }
            return [null, Logic.Invert0];
        }, null, ["D", "C"], ["Q", "_Q"]);
        // rewriting table
        $("#tableroot").empty();
        $("#tableroot").append($("#dfftable").html());
    });
    $("#navtff").click(function () {
        setup("T FLIPFLOP", "TFF", function (input) {
            if (input[0] == Logic.H)
                return [
                    $("#flag0").hasClass("flag-off") ? Logic.H : Logic.L, Logic.Invert0
                ];
            return [null, Logic.Invert0];
        }, null, ["T"], ["Q", "_Q"]);
        // rewriting table
        $("#tableroot").empty();
        $("#tableroot").append($("#tfftable").html());
    });
    $("#navjkff").click(function () {
        setup("JK FLIPFLOP", "JKFF", function (input) {
            var q = !$("#flag0").hasClass("flag-off");
            if (input[0] == Logic.L && input[1] == Logic.L && !q)
                return [Logic.L, Logic.Invert0];
            if (input[0] == Logic.L && input[1] == Logic.L && q)
                return [Logic.H, Logic.Invert0];
            if (input[0] == Logic.L && input[1] == Logic.H)
                return [Logic.L, Logic.Invert0];
            if (input[0] == Logic.H && input[1] == Logic.L)
                return [Logic.H, Logic.Invert0];
            if (input[0] == Logic.H && input[1] == Logic.H && !q)
                return [Logic.H, Logic.Invert0];
            if (input[0] == Logic.H && input[1] == Logic.H && q)
                return [Logic.L, Logic.Invert0];
            // 来ないはずである
        }, null, ["J", "K"], ["Q", "_Q"]);
        // rewriting table
        $("#tableroot").empty();
        $("#tableroot").append($("#jkfftable").html());
    });
    $("#navrsff").click(function () {
        setup("RS FLIPFLOP", "RSFF", function (input) {
            var q = !$("#flag0").hasClass("flag-off");
            if (input[0] == Logic.L && input[1] == Logic.L)
                return [q ? Logic.H : Logic.L, Logic.Invert0];
            if (input[0] == Logic.L && input[1] == Logic.H)
                return [Logic.L, Logic.Invert0];
            if (input[0] == Logic.H && input[1] == Logic.L)
                return [Logic.H, Logic.Invert0];
            if (input[0] == Logic.H && input[1] == Logic.H)
                return [(Math.random() < 0.5) ? Logic.L : Logic.H, Logic.Invert0];
            // 来ないはずである
        }, null, ["S", "R"], ["Q", "_Q"]);
        // rewriting table
        $("#tableroot").empty();
        $("#tableroot").append($("#rsfftable").html());
    });
    $("#navdlatch").click(function () {
        setup("D LATCH", "DLATCH", function (input) {
            var q = !$("#flag0").hasClass("flag-off");
            if (input[1] == Logic.L)
                return [q ? Logic.H : Logic.L, Logic.Invert0];
            if (input[1] == Logic.H && input[0] == Logic.L)
                return [Logic.L, Logic.Invert0];
            if (input[1] == Logic.H && input[0] == Logic.H)
                return [Logic.H, Logic.Invert0];
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
})(logic || (logic = {}));
//# sourceMappingURL=logic.js.map