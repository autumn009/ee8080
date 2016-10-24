using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EELibs
{
    public class RegisterPair : Register<ushort>
    {
        private Register8 lowPart;
        private Register8 highPart;
        public override ushort Data
        {
            get
            {
                return Util.MakeWord(lowPart.Data, highPart.Data);
            }

            set
            {
                lowPart.Data = (byte)(value & 255);
                highPart.Data = (byte)(value / 256);
            }
        }
        public override void Inrement()
        {
            Data++;
        }
        public override void Decrement()
        {
            Data--;
        }

        public RegisterPair(Register8 low, Register8 high)
        {
            this.lowPart = low;
            this.highPart = high;
        }

    }
}
