$(window).load(function () {
    $('.GridTable_Fixed').find('th:first').eq(0).each(function (i) {
        console.log($('.GridTable_Tabs').find('.Grid_HeaderNormal').outerHeight(true));
        $(this).eq(0).attr('style', $(this).eq(0).attr('style') + ' height: ' + $('.GridTable_Tabs').find('.Grid_HeaderNormal').outerHeight(true) + 'px !important;');
    });

});
$(document).ready(function () {
    $('#Grid_TabColumns').dnnTabs();
    var tabCount = $('#Grid_TabColumns >ul >li').size();
    switch (tabCount) {
        case (2):
            $('#Grid_TabColumns li').css('width', '44%');
            break;
        case (3):
            $('#Grid_TabColumns li').css('width', '30%');
            break;

    }
    //Remove the double border at the bottom of every grid tab table.
    $('.GridTable_Tabs').each(function (i) {
        //console.log($(this).children('tbody').children('tr:last'));
        $(this).children('tbody').children('tr:last').each(function (i, obj) {
            //console.log($(this));
            $(this).children('td').each(function (i) {
                $(this).css('border-bottom-color', '#fff');
            });
        });

    });
    $('.AcuitiGrids').each(function (i, obj) {
        //loop through each instance of the grids finding the grid tabs and grid fixed columns.
        var FixedColumnDiameters = $(this).find('.Grid_ColumnDiameter');
        $(this).find('.Grid_Tab').each(function (j) {
            var gridTab = $(this);
            $(this).find('.Grid_TabColumnHidden').each(function (k) {
                $(this).eq(0).attr('style', 'height: ' + FixedColumnDiameters.eq(k).outerHeight() + 'px !important; width: 0px !important;');
            });
        });
    });


    $('.popups a').wowwindow({
        draggable: true
    });
    $('.popups-rotate a').wowwindow({
        rotate: false,
        draggable: true
    });
    $('.popups-rotate-multiple a').wowwindow({
        rotate: true,
        rotations: 3,
        draggable: true
    });
    $('.WheelToolTip').each(function () { // Notice the .each() loop, discussed below
        $(this).qtip({
            content: {
                text: function () {
                    return $(this).next('div').clone(); // Use the "div" element next to this for the content
                }
            },
            style: {
                classes: 'qtip-light qtip-rounded',
                width: 220,
                height: 70
            }

        });
    });
    $('.Grid_Column3YrWarranty').each(function () { // Notice the .each() loop, discussed below
        //console.log($('.GridTable_Tabs').find('.div3YrWarrantyBox'));
        $(this).qtip({
            content: {
                text: function () {
                    return $('.GridTable_Tabs').find('.div3YrWarrantyBox').eq(0).clone(); // Use the "div" element next to this for the content
                }
            },
            style: {
                classes: 'qtip-light qtip-rounded',
                width: 200,
                height: 50
            }

        });
    });

});
