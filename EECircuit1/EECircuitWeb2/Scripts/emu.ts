namespace emu
{
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
            for (var i = address; i < address+length; i++) {
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
    class DataBus
    {
        
    }
    class AddressBus {

    }
    class AddressBuffer {

    }
    class DataBusBufferLatch {

    }
    class InternalDataBus {

    }
    class Accumulator {

    }
    class AccumulatorLatch {

    }
    class TempReg {

    }
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
    class Register8
    {

    }
    class Register16 {

    }
    class RegisterArray {
        public w: Register8;
        public z: Register8;
        public b: Register8;
        public c: Register8;
        public d: Register8;
        public e: Register8;
        public h: Register8;
        public l: Register8;
        public sp: Register16;
        public pc: Register16;
        public incrementerDecrementerAddressLatch: Register16;
    }
    class TimingAndControl {

    }
    class i8080
    {

    }
    class ee8080 {
        public memory = new MemoryUnit();
        public update() {
            this.memory.Bytes.updateDump(0,8);
        }


        public reset()
        {
            this.memory.Bytes.clear();
            loadTest1();
            this.update();
        }
    }

    var virtualMachine = new ee8080();

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