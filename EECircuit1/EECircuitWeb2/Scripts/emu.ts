namespace emu {
    export var superTrap: boolean = false;
    //export var trace: boolean = false;
    export var waitingInput = false;
    export var inputChars = "";
    export var screenRefreshRequest = false;
    export var stepMode = false;
    //var debugCounter = 0;
    //var rightCount = 0;

    class DelayedTraceBox {
        private lines: string[] = [];
        private total = 0;
        private pack = "";
        private packCount = 0;
        public add(msg: string) {
            this.lines.push(msg);
            if (this.lines.length > 900) {
                this.lines.shift();
            }
            this.total++;
        }
        public addPacked(msg: string) {
            this.pack += msg;
            this.packCount++;
            if (this.packCount >= 8)
            {
                this.add(this.pack);
                this.pack = "";
                this.packCount=0;
            }
        }
        public dump() {
            if (this.packCount > 0) this.add(this.pack);
            for (var i = 0; i < this.lines.length; i++) {
                console.log(this.lines[i]);
            }
            console.log("total="+this.total);
            //console.log("rightCount=" + rightCount);
            this.lines = [];
            this.pack = "";
            this.packCount = 0;
        }
    }

    export var tracebox = new DelayedTraceBox();

    function getVirtualMachine() {
        return virtualMachine;
    }

    export class NumberArray {
        private buffer = new ArrayBuffer(65536);
        private view = new Uint8ClampedArray(this.buffer);
        public read(address: number): number {
            return this.view[address];
        }
        public write(address: number, data: number) {
            this.view[address] = data;
        }
        public updateDump(address: number, length: number) {
            $("#memoryAddress").val(dec2hex(address, 4));
            address = parseInt($("#memoryAddress").val(), 16);
            var s = "";
            for (var i = address; i < address + length; i++) {
                s = s + dec2hex(this.view[i], 2) + " ";
            }
            $("#memoryDump").text(s);
        }
        public clear() {
            for (var i = 0; i < 65536; i++) {
                this.view[i] = 0;
            }
        }

        // load image
        // save image
    }

    class MemoryUnit {
        public Bytes = new NumberArray();

    }

    var outputCharCount = 0;

    class IOUnit {
        private outputCharLst(code: number) {
            if (code == 0x0a) return;
            var s: string = $("#lsttext").val();
            s += String.fromCharCode(code);
            if (s.length > 5000) s = s.substring(2);
            $("#lsttext").val(s);
            $("#lsttext").keyup();   // 枠を広げるおまじない
        }

        private outputCharPunch(code: number) {
            if (code == 0x0a) return;
            var s: string = $("#rdrtext").val();
            s += String.fromCharCode(code);
            if (s.length > 5000) s = s.substring(2);
            $("#rdrtext").val(s);
            $("#rdrtext").keyup();   // 枠を広げるおまじない
        }

        private getBitsPortFF(): number {
            var n = 0;
            for (var i = 8 - 1; i >= 0; i--) {
                n <<= 1;
                if ($("#bit" + i).prop("checked")) {
                    n |= 1;
                }
            }
            return n;
        }
        private putBitsPortFF(v: number) {
            var ar: boolean[] = [];
            var n = v;
            for (var i = 0; i < 8; i++) {
                ar.push((n & 1) != 0 ? true : false);
                n >>= 1;
            }
            $("#outPortFF").text(createBitsString(ar));
        }

        private toHostMemoryArray: Uint8Array[];
        private requestToHostOpen() {
            this.toHostMemoryArray = [];

        }
        private requestToHostBuffer() {
            var array = new Uint8Array(128);
            for (var i = 0; i < 128; i++) array[i] = virtualMachine.memory.Bytes.read(i + 0x80);
            this.toHostMemoryArray.push(array);
        }
        private requestToHostClose() {
            var filename = "";
            for (var i = 0; i < 8; i++) {
                var c = virtualMachine.memory.Bytes.read(i + 0x5c + 1) & 0x7f;
                if (c >= 0x33) filename = filename + String.fromCharCode(c);
            }
            filename = filename + ".";
            for (var i = 0; i < 3; i++) {
                var c = virtualMachine.memory.Bytes.read(i + 0x5c + 9) & 0x7f;
                if (c >= 0x33) filename = filename + String.fromCharCode(c);
            }
            var blob = new Blob(this.toHostMemoryArray);
            download(blob, $("#popupDownFD0")[0], filename);
            this.toHostMemoryArray = [];
        }

        private requestToKickEditor() {
            $("#popupUpEditorTextArea").text("EDIT TEXT HERE");
            $("#popupUpEditor").popup("open");
        }
        private requestToHostCreate() {
            // TBW
        }
        private requestToHostBufferWrite() {
            // TBW
        }
        private requestToHostCloseWrite() {
            // TBW
        }

        private rdrImage: string = null;

        private needToSave(): number {
            // TBW
            return 0; // not need to save
        }
        private hasMoreRecord(): number {
            // TBW
            return 0; // has no more records
        }

        public in(addr: number): number {
            if (addr == 0xf0) {
                //console.log("f0:"+(inputChars.length + autoTypeQueue.length));
                if (autoTypeQueue.length == 0 && autoTypeDone) {
                    var a = autoTypeDone;
                    autoTypeDone = null;
                    a();
                }
                if ((inputChars.length + autoTypeQueue.length) == 0) {
                    //console.log("waitingInput");
                    waitingInput = true;
                }
                return 0;
            }
            if (addr == 0xf1) {
                //console.log("f1:" + (inputChars.length + autoTypeQueue.length));
                if (inputChars.length > 0) {
                    var r = inputChars.charCodeAt(0);
                    inputChars = inputChars.substring(1, inputChars.length);
                    return r;
                }
                if (autoTypeQueue.length > 0) {
                    var r = autoTypeQueue.charCodeAt(0);
                    autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
                    return r;
                }
                return "?".charCodeAt(0);
            }
            if (addr == 0xf2) return virtualMachine.cpu.diskread();
            if (addr == 0xf3) return virtualMachine.cpu.diskwrite();
            if (addr == 0xf4) {
                return ((autoTypeQueue.length + inputChars.length) == 0) ? 0 : 0xff;
            }
            if (addr == 0xf5) {
                if (this.rdrImage == null)
                {
                    var s = $("#rdrtext").val();
                    var s0: string = "";
                    for (var i = 0; i < s.length; i++) {
                        if (s.charAt(i) == "\n")
                            s0 += "\r\n";
                        else
                            s0 += s.charAt(i);
                    }
                    this.rdrImage = s0;
                }
                var rdrPointer:number = Number($("#rdrPointer").text());
                var rc = this.rdrImage.charCodeAt(rdrPointer - 1);
                rdrPointer++;
                $("#rdrPointer").text(rdrPointer);
                if (!rc) rc = 0x1a;
                return rc;
            }
            if (addr == 0xf8) return this.needToSave();
            if (addr == 0xf9) return this.hasMoreRecord();
            if (addr == 0xff) return this.getBitsPortFF();
            return 0;
        }
        public out(addr: number, v: number): void {
            if (addr == 0xf0) {
                vdt.outputChar(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
            }
            if (addr == 0xf2) {
                // worm boot notify
                reloadCpm(0xf200 - 0xdc00);
                // syncing virtual disk
                disk.update();
            }
            if (addr == 0xf3) {
                this.outputCharLst(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
            }
            if (addr == 0xf4) {
                this.outputCharPunch(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
                this.rdrImage = null;
            }
            if (addr == 0xf8) this.requestToHostOpen();
            if (addr == 0xf9) this.requestToHostBuffer();
            if (addr == 0xfa) this.requestToHostClose();
            if (addr == 0xfb) this.requestToKickEditor();
            if (addr == 0xfc) this.requestToHostCreate();
            if (addr == 0xfd) this.requestToHostBufferWrite();
            if (addr == 0xfe) this.requestToHostCloseWrite();
            if (addr == 0xff) this.putBitsPortFF(v);
        }
    }

    var autoTypeDone: () => void = null;
    var autoTypeQueue = "";

    export function pushAutoTypeQueue(chars: string, done: () => void) {
        autoTypeQueue += chars;
        autoTypeDone = done;
        if (autoTypeQueue.length == 0) return;
        var r = autoTypeQueue[0];
        autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
        vdt.commonInputRowCode(r.charCodeAt(0));
    }

    class vm {
        public memory = new MemoryUnit();
        public io = new IOUnit();
        public cpu: icpu = null;
        public update() {
            updateMonitorMemoryView();
            this.cpu.update();
        }

        public reset() {
            this.memory.Bytes.clear();
            this.update();
        }

        constructor() {
            if (arg["cpu"] == "Fast8080") this.cpu = new fast8080.i8080();
            else if (arg["cpu"] == "Edu8080") this.cpu = new edu8080.i8080();
            else this.cpu = new fast8080.i8080();
        }
    }
    export var virtualMachine = new vm();

    function updateMonitorMemoryView() {
        var s = $("#memoryAddress").val();
        var addr = parseInt(s, 16);
        if (addr || addr == 0) virtualMachine.memory.Bytes.updateDump(addr, 8);
    }

    $("#memoryAddress").keyup(() => {
        updateMonitorMemoryView();
    });

    export function restart(myStepMode: boolean = false) {
        stepMode = myStepMode;
        virtualMachine.cpu.reset();
        virtualMachine.cpu.update();
    }

    $("#restart").click(() => {
        restart();
    });

    $("#restartbreak").click(() => {
        restart(true);
    });

    $("#step").click(() => {
        virtualMachine.cpu.runMain();
        virtualMachine.cpu.update();
    });

    $("#continue").click(() => {
        stepMode = false;
        virtualMachine.cpu.runMain();
        virtualMachine.cpu.update();
    });

    function loadSource(uri: string, afterproc: () => void) {
        var jqxhr = $.get(uri)
            .done(function (data) {
                $("#sourceCode").val(data);
                $("#sourceCode").keyup();   // 枠を広げるおまじない
                if (afterproc) afterproc();
            })
            .fail(function () {
                alert("load error");
            });
    }

    function loadDiagSource(afterproc: () => void) {
        loadSource("/Content/diag.a80.txt", afterproc);
    }

    function loadBiosSource(afterproc: () => void) {
        loadSource("/Content/bios.a80.txt", afterproc);
    }

    var cpmArray: Uint8Array;

    function reloadCpm(limit: number) {
        for (var i = 0; i < limit; i++) {
            virtualMachine.memory.Bytes.write(0xdc00 + i, cpmArray[i]);
        }
    }

    function loadBinary(url:string, afterproc: (ab:ArrayBuffer) => void) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (xhr.status == 200) {
                // get binary data as a response
                var blob = xhr.response;

                var arrayBuffer;
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    if (afterproc) {
                        var t: any = this.result;
                        afterproc(t);
                    }
                };
                fileReader.onerror = () => { alert("Error"); };
                fileReader.readAsArrayBuffer(blob);
            }
            else {
                alert("load error");
            }
        };
        xhr.send();
    }

    export function loadDisk(drive:number, filename: string, afterproc: () => void) {
        loadBinary("/Content/" + filename, (arrayBuffer) => {
            disk.loadDisk(drive, arrayBuffer, afterproc);
        });
    }

    function loadCpm(afterproc: () => void) {
        loadBinary("/Content/CPM.bin.exe", (arrayBuffer) => {
            cpmArray = new Uint8Array(arrayBuffer);
            reloadCpm(cpmArray.length);
            if (afterproc) afterproc();
        });
    }

    function setupCpm(afterproc:()=>void) {
        for (var i = 0x0; i < 0x10000; i++) {
            virtualMachine.memory.Bytes.write(i, 0xff);
        }
        loadCpm(() => {
            for (var i = 0xf200; i < 0x10000; i++) {
                virtualMachine.memory.Bytes.write(i, 0xff);
            }
            virtualMachine.memory.Bytes.write(0, 0xc3);
            virtualMachine.memory.Bytes.write(1, 0x00);
            virtualMachine.memory.Bytes.write(2, 0xf2);
            loadBiosSource(() => {
                if (afterproc) afterproc();
            });
        });
    }

    $("#rdrReset").click(() => {
        $("#rdrPointer").text("1");
    });

    $("#navcpm").click(() => {
        setupCpm(null);
    });

    $(".modemenu").click(() => {
        vdt.clear();
    });

    function setConsole() {
        $(".mypane").css("display", "none");
        $("#con").css("display", "inherit");
        $("#logicname").text("Console");
    }
    export function setMonitor() {
        $(".mypane").css("display", "none");
        $("#mon").css("display", "inherit");
        $("#logicname").text("Monitor");
        virtualMachine.update();
    }
    function isIde(): boolean {
        return $("#ide").css("display") == "inherit";
    }

    function setIde() {
        $(".mypane").css("display", "none");
        $("#ide").css("display", "inherit");
        $("#logicname").text("IDE");
        ideResiezer(true);
    }
    function setLst() {
        $(".mypane").css("display", "none");
        $("#lst").css("display", "inherit");
        $("#logicname").text("Printer");
        $("#lsttext").keyup();   // 枠を広げるおまじない
    }
    function setRdr() {
        $(".mypane").css("display", "none");
        $("#punrdr").css("display", "inherit");
        $("#logicname").text("Puncher/Reader");
        $("#rdrtext").keyup();   // 枠を広げるおまじない
    }

    $("#navcon").click(() => {
        setConsole();
    });

    $("#navmon").click(() => {
        setMonitor();
    });

    $("#navide").click(() => {
        setIde();
    });

    $("#navlst").click(() => {
        setLst();
    });

    $("#navrdr").click(() => {
        setRdr();
    });

    $("#navreset").click(() => {
        virtualMachine.cpu.reset();
    });

    $("#navecho").click(() => {
        setConsole();
        vdt.echoback();
    });

    $("#naventrap").click(() => {
        superTrap = true;
    });

    $("#navdistrap").click(() => {
        superTrap = false;
    });

    $(".ideCommands").click(() => {
        $("#collapsibleIdeCommands").collapsible("collapse");
    });

    var files: File[];
    var autoType = false;
    var removeBom = false;
    function uploadTPASub()
    {
        if (files.length == 0) {
            $("#fileUpTPA").val("");
            return;
        }
        var f = files.pop();
        var reader = new FileReader();
        $(reader).load((evt) => {
            var t: any = evt.target;
            var ab: ArrayBuffer = t.result;
            var view = new Uint8ClampedArray(ab);
            //console.log(view[0]);
            var offset = 0;
            if (removeBom && view[0] == 0xEF && view[1] == 0xBB && view[2] == 0xBF) {
                offset = 3;
            }
            for (var i = 0; i < view.length-offset; i++) {
                virtualMachine.memory.Bytes.write(i + 0x100, view[i + offset]);
            }
            for (; (i & 255) != 0; i++) {
                virtualMachine.memory.Bytes.write(i + 0x100, 0x1a);
            }
            if (autoType) {
                var pages = Math.floor((view.length + 255) / 256);
                var filename = f.name;
                pushAutoTypeQueue("SAVE " + pages + " " + filename + "\r", () => {
                    uploadTPASub();
                });
                return;
            }
            uploadTPASub();
        });
        reader.readAsArrayBuffer(f);
    }

    $("#fileUpTPA").change((evt) => {
        $("#popupUpTPA").popup("close");
        var x: any = $("#menu-left");
        x.panel("close");
        var target: any = evt.target;
        files = [];
        for (var i = 0; i < target.files.length; i++) {
            files.push(target.files[i])
        }
        autoType = $("#tpaauto").prop("checked");
        removeBom = $("#tparemovebom").prop("checked");
        uploadTPASub();
    });

    function download(blob: Blob, target, filename: string) {
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var url = window.URL.createObjectURL(blob);
            $(target).attr("href", url);
            $(target).attr("download", filename);
        }
    }
    function downloadDrive(drive: number, target) {
        var blob = disk.getDriveAsBlob(drive);
        var filename = "drive" + String.fromCharCode(drive + 0x41) + ".bin";
        download(blob, target, filename);
    }
    $("#popupDownFD0").click((evt) => {
        downloadDrive(0, evt.target);
    });
    $("#popupDownFD1").click((evt) => {
        downloadDrive(1, evt.target);
    });
    $("#popupDownFD2").click((evt) => {
        downloadDrive(2, evt.target);
    });
    $("#popupDownFD3").click((evt) => {
        downloadDrive(3, evt.target);
    });

    var driveForUp = 0;
    $("#popupUpFD0").click((evt) => {
        driveForUp = 0;
    });
    $("#popupUpFD1").click((evt) => {
        driveForUp = 1;
    });
    $("#popupUpFD2").click((evt) => {
        driveForUp = 2;
    });
    $("#popupUpFD3").click((evt) => {
        driveForUp = 3;
    });

    function showCompleted()
    {
        setTimeout(() => {
            $("#popupUpCompleted").popup("open");
        }, 500);
    }

    function confirmErase(drive: number) {
        if (window.confirm('This will erase all files in disk-' + String.fromCharCode(drive + 0x41) + '. Are you sure?')) {
            return false;
        }
        return true;
    }

    $("#loadempty").click((evt) => {
        if (confirmErase(driveForUp)) return;
        disk.initdrive(driveForUp);
        showCompleted();
    });

    export function loadDiskWithComplete(filename: string) {
        setTimeout(() => {
            $("#popupUpDrive").popup("close");
            var x: any = $("#menu-left");
            x.panel("close");
            if (confirmErase(driveForUp)) return;
            loadDisk(driveForUp, filename, () => { showCompleted(); });
        }, 500);
    }

    $("#loadstda").click((evt) => { loadDiskWithComplete("stdA.bin.exe"); });
    $("#loadcpm22").click((evt) => { loadDiskWithComplete("CPMDISK.bin.exe"); });
    $("#loadmbasic").click((evt) => { loadDiskWithComplete("mbasic.bin.exe"); });
    $("#loadf80").click((evt) => { loadDiskWithComplete("F80.bin.exe"); });
    $("#loadjrt").click((evt) => { loadDiskWithComplete("JRTPascal4.bin.exe"); });
    $("#loadwm").click((evt) => { loadDiskWithComplete("wrdmastr.bin.exe"); });
    // comment out after Z80 supported
    //$("#loadzsid").click((evt) => { loadDiskWithComplete("zsid.bin.exe"); });
    //$("#loadtpas30").click((evt) => { loadDiskWithComplete("tpas30.bin.exe"); });
    $("#loadcc1").click((evt) => { loadDiskWithComplete("ccdisk1.bin.exe"); });
    $("#loadcc2").click((evt) => { loadDiskWithComplete("ccdisk2.bin.exe"); });

    $("#loadSoureceBios").click((evt) => { loadBiosSource(null); });
    $("#loadSoureceDiag").click((evt) => { loadDiagSource(null); });

    $("#fileUpDrive").change((evt) => {
        $("#popupUpDrive").popup("close");
        var x: any = $("#menu-left");
        x.panel("close");
        var target: any = evt.target;
        if (target.files.length == 0) return;
        var f = target.files[0];
        var reader = new FileReader();
        $(reader).load((evt) => {
            var t: any = evt.target;
            var ab: ArrayBuffer = t.result;
            disk.loadDisk(driveForUp, ab, () => {
                $("#fileUpDrive").val("");
            });
        });
        reader.readAsArrayBuffer(f);
    });

    function getAbsoluteHeiht(id: string): number {
        var element = document.getElementById(id);
        var rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }

    function ideResiezer(forceToRun: boolean = false) {
        if (forceToRun || isIde()) {
            //$("#sourceCode").height($(window).height());
            var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
            var rect2 = document.getElementById("myhooter").getBoundingClientRect();
            if (rect2.top == 0 || rect1.top == 0) {
                setTimeout(() => {
                    ideResiezer();
                }, 1000);
            }
            else
                //$("#sourceCode").height(rect2.top - rect1.top - 20);
                setTimeout(() => {
                    var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
                    var rect2 = document.getElementById("myhooter").getBoundingClientRect();
                    $("#sourceCode").height(rect2.top - rect1.top - 20);
                }, 1000);
        }
    }

    $(window).resize(() => {
        ideResiezer();
    });

    $(document).on('pagecontainershow', function (e) {
        ideResiezer();
    });
    $(document).on('updatelayout', function (e) {
        ideResiezer();
    });
    $(document).on("pagecreate", function () {
        virtualMachine.reset();
        if (arg["cpm"] != undefined) {
            setConsole();
            superTrap = true;
            setupCpm(() => {
                miniAssembler.compileCommon(() => {
                    //emu.setMonitor();
                    emu.restart();
                });
            });
        }
        else if (arg["cpmdev"] != undefined) {
            setIde();
            superTrap = true;
            setupCpm(null);
        }
        else {
            setIde();
            loadDiagSource(null);
        }
    });
}
