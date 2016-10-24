using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EELibs
{
    public class Latch<T>:Component
    {
        public virtual T Data { get; set; }
    }

    public abstract class Register<T> : Latch<T>
    {
        public abstract void Inrement();
        public abstract void Decrement();
    }

    public class Register8 : Register<byte>
    {
        public override void Inrement()
        {
            Data++;
        }
        public override void Decrement()
        {
            Data--;
        }
        public string DataByHex
        {
            get
            {
                return Data.ToString("X2");
            }
        }
    }

    public class Register16 : Register<ushort>
    {
        public override void Inrement()
        {
            Data++;
        }
        public override void Decrement()
        {
            Data--;
        }
    }
}
