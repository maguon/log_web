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
        // 质损申报
        .state("damage_declaration",{
            url:"/damage_declaration",
            templateUrl: "js/view/damage/damage_declaration.html",
            controller:'damage_declaration_controller'
        })
        .state("damage_report",{
            url:"/damage_report",
            templateUrl: "js/view/damage/damage_report.html",
            controller:'damage_report_controller'
        })
        .state("damage_declaration_details",{
            url:"/damage_declaration_details/id/{id}/status/{status}",
            templateUrl: "js/view/damage/damage_declaration_details.html",
            controller:'damage_declaration_details_controller'
        })
        // 质损管理
        .state("damage_management",{
            url:"/damage_management",
            templateUrl: "js/view/damage/damage_management.html",
            controller:'damage_management_controller'
        })
        .state("damage_management_details",{
            url:"/damage_management_details/id/{id}",
            templateUrl: "js/view/damage/damage_management_details.html",
            controller:'damage_management_details_controller'
        })
        .state("insurance_compensation",{
            url:"/insurance_compensation",
            templateUrl: "js/view/damage/insurance_compensation.html",
            controller:'insurance_compensation_controller'
        })
        .state("car_wash_fee",{
            url:"/car_wash_fee",
            templateUrl: "js/view/damage/car_wash_fee.html",
            controller:'car_wash_fee_controller'
        })
        .state("car_wash_fee_details",{
            url:"/car_wash_fee_details",
            templateUrl: "js/view/damage/car_wash_fee_details.html",
            controller:'car_wash_fee_details_controller'
        })
        .state("add_damage_insurance",{
            url:"/add_damage_insurance",
            templateUrl: "js/view/damage/add_damage_insurance.html",
            controller:'add_damage_insurance_controller'
        })
        .state("add_damage_insurance_details",{
            url:"/add_damage_insurance_details",
            templateUrl: "js/view/damage/add_damage_insurance_details.html",
            controller:'add_damage_insurance_details_controller'
        })

        // 数据统计
        .state("liability_compensation_statistics", {
            url:"/liability_compensation_statistics",
            templateUrl: "js/view/storage/liability_compensation_statistics.html",
            controller:"liability_compensation_statistics_controller"
        })
        .state("vehicle_damage_statistics", {
            url:"/vehicle_damage_statistics",
            templateUrl: "js/view/storage/vehicle_damage_statistics.html",
            controller:"vehicle_damage_statistics_controller"
        })
        .state("vehicle_repair_statistics", {
            url:"/vehicle_repair_statistics",
            templateUrl: "js/view/storage/vehicle_repair_statistics.html",
            controller:"vehicle_repair_statistics_controller"
        })
        .state("car_wash_fee_statistics", {
            url:"/car_wash_fee_statistics",
            templateUrl: "js/view/storage/car_wash_fee_statistics.html",
            controller:"car_wash_fee_statistics_controller"
        })
        .state("car_insurance_payment_statistics", {
            url:"/car_insurance_payment_statistics",
            templateUrl: "js/view/storage/car_insurance_payment_statistics.html",
            controller:"car_insurance_payment_statistics_controller"
        })

}]);