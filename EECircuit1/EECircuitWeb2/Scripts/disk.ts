﻿namespace disk {
    var drives: Uint8ClampedArray[] = [];
    var driveDirty: boolean[] = [false, false, false, false];

    export function getDriveAsBlob(drive: number) {
        return new Blob([drives[drive].buffer]);
    }

    export function loadDisk(drive: number, arrayBuffer: ArrayBuffer, afterproc: () => void) {
        var array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < array.length; i++) {
            drives[drive][i] = array[i];
        }
        driveDirty[drive] = true;
        if (afterproc) afterproc();
    }

    export function read(drive: number, track: number, sector: number, dma: number): number {
        //alert("read " + (drives[0])[0]);
        //if (drive < 0 || drive > 3) return 0xff;
        //if (track < 0 || track > 76) return 0xff;
        //if (sector < 0 || sector > 25) return 0xff;
        var view = drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < 128; i++) {
            var v = view[p++];
            emu.virtualMachine.memory.Bytes.write(dma++, v);
        }
        return 0;   // success
    }

    export function write(drive: number, track: number, sector: number, dma: number): number {
        //if (drive < 0 || drive > 3) return 0xff;
        //if (track < 0 || track > 76) return 0xff;
        //if (sector < 0 || sector > 25) return 0xff;
        var view = drives[drive];
        var p = (sector + 26 * track) * 128;
        for (var i = 0; i < 128; i++) {
            view[p++] = emu.virtualMachine.memory.Bytes.read(dma++);
        }
        driveDirty[drive] = true;
        return 0;   // success
    }

    function trackLoad(drive: number, track: number, view: Uint8ClampedArray) {
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

    function trackSave(drive: number, track: number, view: Uint8ClampedArray) {
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

    export function initdrive(drive: number) {
        var totalSize = 128 * 26 * 77;
        var view = drives[drive];
        for (var j = 0; j < totalSize; j++) {
            view[j] = 0xe5;
        }
        driveDirty[drive] = true;
    }

    function isSaveDriveExist(drive: number) {
        for (var track = 0; track < 77; track++) {
            var key = "drive" + drive + "track" + track;
            if (localStorage.getItem(key)) return true;
        }
        return false;
    }

    export function update() {
        for (var i = 0; i < 4; i++) {
            if (driveDirty[i]) {
                for (var j = 0; j < 77; j++) {
                    trackSave(i, j, drives[i]);
                }
                driveDirty[i] = false;
            }
        }
    }

    $(document).on("pagecreate", function () {
        var initdisk = (arg["initdisk"] != undefined);
        var totalSize = 128 * 26 * 77;
        for (var i = 0; i < 4; i++) {
            var buffer = new ArrayBuffer(totalSize);
            var view = new Uint8ClampedArray(buffer);
            drives.push(view);
            if (i == 0 && (initdisk ||!isSaveDriveExist(i))) {
                emu.loadDisk(i, "stdA.bin.exe", null);
            }
            else {
                if (initdisk) {
                    initdrive(i);
                }
                else {
                    for (var j = 0; j < 77; j++) {
                        trackLoad(i, j, view);
                    }
                }
            }
        }
    });

    $(window).unload(function () {
        update();
    });
}