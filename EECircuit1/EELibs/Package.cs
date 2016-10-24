using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EELibs
{
    public class Package: Component
    {
        public virtual string Name { get; }
        public override string ToString()
        {
            return Name;
        }
    }
}
