using System;
using System.IO;

namespace EE8080XDIS
{
    class Program
    {
        static void Main(string[] args)
        {
            if( args.Length != 2 && args.Length != 3)
            {
                Console.WriteLine("usage: ee8080xdis fullpath startaddressInHex [outputpath]");
                Console.WriteLine("example: ee8080xdis c:\\m80.com 100");
                return;
            }
            string path = args[0];
            int offset = int.Parse(args[1], System.Globalization.NumberStyles.HexNumber);
            var writer = Console.Out;
            if (args.Length == 3) writer = File.CreateText(args[2]);
            byte[] image = System.IO.File.ReadAllBytes(path);
            using (writer)
            {
                var dis = new Dis8080(image, offset, writer);
                dis.Diassemble();
            }
            Console.WriteLine("Done");
            if (args.Length == 3) System.Diagnostics.Process.Start("notepad.exe",args[2]);
        }
    }
}