var miniAssembler;
(function (miniAssembler) {
    var resultMessage = "";
    var lineNumber = 0;
    function writeError(msg) {
        if (lineNumber)
            resultMessage += "Line " + lineNumber + ": " + msg + "\r\n";
        else
            resultMessage += msg + "\r\n";
    }
    var mnemonicUnit = (function () {
        function mnemonicUnit(operands, bytes, generate) {
            this.operands = operands;
            this.bytes = bytes;
            this.generate = generate;
        }
        return mnemonicUnit;
    }());
    function myParseSSS(opr) {
        if (opr == "B")
            return 0;
        if (opr == "C")
            return 1;
        if (opr == "D")
            return 2;
        if (opr == "E")
            return 3;
        if (opr == "H")
            return 4;
        if (opr == "L")
            return 5;
        if (opr == "M")
            return 6;
        if (opr == "A")
            return 7;
        writeError(opr + " is not a register name. Assumed that it's for accumulator");
        return 7;
    }
    function myParseDDD(opr) {
        return myParseSSS(opr) << 3;
    }
    function myParseNumber(oprorg) {
        var opr = oprorg;
        var hex = false;
        if (opr.length > 1 && opr.substring(0, 1) == "$") {
            hex = true;
            opr = opr.substring(1);
        }
        if (opr.length > 1 && opr.substring(opr.length - 1, opr.length) == "H") {
            hex = true;
            opr = opr.substring(0, opr.length - 1);
        }
        var n = 0;
        for (var i = 0; i < opr.length; i++) {
            var c = opr.charCodeAt(i);
            if (hex) {
                if (c >= 0x30 && c >= 0x39)
                    n = c - 0x30 + n * 16;
                else if (c >= 0x41 && c >= 0x46)
                    n = c - 0x41 + 10 + n * 16;
                else {
                    writeError(oprorg + " is not a correct number, assumed that it's 0.");
                    return 0;
                }
            }
            else {
                if (c >= 0x30 && c >= 0x39)
                    n = c - 0x30 + n * 10;
                else {
                    writeError(oprorg + " is not a correct number, assumed that it's 0.");
                    return 0;
                }
            }
        }
        return n;
    }
    var mnemonicTable = new Object();
    function fillMnemonicTable() {
        mnemonicTable["MVI"] = new mnemonicUnit(2, 2, function (opr1, opr2, out) {
            out(6 | myParseDDD(opr1));
            out(myParseNumber(opr2));
        });
        mnemonicTable["HLT"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0x76);
        });
    }
    fillMnemonicTable();
    function lineParser(line) {
        var tokens = [];
        var p = 0;
        var inSingleQuote = false;
        var inDoubleQuote = false;
        for (;;) {
            var s = "";
            for (;;) {
                if (p >= line.length) {
                    tokens.push(s);
                    return tokens;
                }
                var ch = line[p++];
                if (!inSingleQuote && !inDoubleQuote) {
                    if (ch == ";") {
                        tokens.push(s);
                        return tokens;
                    }
                    if (ch == "\t" || ch == " " || ch == ",") {
                        tokens.push(s);
                        break;
                    }
                }
                if (!inSingleQuote && ch == "\"")
                    inDoubleQuote = !inDoubleQuote;
                if (!inDoubleQuote && ch == "'")
                    inSingleQuote = !inSingleQuote;
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
    function compileLine(pass, pc, tokens, symbolTable, out) {
        if (pass == 1 && tokens[0])
            symbolTable[tokens[0]] = pc;
        var mnem = mnemonicTable[tokens[1]];
        if (mnem)
            mnem.generate(tokens[2], tokens[3], out);
        else
            writeError(tokens[1] + " is not a correct mnemonic.");
    }
    function passX(pass, sourceCode, outputMemory, symbolTable) {
        var pc = 0;
        var start = 0;
        lineNumber = 1;
        for (;;) {
            var end = start;
            var line;
            for (;;) {
                if (start >= sourceCode.length)
                    return;
                if (end >= sourceCode.length) {
                    line = sourceCode.substring(start);
                    break;
                }
                var ch = sourceCode[end];
                if (ch == "\r" || ch == "\n") {
                    line = sourceCode.substring(start, end);
                    break;
                }
                end++;
            }
            compileLine(pass, pc, lineParser(line.toUpperCase()), symbolTable, function (byte) {
                if (pass == 2)
                    outputMemory.write(pc, byte);
                pc++;
            });
            if (ch == "\r" && sourceCode[end + 1] == "\n")
                start = end + 2;
            else
                start = end + 1;
            lineNumber++;
        }
    }
    function compile(sourceCode, outputMemory) {
        var symbolTable = new Object();
        passX(1, sourceCode, outputMemory, symbolTable);
        if (resultMessage) {
            lineNumber = 0;
            writeError("Abnormal Terminated.");
            return;
        }
        passX(2, sourceCode, outputMemory, symbolTable);
        //var r = lineParser(" mvi \'\"',\"\'\",\",\" ;comment");
        //result += r.length + "tokens\r\n";
        //for (var i = 0; i < r.length; i++) {
        //    result += r[i] + "\r\n";
        //}
    }
    $("#ideCompile").click(function () {
        $("#result").text("");
        resultMessage = "";
        setTimeout(function () {
            compile($("#sourceCode").val(), emu.virtualMachine.memory.Bytes);
            if (!resultMessage)
                resultMessage += "Compile Completed\r\n";
            resultMessage += "Done\r\n";
            $("#result").text(resultMessage);
        }, 10);
        $('#result').keyup(); // 枠を広げるおまじない
    });
    $(document).on("pagecreate", function () {
        // TBW
    });
})(miniAssembler || (miniAssembler = {}));
//# sourceMappingURL=miniAssembler.js.map