/**
 * Created by zcy on 2017/12/25.
 */

app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/damage_index");
    $stateProvider
        .state("damage_index",{
            url:"/damage_index",
            templateUrl: "js/view/damage/damage_index.html",
            controller:'damage_index_controller'
        })
        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
        .state("car_wash_fee_management",{
            url:"/car_wash_fee_management",
            templateUrl: "js/view/finance/car_wash_fee_management.html",
            controller:'car_wash_fee_management_controller'
        })
        // 质损申报
        .state("damage_declaration",{
            url:"/damage_declaration",
            params: {"from": null},
            templateUrl: "js/view/damage/damage_declaration.html",
            controller:'damage_declaration_controller'
        })
        .state("damage_report",{
            url:"/damage_report",
            templateUrl: "js/view/damage/damage_report.html",
            controller:'damage_report_controller'
        })
        .state("damage_declaration_details",{
            url:"/damage_declaration_details/id/{id}/status/{status}/from/{from}",
            templateUrl: "js/view/damage/damage_declaration_details.html",
            controller:'damage_declaration_details_controller'
        })
        .state("damage_import",{
            url:"/damage_import",
            params: {"from": null},
            templateUrl: "js/view/damage/damage_import.html",
            controller:'damage_import_controller'
        })
        .state("car_payment",{
            url:"/car_payment",
            params: {"from": null},
            templateUrl: "js/view/damage/car_payment.html",
            controller:'car_payment_controller'
        })
        // 质损管理
        .state("damage_management",{
            url:"/damage_management",
            params: {"from": null},
            templateUrl: "js/view/damage/damage_management.html",
            controller:'damage_management_controller'
        })
        .state("damage_management_details",{
            url:"/damage_management_details/id/{id}/from/{from}",
            templateUrl: "js/view/damage/damage_management_details.html",
            controller:'damage_management_details_controller'
        })
        .state("car_detection_statistics", {
            url:"/car_detection_statistics",
            templateUrl: "js/view/damage/car_detection_statistics.html",
            controller:"car_detection_statistics_controller"
        })
        .state("car_wash_fee",{
            url:"/car_wash_fee",
            params: {"from": null},
            templateUrl: "js/view/damage/car_wash_fee.html",
            controller:'car_wash_fee_controller'
        })
        .state("car_wash_fee_details",{
            url:"/car_wash_fee_details/id/{id}/from/{from}",
            templateUrl: "js/view/damage/car_wash_fee_details.html",
            controller:'car_wash_fee_details_controller'
        })
        .state("re_damage_statistics", {
            url:"/re_damage_statistics",
            templateUrl: "js/view/damage/re_damage_statistics.html",
            controller:"re_damage_statistics_controller"
        })
        .state("insurance_compensation",{
            url:"/insurance_compensation",
            params: {"from": null},
            templateUrl: "js/view/truck/insurance_compensation.html",
            controller:'insurance_compensation_controller'
        })
        .state("add_damage_insurance_details",{
            url:"/add_damage_insurance_details/id/{id}/from/{from}",
            templateUrl: "js/view/truck/add_damage_insurance_details.html",
            controller:'add_damage_insurance_details_controller'
        })
        .state("driver_withhold",{
            url:"/driver_withhold",
            params: {"from": null},
            templateUrl: "js/view/damage/driver_withhold.html",
            controller:'driver_withhold_controller'
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
        .state("_look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/instruction_id/{instruction_id}/timeStart/{timeStart}/timeEnd/{timeEnd}/makeId/{makeId}/from/{from}?refer",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller: "look_instruction_list_details_controller"
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
        .state("fuel_record", {
            url: "/fuel_record",
            templateUrl: "js/view/data/fuel_record.html",
            controller:'fuel_record_controller'
        })
        // 数据统计
        .state("liability_compensation_statistics", {
            url:"/liability_compensation_statistics",
            templateUrl: "js/view/statistics/liability_compensation_statistics.html",
            controller:"liability_compensation_statistics_controller"
        })
        .state("vehicle_damage_statistics", {
            url:"/vehicle_damage_statistics",
            templateUrl: "js/view/statistics/vehicle_damage_statistics.html",
            controller:"vehicle_damage_statistics_controller"
        })
        .state("vehicle_repair_statistics", {
            url:"/vehicle_repair_statistics",
            templateUrl: "js/view/statistics/vehicle_repair_statistics.html",
            controller:"vehicle_repair_statistics_controller"
        })
        .state("car_wash_fee_statistics", {
            url:"/car_wash_fee_statistics",
            templateUrl: "js/view/statistics/car_wash_fee_statistics.html",
            controller:"car_wash_fee_statistics_controller"
        })
        .state("car_insurance_payment_statistics", {
            url:"/car_insurance_payment_statistics",
            templateUrl: "js/view/statistics/car_insurance_payment_statistics.html",
            controller:"car_insurance_payment_statistics_controller"
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
        .state("transport_planning_statistics", {
            url:"/transport_planning_statistics",
            templateUrl: "js/view/statistics/transport_planning_statistics.html",
            controller:"transport_planning_statistics_controller"
        })
}]);
