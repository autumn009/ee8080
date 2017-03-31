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
                    <td>
                         <label for="memoryAddress">MEMORY:</label>
                    </td>
                    <td class="fixed">
                         <input name="memoryAddress" id="memoryAddress" type="text" value="" data-clear-btn="true">
                    </td>
                    <td id="memoryDump" class="fixed">XX XX</td>
                </tr>
            </table>

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
