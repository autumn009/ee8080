var miniAssembler;
(function (miniAssembler) {
    var resultMessage = "";
    var lineNumber = 0;
    var pass = 0;
    var symbolTable = null;
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
    function myParseBD(opr) {
        if (opr == "B")
            return 0;
        if (opr == "D")
            return 0x10;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }
    function myParseBDHSP(opr) {
        if (opr == "B")
            return 0;
        if (opr == "D")
            return 0x10;
        if (opr == "H")
            return 0x20;
        if (opr == "SP")
            return 0x30;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }
    function myParseBDHPSW(opr) {
        if (opr == "B")
            return 0;
        if (opr == "D")
            return 0x10;
        if (opr == "H")
            return 0x20;
        if (opr == "PSW")
            return 0x30;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }
    function myParseNumber(oprorg, equMode) {
        if (equMode === void 0) { equMode = false; }
        var opr = oprorg;
        var hex = false;
        var dec = false;
        if (opr.length > 0 && opr.substring(0, 1) == "$") {
            hex = true;
            opr = opr.substring(1);
        }
        else if (opr.length > 0 && (opr.substring(0, 1) >= "0" && opr.substring(0, 1) <= "9")) {
            if (opr.substring(opr.length - 1, opr.length) == "H") {
                hex = true;
                opr = opr.substring(0, opr.length - 1);
            }
            else {
                dec = true;
                opr = opr.substring(0, opr.length);
            }
        }
        var n = 0;
        if (hex || dec) {
            for (var i = 0; i < opr.length; i++) {
                var c = opr.charCodeAt(i);
                if (hex) {
                    if (c >= 0x30 && c <= 0x39)
                        n = c - 0x30 + n * 16;
                    else if (c >= 0x41 && c <= 0x46)
                        n = c - 0x41 + 10 + n * 16;
                    else {
                        writeError(oprorg + " is not a correct number, assumed that it's 0.");
                        return 0;
                    }
                }
                else {
                    if (c >= 0x30 && c <= 0x39)
                        n = c - 0x30 + n * 10;
                    else {
                        writeError(oprorg + " is not a correct number, assumed that it's 0.");
                        return 0;
                    }
                }
            }
        }
        else {
            if ((!equMode && pass == 2) || (equMode && pass == 1)) {
                n = symbolTable[opr];
                if (n == undefined) {
                    writeError("Symbol " + opr + " was not a found, assumed that it's 0.");
                    n = 0;
                }
            }
        }
        return n;
    }
    function out16(hl, out) {
        out(lowByte(hl));
        out(highByte(hl));
    }
    var mnemonicTable = new Object();
    var conditions = ["NZ", "Z", "NC", "C", "PO", "PE", "P", "M"];
    function fillCondSub(opcode, isRet) {
        return new mnemonicUnit(1, isRet ? 1 : 3, function (opr1, opr2, out) {
            out(opcode);
            if (!isRet)
                out16(myParseNumber(opr1), out);
        });
    }
    function fillCond(prefix, basecode, isRet) {
        for (var i = 0; i < conditions.length; i++) {
            mnemonicTable[prefix + conditions[i]] = fillCondSub(basecode + (i << 3), isRet);
        }
    }
    function fillMnemonicTable() {
        mnemonicTable["ORG"] = new mnemonicUnit(1, 0, function (opr1, opr2, out) {
            compilePointer = myParseNumber(opr1);
        });
        mnemonicTable["END"] = new mnemonicUnit(0, 0, function (opr1, opr2, out) {
            endRequest = true;
        });
        // TRANSFER GROUP
        mnemonicTable["MOV"] = new mnemonicUnit(3, 1, function (opr1, opr2, out) {
            out(0x40 | myParseDDD(opr1) | myParseSSS(opr2));
        });
        mnemonicTable["MVI"] = new mnemonicUnit(2, 2, function (opr1, opr2, out) {
            out(6 | myParseDDD(opr1));
            out(myParseNumber(opr2));
        });
        mnemonicTable["LXI"] = new mnemonicUnit(2, 3, function (opr1, opr2, out) {
            out(1 | myParseBDHSP(opr1));
            out16(myParseNumber(opr2), out);
        });
        mnemonicTable["STAX"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x02 | myParseBD(opr1));
        });
        mnemonicTable["LDAX"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x0a | myParseBD(opr1));
        });
        mnemonicTable["STA"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0x32);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["LDA"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0x3A);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["SHLD"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0x22);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["LHLD"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0x2A);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["XCHG"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xeb);
        });
        // STACK GROUP
        mnemonicTable["PUSH"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xc5 | myParseBDHPSW(opr1));
        });
        mnemonicTable["POP"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xc1 | myParseBDHPSW(opr1));
        });
        mnemonicTable["CALL"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0xcd);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["RET"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xc9);
        });
        mnemonicTable["RST"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            var n = myParseNumber(opr1);
            if (n < 0 || n > 7)
                writeError(n + "is out of range. RST requires 0 to 7.");
            else
                out(0xc7 + (n << 3));
        });
        mnemonicTable["XTHL"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xe3);
        });
        mnemonicTable["SPHL"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xf9);
        });
        // NON-CONDITIONAL JUMP GROUP
        mnemonicTable["JMP"] = new mnemonicUnit(1, 3, function (opr1, opr2, out) {
            out(0xc3);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["PCHL"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0xe9);
        });
        // CONDITIONAL JUMP/CALL GROUP
        fillCond("J", 0xc2, false);
        fillCond("C", 0xc4, false);
        fillCond("R", 0xc8, true);
        // INCREMENT DECREMENT GROUP
        mnemonicTable["INR"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x04 | myParseDDD(opr1));
        });
        mnemonicTable["DCR"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x05 | myParseDDD(opr1));
        });
        mnemonicTable["INX"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x03 | myParseBDHSP(opr1));
        });
        mnemonicTable["DCX"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x0b | myParseBDHSP(opr1));
        });
        // ARITHMETIC GROUP
        mnemonicTable["ADD"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x80 | myParseSSS(opr1));
        });
        mnemonicTable["ADC"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x88 | myParseSSS(opr1));
        });
        mnemonicTable["ADI"] = new mnemonicUnit(1, 2, function (opr1, opr2, out) {
            out(0xc6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["ACI"] = new mnemonicUnit(1, 2, function (opr1, opr2, out) {
            out(0xce);
            out(myParseNumber(opr1));
        });
        mnemonicTable["DAD"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x09 | myParseBDHSP(opr1));
        });
        mnemonicTable["SUB"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x90 | myParseSSS(opr1));
        });
        mnemonicTable["SBB"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0x98 | myParseSSS(opr1));
        });
        mnemonicTable["SUI"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0xd6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["SBI"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0xde);
            out(myParseNumber(opr1));
        });
        mnemonicTable["CMP"] = new mnemonicUnit(1, 1, function (opr1, opr2, out) {
            out(0xb8 | myParseSSS(opr1));
        });
        mnemonicTable["CPI"] = new mnemonicUnit(1, 2, function (opr1, opr2, out) {
            out(0xfe);
            out(myParseNumber(opr1));
        });
        mnemonicTable["HLT"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0x76);
        });
        mnemonicTable["IN"] = new mnemonicUnit(1, 2, function (opr1, opr2, out) {
            out(0xdb);
            out(myParseNumber(opr1));
        });
        mnemonicTable["OUT"] = new mnemonicUnit(1, 2, function (opr1, opr2, out) {
            out(0xd3);
            out(myParseNumber(opr1));
        });
        // SPECIALS GROUP
        mnemonicTable["STC"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0x37);
        });
        mnemonicTable["CMC"] = new mnemonicUnit(0, 1, function (opr1, opr2, out) {
            out(0x3f);
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
    function compileLine(pc, tokens, out) {
        if (pass == 1 && tokens[0]) {
            var n = tokens[0];
            if (n.substring(n.length - 1, n.length) == ":") {
                n = n.substring(0, n.length - 1).trim();
            }
            if (tokens[1] == "EQU") {
                symbolTable[n] = myParseNumber(tokens[2], true);
                return;
            }
            else {
                symbolTable[n] = pc;
            }
        }
        if (tokens[1]) {
            if (tokens[1] == "EQU")
                return;
            var mnem = mnemonicTable[tokens[1]];
            if (mnem)
                mnem.generate(tokens[2], tokens[3], out);
            else
                writeError(tokens[1] + " is not a correct mnemonic.");
        }
    }
    var endRequest = false;
    var compilePointer = 0;
    function passX(sourceCode, outputMemory) {
        var start = 0;
        endRequest = false;
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
            var tokens = lineParser(line.toUpperCase());
            compileLine(compilePointer, tokens, function (byte) {
                if (pass == 2)
                    outputMemory.write(compilePointer, byte);
                compilePointer++;
            });
            if (endRequest)
                return;
            if (ch == "\r" && sourceCode[end + 1] == "\n")
                start = end + 2;
            else
                start = end + 1;
            lineNumber++;
        }
    }
    function compile(sourceCode, outputMemory) {
        symbolTable = new Object();
        pass = 1;
        passX(sourceCode, outputMemory);
        if (resultMessage) {
            lineNumber = 0;
            writeError("Abnormal Terminated.");
            return;
        }
        pass = 2;
        passX(sourceCode, outputMemory);
        //var r = lineParser(" mvi \'\"',\"\'\",\",\" ;comment");
        //result += r.length + "tokens\r\n";
        //for (var i = 0; i < r.length; i++) {
        //    result += r[i] + "\r\n";
        //}
    }
    function compileCommon(completion) {
        $("#result").text("");
        resultMessage = "";
        setTimeout(function () {
            var result = false;
            compile($("#sourceCode").val(), emu.virtualMachine.memory.Bytes);
            if (!resultMessage) {
                resultMessage += "Compile Completed\r\n";
                result = true;
            }
            resultMessage += "Done\r\n";
            $("#result").text(resultMessage);
            if (result && completion)
                completion();
        }, 10);
        $('#result').keyup(); // 枠を広げるおまじない
    }
    $("#ideCompile").click(function () {
        compileCommon(null);
    });
    $("#ideCompileAndRun").click(function () {
        var r = compileCommon(function () {
            emu.setMonitor();
            emu.restart();
        });
    });
    $(document).on("pagecreate", function () {
        // TBW
    });
})(miniAssembler || (miniAssembler = {}));
//# sourceMappingURL=miniAssembler.js.map