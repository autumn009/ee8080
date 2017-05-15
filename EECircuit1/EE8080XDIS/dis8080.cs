using System;
using System.Collections.Generic;
using System.Text;

namespace EE8080XDIS
{
    class Dis8080
    {
        private byte[] image;
        private int offset;
        private int pointer;
        private int start;
        private int length;
        private byte [] bytes = new byte[3];
        private string mnem;
        private string arg1;
        private string arg2;

        private byte getNextByte()
        {
            if (pointer >= image.Length) return 0;
            return image[pointer++];
        }

        private void disasseleLine()
        {
            start = pointer;
            arg1 = null;
            arg2 = null;
            length = 1;
            bytes[0] = getNextByte();

            mnem = "NOP";
        }
        private void output()
        {
            Console.Write("{0,0:X4} ", start);
            for (int i = 0; i < 3; i++)
            {
                if (i < length) Console.Write("{0,0:X2} ", bytes[i]);
                else Console.Write("   ");
            }
            Console.Write("{0} ", mnem);
            if (arg1 != null) Console.Write("{0}", arg1);
            if (arg2 != null) Console.Write(",{0}", arg2);
            Console.WriteLine();
        }
        public void Diassemble()
        {
            pointer = 0;
            while(pointer < image.Length)
            {
                disasseleLine();
                output();
            }
        }

        public Dis8080(byte[] image, int offset )
        {
            this.image = image;
            this.offset = offset;
        }
    }
}
