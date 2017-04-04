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
function array2binaryUnsinged(val) {
    var n = 0;
    for (var i = val.length - 1; i >= 0; i--) {
        n = n * 2;
        if (val[i])
            n += 1;
    }
    return n;
}
function array2binarySinged(val) {
    var r = array2binaryUnsinged(val);
    if (val[val.length - 1]) {
        r = r - 256;
    }
    return r;
}
function createBitsString(current) {
    var s = "";
    for (var i = 0; i < current.length; i++) {
        if (current[i]) {
            s = "●" + s;
        }
        else {
            s = "○" + s;
        }
    }
    return s;
}
function dec2hex(n, width) {
    var x;
    if (n == undefined)
        x = "XXXX";
    else
        x = n.toString(16);
    var s = "000" + x;
    return s.substring(s.length - width, s.length).toUpperCase();
}
function lowByte(v) {
    return v & 255;
}
function highByte(v) {
    return (v >> 8) & 255;
}
function incrementAddress(a) {
    var a = a + 1;
    if (a >= 0x10000)
        return 0;
    return a;
}
//# sourceMappingURL=common.js.map