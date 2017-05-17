
enum Logic
{
    H, L, Z,
    Invert0// for overline Q
}

function logicToString(val: Logic) {
    if (val == Logic.L) return "L";
    if (val == Logic.H) return "H";
    return "Z";
}
function logicToBoolean(val: Logic) {
    return val == Logic.H;
}

function stringToLogic(val: string):Logic {
    if (val == "L") return Logic.L;
    if (val == "H") return Logic.H;
    return Logic.Z;
}

function booleanToLogic(val: boolean): Logic {
    if (val) return Logic.H;
    return Logic.L;
}
function booleanToLogicArray(ary: boolean[]): Logic[] {
    var r: Logic[] = [];
    for (var i = 0; i < ary.length; i++) {
        r.push(ary[i] ? Logic.H : Logic.L);
    }
    return r;
}

function array2binaryUnsinged(val: boolean[]): number {
    var n = 0;
    for (var i = val.length - 1; i >= 0; i--) {
        n = n * 2;
        if (val[i]) n += 1;
    }
    return n;
}

function array2binarySinged(val: boolean[]): number {
    var r = array2binaryUnsinged(val);
    if (val[val.length - 1]) {
        r = r - 256;
    }
    return r;
}

function createBitsString(current: boolean[]): string {
    var s = "";
    for (var i = 0; i < current.length; i++) {
        if (current[i]) {
            s = "●" + s;
        }
        else {
            s = "○" + s;
        }
    }
    return s;
}

function dec2hex(n: number, width: number): string {
    var x: string;
    if (n == undefined) x = "XXXX";
    else
        x = n.toString(16);
    var s = "000" + x;
    return s.substring(s.length - width, s.length).toUpperCase();
}

function lowByte( v : number) :number
{
    return v & 255;
}
function highByte(v: number): number {
    return (v >> 8) & 255;
}
function incrementAddress(a: number): number {
    var a = a + 1;
    if (a >= 0x10000) return 0;
    return a;
}

var arg = new Object;
var pair = location.search.substring(1).split('&');
for (var i = 0; pair[i]; i++) {
    var kv = pair[i].split('=');
    arg[kv[0]] = kv[1];
}

interface icpu {
    runMain();
    reset();
    update();
    diskread(): number;
    diskwrite(): number;
    getName(): string;
}
