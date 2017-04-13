namespace vdt {
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
            else return;
        }
        if (inputFunc) inputFunc(code);
        return false;
    }

    $(document).on("pagecreate", function () {
        $(document).keydown((evt) => {
            {
                return commonInputRow(evt, null);
            }
        });
        $("body").keypress((evt) => {
            return commonInputRow(evt, evt.keyCode);
        });
        $(".vdtline").text(space80);
        outputString("ADM-3A Emulation Ready\r\n");
        echoback();
    });
}
