var disk;
(function (disk) {
    var drives = [];
    function read(drive, track, sector, dma) {
        var view = drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < length; i++) {
            emu.virtualMachine.memory.Bytes.write(dma++, view[p++]);
        }
        return 0; // success
    }
    disk.read = read;
    function write(drive, track, sector, dma) {
        var view = drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < length; i++) {
            view[p++] = emu.virtualMachine.memory.Bytes.read(dma++);
        }
        return 0; // success
    }
    disk.write = write;
    $(document).on("pagecreate", function () {
        var totalSize = 128 * 26 * 77;
        for (var i = 0; i < 4; i++) {
            var buffer = new ArrayBuffer(totalSize);
            var view = new Uint8ClampedArray(buffer);
            drives.push(view);
            // TBW create initial format
            for (var i = 0; i < totalSize; i++) {
                view[i] = 0xe5;
            }
        }
    });
})(disk || (disk = {}));
//# sourceMappingURL=disk.js.map