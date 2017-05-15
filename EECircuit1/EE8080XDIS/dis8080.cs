using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace EE8080XDIS
{
    class Dis8080
    {
        TextWriter writer;
        private byte[] image;
        private int offset;
        private int pointer;
        private int start;
        private int length;
        private byte[] bytes = new byte[3];
        private string mnem;
        private string arg1;
        private string arg2;

        private byte getNextByte()
        {
            if (pointer >= image.Length) return 0;
            return image[pointer++];
        }


        private string parseBDHSP(int n) {
            switch (n) {
                case 0:
                    return "B";
                case 2:
                    return "D";
                case 4:
                    return "H";
                case 6:
                    return "SP";
                default:
                    return "??";
            }
        }

        private string parseBDHPSW(int n)
        {
            switch (n)
            {
                case 6:
                    return "PSW";
                default:
                    return parseBDHSP(n);
            }
        }

        private string parseABCDEHLM(int n)
        {
            return "BCDEHLMA"[n].ToString();
        }

        private string parseCond(int n)
        {
            switch (n)
            {
                case 0: // NZ
                    return "NZ";
                case 1: // Z
                    return "Z";
                case 2: // NC
                    return "NC";
                case 3: // C
                    return "C";
                case 4: // PO
                    return "PO";
                case 5: // PE
                    return "PE";
                case 6: // P
                    return "P";
                case 7: // M
                    return "M";
                default:
                    return "?";
            }
        }


        private string fetchNextByte()
        {
            bytes[1] = getNextByte();
            length = 2;
            return string.Format("{0,0:X2}", bytes[1]);
        }

        private string fetchNextWord()
        {
            bytes[1] = getNextByte();
            bytes[2] = getNextByte();
            length = 3;
            return string.Format("{0,0:X2}{1,0:X2}", bytes[2], bytes[1]);
        }

        private void disasseleLine()
        {
            start = pointer;
            arg1 = null;
            arg2 = null;
            length = 1;

            var machinCode1 = getNextByte();
            bytes[0] = machinCode1;
            var g1 = machinCode1 >> 6;
            var g2 = (machinCode1 >> 3) & 0x7;
            var g3 = machinCode1 & 0x7;
            if (g1 == 0)
            {
                if (g3 == 0)
                {
                    if (g2 == 0) mnem = "NOP"; else mnem = "???";
                }
                else if (g3 == 1) // LXI or DAD
                {
                    if ((g2 & 1) == 0) // LXI
                    {
                        mnem = "LXI";
                        arg1 = parseBDHSP(g2);
                        arg2 = fetchNextWord();
                    }
                    else // DAD
                    {
                        mnem = "DAD";
                        arg1 = parseBDHSP(g2);
                    }
                }
                else if (g3 == 2)
                {
                    if ((g2 & 0x5) == 0x0)  // STAX
                    {
                        mnem = "STAX";
                        arg1 = parseBDHSP(g2);
                    }
                    else if ((g2 & 0x5) == 0x1)  // LDAX
                    {
                        mnem = "LDAX";
                        arg1 = parseBDHSP(g2);
                    }
                    else if (g2 == 4)  // SHLD
                    {
                        mnem = "SHLD";
                        arg1 = fetchNextWord();
                    }
                    else if (g2 == 5)  // LHLD
                    {
                        mnem = "LHLD";
                        arg1 = fetchNextWord();
                    }
                    else if (g2 == 6) // STA
                    {
                        mnem = "STA";
                        arg1 = fetchNextWord();
                    }
                    else if (g2 == 7)
                    { // LDA
                        mnem = "LDA";
                        arg1 = fetchNextWord();
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else if (g3 == 3)
                {
                    if ((g2 & 1) == 0) // INX
                        mnem = "INX";
                    else // DEX
                        mnem = "DEX";
                    arg1 = parseBDHSP(g2);
                }
                else if (g3 == 4)
                { // INR
                    mnem = "INR";
                    arg1 = parseABCDEHLM(g2);
                }
                else if (g3 == 5)
                { // DCR
                    mnem = "DCR";
                    arg1 = parseABCDEHLM(g2);
                }
                else if (g3 == 6)    // MVI r,x
                {
                    mnem = "MVI";
                    arg1 = parseABCDEHLM(g2);
                    arg2 = fetchNextByte();
                }
                else if (g3 == 7)
                {
                    if (g2 == 0)    // RLC
                    {
                        mnem = "RLC";
                    }
                    else if (g2 == 1)    // RRC
                    {
                        mnem = "RRC";
                    }
                    else if (g2 == 2)    // RAL
                    {
                        mnem = "RAL";
                    }
                    else if (g2 == 3)    // RAR
                    {
                        mnem = "RAR";
                    }
                    else if (g2 == 4)    // DAA
                    {
                        mnem = "DAA";
                    }
                    else if (g2 == 5)    // CMA
                    {
                        mnem = "CMA";
                    }
                    else if (g2 == 6)    // STC
                    {
                        mnem = "STC";
                    }
                    else if (g2 == 7)    // CMC
                    {
                        mnem = "CMC";
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else
                {
                    mnem = "???";
                }
            }
            else if (g1 == 1)
            {
                if (g2 == 6 && g3 == 6)    // HLT
                {
                    mnem = "HLT";
                }
                else
                {  // MOV
                    mnem = "MOV";
                    arg1 = parseABCDEHLM(g2);
                    arg2 = parseABCDEHLM(g3);
                }
            }
            else if (g1 == 2)
            {
                if (g2 == 0)    // ADD
                {
                    mnem = "ADD";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 1)    // ADC
                {
                    mnem = "ADC";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 2)    // SUB
                {
                    mnem = "SUB";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 3)    // SBB
                {
                    mnem = "SBB";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 4)    // AND
                {
                    mnem = "AND";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 5)    // XRA
                {
                    mnem = "XRA";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 6)    // ORA
                {
                    mnem = "ORA";
                    arg1 = parseABCDEHLM(g3);
                }
                else if (g2 == 7)    // CMP
                {
                    mnem = "CMP";
                    arg1 = parseABCDEHLM(g3);
                }
                else
                {
                    mnem = "???";
                }
            }
            else
            {
                if (g3 == 0)
                {  // Rxx
                    mnem = "R" + parseCond(g2);
                }
                else if (g3 == 1)
                {
                    if ((g2 & 1) == 0) // POP
                    {
                        mnem = "POP";
                        arg1 = parseBDHPSW(g2 & 6);
                    }
                    else if (g2 == 1)
                    { // RET
                        mnem = "RET";
                    }
                    else if (g2 == 5) // PCHL
                    {
                        mnem = "PCHL";
                    }
                    else if (g2 == 7) // SPHL
                    {
                        mnem = "SPHL";
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else if (g3 == 2)   // Jxx
                {
                    mnem = "J" + parseCond(g2);
                    arg1 = fetchNextWord();
                }
                else if (g3 == 3)
                {
                    if (g2 == 0) // JMP
                    {
                        mnem = "JMP";
                        arg1 = fetchNextWord();
                    }
                    else if (g2 == 3) // IN
                    {
                        mnem = "IN";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 2) // OUT
                    {
                        mnem = "OUT";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 4)   // XTHL
                    {
                        mnem = "XTHL";
                    }
                    else if (g2 == 5) // XCHG
                    {
                        mnem = "XCHG";
                    }
                    else if (g2 == 6) // DI
                    {
                        mnem = "DI";
                    }
                    else if (g2 == 7) // EI
                    {
                        mnem = "EI";
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else if (g3 == 4)   // Cxx
                {
                    mnem = "C" + parseCond(g2);
                    arg1 = fetchNextWord();
                }
                else if (g3 == 5)
                {
                    if ((g2 & 1) == 0) // PUSH
                    {
                        mnem = "PUSH";
                        arg1 = parseBDHPSW(g2 & 6);
                    }
                    else if (g2 == 1)   // CALL
                    {
                        mnem = "CALL";
                        arg1 = fetchNextWord();
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else if (g3 == 6)
                {
                    if (g2 == 0) // ADI
                    {
                        mnem = "ADI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 1) // ACI
                    {
                        mnem = "ACI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 2) // SUI
                    {
                        mnem = "SUI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 3) // SBI
                    {
                        mnem = "SBI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 4) // ANI
                    {
                        mnem = "ANI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 5) // XRI
                    {
                        mnem = "XRI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 6) // ORI
                    {
                        mnem = "ORI";
                        arg1 = fetchNextByte();
                    }
                    else if (g2 == 7) // CPI
                    {
                        mnem = "CPI";
                        arg1 = fetchNextByte();
                    }
                    else
                    {
                        mnem = "???";
                    }
                }
                else if (g3 == 7)   // RST
                {
                    mnem = "RST";
                    arg1 = g2.ToString();
                }
                else
                {
                    mnem = "???";
                }
            }
        }
        private void output()
        {
            writer.Write("{0,0:X4} ", start+offset);
            for (int i = 0; i < 3; i++)
            {
                if (i < length) writer.Write("{0,0:X2} ", bytes[i]);
                else writer.Write("   ");
            }
            writer.Write("{0} ", mnem);
            int len = mnem.Length;
            if (arg1 != null)
            {
                writer.Write("{0}", arg1);
                len += arg1.Length;
            }
            if (arg2 != null)
            {
                writer.Write(",{0}", arg2);
                len += arg2.Length + 1;
            }
            for (int i = 0; i < 10 - len; i++)
            {
                writer.Write(" ");
            }
            writer.Write("\"");
            for (int i = 0; i < length; i++)
            {
                if (bytes[i] >= 0x20)
                    writer.Write((char)bytes[i]);
                else
                    writer.Write(".");
            }
            writer.WriteLine("\"");
        }
        public void Diassemble()
        {
            pointer = 0;
            while (pointer < image.Length)
            {
                disasseleLine();
                output();
            }
        }

        public Dis8080(byte[] image, int offset, TextWriter writer)
        {
            this.image = image;
            this.offset = offset;
            this.writer = writer;
        }
    }
}
