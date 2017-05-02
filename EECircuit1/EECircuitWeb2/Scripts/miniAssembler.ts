﻿namespace miniAssembler
{
    var resultMessage = "";
    var lineNumber = 0;
    var pass = 0;
    var symbolTable = null;
    
    function writeError(msg: string) {
        if (lineNumber)
            resultMessage += "Line " + lineNumber + ": " + msg + "\r\n";
        else
            resultMessage += msg + "\r\n";
    }

    class mnemonicUnit {
        constructor(public operands: number, public bytes: number, public generate: (opr1: string, opr2: string, out: (byte: number) => void) => void) {
        }
    }

    function myParseSSS(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "C") return 1;
        if (opr == "D") return 2;
        if (opr == "E") return 3;
        if (opr == "H") return 4;
        if (opr == "L") return 5;
        if (opr == "M") return 6;
        if (opr == "A") return 7;
        writeError(opr + " is not a register name. Assumed that it's for accumulator");
        return 7;
    }

    function myParseDDD(opr: string): number {
        return myParseSSS(opr) << 3;
    }

    function myParseBD(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "D") return 0x10;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }

    function myParseBDHSP(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "D") return 0x10;
        if (opr == "H") return 0x20;
        if (opr == "SP") return 0x30;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }

    function myParseBDHPSW(opr: string): number {
        if (opr == "B") return 0;
        if (opr == "D") return 0x10;
        if (opr == "H") return 0x20;
        if (opr == "PSW") return 0x30;
        writeError(opr + " is not a register pair name. Assumed that it's for BC");
        return 0;
    }

    function myParseNumber(oprorg: string, equMode: boolean = false): number {
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

    function out16(hl:number, out:(n:number)=>void)
    {
        out(lowByte(hl));
        out(highByte(hl));
    }

    var mnemonicTable = new Object();

    var conditions: string[] = ["NZ","Z","NC","C","PO","PE","P","M"];

    function fillCondSub(opcode: number, isRet: boolean) {
        return new mnemonicUnit(1, isRet ? 1 : 3, (opr1, opr2, out) => {
            out(opcode);
            if (!isRet) out16(myParseNumber(opr1), out);
        });
    }
    function fillCond(prefix: string, basecode: number, isRet: boolean) {
        for (var i = 0; i < conditions.length; i++) {
            mnemonicTable[prefix + conditions[i]] = fillCondSub(basecode + (i << 3), isRet)
        }
    }

    function fillMnemonicTable() {
        mnemonicTable["ORG"] = new mnemonicUnit(1, 0, (opr1, opr2, out) => {
            compilePointer = myParseNumber(opr1);
        });
        mnemonicTable["END"] = new mnemonicUnit(0, 0, (opr1, opr2, out) => {
            endRequest = true;
        });

        // TRANSFER GROUP
        mnemonicTable["MOV"] = new mnemonicUnit(3, 1, (opr1, opr2, out) => {
            out(0x40 | myParseDDD(opr1) | myParseSSS(opr2));
        });
        mnemonicTable["MVI"] = new mnemonicUnit(2, 2, (opr1, opr2, out) => {
            out(6 | myParseDDD(opr1));
            out(myParseNumber(opr2));
        });
        mnemonicTable["LXI"] = new mnemonicUnit(2, 3, (opr1, opr2, out) => {
            out(1 | myParseBDHSP(opr1));
            out16(myParseNumber(opr2), out);
        });
        mnemonicTable["STAX"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x02 | myParseBD(opr1));
        });
        mnemonicTable["LDAX"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x0a | myParseBD(opr1));
        });
        mnemonicTable["STA"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x32);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["LDA"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x3A);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["SHLD"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x22);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["LHLD"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0x2A);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["XCHG"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xeb);
        });

        // STACK GROUP
        mnemonicTable["PUSH"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xc5 | myParseBDHPSW(opr1));
        });
        mnemonicTable["POP"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xc1 | myParseBDHPSW(opr1));
        });
        mnemonicTable["CALL"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0xcd);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["RET"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xc9);
        });
        mnemonicTable["RST"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            var n = myParseNumber(opr1);
            if (n < 0 || n > 7) writeError(n + "is out of range. RST requires 0 to 7.");
            else out(0xc7 + (n << 3));
        });
        mnemonicTable["XTHL"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xe3);
        });
        mnemonicTable["SPHL"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xf9);
        });

        // NON-CONDITIONAL JUMP GROUP
        mnemonicTable["JMP"] = new mnemonicUnit(1, 3, (opr1, opr2, out) => {
            out(0xc3);
            out16(myParseNumber(opr1), out);
        });
        mnemonicTable["PCHL"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xe9);
        });

        // CONDITIONAL JUMP/CALL GROUP
        fillCond("J", 0xc2, false);
        fillCond("C", 0xc4, false);
        fillCond("R", 0xc0, true);

        // INCREMENT DECREMENT GROUP
        mnemonicTable["INR"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x04 | myParseDDD(opr1));
        });
        mnemonicTable["DCR"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x05 | myParseDDD(opr1));
        });
        mnemonicTable["INX"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x03 | myParseBDHSP(opr1));
        });
        mnemonicTable["DCX"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x0b | myParseBDHSP(opr1));
        });

        // ARITHMETIC GROUP
        mnemonicTable["ADD"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x80 | myParseSSS(opr1));
        });
        mnemonicTable["ADC"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x88 | myParseSSS(opr1));
        });
        mnemonicTable["ADI"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xc6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["ACI"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xce);
            out(myParseNumber(opr1));
        });
        mnemonicTable["DAD"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x09 | myParseBDHSP(opr1));
        });
        mnemonicTable["SUB"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x90 | myParseSSS(opr1));
        });
        mnemonicTable["SBB"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0x98 | myParseSSS(opr1));
        });
        mnemonicTable["SUI"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xd6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["SBI"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xde);
            out(myParseNumber(opr1));
        });
        mnemonicTable["AND"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xa0 | myParseSSS(opr1));
        });
        mnemonicTable["ORA"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xb0 | myParseSSS(opr1));
        });
        mnemonicTable["XRA"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xa8 | myParseSSS(opr1));
        });
        mnemonicTable["ANI"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xe6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["ORI"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xf6);
            out(myParseNumber(opr1));
        });
        mnemonicTable["XRI"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xee);
            out(myParseNumber(opr1));
        });
        mnemonicTable["CMP"] = new mnemonicUnit(1, 1, (opr1, opr2, out) => {
            out(0xb8 | myParseSSS(opr1));
        });
        mnemonicTable["CPI"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xfe);
            out(myParseNumber(opr1));
        });
        // ROTATE GROUP
        mnemonicTable["RLC"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x07);
        });
        mnemonicTable["RRC"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x0f);
        });
        mnemonicTable["RAL"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x17);
        });
        mnemonicTable["RAR"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x1f);
        });

        mnemonicTable["IN"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xdb);
            out(myParseNumber(opr1));
        });
        mnemonicTable["OUT"] = new mnemonicUnit(1, 2, (opr1, opr2, out) => {
            out(0xd3);
            out(myParseNumber(opr1));
        });

        // SPECIALS GROUP
        mnemonicTable["STC"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x37);
        });
        mnemonicTable["CMC"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x3f);
        });
        mnemonicTable["CMA"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x2f);
        });
        mnemonicTable["DAA"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x27);
        });

        //CONTROL GROUP
        mnemonicTable["HLT"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x76);
        });
        mnemonicTable["NOP"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0x00);
        });
        mnemonicTable["EI"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xfb);
        });
        mnemonicTable["DI"] = new mnemonicUnit(0, 1, (opr1, opr2, out) => {
            out(0xf3);
        });
    }

    fillMnemonicTable();

    function lineParser(line: string): string[] {
        var tokens: string[] = [];
        var p = 0;
        var inSingleQuote = false;
        var inDoubleQuote = false;

        for (; ;) {
            var s = "";
            for (; ;) {
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
                if (!inSingleQuote && ch == "\"") inDoubleQuote = !inDoubleQuote;
                if (!inDoubleQuote && ch == "'") inSingleQuote = !inSingleQuote;
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

    function dbdw(tokens: string[], length: number, out: (byte: number) => void) {
        for (var i = 2; i < tokens.length; i++) {
            if (tokens[i]) {
                if ((tokens[i].charAt(0) == "\"" || tokens[i].charAt(0) == "'")
                    && (tokens[i].charAt(tokens[i].length - 1) == "\"" || tokens[tokens[i].length - 1].charAt(0) == "'")
                ) {
                    for (var j = 1; j < tokens[i].length - 1; j++) {
                        var v = tokens[i].charCodeAt(j);
                        if (length == 1) {
                            out(v);
                        } else {
                            out16(v, out);
                        }
                    }
                }
                else {
                    var v = 0;
                    if (pass == 2) v = myParseNumber(tokens[i]);
                    if (length == 1) {
                        out(v);
                    } else {
                        out16(v, out);
                    }
                }
            }
        }
    }

    function compileLine(pc: number, tokens: string[], out: (byte: number) => void) {
        if (pass == 1 && tokens[0]) {
            var n = tokens[0];
            if (n.substring(n.length - 1, n.length) == ":") {
                n = n.substring(0, n.length - 1).trim();
            }
            if (symbolTable[n]) {
                writeError(n + " was duplicated.");
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
            if (tokens[1] == "EQU") return;
            if (tokens[1] == "DB") {
                dbdw(tokens, 1, out);
                return;
            }
            if (tokens[1] == "DW") {
                dbdw(tokens, 2, out);
                return;
            }
            if (tokens[1] == "DS") {
                var l = myParseNumber(tokens[2]);
                for (var i = 0; i < l; i++) {
                    out(0);
                }
                return;
            }
            var mnem: mnemonicUnit = mnemonicTable[tokens[1]];
            if (mnem)
                mnem.generate(tokens[2], tokens[3], out);
            else
                writeError(tokens[1] + " is not a correct mnemonic.");
        }
    }

    var endRequest = false;
    var compilePointer = 0;

    function myToUpperCase(s: string):string
    {
        var r = "";
        var mode = true;
        for (var i = 0; i < s.length; i++) {
            var c = s.charAt(i);
            if (c == "\"" || c == "'") mode = !mode;
            if (mode) c = c.toUpperCase();
            r = r + c;
        }
        return r;
    }

    function passX(sourceCode: string, outputMemory: emu.NumberArray) {
        var start = 0;
        endRequest = false;
        lineNumber = 1;
        compilePointer = 0;
        for (; ;) {
            var end = start;
            var line: string;
            for (; ;) {
                if (start >= sourceCode.length) return;
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
            var tokens = lineParser(myToUpperCase(line));
            compileLine(compilePointer, tokens, (byte: number) => {
                if (pass == 2) outputMemory.write(compilePointer, byte);
                compilePointer++;
            });
            if (endRequest) return;
            if (ch == "\r" && sourceCode[end + 1] == "\n")
                start = end + 2;
            else
                start = end + 1;
            lineNumber++;
        }
    }

    function compile(sourceCode: string, outputMemory: emu.NumberArray) {
        symbolTable = new Object();
        pass = 1;
        passX(sourceCode, outputMemory);
        if (resultMessage)
        {
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

    export function compileCommon(completion:()=>void)
    {
        $("#result").text("");
        resultMessage = "";
        setTimeout(() => {
            var result = false;
            compile($("#sourceCode").val(), emu.virtualMachine.memory.Bytes);
            if (!resultMessage) {
                resultMessage += "Compile Completed\r\n"
                result = true;
            }
            resultMessage += "Done\r\n";
            $("#result").text(resultMessage);
            if (result && completion) completion();
        }, 10);
        $('#result').keyup();   // 枠を広げるおまじない
    }

    $("#ideCompile").click(() => {
        compileCommon(null);
    });

    $("#ideCompileAndRun").click(() => {
        var r = compileCommon(() => {
            emu.setMonitor();
            emu.restart();
        });
    });

    $(document).on("pagecreate", function () {
        // TBW
    });
}
