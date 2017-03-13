function update() {
    var r = thefunc($("#checka").prop('checked'), $("#checkb").prop('checked'));
    $("#checkr").prop('checked', r);
    $("#checkr").checkboxradio("refresh");
}
$("#checka").click(update);
$("#checkb").click(update);
var thefunc;
function setup(name, func) {
    $("#logicname").text(name);
    thefunc = func;
    $("#t00").text(func(0, 0));
    $("#t01").text(func(0, 1));
    $("#t10").text(func(1, 0));
    $("#t11").text(func(1, 1));
}
$("#navor").click(function () {
    setup("OR", function (a, b) {
        return a || b;
    });
});
$("#navand").click(function () {
    setup("AND", function (a, b) {
        return a && b;
    });
});
//# sourceMappingURL=logic.js.map