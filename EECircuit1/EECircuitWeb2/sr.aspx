<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="sr.aspx.cs" Inherits="EECircuitWeb2.sr" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">AND</a></h1>
    </div>

    <div role="main" class="ui-content">
        <h2 id="simname">---</h2>

        <table>
            <tr>
                <td style="width:50%;">
                    Decimal(signed):
                </td>
                <td style="width:50%;" id="signed">
                    XX
                </td>
            </tr>
            <tr>
                <td style="width:50%;">
                    Decimal(unsigned):
                </td>
                <td style="width:50%;" id="unsigned">
                    XX
                </td>
            </tr>
            <tr>
                <td style="width:50%;">
                    Hexadecimal:
                </td>
                <td style="width:50%;" id="hexa">
                    XX
                </td>
            </tr>
            <tr>
                <td>
                    Binary:
                </td>
                <td style="width:50%;" id="binary">
                    XXXXXXXX
                </td>
            </tr>
            <tr>
                <td>
                    Mode:
                </td>
                <td style="width:50%;" id="mode">
                    XXXXXXXX
                </td>
            </tr>
            <tr>
                <td>
                    S-Output (Carry):
                </td>
                <td style="width:50%;" id="sout">
                    X
                </td>
            </tr>
        </table>
        <table>
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
                    <input name="sin" id="sin" type="checkbox" class="bit" style="display:none;">
                    <label for="sin" id="sinlabel" style="display:none;">S-Input</label>
                </td>
            </tr>
            <tr id="loadValueHolder">
                <td>
                    <a data-role="button" href="#" id="loadValue" data-theme="b">↓Load Value↓</a>
                </td>
            </tr>
            <tr>
                <td class="mainText" id="shifts">
                    XXXXXXXX
                </td>
            </tr>
            <tr>
                <td>
                    <div data-role="controlgroup" data-type="horizontal">
                        <a data-role="button" href="#" id="navleft" data-theme="b">←</a>
                        <a data-role="button" href="#" id="navright" data-theme="b">→</a>
                        <input name="rot" id="rot" type="checkbox">
                        <label for="rot">Rotate</label>
                        <input name="withC" id="withC" type="checkbox">
                        <label for="withC">w/ C</label>
                        <a data-role="button" href="#" id="navreset">Reset</a>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navseri">Serial In</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navpara">parallel In</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
    </div>
    <script src="/Scripts/sr.js"></script>
</asp:Content>
