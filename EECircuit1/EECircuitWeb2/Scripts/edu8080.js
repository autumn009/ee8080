var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var edu8080;
(function (edu8080) {
    var OperationCode;
    (function (OperationCode) {
        OperationCode[OperationCode["LXI"] = 0] = "LXI";
        OperationCode[OperationCode["DAD"] = 1] = "DAD";
        OperationCode[OperationCode["LDAX"] = 2] = "LDAX";
        OperationCode[OperationCode["STAX"] = 3] = "STAX";
        OperationCode[OperationCode["ADD"] = 4] = "ADD";
        OperationCode[OperationCode["SUB"] = 5] = "SUB";
        OperationCode[OperationCode["CMP"] = 6] = "CMP";
        OperationCode[OperationCode["AND"] = 7] = "AND";
        OperationCode[OperationCode["OR"] = 8] = "OR";
        OperationCode[OperationCode["XOR"] = 9] = "XOR";
        OperationCode[OperationCode["NOT"] = 10] = "NOT";
        OperationCode[OperationCode["RLC"] = 11] = "RLC";
        OperationCode[OperationCode["RRC"] = 12] = "RRC";
        OperationCode[OperationCode["RAL"] = 13] = "RAL";
        OperationCode[OperationCode["RAR"] = 14] = "RAR";
        OperationCode[OperationCode["NOP"] = 15] = "NOP";
        OperationCode[OperationCode["OTHER"] = 16] = "OTHER";
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
        RegisterSelect16[RegisterSelect16["pc"] = 4] = "pc";
        RegisterSelect16[RegisterSelect16["latch"] = 5] = "latch";
    })(RegisterSelect16 || (RegisterSelect16 = {}));
    var DataBus = (function () {
        function DataBus() {
        }
        return DataBus;
    }());
    var AddressBus = (function () {
        function AddressBus() {
        }
        return AddressBus;
    }());
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
                default:
                    return this.chip.regarray.incrementerDecrementerAddressLatch.getValue();
            }
        };
        return AddressBuffer;
    }());
    var InternalDataBus = (function () {
        function InternalDataBus() {
        }
        return InternalDataBus;
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
            if (this.value > this.upperLimit)
                this.value = 0;
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
        ArithmeticLogicUnit.prototype.cmp = function (a, b) {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            this.sub(a, b);
        };
        ArithmeticLogicUnit.prototype.addraw = function (cyUnchange, cyOnlyChange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (cyOnlyChange === void 0) { cyOnlyChange = false; }
            if (c === void 0) { c = false; }
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
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
        ArithmeticLogicUnit.prototype.subraw = function (cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.chip.flags.z = (r0 == 0);
            if (!cyUnchange)
                this.chip.flags.cy = rc;
            this.setps(r0);
            this.chip.flags.ac = false;
            this.result.setValue(r0);
        };
        ArithmeticLogicUnit.prototype.sub = function (a, b, cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            this.subraw(cyUnchange, false);
        };
        ArithmeticLogicUnit.prototype.sbb = function (a, b, cyUnchange, c) {
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
        function DecimalAdjust() {
        }
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
            this.registerSelect16 = 0;
            this.registerSelect8 = 0;
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
                    if (g2 == 0) {
                        this.operationCode = OperationCode.NOP;
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 1) {
                    if ((g2 & 1) == 0) {
                        this.operationCode = OperationCode.LXI;
                    }
                    else {
                        this.operationCode = OperationCode.DAD;
                    }
                    this.registerSelect16 = g2 >> 1;
                }
                else if (g3 == 2) {
                    if ((g2 & 0x5) == 0x0) {
                        this.operationCode = OperationCode.STAX;
                        this.registerSelect16 = g2 >> 1;
                    }
                    else if ((g2 & 0x5) == 0x1) {
                        this.operationCode = OperationCode.LDAX;
                        this.registerSelect16 = g2 >> 1;
                    }
                    else if (g2 == 4) {
                        var addr = this.chip.timingAndControl.fetchNextWord();
                        emu.virtualMachine.memory.Bytes.write(addr, this.chip.regarray.l.getValue());
                        addr = incrementAddress(addr);
                        emu.virtualMachine.memory.Bytes.write(addr, this.chip.regarray.h.getValue());
                    }
                    else if (g2 == 5) {
                        var addr = this.chip.timingAndControl.fetchNextWord();
                        this.chip.regarray.l.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                        addr = incrementAddress(addr);
                        this.chip.regarray.h.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                    }
                    else if (g2 == 6) {
                        emu.virtualMachine.memory.Bytes.write(this.chip.timingAndControl.fetchNextWord(), this.chip.accumulator.getValue());
                    }
                    else if (g2 == 7) {
                        this.chip.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(this.chip.timingAndControl.fetchNextWord()));
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 3) {
                    var hl = this.chip.regarray.getRegisterPairValue(g2 >> 1);
                    if ((g2 & 1) == 0)
                        hl++;
                    else
                        hl--;
                    this.chip.regarray.setRegisterPairValue(g2 >> 1, hl & 0xffff);
                }
                else if (g3 == 4) {
                    var val = this.chip.getRegister(g2);
                    val = this.chip.add(val, 1, true);
                    this.chip.setRegister(g2, val);
                }
                else if (g3 == 5) {
                    var val = this.chip.getRegister(g2);
                    val = this.chip.sub(val, 1, true);
                    this.chip.setRegister(g2, val);
                }
                else if (g3 == 6) {
                    this.chip.setRegister(g2, this.chip.timingAndControl.fetchNextByte());
                }
                else if (g3 == 7) {
                    if (g2 == 0) {
                        var r = this.chip.accumulator.getValue();
                        r <<= 1;
                        var over = (r & 0x100) != 0;
                        this.chip.accumulator.setValue((r & 255) + (over ? 1 : 0));
                        this.chip.flags.cy = over;
                    }
                    else if (g2 == 1) {
                        var r = this.chip.accumulator.getValue();
                        var over = (r & 1) != 0;
                        r >>= 1;
                        this.chip.accumulator.setValue((r & 255) + (over ? 0x80 : 0));
                        this.chip.flags.cy = over;
                    }
                    else if (g2 == 2) {
                        var r = this.chip.accumulator.getValue();
                        r <<= 1;
                        this.chip.accumulator.setValue((r & 255) + (this.chip.flags.cy ? 1 : 0));
                        this.chip.flags.cy = (r & 0x100) != 0;
                    }
                    else if (g2 == 3) {
                        var r = this.chip.accumulator.getValue();
                        var over = (r & 1) != 0;
                        r >>= 1;
                        this.chip.accumulator.setValue((r & 255) + (this.chip.flags.cy ? 0x80 : 0));
                        this.chip.flags.cy = over;
                    }
                    else if (g2 == 4) {
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
                        this.chip.setps(r0);
                        this.chip.flags.ac = false;
                    }
                    else if (g2 == 5) {
                        this.chip.accumulator.setValue((~this.chip.accumulator.getValue()) & 255);
                    }
                    else if (g2 == 6) {
                        this.chip.flags.cy = true;
                    }
                    else if (g2 == 7) {
                        this.chip.flags.cy = !this.chip.flags.cy;
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else {
                    this.chip.notImplemented(machinCode1);
                }
            }
            else if (g1 == 1) {
                if (g2 == 6 && g3 == 6) {
                    this.chip.hlt();
                    return true;
                }
                else {
                    this.chip.setRegister(g2, this.chip.getRegister(g3));
                }
            }
            else if (g1 == 2) {
                if (g2 == 0) {
                    this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                }
                else if (g2 == 1) {
                    this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.getRegister(g3), false, this.chip.flags.cy));
                }
                else if (g2 == 2) {
                    this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                }
                else if (g2 == 3) {
                    this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.getRegister(g3), false, this.chip.flags.cy));
                }
                else if (g2 == 4) {
                    this.chip.accumulator.setValue(this.chip.and(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                }
                else if (g2 == 5) {
                    this.chip.accumulator.setValue(this.chip.xor(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                }
                else if (g2 == 6) {
                    this.chip.accumulator.setValue(this.chip.or(this.chip.accumulator.getValue(), this.chip.getRegister(g3)));
                }
                else if (g2 == 7) {
                    this.chip.cmp(this.chip.accumulator.getValue(), this.chip.getRegister(g3));
                }
                else {
                    this.chip.notImplemented(machinCode1);
                }
            }
            else {
                if (g3 == 0) {
                    if (this.chip.condCommon(g2)) {
                        this.chip.regarray.pc.setValue(this.chip.popCommon());
                    }
                }
                else if (g3 == 1) {
                    if ((g2 & 1) == 0) {
                        this.chip.setRegisterPairBDHPSW(g2 & 6, this.chip.popCommon());
                    }
                    else if (g2 == 1) {
                        this.chip.regarray.pc.setValue(this.chip.popCommon());
                    }
                    else if (g2 == 5) {
                        this.chip.regarray.pc.setValue(this.chip.regarray.getRegisterPairValue(2));
                    }
                    else if (g2 == 7) {
                        this.chip.regarray.sp.setValue(this.chip.regarray.getRegisterPairValue(2));
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 2) {
                    this.chip.condJump(this.chip.condCommon(g2));
                }
                else if (g3 == 3) {
                    if (g2 == 0) {
                        var n = this.chip.timingAndControl.fetchNextWord();
                        this.chip.regarray.pc.setValue(n);
                    }
                    else if (g2 == 3) {
                        var port = this.chip.timingAndControl.fetchNextByte();
                        var r = emu.virtualMachine.io.in(port);
                        this.chip.setRegister(7, r);
                    }
                    else if (g2 == 2) {
                        var port = this.chip.timingAndControl.fetchNextByte();
                        var v = this.chip.getRegister(7);
                        emu.virtualMachine.io.out(port, v);
                    }
                    else if (g2 == 4) {
                        var t = this.chip.popCommon();
                        this.chip.pushCommon(this.chip.regarray.getRegisterPairValue(2));
                        this.chip.regarray.setRegisterPairValue(2, t);
                    }
                    else if (g2 == 5) {
                        var t1 = this.chip.regarray.l.getValue();
                        var t2 = this.chip.regarray.h.getValue();
                        this.chip.regarray.l.setValue(this.chip.regarray.e.getValue());
                        this.chip.regarray.h.setValue(this.chip.regarray.d.getValue());
                        this.chip.regarray.e.setValue(t1);
                        this.chip.regarray.d.setValue(t2);
                    }
                    else if (g2 == 6) {
                    }
                    else if (g2 == 7) {
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 4) {
                    var oldpc = this.chip.condJump(this.chip.condCommon(g2));
                    if (oldpc != null)
                        this.chip.pushCommon(oldpc);
                }
                else if (g3 == 5) {
                    if ((g2 & 1) == 0) {
                        var val = this.chip.getRegisterPairBDHPSW(g2 & 6);
                        this.chip.pushCommon(val);
                    }
                    else if (g2 == 1) {
                        var oldpc = this.chip.condJump(true);
                        this.chip.pushCommon(oldpc);
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 6) {
                    if (g2 == 0) {
                        this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte()));
                    }
                    else if (g2 == 1) {
                        this.chip.accumulator.setValue(this.chip.add(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte(), false, this.chip.flags.cy));
                    }
                    else if (g2 == 2) {
                        this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte()));
                    }
                    else if (g2 == 3) {
                        this.chip.accumulator.setValue(this.chip.sub(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte(), false, this.chip.flags.cy));
                    }
                    else if (g2 == 4) {
                        this.chip.accumulator.setValue(this.chip.and(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte()));
                    }
                    else if (g2 == 5) {
                        this.chip.accumulator.setValue(this.chip.xor(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte()));
                    }
                    else if (g2 == 6) {
                        this.chip.accumulator.setValue(this.chip.or(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte()));
                    }
                    else if (g2 == 7) {
                        this.chip.cmp(this.chip.accumulator.getValue(), this.chip.timingAndControl.fetchNextByte());
                    }
                    else {
                        this.chip.notImplemented(machinCode1);
                    }
                }
                else if (g3 == 7) {
                    var oldpc = this.chip.regarray.pc.getValue();
                    if (emu.superTrap && g2 == 7) {
                        this.chip.hlt();
                        emu.setMonitor();
                        return true;
                    }
                    this.chip.regarray.pc.setValue(g2 << 3);
                    this.chip.pushCommon(oldpc);
                }
                else {
                    this.chip.notImplemented(machinCode1);
                }
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
        // n: 0=BC, 1=DE, 2=HL, 3=SP
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
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
                    break;
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
            // TBW with to remove
            return this.chip.dataBusBufferLatch.getValue();
        };
        TimingAndControl.prototype.fetchNextWord = function () {
            this.fetchNextByte();
            var l = this.chip.dataBusBufferLatch.getValue();
            this.fetchNextByte();
            var h = this.chip.dataBusBufferLatch.getValue();
            var hl = h * 256 + l;
            return hl;
        };
        TimingAndControl.prototype.instructionFetch = function () {
            this.fetchNextByte();
            var data = this.chip.dataBusBufferLatch.getValue();
            this.chip.insutructionRegister.setValue(data);
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
                if (this.chip.instructonDecoder.operationCode == OperationCode.NOP) {
                }
                else if (this.chip.instructonDecoder.operationCode == OperationCode.LXI) {
                    var dword = this.chip.timingAndControl.fetchNextWord();
                    this.chip.registerSelect16 = this.chip.instructonDecoder.registerSelect16;
                    this.chip.regarray.setSelectedRegisterPairValue(dword);
                }
                else if (this.chip.instructonDecoder.operationCode == OperationCode.DAD) {
                    var tgt = this.chip.regarray.getRegisterPairValue(this.chip.instructonDecoder.registerSelect16);
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
                }
                else if (this.chip.instructonDecoder.operationCode == OperationCode.LDAX) {
                    this.chip.registerSelect16 = this.chip.instructonDecoder.registerSelect16;
                    this.chip.memoryRead();
                    this.chip.accumulator.setValue(this.chip.dataBusBufferLatch.getValue());
                }
                else if (this.chip.instructonDecoder.operationCode == OperationCode.STAX) {
                    this.chip.registerSelect16 = this.chip.instructonDecoder.registerSelect16;
                    this.chip.dataBusBufferLatch.setValue(this.chip.accumulator.getValue());
                    this.chip.memoryWrite();
                }
                else {
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
            this.lastval = 65536;
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
            var data = emu.virtualMachine.io.in(addr);
            this.dataBusBufferLatch.setValue(data);
        };
        i8080.prototype.ioWrite = function () {
            var addr = this.addressBuffer.getAddress();
            var data = this.dataBusBufferLatch.getValue();
            emu.virtualMachine.io.out(addr, data);
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
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                emu.virtualMachine.memory.Bytes.write(Math.floor(hl), v);
            }
            else
                r.setValue(v);
        };
        i8080.prototype.getRegister = function (n) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                return emu.virtualMachine.memory.Bytes.read(Math.floor(hl));
            }
            else
                return r.getValue();
        };
        i8080.prototype.getRegisterPairBDHPSW = function (n) {
            switch (n) {
                case 0:
                    return this.regarray.b.getValue() * 256 + this.regarray.c.getValue();
                case 2:
                    return this.regarray.d.getValue() * 256 + this.regarray.e.getValue();
                case 4:
                    return this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                case 6:
                    return this.accumulator.getValue() * 256 + this.flags.getPacked();
            }
        };
        i8080.prototype.setRegisterPairBDHPSW = function (n, v) {
            var l = v & 255;
            var h = v >> 8;
            switch (n) {
                case 0:
                    this.regarray.b.setValue(h);
                    this.regarray.c.setValue(l);
                    break;
                case 2:
                    this.regarray.d.setValue(h);
                    this.regarray.e.setValue(l);
                    break;
                case 4:
                    this.regarray.h.setValue(h);
                    this.regarray.l.setValue(l);
                    break;
                case 6:
                    this.accumulator.setValue(h);
                    this.flags.setPacked(l);
                    break;
            }
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
        // will remove
        i8080.prototype.setps = function (a) {
            this.flags.s = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1)
                    p++;
                x >>= 1;
            }
            this.flags.p = ((p & 1) == 0);
        };
        // will remove
        i8080.prototype.cmp = function (a, b) {
            //this.flags.z = (a == b);
            //this.flags.cy = (a < b);
            //this.setps(this.accumulator.getValue());
            //this.flags.ac = false;
            this.sub(a, b);
        };
        // will remove
        i8080.prototype.add = function (a, b, cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            var r = a + b + (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange)
                this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = ((a & 0x8) & (b & 0x8)) != 0;
            return r0;
        };
        // will remove
        i8080.prototype.sub = function (a, b, cyUnchange, c) {
            if (cyUnchange === void 0) { cyUnchange = false; }
            if (c === void 0) { c = false; }
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange)
                this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = false;
            return r0;
        };
        // will remove
        i8080.prototype.setlogicFlags = function (v, ac) {
            this.flags.z = (v == 0);
            this.flags.cy = false;
            this.setps(v);
            this.flags.ac = ac;
        };
        // will remove
        i8080.prototype.and = function (a, b) {
            var r = a & b;
            this.setlogicFlags(r, true);
            return r;
        };
        // will remove
        i8080.prototype.or = function (a, b) {
            var r = a | b;
            this.setlogicFlags(r, false);
            return r;
        };
        // will remove
        i8080.prototype.xor = function (a, b) {
            var r = a ^ b;
            this.setlogicFlags(r, false);
            return r;
        };
        i8080.prototype.condJump = function (cond) {
            var tgt = this.timingAndControl.fetchNextWord();
            if (cond) {
                var oldpc = this.regarray.pc.getValue();
                this.regarray.pc.setValue(tgt);
                return oldpc;
            }
            else
                return null;
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
        i8080.prototype.popCommon = function () {
            var l = emu.virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            var h = emu.virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            return h * 256 + l;
        };
        i8080.prototype.pushCommon = function (val) {
            this.regarray.sp.Decrement();
            emu.virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val >> 8);
            this.regarray.sp.Decrement();
            emu.virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val & 255);
        };
        i8080.prototype.hlt = function () {
            this.halt = true;
            emu.virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
            emu.tracebox.dump();
        };
        i8080.prototype.runMain = function () {
            this.timingAndControl.runMain();
        };
        i8080.prototype.reset = function () {
            // TBW
            //this.regarray.b.setValue(255);  // DEBUG
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
            //alert(virtualMachine.memory.Bytes.read(hl));
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