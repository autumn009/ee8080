namespace miniAssembler
{
    function compile(sourceCode: string, outputMemory: emu.NumberArray)
    {
        alert("tbw compile");
    }

    
    $("#ideCompile").click(() => {
        compile($("sourceCode").text(),emu.virtualMachine.memory.Bytes);
    });

    $(document).on("pagecreate", function () {
        // TBW
    });
}
