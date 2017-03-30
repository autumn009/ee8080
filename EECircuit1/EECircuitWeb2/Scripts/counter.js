var counter;
(function (counter) {
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
    function isBCDOK(val) {
        var l4 = val.slice(0, 4);
        var h4 = val.slice(4, 8);
        if (array2binaryUnsinged(l4) > 9)
            return false;
        if (array2binaryUnsinged(h4) > 9)
            return false;
        return true;
    }
    function updateCounter() {
        var r = getValue();
        var ok = !bcdMode;
        if (isBCDOK(r)) {
            $("#bcdStatus").text("BCD NUMBER");
            $("#bcdStatus").css("color", "");
            ok = true;
        }
        else {
            $("#bcdStatus").text("NOT A BCD NUMBER");
            $("#bcdStatus").css("color", "#B8860B");
        }
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
        $("#navcountup").prop("disabled", !ok);
        $("#navcountdown").prop("disabled", !ok);
        $(".ui-content").css("background-color", ok ? "" : "DarkRed");
    }
    $(".bit").click(function () {
        updateCounter();
    });
    function incrementBinarySub(digit, val) {
        if (digit >= val.length)
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
    function decrementBinarySub(digit, val) {
        if (digit >= val.length)
            return val;
        if (val[digit] == true) {
            val[digit] = false;
            return val;
        }
        val[digit] = true;
        return decrementBinarySub(digit + 1, val);
    }
    function decrementBinary(val) {
        return decrementBinarySub(0, val);
    }
    function incrementBCD(val) {
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
    function decrementBCD(val) {
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
    $("#navcountup").click(function () {
        var r = getValue();
        if (bcdMode)
            r = incrementBCD(r);
        else
            r = incrementBinary(r);
        setValue(r);
        updateCounter();
    });
    $("#navcountdown").click(function () {
        var r = getValue();
        if (bcdMode)
            r = decrementBCD(r);
        else
            r = decrementBinary(r);
        setValue(r);
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
        $("#logicname").text("Binary Counter");
        bcdMode = false;
        updateCounter();
    }
    $("#navbin").click(function () {
        binarySetup();
    });
    $("#navbcd").click(function () {
        $("#simname").text("BCD Counter");
        $("#logicname").text("BCD Counter");
        bcdMode = true;
        updateCounter();
    });
    $(document).on("pagecreate", function () {
        binarySetup();
        updateCounter();
    });
})(counter || (counter = {}));
//# sourceMappingURL=counter.js.map