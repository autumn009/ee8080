
enum Logic
{
    H,L,Z
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
