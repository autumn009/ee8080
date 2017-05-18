var emu;
(function (emu) {
    emu.superTrap = false;
    //export var trace: boolean = false;
    emu.waitingInput = false;
    emu.inputChars = "";
    emu.screenRefreshRequest = false;
    //var debugCounter = 0;
    //var rightCount = 0;
    var DelayedTraceBox = (function () {
        function DelayedTraceBox() {
            this.lines = [];
            this.total = 0;
            this.pack = "";
            this.packCount = 0;
        }
        DelayedTraceBox.prototype.add = function (msg) {
            this.lines.push(msg);
            if (this.lines.length > 900) {
                this.lines.shift();
            }
            this.total++;
        };
        DelayedTraceBox.prototype.addPacked = function (msg) {
            this.pack += msg;
            this.packCount++;
            if (this.packCount >= 8) {
                this.add(this.pack);
                this.pack = "";
                this.packCount = 0;
            }
        };
        DelayedTraceBox.prototype.dump = function () {
            if (this.packCount > 0)
                this.add(this.pack);
            for (var i = 0; i < this.lines.length; i++) {
                console.log(this.lines[i]);
            }
            console.log("total=" + this.total);
            //console.log("rightCount=" + rightCount);
            this.lines = [];
            this.pack = "";
            this.packCount = 0;
        };
        return DelayedTraceBox;
    }());
    emu.tracebox = new DelayedTraceBox();
    function getVirtualMachine() {
        return emu.virtualMachine;
    }
    var NumberArray = (function () {
        function NumberArray() {
            this.buffer = new ArrayBuffer(65536);
            this.view = new Uint8ClampedArray(this.buffer);
            // load image
            // save image
        }
        NumberArray.prototype.read = function (address) {
            return this.view[address];
        };
        NumberArray.prototype.write = function (address, data) {
            this.view[address] = data;
        };
        NumberArray.prototype.updateDump = function (address, length) {
            $("#memoryAddress").val(dec2hex(address, 4));
            address = parseInt($("#memoryAddress").val(), 16);
            var s = "";
            for (var i = address; i < address + length; i++) {
                s = s + dec2hex(this.view[i], 2) + " ";
            }
            $("#memoryDump").text(s);
        };
        NumberArray.prototype.clear = function () {
            for (var i = 0; i < 65536; i++) {
                this.view[i] = 0;
            }
        };
        return NumberArray;
    }());
    emu.NumberArray = NumberArray;
    var MemoryUnit = (function () {
        function MemoryUnit() {
            this.Bytes = new NumberArray();
        }
        return MemoryUnit;
    }());
    var outputCharCount = 0;
    var IOUnit = (function () {
        function IOUnit() {
            this.rdrImage = null;
        }
        IOUnit.prototype.outputCharLst = function (code) {
            if (code == 0x0a)
                return;
            var s = $("#lsttext").val();
            s += String.fromCharCode(code);
            if (s.length > 5000)
                s = s.substring(2);
            $("#lsttext").val(s);
            $("#lsttext").keyup(); // 枠を広げるおまじない
        };
        IOUnit.prototype.outputCharPunch = function (code) {
            if (code == 0x0a)
                return;
            var s = $("#rdrtext").val();
            s += String.fromCharCode(code);
            if (s.length > 5000)
                s = s.substring(2);
            $("#rdrtext").val(s);
            $("#rdrtext").keyup(); // 枠を広げるおまじない
        };
        IOUnit.prototype.getBitsPortFF = function () {
            var n = 0;
            for (var i = 8 - 1; i >= 0; i--) {
                n <<= 1;
                if ($("#bit" + i).prop("checked")) {
                    n |= 1;
                }
            }
            return n;
        };
        IOUnit.prototype.putBitsPortFF = function (v) {
            var ar = [];
            var n = v;
            for (var i = 0; i < 8; i++) {
                ar.push((n & 1) != 0 ? true : false);
                n >>= 1;
            }
            $("#outPortFF").text(createBitsString(ar));
        };
        IOUnit.prototype.in = function (addr) {
            if (addr == 0xf0) {
                //console.log("f0:"+(inputChars.length + autoTypeQueue.length));
                if (autoTypeQueue.length == 0 && autoTypeDone) {
                    var a = autoTypeDone;
                    autoTypeDone = null;
                    a();
                }
                if ((emu.inputChars.length + autoTypeQueue.length) == 0) {
                    //console.log("waitingInput");
                    emu.waitingInput = true;
                }
                return 0;
            }
            if (addr == 0xf1) {
                //console.log("f1:" + (inputChars.length + autoTypeQueue.length));
                if (emu.inputChars.length > 0) {
                    var r = emu.inputChars.charCodeAt(0);
                    emu.inputChars = emu.inputChars.substring(1, emu.inputChars.length);
                    return r;
                }
                if (autoTypeQueue.length > 0) {
                    var r = autoTypeQueue.charCodeAt(0);
                    autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
                    return r;
                }
                return "?".charCodeAt(0);
            }
            if (addr == 0xf2)
                return emu.virtualMachine.cpu.diskread();
            if (addr == 0xf3)
                return emu.virtualMachine.cpu.diskwrite();
            if (addr == 0xf4) {
                return ((autoTypeQueue.length + emu.inputChars.length) == 0) ? 0 : 0xff;
            }
            if (addr == 0xf5) {
                if (this.rdrImage == null) {
                    var s = $("#rdrtext").val();
                    var s0 = "";
                    for (var i = 0; i < s.length; i++) {
                        if (s.charAt(i) == "\n")
                            s0 += "\r\n";
                        else
                            s0 += s.charAt(i);
                    }
                    this.rdrImage = s0;
                }
                var rdrPointer = Number($("#rdrPointer").text());
                var rc = this.rdrImage.charCodeAt(rdrPointer - 1);
                rdrPointer++;
                $("#rdrPointer").text(rdrPointer);
                if (!rc)
                    rc = 0x1a;
                return rc;
            }
            if (addr == 0xff)
                return this.getBitsPortFF();
            return 0;
        };
        IOUnit.prototype.out = function (addr, v) {
            if (addr == 0xf0) {
                vdt.outputChar(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    emu.screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
            }
            if (addr == 0xf3) {
                this.outputCharLst(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    emu.screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
            }
            if (addr == 0xf4) {
                this.outputCharPunch(v);
                if (v == 0x0d || outputCharCount >= 10) {
                    emu.screenRefreshRequest = true;
                    outputCharCount = 0;
                }
                else
                    outputCharCount++;
                this.rdrImage = null;
            }
            if (addr == 0xf2)
                reloadCpm(0xf200 - 0xdc00);
            if (addr == 0xff)
                this.putBitsPortFF(v);
        };
        return IOUnit;
    }());
    var autoTypeDone = null;
    var autoTypeQueue = "";
    function pushAutoTypeQueue(chars, done) {
        autoTypeQueue += chars;
        autoTypeDone = done;
        if (autoTypeQueue.length == 0)
            return;
        var r = autoTypeQueue[0];
        autoTypeQueue = autoTypeQueue.substring(1, autoTypeQueue.length);
        vdt.commonInputRowCode(r.charCodeAt(0));
    }
    emu.pushAutoTypeQueue = pushAutoTypeQueue;
    var vm = (function () {
        function vm() {
            this.memory = new MemoryUnit();
            this.io = new IOUnit();
            this.cpu = null;
            if (arg["cpu"] == "Org8080")
                this.cpu = new org8080.i8080();
            else if (arg["cpu"] == "Fast8080")
                this.cpu = new fast8080.i8080();
            else if (arg["cpu"] == "Edu8080")
                this.cpu = new edu8080.i8080();
        }
        vm.prototype.update = function () {
            updateMonitorMemoryView();
            this.cpu.update();
        };
        vm.prototype.reset = function () {
            this.memory.Bytes.clear();
            this.update();
        };
        return vm;
    }());
    emu.virtualMachine = new vm();
    function updateMonitorMemoryView() {
        var s = $("#memoryAddress").val();
        var addr = parseInt(s, 16);
        if (addr || addr == 0)
            emu.virtualMachine.memory.Bytes.updateDump(addr, 8);
    }
    $("#memoryAddress").keyup(function () {
        updateMonitorMemoryView();
    });
    function restart() {
        emu.virtualMachine.cpu.reset();
        emu.virtualMachine.cpu.update();
    }
    emu.restart = restart;
    $("#restart").click(function () {
        restart();
    });
    $("#stopcont").click(function () {
        // TBW
    });
    function loadSource(uri, afterproc) {
        var jqxhr = $.get(uri)
            .done(function (data) {
            $("#sourceCode").val(data);
            $("#sourceCode").keyup(); // 枠を広げるおまじない
            if (afterproc)
                afterproc();
        })
            .fail(function () {
            alert("load error");
        });
    }
    function loadTest1(afterproc) {
        loadSource("/Content/diag.a80.txt", afterproc);
    }
    function loadBiosSource(afterproc) {
        loadSource("/Content/bios.a80.txt", afterproc);
    }
    function loadTest2() {
        var s = "";
        s += " in 0ffh\r\n";
        s += " out 0ffh\r\n";
        s += " hlt\r\n";
        $("#sourceCode").val(s);
    }
    var cpmArray;
    function reloadCpm(limit) {
        for (var i = 0; i < limit; i++) {
            emu.virtualMachine.memory.Bytes.write(0xdc00 + i, cpmArray[i]);
        }
    }
    function loadBinary(url, afterproc) {
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
                    if (afterproc)
                        afterproc(this.result);
                };
                fileReader.onerror = function () { alert("Error"); };
                fileReader.readAsArrayBuffer(blob);
            }
            else {
                alert("load error");
            }
        };
        xhr.send();
    }
    function loadDisk(drive, filename, afterproc) {
        loadBinary("/Content/" + filename, function (arrayBuffer) {
            var array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
                disk.drives[drive][i] = array[i];
            }
            if (afterproc)
                afterproc();
        });
    }
    emu.loadDisk = loadDisk;
    function loadCpm(afterproc) {
        loadBinary("/Content/CPM.bin.exe", function (arrayBuffer) {
            cpmArray = new Uint8Array(arrayBuffer);
            reloadCpm(cpmArray.length);
            if (afterproc)
                afterproc();
        });
    }
    function setupCpm(afterproc) {
        for (var i = 0x0; i < 0x10000; i++) {
            emu.virtualMachine.memory.Bytes.write(i, 0xff);
        }
        loadCpm(function () {
            for (var i = 0xf200; i < 0x10000; i++) {
                emu.virtualMachine.memory.Bytes.write(i, 0xff);
            }
            emu.virtualMachine.memory.Bytes.write(0, 0xc3);
            emu.virtualMachine.memory.Bytes.write(1, 0x00);
            emu.virtualMachine.memory.Bytes.write(2, 0xf2);
            loadBiosSource(function () {
                if (afterproc)
                    afterproc();
            });
        });
    }
    $("#rdrReset").click(function () {
        $("#rdrPointer").text("1");
    });
    $("#navtest2").click(function () {
        loadTest2();
    });
    $("#navtest1").click(function () {
        loadTest1(null);
    });
    $("#navcpm").click(function () {
        setupCpm(null);
    });
    $(".modemenu").click(function () {
        vdt.clear();
    });
    function setConsole() {
        $(".mypane").css("display", "none");
        $("#con").css("display", "inherit");
        $("#logicname").text("Console");
    }
    function setMonitor() {
        $(".mypane").css("display", "none");
        $("#mon").css("display", "inherit");
        $("#logicname").text("Monitor");
        emu.virtualMachine.update();
    }
    emu.setMonitor = setMonitor;
    function setIde() {
        $(".mypane").css("display", "none");
        $("#ide").css("display", "inherit");
        $("#logicname").text("IDE");
    }
    function setLst() {
        $(".mypane").css("display", "none");
        $("#lst").css("display", "inherit");
        $("#logicname").text("Printer");
        $("#lsttext").keyup(); // 枠を広げるおまじない
    }
    function setRdr() {
        $(".mypane").css("display", "none");
        $("#punrdr").css("display", "inherit");
        $("#logicname").text("Puncher/Reader");
        $("#rdrtext").keyup(); // 枠を広げるおまじない
    }
    $("#navcon").click(function () {
        setConsole();
    });
    $("#navmon").click(function () {
        setMonitor();
    });
    $("#navide").click(function () {
        setIde();
    });
    $("#navlst").click(function () {
        setLst();
    });
    $("#navrdr").click(function () {
        setRdr();
    });
    $("#navreset").click(function () {
        emu.virtualMachine.reset();
    });
    $("#navecho").click(function () {
        setConsole();
        vdt.echoback();
    });
    $("#naventrap").click(function () {
        emu.superTrap = true;
    });
    $("#navdistrap").click(function () {
        emu.superTrap = false;
    });
    $(".ideCommands").click(function () {
        $("#collapsibleIdeCommands").collapsible("collapse");
    });
    var files;
    var autoType = false;
    function uploadTPASub() {
        if (files.length == 0) {
            $("#fileUpTPA").val("");
            return;
        }
        var f = files.pop();
        var reader = new FileReader();
        $(reader).load(function (evt) {
            var t = evt.target;
            var ab = t.result;
            var view = new Uint8ClampedArray(ab);
            //console.log(view[0]);
            for (var i = 0; i < view.length; i++) {
                emu.virtualMachine.memory.Bytes.write(i + 0x100, view[i]);
            }
            if (autoType) {
                var pages = Math.floor((view.length + 255) / 256);
                var filename = f.name;
                pushAutoTypeQueue("SAVE " + pages + " " + filename + "\r", function () {
                    uploadTPASub();
                });
                return;
            }
            uploadTPASub();
        });
        reader.readAsArrayBuffer(f);
    }
    $("#fileUpTPA").change(function (evt) {
        $("#popupUpTPA").popup("close");
        var x = $("#menu-left");
        x.panel("close");
        var target = evt.target;
        files = [];
        for (var i = 0; i < target.files.length; i++) {
            files.push(target.files[i]);
        }
        autoType = $("#tpaauto").prop("checked");
        uploadTPASub();
    });
    function downloadDrive(drive, target) {
        var blob = new Blob([disk.drives[drive].buffer]);
        var filename = "drive" + String.fromCharCode(drive + 0x41) + ".bin";
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var url = window.URL.createObjectURL(blob);
            $(target).attr("href", url);
            $(target).attr("download", filename);
        }
    }
    $("#popupDownFD0").click(function (evt) {
        downloadDrive(0, evt.target);
    });
    $("#popupDownFD1").click(function (evt) {
        downloadDrive(1, evt.target);
    });
    $("#popupDownFD2").click(function (evt) {
        downloadDrive(2, evt.target);
    });
    $("#popupDownFD3").click(function (evt) {
        downloadDrive(3, evt.target);
    });
    var driveForUp = 0;
    $("#popupUpFD0").click(function (evt) {
        driveForUp = 0;
    });
    $("#popupUpFD1").click(function (evt) {
        driveForUp = 1;
    });
    $("#popupUpFD2").click(function (evt) {
        driveForUp = 2;
    });
    $("#popupUpFD3").click(function (evt) {
        driveForUp = 3;
    });
    function showCompleted() {
        setTimeout(function () {
            $("#popupUpCompleted").popup("open");
        }, 500);
    }
    function confirmErase(drive) {
        if (window.confirm('This will erase all files in disk-' + String.fromCharCode(drive + 0x41) + '. Are you sure?')) {
            return false;
        }
        return true;
    }
    $("#loadempty").click(function (evt) {
        if (confirmErase(driveForUp))
            return;
        disk.initdrive(driveForUp);
        showCompleted();
    });
    function loadDiskWithComplete(filename) {
        setTimeout(function () {
            $("#popupUpDrive").popup("close");
            var x = $("#menu-left");
            x.panel("close");
            if (confirmErase(driveForUp))
                return;
            loadBinary("/Content/" + filename, function (arrayBuffer) {
                var array = new Uint8Array(arrayBuffer);
                for (var i = 0; i < array.length; i++) {
                    disk.drives[driveForUp][i] = array[i];
                }
                showCompleted();
            });
        }, 500);
    }
    emu.loadDiskWithComplete = loadDiskWithComplete;
    $("#loadstda").click(function (evt) { loadDiskWithComplete("stdA.bin.exe"); });
    $("#loadcpm22").click(function (evt) { loadDiskWithComplete("CPMDISK.bin.exe"); });
    $("#loadmbasic").click(function (evt) { loadDiskWithComplete("mbasic.bin.exe"); });
    $("#loadf80").click(function (evt) { loadDiskWithComplete("F80.bin.exe"); });
    $("#loadjrt").click(function (evt) { loadDiskWithComplete("JRTPascal4.bin.exe"); });
    $("#loadwm").click(function (evt) { loadDiskWithComplete("wrdmastr.bin.exe"); });
    // comment out after Z80 supported
    //$("#loadzsid").click((evt) => { loadDiskWithComplete("zsid.bin.exe"); });
    //$("#loadtpas30").click((evt) => { loadDiskWithComplete("tpas30.bin.exe"); });
    $("#loadcc1").click(function (evt) { loadDiskWithComplete("ccdisk1.bin.exe"); });
    $("#loadcc2").click(function (evt) { loadDiskWithComplete("ccdisk2.bin.exe"); });
    $("#fileUpDrive").change(function (evt) {
        $("#popupUpDrive").popup("close");
        var x = $("#menu-left");
        x.panel("close");
        var target = evt.target;
        if (target.files.length == 0)
            return;
        var f = target.files[0];
        var reader = new FileReader();
        $(reader).load(function (evt) {
            var t = evt.target;
            var ab = t.result;
            var view = new Uint8ClampedArray(ab);
            disk.drives[driveForUp] = view;
            $("#fileUpDrive").val("");
        });
        reader.readAsArrayBuffer(f);
    });
    function getAbsoluteHeiht(id) {
        var element = document.getElementById(id);
        var rect = element.getBoundingClientRect();
        return rect.top + window.pageYOffset;
    }
    function ideResiezer() {
        //$("#sourceCode").height($(window).height());
        var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
        var rect2 = document.getElementById("myhooter").getBoundingClientRect();
        if (rect2.top == 0 || rect1.top == 0) {
            setTimeout(function () {
                ideResiezer();
            }, 1000);
        }
        else
            //$("#sourceCode").height(rect2.top - rect1.top - 20);
            setTimeout(function () {
                var rect1 = document.getElementById("sourceCode").getBoundingClientRect();
                var rect2 = document.getElementById("myhooter").getBoundingClientRect();
                $("#sourceCode").height(rect2.top - rect1.top - 20);
            }, 1000);
    }
    $(window).resize(function () {
        ideResiezer();
    });
    $(document).on('pagecontainershow', function (e) {
        ideResiezer();
    });
    $(document).on('updatelayout', function (e) {
        ideResiezer();
    });
    $(document).on("pagecreate", function () {
        emu.virtualMachine.reset();
        if (arg["cpm"] != undefined) {
            setConsole();
            emu.superTrap = true;
            setupCpm(function () {
                miniAssembler.compileCommon(function () {
                    //emu.setMonitor();
                    emu.restart();
                });
            });
        }
        else if (arg["cpmdev"] != undefined) {
            setIde();
            emu.superTrap = true;
            setupCpm(null);
        }
        else {
            setIde();
            loadTest1(null);
        }
    });
})(emu || (emu = {}));
//# sourceMappingURL=emu.js.map