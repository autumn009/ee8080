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
                <td id="inputCheckHolderTd">
                </td>
                <td>
                    <img id="logicicon" />
                </td>
                <td id="outputCheckHolderTd">
                </td>
            </tr>
        </table>
        <h2 id="tablename">---</h2>
        <div id="tableroot"></div>
        <div id="dfftable" style="display:none;">
            <table>
                <tbody>
                    <tr>
                        <th class="borderh">INPUT</th>
                        <th class="borderh">OUTPUT</th>
                    </tr>
                    <tr>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <th class="borderh">D</th>
                                        <th class="borderh">C</th>
                                    </tr>
                                    <tr class="trall tr0">
                                        <td class="border zero">0</td>
                                        <td class="border zero">↑</td>
                                    </tr>
                                    <tr class="trall tr1">
                                        <td class="border one">1</td>
                                        <td class="border zero">↑</td>
                                    </tr>
                                    <tr class="trall tr2 tr3">
                                        <td class="border ex">X</td>
                                        <td class="border one">↓</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td>
                            <table>
                                <tbody>
                                    <tr>
                                        <th class="borderh result">Q Next</th>
                                    </tr>
                                    <tr class="trall tr0 active">
                                        <td class="border result zero">0</td>
                                    </tr>
                                    <tr class="trall tr1">
                                        <td class="border result one">1</td>
                                    </tr>
                                    <tr class="trall tr2 tr3">
                                        <td class="border result highz">Q</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div id="tfftable" style="display:none;">
        <table>
            <tbody>
                <tr>
                    <th class="borderh">INPUT</th>
                    <th class="borderh">OUTPUT</th>
                </tr>
                <tr>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="borderh">T</th>
                                    <th class="borderh">Q</th>
                                </tr>
                                <tr class="trall tr0">
                                    <td class="border thick zero">0</td>
                                    <td class="border thick zero">0</td>
                                </tr>
                                <tr class="trall tr0">
                                    <td class="border thick zero">0</td>
                                    <td class="border thick one">1</td>
                                </tr>
                                <tr class="trall tr1">
                                    <td class="border thick one">1</td>
                                    <td class="border thick zero">0</td>
                                </tr>
                                <tr class="trall tr1">
                                    <td class="border thick one">1</td>
                                    <td class="border thick one">1</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <th class="borderh result">Q Next</th>
                                </tr>
                                <tr class="trall tr0">
                                    <td class="border thick result zero">0</td>
                                </tr>
                                <tr class="trall tr0">
                                    <td class="border thick result one">1</td>
                                </tr>
                                <tr class="trall tr1">
                                    <td class="border thick result one">1</td>
                                </tr>
                                <tr class="trall tr1">
                                    <td class="border thick result zero">0</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div data-role="panel" id="menu-left" data-theme="b" data-display="push" data-position="left">
        <ul data-role="listview">
            <li><a data-rel="close" class="anchor" href="#" id="navnot">NOT</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navand">AND</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navor">OR</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navxor">XOR</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navnand">NAND</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navnor">NOR</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navand4">AND(4Input)</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navadd">ADD with Carry</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="nav2comp">2's complement(3digit)</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navsel">SELECTOR(like 74153)</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navdec">DECODER(like 74138)</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navoc">OPEN CORRECTOR NOT</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navbuf">3 STATE(like LS244)</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navrsff">RS FLIPFLOP</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navjkff">JK FLIPFLOP</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navdff">D FLIPFLOP</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navtff">T FLIPFLOP</a></li>
            <li><a data-rel="close" class="anchor" href="#" id="navlatch">D LATCH</a></li>
        </ul>
        <p class="close-btn"><a href="#" data-rel="close" data-role="button" data-theme="c" data-icon="delete">Close</a></p>

    </div>
    <script src="/Scripts/logic.js"></script>
</asp:Content>
