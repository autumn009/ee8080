<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="logic.aspx.cs" Inherits="EECircuitWeb2.logic" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <div id="header" data-role="header">
        <a href="#menu-left" data-role="button" data-icon="bars" data-iconpos="notext">&nbsp;</a>
        <h1><a href="#menu-left" id="logicname">AND</a></h1>
    </div>
    <div role="main" class="ui-content">
        <h2 id="simname">---</h2>
        <table>
            <tr>
                <td>
                    <fieldset data-role="controlgroup">
                        <input name="checka" id="checka" type="checkbox" />
                        <label for="checka">A</label>
                        <input name="checkb" id="checkb" type="checkbox" />
                        <label for="checkb">B</label>
                    </fieldset>
                </td>
                <td>
                    <img id="logicicon" />
                </td>
                <td>
                    <input name="checkr" id="checkr" type="checkbox" disabled="disabled" />
                    <label for="checkr">R</label>
                </td>
            </tr>
        </table>
        <h2 id="tablename">---</h2>
        <div id="tableroot"></div>
    </div>
    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navand">AND</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navor">OR</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navnot">NOT</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navand4">AND(4Input)</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>
    </div>
    <script src="/Scripts/logic.js"></script>
</asp:Content>
