<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="seripara.aspx.cs" Inherits="EECircuitWeb2.seripara" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">Serial</a></h1>
    </div>

    <div role="main" class="ui-content">
        <h2 id="simname">---</h2>

        <table>
            <tr>
                <td style="width:50%;">
                    Decimal(signed):
                </td>
                <td style="width:50%;" id="tsigned">
                    XX
                </td>
            </tr>
            <tr>
                <td style="width:50%;">
                    Clock:
                </td>
                <td style="width:50%;" id="clock">
                </td>
            </tr>
            <tr id="transferCounter">
                <td style="width:50%;">
                    Transfer Counter:
                </td>
                <td style="width:50%;" id="count">
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td>
                    Transmitter Side
                </td>
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
            <tr id="loadValueHolder">
                <td>
                    <a data-role="button" href="#" id="transfer" data-theme="b">Transfer</a>
                </td>
            </tr>
            <tr>
                <td>
                    [<span id="wire">
                    XXXXXXXX
                    </span>]
                </td>
            </tr>
            <tr>
                <td>
                    Receiver Side
                </td>
            </tr>
            <tr>
                <td class="mainText" id="rText">
                    XXXXXXXX
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <td style="width:50%;">
                    Decimal(signed):
                </td>
                <td style="width:50%;" id="rsigned">
                    XX
                </td>
            </tr>
        </table>
        <a data-role="button" href="#" id="navreset">Reset</a>
    </div>

    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navpara">Parallel Transfer</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navseri">Serial Transfer</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
        <a data-rel="close" class="anchor" href="/" data-role="button" >Home</a>
    </div>
    <script src="/Scripts/seripara.js"></script>
</asp:Content>
