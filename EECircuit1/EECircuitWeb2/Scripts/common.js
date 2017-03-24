var Logic;
(function (Logic) {
    Logic[Logic["H"] = 0] = "H";
    Logic[Logic["L"] = 1] = "L";
    Logic[Logic["Z"] = 2] = "Z";
    Logic[Logic["Invert0"] = 3] = "Invert0"; // for overline Q
})(Logic || (Logic = {}));
function logicToString(val) {
    if (val == Logic.L)
        return "L";
    if (val == Logic.H)
        return "H";
    return "Z";
}
function logicToBoolean(val) {
    return val == Logic.H;
}
function stringToLogic(val) {
    if (val == "L")
        return Logic.L;
    if (val == "H")
        return Logic.H;
    return Logic.Z;
}
function booleanToLogic(val) {
    if (val)
        return Logic.H;
    return Logic.L;
}
function booleanToLogicArray(ary) {
    var r = [];
    for (var i = 0; i < ary.length; i++) {
        r.push(ary[i] ? Logic.H : Logic.L);
    }
    return r;
}
//# sourceMappingURL=common.js.map