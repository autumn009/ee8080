var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var edu8080;
(function (edu8080) {
    var OperationCode;
    (function (OperationCode) {
        OperationCode[OperationCode["LXI"] = 0] = "LXI";
        OperationCode[OperationCode["DAD"] = 1] = "DAD";
        OperationCode[OperationCode["LDAX"] = 2] = "LDAX";
        OperationCode[OperationCode["STAX"] = 3] = "STAX";
        OperationCode[OperationCode["LHLD"] = 4] = "LHLD";
        OperationCode[OperationCode["SHLD"] = 5] = "SHLD";
        OperationCode[OperationCode["LDA"] = 6] = "LDA";
        OperationCode[OperationCode["STA"] = 7] = "STA";
        OperationCode[OperationCode["INX"] = 8] = "INX";
        OperationCode[OperationCode["DEX"] = 9] = "DEX";
        OperationCode[OperationCode["INR"] = 10] = "INR";
        OperationCode[OperationCode["DCR"] = 11] = "DCR";
        OperationCode[OperationCode["MVI"] = 12] = "MVI";
        OperationCode[OperationCode["DAA"] = 13] = "DAA";
        OperationCode[OperationCode["STC"] = 14] = "STC";
        OperationCode[OperationCode["CMC"] = 15] = "CMC";
        OperationCode[OperationCode["HLT"] = 16] = "HLT";
        OperationCode[OperationCode["MOV"] = 17] = "MOV";
        OperationCode[OperationCode["ALU1"] = 18] = "ALU1";
        OperationCode[OperationCode["ALU2"] = 19] = "ALU2";
        OperationCode[OperationCode["Rxx"] = 20] = "Rxx";
        OperationCode[OperationCode["POP"] = 21] = "POP";
        OperationCode[OperationCode["PCHL"] = 22] = "PCHL";
        OperationCode[OperationCode["SPHL"] = 23] = "SPHL";
        OperationCode[OperationCode["Jxx"] = 24] = "Jxx";
        OperationCode[OperationCode["IN"] = 25] = "IN";
        OperationCode[OperationCode["OUT"] = 26] = "OUT";
        OperationCode[OperationCode["XTHL"] = 27] = "XTHL";
        OperationCode[OperationCode["XCHG"] = 28] = "XCHG";
        OperationCode[OperationCode["Cxx"] = 29] = "Cxx";
        OperationCode[OperationCode["PUSH"] = 30] = "PUSH";
        OperationCode[OperationCode["RST"] = 31] = "RST";
        OperationCode[OperationCode["NOP"] = 32] = "NOP";
        OperationCode[OperationCode["OTHER"] = 33] = "OTHER";
    })(OperationCode || (OperationCode = {}));
    var RegisterSelect8;
    (function (RegisterSelect8) {
        RegisterSelect8[RegisterSelect8["b"] = 0] = "b";
        RegisterSelect8[RegisterSelect8["c"] = 1] = "c";
        RegisterSelect8[RegisterSelect8["d"] = 2] = "d";
        RegisterSelect8[RegisterSelect8["e"] = 3] = "e";
        RegisterSelect8[RegisterSelect8["h"] = 4] = "h";
        RegisterSelect8[RegisterSelect8["l"] = 5] = "l";
        RegisterSelect8[RegisterSelect8["m"] = 6] = "m";
        RegisterSelect8[RegisterSelect8["a"] = 7] = "a";
    })(RegisterSelect8 || (RegisterSelect8 = {}));
    var RegisterSelect16;
    (function (RegisterSelect16) {
        RegisterSelect16[RegisterSelect16["bc"] = 0] = "bc";
        RegisterSelect16[RegisterSelect16["de"] = 1] = "de";
        RegisterSelect16[RegisterSelect16["hl"] = 2] = "hl";
        RegisterSelect16[RegisterSelect16["sp"] = 3] = "sp";
        RegisterSelect16[RegisterSelect16["wz"] = 4] = "wz";
        RegisterSelect16[RegisterSelect16["pc"] = 5] = "pc";
        RegisterSelect16[RegisterSelect16["latch"] = 6] = "latch";
    })(RegisterSelect16 || (RegisterSelect16 = {}));
    var AddressBuffer = (function () {
        function AddressBuffer(thischip) {
            this.chip = thischip;
        }
        AddressBuffer.prototype.getAddress = function () {
            switch (this.chip.registerSelect16) {
                case RegisterSelect16.bc:
                    return this.chip.regarray.getRegisterPairValue(0);
                case RegisterSelect16.de:
                    return this.chip.regarray.getRegisterPairValue(1);
                case RegisterSelect16.hl:
                    return this.chip.regarray.getRegisterPairValue(2);
                case RegisterSelect16.sp:
                    return this.chip.regarray.sp.getValue();
                case RegisterSelect16.pc:
                    return this.chip.regarray.pc.getValue();
                case RegisterSelect16.wz:
                    return this.chip.regarray.getRegisterPairValue(4);
                default:
                    return this.chip.regarray.incrementerDecrementerAddressLatch.getValue();
            }
        };
        return AddressBuffer;
    }());
    var Register = (function () {
        function Register() {
            this.upperLimit = 65535;
            this.value = 0;
        }
        Register.prototype.setValue = function (n) {
            if (n < 0 || n > this.upperLimit) {
                throw Error("value is out of range n=" + n);
            }
            this.value = n;
        };
        Register.prototype.getValue = function () {
            return this.value;
        };
        Register.prototype.Increment = function () {
            this.value++;
            if (this.value > this.upperLimit)
                this.value = 0;
        };
        Register.prototype.Decrement = function () {
            this.value--;
            if (this.value < 0)
                this.value = this.upperLimit;
        };
        Register.prototype.randomInitialize = function () {
            this.value = Math.floor(Math.random() * this.upperLimit);
        };
        return Register;
    }());
    var Register8 = (function (_super) {
        __extends(Register8, _super);
        function Register8() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.upperLimit = 255;
            return _this;
        }
        return Register8;
    }(Register));
    var DataBusBufferLatch = (function (_super) {
        __extends(DataBusBufferLatch, _super);
        function DataBusBufferLatch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DataBusBufferLatch;
    }(Register8));
    var Register16 = (function (_super) {
        __extends(Register16, _super);
        function Register16() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Register16.prototype.setValueHL = function (l, h) {
            this.setValue(h * 256 + l);
        };
        return Register16;
    }(Register));
    var Accumulator = (function (_super) {
        __extends(Accumulator, _super);
        function Accumulator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Accumulator;
    }(Register8));
    var AccumulatorLatch = (function (_super) {
        __extends(AccumulatorLatch, _super);
        function AccumulatorLatch() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AccumulatorLatch;
    }(Register8));
    var TempReg = (function (_super) {
        __extends(TempReg, _super);
        function TempReg() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TempReg;
    }(Register8));
    var ArithmeticLogicUnit = (function () {
        function ArithmeticLogicUnit(thischip) {
            this.result = new Register8();
            this.chip = thischip;
        }
        ArithmeticLogicUnit.prototype.setps = function (a) {
            this.chip.flags.s = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1)
                    p++;
                x >>= 1;
            }
            this.chip.flags.p = ((p & 1) == 0);
        };
        ArithmeticLogicUnit.prototype.cmp = function () {
            this.sub();
        };
        ArithmeticLogicUnit.prototype.addbase = function (a, b, cyUnchange, cyOnlyChange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (cyOnlyChange === void 0) { cyOnlyChange = false; }
            if (c === void 0) { c = false; }
            var r = a + b + (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            if (!cyUnchange)
                this.chip.flags.cy = rc;
            if (!cyOnlyChange) {
                this.chip.flags.z = (r0 == 0);
                this.setps(r0);
                this.chip.flags.ac = ((a & 0x8) & (b & 0x8)) != 0;
            }
            return r0;
        };
        ArithmeticLogicUnit.prototype.addraw = function (cyUnchange, cyOnlyChange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (cyOnlyChange === void 0) { cyOnlyChange = false; }
            if (c === void 0) { c = false; }
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r0 = this.addbase(a, b, cyUnchange, cyOnlyChange, c);
            this.result.setValue(r0);
        };
        ArithmeticLogicUnit.prototype.add = function (cyUnchange, cyOnlyChange) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (cyOnlyChange === void 0) { cyOnlyChange = false; }
            this.addraw(cyUnchange, cyOnlyChange, false);
        };
        ArithmeticLogicUnit.prototype.adc = function (cyUnchange, cyOnlyChange) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (cyOnlyChange === void 0) { cyOnlyChange = false; }
            this.addraw(cyUnchange, cyOnlyChange, this.chip.flags.cy);
        };
        ArithmeticLogicUnit.prototype.inc = function () {
            var b = this.chip.tempReg.getValue();
            var r0 = this.addbase(b, 1, true);
            this.result.setValue(r0);
        };
        ArithmeticLogicUnit.prototype.dec = function () {
            var b = this.chip.tempReg.getValue();
            var r0 = this.subbase(b, 1, true);
            this.result.setValue(r0);
        };
        ArithmeticLogicUnit.prototype.subbase = function (a, b, cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.chip.flags.z = (r0 == 0);
            if (!cyUnchange)
                this.chip.flags.cy = rc;
            this.setps(r0);
            this.chip.flags.ac = false;
            return r0;
        };
        ArithmeticLogicUnit.prototype.subraw = function (cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r0 = this.subbase(a, b, cyUnchange, c);
            this.result.setValue(r0);
        };
        ArithmeticLogicUnit.prototype.sub = function (cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            this.subraw(cyUnchange, false);
        };
        ArithmeticLogicUnit.prototype.sbb = function (cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            this.subraw(cyUnchange, this.chip.flags.cy);
        };
        ArithmeticLogicUnit.prototype.setlogicFlags = function (v, ac) {
            this.chip.flags.z = (v == 0);
            this.chip.flags.cy = false;
            this.setps(v);
            this.chip.flags.ac = ac;
        };
        ArithmeticLogicUnit.prototype.and = function () {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a & b;
            this.setlogicFlags(r, true);
            this.result.setValue(r);
        };
        ArithmeticLogicUnit.prototype.or = function () {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a | b;
            this.setlogicFlags(r, false);
            this.result.setValue(r);
        };
        ArithmeticLogicUnit.prototype.xor = function () {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a ^ b;
            this.setlogicFlags(r, false);
            this.result.setValue(r);
        };
        ArithmeticLogicUnit.prototype.rlc = function () {
            var r = this.chip.accumulator.getValue();
            r <<= 1;
            var over = (r & 0x100) != 0;
            this.result.setValue((r & 255) + (over ? 1 : 0));
            this.chip.flags.cy = over;
        };
        ArithmeticLogicUnit.prototype.rrc = function () {
            var r = this.chip.accumulator.getValue();
            var over = (r & 1) != 0;
            r >>= 1;
            this.result.setValue((r & 255) + (over ? 0x80 : 0));
            this.chip.flags.cy = over;
        };
        ArithmeticLogicUnit.prototype.ral = function () {
            var r = this.chip.accumulator.getValue();
            r <<= 1;
            this.result.setValue((r & 255) + (this.chip.flags.cy ? 1 : 0));
            this.chip.flags.cy = (r & 0x100) != 0;
        };
        ArithmeticLogicUnit.prototype.rar = function () {
            var r = this.chip.accumulator.getValue();
            var over = (r & 1) != 0;
            r >>= 1;
            this.result.setValue((r & 255) + (this.chip.flags.cy ? 0x80 : 0));
            this.chip.flags.cy = over;
        };
        ArithmeticLogicUnit.prototype.cma = function () {
            var r = this.chip.accumulator.getValue();
            this.result.setValue((~r) & 0xff);
        };
        return ArithmeticLogicUnit;
    }());
    var FlagFlipFlop = (function () {
        function FlagFlipFlop() {
            this.z = false;
            this.s = false;
            this.p = false;
            this.cy = false;
            this.ac = false;
        }
        FlagFlipFlop.prototype.getPacked = function () {
            var n = 2;
            if (this.cy)
                n |= 1;
            if (this.p)
                n |= 4;
            if (this.ac)
                n |= 16;
            if (this.z)
                n |= 64;
            if (this.s)
                n |= 128;
            return n;
        };
        FlagFlipFlop.prototype.setPacked = function (n) {
            this.cy = (n & 1) != 0;
            this.p = (n & 4) != 0;
            this.ac = (n & 16) != 0;
            this.z = (n & 64) != 0;
            this.s = (n & 128) != 0;
        };
        return FlagFlipFlop;
    }());
    var DecimalAdjust = (function () {
        function DecimalAdjust(thischip) {
            this.chip = thischip;
        }
        DecimalAdjust.prototype.adjust = function () {
            var a = this.chip.accumulator.getValue();
            var al4 = a & 15;
            if (al4 > 9 || this.chip.flags.ac)
                a += 6;
            var ah4 = (a >> 4) & 15;
            if (ah4 > 9 || this.chip.flags.cy)
                a += 0x60;
            var r0 = a & 255;
            this.chip.accumulator.setValue(r0);
            var rc = (a >> 8) != 0;
            this.chip.flags.z = (a == 0);
            this.chip.flags.cy = rc;
            this.chip.alu.setps(r0);
            this.chip.flags.ac = false;
        };
        return DecimalAdjust;
    }());
    var InstructionRegister = (function (_super) {
        __extends(InstructionRegister, _super);
        function InstructionRegister() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return InstructionRegister;
    }(Register8));
    var InstructionDecoderAndMachineCycleEncoding = (function () {
        function InstructionDecoderAndMachineCycleEncoding(thischip) {
            this.g1 = 0;
            this.g2 = 0;
            this.g3 = 0;
            this.chip = thischip;
        }
        InstructionDecoderAndMachineCycleEncoding.prototype.Decode = function () {
            var machinCode1 = this.chip.insutructionRegister.getValue();
            var g1 = machinCode1 >> 6;
            var g2 = (machinCode1 >> 3) & 0x7;
            var g3 = machinCode1 & 0x7;
            this.g1 = g1;
            this.g2 = g2;
            this.g3 = g3;
            this.operationCode = OperationCode.NOP;
            if (g1 == 0) {
                if (g3 == 0) {
                    if (g2 == 0)
                        this.operationCode = OperationCode.NOP;
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 1) {
                    if ((g2 & 1) == 0)
                        this.operationCode = OperationCode.LXI;
                    else
                        this.operationCode = OperationCode.DAD;
                }
                else if (g3 == 2) {
                    if ((g2 & 0x5) == 0x0)
                        this.operationCode = OperationCode.STAX;
                    else if ((g2 & 0x5) == 0x1)
                        this.operationCode = OperationCode.LDAX;
                    else if (g2 == 4)
                        this.operationCode = OperationCode.SHLD;
                    else if (g2 == 5)
                        this.operationCode = OperationCode.LHLD;
                    else if (g2 == 6)
                        this.operationCode = OperationCode.STA;
                    else if (g2 == 7)
                        this.operationCode = OperationCode.LDA;
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 3) {
                    if ((g2 & 1) == 0)
                        this.operationCode = OperationCode.INX;
                    else
                        this.operationCode = OperationCode.DEX;
                }
                else if (g3 == 4)
                    this.operationCode = OperationCode.INR;
                else if (g3 == 5)
                    this.operationCode = OperationCode.DCR;
                else if (g3 == 6)
                    this.operationCode = OperationCode.MVI;
                else if (g3 == 7) {
                    if (g2 == 0)
                        this.operationCode = OperationCode.ALU1; // RLC
                    else if (g2 == 1)
                        this.operationCode = OperationCode.ALU1; //RRC
                    else if (g2 == 2)
                        this.operationCode = OperationCode.ALU1; //RAL
                    else if (g2 == 3)
                        this.operationCode = OperationCode.ALU1; //RAR
                    else if (g2 == 4)
                        this.operationCode = OperationCode.DAA;
                    else if (g2 == 5)
                        this.operationCode = OperationCode.ALU1; //CMA
                    else if (g2 == 6)
                        this.operationCode = OperationCode.STC;
                    else if (g2 == 7)
                        this.operationCode = OperationCode.CMC;
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else
                    this.chip.notImplemented(machinCode1);
            }
            else if (g1 == 1) {
                if (g2 == 6 && g3 == 6)
                    this.operationCode = OperationCode.HLT;
                else
                    this.operationCode = OperationCode.MOV;
            }
            else if (g1 == 2)
                this.operationCode = OperationCode.ALU2; // this is a trick of ADD,ADC,SUB,SBB,AND,XRA,ORA,CMP
            else {
                if (g3 == 0)
                    this.operationCode = OperationCode.Rxx;
                else if (g3 == 1) {
                    if ((g2 & 1) == 0)
                        this.operationCode = OperationCode.POP;
                    else if (g2 == 1)
                        this.operationCode = OperationCode.Rxx; // RET
                    else if (g2 == 5)
                        this.operationCode = OperationCode.PCHL;
                    else if (g2 == 7)
                        this.operationCode = OperationCode.SPHL;
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 2)
                    this.operationCode = OperationCode.Jxx;
                else if (g3 == 3) {
                    if (g2 == 0)
                        this.operationCode = OperationCode.Jxx; // JMP
                    else if (g2 == 3)
                        this.operationCode = OperationCode.IN;
                    else if (g2 == 2)
                        this.operationCode = OperationCode.OUT;
                    else if (g2 == 4)
                        this.operationCode = OperationCode.XTHL;
                    else if (g2 == 5)
                        this.operationCode = OperationCode.XCHG;
                    else if (g2 == 6)
                        this.operationCode = OperationCode.NOP; // ASSUMED AS NOP
                    else if (g2 == 7)
                        this.operationCode = OperationCode.NOP; // ASSUMED AS NOP
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 4)
                    this.operationCode = OperationCode.Cxx;
                else if (g3 == 5) {
                    if ((g2 & 1) == 0)
                        this.operationCode = OperationCode.PUSH;
                    else if (g2 == 1)
                        this.operationCode = OperationCode.Cxx;
                    else
                        this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 6)
                    this.operationCode = OperationCode.ALU2; // this is a trick of ADI,ACI,SUI,SBI,ANI,XRI,ORI,CPI
                else if (g3 == 7)
                    this.operationCode = OperationCode.RST;
                else
                    this.chip.notImplemented(machinCode1);
            }
            return false;
        };
        return InstructionDecoderAndMachineCycleEncoding;
    }());
    var RegisterArray = (function () {
        function RegisterArray(thischip) {
            this.w = new Register8();
            this.z = new Register8();
            this.b = new Register8();
            this.c = new Register8();
            this.d = new Register8();
            this.e = new Register8();
            this.h = new Register8();
            this.l = new Register8();
            this.sp = new Register16();
            this.pc = new Register16();
            this.incrementerDecrementerAddressLatch = new Register16();
            this.chip = thischip;
        }
        // n: 0=BC, 1=DE, 2=HL, 3=SP, 4=WZ
        RegisterArray.prototype.getRegisterPairValue = function (n) {
            switch (n) {
                case 0:
                    return this.b.getValue() * 256 + this.c.getValue();
                case 1:
                    return this.d.getValue() * 256 + this.e.getValue();
                case 2:
                    return this.h.getValue() * 256 + this.l.getValue();
                case 3:
                    return this.sp.getValue();
                case 4:
                    return this.w.getValue() * 256 + this.z.getValue();
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
            }
        };
        RegisterArray.prototype.setRegisterPairValue = function (n, v) {
            var l = v & 255;
            var h = v >> 8;
            switch (n) {
                case 0:
                    this.b.setValue(h);
                    this.c.setValue(l);
                    break;
                case 1:
                    this.d.setValue(h);
                    this.e.setValue(l);
                    break;
                case 2:
                    this.h.setValue(h);
                    this.l.setValue(l);
                    break;
                case 3:
                    this.sp.setValue(v);
                    break;
                case 4:
                    this.w.setValue(h);
                    this.z.setValue(l);
                    break;
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
                    break;
            }
        };
        RegisterArray.prototype.getSelectedRegisterPairValue = function () {
            switch (this.chip.registerSelect16) {
                case RegisterSelect16.bc:
                case RegisterSelect16.de:
                case RegisterSelect16.hl:
                case RegisterSelect16.sp:
                case RegisterSelect16.wz:
                    return this.getRegisterPairValue(this.chip.registerSelect16);
                case RegisterSelect16.pc:
                    return this.pc.getValue();
                default:
                    return this.incrementerDecrementerAddressLatch.getValue();
            }
        };
        RegisterArray.prototype.setSelectedRegisterPairValue = function (v) {
            switch (this.chip.registerSelect16) {
                case RegisterSelect16.bc:
                case RegisterSelect16.de:
                case RegisterSelect16.hl:
                case RegisterSelect16.sp:
                    this.setRegisterPairValue(this.chip.registerSelect16, v);
                    break;
                case RegisterSelect16.pc:
                    this.pc.setValue(v);
                    break;
                default:
                    this.incrementerDecrementerAddressLatch.setValue(v);
                    break;
            }
        };
        RegisterArray.prototype.transferSelectedRefgister16toAddressLatch = function () {
            var hl = this.getSelectedRegisterPairValue();
            this.incrementerDecrementerAddressLatch.setValue(hl);
        };
        RegisterArray.prototype.transferSelectedRefgister16fromAddressLatch = function () {
            var hl = this.incrementerDecrementerAddressLatch.getValue();
            this.setSelectedRegisterPairValue(hl);
        };
        RegisterArray.prototype.transferSelectedRefgister16toPC = function () {
            var val = this.getSelectedRegisterPairValue();
            this.pc.setValue(val);
        };
        RegisterArray.prototype.swapHLandDE = function () {
            var t = this.chip.regarray.l.getValue();
            this.chip.regarray.l.setValue(this.chip.regarray.e.getValue());
            this.chip.regarray.e.setValue(t);
            var t = this.chip.regarray.h.getValue();
            this.chip.regarray.h.setValue(this.chip.regarray.d.getValue());
            this.chip.regarray.d.setValue(t);
        };
        return RegisterArray;
    }());
    var TimingAndControl = (function () {
        function TimingAndControl(thischip) {
            this.chip = thischip;
        }
        TimingAndControl.prototype.fetchNextByte = function () {
            this.chip.registerSelect16 = RegisterSelect16.pc;
            this.chip.memoryRead();
            this.chip.regarray.pc.Increment();
        };
        TimingAndControl.prototype.fetchNextWord = function () {
            this.fetchNextByte();
            var l = this.chip.dataBusBufferLatch.getValue();
            this.fetchNextByte();
            var h = this.chip.dataBusBufferLatch.getValue();
            var hl = h * 256 + l;
            return hl;
        };
        TimingAndControl.prototype.fetchNextWordToWZ = function () {
            this.fetchNextByte();
            this.chip.regarray.z.setValue(this.chip.dataBusBufferLatch.getValue());
            this.fetchNextByte();
            this.chip.regarray.w.setValue(this.chip.dataBusBufferLatch.getValue());
        };
        TimingAndControl.prototype.fetchNextByteAndSetDataLatch = function () {
            this.chip.timingAndControl.fetchNextByte();
            this.chip.dataBusBufferLatch.setValue(this.chip.dataBusBufferLatch.getValue());
        };
        TimingAndControl.prototype.fetchNextWordAndSetAddressLatch = function () {
            this.chip.timingAndControl.fetchNextByte();
            var l = this.chip.dataBusBufferLatch.getValue();
            this.chip.timingAndControl.fetchNextByte();
            var h = this.chip.dataBusBufferLatch.getValue();
            this.chip.regarray.incrementerDecrementerAddressLatch.setValueHL(l, h);
            this.chip.registerSelect16 = RegisterSelect16.latch;
        };
        TimingAndControl.prototype.instructionFetch = function () {
            this.fetchNextByte();
            var data = this.chip.dataBusBufferLatch.getValue();
            this.chip.insutructionRegister.setValue(data);
        };
        TimingAndControl.prototype.aluWithAcc = function () {
            switch (this.chip.instructonDecoder.g2) {
                case 0:
                    this.chip.alu.rlc();
                    break;
                case 1:
                    this.chip.alu.rrc();
                    break;
                case 2:
                    this.chip.alu.ral();
                    break;
                case 3:
                    this.chip.alu.rar();
                    break;
                case 5:
                    this.chip.alu.cma();
                    break;
            }
            this.chip.accumulator.setValue(this.chip.alu.result.getValue());
        };
        TimingAndControl.prototype.aluWithAccAndTemp = function () {
            this.chip.accumulatorLatch.setValue(this.chip.accumulator.getValue());
            switch (this.chip.instructonDecoder.g2) {
                case 0:
                    this.chip.alu.add();
                    break;
                case 1:
                    this.chip.alu.adc();
                    break;
                case 2:
                    this.chip.alu.sub();
                    break;
                case 3:
                    this.chip.alu.sbb();
                    break;
                case 4:
                    this.chip.alu.and();
                    break;
                case 5:
                    this.chip.alu.xor();
                    break;
                case 6:
                    this.chip.alu.or();
                    break;
                case 7:
                    this.chip.alu.cmp();
                    return;
            }
            this.chip.setRegisterFromAlu(7); //save acc if not CMP
        };
        TimingAndControl.prototype.runMain = function () {
            var _this = this;
            vdt.inputFunc = function (num) {
                emu.inputChars += String.fromCharCode(num);
                if (vdt.inputFuncAfter)
                    vdt.inputFuncAfter();
            };
            for (;;) {
                if (emu.waitingInput) {
                    emu.waitingInput = false;
                    vdt.inputFuncAfter = function () {
                        vdt.inputFuncAfter = null;
                        setTimeout(function () {
                            _this.chip.runMain();
                        }, 0);
                    };
                    return;
                }
                if (emu.screenRefreshRequest) {
                    emu.screenRefreshRequest = false;
                    setTimeout(function () {
                        _this.chip.runMain();
                    }, 0);
                    return;
                }
                this.instructionFetch();
                if (this.chip.instructonDecoder.Decode())
                    return;
                switch (this.chip.instructonDecoder.operationCode) {
                    case OperationCode.NOP:
                        // do nothing
                        break;
                    case OperationCode.LXI:
                        var dword = this.chip.timingAndControl.fetchNextWord();
                        this.chip.registerSelect16 = this.chip.instructonDecoder.g2 >> 1;
                        this.chip.regarray.setSelectedRegisterPairValue(dword);
                        break;
                    case OperationCode.DAD:
                        var tgt = this.chip.regarray.getRegisterPairValue(this.chip.instructonDecoder.g2 >> 1);
                        this.chip.accumulatorLatch.setValue(this.chip.regarray.l.getValue());
                        this.chip.tempReg.setValue(lowByte(tgt));
                        this.chip.alu.add(false, true);
                        var resultL = this.chip.alu.result.getValue();
                        this.chip.accumulatorLatch.setValue(this.chip.regarray.h.getValue());
                        this.chip.tempReg.setValue(highByte(tgt));
                        this.chip.alu.adc(false, true);
                        var resultH = this.chip.alu.result.getValue();
                        this.chip.regarray.l.setValue(resultL);
                        this.chip.regarray.h.setValue(resultH);
                        break;
                    case OperationCode.LDAX:
                        this.chip.registerSelect16 = this.chip.instructonDecoder.g2 >> 1;
                        this.chip.memoryRead();
                        this.chip.accumulator.setValue(this.chip.dataBusBufferLatch.getValue());
                        break;
                    case OperationCode.STAX:
                        this.chip.registerSelect16 = this.chip.instructonDecoder.g2 >> 1;
                        this.chip.dataBusBufferLatch.setValue(this.chip.accumulator.getValue());
                        this.chip.memoryWrite();
                        break;
                    case OperationCode.LHLD:
                        this.fetchNextWordAndSetAddressLatch();
                        this.chip.memoryRead();
                        this.chip.regarray.l.setValue(this.chip.dataBusBufferLatch.getValue());
                        this.chip.regarray.incrementerDecrementerAddressLatch.Increment();
                        this.chip.memoryRead();
                        this.chip.regarray.h.setValue(this.chip.dataBusBufferLatch.getValue());
                        break;
                    case OperationCode.SHLD:
                        this.fetchNextWordAndSetAddressLatch();
                        this.chip.dataBusBufferLatch.setValue(this.chip.regarray.l.getValue());
                        this.chip.memoryWrite();
                        this.chip.regarray.incrementerDecrementerAddressLatch.Increment();
                        this.chip.dataBusBufferLatch.setValue(this.chip.regarray.h.getValue());
                        this.chip.memoryWrite();
                        break;
                    case OperationCode.LDA:
                        this.fetchNextWordAndSetAddressLatch();
                        this.chip.memoryRead();
                        this.chip.accumulator.setValue(this.chip.dataBusBufferLatch.getValue());
                        break;
                    case OperationCode.STA:
                        this.fetchNextWordAndSetAddressLatch();
                        this.chip.dataBusBufferLatch.setValue(this.chip.accumulator.getValue());
                        this.chip.memoryWrite();
                        break;
                    case OperationCode.INX:
                        this.chip.registerSelect16 = this.chip.instructonDecoder.g2 >> 1;
                        this.chip.regarray.transferSelectedRefgister16toAddressLatch();
                        this.chip.regarray.incrementerDecrementerAddressLatch.Increment();
                        this.chip.regarray.transferSelectedRefgister16fromAddressLatch();
                        break;
                    case OperationCode.DEX:
                        this.chip.registerSelect16 = this.chip.instructonDecoder.g2 >> 1;
                        this.chip.regarray.transferSelectedRefgister16toAddressLatch();
                        this.chip.regarray.incrementerDecrementerAddressLatch.Decrement();
                        this.chip.regarray.transferSelectedRefgister16fromAddressLatch();
                        break;
                    case OperationCode.INR:
                        this.chip.getRegisterToTempReg(this.chip.instructonDecoder.g2);
                        this.chip.alu.inc();
                        this.chip.setRegisterFromAlu(this.chip.instructonDecoder.g2);
                        break;
                    case OperationCode.DCR:
                        this.chip.getRegisterToTempReg(this.chip.instructonDecoder.g2);
                        this.chip.alu.dec();
                        this.chip.setRegisterFromAlu(this.chip.instructonDecoder.g2);
                        break;
                    case OperationCode.MVI:
                        this.fetchNextByteAndSetDataLatch();
                        this.chip.setRegisterFromDataLatch(this.chip.instructonDecoder.g2);
                        break;
                    case OperationCode.DAA:
                        this.chip.decimalAdjust.adjust();
                        break;
                    case OperationCode.STC:
                        this.chip.flags.cy = true;
                        break;
                    case OperationCode.CMC:
                        this.chip.flags.cy = !this.chip.flags.cy;
                        break;
                    case OperationCode.HLT:
                        this.chip.hlt();
                        return;
                    case OperationCode.MOV:
                        this.chip.getRegisterToTempReg(this.chip.instructonDecoder.g3);
                        this.chip.setRegisterFromTempReg(this.chip.instructonDecoder.g2);
                        break;
                    case OperationCode.ALU1:
                        this.aluWithAcc();
                        break;
                    case OperationCode.ALU2:
                        if (this.chip.instructonDecoder.g1 == 2)
                            // with register
                            this.chip.getRegisterToTempReg(this.chip.instructonDecoder.g3);
                        else {
                            // with immediate value
                            this.chip.timingAndControl.fetchNextByte();
                            this.chip.tempReg.setValue(this.chip.dataBusBufferLatch.getValue());
                        }
                        this.aluWithAccAndTemp();
                        break;
                    case OperationCode.Rxx:
                        if (this.chip.instructonDecoder.g3 == 1 // in case of RET
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {
                            this.chip.popToWZ();
                            this.chip.registerSelect16 = RegisterSelect16.wz;
                            var hl = this.chip.regarray.getSelectedRegisterPairValue();
                            this.chip.registerSelect16 = RegisterSelect16.pc;
                            this.chip.regarray.setSelectedRegisterPairValue(hl);
                        }
                        break;
                    case OperationCode.PUSH:
                        this.chip.registerSelect16 = RegisterSelect16.sp;
                        var data;
                        switch (this.chip.instructonDecoder.g2 & 6) {
                            case 0:
                                data = this.chip.regarray.b.getValue();
                                break;
                            case 2:
                                data = this.chip.regarray.d.getValue();
                                break;
                            case 4:
                                data = this.chip.regarray.h.getValue();
                                break;
                            case 6:
                                data = this.chip.accumulator.getValue();
                                break;
                        }
                        this.chip.dataBusBufferLatch.setValue(data);
                        this.chip.regarray.sp.Decrement();
                        this.chip.memoryWrite();
                        switch (this.chip.instructonDecoder.g2 & 6) {
                            case 0:
                                data = this.chip.regarray.c.getValue();
                                break;
                            case 2:
                                data = this.chip.regarray.e.getValue();
                                break;
                            case 4:
                                data = this.chip.regarray.l.getValue();
                                break;
                            case 6:
                                data = this.chip.flags.getPacked();
                                break;
                        }
                        this.chip.registerSelect16 = RegisterSelect16.sp;
                        this.chip.dataBusBufferLatch.setValue(data);
                        this.chip.regarray.sp.Decrement();
                        this.chip.memoryWrite();
                        break;
                    case OperationCode.POP:
                        this.chip.registerSelect16 = RegisterSelect16.sp;
                        this.chip.memoryRead();
                        this.chip.regarray.sp.Increment();
                        var data = this.chip.dataBusBufferLatch.getValue();
                        switch (this.chip.instructonDecoder.g2 & 6) {
                            case 0:
                                this.chip.regarray.c.setValue(data);
                                break;
                            case 2:
                                this.chip.regarray.e.setValue(data);
                                break;
                            case 4:
                                this.chip.regarray.l.setValue(data);
                                break;
                            case 6:
                                this.chip.flags.setPacked(data);
                                break;
                        }
                        this.chip.registerSelect16 = RegisterSelect16.sp;
                        this.chip.memoryRead();
                        this.chip.regarray.sp.Increment();
                        data = this.chip.dataBusBufferLatch.getValue();
                        switch (this.chip.instructonDecoder.g2 & 6) {
                            case 0:
                                this.chip.regarray.b.setValue(data);
                                break;
                            case 2:
                                this.chip.regarray.d.setValue(data);
                                break;
                            case 4:
                                this.chip.regarray.h.setValue(data);
                                break;
                            case 6:
                                this.chip.accumulator.setValue(data);
                                break;
                        }
                        break;
                    case OperationCode.PCHL:
                        var v = this.chip.regarray.getRegisterPairValue(2); // HL
                        this.chip.regarray.pc.setValue(v);
                        break;
                    case OperationCode.SPHL:
                        var v = this.chip.regarray.getRegisterPairValue(2); // HL
                        this.chip.regarray.sp.setValue(v);
                        break;
                    case OperationCode.Jxx:
                        this.chip.timingAndControl.fetchNextWordToWZ();
                        if (this.chip.instructonDecoder.g3 == 3 // in case of JMP
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {
                            this.chip.registerSelect16 = RegisterSelect16.wz;
                            this.chip.regarray.transferSelectedRefgister16toPC();
                        }
                        break;
                    case OperationCode.XTHL:
                        this.chip.popToWZ();
                        this.chip.registerSelect16 = RegisterSelect16.hl;
                        var hl = this.chip.regarray.getSelectedRegisterPairValue();
                        this.chip.pushCommon(hl);
                        this.chip.regarray.l.setValue(this.chip.regarray.z.getValue());
                        this.chip.regarray.h.setValue(this.chip.regarray.w.getValue());
                        break;
                    case OperationCode.XCHG:
                        this.chip.regarray.swapHLandDE();
                        break;
                    case OperationCode.IN:
                        this.chip.timingAndControl.fetchNextByte();
                        var d = this.chip.dataBusBufferLatch.getValue();
                        this.chip.regarray.w.setValue(d);
                        this.chip.regarray.z.setValue(d);
                        this.chip.registerSelect16 = RegisterSelect16.wz;
                        this.chip.regarray.transferSelectedRefgister16toAddressLatch();
                        this.chip.ioRead();
                        this.chip.setRegister(7, this.chip.dataBusBufferLatch.getValue());
                        break;
                    case OperationCode.OUT:
                        this.chip.timingAndControl.fetchNextByte();
                        var d = this.chip.dataBusBufferLatch.getValue();
                        this.chip.regarray.w.setValue(d);
                        this.chip.regarray.z.setValue(d);
                        this.chip.registerSelect16 = RegisterSelect16.wz;
                        this.chip.regarray.transferSelectedRefgister16toAddressLatch();
                        this.chip.dataBusBufferLatch.setValue(this.chip.getRegister(7));
                        this.chip.ioWrite();
                        break;
                    case OperationCode.Cxx:
                        this.chip.timingAndControl.fetchNextWordToWZ();
                        if (this.chip.instructonDecoder.g3 != 4 // in case of CALL
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {
                            this.chip.pushCommon(this.chip.regarray.pc.getValue());
                            this.chip.registerSelect16 = RegisterSelect16.wz;
                            this.chip.regarray.transferSelectedRefgister16toPC();
                        }
                        break;
                    case OperationCode.RST:
                        var oldpc = this.chip.regarray.pc.getValue();
                        if (emu.superTrap && this.chip.instructonDecoder.g2 == 7) {
                            this.chip.hlt();
                            emu.setMonitor();
                            return true;
                        }
                        this.chip.regarray.pc.setValue(this.chip.instructonDecoder.g2 << 3);
                        this.chip.pushCommon(oldpc);
                        break;
                    default:
                        console.log("Unknown OperationCode:" + this.chip.instructonDecoder.operationCode);
                }
                if (emu.stepMode) {
                    this.chip.break();
                    return true;
                }
            }
        };
        return TimingAndControl;
    }());
    var i8080 = (function () {
        function i8080() {
            this.halt = true;
            this.accumulator = new Accumulator();
            this.accumulatorLatch = new AccumulatorLatch();
            this.tempReg = new TempReg();
            this.regarray = new RegisterArray(this);
            this.flags = new FlagFlipFlop();
            this.timingAndControl = new TimingAndControl(this);
            this.dataBusBufferLatch = new DataBusBufferLatch();
            this.addressBuffer = new AddressBuffer(this);
            this.registerSelect16 = 0;
            this.registerSelect8 = 0;
            this.insutructionRegister = new InstructionRegister();
            this.instructonDecoder = new InstructionDecoderAndMachineCycleEncoding(this);
            this.alu = new ArithmeticLogicUnit(this);
            this.decimalAdjust = new DecimalAdjust(this);
        }
        i8080.prototype.memoryRead = function () {
            var addr = this.addressBuffer.getAddress();
            var data = emu.virtualMachine.memory.Bytes.read(addr);
            this.dataBusBufferLatch.setValue(data);
        };
        i8080.prototype.memoryWrite = function () {
            var addr = this.addressBuffer.getAddress();
            var data = this.dataBusBufferLatch.getValue();
            emu.virtualMachine.memory.Bytes.write(addr, data);
        };
        i8080.prototype.ioRead = function () {
            var addr = this.addressBuffer.getAddress();
            var data = emu.virtualMachine.io.in(addr & 255);
            this.dataBusBufferLatch.setValue(data);
        };
        i8080.prototype.ioWrite = function () {
            var addr = this.addressBuffer.getAddress();
            var data = this.dataBusBufferLatch.getValue();
            emu.virtualMachine.io.out(addr & 255, data);
        };
        i8080.prototype.update = function () {
            $("#regA").text(dec2hex(this.accumulator.getValue(), 2));
            $("#regBC").text(dec2hex(this.regarray.b.getValue(), 2) + dec2hex(this.regarray.c.getValue(), 2));
            $("#regDE").text(dec2hex(this.regarray.d.getValue(), 2) + dec2hex(this.regarray.e.getValue(), 2));
            $("#regHL").text(dec2hex(this.regarray.h.getValue(), 2) + dec2hex(this.regarray.l.getValue(), 2));
            $("#regSP").text(dec2hex(this.regarray.sp.getValue(), 4));
            $("#regPC").text(dec2hex(this.regarray.pc.getValue(), 4));
            var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
            var m = emu.virtualMachine.memory.Bytes.read(Math.floor(hl));
            $("#regM").text(dec2hex(m, 2));
            $("#regS").text(this.flags.s ? 1 : 0);
            $("#regZ").text(this.flags.z ? 1 : 0);
            $("#regP").text(this.flags.p ? 1 : 0);
            $("#regC").text(this.flags.cy ? 1 : 0);
            $("#regAC").text(this.flags.ac ? 1 : 0);
        };
        i8080.prototype.randomInitialize = function () {
            this.accumulator.randomInitialize();
            this.regarray.b.randomInitialize();
            this.regarray.c.randomInitialize();
            this.regarray.d.randomInitialize();
            this.regarray.e.randomInitialize();
            this.regarray.h.randomInitialize();
            this.regarray.l.randomInitialize();
            this.regarray.sp.randomInitialize();
        };
        i8080.prototype.selectRegister = function (n) {
            var r;
            switch (n) {
                case 0: return this.regarray.b;
                case 1: return this.regarray.c;
                case 2: return this.regarray.d;
                case 3: return this.regarray.e;
                case 4: return this.regarray.h;
                case 5: return this.regarray.l;
                case 6: return null;
                case 7: return this.accumulator;
            }
        };
        i8080.prototype.setRegister = function (n, v) {
            var r = this.selectRegister(n);
            if (r == null) {
                this.registerSelect16 = RegisterSelect16.hl;
                this.regarray.transferSelectedRefgister16toAddressLatch();
                this.dataBusBufferLatch.setValue(v);
                this.memoryWrite();
            }
            else
                r.setValue(v);
        };
        i8080.prototype.getRegister = function (n) {
            var r = this.selectRegister(n);
            if (r == null) {
                this.registerSelect16 = RegisterSelect16.hl;
                this.regarray.transferSelectedRefgister16toAddressLatch();
                this.memoryRead();
                return this.dataBusBufferLatch.getValue();
            }
            else
                return r.getValue();
        };
        i8080.prototype.getRegisterToTempReg = function (reg8) {
            var val = this.getRegister(reg8);
            this.tempReg.setValue(val);
        };
        i8080.prototype.setRegisterFromTempReg = function (reg8) {
            var val = this.tempReg.getValue();
            this.setRegister(reg8, val);
        };
        i8080.prototype.setRegisterFromAlu = function (reg8) {
            var val = this.alu.result.getValue();
            this.setRegister(reg8, val);
        };
        i8080.prototype.setRegisterFromDataLatch = function (reg8) {
            var val = this.dataBusBufferLatch.getValue();
            this.setRegister(reg8, val);
        };
        i8080.prototype.setRuning = function () {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("run");
            $("#runStopStatus").text("RUN");
        };
        i8080.prototype.setStopped = function () {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("stop");
            $("#runStopStatus").text("STOP");
        };
        i8080.prototype.undefinedInstuction = function (n) {
            alert(n.toString(16) + " is not undefined machine code");
        };
        i8080.prototype.notImplemented = function (n) {
            alert(n.toString(16) + " is not implemented");
        };
        i8080.prototype.condCommon = function (g2) {
            switch (g2) {
                case 0:
                    return !this.flags.z;
                case 1:
                    return this.flags.z;
                case 2:
                    return !this.flags.cy;
                case 3:
                    return this.flags.cy;
                case 4:
                    return !this.flags.p;
                case 5:
                    return this.flags.p;
                case 6:
                    return !this.flags.s;
                case 7:
                    return this.flags.s;
            }
        };
        i8080.prototype.popToWZ = function () {
            this.registerSelect16 = RegisterSelect16.sp;
            this.memoryRead();
            this.regarray.sp.Increment();
            this.regarray.z.setValue(this.dataBusBufferLatch.getValue());
            this.memoryRead();
            this.regarray.sp.Increment();
            this.regarray.w.setValue(this.dataBusBufferLatch.getValue());
        };
        i8080.prototype.pushCommon = function (val) {
            this.registerSelect16 = RegisterSelect16.sp;
            this.regarray.sp.Decrement();
            this.dataBusBufferLatch.setValue(val >> 8);
            this.memoryWrite();
            this.regarray.sp.Decrement();
            var h = this.dataBusBufferLatch.setValue(val & 255);
            this.memoryWrite();
        };
        i8080.prototype.hlt = function () {
            this.halt = true;
            emu.virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
            emu.tracebox.dump();
        };
        i8080.prototype.break = function () {
            emu.virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
            emu.tracebox.dump();
        };
        i8080.prototype.runMain = function () {
            this.timingAndControl.runMain();
        };
        i8080.prototype.reset = function () {
            var _this = this;
            this.randomInitialize();
            this.regarray.pc.setValue(0);
            this.halt = false;
            this.setRuning();
            setTimeout(function () {
                _this.runMain();
            }, 100);
        };
        i8080.prototype.diskread = function () {
            var hl = this.regarray.getRegisterPairValue(2);
            var r = disk.read(this.regarray.b.getValue(), this.regarray.c.getValue(), this.regarray.e.getValue(), hl);
            return r;
        };
        i8080.prototype.diskwrite = function () {
            return disk.write(this.regarray.b.getValue(), this.regarray.c.getValue(), this.regarray.e.getValue(), this.regarray.getRegisterPairValue(2));
        };
        i8080.prototype.getName = function () {
            return "i8080 emulator (Educational) Ready\r\n";
        };
        return i8080;
    }());
    edu8080.i8080 = i8080;
})(edu8080 || (edu8080 = {}));
//# sourceMappingURL=edu8080.js.map