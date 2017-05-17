<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="EECircuitWeb2._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <ul data-role="listview" id="toplistview">
        <li data-role="collapsible" data-inset="false" data-iconpos="right">
            <h2>Logic Simlators</h2>
            <ul data-role="listview" data-theme="b">
                <li><a href="/logic.aspx">Simple Logics</a></li>
                <li><a href="/counter.aspx">Counters</a></li>
                <li><a href="/sr.aspx">Shift Register</a></li>
                <li><a href="/seripara.aspx">Serial/Parallel</a></li>
            </ul>
        </li>
        <li><a id="cpm" href="#" data-iconpos="right">CP/M</a></li>
        <li data-role="collapsible" data-corners="false" data-shadow="false" data-iconpos="right">
            <h2>CPU</h2>
            <fieldset data-role="controlgroup" data-type="horizontal">
                <legend>CPU Emulators:</legend>
                <input id="selectOrg8080" name="selectCPU" type="radio" checked="checked" value="Fast8080" />
                <label for="selectOrg8080">i8080(fast)</label>
                <input id="selectEdu8080" name="selectCPU" type="radio" value="Edu8080" />
                <label for="selectEdu8080">i8080(educational)</label>
                <input id="selectFast8080" name="selectCPU" type="radio" value="Org8080" />
                <label for="selectFast8080">i8080(original)</label>
            </fieldset>
        </li>
        <li data-role="collapsible" data-inset="false" data-iconpos="right">
            <h2>Misc</h2>
            <ul data-role="listview" data-theme="b">
                <li><a href="#" id="warnbutton">CP/M (with disk initialize)</a></li>
                <li><a href="#" id="cpuemu">CPU Emulation</a></li>
                <li><a href="#" id="cpmdev">BIOS development</a></li>
            </ul>
        </li>
    </ul>
    <script src="/Scripts/Default.js">
    </script>
</asp:Content>
