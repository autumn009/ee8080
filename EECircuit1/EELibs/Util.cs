using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EELibs
{
    public static class Util
    {
        public static ushort MakeWord(byte low, byte high)
        {
            return (ushort)(((ushort)high) * 256 + low);
        }
    }
}
