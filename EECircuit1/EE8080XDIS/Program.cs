using System;

namespace EE8080XDIS
{
    class Program
    {
        static void Main(string[] args)
        {
            if( args.Length != 2)
            {
                Console.WriteLine("usage: ee8080xdis fullpath startaddressInHex");
                Console.WriteLine("example: ee8080xdis c:\\m80.com 100");
                return;
            }
            string path = args[0];
            int offset = int.Parse(args[1], System.Globalization.NumberStyles.HexNumber);
            byte[] image = System.IO.File.ReadAllBytes(path);
            var dis = new Dis8080(image, offset);
            dis.Diassemble();
            Console.WriteLine("Done");
        }
    }
}