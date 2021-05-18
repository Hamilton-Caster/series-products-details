<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Settings.ascx.cs" Inherits="AcuitiSolutions.Modules.ProductConfigurator.Settings" %>
<%@ Register TagName="label" TagPrefix="dnn" Src="~/controls/labelcontrol.ascx" %>

	<h2 id="dnnSitePanel-BasicSettings" class="dnnFormSectionHead"><a href="#" class="dnnSectionExpanded"><%=LocalizeString("BasicSettings")%></a></h2>
	<fieldset>
        <div class="dnnFormItem">
            <dnn:Label ID="lblModuleUsage" runat="server" /> 
            <asp:RadioButtonList runat="server" ID="rbModuleUsage">
                <asp:ListItem Text="Results Page" Value="ProductConfigurator_ResultsView"/>
                <asp:ListItem Text="Modal Dialog" Value="ProductConfigurator_ModalView" />
            </asp:RadioButtonList>
        </div>

        <div class="dnnFormItem">
            <dnn:label id="lblPartDetailsPage" runat="server" controlname="ddlPartDetailsLink" suffix=":"></dnn:label>
 
            <asp:DropDownList ID="ddlPartDetailsPage" runat="server" />
        </div>
       
    </fieldset>


