function run(uri) {
    var cpu = "";
    if ($("#selectOrg8080").prop("cecked"))
        cpu = "Org8080";
    else if ($("#selectFast8080").prop("cecked"))
        cpu = "Fast8080";
    else if ($("#selectEdu8080").prop("cecked"))
        cpu = "Edu8080";
    if (uri.indexOf("?") >= 0)
        location.href = uri + "&cpu=" + cpu;
    else
        location.href = uri + "?cpu=" + cpu;
}
$(document).on("pagecreate", function () {
    $("#warnbutton").click(function () {
        if (window.confirm('This will erase all files in your all disks(A,B,C,D). Are you sure?')) {
            location.href = "/emu.aspx?cpm=&initdisk=";
        }
    });
    $("#cpm").click(function () {
        run("/emu.aspx?cpm=");
    });
    $("#cpuemu").click(function () {
        run("/emu.aspx");
    });
    $("#cpmdev").click(function () {
        run("/emu.aspx?cpmdev=");
    });
});
//# sourceMappingURL=Default.js.map