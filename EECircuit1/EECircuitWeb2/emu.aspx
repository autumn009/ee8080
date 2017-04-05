<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="emu.aspx.cs" Inherits="EECircuitWeb2.emu" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">Serial</a></h1>
    </div>

    <div role="main" class="ui-content">
        <div id="mon" class="mypane">
            <p class="stop" id="runStopStatus" >STOP</p>
            <table>
                <tr>
                    <th >A</th>
                    <th >BC</th>
                    <th >DE</th>
                    <th >HL</th>
                    <th >M</th>
                    <th >SP</th>
                    <th >PC</th>
                    <th >S</th>
                    <th >Z</th>
                    <th >P</th>
                    <th >C</th>
                    <th >AC</th>
                </tr>
                <tr>
                    <td  class="border"><span id="regA" class="fixed">XX</span></td>
                    <td  class="border"><span id="regBC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regDE" class="fixed">XX</span></td>
                    <td  class="border"><span id="regHL" class="fixed">XX</span></td>
                    <td  class="border"><span id="regM" class="fixed">XX</span></td>
                    <td  class="border"><span id="regSP" class="fixed">XX</span></td>
                    <td  class="border"><span id="regPC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regS" class="fixed">XX</span></td>
                    <td  class="border"><span id="regZ" class="fixed">XX</span></td>
                    <td  class="border"><span id="regP" class="fixed">XX</span></td>
                    <td  class="border"><span id="regC" class="fixed">XX</span></td>
                    <td  class="border"><span id="regAC" class="fixed">XX</span></td>
                </tr>
            </table>
            <table>
                <tr>
                    <td>
                         <label for="memoryAddress">MEMORY:</label>
                    </td>
                    <td>
                         <input name="memoryAddress" id="memoryAddress" type="text" value="0000" data-clear-btn="true">
                    </td>
                    <td><span id="memoryDump" class="fixed"></span></td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Input Port 0FFH</th>
                </tr>
                <tr>
                    <td>
                        <fieldset data-role="controlgroup" data-type="horizontal" id="setpara">
                            <input name="bit7" id="bit7" type="checkbox" class="bit">
                            <label for="bit7">7</label>
                            <input name="bit6" id="bit6" type="checkbox" class="bit">
                            <label for="bit6">6</label>
                            <input name="bit5" id="bit5" type="checkbox" class="bit">
                            <label for="bit5">5</label>
                            <input name="bit4" id="bit4" type="checkbox" class="bit">
                            <label for="bit4">4</label>
                            <input name="bit3" id="bit3" type="checkbox" class="bit">
                            <label for="bit3">3</label>
                            <input name="bit2" id="bit2" type="checkbox" class="bit">
                            <label for="bit2">2</label>
                            <input name="bit1" id="bit1" type="checkbox" class="bit">
                            <label for="bit1">1</label>
                            <input name="bit0" id="bit0" type="checkbox" class="bit">
                            <label for="bit0">0</label>
                        </fieldset>
                    </td>
                </tr>
                <tr>
                    <th>output Port 0FFH</th>
                </tr>
                <tr>
                    <td class="mainText" id="outPortFF">○○○○○○○○</td>
                </tr>
            </table>
            <div data-role="controlgroup" data-type="horizontal">
                <a href="#" id="restart" data-role="button" data-theme="b">Restart</a>
                <a href="#" id="restartbreak" data-role="button" >Restart and break</a>
                <a href="#" id="step" data-role="button">Step Run</a>
                <a href="#" id="stopcont" data-role="button">Stop/Continue</a>
            </div>
        </div>

        <div id="con" class="mypane">
<!-- TBW -->


        </div>
        <div id="ide" class="mypane">
            <div data-role="collapsible" data-mini="true" id="collapsibleIdeCommands">
                <h4>Commands</h4>
                <ul data-role="listview">
                    <li><a href="#" class="ideCommands" id="ideCompile">Compile</a></li>
                    <li><a href="#" class="ideCommands" id="ideCompileAndRun">Compile and Run</a></li>
                    <li><a href="#" class="ideCommands">New File</a></li>
                    <li><a href="#" class="ideCommands">Load File</a></li>
                    <li><a href="#" class="ideCommands">Save File</a></li>
                    <li><a href="#" class="ideCommands">Save As File</a></li>
                    <li><a href="#" class="ideCommands">Cut</a></li>
                    <li><a href="#" class="ideCommands">Copy</a></li>
                    <li><a href="#" class="ideCommands">Paste</a></li>
                </ul>
            </div>
            <label for="result">Compiler Results:</label>
            <textarea name="result" id="result" readonly="readonly"></textarea>
            <label for="sourceCode">Source Code:</label>
            <textarea name="sourceCode" id="sourceCode" data-autogrow="false" style="margin: 0px 0px 0px 0px"></textarea>
        </div>
    </div>

    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navcon">Console</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navmon">Monitor</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navide">Ide</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtest1">Load Test-1</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtest2">Load Test-2</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navreset">Reset System</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
    </div>
    <script src="/Scripts/emu.js"></script>
    <script src="/Scripts/miniAssembler.js"></script>
</asp:Content>
