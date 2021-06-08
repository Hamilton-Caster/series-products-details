<%@ Control language="vb" Inherits="AcuitiSolutions.Modules.CatalogGrid.CatalogGrid" CodeBehind="CatalogGrid.ascx.vb" AutoEventWireup="false" Explicit="True" %>

<script type="text/javascript">
    var baseName = '<%=HtmlHolder.ClientID %>';

</script>
<span id="HtmlHolder" class="Normal" runat="server"></span>

<div >
<table cellpadding="0" cellspacing="4" runat="server" id="tblCatalogGrid">
	<tr id="trGridPreText" runat="server" visible="false">
		<td>
			<asp:panel id="pnlPreText" runat="server" Width="100%"></asp:panel>
		</td>
	</tr>
	<tr id="trGridLegend" runat="server" visible="false">
		<td>
			<asp:panel id="pnlLegend" runat="server" Width="100%"></asp:panel>
		</td>
	</tr>
	
	<tr>
		<td align="center">
			<asp:panel id="pnlCatalogGrid" runat="server"></asp:panel>
		</td>
	</tr>
	<tr id="trGridPostText" runat="server" visible="false">
		<td>
			<asp:panel id="pnlPostText" runat="server"></asp:panel>
		</td>
	</tr>
</table>
    <div id="products">
    
    <asp:panel id="pnlRespCatalogGrid" runat="server" CssClass="tablesaw-overflow" style='width:99%; margin:0 auto;position:relative;'></asp:panel>
    </div>
</div>

<br/>
<asp:PlaceHolder runat="server" ID="CatalogGridJS"></asp:PlaceHolder>
<script type="text/javascript">
    // TABLE SORTING
    $('.filter').change(function () {
        var values = [];
        $('select.filter').each(function () {
            var colIdx = $(this).data('col');
            //console.log($(this).data('col'));
            $(this).find('option:selected').each(function () {
                if ($(this).val() != "-1") values.push({
                    text: $(this).text(),
                    colId: colIdx
                });
            });
        });
        // console.log("GOING IN HERE");
        filter('table.tablesaw:visible > tbody > tr', values);
    });

    function filter(selector, values) {//console.log(selector);
        //console.log(values.length);
        var rowValuesObj = [];
        $(selector).each(function () {
            var count = 0;
            var sel = $(this);
            //console.log(sel);
            if (values.length > 0) {
                var colID = values[0].colId;
                var value = values[0].text;
                var currentColVal = $(this).children(':nth-child(' + colID + 1 + ')').text();
                var test = currentColVal.replace('\u2044', '/');
                var regexp = '/^' + value + '$/';
                if (test == value) {
                    count += 1;
                }
                var show = false;
                show = (count > 0);
            }
            else {
                show = true;
            }

            show ? sel.show() : sel.hide();


        });
    };

    // TABLE SWAP SWIVEL TO RIGID
    $("#products input2").click(function () {
        $(".tablesaw").toggle(),
            $(".tablesaw-advance").toggle();
        $('.filter').val(-1);
        filter('table.tablesaw:visible > tbody > tr', []);
        //$('.filter').trigger("change");
        //$(".tablesaw-bar.tablesaw-mode-columntoggle:nth-of-type(3)").toggleClass("show");
    });
    $("#products .grid_banner").click(function () {
        //console.log($(this).text());
        $(".grid_banner").removeClass('active');
        var spanIndex = $(this).index();
        $(this).addClass('active');
        $('.filter').val(-1);
        filter('table.tablesaw:visible > tbody > tr', []);
        //console.log($(this).index());
        var nCounter = 0;
        $("table.tablesaw").each(function () {
            if (nCounter == spanIndex) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
            nCounter += 1;
        });
        //Go after the filters.
        var nFilterCounter = 0;
        $(".tablesaw-advance").each(function () {
            if (nFilterCounter == spanIndex) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
            nFilterCounter += 1;
        });

    });






    // TOOLTIPS
    $(window).load(function () {
        $('[data-toggle="tooltip"]').tooltip({
            html: true
        });
        //var tables = $(".tablesaw");
        $(".tablesaw-bar").appendTo(".GridHeader_Options");
        $("table.tablesaw").each(function () {
            var tablepopupID = this.id + "-popup";
            var showTable = this.style['display'];
            var toggleDiv = $("#" + tablepopupID).closest('.tablesaw-advance');
            if (showTable == "none") {
                toggleDiv.hide();
            }


        });
    });
</script>
<iframe runat="server" src='~\DesktopModules\CatalogGrid\View.html' style="WIDTH: 100%; HEIGHT: 100%"></iframe>