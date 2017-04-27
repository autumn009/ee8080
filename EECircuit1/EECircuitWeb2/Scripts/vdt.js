var vdt;
(function (vdt) {
    var shiftState = false;
    function setKeyboardShiftState(isShift) {
        shiftState = isShift;
        $(".ui-btn-a").removeClass("ui-btn-a");
        $(".ui-btn-b").removeClass("ui-btn-b");
        $(".vkshifts").addClass("ui-btn-" + (isShift ? "b" : "a"));
        $(".vkey").each(function () {
            var keytop = "";
            if (isShift) {
                keytop = $(this).attr("data-shift");
            }
            if (!keytop) {
                keytop = $(this).attr("data-normal");
            }
            $(this).text(keytop);
        });
    }
    function outputString(s) {
        for (var i = 0; i < s.length; i++) {
            outputChar(s.charCodeAt(i));
        }
    }
    vdt.outputString = outputString;
    function outputChar(charCode) {
        if (charCode < 0x20 || charCode > 0x7f) {
            charCode = "?".charCodeAt(0);
        }
        internalOutputChar(charCode);
        cursorNext();
    }
    vdt.outputChar = outputChar;
    var inputFunc = null;
    function inputChar(done) {
        inputFunc = function (code) {
            inputFunc = null;
            done(code);
        };
    }
    vdt.inputChar = inputChar;
    function cursorNext() {
        cursorX++;
        if (cursorX < 80)
            return;
        cursorX = 0;
        cursorY++;
        if (cursorX < 24)
            return;
        cursorY = 23;
        scrollUp();
    }
    var space80 = "                                                                                ";
    function scrollUp() {
        for (var i = 0; i < 22; i++) {
            var s = $("#vline" + (i + 1).toString()).text();
            $("#vline" + i.toString()).text(s);
        }
        $("#vline23").text(space80);
    }
    var cursorX = 0;
    var cursorY = 0;
    function internalOutputChar(charCode) {
        var target = $("#vline" + cursorY);
        var s = target.text();
        s = s.substring(0, cursorX)
            + String.fromCharCode(charCode)
            + s.substring(cursorX + 1, 80);
        target.text(s);
    }
    function echoback() {
        inputChar(function (code) {
            outputChar(code);
            echoback();
        });
    }
    function commonInputRow(evt, code) {
        if ($("#con").css("display") == "none")
            return;
        if (code == null) {
            if (evt.ctrlKey) {
                if (evt.keyCode >= 0x41 && evt.keyCode <= 0x5a) {
                    code = evt.keyCode - 0x40;
                }
                else
                    return;
            }
            else if (evt.keyCode == 8 // TAB
                || evt.keyCode == 9 // BS
            ) {
                code = evt.keyCode;
            }
            else if (evt.keyCode == 16) {
                setKeyboardShiftState(true);
                return;
            }
            else
                return;
        }
        if (inputFunc)
            inputFunc(code);
        return false;
    }
    function commonInputRowUp(evt, code) {
        if ($("#con").css("display") == "none")
            return;
        if (code == null) {
            if (evt.keyCode == 16) {
                setKeyboardShiftState(false);
            }
            else
                return;
        }
        return false;
    }
    $(document).on("pagecreate", function () {
        setKeyboardShiftState(false);
        $(document).keydown(function (evt) {
            {
                return commonInputRow(evt, null);
            }
        });
        $(document).keyup(function (evt) {
            {
                return commonInputRowUp(evt, null);
            }
        });
        $("body").keypress(function (evt) {
            return commonInputRow(evt, evt.keyCode);
        });
        $("#vklshift").click(function () {
            setKeyboardShiftState(!shiftState);
        });
        $("#vkrshift").click(function () {
            setKeyboardShiftState(!shiftState);
        });
        $(".vdtline").text(space80);
        outputString("ADM-3A Emulation Ready\r\n");
        echoback();
    });
})(vdt || (vdt = {}));
//# sourceMappingURL=vdt.js.map