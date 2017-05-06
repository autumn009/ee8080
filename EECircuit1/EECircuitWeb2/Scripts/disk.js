var disk;
(function (disk) {
    disk.drives = [];
    function read(drive, track, sector, dma) {
        //alert("read " + (drives[0])[0]);
        var view = disk.drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < 128; i++) {
            var v = view[p++];
            emu.virtualMachine.memory.Bytes.write(dma++, v);
        }
        return 0; // success
    }
    disk.read = read;
    function write(drive, track, sector, dma) {
        var view = disk.drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < 128; i++) {
            view[p++] = emu.virtualMachine.memory.Bytes.read(dma++);
        }
        return 0; // success
    }
    disk.write = write;
    function trackLoad(drive, track, view) {
        var key = "drive" + drive + "track" + track;
        var base64 = localStorage.getItem(key);
        var len = 26 * 128;
        var from = track * len;
        var to = from + len;
        if (base64) {
            var binary = atob(base64);
            if (binary.length != len) {
                alert("trackLoad: length not match " + len + " " + binary.length);
            }
            else {
                for (var i = 0; i < binary.length; i++) {
                    view[from++] = binary.charCodeAt(i);
                }
                return;
            }
        }
        for (var j = from; j < to; j++) {
            view[j] = 0xe5;
        }
    }
    function trackSave(drive, track, view) {
        var key = "drive" + drive + "track" + track;
        var len = 26 * 128;
        var from = track * len;
        var to = from + len;
        for (var j = from; j < to; j++) {
            if (view[j] != 0xe5) {
                var b64encoded = btoa(String.fromCharCode.apply(null, view.subarray(from, to)));
                localStorage.setItem(key, b64encoded);
                return;
            }
        }
        // 全バイト0xe5のトラックは保存しない。
        localStorage.removeItem(key);
    }
    $(document).on("pagecreate", function () {
        var totalSize = 128 * 26 * 77;
        for (var i = 0; i < 4; i++) {
            var buffer = new ArrayBuffer(totalSize);
            var view = new Uint8ClampedArray(buffer);
            disk.drives.push(view);
            for (var j = 0; j < 77; j++) {
                trackLoad(i, j, view);
            }
        }
    });
    $(window).unload(function () {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 77; j++) {
                trackSave(i, j, disk.drives[i]);
            }
        }
    });
})(disk || (disk = {}));
//# sourceMappingURL=disk.js.map