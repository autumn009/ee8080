namespace vdt {
    var shiftState = false;
    var ctrlState = false;
    function setKeyboardShiftState(isShift: boolean, isCtrl: boolean) {
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
            var keytop: string = $(this).children().text();
            var active = ctrlState && keytop.length == 1 && keytop.charCodeAt(0) >= 0x40 && keytop.charCodeAt(0) <= 0x7f;
            $(this).addClass("ui-btn-" + (active ? "b" : "a"));
        });
    }

    export function outputString(s: string) {
        for (var i = 0; i < s.length; i++) {
            outputChar(s.charCodeAt(i));
        }
    }

    export function outputChar(charCode: number) {
        if (charCode < 0x20 || charCode > 0x7f) {
            charCode = "?".charCodeAt(0);
        }
        internalOutputChar(charCode);
        cursorNext();
    }

    var inputFunc: (number) => void = null;

    export function inputChar(done: (number) => void) {
        inputFunc = (code) => {
            inputFunc = null;
            done(code);
        };
    }

    function cursorNext()
    {
        cursorX++;
        if (cursorX < 80) return;
        cursorX = 0;
        cursorY++;
        if (cursorX < 24) return;
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

    function internalOutputChar(charCode: number) {
        var target = $("#vline" + cursorY);
        var s = target.text();
        s = s.substring(0, cursorX)
            + String.fromCharCode(charCode)
            + s.substring(cursorX+1, 80);
        target.text(s);
    }

    function echoback() {
        inputChar((code) => {
            outputChar(code);
            echoback();
        });
    }

    function commonInputRow(evt, code:number)
    {
        if ($("#con").css("display") == "none") return;
        if (code == null)
        {
            if (evt.ctrlKey) {
                if (evt.keyCode >= 0x41 && evt.keyCode <= 0x5a) {
                    code = evt.keyCode-0x40;
                }
                else return;
            }
            else if (evt.keyCode == 8   // TAB
                || evt.keyCode == 9     // BS
            ) {
                code = evt.keyCode;
            }
            else if (evt.keyCode == 16)   // Shift
            {
                setKeyboardShiftState(true, ctrlState);
                return;
            }
            else if (evt.keyCode == 17)   // Ctrl
            {
                setKeyboardShiftState(shiftState, true);
                return;
            }

            else return;
        }
        if (inputFunc) inputFunc(code);
        return false;
    }

    function commonInputRowUp(evt, code: number) {
        if ($("#con").css("display") == "none") return;
        if (code == null) {
            if (evt.keyCode == 16)   // Shift
            {
                setKeyboardShiftState(false, ctrlState);
            }
            else if (evt.keyCode == 17)   // Ctrl
            {
                setKeyboardShiftState(shiftState, false);
            }
            else return;
        }
        return false;
    }

    $(document).on("pagecreate", function () {
        setKeyboardShiftState(false,false);
        $(document).keydown((evt) => {
            {
                return commonInputRow(evt, null);
            }
        });
        $(document).keyup((evt) => {
            {
                return commonInputRowUp(evt, null);
            }
        });
        $("body").keypress((evt) => {
            return commonInputRow(evt, evt.keyCode);
        });
        $("#vklshift").click(() => {
            setKeyboardShiftState(!shiftState, ctrlState);
        });
        $("#vkrshift").click(() => {
            setKeyboardShiftState(!shiftState, ctrlState);
        });
        $("#vkctrl").click(() => {
            setKeyboardShiftState(shiftState, !ctrlState);
        });
        $(".vkey").click((evt) => {
            var button = evt.target;
            var keytop = $(button).text();
            if (keytop.length == 1) {
                if (inputFunc) inputFunc(keytop.charCodeAt(0));
            }
            else {
                // TBW
            }
        });
        $(".vdtline").text(space80);
        outputString("ADM-3A Emulation Ready\r\n");
        echoback();
    });
}
