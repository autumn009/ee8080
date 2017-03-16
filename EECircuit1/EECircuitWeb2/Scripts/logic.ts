
function update() {
    if (!thefunc) return;

    var input: boolean[] = [];
    for (var i = 0; i < checkCount; i++) {
        input.push($("#check" + i).prop("checked"));
    }
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
        $(label).text(inputLabels[i]);
        $(label).css("width","2em");
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
    }
}

var thefunc;

function setup(name: string, func, inputLabels: string[], outputLabels: string[]) {
    if (!inputLabels) inputLabels = ["A","B"];
    if (!outputLabels) outputLabels = ["Q"];

    $("#logicname").text(name);
    $("#logicicon").attr("src", "/Content/images/gate/" + name + ".png");
    $("#simname").text(name +"ゲート・シミュレーター");
    $("#tablename").text(name + "ゲート真理表");

    setupInputChecks(inputLabels);
    setupOutputFlags(outputLabels);
    update();

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
        var values: boolean[] = [];
        var t = j;
        for (var i = 0; i < inputLabels.length; i++) {
            values.unshift(((t & 1) != 0));
            t = t >> 1;
        }
        for (var i = 0; i < inputLabels.length; i++) {
            var thd = document.createElement("td");
            $(thd).addClass("border");
            $(thd).addClass("thick");
            $(thd).text(values[i]?"1":"0");
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
        $(tho).text(outputLabels[i]);
        $(tho).addClass("borderh");
        $(tho).addClass("result");
        $(troh).append(tho);
    }

    for (var j = 0; j < totalCount; j++) {
        var trod = document.createElement("tr");
        $(tableOutput).append(trod);
        var values: boolean[] = [];
        var t = j;
        for (var i = 0; i < inputLabels.length; i++) {
            values.unshift(((t & 1) != 0));
            t = t >> 1;
        }
        var results: boolean[] = thefunc(values);
        for (var i = 0; i < outputLabels.length; i++) {
            var thd = document.createElement("td");
            $(thd).addClass("border");
            $(thd).addClass("thick");
            $(thd).addClass("result");
            $(thd).text(results[i] ? "1" : "0");
            $(trod).append(thd);
        }
    }
}

function andsetup() {
    setup("AND", (input: boolean[]): boolean[] => {
        return [input[0] && input[1]];
    }, null, null);
}

$("#navor").click(() => {
    setup("OR", (input: boolean[]): boolean[] => {
        return [input[0] || input[1]];
    }, null, null);
});
$("#navand").click(() => {
    andsetup();
});
$("#navand4").click(() => {
    setup("AND(4Input)", (input: boolean[]): boolean[] => {
        return [input[0] && input[1] && input[2] && input[3]];
    }, ["A", "B", "C", "D"], null);
});

$(document).on("pagecreate", function () {
    andsetup();
    update();
});
