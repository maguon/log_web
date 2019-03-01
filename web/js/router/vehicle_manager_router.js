/**
 * Created by ASUS on 2017/4/10.
 */


app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/vehicle_index");
    $stateProvider

        .state("vehicle_index", {  //路由状态
            url: "/vehicle_index",  //路由路径
            templateUrl: "/js/view/storage/vehicle_index.html",  //路由填充的模板
            controller:'vehicle_index_controller'
        })

        .state("storage_car_details_", {
            url:"/storageCar_details/{id}/vin/{vin}/mark/{mark}?from",
            templateUrl: "js/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storage_car_details", {
            url:"/storageCar_details/{id}/vin/{vin}/_form/{_form}?from",
            templateUrl: "/js/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "/js/view/storage/storage_car_map.html",
            controller:"storage_car_map_controller"
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/js/view/user/user_info.html",
            controller:'user_info_controller'
        })

        .state("setting_users", {
            url: "/setting_users",  //路由路径
            templateUrl: "js/view/system_settings/user_manager.html", //路由填充的模板
            controller:'setting_user_controller'
        })

        .state("truck_brand",{
            url:"/truck_brand",
            templateUrl: "js/view/system_settings/truck_brand.html",
            controller:'truck_brand_controller'
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
        // 质损
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
        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
        .state("dealer_map",{
            url:"/dealer_map",
            templateUrl: "js/view/system_settings/dealer_map.html",
            controller:'dealer_map_controller'
        })
        .state("setting_repair",{
            url:"/setting_repair",
            templateUrl: "js/view/system_settings/setting_repair.html",
            controller:'setting_repair_controller'
        })

        // 车管
        .state("truck_company",{
            url:"/truck_company",
            templateUrl: "js/view/truck/truck_company.html",
            controller:'truck_company_controller'
        })
        .state("truck_details",{
            url:"/truck_details",
            params: {"from": null},
            templateUrl: "js/view/truck/truck_details.html",
            controller:'truck_details_controller'
        })
        .state("add_hand_truck_details",{
            url:"/add_hand_truck_details?from",
            templateUrl: "js/view/truck/add_hand_truck_details.html",
            controller:'add_hand_truck_details_controller'
        })
        .state("add_head_truck_details",{
            url:"/add_head_truck_details?from",
            templateUrl: "js/view/truck/add_head_truck_details.html",
            controller:'add_head_truck_details_controller'
        })
        .state("look_head_truck_details",{
            url:"/look_head_truck_details/id/{id}?from",
            templateUrl: "js/view/truck/look_head_truck_details.html",
            controller:'look_head_truck_details_controller'
        })
        .state("look_hand_truck_details",{
            url:"/look_hand_truck_details/id/{id}?from",
            templateUrl: "js/view/truck/look_hand_truck_details.html",
            controller:'look_hand_truck_details_controller'
        })
        .state("truck_management",{
            url:"/truck_management",
            params: {"from": null},
            templateUrl: "js/view/truck/truck_management.html",
            controller:'truck_management_controller'
        })
        // 新增（事故车）
        .state("add_truck_management",{
            url:"/add_truck_management?from",
            templateUrl: "js/view/truck/add_truck_management.html",
            controller:'add_truck_management_controller'
        })
        // 事故车详情
        .state("look_truck_management",{
            url:"/look_truck_management/id/{id}?from",
            templateUrl: "js/view/truck/look_truck_management.html",
            controller:'look_truck_management_controller'
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
        .state("truck_insure",{
            url:"/truck_insure",
            templateUrl: "js/view/truck/truck_insure.html",
            controller:'truck_insure_controller'
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
        //司机违章扣款
        .state("peccancy_withhold",{
            url:"/peccancy_withhold",
            templateUrl: "js/view/truck/peccancy_withhold.html",
            controller:'peccancy_withhold_controller'
        })
        //司机超量扣款
        .state("driver_exceedOil",{
            url:"/driver_exceedOil",
            templateUrl: "js/view/truck/driver_exceedOil.html",
            controller:'driver_exceedOil_controller'
        })
        //车辆安全检查
        .state("security_check",{
            url:"/security_check",
            templateUrl: "js/view/truck/security_check.html",
            controller:'security_check_controller'
        })
        // 保单详情
        .state("truck_guarantee_details",{
            url:"/truck_guarantee_details/id/{id}/type/{type}?from",
            templateUrl: "js/view/truck/truck_guarantee_details.html",
            controller:'truck_guarantee_details_controller'
        })
        .state("truck_driver",{
            url:"/truck_driver",
            params: {"from": null},
            templateUrl: "js/view/truck/truck_driver.html",
            controller:'truck_driver_controller'
        })
        .state("add_truck_driver",{
            url:"/add_truck_driver",
            templateUrl: "js/view/truck/add_truck_driver.html",
            controller:'add_truck_driver_controller'
        })
        .state("truck_driver_details",{
            url:"/truck_driver_details/{id}/from/{from}",
            templateUrl: "js/view/truck/truck_driver_details.html",
            controller:'truck_driver_details_controller'
        })
        .state("truck_insurance",{
            url:"/truck_insurance",
            templateUrl: "js/view/truck/truck_insurance.html",
            controller:'truck_insurance_controller'
        })
        // 维修
        .state("truck_repair",{
            url:"/truck_repair/id/{id}/type/{type}/status/{status}?from",
            templateUrl: "js/view/truck/truck_repair.html",
            controller:'truck_repair_controller'
        })
        // 车辆定位
        .state("truck_position",{
            url:"/truck_position",
            templateUrl:"js/view/truck/truck_position.html",
            controller:"truck_position_controller"
        })
        // 车辆维修管理
        .state("truck_repair_list",{
            url:"/truck_repair_list",
            params: {"from": null},
            templateUrl: "js/view/truck/truck_repair_list.html",
            controller:'truck_repair_list_controller'
        })


        .state("add_storage_car", {
            url:"/add_storage_car/vin/{vin}?from",
            templateUrl: "js/view/storage/add_storage_car.html",
            controller:'add_storage_car_controller'
        })
        .state("add_storage_car_put_in", {
            url:"/add_storage_car_put_in/vin/{vin}?from",
            templateUrl: "js/view/storage/add_storage_car_put_in.html",
            controller:'add_storage_car_put_in_controller'
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

        // 数据统计
        .state("insurance_statistics", {
            url:"/insurance_statistics",
            templateUrl: "js/view/statistics/insurance_statistics.html",
            controller:"insurance_statistics_controller"
        })
        .state("maintenance_statistics", {
            url:"/maintenance_statistics",
            templateUrl: "js/view/statistics/maintenance_statistics.html",
            controller:"maintenance_statistics_controller"
        })
        .state("car_refueling_statistics", {
            url:"/car_refueling_statistics",
            templateUrl: "js/view/statistics/car_refueling_statistics.html",
            controller:"car_refueling_statistics_controller"
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
        .state("demand_car_details",{
            url:"/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller:'demand_car_details_controller'
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
        });

}]);
