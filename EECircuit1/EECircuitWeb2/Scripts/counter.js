var bcdMode = false;
function getValue() {
    var r = [];
    for (var i = 0; i < 8; i++) {
        r.push($("#bit" + i).prop("checked"));
    }
    return r;
}
function setValue(val) {
    for (var i = 0; i < 8; i++) {
        $("#bit" + i).prop("checked", val[i]).checkboxradio("refresh");
    }
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
function updateCounter() {
    var r = getValue();
    var us = array2binaryUnsinged(r);
    $("#unsigned").text(us.toString());
    $("#signed").text(array2binarySinged(r));
    var h = us.toString(16);
    if (h.length < 2)
        h = "0" + h;
    $("#hexa").text(h);
    var b = "";
    for (var i = 0; i < r.length; i++) {
        b = (r[i] ? "1" : "0") + b;
    }
    $("#binary").text(b);
}
$(".bit").click(function () {
    updateCounter();
});
function incrementBinarySub(digit, val) {
    if (digit >= 8)
        return val;
    if (val[digit] == false) {
        val[digit] = true;
        return val;
    }
    val[digit] = false;
    return incrementBinarySub(digit + 1, val);
}
function incrementBinary(val) {
    return incrementBinarySub(0, val);
}
$("#navcountup").click(function () {
    var r = getValue();
    r = incrementBinary(r);
    setValue(r);
    updateCounter();
});
$("#navcountdown").click(function () {
    updateCounter();
});
$("#navreset").click(function () {
    var r = [];
    for (var i = 0; i < 8; i++) {
        r.push(false);
    }
    setValue(r);
    updateCounter();
});
function binarySetup() {
    $("#simname").text("Binary Counter");
    bcdMode = false;
}
$("#navbin").click(function () {
    binarySetup();
});
$("#navbcd").click(function () {
    $("#simname").text("BCD Counter");
    bcdMode = true;
});
$(document).on("pagecreate", function () {
    binarySetup();
    updateCounter();
});
//# sourceMappingURL=counter.js.map