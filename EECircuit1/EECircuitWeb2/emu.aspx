<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="emu.aspx.cs" Inherits="EECircuitWeb2.emu" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">Serial</a></h1>
    </div>

    <div role="main" class="ui-content">
        <div id="mon">
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
                         <input name="memoryAddress" id="memoryAddress" type="text" value="" data-clear-btn="true">
                    </td>
                    <td><span id="memoryDump" class="fixed">XX XX</span></td>
                </tr>
            </table>
            <div data-role="controlgroup" data-type="horizontal">
                <a href="#" id="restart" data-role="button" data-theme="b">Restart</a>
                <a href="#" id="stopcont" data-role="button">Stop/Continue</a>
            </div>
        </div>

        <div id="con">
<!-- TBW -->


        </div>
    </div>

    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navcon">Console</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navmon">Monitor</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtest1">Load Test-1</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navreset">Reset System</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
    </div>
    <script src="/Scripts/emu.js"></script>
</asp:Content>
