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
    var MemoryUnit = (function () {
        function MemoryUnit() {
            this.Bytes = new NumberArray();
        }
        return MemoryUnit;
    }());
    var IOUnit = (function () {
        function IOUnit() {
        }
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
    var Accumulator = (function () {
        function Accumulator() {
        }
        return Accumulator;
    }());
    var AccumulatorLatch = (function () {
        function AccumulatorLatch() {
        }
        return AccumulatorLatch;
    }());
    var TempReg = (function () {
        function TempReg() {
        }
        return TempReg;
    }());
    var ArithmeticLogicUnit = (function () {
        function ArithmeticLogicUnit() {
        }
        return ArithmeticLogicUnit;
    }());
    var FlagFlipFlop = (function () {
        function FlagFlipFlop() {
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
    var Register8 = (function () {
        function Register8() {
        }
        return Register8;
    }());
    var Register16 = (function () {
        function Register16() {
        }
        return Register16;
    }());
    var RegisterArray = (function () {
        function RegisterArray() {
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
        }
        return i8080;
    }());
    var ee8080 = (function () {
        function ee8080() {
            this.memory = new MemoryUnit();
        }
        ee8080.prototype.update = function () {
            this.memory.Bytes.updateDump(0, 8);
        };
        ee8080.prototype.reset = function () {
            this.memory.Bytes.clear();
            loadTest1();
            this.update();
        };
        return ee8080;
    }());
    var virtualMachine = new ee8080();
    function loadTest1() {
        virtualMachine.memory.Bytes.write(0, 0x3e); // MVI A,12 (1)
        virtualMachine.memory.Bytes.write(1, 0x12); // MVI A,12 (2)
        virtualMachine.memory.Bytes.write(2, 0x76); // HLT
    }
    $("#navtest1").click(function () {
        loadTest1();
    });
    function setConsole() {
        $("#con").css("display", "inherit");
        $("#mon").css("display", "none");
        $("#logicname").text("Console");
    }
    function setMonitor() {
        $("#con").css("display", "none");
        $("#mon").css("display", "inherit");
        $("#logicname").text("Monitor");
    }
    $("#navcon").click(function () {
        setConsole();
    });
    $("#navmon").click(function () {
        setMonitor();
    });
    $("#navreset").click(function () {
        virtualMachine.reset();
    });
    $(document).on("pagecreate", function () {
        virtualMachine.reset();
        setMonitor();
    });
})(emu || (emu = {}));
//# sourceMappingURL=emu.js.map