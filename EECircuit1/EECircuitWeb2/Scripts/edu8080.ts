namespace edu8080 {
    enum OperationCode {
        LXI, DAD, LDAX, STAX, LHLD, SHLD, LDA, STA,
        INX, DEX, INR, DCR, MVI, DAA, STC, CMC, HLT, MOV,
        ALU1, ALU2,
        Rxx, POP, PCHL, SPHL, Jxx, IN, OUT, XTHL, XCHG, Cxx, PUSH, RST,
        NOP, OTHER
    }
    enum RegisterSelect8 {
        b = 0, c, d, e, h, l, m, a
    }
    enum RegisterSelect16 {
        bc = 0, de = 1, hl = 2, sp = 3, wz = 4, pc, latch,
    }
    class AddressBuffer {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public getAddress(): number {
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
        }
    }
    class Register {
        protected upperLimit = 65535;
        private value = 0;
        public setValueHL(l: number, h: number) {
            this.setValue(h * 256 + l);
        }
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
            if (this.value < 0) this.value = this.upperLimit;
        }
        public randomInitialize() {
            this.value = Math.floor(Math.random() * this.upperLimit);
        }
    }
    class Register8 extends Register {
        protected upperLimit = 255;
    }
    class DataBusBufferLatch extends Register8 {
    }
    class Register16 extends Register { }
    class Accumulator extends Register8 { }
    class AccumulatorLatch extends Register8 { }
    class TempReg extends Register8 { }
    class ArithmeticLogicUnit {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public result: Register8 = new Register8();
        public setps(a: number) {
            this.chip.flags.s = ((a & 0x80) != 0);
            var p = 0;
            var x = a;
            for (var i = 0; i < 8; i++) {
                if (x & 1) p++;
                x >>= 1;
            }
            this.chip.flags.p = ((p & 1) == 0);
        }

        public cmp() {
            this.sub();
        }
        private addbase(a: number, b: number, cyUnchange: boolean = false, cyOnlyChange = false, c: boolean = false) {
            var r = a + b + (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            if (!cyUnchange) this.chip.flags.cy = rc;
            if (!cyOnlyChange) {
                this.chip.flags.z = (r0 == 0);
                this.setps(r0);
                this.chip.flags.ac = ((a & 0x8) & (b & 0x8)) != 0;
            }
            return r0;
        }
        private addraw(cyUnchange: boolean = false, cyOnlyChange = false, c: boolean = false) {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r0 = this.addbase(a, b, cyUnchange, cyOnlyChange, c);
            this.result.setValue(r0);
        }
        public add(cyUnchange: boolean = false, cyOnlyChange = false) {
            this.addraw(cyUnchange, cyOnlyChange, false);
        }
        public adc(cyUnchange: boolean = false, cyOnlyChange = false) {
            this.addraw(cyUnchange, cyOnlyChange, this.chip.flags.cy);
        }
        public inc() {
            var b = this.chip.tempReg.getValue();
            var r0 = this.addbase(b, 1, true);
            this.result.setValue(r0);
        }
        public dec() {
            var b = this.chip.tempReg.getValue();
            var r0 = this.subbase(b, 1, true);
            this.result.setValue(r0);
        }
        private subbase(a: number, b: number, cyUnchange: boolean = false, c: boolean = false) {
            var r = a - b - (c ? 1 : 0);
            var r0 = r & 255;
            var rc = (r >> 8) != 0;
            this.chip.flags.z = (r0 == 0);
            if (!cyUnchange) this.chip.flags.cy = rc;
            this.setps(r0);
            this.chip.flags.ac = false;
            return r0;
        }
        private subraw(cyUnchange: boolean = false, c: boolean = false) {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r0 = this.subbase(a, b, cyUnchange, c);
            this.result.setValue(r0);
        }
        public sub(cyUnchange: boolean = false, c: boolean = false) {
            this.subraw(cyUnchange, false);
        }
        public sbb(cyUnchange: boolean = false, c: boolean = false) {
            this.subraw(cyUnchange, this.chip.flags.cy);
        }
        private setlogicFlags(v: number, ac: boolean) {
            this.chip.flags.z = (v == 0);
            this.chip.flags.cy = false;
            this.setps(v);
            this.chip.flags.ac = ac;
        }
        public and() {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a & b;
            this.setlogicFlags(r, true);
            this.result.setValue(r);
        }
        public or() {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a | b;
            this.setlogicFlags(r, false);
            this.result.setValue(r);
        }
        public xor() {
            var a = this.chip.accumulatorLatch.getValue();
            var b = this.chip.tempReg.getValue();
            var r = a ^ b;
            this.setlogicFlags(r, false);
            this.result.setValue(r);
        }
        public rlc() {
            var r = this.chip.accumulator.getValue();
            r <<= 1;
            var over = (r & 0x100) != 0;
            this.result.setValue((r & 255) + (over ? 1 : 0));
            this.chip.flags.cy = over;
        }
        public rrc() {
            var r = this.chip.accumulator.getValue();
            var over = (r & 1) != 0;
            r >>= 1;
            this.result.setValue((r & 255) + (over ? 0x80 : 0));
            this.chip.flags.cy = over;
        }
        public ral() {
            var r = this.chip.accumulator.getValue();
            r <<= 1;
            this.result.setValue((r & 255) + (this.chip.flags.cy ? 1 : 0));
            this.chip.flags.cy = (r & 0x100) != 0;
        }
        public rar() {
            var r = this.chip.accumulator.getValue();
            var over = (r & 1) != 0;
            r >>= 1;
            this.result.setValue((r & 255) + (this.chip.flags.cy ? 0x80 : 0));
            this.chip.flags.cy = over;
        }
        public cma() {
            var r = this.chip.accumulator.getValue();
            this.result.setValue((~r) & 0xff);
        }
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
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public adjust() {
            var a = this.chip.accumulator.getValue();
            var al4 = a & 15;
            if (al4 > 9 || this.chip.flags.ac) a += 6;
            var ah4 = (a >> 4) & 15;
            if (ah4 > 9 || this.chip.flags.cy) a += 0x60;
            var r0 = a & 255;
            this.chip.accumulator.setValue(r0);
            var rc = (a >> 8) != 0;
            this.chip.flags.z = (a == 0);
            this.chip.flags.cy = rc;
            this.chip.alu.setps(r0);
            this.chip.flags.ac = false;
        }
    }
    class InstructionRegister extends Register8 { }
    class InstructionDecoderAndMachineCycleEncoding {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public g1 = 0;
        public g2 = 0;
        public g3 = 0;
        public operationCode: OperationCode;
        public Decode() {
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
                    if (g2 == 0) this.operationCode = OperationCode.NOP;
                    else this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 1) // LXI or DAD
                {
                    if ((g2 & 1) == 0) this.operationCode = OperationCode.LXI;
                    else this.operationCode = OperationCode.DAD;
                }
                else if (g3 == 2) {
                    if ((g2 & 0x5) == 0x0) this.operationCode = OperationCode.STAX;
                    else if ((g2 & 0x5) == 0x1) this.operationCode = OperationCode.LDAX;
                    else if (g2 == 4) this.operationCode = OperationCode.SHLD;
                    else if (g2 == 5) this.operationCode = OperationCode.LHLD;
                    else if (g2 == 6) this.operationCode = OperationCode.STA;
                    else if (g2 == 7) this.operationCode = OperationCode.LDA;
                    else this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 3) {
                    if ((g2 & 1) == 0) this.operationCode = OperationCode.INX;
                    else this.operationCode = OperationCode.DEX;
                }
                else if (g3 == 4) this.operationCode = OperationCode.INR;
                else if (g3 == 5) this.operationCode = OperationCode.DCR;
                else if (g3 == 6) this.operationCode = OperationCode.MVI;
                else if (g3 == 7) {
                    if (g2 == 0) this.operationCode = OperationCode.ALU1;   // RLC
                    else if (g2 == 1) this.operationCode = OperationCode.ALU1;  //RRC
                    else if (g2 == 2) this.operationCode = OperationCode.ALU1;  //RAL
                    else if (g2 == 3) this.operationCode = OperationCode.ALU1;  //RAR
                    else if (g2 == 4) this.operationCode = OperationCode.DAA;
                    else if (g2 == 5) this.operationCode = OperationCode.ALU1;  //CMA
                    else if (g2 == 6) this.operationCode = OperationCode.STC;
                    else if (g2 == 7) this.operationCode = OperationCode.CMC;
                    else this.chip.notImplemented(machinCode1);
                }
                else this.chip.notImplemented(machinCode1);

            }
            else if (g1 == 1) {
                if (g2 == 6 && g3 == 6) this.operationCode = OperationCode.HLT;
                else this.operationCode = OperationCode.MOV;
            }
            else if (g1 == 2) this.operationCode = OperationCode.ALU2;// this is a trick of ADD,ADC,SUB,SBB,AND,XRA,ORA,CMP
            else {
                if (g3 == 0) this.operationCode = OperationCode.Rxx;
                else if (g3 == 1) {
                    if ((g2 & 1) == 0) this.operationCode = OperationCode.POP;
                    else if (g2 == 1) this.operationCode = OperationCode.Rxx; // RET
                    else if (g2 == 5) this.operationCode = OperationCode.PCHL;
                    else if (g2 == 7) this.operationCode = OperationCode.SPHL;
                    else this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 2) this.operationCode = OperationCode.Jxx;
                else if (g3 == 3) {
                    if (g2 == 0) this.operationCode = OperationCode.Jxx;    // JMP
                    else if (g2 == 3) this.operationCode = OperationCode.IN;
                    else if (g2 == 2) this.operationCode = OperationCode.OUT;
                    else if (g2 == 4) this.operationCode = OperationCode.XTHL;
                    else if (g2 == 5) this.operationCode = OperationCode.XCHG;
                    else if (g2 == 6) this.operationCode = OperationCode.NOP; // ASSUMED AS NOP
                    else if (g2 == 7) this.operationCode = OperationCode.NOP; // ASSUMED AS NOP
                    else this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 4) this.operationCode = OperationCode.Cxx;
                else if (g3 == 5) {
                    if ((g2 & 1) == 0) this.operationCode = OperationCode.PUSH;
                    else if (g2 == 1) this.operationCode = OperationCode.Cxx;
                    else this.chip.notImplemented(machinCode1);
                }
                else if (g3 == 6) this.operationCode = OperationCode.ALU2; // this is a trick of ADI,ACI,SUI,SBI,ANI,XRI,ORI,CPI
                else if (g3 == 7) this.operationCode = OperationCode.RST;
                else this.chip.notImplemented(machinCode1);
            }
            return false;
        }
    }
    class RegisterArray {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
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
        // n: 0=BC, 1=DE, 2=HL, 3=SP, 4=WZ
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
                case 4:
                    return this.w.getValue() * 256 + this.z.getValue();
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
                case 4:
                    this.w.setValue(h);
                    this.z.setValue(l);
                    break;
                default:
                    alert(n + " is not a register pair number in setRegisterPairValue.");
                    break;
            }
        }
        public getSelectedRegisterPairValue() {
            switch (this.chip.registerSelect16) {
                case RegisterSelect16.bc:
                case RegisterSelect16.de:
                case RegisterSelect16.hl:
                case RegisterSelect16.sp:
                case RegisterSelect16.wz:
                    return this.getRegisterPairValue(this.chip.registerSelect16);
                case RegisterSelect16.pc:
                    return this.pc.getValue();
                default:    // IncrementerDecrementerAddressLatch
                    return this.incrementerDecrementerAddressLatch.getValue();
            }
        }

        public setSelectedRegisterPairValue(v: number) {
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
                default:    // IncrementerDecrementerAddressLatch
                    this.incrementerDecrementerAddressLatch.setValue(v);
                    break;
            }
        }

        public transferSelectedRefgister16toAddressLatch() {
            var hl = this.getSelectedRegisterPairValue();
            this.incrementerDecrementerAddressLatch.setValue(hl);
        }
        public transferSelectedRefgister16fromAddressLatch() {
            var hl = this.incrementerDecrementerAddressLatch.getValue();
            this.setSelectedRegisterPairValue(hl);
        }
        public transferSelectedRefgister16toPC() {
            var val = this.getSelectedRegisterPairValue();
            this.pc.setValue(val);
        }
        public swapHLandDE() {
            var t = this.chip.regarray.l.getValue();
            this.chip.regarray.l.setValue(this.chip.regarray.e.getValue());
            this.chip.regarray.e.setValue(t);
            var t = this.chip.regarray.h.getValue();
            this.chip.regarray.h.setValue(this.chip.regarray.d.getValue());
            this.chip.regarray.d.setValue(t);
        }
    }
    class TimingAndControl {
        private chip: i8080;
        constructor(thischip: i8080) {
            this.chip = thischip;
        }
        public fetchNextByte():void {
            this.chip.registerSelect16 = RegisterSelect16.pc;
            this.chip.memoryRead();
            this.chip.regarray.pc.Increment();
        }
        public fetchNextWord() {
            this.fetchNextByte();
            var l = this.chip.dataBusBufferLatch.getValue();
            this.fetchNextByte();
            var h = this.chip.dataBusBufferLatch.getValue();
            var hl = h * 256 + l;
            return hl;
        }
        public fetchNextWordToWZ() {
            this.fetchNextByte();
            this.chip.regarray.z.setValue(this.chip.dataBusBufferLatch.getValue());
            this.fetchNextByte();
            this.chip.regarray.w.setValue(this.chip.dataBusBufferLatch.getValue());
        }
        private fetchNextByteAndSetDataLatch() {
            this.chip.timingAndControl.fetchNextByte();
            this.chip.dataBusBufferLatch.setValue(this.chip.dataBusBufferLatch.getValue());
        }
        private fetchNextWordAndSetAddressLatch() {
            this.chip.timingAndControl.fetchNextByte();
            var l = this.chip.dataBusBufferLatch.getValue();
            this.chip.timingAndControl.fetchNextByte();
            var h = this.chip.dataBusBufferLatch.getValue();
            this.chip.regarray.incrementerDecrementerAddressLatch.setValueHL(l, h);
            this.chip.registerSelect16 = RegisterSelect16.latch;
        }
        private instructionFetch() {
            this.fetchNextByte();
            var data = this.chip.dataBusBufferLatch.getValue();
            this.chip.insutructionRegister.setValue(data);
        }
        private aluWithAcc() {
            switch (this.chip.instructonDecoder.g2) {
                case 0: this.chip.alu.rlc(); break;
                case 1: this.chip.alu.rrc(); break;
                case 2: this.chip.alu.ral(); break;
                case 3: this.chip.alu.rar(); break;
                case 5: this.chip.alu.cma(); break;
            }
            this.chip.accumulator.setValue(this.chip.alu.result.getValue());
        }

        private aluWithAccAndTemp() {
            this.chip.accumulatorLatch.setValue(this.chip.accumulator.getValue());
            switch (this.chip.instructonDecoder.g2) {
                case 0: this.chip.alu.add(); break;
                case 1: this.chip.alu.adc(); break;
                case 2: this.chip.alu.sub(); break;
                case 3: this.chip.alu.sbb(); break;
                case 4: this.chip.alu.and(); break;
                case 5: this.chip.alu.xor(); break;
                case 6: this.chip.alu.or(); break;
                case 7: this.chip.alu.cmp(); return;
            }
            this.chip.setRegisterFromAlu(7);    //save acc if not CMP
        }

        public runMain() {
            vdt.inputFunc = (num) => {
                emu.inputChars += String.fromCharCode(num);
                if (vdt.inputFuncAfter) vdt.inputFuncAfter();
            };
            for (; ;) {
                if (emu.waitingInput) {
                    emu.waitingInput = false;
                    vdt.inputFuncAfter = () => {
                        vdt.inputFuncAfter = null;
                        setTimeout(() => {
                            this.chip.runMain();
                        }, 0);
                    };
                    return;
                }
                if (emu.screenRefreshRequest) {
                    emu.screenRefreshRequest = false;
                    setTimeout(() => {
                        this.chip.runMain();
                    }, 0);
                    return;
                }

                this.instructionFetch();
                if (this.chip.instructonDecoder.Decode()) return;
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
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {  // in case of Rxx
                            this.chip.popToWZ();
                            this.chip.registerSelect16 = RegisterSelect16.wz;
                            var hl = this.chip.regarray.getSelectedRegisterPairValue();
                            this.chip.registerSelect16 = RegisterSelect16.pc;
                            this.chip.regarray.setSelectedRegisterPairValue(hl);
                        }
                        break;
                    case OperationCode.PUSH:
                        this.chip.registerSelect16 = RegisterSelect16.sp;
                        var data: number;
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
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {  // in case of Jxx
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
                            || this.chip.condCommon(this.chip.instructonDecoder.g2)) {  // in case of Cxx
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
            }
        }
    }
    export class i8080 implements icpu {
        public halt = true;
        public accumulator = new Accumulator();
        public accumulatorLatch = new AccumulatorLatch();
        public tempReg = new TempReg();
        public regarray = new RegisterArray(this);
        public flags = new FlagFlipFlop();
        public timingAndControl = new TimingAndControl(this);
        public dataBusBufferLatch = new DataBusBufferLatch();
        public addressBuffer = new AddressBuffer(this);
        public registerSelect16: RegisterSelect16 = 0;
        public registerSelect8: RegisterSelect8 = 0;
        public insutructionRegister = new InstructionRegister();
        public instructonDecoder = new InstructionDecoderAndMachineCycleEncoding(this);
        public alu = new ArithmeticLogicUnit(this);
        public decimalAdjust = new DecimalAdjust(this);

        public memoryRead() {
            var addr = this.addressBuffer.getAddress();
            var data = emu.virtualMachine.memory.Bytes.read(addr);
            this.dataBusBufferLatch.setValue(data);
        }

        public memoryWrite() {
            var addr = this.addressBuffer.getAddress();
            var data = this.dataBusBufferLatch.getValue();
            emu.virtualMachine.memory.Bytes.write(addr, data);
        }

        public ioRead() {
            var addr = this.addressBuffer.getAddress();
            var data = emu.virtualMachine.io.in(addr & 255);
            this.dataBusBufferLatch.setValue(data);
        }

        public ioWrite() {
            var addr = this.addressBuffer.getAddress();
            var data = this.dataBusBufferLatch.getValue();
            emu.virtualMachine.io.out(addr & 255, data);
        }

        public update() {
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
                emu.virtualMachine.memory.Bytes.write(Math.floor(hl), v);
            }
            else
                r.setValue(v);
        }
        public getRegister(n: number) {
            var r = this.selectRegister(n);
            if (r == null) {
                var hl = this.regarray.h.getValue() * 256 + this.regarray.l.getValue();
                return emu.virtualMachine.memory.Bytes.read(Math.floor(hl));
            }
            else
                return r.getValue();
        }

        public getRegisterToTempReg(reg8: number) {
            var val = this.getRegister(reg8);
            this.tempReg.setValue(val);
        }
        public setRegisterFromTempReg(reg8: number) {
            var val = this.tempReg.getValue();
            this.setRegister(reg8, val);
        }
        public setRegisterFromAlu(reg8: number) {
            var val = this.alu.result.getValue();
            this.setRegister(reg8, val);
        }
        public setRegisterFromDataLatch(reg8: number) {
            var val = this.dataBusBufferLatch.getValue();
            this.setRegister(reg8, val);
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

        public undefinedInstuction(n: number) {
            alert(n.toString(16) + " is not undefined machine code");
        }

        public notImplemented(n: number) {
            alert(n.toString(16) + " is not implemented");
        }

        public condJump(cond: boolean): number {
            var tgt = this.timingAndControl.fetchNextWord();
            if (cond) {
                var oldpc = this.regarray.pc.getValue();
                this.regarray.pc.setValue(tgt);
                return oldpc;
            }
            else
                return null;
        }

        public condCommon(g2: number): boolean {
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

        public popToWZ() {
            this.registerSelect16 = RegisterSelect16.sp;
            this.memoryRead();
            this.regarray.sp.Increment();
            this.regarray.z.setValue(this.dataBusBufferLatch.getValue());
            this.memoryRead();
            this.regarray.sp.Increment();
            this.regarray.w.setValue(this.dataBusBufferLatch.getValue());
        }

        public pushCommon(val: number) {
            this.registerSelect16 = RegisterSelect16.sp;
            this.regarray.sp.Decrement();
            this.dataBusBufferLatch.setValue(val >> 8);
            this.memoryWrite();
            this.regarray.sp.Decrement();
            var h = this.dataBusBufferLatch.setValue(val & 255);
            this.memoryWrite();
        }

        public hlt() {
            this.halt = true;
            emu.virtualMachine.update();
            this.setStopped();
            emu.setMonitor();
            emu.tracebox.dump();
        }
        private lastval = 65536;

        public runMain() {
            this.timingAndControl.runMain();
        }

        public reset() {
            this.randomInitialize();
            this.regarray.pc.setValue(0);
            this.halt = false;
            this.setRuning();
            setTimeout(() => {
                this.runMain();
            }, 100);
        }

        public diskread() {
            var hl = this.regarray.getRegisterPairValue(2);
            var r = disk.read(this.regarray.b.getValue(),
                this.regarray.c.getValue(),
                this.regarray.e.getValue(),
                hl);
            return r;
        }
        public diskwrite() {
            return disk.write(this.regarray.b.getValue(),
                this.regarray.c.getValue(),
                this.regarray.e.getValue(),
                this.regarray.getRegisterPairValue(2));
        }
        public getName() {
            return "i8080 emulator (Educational) Ready\r\n";
        }
    }
}