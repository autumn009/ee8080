function and(a, b) {
    return a && b;
}
function update() {
    var r = and($("#checka").prop('checked'), $("#checkb").prop('checked'));
    $("#checkr").prop('checked', r);
    $("#checkr").checkboxradio("refresh");
}
$("#checka").click(update);
$("#checkb").click(update);
//# sourceMappingURL=logics.js.map