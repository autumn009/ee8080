var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var org8080;
(function (org8080) {
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
        function AddressBuffer() {
        }
        return AddressBuffer;
    }());
    var DataBusBufferLatch = (function () {
        function DataBusBufferLatch() {
        }
        return DataBusBufferLatch;
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
        function ArithmeticLogicUnit() {
        }
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
    var InstructionRegister = (function () {
        function InstructionRegister() {
        }
        return InstructionRegister;
    }());
    var InstructionDecoderAndMachineCycleEncoding = (function () {
        function InstructionDecoderAndMachineCycleEncoding() {
        }
        return InstructionDecoderAndMachineCycleEncoding;
    }());
    var RegisterArray = (function () {
        function RegisterArray() {
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
        return RegisterArray;
    }());
    var TimingAndControl = (function () {
        function TimingAndControl() {
        }
        return TimingAndControl;
    }());
    var i8080 = (function () {
        function i8080() {
            this.halt = true;
            this.accumulator = new Accumulator();
            this.accumulatorLatch = new AccumulatorLatch();
            this.tempReg = new TempReg();
            this.regarray = new RegisterArray();
            this.flags = new FlagFlipFlop();
            this.lastval = 65536;
        }
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
        i8080.prototype.fetchNextByte = function () {
            var pc = this.regarray.pc.getValue();
            var m = emu.virtualMachine.memory.Bytes.read(Math.floor(pc));
            this.regarray.pc.Increment();
            return m;
        };
        i8080.prototype.fetchNextWord = function () {
            var l = this.fetchNextByte();
            var h = this.fetchNextByte();
            var hl = h * 256 + l;
            return hl;
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
        i8080.prototype.cmp = function (a, b) {
            //this.flags.z = (a == b);
            //this.flags.cy = (a < b);
            //this.setps(this.accumulator.getValue());
            //this.flags.ac = false;
            this.sub(a, b);
        };
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
        i8080.prototype.setlogicFlags = function (v, ac) {
            this.flags.z = (v == 0);
            this.flags.cy = false;
            this.setps(v);
            this.flags.ac = ac;
        };
        i8080.prototype.and = function (a, b) {
            var r = a & b;
            this.setlogicFlags(r, true);
            return r;
        };
        i8080.prototype.or = function (a, b) {
            var r = a | b;
            this.setlogicFlags(r, false);
            return r;
        };
        i8080.prototype.xor = function (a, b) {
            var r = a ^ b;
            this.setlogicFlags(r, false);
            return r;
        };
        i8080.prototype.condJump = function (cond) {
            var tgt = this.fetchNextWord();
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
                            _this.runMain();
                        }, 0);
                    };
                    return;
                }
                if (emu.screenRefreshRequest) {
                    emu.screenRefreshRequest = false;
                    setTimeout(function () {
                        _this.runMain();
                    }, 0);
                    return;
                }
                //if (trace) {
                //    console.log("pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16));
                //}
                //tracebox.add("pc="+virtualMachine.cpu.regarray.pc.getValue().toString(16)+" sp=" +virtualMachine.cpu.regarray.sp.getValue().toString(16));
                //var sp = virtualMachine.cpu.regarray.sp.getValue();
                //if (sp < 0x8000 && sp > 0x100)
                //{
                //    this.hlt();
                //    return;
                //}
                //if (sp != Math.ceil(sp)) {
                //    tracebox.add("sp="+sp.toString());
                //    this.hlt();
                //    return;
                //}
                //var sh = sp >> 8;
                //if (sp < 0xc000 && Math.abs(sh-this.lastval) >=2) {
                //    tracebox.add("sh=" + sh.toString(16) + " sp=" + sp.toString(16));
                //    this.lastval = sh;
                //}
                //if (virtualMachine.cpu.regarray.pc.getValue() == 0x2166) {
                //if (virtualMachine.cpu.regarray.sp.getValue() == 0xe3f7) {
                //    rightCount++;
                // }
                //else {
                //debugCounter++;
                //if (debugCounter == 3) {
                //    this.hlt();
                //    return;
                //}
                //}
                //}
                //if (debugCounter == 2) {
                //tracebox.add("2166 pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + " sp=" + virtualMachine.cpu.regarray.sp.getValue().toString(16));
                //tracebox.addPacked("[" + virtualMachine.cpu.regarray.pc.getValue().toString(16) + ":" + virtualMachine.cpu.regarray.sp.getValue().toString(16) + "]");
                //}
                var machinCode1 = this.fetchNextByte();
                var g1 = machinCode1 >> 6;
                var g2 = (machinCode1 >> 3) & 0x7;
                var g3 = machinCode1 & 0x7;
                if (g1 == 0) {
                    if (g3 == 0) {
                        if (g2 == 0) {
                        }
                        else {
                            // NO OPETATION
                            this.hlt();
                            return;
                        }
                    }
                    else if (g3 == 1) {
                        if ((g2 & 1) == 0) {
                            if (g2 == 0x6) {
                                var sp = this.fetchNextWord();
                                //if (sp != Math.ceil(sp)) {
                                //    this.hlt();
                                //    return;
                                //}
                                this.regarray.sp.setValue(sp);
                            }
                            else {
                                this.setRegister(g2 + 1, this.fetchNextByte());
                                this.setRegister(g2, this.fetchNextByte());
                            }
                        }
                        else {
                            var t1 = this.regarray.getRegisterPairValue(2);
                            var t2 = this.regarray.getRegisterPairValue(g2 >> 1);
                            var s = t1 + t2;
                            this.flags.cy = (s >= 0x10000) ? true : false;
                            this.regarray.setRegisterPairValue(2, s & 0xffff);
                        }
                    }
                    else if (g3 == 2) {
                        if ((g2 & 0x5) == 0x0) {
                            emu.virtualMachine.memory.Bytes.write(this.regarray.getRegisterPairValue(g2 >> 1), this.accumulator.getValue());
                        }
                        else if ((g2 & 0x5) == 0x1) {
                            this.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(this.regarray.getRegisterPairValue(g2 >> 1)));
                        }
                        else if (g2 == 4) {
                            var addr = this.fetchNextWord();
                            emu.virtualMachine.memory.Bytes.write(addr, this.regarray.l.getValue());
                            addr = incrementAddress(addr);
                            emu.virtualMachine.memory.Bytes.write(addr, this.regarray.h.getValue());
                        }
                        else if (g2 == 5) {
                            var addr = this.fetchNextWord();
                            this.regarray.l.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                            addr = incrementAddress(addr);
                            this.regarray.h.setValue(emu.virtualMachine.memory.Bytes.read(addr));
                        }
                        else if (g2 == 6) {
                            emu.virtualMachine.memory.Bytes.write(this.fetchNextWord(), this.accumulator.getValue());
                        }
                        else if (g2 == 7) {
                            this.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(this.fetchNextWord()));
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 3) {
                        var hl = this.regarray.getRegisterPairValue(g2 >> 1);
                        if ((g2 & 1) == 0)
                            hl++;
                        else
                            hl--;
                        this.regarray.setRegisterPairValue(g2 >> 1, hl & 0xffff);
                    }
                    else if (g3 == 4) {
                        var val = this.getRegister(g2);
                        val = this.add(val, 1, true);
                        this.setRegister(g2, val);
                    }
                    else if (g3 == 5) {
                        var val = this.getRegister(g2);
                        val = this.sub(val, 1, true);
                        this.setRegister(g2, val);
                    }
                    else if (g3 == 6) {
                        this.setRegister(g2, this.fetchNextByte());
                    }
                    else if (g3 == 7) {
                        if (g2 == 0) {
                            var r = this.accumulator.getValue();
                            r <<= 1;
                            var over = (r & 0x100) != 0;
                            this.accumulator.setValue((r & 255) + (over ? 1 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 1) {
                            var r = this.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.accumulator.setValue((r & 255) + (over ? 0x80 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 2) {
                            var r = this.accumulator.getValue();
                            r <<= 1;
                            this.accumulator.setValue((r & 255) + (this.flags.cy ? 1 : 0));
                            this.flags.cy = (r & 0x100) != 0;
                        }
                        else if (g2 == 3) {
                            var r = this.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.accumulator.setValue((r & 255) + (this.flags.cy ? 0x80 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 4) {
                            var a = this.accumulator.getValue();
                            var al4 = a & 15;
                            if (al4 > 9 || this.flags.ac)
                                a += 6;
                            var ah4 = (a >> 4) & 15;
                            if (ah4 > 9 || this.flags.cy)
                                a += 0x60;
                            var r0 = a & 255;
                            this.accumulator.setValue(r0);
                            var rc = (a >> 8) != 0;
                            this.flags.z = (a == 0);
                            this.flags.cy = rc;
                            this.setps(r0);
                            this.flags.ac = false;
                        }
                        else if (g2 == 5) {
                            this.accumulator.setValue((~this.accumulator.getValue()) & 255);
                        }
                        else if (g2 == 6) {
                            this.flags.cy = true;
                        }
                        else if (g2 == 7) {
                            this.flags.cy = !this.flags.cy;
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
                else if (g1 == 1) {
                    if (g2 == 6 && g3 == 6) {
                        this.hlt();
                        return;
                    }
                    else {
                        this.setRegister(g2, this.getRegister(g3));
                    }
                }
                else if (g1 == 2) {
                    if (g2 == 0) {
                        this.accumulator.setValue(this.add(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 1) {
                        this.accumulator.setValue(this.add(this.accumulator.getValue(), this.getRegister(g3), false, this.flags.cy));
                    }
                    else if (g2 == 2) {
                        this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 3) {
                        this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.getRegister(g3), false, this.flags.cy));
                    }
                    else if (g2 == 4) {
                        this.accumulator.setValue(this.and(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 5) {
                        this.accumulator.setValue(this.xor(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 6) {
                        this.accumulator.setValue(this.or(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 7) {
                        this.cmp(this.accumulator.getValue(), this.getRegister(g3));
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
                else {
                    if (g3 == 0) {
                        if (this.condCommon(g2)) {
                            this.regarray.pc.setValue(this.popCommon());
                        }
                    }
                    else if (g3 == 1) {
                        if ((g2 & 1) == 0) {
                            this.setRegisterPairBDHPSW(g2 & 6, this.popCommon());
                        }
                        else if (g2 == 1) {
                            this.regarray.pc.setValue(this.popCommon());
                        }
                        else if (g2 == 5) {
                            this.regarray.pc.setValue(this.regarray.getRegisterPairValue(2));
                        }
                        else if (g2 == 7) {
                            this.regarray.sp.setValue(this.regarray.getRegisterPairValue(2));
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 2) {
                        this.condJump(this.condCommon(g2));
                    }
                    else if (g3 == 3) {
                        if (g2 == 0) {
                            var n = this.fetchNextWord();
                            this.regarray.pc.setValue(n);
                        }
                        else if (g2 == 3) {
                            var port = this.fetchNextByte();
                            var r = emu.virtualMachine.io.in(port);
                            this.setRegister(7, r);
                        }
                        else if (g2 == 2) {
                            var port = this.fetchNextByte();
                            var v = this.getRegister(7);
                            emu.virtualMachine.io.out(port, v);
                        }
                        else if (g2 == 4) {
                            var t = this.popCommon();
                            this.pushCommon(this.regarray.getRegisterPairValue(2));
                            this.regarray.setRegisterPairValue(2, t);
                        }
                        else if (g2 == 5) {
                            var t1 = this.regarray.l.getValue();
                            var t2 = this.regarray.h.getValue();
                            this.regarray.l.setValue(this.regarray.e.getValue());
                            this.regarray.h.setValue(this.regarray.d.getValue());
                            this.regarray.e.setValue(t1);
                            this.regarray.d.setValue(t2);
                        }
                        else if (g2 == 6) {
                        }
                        else if (g2 == 7) {
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 4) {
                        var oldpc = this.condJump(this.condCommon(g2));
                        if (oldpc != null)
                            this.pushCommon(oldpc);
                    }
                    else if (g3 == 5) {
                        if ((g2 & 1) == 0) {
                            var val = this.getRegisterPairBDHPSW(g2 & 6);
                            this.pushCommon(val);
                        }
                        else if (g2 == 1) {
                            var oldpc = this.condJump(true);
                            this.pushCommon(oldpc);
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6) {
                        if (g2 == 0) {
                            this.accumulator.setValue(this.add(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 1) {
                            this.accumulator.setValue(this.add(this.accumulator.getValue(), this.fetchNextByte(), false, this.flags.cy));
                        }
                        else if (g2 == 2) {
                            this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 3) {
                            this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.fetchNextByte(), false, this.flags.cy));
                        }
                        else if (g2 == 4) {
                            this.accumulator.setValue(this.and(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 5) {
                            this.accumulator.setValue(this.xor(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 6) {
                            this.accumulator.setValue(this.or(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 7) {
                            this.cmp(this.accumulator.getValue(), this.fetchNextByte());
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 7) {
                        var oldpc = this.regarray.pc.getValue();
                        if (emu.superTrap && g2 == 7) {
                            this.hlt();
                            emu.setMonitor();
                            return;
                        }
                        this.regarray.pc.setValue(g2 << 3);
                        this.pushCommon(oldpc);
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
            }
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
            return "i8080 emulator (Original) Ready\r\n";
        };
        return i8080;
    }());
    org8080.i8080 = i8080;
})(org8080 || (org8080 = {}));
//# sourceMappingURL=org8080.js.map