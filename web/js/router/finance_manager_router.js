/**
 * Created by zcy on 2018/3/13.
 */

app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/finance_index");
    $stateProvider
        .state("finance_index",{
            url:"/finance_index",
            templateUrl: "js/view/finance/finance_index.html",
            controller:'finance_index_controller'
        })

        // 用户信息
        .state("user_info",{
            url:"/user_info",
            templateUrl: "js/view/user/user_info.html",
            controller:'user_info_controller'
        })

        // 财务
        .state("truck_compensate_loan",{
            url:"/truck_compensate_loan",
            templateUrl: "js/view/finance/truck_compensate_loan.html",
            controller:'truck_compensate_loan_controller'
        })
        .state("truck_compensate_loan_details",{
            url:"/truck_compensate_loan_details/id/{id}/compensateId/{compensateId}",
            templateUrl: "js/view/finance/truck_compensate_loan_details.html",
            controller:'truck_compensate_loan_details_controller'
        })
        .state("car_payment_loan",{
            url:"/car_payment_loan",
            templateUrl: "js/view/finance/car_payment_loan.html",
            controller:'car_payment_loan_controller'
        })
        .state("car_payment_loan_details",{
            url:"/car_payment_loan_details/id/{id}/paymentId/{paymentId}",
            templateUrl: "js/view/finance/car_payment_loan_details.html",
            controller:'car_payment_loan_details_controller'
        })
        .state("commercial_vehicle_compensate_loan",{
            url:"/commercial_vehicle_compensate_loan",
            templateUrl: "js/view/finance/commercial_vehicle_compensate_loan.html",
            controller:'commercial_vehicle_compensate_loan_controller'
        })
        .state("commercial_vehicle_compensate_loan_details",{
            url:"/commercial_vehicle_compensate_loan_details/id/{id}/compensateId/{compensateId}",
            templateUrl: "js/view/finance/commercial_vehicle_compensate_loan_details.html",
            controller:'commercial_vehicle_compensate_loan_details_controller'
        })
        .state("car_wash_fee",{
            url:"/car_wash_fee",
            templateUrl: "js/view/damage/car_wash_fee.html",
            controller:'car_wash_fee_controller'
        })
        .state("car_wash_fee_details",{
            url:"/car_wash_fee_details/id/{id}",
            templateUrl: "js/view/damage/car_wash_fee_details.html",
            controller:'car_wash_fee_details_controller'
        })

        // 商品车信息
        .state("car_query",{
            url:"/car_query",
            templateUrl: "js/view/car/car_query/car_query.html",
            controller:'car_query_controller'
        })
        .state("car_query_details",{
            url:"/car_query_details/vin/{vin}/id/{id}",
            templateUrl: "js/view/car/car_query/car_query_details.html",
            controller:'car_query_details_controller'
        })

        // 数据统计
        .state("insurance_statistics", {
            url:"/insurance_statistics",
            templateUrl: "js/view/statistics/insurance_statistics.html",
            controller:"insurance_statistics_controller"
        })
        .state("liability_compensation_statistics", {
            url:"/liability_compensation_statistics",
            templateUrl: "js/view/statistics/liability_compensation_statistics.html",
            controller:"liability_compensation_statistics_controller"
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
        .state("accident_insurance_claims_statistics", {
            url:"/accident_insurance_claims_statistics",
            templateUrl: "js/view/statistics/accident_insurance_claims_statistics.html",
            controller:"accident_insurance_claims_statistics_controller"
        })
        .state("accident_statistics", {
            url:"/accident_statistics",
            templateUrl: "js/view/statistics/accident_statistics.html",
            controller:"accident_statistics_controller"
        })

        // 管理员设置
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller:'setting_user_controller'
        })
        .state("truck_insurance",{
            url:"/truck_insurance",
            templateUrl: "js/view/truck/truck_insurance.html",
            controller:'truck_insurance_controller'
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
        .state("setting_dealer",{
            url:"/setting_dealer",
            templateUrl: "js/view/system_settings/setting_dealer/setting_dealer.html",
            controller:'setting_dealer_controller'
        })
        .state("add_setting_dealer",{
            url:"/add_setting_dealer",
            templateUrl: "js/view/system_settings/setting_dealer/add_setting_dealer_details.html",
            controller:'add_setting_dealer_controller'
        })
        .state("setting_dealer_details",{
            url:"/setting_dealer_details/{dealer_id}",
            templateUrl: "js/view/system_settings/setting_dealer/setting_dealer_details.html",
            controller:'setting_dealer_details_controller'
        })
        .state("setting_repair",{
            url:"/setting_repair",
            templateUrl: "js/view/system_settings/setting_repair.html",
            controller:'setting_repair_controller'
        })

        // 数据字典
        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
}]);