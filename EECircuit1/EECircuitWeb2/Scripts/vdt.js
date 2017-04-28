var vdt;
(function (vdt) {
    var shiftState = false;
    var ctrlState = false;
    function setKeyboardShiftState(isShift, isCtrl) {
        shiftState = isShift;
        ctrlState = isCtrl;
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
            $(this).children().text(keytop);
        });
        $("#vkctrl").addClass("ui-btn-" + (isCtrl ? "b" : "a"));
        $(".vkey").each(function () {
            var keytop = $(this).children().text();
            var active = ctrlState && keytop.length == 1 && keytop.charCodeAt(0) >= 0x40 && keytop.charCodeAt(0) <= 0x7f;
            $(this).addClass("ui-btn-" + (active ? "b" : "a"));
        });
    }
    function outputString(s) {
        for (var i = 0; i < s.length; i++) {
            outputChar(s.charCodeAt(i));
        }
    }
    vdt.outputString = outputString;
    function outputChar(charCode) {
        // todo: support escape sequence, BS, TAB
        if (charCode == 0x0d) {
            cursorX = 0;
            return;
        }
        else if (charCode == 0x0a) {
            lf();
            return;
        }
        else if (charCode < 0x20) {
            outputChar("^".charCodeAt(0));
            outputChar(charCode + 0x40);
            return;
        }
        else if (charCode > 0x7f) {
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
    function lf() {
        cursorY++;
        if (cursorY < 24)
            return;
        cursorY = 23;
        scrollUp();
    }
    function cursorNext() {
        cursorX++;
        if (cursorX < 80)
            return;
        cursorX = 0;
        lf();
    }
    var space80 = "";
    for (var i = 0; i < 80; i++) {
        space80 += "\xa0";
    }
    function scrollUp() {
        for (var i = 0; i < 23; i++) {
            var s = $("#vline" + (i + 1).toString()).text();
            $("#vline" + i.toString()).text(s);
        }
        $("#vline23").text(space80);
    }
    var cursorX = 0;
    var cursorY = 0;
    function internalOutputChar(charCode) {
        if (charCode == 0x20)
            charCode = 0xa0; // force space to nbsp
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
    function commonInputRowCode(code) {
        if (inputFunc)
            inputFunc(code);
    }
    function commonInputRow(evt) {
        if ($("#con").css("display") == "none")
            return;
        var code = 0;
        if (evt.keyCode == 16) {
            setKeyboardShiftState(true, ctrlState);
            return;
        }
        else if (evt.keyCode == 17) {
            setKeyboardShiftState(shiftState, true);
            return;
        }
        else
            return;
    }
    function commonInputRowUp(evt, code) {
        if ($("#con").css("display") == "none")
            return;
        if (code == null) {
            if (evt.keyCode == 16) {
                setKeyboardShiftState(false, ctrlState);
            }
            else if (evt.keyCode == 17) {
                setKeyboardShiftState(shiftState, false);
            }
            else
                return;
        }
        return false;
    }
    $(document).on("pagecreate", function () {
        setKeyboardShiftState(false, false);
        $(document).keydown(function (evt) {
            {
                return commonInputRow(evt);
            }
        });
        $(document).keyup(function (evt) {
            {
                return commonInputRowUp(evt, null);
            }
        });
        $("body").keypress(function (evt) {
            return commonInputRowCode(evt.keyCode);
        });
        $("#vklshift").click(function () {
            setKeyboardShiftState(!shiftState, ctrlState);
        });
        $("#vkrshift").click(function () {
            setKeyboardShiftState(!shiftState, ctrlState);
        });
        $("#vkctrl").click(function () {
            setKeyboardShiftState(shiftState, !ctrlState);
        });
        $(".vkey").click(function (evt) {
            var button = evt.target;
            var keytop = $(button).text();
            if (keytop.length == 1) {
                var code = keytop.charCodeAt(0);
                if (ctrlState) {
                    if (code >= 0x40 && code <= 0x5f)
                        code -= -0x40;
                    else if (code >= 0x60 && code <= 0x7f)
                        code -= -0x60;
                }
                commonInputRowCode(code);
            }
            else if ($(button).attr("id") == "vkspace")
                commonInputRowCode(0x20);
            else if (keytop == "Enter")
                commonInputRowCode(0x0d);
            else if (keytop == "LF")
                commonInputRowCode(0x0a);
            else if (keytop == "ESC")
                commonInputRowCode(0x1b);
            else if (keytop == "HOME")
                commonInputRowCode(0x0b);
        });
        $(".vdtline").text(space80);
        outputString("ADM-3A Emulation Ready\r\n");
        echoback();
    });
})(vdt || (vdt = {}));
//# sourceMappingURL=vdt.js.map