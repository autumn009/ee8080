namespace seripara
{
    var paraMode = false;
    var rdata: boolean[] = [false, false, false, false, false, false, false, false];
    var wdata: boolean[] = [];

    function getValue(): boolean[] {
        var r: boolean[] = [];
        for (var i = 0; i < 8; i++) {
            r.push($("#bit" + i).prop("checked"));
        }
        return r;
    }

    function setValue(val: boolean[]) {
        for (var i = 0; i < 8; i++) {
            $("#bit" + i).prop("checked", val[i]).checkboxradio("refresh");
        }
    }

    function updateCounter() {
        var current = getValue();
        $("#tsigned").text(array2binarySinged(current));
        var status = " Ready";
        if (sTransferRequest || pTransferRequest) status = " Transfering";
        $("#rsigned").text(array2binarySinged(rdata) + status);
        $("#wire").text(createBitsString(wdata));
        $("#rText").text(createBitsString(rdata));
        $("#count").text(sTransferCount);
    }

    $(".bit").click(() => {
        updateCounter();
    });

    var clockState = false;
    var sTransferRequest = false;
    var pTransferRequest = false;
    var sTransferCount = 0;

    function clockOn() {
        clockState = true;
        $("#clock").text("●");
    }

    function clockOff() {
        clockState = false;
        $("#clock").text("○");

        if (pTransferRequest)
        {
            pTransferRequest = false;
            wdata = getValue();
            rdata = wdata;
            updateCounter();
        }
        if (sTransferRequest) {
            var s = getValue().slice(1, 8).concat([false]);
            wdata = getValue().slice(0, 1);
            rdata = rdata.slice(1, 8).concat(wdata);
            setValue(s);
            sTransferCount--;
            if (sTransferCount <= 0) sTransferRequest = false;
            updateCounter();
        }
    }

    function startClock() {
        setTimeout(() => {
            if (clockState) clockOff(); else clockOn();
            startClock();
        }, 1000);
    }

    $("#transfer").click(() => {
        if (paraMode)
            pTransferRequest = true;
        else {
            sTransferRequest = true;
            sTransferCount = 8;
        }
    });

    function setupCommon() {
        rdata = [false, false, false, false, false, false, false, false];
        wdata = [];
        pTransferRequest = false;
        sTransferRequest = false;
        sTransferCount = 0;
        updateCounter();
    }

    $("#navreset").click(() => {
        var r = [];
        for (var i = 0; i < 8; i++) {
            r.push(false);
        }
        setValue(r);
        setupCommon();
    });

    function parallelSetup() {
        paraMode = true;
        $("#simname").text("Parallel Transfer");
        $("#logicname").text("Parallel Transfer");
        $("#transferCounter").hide();
        setupCommon();
    }

    $("#navpara").click(() => {
        parallelSetup();
    });

    $("#navseri").click(() => {
        paraMode = false;
        $("#simname").text("Serial Transfer");
        $("#logicname").text("Serial Transfer");
        $("#transferCounter").show();
        setupCommon();
    });

    $(document).on("pagecreate", function () {
        parallelSetup();
        startClock();
    });

}