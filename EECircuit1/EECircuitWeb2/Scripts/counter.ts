var bcdMode = false;

function getValue(): boolean[]
{
    var r: boolean[] = [];
    for (var i = 0; i < 8; i++) {
        r.push($("#bit" + i).prop("checked"));
    }
    return r;
}

function setValue(val: boolean[]) {
    for (var i = 0; i < 8; i++) {
        $("#bit" + i).prop("checked", val[i]).checkboxradio("refresh");
    }
}

function array2binaryUnsinged(val: boolean[]):number
{
    var n = 0;
    for (var i = val.length - 1; i >= 0; i--) {
        n = n * 2;
        if (val[i]) n += 1;
    }
    return n;
}

function array2binarySinged(val: boolean[]): number {
    var r = array2binaryUnsinged(val);
    if (val[val.length - 1]) {
        r = r - 256;
    }
    return r;
}

function isBCDOK(val: boolean[]) {
    var l4 = val.slice(0, 4);
    var h4 = val.slice(4, 8);
    if (array2binaryUnsinged(l4) > 9) return false;
    if (array2binaryUnsinged(h4) > 9) return false;
    return true;
}

function updateCounter() {
    var r = getValue();
    var us = array2binaryUnsinged(r);
    $("#unsigned").text(us.toString());
    $("#signed").text(array2binarySinged(r));
    var h = us.toString(16);
    if (h.length < 2) h = "0" + h;
    $("#hexa").text(h);
    var b = "";
    for (var i = 0; i < r.length; i++) {
        b = (r[i] ? "1" : "0") + b;
    }
    $("#binary").text(b);

    var ok = (!bcdMode) || isBCDOK(r);
    $("#navcountup").prop("disabled", !ok);
    $("#navcountdown").prop("disabled", !ok);
    $(".ui-content").css("background-color", ok ? "" : "Red");
}

$(".bit").click(() => {
    updateCounter();
});

function incrementBinarySub(digit:number, val: boolean[]): boolean[]
{
    if (digit >= val.length) return val;
    if (val[digit] == false)
    {
        val[digit] = true;
        return val;
    }
    val[digit] = false;
    return incrementBinarySub(digit+1,val);
}
function incrementBinary(val: boolean[]): boolean[]
{
    return incrementBinarySub(0, val);
}

function decrementBinarySub(digit: number, val: boolean[]): boolean[] {
    if (digit >= val.length) return val;
    if (val[digit] == true) {
        val[digit] = false;
        return val;
    }
    val[digit] = true;
    return decrementBinarySub(digit + 1, val);
}

function decrementBinary(val: boolean[]): boolean[]
{
    return decrementBinarySub(0, val);
}

function incrementBCD(val: boolean[]): boolean[] {
    var l4 = val.slice(0, 4);
    var h4 = val.slice(4, 8);
    l4 = incrementBinary(l4);
    if (array2binaryUnsinged(l4) > 9) {
        l4 = [false, false, false, false];
        h4 = incrementBinary(h4);
        if (array2binaryUnsinged(h4) > 9) {
            h4 = [false, false, false, false];
        }
    }
    return l4.concat(h4);
}

function decrementBCD(val: boolean[]): boolean[] {
    var l4 = val.slice(0, 4);
    var h4 = val.slice(4, 8);
    if (array2binaryUnsinged(l4) == 0) {
        l4 = [true, false, false, true];
        if (array2binaryUnsinged(h4) == 0) {
            h4 = [true, false, false, true];
        }
        else {
            h4 = decrementBinary(h4);
        }
    }
    else {
        l4 = decrementBinary(l4);
    }
    return l4.concat(h4);
}

$("#navcountup").click(() => {
    var r = getValue();
    if (bcdMode)
        r = incrementBCD(r);
    else
        r = incrementBinary(r);
    setValue(r);
    updateCounter();
});

$("#navcountdown").click(() => {
    var r = getValue();
    if (bcdMode)
        r = decrementBCD(r);
    else
        r = decrementBinary(r);
    setValue(r);
    updateCounter();
});

$("#navreset").click(() => {
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

$("#navbin").click(() => {
    binarySetup();
});

$("#navbcd").click(() => {
    $("#simname").text("BCD Counter");
    bcdMode = true;
});

$(document).on("pagecreate", function () {
    binarySetup();
    updateCounter();
});
