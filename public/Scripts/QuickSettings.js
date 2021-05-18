var ProductConfiguratorSettings = ProductConfiguratorSettings || {};

ProductConfigurator.services = {}; // we need a service reference for each module

jQuery(function ($) {
    ProductConfiguratorSettings.service.framework = $.ServicesFramework(10329); // TODO
    ProductConfiguratorSettings.service.baseUrl = ProductConfiguratorSettings.service.framework.getServiceRoot(ProductConfiguratorSettings.service.path) + "Settings/";
});

ProductConfiguratorSettings.InitApp = function (moduleid) {
    var svc = {
        moduleid: moduleid,
        path: "AcuitiSolutions/ProductConfigurator",
        framework: $.ServicesFramework(moduleid)
    };
    svc.baseUrl = svc.framework.getServiceRoot(svc.path) + "Item/";

    ProductConfiguratorSettings.services['svc-${moduleid}'] = svc;

    new Vue({
        // el: '#settings-${moduleid}',
        el: '#settings-' + moduleid',
        computed: {
    },
        data: {
        message: "From Vue"
    },
        methods: {
    },
        mounted: function () {
        }
    });
}
