var miniAssembler;
(function (miniAssembler) {
    function compile(sourceCode, outputMemory) {
        alert("tbw compile");
    }
    $("#ideCompile").click(function () {
        compile($("sourceCode").text(), emu.virtualMachine.memory.Bytes);
    });
    $(document).on("pagecreate", function () {
        // TBW
    });
})(miniAssembler || (miniAssembler = {}));
//# sourceMappingURL=miniAssembler.js.map