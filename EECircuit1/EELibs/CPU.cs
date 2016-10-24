using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EELibs
{
    public class CPU : Package
    {
        public override string Name
        {
            get
            {
                return "ee8080";
            }
        }
        // registers
        public readonly Register8 a = new Register8();
        public readonly Register8 b = new Register8();
        public readonly Register8 c = new Register8();
        public readonly Register8 d = new Register8();
        public readonly Register8 e = new Register8();
        public readonly Register8 f = new Register8();
        public readonly Register8 l = new Register8();
        public readonly Register8 h = new Register8();
        public readonly Register16 sp = new Register16();
        public readonly Register16 pc = new Register16();
        public readonly RegisterPair bc, de, hl, psw;

        public CPU()
        {
            bc = new RegisterPair(b, c);
            de = new RegisterPair(d, e);
            hl = new RegisterPair(l, h);
            psw = new RegisterPair(a, f);
        }
    }
}
