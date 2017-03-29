var SR;
(function (SR) {
    var paraMode = false;
    var current = [];
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
        var us = array2binaryUnsinged(current);
        $("#unsigned").text(us.toString());
        $("#signed").text(array2binarySinged(current));
        var h = us.toString(16);
        if (h.length < 2)
            h = "0" + h;
        $("#hexa").text(h);
        var b = "";
        for (var i = 0; i < current.length; i++) {
            b = (current[i] ? "1" : "0") + b;
        }
        $("#binary").text(b);
    }
    function updateShifts() {
        var s = "";
        for (var i = 0; i < current.length; i++) {
            if (current[i]) {
                s = "●" + s;
            }
            else {
                s = "○" + s;
            }
        }
        $("#shifts").text(s);
    }
    function updateRegister(ar) {
        current = ar;
        updateShifts();
        updateCounter();
    }
    function isWithC() {
        return $("#withC").prop("checked");
    }
    function isRotate() {
        return $("#rot").prop("checked");
    }
    function SInput() {
        return $("#sin").prop("checked");
    }
    $("#navleft").click(function () {
        var lastBit7 = current[7];
        for (var i = 6; i >= 0; i--) {
            current[i + 1] = current[i];
        }
        if (isRotate()) {
            if (isWithC())
                current[0] = $("#sout").text() == "●";
            else
                current[0] = lastBit7;
        }
        else
            current[0] = SInput();
        updateRegister(current);
        $("#sout").text(lastBit7 ? "●" : "○");
    });
    $("#navright").click(function () {
        var lastBit0 = current[0];
        for (var i = 0; i < 7; i++) {
            current[i] = current[i + 1];
        }
        if (isRotate()) {
            if (isWithC())
                current[7] = $("#sout").text() == "●";
            else
                current[7] = lastBit0;
        }
        else
            current[7] = SInput();
        updateRegister(current);
        $("#sout").text(lastBit0 ? "●" : "○");
    });
    $("#loadValue").click(function () {
        updateRegister(getValue());
    });
    $("#navreset").click(function () {
        var r = [];
        for (var i = 0; i < 8; i++) {
            r.push(false);
        }
        setValue(r);
        updateRegister([false, false, false, false, false, false, false, false]);
    });
    function parallelSetup() {
        paraMode = true;
        $("#simname").text("Parallel Input Shift Register");
        $("#logicname").text("Parallel Input Shift Register");
        $("#loadValueHolder").show();
        $("#sin").hide();
        $("#sinlabel").hide();
        $("#setpara").show();
        updateCounter();
    }
    function updateMode() {
        var s = "";
        if (isWithC()) {
            s = " w/ Carry";
        }
        if (isRotate()) {
            $("#mode").text("Rotate" + s);
            $("#sin").prop("disabled", true);
        }
        else {
            $("#mode").text("Shift" + s);
            $("#sin").prop("disabled", false);
        }
    }
    $("#rot").click(function () {
        updateMode();
    });
    $("#withC").click(function () {
        updateMode();
    });
    $("#navpara").click(function () {
        parallelSetup();
    });
    $("#navseri").click(function () {
        paraMode = false;
        $("#simname").text("Serial Input Shift Register");
        $("#logicname").text("Serial Input Shift Register");
        $("#loadValueHolder").hide();
        $("#sin").show();
        $("#sinlabel").show();
        $("#setpara").hide();
        $("#mode").text("");
        updateCounter();
    });
    $(document).on("pagecreate", function () {
        parallelSetup();
        updateRegister([false, false, false, false, false, false, false, false]);
        updateMode();
    });
})(SR || (SR = {}));
//# sourceMappingURL=sr.js.map