namespace miniAssembler
{
    function lineParser(line: string): string[] {
        var tokens: string[] = [];
        var p = 0;

        for (; ;) {
            var s = "";
            for (; ;) {
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
            for (; ;) {
                if (p >= line.length) return tokens;
                var ch = line[p];
                if (ch != "\t" && ch != " " && ch != ",") break;
                p++;
            }
        }
    }

    function compile(sourceCode: string, outputMemory: emu.NumberArray): string {
        var result = "";


        var r = lineParser(" mvi a,21h ;comment");
        result += r.length + "tokens\r\n";
        for (var i = 0; i < r.length; i++) {
            result += r[i] + "\r\n";
        }



        return result;
    }

    
    $("#ideCompile").click(() => {
        $("#result").text("");
        setTimeout(() => {
            var result = compile($("sourceCode").text(), emu.virtualMachine.memory.Bytes);
            if (!result) result = "Compile Completed"
            $("#result").text(result);
        }, 10);
        $('#result').keyup();   // 枠を広げるおまじない
    });

    $(document).on("pagecreate", function () {
        // TBW
    });
}
