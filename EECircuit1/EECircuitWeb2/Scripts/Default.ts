function run(uri: string)
{
    var cpu = "";
    if ($("#selectFast8080").prop("checked")) cpu = "Fast8080";
    else if ($("#selectEdu8080").prop("checked")) cpu = "Edu8080";
    if (uri.indexOf("?")>=0)
        location.href = uri + "&cpu=" + cpu;
    else
        location.href = uri + "?cpu=" + cpu;
}


$(document).on("pagecreate", function () {
    $("#warnbutton").click(() => {
        if (window.confirm('This will erase all files in your all disks(A,B,C,D). Are you sure?')) {
            run("/emu.aspx?cpm=&initdisk=");
        }
    });
    $("#cpm").click(() => {
        run("/emu.aspx?cpm=");
    });
    $("#cpuemu").click(() => {
        run("/emu.aspx");
    });
    $("#cpmdev").click(() => {
        run("/emu.aspx?cpmdev=");
    });

    

});
