<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="EECircuitWeb2._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <ul data-role="listview">
        <li data-role="collapsible" data-inset="false" data-iconpos="right">
            <h2>Logic Simlators</h2>
            <ul data-role="listview" data-theme="b">
                <li><a href="/logic.aspx">Simple Logics</a></li>
                <li><a href="/counter.aspx">Counters</a></li>
                <li><a href="/sr.aspx">Shift Register</a></li>
                <li><a href="/seripara.aspx">Serial/Parallel</a></li>
            </ul>
        </li>
        <li><a href="/emu.aspx?cpm=" data-iconpos="right">CP/M</a></li>
        <li data-role="collapsible" data-inset="false" data-iconpos="right">
            <h2>Select CPUs</h2>
            <ul data-role="listview" data-theme="b">
                <li data-icon="check"><a href="#" id="selectOrg8080">org8080</a></li>
                <li><a href="#" id="selectFast8080">fast8080</a></li>
            </ul>
        </li>
        <li data-role="collapsible" data-inset="false" data-iconpos="right">
            <h2>Misc</h2>
            <ul data-role="listview" data-theme="b">
                <li><a href="#" id="warnbutton">CP/M (with disk initialize)</a></li>
                <li><a href="/emu.aspx">CPU Emulation</a></li>
                <li><a href="/emu.aspx?cpmdev=">[BIOS dev]</a></li>
            </ul>
        </li>
    </ul>
    <script src="/Scripts/Default.js">

    </script>
</asp:Content>
