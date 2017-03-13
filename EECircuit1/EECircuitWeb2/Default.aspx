<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="EECircuitWeb2._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <ul data-role="listview" data-inset="true">
        <li><a href="/logic.aspx">Simple Logics</a></li>
        <li><a href="/emu.aspx">CPU Emulation</a></li>
    </ul>
</asp:Content>
