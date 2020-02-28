app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/data_dictionary");
    $stateProvider
        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller:'setting_user_controller'
        })

        // 商品车信息
        .state("car_query",{
            url:"/car_query",
            params: {"from": null},
            templateUrl: "js/view/car/car_query/car_query.html",
            controller:'car_query_controller'
        })
        .state("car_query_details",{
            url:"/car_query_details/vin/{vin}/id/{id}/from/{from}",
            templateUrl: "js/view/car/car_query/car_query_details.html",
            controller:'car_query_details_controller'
        })
        .state("instruction_list", {
            url: "/instruction_list",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_list.html",
            controller:"instruction_list_controller"
        })
        .state("look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller:"look_instruction_list_details_controller"
        })
        .state("driver_information",{
            url:"/driver_information",
            params: {"from": null},
            templateUrl: "js/view/truck/driver_information.html",
            controller:'driver_information_controller'
        })
        .state("driver_information_details",{
            url:"/driver_information_details/driverId/{driverId}/from/{from}",
            templateUrl: "js/view/truck/driver_information_details.html",
            controller:'driver_information_details_controller'
        })
        .state("dealer_map",{
        url:"/dealer_map",
        templateUrl: "js/view/system_settings/dealer_map.html",
        controller:'dealer_map_controller'
        })
        .state("fuel_record", {
            url: "/fuel_record",
            templateUrl: "js/view/data/fuel_record.html",
            controller:'fuel_record_controller'
        })

        .state("entrust_setting",{
            url:"/entrust_setting",
            templateUrl: "js/view/system_settings/setting_client/entrust_setting.html",
            controller:'entrust_setting_controller'
        })
        .state("entrust_setting_detail",{
            url:"/entrust_setting_detail/id/{id}",
            templateUrl: "js/view/system_settings/setting_client/entrust_setting_detail.html",
            controller:'entrust_setting_detail_controller'
        })
        .state("setting_settlement_outsourcing",{
            url:"/setting_settlement_outsourcing",
            templateUrl: "js/view/system_settings/setting_settlement_outsourcing.html",
            controller:'setting_settlement_outsourcing_controller'
        })

        .state("setting_settlement_outsourcing_detail",{
            url:"/setting_settlement_outsourcing_detail/id/{id}/from/{from}",
            templateUrl: "js/view/system_settings/setting_settlement_outsourcing_detail.html",
            controller:'setting_settlement_outsourcing_detail_controller'
        })
        .state("setting_client",{
            url:"/setting_client",
            templateUrl: "js/view/system_settings/setting_client/setting_client.html",
            controller:'setting_client_controller'
        })
        .state("add_setting_client",{
            url:"/add_setting_client",
            templateUrl: "js/view/system_settings/setting_client/add_setting_client.html",
            controller:'setting_add_client_controller'
        })
        .state("setting_client_details",{
            url:"/setting_client_details/id/{id}",
            templateUrl: "js/view/system_settings/setting_client/setting_client_details.html",
            controller:'setting_client_details_controller'
        })
}]);