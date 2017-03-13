<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="~/Site.Master" CodeBehind="logic.aspx.cs" Inherits="EECircuitWeb2.logic" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

<!DOCTYPE html>

            <select name="typeSelector" id="typeSelector" onchange="typeSelector_Changed()">
                <option value="">(種類)</option>
            </select>

            <table>
                <tr>
                    <td>AND</td>
                    <td>
                        <table>
                            <tr>
                                <th></th>
                                <th>0</th>
                                <th>1</th>
                            </tr>
                            <tr>
                                <th>0</th>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th>1</th>
                                <td>0</td>
                                <td>1</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <fieldset data-role="controlgroup">
                            <input name="checka" id="checka" type="checkbox" />
                            <label for="checka">A</label>
                            <input name="checkb" id="checkb" type="checkbox" />
                            <label for="checkb">B</label>
                        </fieldset>
                    </td>
                    <td>
                        <img src="/Content/images/gate/128px-IEC_NAND_svg.png" />
                    </td>
                    <td>
                        <input name="checkr" id="checkr" type="checkbox" disabled="disabled" />
                        <label for="checkr">R</label>
                    </td>
                </tr>
            </table>
            <script src="/Scripts/logic.js"></script>
</asp:Content>
