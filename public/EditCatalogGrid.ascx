<%@ Register TagPrefix="dnn" TagName="URL" Src="~/controls/URLControl.ascx" %>
<%@ Register TagPrefix="dnn" TagName="Label" Src="~/controls/LabelControl.ascx" %>
<%@ Control language="vb" CodeBehind="EditCatalogGrid.ascx.vb" AutoEventWireup="false" Inherits="AcuitiSolutions.Modules.CatalogGrid.EditCatalogGrid" %>

<table cellSpacing="0" cellPadding="5" width="550" align="left" border="0">
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plCommodity" controlname="drpCommodity" runat="server" text="Commodity Code:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:dropdownlist id="drpCommodity" runat="server">
				<asp:ListItem Value="">Please Select</asp:ListItem>
			</asp:dropdownlist>
		</td>
	</tr>
    <tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plShowWheelTypes" controlname="chkShowWheelTypes" runat="server" text="Show Wheel Types"></dnn:label>
		</td>
		<td class="NormalBold" valign="top" nowrap>
			<asp:checkbox id="chkShowWheelTypes" runat="server"></asp:checkbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plPreText" controlname="txtPreText" runat="server" text="Text to Show Before Grid:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:textbox id="txtPreText" runat="server" MaxLength="400" Width="400"></asp:textbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plPostText" controlname="txtPostText" runat="server" text="Text to Show After Grid:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:textbox id="txtPostText" runat="server" MaxLength="400" Width="400"></asp:textbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plNoPronto" controlname="chkNoPronto" runat="server" text="No Pronto Header:"></dnn:label>
		</td>
		<td class="NormalBold" valign="top" nowrap>
			<asp:checkbox id="chkNoPronto" runat="server"></asp:checkbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plNoThreeYear" controlname="chkNoThreeYear" runat="server" text="No Three Year Warranty Header:"></dnn:label>
		</td>
		<td class="NormalBold" valign="top" nowrap>
			<asp:checkbox id="chkNoThreeYear" runat="server"></asp:checkbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plPrinterFriendly" controlname="urlPrinterFriendly" runat="server" text="Printer Friendly Version Link:"></dnn:label>
		</td>
		<td class="NormalBold" valign="top" nowrap>
			No Printer Friendly Version:
			<asp:checkbox id="chkNoPrinterFriendly" runat="server" AutoPostBack="True" OnCheckedChanged="togglePrinterFriendlyVisibility"></asp:checkbox>
			<dnn:url id="urlPrinterFriendly" runat="server" showlog="False" showtrack="False" showtabs="False"
				urltype="F"></dnn:url>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plHeading" controlname="txtGridHeading" runat="server" text="Grid Heading:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:textbox id="txtHeading" runat="server" MaxLength="200" Width="200"></asp:textbox>
		</td>
	</tr>
    <tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="pl3YearWarranty" controlname="txtThreeYearWarrantyToolTip" runat="server" text="3 Year Warranty Tooltip:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:textbox id="txtThreeYearWarrantyToolTip" runat="server" MaxLength="200" Width="200"></asp:textbox>
		</td>
	</tr>
	<tr>
		<td width="250" class="SubHead" valign="top" nowrap>
			<dnn:label id="plDetailLink" controlname="drpDetailLink" runat="server" text="Part Detail Page Link:"></dnn:label>
		</td>
		<td valign="top" nowrap>
			<asp:dropdownlist id="drpDetailLink" runat="server">
				<asp:ListItem Value="">Please Select</asp:ListItem>
			</asp:dropdownlist>
		</td>
	</tr>
	<tr>
		<td colSpan="2">
			<br>
			<asp:linkbutton id="cmdUpdate" CausesValidation="False" BorderStyle="none" Text="Update" Cssclass="CommandButton"
				runat="server"></asp:linkbutton>&nbsp;
			<asp:linkbutton id="cmdCancel" CausesValidation="False" BorderStyle="none" Text="Cancel" runat="server"
				CssClass="CommandButton"></asp:linkbutton>
		</td>
	</tr>
</table>
