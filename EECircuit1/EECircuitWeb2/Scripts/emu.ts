namespace emu {
    export class NumberArray {
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
            address = parseInt($("#memoryAddress").val(), 16);
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
        private getBitsPortFF(): number {
            var n = 0;
            for (var i = 8 - 1; i >= 0; i--) {
                n <<= 1;
                if ($("#bit" + i).prop("checked")) {
                    n |= 1;
                }
            }
            return n;
        }
        private putBitsPortFF(v: number)
        {
            var ar: boolean[] = [];
            var n = v;
            for (var i = 0; i < 8; i++) {
                ar.push((n & 1) != 0 ? true : false);
                n >>= 1;
            }
            $("#outPortFF").text(createBitsString(ar));
        }

        public in(addr: number): number {
            if (addr == 0xff) return this.getBitsPortFF();
            return 0;
        }
        public out(addr: number, v: number): void {
            if (addr == 0xff) this.putBitsPortFF(v);
        }
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
        public Increment()
        {
            this.value++;
            if (this.value > this.upperLimit) this.value = 0;
        }
        public Decrement() {
            this.value--;
            if (this.value > this.upperLimit) this.value = 0;
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
        public z: boolean = false;
        public s: boolean = false;
        public p: boolean = false;
        public cy: boolean = false;
        public ac: boolean = false;
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
        // n: 0=BC, 1=DE, 2=HL
        public getRegisterPairValue(n: number) {
            switch (n) {
                case 0:
                    return this.b.getValue() * 256 + this.c.getValue();
                case 1:
                    return this.d.getValue() * 256 + this.e.getValue();
                case 2:
                    return this.h.getValue() * 256 + this.l.getValue();
                default:
                    alert(n + " is not a regiser pair number in getRegisterPairValue.");
            }
        }
    }
    class TimingAndControl {

    }
    class i8080 {
        public halt = true;
        public accumulator = new Accumulator();
        public accumulatorLatch = new AccumulatorLatch();
        public tempReg = new TempReg();
        public regarray = new RegisterArray();
        public flags = new FlagFlipFlop();
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
        public selectRegister(n: number) {
            var r: Register;
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
        }

        public setRegister(n: number, v: number) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                virtualMachine.memory.Bytes.write(Math.floor(hl), v);
            }
            else
                r.setValue(v);
        }
        public getRegister(n: number) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                return virtualMachine.memory.Bytes.read(Math.floor(hl));
            }
            else
                return r.getValue();
        }
        public fetchNextByte()
        {
            var pc = this.regarray.pc.getValue();
            var m = virtualMachine.memory.Bytes.read(Math.floor(pc));
            this.regarray.pc.Increment();
            return m;
        }
        public fetchNextWord() {
            var l = this.fetchNextByte();
            var h = this.fetchNextByte();
            var hl = h * 256 + l;
            return hl;
        }
        public setRuning()
        {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("run");
            $("#runStopStatus").text("RUN");
        }
        public setStopped() {
            $("#runStopStatus").removeClass("stop");
            $("#runStopStatus").removeClass("run");
            $("#runStopStatus").addClass("stop");
            $("#runStopStatus").text("STOP");
        }

        private undefinedInstuction(n: number)
        {
            alert(n.toString(16) + " is not undefined machine code");
        }

        private notImplemented(n: number) {
            alert(n.toString(16) + " is not implemented");
        }

        private setps()
        {
            var a = this.accumulator.getValue();
            this.flags.p = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1) p++;
                x >>= 1;
            }
            this.flags.s = ((p & 1) == 0);
        }

        private cmp(a: number, b: number) {
            this.flags.z = (a == b);
            this.flags.cy = (a < b);
            this.setps();
            this.flags.ac = false;
        }

        private add(a: number, b: number) {
            var r = a + b;
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.accumulator.setValue(r0);
            this.flags.z = (r0 == 0);
            this.flags.cy = rc;
            this.setps();
            this.flags.ac = (((a & 15) + (b + 15)) >> 4) != 0;
        }

        public runMain()
        {
            for (; ;)
            {
                var machinCode1 = this.fetchNextByte();
                var g1 = machinCode1 >> 6;
                var g2 = (machinCode1 >> 3) & 0x7;
                var g3 = machinCode1 & 0x7;
                if (g1 == 0)
                {
                    if (g2 == 0 && g3 == 0) // NOP
                    {
                        // NO OPETATION
                    }
                    if (g3 == 2)
                    {
                        if ((g2 & 0x5) == 0x0)  // STAX
                        {
                            virtualMachine.memory.Bytes.write(this.regarray.getRegisterPairValue(g2 >> 1), this.accumulator.getValue());
                        }
                        else if ((g2 & 0x5) == 0x1)  // LDAX
                        {
                            this.accumulator.setValue(virtualMachine.memory.Bytes.read(
                                this.regarray.getRegisterPairValue(g2 >> 1)
                            ));
                        }
                        else if (g2 == 4)  // SHLD
                        {
                            var addr = this.fetchNextWord();
                            virtualMachine.memory.Bytes.write(addr, this.regarray.l.getValue());
                            addr = incrementAddress(addr);
                            virtualMachine.memory.Bytes.write(addr, this.regarray.h.getValue());
                        }
                        else if (g2==5)  // LHLD
                        {
                            var addr = this.fetchNextWord();
                            this.regarray.l.setValue(virtualMachine.memory.Bytes.read(addr));
                            addr = incrementAddress(addr);
                            this.regarray.h.setValue(virtualMachine.memory.Bytes.read(addr));
                        }
                        else if (g2 == 6) // STA
                        {
                            virtualMachine.memory.Bytes.write(this.fetchNextWord(), this.accumulator.getValue());
                        }
                        else if (g2 == 7) { // LDA
                            this.accumulator.setValue(virtualMachine.memory.Bytes.read(this.fetchNextWord()));
                        }
                        else
                        {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 1) // LXI or DAD
                    {
                        if ((g2 & 1) == 0) // LXI
                        {
                            if (g2 == 0x6) {    // LXI SP,
                                this.regarray.sp.setValue(this.fetchNextWord());
                            }
                            else {  // LXI B/D/H,
                                this.setRegister(g2 + 1, this.fetchNextByte());
                                this.setRegister(g2, this.fetchNextByte());
                            }
                        }
                        else // DAD
                        {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6)    // MVI r,x
                    {
                        this.setRegister(g2, this.fetchNextByte());
                    }
                    else
                    {
                        this.notImplemented(machinCode1);
                    }
                }
                else if (g1 == 1)
                {
                    if (g2 == 6 && g3 == 6)    // HLT
                    {
                        this.halt = true;
                        virtualMachine.update();
                        this.setStopped();
                        return;
                    }
                    else {  // MOV
                        this.setRegister(g2, this.getRegister(g3));
                    }
                }
                else if (g1 == 2) {
                    if (g2 == 0)    // ADD
                    {
                        this.add(this.accumulator.getValue(), this.getRegister(g3));
                    }
                    else if (g2 == 7)    // CMP
                    {
                        this.cmp(this.accumulator.getValue(), this.getRegister(g3));
                    }
                    else {
                        this.notImplemented(machinCode1);
                    }
                }
                else {
                    if (g3 == 2)
                    {
                        if (g2 == 2) // JNZ
                        {
                            if (!this.flags.z) this.regarray.pc.setValue(this.fetchNextWord());
                            else {
                                this.regarray.pc.Increment();
                                this.regarray.pc.Increment();
                            }
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 3)
                    {
                        if (g2 == 0) // JMP
                        {
                            this.regarray.pc.setValue(this.fetchNextWord());
                        }
                        else if (g2 == 3) // IN
                        {
                            var port = this.fetchNextByte();
                            var r = virtualMachine.io.in(port);
                            this.setRegister(7, r);
                        }
                        else if (g2 == 2) // OUT
                        {
                            var port = this.fetchNextByte();
                            var v = this.getRegister(7);
                            virtualMachine.io.out(port, v);
                        }
                        else if (g2 == 5) // XCHG
                        {
                            var t1 = this.regarray.l.getValue();
                            var t2 = this.regarray.h.getValue();
                            this.regarray.l.setValue(this.regarray.e.getValue());
                            this.regarray.h.setValue(this.regarray.d.getValue());
                            this.regarray.e.setValue(t1);
                            this.regarray.d.setValue(t2);
                        }
                        else
                        {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6)
                    {
                        if (g2 == 0) // ADI
                        {
                            this.add(this.accumulator.getValue(), this.fetchNextByte());
                        }
                        else if (g2 == 7) // CPI
                        {
                            this.cmp(this.accumulator.getValue(), this.fetchNextByte());
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else
                    {
                        this.notImplemented(machinCode1);
                    }
                }
            }
        }
        public reset() {
            // TBW
            //this.regarray.b.setValue(255);  // DEBUG

            this.randomInitialize();
            this.regarray.pc.setValue(0);
            this.halt = false;
            this.setRuning();
            setTimeout(() => {
                this.runMain();
            }, 100);
        }
    }
    class ee8080 {
        public memory = new MemoryUnit();
        public io = new IOUnit();
        public cpu = new i8080();
        public update() {
            updateMonitorMemoryView();
            this.cpu.update();
        }

        public reset() {
            this.memory.Bytes.clear();
            this.update();
        }
    }

    export var virtualMachine = new ee8080();

    function getVirtualMachine() {
        return virtualMachine;
    }

    function updateMonitorMemoryView() {
        var s = $("#memoryAddress").val();
        var addr = parseInt(s, 16);
        if (addr || addr == 0) virtualMachine.memory.Bytes.updateDump(addr, 8);
    }

    $("#memoryAddress").keyup(() => {
        updateMonitorMemoryView();
    });

    export function restart()
    {
        virtualMachine.cpu.reset();
        virtualMachine.cpu.update();
    }

    $("#restart").click(() => {
        restart();
    });

    $("#stopcont").click(() => {
        // TBW
    });

    function loadTest1() {
        var jqxhr = $.get("/Content/diag.a80.txt")
            .done(function (data) {
                $("#sourceCode").val(data);
                $("#sourceCode").keyup();   // 枠を広げるおまじない
            })
            .fail(function () {
                alert("load error");
            });
    }

    function loadTest2() {
        var s = "";
        s += " lxi h,1234h\r\n"
        s += " in 0ffh\r\n";
        s += " out 0ffh\r\n";
        s += " hlt\r\n"
        $("#sourceCode").val(s);
    }

    $("#navtest2").click(() => {
        loadTest2();
    });

    $("#navtest1").click(() => {
        loadTest1();
    });

    function setConsole() {
        $(".mypane").css("display", "none");
        $("#con").css("display", "inherit");
        $("#logicname").text("Console");
    }
    export function setMonitor() {
        $(".mypane").css("display", "none");
        $("#mon").css("display", "inherit");
        $("#logicname").text("Monitor");
        virtualMachine.update();
   }
    function setIde() {
        $(".mypane").css("display", "none");
        $("#ide").css("display", "inherit");
        $("#logicname").text("IDE");
    }

    $("#navcon").click(() => {
        setConsole();
    });

    $("#navmon").click(() => {
        setMonitor();
    });

    $("#navide").click(() => {
        setIde();
    });

    $("#navreset").click(() => {
        virtualMachine.reset();
    });

    $(".ideCommands").click(() => {
        $("#collapsibleIdeCommands").collapsible("collapse");
    });

    $(document).on("pagecreate", function () {
        virtualMachine.reset();
        setIde();
        loadTest1();
    });
}