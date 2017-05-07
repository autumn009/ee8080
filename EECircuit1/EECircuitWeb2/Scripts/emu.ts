namespace emu {
    export var virtualMachine: ee8080;
    export var superTrap: boolean = false;
    export var trace: boolean = false;
    var waitingInput = false;
    var inputChars = "";
    var screenRefreshRequest = false;

    function getVirtualMachine() {
        return virtualMachine;
    }

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

    var outputCharCount = 0;

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
        private putBitsPortFF(v: number) {
            var ar: boolean[] = [];
            var n = v;
            for (var i = 0; i < 8; i++) {
                ar.push((n & 1) != 0 ? true : false);
                n >>= 1;
            }
            $("#outPortFF").text(createBitsString(ar));
        }

        public in(addr: number): number {
            if (addr == 0xf0) {
                //console.log("f0:"+(inputChars.length + autoTypeQueue.length));
                if (autoTypeQueue.length == 0 && autoTypeDone) {
                    var a = autoTypeDone;
                    autoTypeDone = null;
                    a();
                }
                if ((inputChars.length + autoTypeQueue.length) == 0) {
                    //console.log("waitingInput");
                    waitingInput = true;
                }
                return 0;
            }
            if (addr == 0xf1) {
                //console.log("f1:" + (inputChars.length + autoTypeQueue.length));
                if (inputChars.length > 0) {
                    var r = inputChars.charCodeAt(0);
                    inputChars = inputChars.substring(1, inputChars.length);
                    return r;
                }
                if (autoTypeQueue.length > 0) {
                    var r = autoTypeQueue.charCodeAt(0);
                    autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
                    return r;
                }
                return "?".charCodeAt(0);
            }
            if (addr == 0xf2) {
                var hl = virtualMachine.cpu.regarray.getRegisterPairValue(2);
                var r = disk.read(virtualMachine.cpu.regarray.b.getValue(),
                    virtualMachine.cpu.regarray.c.getValue(),
                    virtualMachine.cpu.regarray.e.getValue(),
                    hl);
                //alert(virtualMachine.memory.Bytes.read(hl));
                return r;
            }
            if (addr == 0xf3) return disk.write(virtualMachine.cpu.regarray.b.getValue(),
                virtualMachine.cpu.regarray.c.getValue(),
                virtualMachine.cpu.regarray.e.getValue(),
                virtualMachine.cpu.regarray.getRegisterPairValue(2));
            if (addr == 0xf4) {
                return ((autoTypeQueue.length + inputChars.length) == 0) ? 0 : 0xff;
            }
            if (addr == 0xff) return this.getBitsPortFF();
            return 0;
        }
        public out(addr: number, v: number): void {
            if (addr == 0xf0) {
                vdt.outputChar(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
            }
            if (addr == 0xf2) reloadCpm(0xf200 - 0xdc00);
            if (addr == 0xff) this.putBitsPortFF(v);
        }
    }

    var autoTypeDone: () => void = null;
    var autoTypeQueue = "";

    export function pushAutoTypeQueue(chars: string, done: () => void) {
        autoTypeQueue += chars;
        autoTypeDone = done;
        if (autoTypeQueue.length == 0) return;
        var r = autoTypeQueue[0];
        autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
        vdt.commonInputRowCode(r.charCodeAt(0));
    }

    var debugrepeat = 3;
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
        public Increment() {
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
        public getPacked(): number {
            var n = 2;
            if (this.cy) n |= 1;
            if (this.p) n |= 4;
            if (this.ac) n |= 16;
            if (this.z) n |= 64;
            if (this.s) n |= 128;
            return n;
        }
        public setPacked(n: number) {
            this.cy = (n & 1) != 0;
            this.p = (n & 4) != 0;
            this.ac = (n & 16) != 0;
            this.z = (n & 64) != 0;
            this.s = (n & 128) != 0;
        }
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
        // n: 0=BC, 1=DE, 2=HL, 3=SP
        public getRegisterPairValue(n: number) {
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
        }
        public setRegisterPairValue(n: number, v: number) {
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

            $("#regS").text(this.flags.s ? 1 : 0);
            $("#regZ").text(this.flags.z ? 1 : 0);
            $("#regP").text(this.flags.p ? 1 : 0);
            $("#regC").text(this.flags.cy ? 1 : 0);
            $("#regAC").text(this.flags.ac ? 1 : 0);
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

        public getRegisterPairBDHPSW(n: number): number {
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
        }

        public setRegisterPairBDHPSW(n: number, v: number) {
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
        }

        public fetchNextByte() {
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
        public setRuning() {
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

        private undefinedInstuction(n: number) {
            alert(n.toString(16) + " is not undefined machine code");
        }

        private notImplemented(n: number) {
            alert(n.toString(16) + " is not implemented");
        }

        private setps(a: number) {
            this.flags.s = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1) p++;
                x >>= 1;
            }
            this.flags.p = ((p & 1) == 0);
        }

        private cmp(a: number, b: number) {
            this.flags.z = (a == b);
            this.flags.cy = (a < b);
            this.setps(this.accumulator.getValue());
            this.flags.ac = false;

            //if (a == 0xe5 || b == 0xe5) this.hlt();
        }

        private add(a: number, b: number, cyUnchange: boolean = false, c: boolean = false): number {
            var r = a + b + (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange) this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = ((a & 0x8) & (b & 0x8)) != 0;
            return r0;
        }
        private sub(a: number, b: number, cyUnchange: boolean = false, c: boolean = false): number {
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.flags.z = (r0 == 0);
            if (!cyUnchange) this.flags.cy = rc;
            this.setps(r0);
            this.flags.ac = false;
            return r0;
        }

        private setlogicFlags(v: number, ac: boolean) {
            this.flags.z = (v == 0);
            this.flags.cy = false;
            this.setps(v);
            this.flags.ac = ac;
        }

        private and(a: number, b: number): number {
            var r = a & b;
            this.setlogicFlags(r, true);
            return r;
        }
        private or(a: number, b: number): number {
            var r = a | b;
            this.setlogicFlags(r, false);
            return r;
        }
        private xor(a: number, b: number): number {
            var r = a ^ b;
            this.setlogicFlags(r, false);
            return r;
        }

        private condJump(cond: boolean): number {
            var tgt = this.fetchNextWord();
            if (cond) {
                var oldpc = this.regarray.pc.getValue();
                this.regarray.pc.setValue(tgt);
                return oldpc;
            }
            else
                return null;
        }

        private condCommon(g2: number): boolean {
            switch (g2) {
                case 0: // NZ
                    return !this.flags.z;
                case 1: // Z
                    return this.flags.z;
                case 2: // NC
                    return !this.flags.cy;
                case 3: // C
                    return this.flags.cy;
                case 4: // PO
                    return !this.flags.p;
                case 5: // PE
                    return this.flags.p;
                case 6: // P
                    return !this.flags.s;
                case 7: // M
                    return this.flags.s;
            }
        }

        private popCommon(): number {
            var l = virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            var h = virtualMachine.memory.Bytes.read(this.regarray.sp.getValue());
            this.regarray.sp.Increment();
            return h * 256 + l;
        }

        private pushCommon(val: number) {
            this.regarray.sp.Decrement();
            virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val >> 8);
            this.regarray.sp.Decrement();
            virtualMachine.memory.Bytes.write(this.regarray.sp.getValue(), val & 255);
        }

        private hlt() {
            this.halt = true;
            virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
        }

        public runMain() {
            vdt.inputFunc = (num) => {
                inputChars += String.fromCharCode(num);
                if (vdt.inputFuncAfter) vdt.inputFuncAfter();
            };
            for (; ;) {
                if (waitingInput) {
                    waitingInput = false;
                    vdt.inputFuncAfter = () => {
                        vdt.inputFuncAfter = null;
                        setTimeout(() => {
                            this.runMain();
                        }, 0);
                    };
                    return;
                }
                if (screenRefreshRequest) {
                    screenRefreshRequest = false;
                    setTimeout(() => {
                        this.runMain();
                    }, 0);
                    return;
                }
                if (trace) {
                    console.log("pc=" + virtualMachine.cpu.regarray.pc.getValue().toString(16));
                }

                var machinCode1 = this.fetchNextByte();
                var g1 = machinCode1 >> 6;
                var g2 = (machinCode1 >> 3) & 0x7;
                var g3 = machinCode1 & 0x7;
                if (g1 == 0) {
                    if (g3 == 0) {
                        if (g2 == 0) { // NOP
                            // NO OPETATION
                        }
                        else {
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
                            var t1 = this.regarray.getRegisterPairValue(2);
                            var t2 = this.regarray.getRegisterPairValue(g2 >> 1);
                            var s = t1 + t2;
                            this.flags.cy = (s >= 0x10000) ? true : false;
                            this.regarray.setRegisterPairValue(2, s & 0xffff);
                        }
                    }
                    else if (g3 == 2) {
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
                        else if (g2 == 5)  // LHLD
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
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 3) {
                        var hl = this.regarray.getRegisterPairValue(g2 >> 1);
                        if ((g2 & 1) == 0) // INX
                            hl++;
                        else // DEX
                            hl--;
                        this.regarray.setRegisterPairValue(g2 >> 1, hl & 0xffff);
                    }
                    else if (g3 == 4) { // INR
                        var val = this.getRegister(g2);
                        val = this.add(val, 1, true);
                        this.setRegister(g2, val);
                    }
                    else if (g3 == 5) { // DCR
                        var val = this.getRegister(g2);
                        val = this.sub(val, 1, true);
                        this.setRegister(g2, val);
                    }
                    else if (g3 == 6)    // MVI r,x
                    {
                        this.setRegister(g2, this.fetchNextByte());
                    }
                    else if (g3 == 7) {
                        if (g2 == 0)    // RLC
                        {
                            var r = this.accumulator.getValue();
                            r <<= 1;
                            var over = (r & 0x100) != 0;
                            this.accumulator.setValue((r & 255) + (over ? 1 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 1)    // RRC
                        {
                            var r = this.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.accumulator.setValue((r & 255) + (over ? 0x80 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 2)    // RAL
                        {
                            var r = this.accumulator.getValue();
                            r <<= 1;
                            this.accumulator.setValue((r & 255) + (this.flags.cy ? 1 : 0));
                            this.flags.cy = (r & 0x100) != 0;
                        }
                        else if (g2 == 3)    // RAR
                        {
                            var r = this.accumulator.getValue();
                            var over = (r & 1) != 0;
                            r >>= 1;
                            this.accumulator.setValue((r & 255) + (this.flags.cy ? 0x80 : 0));
                            this.flags.cy = over;
                        }
                        else if (g2 == 4)    // DAA
                        {
                            var a = this.accumulator.getValue();
                            var al4 = a & 15;
                            if (al4 > 9 || this.flags.ac) a += 6;
                            var ah4 = (a >> 4) & 15;
                            if (ah4 > 9 || this.flags.cy) a += 0x60;
                            var r0 = a & 255;
                            this.accumulator.setValue(r0);
                            var rc = (a >> 8) != 0;
                            this.flags.z = (a == 0);
                            this.flags.cy = rc;
                            this.setps(r0);
                            this.flags.ac = false;
                        }
                        else if (g2 == 5)    // CMA
                        {
                            this.accumulator.setValue((~this.accumulator.getValue()) & 255);
                        }
                        else if (g2 == 6)    // STC
                        {
                            this.flags.cy = true;
                        }
                        else if (g2 == 7)    // CMC
                        {
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
                    if (g2 == 6 && g3 == 6)    // HLT
                    {
                        this.hlt();
                        return;
                    }
                    else {  // MOV
                        this.setRegister(g2, this.getRegister(g3));
                    }
                }
                else if (g1 == 2) {
                    if (g2 == 0)    // ADD
                    {
                        this.accumulator.setValue(this.add(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 1)    // ADC
                    {
                        this.accumulator.setValue(this.add(this.accumulator.getValue(), this.getRegister(g3), false, this.flags.cy));
                    }
                    else if (g2 == 2)    // SUB
                    {
                        this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 3)    // SBB
                    {
                        this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.getRegister(g3), false, this.flags.cy));
                    }
                    else if (g2 == 4)    // AND
                    {
                        this.accumulator.setValue(this.and(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 5)    // XRA
                    {
                        this.accumulator.setValue(this.xor(this.accumulator.getValue(), this.getRegister(g3)));
                    }
                    else if (g2 == 6)    // ORA
                    {
                        this.accumulator.setValue(this.or(this.accumulator.getValue(), this.getRegister(g3)));
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
                    if (g3 == 0) {  // Rxx
                        if (this.condCommon(g2)) {
                            this.regarray.pc.setValue(this.popCommon());
                        }
                    }
                    else if (g3 == 1) {
                        if ((g2 & 1) == 0) // POP
                        {
                            this.setRegisterPairBDHPSW(g2 & 6, this.popCommon());
                        }
                        else if (g2 == 1) { // RET
                            this.regarray.pc.setValue(this.popCommon());
                        }
                        else if (g2 == 5) // PCHL
                        {
                            this.regarray.pc.setValue(this.regarray.getRegisterPairValue(2));
                        }
                        else if (g2 == 7) // SPHL
                        {
                            this.regarray.sp.setValue(this.regarray.getRegisterPairValue(2));
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 2)   // Jxx
                    {
                        this.condJump(this.condCommon(g2));
                    }
                    else if (g3 == 3) {
                        if (g2 == 0) // JMP
                        {
                            var n = this.fetchNextWord();
                            this.regarray.pc.setValue(n);
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
                        else if (g2 == 4)   // XTHL
                        {
                            var t = this.popCommon();
                            this.pushCommon(this.regarray.getRegisterPairValue(2));
                            this.regarray.setRegisterPairValue(2, t);
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
                        else if (g2 == 6) // DI
                        {
                            // ASSUMED AS NOP
                        }
                        else if (g2 == 7) // EI
                        {
                            // ASSUMED AS NOP
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 4)   // Cxx
                    {
                        var oldpc = this.condJump(this.condCommon(g2));
                        if (oldpc != null) this.pushCommon(oldpc);
                    }
                    else if (g3 == 5) {
                        if ((g2 & 1) == 0) // PUSH
                        {
                            var val = this.getRegisterPairBDHPSW(g2 & 6);
                            this.pushCommon(val);
                        }
                        else if (g2 == 1)   // CALL
                        {
                            var oldpc = this.condJump(true);
                            this.pushCommon(oldpc);
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 6) {
                        if (g2 == 0) // ADI
                        {
                            this.accumulator.setValue(this.add(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 1) // ACI
                        {
                            this.accumulator.setValue(this.add(this.accumulator.getValue(), this.fetchNextByte(), false, this.flags.cy));
                        }
                        else if (g2 == 2) // SUI
                        {
                            this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 3) // SBI
                        {
                            this.accumulator.setValue(this.sub(this.accumulator.getValue(), this.fetchNextByte(), false, this.flags.cy));
                        }
                        else if (g2 == 4) // ANI
                        {
                            this.accumulator.setValue(this.and(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 5) // XRI
                        {
                            this.accumulator.setValue(this.xor(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 6) // ORI
                        {
                            this.accumulator.setValue(this.or(this.accumulator.getValue(), this.fetchNextByte()));
                        }
                        else if (g2 == 7) // CPI
                        {
                            this.cmp(this.accumulator.getValue(), this.fetchNextByte());
                        }
                        else {
                            this.notImplemented(machinCode1);
                        }
                    }
                    else if (g3 == 7)   // RST
                    {
                        var oldpc = this.regarray.pc.getValue();
                        if (superTrap && g2 == 7) {
                            this.hlt();
                            setMonitor();
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
    virtualMachine = new ee8080();

    function updateMonitorMemoryView() {
        var s = $("#memoryAddress").val();
        var addr = parseInt(s, 16);
        if (addr || addr == 0) virtualMachine.memory.Bytes.updateDump(addr, 8);
    }

    $("#memoryAddress").keyup(() => {
        updateMonitorMemoryView();
    });

    export function restart() {
        virtualMachine.cpu.reset();
        virtualMachine.cpu.update();
    }

    $("#restart").click(() => {
        restart();
    });

    $("#stopcont").click(() => {
        // TBW
    });

    function loadSource(uri: string, afterproc: () => void) {
        var jqxhr = $.get(uri)
            .done(function (data) {
                $("#sourceCode").val(data);
                $("#sourceCode").keyup();   // 枠を広げるおまじない
                if (afterproc) afterproc();
            })
            .fail(function () {
                alert("load error");
            });
    }

    function loadTest1(afterproc: () => void) {
        loadSource("/Content/diag.a80.txt", afterproc);
    }

    function loadBiosSource(afterproc: () => void) {
        loadSource("/Content/bios.a80.txt", afterproc);
    }

    function loadTest2() {
        var s = "";
        s += " in 0ffh\r\n";
        s += " out 0ffh\r\n";
        s += " hlt\r\n"
        $("#sourceCode").val(s);
    }

    var cpmArray: Uint8Array;

    function reloadCpm(limit: number) {
        for (var i = 0; i < limit; i++) {
            virtualMachine.memory.Bytes.write(0xdc00 + i, cpmArray[i]);
        }
    }

    function loadCpm(afterproc: () => void) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/Content/CPM.bin.exe", true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                // get binary data as a response
                var blob = xhr.response;

                var arrayBuffer;
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    arrayBuffer = this.result;
                    cpmArray = new Uint8Array(arrayBuffer);
                    reloadCpm(cpmArray.length);
                    if (afterproc) afterproc();
                };
                fileReader.onerror = () => { alert("Error"); };
                fileReader.readAsArrayBuffer(blob);
            }
            else {
                alert("load error");
            }
        };
        xhr.send();
    }

    function setupCpm(afterproc:()=>void) {
        for (var i = 0x0; i < 0x10000; i++) {
            virtualMachine.memory.Bytes.write(i, 0xff);
        }
        loadCpm(() => {
            for (var i = 0xf200; i < 0x10000; i++) {
                virtualMachine.memory.Bytes.write(i, 0xff);
            }
            virtualMachine.memory.Bytes.write(0, 0xc3);
            virtualMachine.memory.Bytes.write(1, 0x00);
            virtualMachine.memory.Bytes.write(2, 0xf2);
            loadBiosSource(() => {
                if (afterproc) afterproc();
            });
        });
    }

    $("#navtest2").click(() => {
        loadTest2();
    });

    $("#navtest1").click(() => {
        loadTest1(null);
    });

    $("#navcpm").click(() => {
        setupCpm(null);
    });

    $(".modemenu").click(() => {
        vdt.clear();
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

    $("#navecho").click(() => {
        setConsole();
        vdt.echoback();
    });

    $("#naventrap").click(() => {
        superTrap = true;
    });

    $("#navdistrap").click(() => {
        superTrap = false;
    });

    $(".ideCommands").click(() => {
        $("#collapsibleIdeCommands").collapsible("collapse");
    });

    var files: File[];
    var autoType = false;
    function uploadTPASub()
    {
        if (files.length == 0) {
            $("#fileUpTPA").val("");
            return;
        }
        var f = files.pop();
        var reader = new FileReader();
        $(reader).load((evt) => {
            var t: any = evt.target;
            var ab: ArrayBuffer = t.result;
            var view = new Uint8ClampedArray(ab);
            //console.log(view[0]);
            for (var i = 0; i < view.length; i++) {
                virtualMachine.memory.Bytes.write(i + 0x100, view[i]);
            }
            if (autoType) {
                var pages = Math.floor((view.length + 255) / 256);
                var filename = f.name;
                pushAutoTypeQueue("SAVE " + pages + " " + filename + "\r", () => {
                    uploadTPASub();
                });
                return;
            }
            uploadTPASub();
        });
        reader.readAsArrayBuffer(f);
    }

    $("#fileUpTPA").change((evt) => {
        $("#popupUpTPA").popup("close");
        var x: any = $("#menu-left");
        x.panel("close");
        var target: any = evt.target;
        files = [];
        for (var i = 0; i < target.files.length; i++) {
            files.push(target.files[i])
        }
        autoType = $("#tpaauto").prop("checked");
        uploadTPASub();
    });

    function downloadDrive(drive: number, target) {
        var blob = new Blob([disk.drives[drive].buffer]);
        var filename = "drive" + String.fromCharCode(drive + 0x41) + ".bin";
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var url = window.URL.createObjectURL(blob);
            $(target).attr("href", url);
            $(target).attr("download", filename);
        }
    }
    $("#popupDownFD0").click((evt) => {
        downloadDrive(0, evt.target);
    });
    $("#popupDownFD1").click((evt) => {
        downloadDrive(1, evt.target);
    });
    $("#popupDownFD2").click((evt) => {
        downloadDrive(2, evt.target);
    });
    $("#popupDownFD3").click((evt) => {
        downloadDrive(3, evt.target);
    });

    var driveForUp = 0;
    $("#popupUpFD0").click((evt) => {
        driveForUp = 0;
    });
    $("#popupUpFD1").click((evt) => {
        driveForUp = 1;
    });
    $("#popupUpFD2").click((evt) => {
        driveForUp = 2;
    });
    $("#popupUpFD3").click((evt) => {
        driveForUp = 3;
    });
    
    $("#fileUpDrive").change((evt) => {
        $("#popupUpDrive").popup("close");
        var x: any = $("#menu-left");
        x.panel("close");
        var target: any = evt.target;
        if (target.files.length == 0) return;
        var f = target.files[0];
        var reader = new FileReader();
        $(reader).load((evt) => {
            var t: any = evt.target;
            var ab: ArrayBuffer = t.result;
            var view = new Uint8ClampedArray(ab);
            disk.drives[driveForUp] = view;
            $("#fileUpDrive").val("");
        });
        reader.readAsArrayBuffer(f);
    });

    function getAbsoluteHeiht(id: string): number {
        var element = document.getElementById(id);
        var rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    function ideResiezer() {
        //$("#sourceCode").height($(window).height());
        var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
        var rect2 = document.getElementById("myhooter").getBoundingClientRect();
        if (rect2.top == 0 || rect1.top == 0) {
            setTimeout(() => {
                ideResiezer();
            }, 1000);
        }
        else
            //$("#sourceCode").height(rect2.top - rect1.top - 20);
            setTimeout(() => {
                var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
                var rect2 = document.getElementById("myhooter").getBoundingClientRect();
                $("#sourceCode").height(rect2.top - rect1.top - 20);
            }, 1000);
    }

    $(window).resize(() => {
        ideResiezer();
    });

    $(document).on('pagecontainershow', function (e) {
        ideResiezer();
    });
    $(document).on('updatelayout', function (e) {
        ideResiezer();
    });
    $(document).on("pagecreate", function () {
        virtualMachine.reset();
        if (arg["cpm"] != undefined) {
            setConsole();
            superTrap = true;
            setupCpm(() => {
                miniAssembler.compileCommon(() => {
                    //emu.setMonitor();
                    emu.restart();
                });
            });
        }
        else if (arg["cpmdev"] != undefined) {
            setIde();
            superTrap = true;
            setupCpm(null);
        }
        else {
            setIde();
            loadTest1(null);
        }
    });
}
