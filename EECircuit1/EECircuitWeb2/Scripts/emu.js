var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var emu;
(function (emu) {
    var NumberArray = (function () {
        function NumberArray() {
            this.buffer = new ArrayBuffer(65536);
            this.view = new Uint8ClampedArray(this.buffer);
            // load image
            // save image
        }
        NumberArray.prototype.read = function (address) {
            return this.view[address];
        };
        NumberArray.prototype.write = function (address, data) {
            this.view[address] = data;
        };
        NumberArray.prototype.updateDump = function (address, length) {
            $("#memoryAddress").val(dec2hex(address, 4));
            address = parseInt($("#memoryAddress").val(), 16);
            var s = "";
            for (var i = address; i < address + length; i++) {
                s = s + dec2hex(this.view[i], 2) + " ";
            }
            $("#memoryDump").text(s);
        };
        NumberArray.prototype.clear = function () {
            for (var i = 0; i < 65536; i++) {
                this.view[i] = 0;
            }
        };
        return NumberArray;
    }());
    emu.NumberArray = NumberArray;
    var MemoryUnit = (function () {
        function MemoryUnit() {
            this.Bytes = new NumberArray();
        }
        return MemoryUnit;
    }());
    var IOUnit = (function () {
        function IOUnit() {
        }
        IOUnit.prototype.getBitsPortFF = function () {
            var n = 0;
            for (var i = 8 - 1; i >= 0; i--) {
                n <<= 1;
                if ($("#bit" + i).prop("checked")) {
                    n |= 1;
                }
            }
            return n;
        };
        IOUnit.prototype.putBitsPortFF = function (v) {
            var ar = [];
            var n = v;
            for (var i = 0; i < 8; i++) {
                ar.push((n & 1) != 0 ? true : false);
                n >>= 1;
            }
            $("#outPortFF").text(createBitsString(ar));
        };
        IOUnit.prototype.in = function (addr) {
            if (addr == 0xff)
                return this.getBitsPortFF();
            return 0;
        };
        IOUnit.prototype.out = function (addr, v) {
            if (addr == 0xff)
                this.putBitsPortFF(v);
        };
        return IOUnit;
    }());
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
            this.value = Math.random() * this.upperLimit;
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
        i8080.prototype.setps = function () {
            var a = this.accumulator.getValue();
            this.flags.p = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1)
                    p++;
                x >>= 1;
            }
            this.flags.s = ((p & 1) == 0);
        };
        i8080.prototype.cmp = function (a, b) {
            this.flags.z = (a == b);
            this.flags.cy = (a < b);
            this.setps();
            this.flags.ac = false;
        };
        i8080.prototype.add = function (a, b) {
            var r = a + b;
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.accumulator.setValue(r0);
            this.flags.z = (r0 == 0);
            this.flags.cy = rc;
            this.setps();
            this.flags.ac = (((a & 15) + (b + 15)) >> 4) != 0;
        };
        i8080.prototype.runMain = function () {
            for (;;) {
                var machinCode1 = this.fetchNextByte();
                var g1 = machinCode1 >> 6;
                var g2 = (machinCode1 >> 3) & 0x7;
                var g3 = machinCode1 & 0x7;
                if (g1 == 0) {
                    if (g2 == 0 && g3 == 0) {
                    }
                    if (g3 == 2) {
                        if (g2 == 6) {
                            emu.virtualMachine.memory.Bytes.write(this.fetchNextWord(), this.accumulator.getValue());
                        }
                        else if (g2 == 7) {
                            this.accumulator.setValue(emu.virtualMachine.memory.Bytes.read(this.fetchNextWord()));
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 1) {
                        if ((g2 & 1) == 0) {
                            this.setRegister(g2 + 1, this.fetchNextByte());
                            this.setRegister(g2, this.fetchNextByte());
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6) {
                        this.setRegister(g2, this.fetchNextByte());
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
                else if (g1 == 1) {
                    if (g2 == 6 && g3 == 6) {
                        this.halt = true;
                        emu.virtualMachine.update();
                        this.setStopped();
                        return;
                    }
                    else {
                        this.setRegister(g2, this.getRegister(g3));
                    }
                }
                else if (g1 == 2) {
                    if (g2 == 0) {
                        this.add(this.accumulator.getValue(), this.getRegister(g3));
                    }
                    else if (g2 == 7) {
                        this.cmp(this.accumulator.getValue(), this.getRegister(g3));
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
                else {
                    if (g2 == 0 && g3 == 3) {
                        this.regarray.pc.setValue(this.fetchNextWord());
                    }
                    else if (g2 == 0 && g3 == 6) {
                        this.add(this.accumulator.getValue(), this.fetchNextByte());
                    }
                    else if (g2 == 2 && g3 == 2) {
                        if (!this.flags.z)
                            this.regarray.pc.setValue(this.fetchNextWord());
                        else {
                            this.regarray.pc.Increment();
                            this.regarray.pc.Increment();
                        }
                    }
                    else if (g2 == 3 && g3 == 3) {
                        var port = this.fetchNextByte();
                        var r = emu.virtualMachine.io.in(port);
                        this.setRegister(7, r);
                    }
                    else if (g2 == 2 && g3 == 3) {
                        var port = this.fetchNextByte();
                        var v = this.getRegister(7);
                        emu.virtualMachine.io.out(port, v);
                    }
                    else if (g2 == 7 && g3 == 6) {
                        this.cmp(this.accumulator.getValue(), this.fetchNextByte());
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
        return i8080;
    }());
    var ee8080 = (function () {
        function ee8080() {
            this.memory = new MemoryUnit();
            this.io = new IOUnit();
            this.cpu = new i8080();
        }
        ee8080.prototype.update = function () {
            updateMonitorMemoryView();
            this.cpu.update();
        };
        ee8080.prototype.reset = function () {
            this.memory.Bytes.clear();
            this.update();
        };
        return ee8080;
    }());
    emu.virtualMachine = new ee8080();
    function getVirtualMachine() {
        return emu.virtualMachine;
    }
    function updateMonitorMemoryView() {
        var s = $("#memoryAddress").val();
        var addr = parseInt(s, 16);
        if (addr || addr == 0)
            emu.virtualMachine.memory.Bytes.updateDump(addr, 8);
    }
    $("#memoryAddress").keyup(function () {
        updateMonitorMemoryView();
    });
    function restart() {
        emu.virtualMachine.cpu.reset();
        emu.virtualMachine.cpu.update();
    }
    emu.restart = restart;
    $("#restart").click(function () {
        restart();
    });
    $("#stopcont").click(function () {
        // TBW
    });
    function loadTest1() {
        var jqxhr = $.get("/Content/diag.a80.txt")
            .done(function (data) {
            $("#sourceCode").val(data);
            $("#sourceCode").keyup(); // 枠を広げるおまじない
        })
            .fail(function () {
            alert("load error");
        });
    }
    function loadTest2() {
        var s = "";
        s += " lxi h,1234h\r\n";
        s += " in 0ffh\r\n";
        s += " out 0ffh\r\n";
        s += " hlt\r\n";
        $("#sourceCode").val(s);
    }
    $("#navtest2").click(function () {
        loadTest2();
    });
    $("#navtest1").click(function () {
        loadTest1();
    });
    function setConsole() {
        $(".mypane").css("display", "none");
        $("#con").css("display", "inherit");
        $("#logicname").text("Console");
    }
    function setMonitor() {
        $(".mypane").css("display", "none");
        $("#mon").css("display", "inherit");
        $("#logicname").text("Monitor");
        emu.virtualMachine.update();
    }
    emu.setMonitor = setMonitor;
    function setIde() {
        $(".mypane").css("display", "none");
        $("#ide").css("display", "inherit");
        $("#logicname").text("IDE");
    }
    $("#navcon").click(function () {
        setConsole();
    });
    $("#navmon").click(function () {
        setMonitor();
    });
    $("#navide").click(function () {
        setIde();
    });
    $("#navreset").click(function () {
        emu.virtualMachine.reset();
    });
    $(".ideCommands").click(function () {
        $("#collapsibleIdeCommands").collapsible("collapse");
    });
    $(document).on("pagecreate", function () {
        emu.virtualMachine.reset();
        setIde();
        loadTest1();
    });
})(emu || (emu = {}));
//# sourceMappingURL=emu.js.map