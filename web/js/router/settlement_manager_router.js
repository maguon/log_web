
app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/settlement_index");
    $stateProvider
        .state("settlement_index",{
            url:"/settlement_index",
            templateUrl: "js/view/settlement/settlement_index.html",
            controller:'settlement_index_controller'
        })
        // 用户信息
        .state("user_info",{
            url:"/user_info",
            templateUrl: "js/view/user/user_info.html",
            controller:'user_info_controller'
        })
        .state("car_wash_fee_management",{
            url:"/car_wash_fee_management",
            templateUrl: "js/view/finance/car_wash_fee_management.html",
            controller:'car_wash_fee_management_controller'
        })
        // 公共數據
        .state("dealer_map",{
            url:"/dealer_map",
            templateUrl: "js/view/system_settings/dealer_map.html",
            controller:'dealer_map_controller'
        })
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
        .state("_look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/instruction_id/{instruction_id}/timeStart/{timeStart}/timeEnd/{timeEnd}/makeId/{makeId}/from/{from}?refer",
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
      /*  .state("car_statistics",{
            url:"/car_statistics",
            templateUrl: "js/view/car/car_statistics.html",
            controller:'car_statistics_controller'
        })
*/
       //数据统计
        .state("settlement_statistics", {
            url:"/settlement_statistics",
            templateUrl: "js/view/statistics/settlement_statistics.html",
            controller:"settlement_statistics_controller"
        })
        .state("transport_planning_statistics", {
            url:"/transport_planning_statistics",
            templateUrl: "js/view/statistics/transport_planning_statistics.html",
            controller:"transport_planning_statistics_controller"
        })
        // 结算管理
        .state("settlement_management",{
            url:"/settlement_management",
            params: {"from": null},
            templateUrl: "js/view/settlement/settlement_management.html",
            controller:'settlement_management_controller'
        })
        .state("instruction_driver_mileage", {
            url: "/instruction_driver_mileage",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_driver_mileage.html",
            controller:"instruction_driver_mileage_controller"
        })
        .state("instruction_drive_details", {
            url: "/instruction_drive_details/id/{id}/timeStart/{timeStart}/timeEnd/{timeEnd}/makeId/{makeId}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_drive_details.html",
            controller:"instruction_drive_details_controller"
        })
        .state("driver_settlement",{
            url:"/driver_settlement",
            templateUrl: "js/view/settlement/driver_settlement.html",
            controller:'driver_settlement_controller'
        })
        // 结算管理详情
        .state("settlement_management_detail",{
            url:"/settlement_management_detail/id/{id}/from/{from}",
            templateUrl: "js/view/settlement/settlement_management_detail.html",
            controller:'settlement_management_detail_controller'
        })
        .state("not_handover",{
            url:"/not_handover",
            templateUrl: "js/view/settlement/not_handover.html",
            controller:'not_handover_controller'
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
        .state("setting_settlement",{
            url:"/setting_settlement",
            templateUrl: "js/view/system_settings/setting_settlement.html",
            controller:'setting_settlement_controller'
        })
        .state("settlement_car",{
            url:"/settlement_car",
            templateUrl: "js/view/settlement/settlement_car.html",
            controller:'settlement_car_controller'
        })
        .state("car_settlement",{
            url:"/car_settlement",
            templateUrl: "js/view/settlement/car_settlement.html",
            controller:'car_settlement_controller'
        })
        //管理员设置
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller:'setting_user_controller'
        })
        .state("setting_city",{
            url:"/setting_city",
            templateUrl: "js/view/system_settings/setting_city.html",
            controller:'setting_city_controller'
        })
        .state("setting_line",{
            url:"/setting_line",
            templateUrl: "js/view/system_settings/setting_line.html",
            controller:'setting_line_controller'
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
        .state("add_setting_dealer",{
            url:"/add_setting_dealer",
            templateUrl: "js/view/system_settings/setting_dealer/add_setting_dealer_details.html",
            controller:'add_setting_dealer_controller'
        })
        .state("setting_dealer",{
            url:"/setting_dealer",
            params: {"from": null},
            templateUrl: "js/view/system_settings/setting_dealer/setting_dealer.html",
            controller:'setting_dealer_controller'
        })
        .state("setting_dealer_details",{
            url:"/setting_dealer_details/{dealer_id}?from",
            templateUrl: "js/view/system_settings/setting_dealer/setting_dealer_details.html",
            controller:'setting_dealer_details_controller'
        })
        .state("setting_shipments",{
            url:"/setting_shipments",
            templateUrl: "js/view/system_settings/setting_shipments/setting_shipments.html",
            controller:'setting_shipments_controller'
        })
        .state("add_setting_shipments",{
            url:"/add_setting_shipments",
            templateUrl: "js/view/system_settings/setting_shipments/add_setting_shipments.html",
            controller:'add_setting_shipments_controller'
        })
        .state("setting_shipments_details",{
            url:"/setting_shipments_details/{shipments_id}",
            templateUrl: "js/view/system_settings/setting_shipments/setting_shipments_details.html",
            controller:'setting_shipments_details_controller'
        })

}]);
