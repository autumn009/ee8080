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
        //console.log(charCode.toString(16));
        if (escapeMode == escapeModes.waiting2ndChar) {
            if (charCode == "=".charCodeAt(0))
            {
                escapeMode = escapeModes.waitingRow;
                return;
            }
            else {
                console.log("Unsupporet Escape Sequence ESC+0" + charCode.toString(16) + "H");
            }
            escapeMode = escapeModes.notMode;
        }
        else if (escapeMode == escapeModes.waitingRow) {
            row = charCode - 0x20;
            escapeMode = escapeModes.waitingCol;
        }
        else if (escapeMode == escapeModes.waitingCol) {
            var col = charCode - 0x20;
            locate(col,row);
            escapeMode = escapeModes.notMode;
        }
        else { // escapeModes.notMode
            if (charCode == 0x07) { // BEL
                var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
                snd.play();
                return;
            }
            else if (charCode == 0x08) { // BS
                cursorBack();
                return;
            }
            else if (charCode == 0x0a) {    // LF
                lf();
                return;
            }
            else if (charCode == 0x0b) { // VT
                cursorUp();
                return;
            }
            else if (charCode == 0x0c) { // FF
                cursorNext();
                return;
            }
            else if (charCode == 0x0d)  // CR
            {
                cursorX = 0;
                setCursorClass();
                return;
            }
            else if (charCode == 0x1a)  // SUB (Clear Screen)
            {
                clearScreen();
                return;
            }
            else if (charCode == 0x1b)  // ESC
            {
                escapeMode = escapeModes.waiting2ndChar;
                return;
            }
            else if (charCode == 0x1e)  // RS (Home)
            {
                homeScreen();
                return;
            }
            else if (charCode == 0x7f)  // RUB (del)
            {
                // do nothing
                return;
            }
            else if (charCode < 0x20)   // other control codes
            {
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
    }

    export var inputFunc: (number) => void = null;
    export var inputFuncAfter: () => void = null;

    function lf() {
        cursorY++;
        if (cursorY >= 24) {
            cursorY = 23;
            scrollUp();
        }
        setCursorClass();
    }

    function cursorUp() {
        cursorY--;
        if (cursorY < 0) {
            cursorY = 0;
            //scrollDown();
        }
        setCursorClass();
    }

    function cursorBack() {
        cursorX--;
        if (cursorX < 0) {
            cursorX = 79;
            cursorUp();
        }
        setCursorClass();
    }

    function cursorNext()
    {
        cursorX++;
        if (cursorX >= 80) {
            cursorX = 0;
            lf();
        }
        setCursorClass();
    }

    var emptyLine = document.createElement("div");
    $(emptyLine).addClass("vdtchars");
    for (var i = 0; i < 80; i++) {
        var span = document.createElement("span");
        $(span).addClass("vdtchar");
        $(span).addClass("vdtchar" + i.toString());
        $(span).text("\xa0")
        $(emptyLine).append(span);
    }

    function scrollUp() {
        for (var i = 0; i < 23; i++) {
            var ele = $("#vline" + (i + 1).toString()).children().first();
            $("#vline" + i.toString()).empty();
            $("#vline" + i.toString()).append(ele);
        }
        $("#vline23").empty();
        $("#vline23").append($(emptyLine).clone());
    }

    var cursorX = 0;
    var cursorY = 0;
    enum escapeModes {
        notMode,
        waiting2ndChar,
        waitingRow,
        waitingCol
    };
    var escapeMode = escapeModes.notMode;
    var row = 0;

    function internalOutputChar(charCode: number) {
        if (charCode == 0x20) charCode = 0xa0;  // force space to nbsp
        var target = $("#vline" + cursorY + " " + ".vdtchars .vdtchar" + cursorX.toString());
        target.text(String.fromCharCode(charCode));
    }

    var requestToClear = false;
    export function clear()
    {
        requestToClear = true;
    }

    export function echoback() {
        requestToClear = false;
        inputFunc = (code) => {
            if (requestToClear) return;
            outputChar(code);
            if (requestToClear) return;
            echoback();
            if (requestToClear) return;
        };
    }

    export function commonInputRowCode(code: number)
    {
        if ($("#con").css("display") == "none") return true;
        if (inputFunc) inputFunc(code);
        return false;
    }

    function commonInputRow(evt) {
        if ($("#con").css("display") == "none") return true;
        var code = 0;
        if (evt.keyCode == 16)   // Shift
        {
            setKeyboardShiftState(true, ctrlState);
        }
        else if (evt.keyCode == 17)   // Ctrl
        {
            setKeyboardShiftState(shiftState, true);
        }
        else if (evt.keyCode == 8)   // BS
        {
            commonInputRowCode(8);
            return false;
        }
        else if (evt.keyCode == 9)   // TAB
        {
            commonInputRowCode(9);
            return false;
        }
        else if (evt.keyCode == 67 && evt.ctrlKey)
        {
            commonInputRowCode(3);
            return false;
        }
        else if (evt.keyCode == 80 && evt.ctrlKey) {
            commonInputRowCode(0x10);
            return false;
        }
        else if (evt.keyCode == 81 && evt.ctrlKey) {
            commonInputRowCode(0x11);
            return false;
        }
        else if (evt.keyCode == 83 && evt.ctrlKey) {
            commonInputRowCode(0x13);
            return false;
        }
        return true;
    }

    function commonInputRowUp(evt, code: number) {
        if ($("#con").css("display") == "none") return true;
        if (code == null) {
            if (evt.keyCode == 16)   // Shift
            {
                setKeyboardShiftState(false, ctrlState);
            }
            else if (evt.keyCode == 17)   // Ctrl
            {
                setKeyboardShiftState(shiftState, false);
            }
            else if (evt.keyCode == 8)   // BS
            {
                return false;
            }
        }
        return true;
    }

    function setCursorClass() {
        $(".vdtchar").removeClass("invert");
        var target = $("#vline" + cursorY + " " + ".vdtchars .vdtchar" + cursorX.toString());
        target.addClass("invert");
    }

    function locate(x: number, y: number) {
        if (x < 0 || x > 79 || y < 0 || y > 24) return;
        cursorX = x;
        cursorY = y;
        setCursorClass();
    }

    function homeScreen()
    {
        locate(0, 0);
        escapeMode = escapeModes.notMode;
    }

    function clearScreen() {
        homeScreen();
        $(".vdtline").empty();
        $(".vdtline").append($(emptyLine).clone());
    }

    $(document).on("pagecreate", function () {
        setKeyboardShiftState(false,false);
        $(document).keydown((evt) => {
            {
                return commonInputRow(evt);
            }
        });
        $(document).keyup((evt) => {
            {
                return commonInputRowUp(evt, null);
            }
        });
        $("body").keypress((evt) => {
            return commonInputRowCode(evt.which);
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
                var code = keytop.charCodeAt(0);
                if (ctrlState) {
                    if (code >= 0x40 && code <= 0x5f) code -= 0x40;
                    else if (code >= 0x60 && code <= 0x7f) code -= 0x60;
                }
                commonInputRowCode(code);
            }
            else if ($(button).attr("id") == "vkspace")
                commonInputRowCode(0x20);
            else if (keytop == "BS")
                commonInputRowCode(0x08);
            else if (keytop == "TAB")
                commonInputRowCode(0x09);
            else if (keytop == "Enter")
                commonInputRowCode(0x0d);
            else if (keytop == "LF")
                commonInputRowCode(0x0a);
            else if (keytop == "ESC")
                commonInputRowCode(0x1b);
            else if (keytop == "HOME")
                commonInputRowCode(0x1e);
            else if (keytop == "RUB")
                commonInputRowCode(0x7f);
        });
        clearScreen();
        outputString("Subset of ADM-3A Emulation Ready\r\n");
    });
}
