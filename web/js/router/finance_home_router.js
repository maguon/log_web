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
        .state("route_fee",{
            url:"/route_fee",
            params: {"from": null},
            templateUrl: "js/view/finance/route_fee.html",
            controller:'route_fee_controller'
        })
        // 财务
      /*  .state("truck_compensate_loan",{
            url:"/truck_compensate_loan",
            params: {"from": null},
            templateUrl: "js/view/finance/truck_compensate_loan.html",
            controller:'truck_compensate_loan_controller'
        })
        .state("truck_compensate_loan_details",{
            url:"/truck_compensate_loan_details/id/{id}/compensateId/{compensateId}/from/{from}",
            templateUrl: "js/view/finance/truck_compensate_loan_details.html",
            controller:'truck_compensate_loan_details_controller'
        })*/
        .state("car_payment_loan",{
            url:"/car_payment_loan",
            params: {"from": null},
            templateUrl: "js/view/finance/car_payment_loan.html",
            controller:'car_payment_loan_controller'
        })
        .state("car_payment_loan_details",{
            url:"/car_payment_loan_details/id/{id}/paymentId/{paymentId}/from/{from}",
            templateUrl: "js/view/finance/car_payment_loan_details.html",
            controller:'car_payment_loan_details_controller'
        })
      /*  .state("commercial_vehicle_compensate_loan",{
            url:"/commercial_vehicle_compensate_loan",
            params: {"from": null},
            templateUrl: "js/view/finance/commercial_vehicle_compensate_loan.html",
            controller:'commercial_vehicle_compensate_loan_controller'
        })
        .state("commercial_vehicle_compensate_loan_details",{
            url:"/commercial_vehicle_compensate_loan_details/id/{id}/compensateId/{compensateId}/from/{from}",
            templateUrl: "js/view/finance/commercial_vehicle_compensate_loan_details.html",
            controller:'commercial_vehicle_compensate_loan_details_controller'
        })*/
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
      /*  .state("finance_route_fee",{
            url:"/finance_route_fee",
            params: {"from": null},
            templateUrl: "js/view/finance/finance_route_fee.html",
            controller:'finance_route_fee_controller'
        })
        .state("finance_route_fee_details",{
            url:"/finance_route_fee_details/id/{id}/from/{from}",
            templateUrl: "js/view/finance/finance_route_fee_details.html",
            controller:'finance_route_fee_details_controller'
        })*/
        .state("single_value",{
            url:"/single_value",
            params: {"from": null},
            templateUrl: "js/view/finance/single_value.html",
            controller:'single_value_controller'
        })
        .state("cash_loan",{
            url:"/cash_loan",
            params: {"from": null},
            templateUrl: "js/view/finance/cash_loan.html",
            controller:'cash_loan_controller'
        })
        .state("driver_salary",{
            url:"/driver_salary",
            params: {"from": null},
            templateUrl: "js/view/finance/driver_salary.html",
            controller:'driver_salary_controller'
        })
        .state("driver_salary_details",{
            url:"/driver_salary_details/driveId/{driveId}/monthId/{monthId}/from/{from}?id",
            templateUrl: "js/view/finance/driver_salary_details.html",
            controller:'driver_salary_details_controller'
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
      /*  .state("dispatch_route_requ",{
            url:"/dispatch_route_requ",
            templateUrl: "js/view/finance/dispatch_route_requ.html",
            controller:'dispatch_route_requ_controller'
        })*/
        .state("dealer_map",{
            url:"/dealer_map",
            templateUrl: "js/view/system_settings/dealer_map.html",
            controller:'dealer_map_controller'
        })
        .state("accident_claim",{
            url:"/accident_claim",
            params: {"from": null},
            templateUrl: "js/view/truck/accident_claim.html",
            controller:'accident_claim_controller'
        })
        .state("accident_claim_details",{
            url:"/accident_claim_details/id/{id}/from/{from}",
            templateUrl: "js/view/truck/accident_claim_details.html",
            controller:'accident_claim_details_controller'
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
        .state("car_settlement",{
            url:"/car_settlement",
            templateUrl: "js/view/settlement/car_settlement.html",
            controller:'car_settlement_controller'
        })
        .state("fuel_record", {
            url: "/fuel_record",
            templateUrl: "js/view/data/fuel_record.html",
            controller:'fuel_record_controller'
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
        .state("finance_route_fee_statistics", {
            url:"/finance_route_fee_statistics",
            templateUrl: "js/view/statistics/finance_route_fee_statistics.html",
            controller:"finance_route_fee_statistics_controller"
        })
        .state("transport_planning_statistics", {
            url:"/transport_planning_statistics",
            templateUrl: "js/view/statistics/transport_planning_statistics.html",
            controller:"transport_planning_statistics_controller"
        })
       /* .state("setting_settlement",{
            url:"/setting_settlement",
            templateUrl: "js/view/system_settings/setting_settlement.html",
            controller:'setting_settlement_controller'
        })*/
        .state("driver_settlement",{
            url:"/driver_settlement",
            templateUrl: "js/view/settlement/driver_settlement.html",
            controller:'driver_settlement_controller'
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
        .state("driver_cost",{
            url:"/driver_cost",
            params: {"from": null},
            templateUrl: "js/view/finance/driver_cost.html",
            controller:'driver_cost_controller'
        })
        .state("truck_depreciation",{
            url:"/truck_depreciation",
            params: {"from": null},
            templateUrl: "js/view/finance/truck_depreciation.html",
            controller:'truck_depreciation_controller'
        })
        .state("car_cost",{
            url:"/car_cost",
            params: {"from": null},
            templateUrl: "js/view/finance/car_cost.html",
            controller:'car_cost_controller'
        })
        .state("driver_incidental",{
            url:"/driver_incidental",
            params: {"from": null},
            templateUrl: "js/view/finance/driver_incidental.html",
            controller:'driver_incidental_controller'
        })

        // 数据字典
        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
}]);
