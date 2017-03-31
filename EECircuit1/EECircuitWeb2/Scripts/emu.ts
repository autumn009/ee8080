namespace emu {
    class NumberArray {
        private buffer = new ArrayBuffer(65536);
        private view = new Uint8ClampedArray(this.buffer);
        public read(address: number): number {
            return this.view[address];
        }
        public write(address: number, data: number) {
            this.view[address] = data;
        }
        public updateDump(address: number, length: number) {
            $("#memoryAddress").val(dec2hex(address, 4));
            var s = "";
            for (var i = address; i < address + length; i++) {
                s = s + dec2hex(this.view[i], 2) + " ";
            }
            $("#memoryDump").text(s);
        }
        public clear() {
            for (var i = 0; i < 65536; i++) {
                this.view[i] = 0;
            }
        }

        // load image
        // save image
    }

    class MemoryUnit {
        public Bytes = new NumberArray();
    }
    class IOUnit {

    }
    class DataBus {

    }
    class AddressBus {

    }
    class AddressBuffer {

    }
    class DataBusBufferLatch {

    }
    class InternalDataBus {

    }
    class Register {
        protected upperLimit = 65535;
        private value = 0;
        public setValue(n: number) {
            if (n < 0 || n > this.upperLimit) {
                throw Error("value is out of range n=" + n);
            }
            this.value = n;
        }
        public getValue(): number {
            return this.value;
        }
        public randomInitialize() {
            this.value = Math.random() * this.upperLimit;
        }
    }
    class Register8 extends Register {
        protected upperLimit = 255;
    }
    class Register16 extends Register { }
    class Accumulator extends Register8 { }
    class AccumulatorLatch extends Register8 { }
    class TempReg extends Register8 { }
    class ArithmeticLogicUnit {

    }
    class FlagFlipFlop {

    }
    class DecimalAdjust {

    }
    class InstructionRegister {

    }
    class InstructionDecoderAndMachineCycleEncoding {

    }
    class RegisterArray {
        public w = new Register8();
        public z = new Register8();
        public b = new Register8();
        public c = new Register8();
        public d = new Register8();
        public e = new Register8();
        public h = new Register8();
        public l = new Register8();
        public sp = new Register16();
        public pc = new Register16();
        public incrementerDecrementerAddressLatch = new Register16();
    }
    class TimingAndControl {

    }
    class i8080 {
        public halt = true;
        public accumulator = new Accumulator();
        public accumulatorLatch = new AccumulatorLatch();
        public tempReg = new TempReg();
        public regarray = new RegisterArray();
        public update() {
            $("#regA").text(dec2hex(this.accumulator.getValue(), 2));
            $("#regBC").text(dec2hex(this.regarray.b.getValue(), 2) + dec2hex(this.regarray.c.getValue(), 2));
            $("#regDE").text(dec2hex(this.regarray.d.getValue(), 2) + dec2hex(this.regarray.e.getValue(), 2));
            $("#regHL").text(dec2hex(this.regarray.h.getValue(), 2) + dec2hex(this.regarray.l.getValue(), 2));
            $("#regSP").text(dec2hex(this.regarray.sp.getValue(), 4));
            $("#regPC").text(dec2hex(this.regarray.pc.getValue(), 4));
            var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
            var m = virtualMachine.memory.Bytes.read(Math.floor(hl));
            $("#regM").text(dec2hex(m, 2));
        }
        private randomInitialize() {
            this.accumulator.randomInitialize();
            this.regarray.b.randomInitialize();
            this.regarray.c.randomInitialize();
            this.regarray.d.randomInitialize();
            this.regarray.e.randomInitialize();
            this.regarray.h.randomInitialize();
            this.regarray.l.randomInitialize();
            this.regarray.sp.randomInitialize();
        }
        public reset() {
            // TBW
            this.regarray.b.setValue(255);  // DEBUG

            this.randomInitialize();
            this.regarray.pc.setValue(0);
            this.halt = false;
        }
    }
    class ee8080 {
        public memory = new MemoryUnit();
        public cpu = new i8080();
        public update() {
            this.memory.Bytes.updateDump(0, 8);
            this.cpu.update();
        }

        public reset() {
            this.memory.Bytes.clear();
            loadTest1();
            this.update();
        }
    }

    var virtualMachine = new ee8080();

    $("#restart").click(() => {
        virtualMachine.cpu.reset();
        virtualMachine.cpu.update();
    });

    $("#stopcont").click(() => {
        // TBW
    });


    function loadTest1() {
        virtualMachine.memory.Bytes.write(0, 0x3e);    // MVI A,12 (1)
        virtualMachine.memory.Bytes.write(1, 0x12);    // MVI A,12 (2)
        virtualMachine.memory.Bytes.write(2, 0x76);    // HLT
    }

    $("#navtest1").click(() => {
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

    $("#navcon").click(() => {
        setConsole();
    });

    $("#navmon").click(() => {
        setMonitor();
    });

    $("#navreset").click(() => {
        virtualMachine.reset();
    });

    $(document).on("pagecreate", function () {
        virtualMachine.reset();
        setMonitor();
    });
}