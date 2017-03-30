
namespace SR {
    var paraMode = false;
    var current: boolean[] = [];

    function getValue(): boolean[] {
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

    function updateCounter() {
        var us = array2binaryUnsinged(current);
        $("#unsigned").text(us.toString());
        $("#signed").text(array2binarySinged(current));
        var h = us.toString(16);
        if (h.length < 2) h = "0" + h;
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

    function updateRegister(ar: boolean[])
    {
        current = ar;
        updateShifts();
        updateCounter();
    }

    function isWithC(): boolean {
        return $("#withC").prop("checked");
    }

    function isRotate(): boolean {
        return $("#rot").prop("checked");
    }

    function SInput(): boolean {
        return $("#sin").prop("checked");
    }

    $("#navleft").click(() => {
        var lastBit7 = current[7];
        for (var i = 6; i >= 0; i--) {
            current[i + 1] = current[i];
        }
        if (isRotate())
        {
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
    
    $("#navright").click(() => {
        var lastBit0 = current[0];
        for (var i = 0; i < 7; i++) {
            current[i] = current[i + 1];
        }
        if (isRotate())
        {
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

    $("#loadValue").click(() => {
        updateRegister(getValue());
    });

    $("#navreset").click(() => {
        var r = [];
        for (var i = 0; i < 8; i++) {
            r.push(false);
        }
        setValue(r);
        updateRegister([false, false, false, false, false, false, false, false])
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

    $("#rot").click(() => {
        updateMode();
    });

    $("#withC").click(() => {
        updateMode();
    });

    $("#navpara").click(() => {
        parallelSetup();
    });

    $("#navseri").click(() => {
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
        updateRegister([false, false, false, false, false, false, false, false])
        updateMode();
    });
}
