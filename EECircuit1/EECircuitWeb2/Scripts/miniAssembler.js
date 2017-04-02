var miniAssembler;
(function (miniAssembler) {
    function lineParser(line) {
        var tokens = [];
        var p = 0;
        for (;;) {
            var s = "";
            for (;;) {
                if (p >= line.length) {
                    tokens.push(s);
                    return tokens;
                }
                var ch = line[p++];
                if (ch == ";") {
                    tokens.push(s);
                    return tokens;
                }
                if (ch == "\t" || ch == " " || ch == ",") {
                    tokens.push(s);
                    break;
                }
                s += ch;
            }
            for (;;) {
                if (p >= line.length)
                    return tokens;
                var ch = line[p];
                if (ch != "\t" && ch != " " && ch != ",")
                    break;
                p++;
            }
        }
    }
    function compile(sourceCode, outputMemory) {
        var result = "";
        var r = lineParser(" mvi a,21h ;comment");
        result += r.length + "tokens\r\n";
        for (var i = 0; i < r.length; i++) {
            result += r[i] + "\r\n";
        }
        return result;
    }
    $("#ideCompile").click(function () {
        $("#result").text("");
        setTimeout(function () {
            var result = compile($("sourceCode").text(), emu.virtualMachine.memory.Bytes);
            if (!result)
                result = "Compile Completed";
            $("#result").text(result);
        }, 10);
        $('#result').keyup(); // 枠を広げるおまじない
    });
    $(document).on("pagecreate", function () {
        // TBW
    });
})(miniAssembler || (miniAssembler = {}));
//# sourceMappingURL=miniAssembler.js.map