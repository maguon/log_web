/**
 * Created by zcy on 2017/9/22.
 */

app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/dispatch_index");
    $stateProvider
        .state("dispatch_index", {  //路由状态
            url: "/dispatch_index",  //路由路径
            templateUrl: "/js/view/storage/dispatch_index.html",  //路由填充的模板
            controller: 'dispatch_index_controller'
        })
        .state("user_info", {
            url: "/user_info",
            templateUrl: "/js/view/user/user_info.html",
            controller: 'user_info_controller'
        })
        .state("setting_vin_match", {
            url: "/setting_vin_match",
            templateUrl: "js/view/system_settings/setting_vin_match.html",
            controller:'setting_vin_match_controller'
        })
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller: 'setting_user_controller'
        })
        .state("setting_car_brand", {
            url:"/setting_car_brand",
            templateUrl: "js/view/system_settings/setting_car_brand.html",
            controller:'storage_car_brand_controller'
        })
        .state("setting_amend_vin",{
            url:"/setting_amend_vin",
            templateUrl: "js/view/system_settings/setting_amend_vin.html",
            controller:'setting_amend_vin_controller'
        })
      /*  .state("setting_line",{
            url:"/setting_line",
            templateUrl: "js/view/system_settings/setting_line.html",
            controller:'setting_line_controller'
        })*/

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
        .state("setting_city",{
            url:"/setting_city",
            templateUrl: "js/view/system_settings/setting_city.html",
            controller:'setting_city_controller'
        })
        .state("add_setting_dealer",{
            url:"/add_setting_dealer",
            templateUrl: "js/view/system_settings/setting_dealer/add_setting_dealer_details.html",
            controller:'add_setting_dealer_controller'
        })

        .state("truck_brand", {
            url: "/truck_brand",
            templateUrl: "js/view/system_settings/truck_brand.html",
            controller: 'truck_brand_controller'
        })

        .state("data_dictionary", {
            url: "/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller: 'data_dictionary_controller'
        })
        .state("car_wash_fee_management",{
            url:"/car_wash_fee_management",
            templateUrl: "js/view/finance/car_wash_fee_management.html",
            controller:'car_wash_fee_management_controller'
        })
        // 指令调度
        .state("instruction_plan", {
            url: "/instruction_plan",
            templateUrl: "js/view/dispatch/instruction_plan.html",
            controller: "instruction_plan_controller"
        })
        .state("instruction_operation", {
            url: "/instruction_operation",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_operation.html",
            controller: "instruction_operation_controller"
        })
        .state("instruction_operation_details", {
            url: "/instruction_operation_details/id/{truckId}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_operation_details.html",
            controller: "instruction_operation_details_controller"
        })
        .state("instruction_list", {
            url: "/instruction_list",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_list.html",
            controller: "instruction_list_controller"
        })
        .state("instruction_need", {
            url: "/instruction_need",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_need.html",
            controller: "instruction_need_controller"
        })
        .state("look_instruction_need_details", {
            url: "/look_instruction_need_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_need_details.html",
            controller: "look_instruction_need_details_controller"
        })
        .state("look_instruction_need_transfer_detail", {
            url: "/look_instruction_need_transfer_detail/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_need_transfer_detail.html",
            controller:"look_instruction_need_transfer_detail_controller"
        })
        .state("look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller: "look_instruction_list_details_controller"
        })
        .state("_look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/instruction_id/{instruction_id}/timeStart/{timeStart}/timeEnd/{timeEnd}/makeId/{makeId}/from/{from}?refer",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller: "look_instruction_list_details_controller"
        })

        .state("instruction_driver_mileage", {
            url: "/instruction_driver_mileage",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_driver_mileage.html",
            controller: "instruction_driver_mileage_controller"
        })
        .state("instruction_drive_details", {
            url: "/instruction_drive_details/id/{id}/timeStart/{timeStart}/timeEnd/{timeEnd}/makeId/{makeId}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_drive_details.html",
            controller: "instruction_drive_details_controller"
        })
        .state("instruction_car_refuel", {
            url: "/instruction_car_refuel",
            params: {"from": null},
            templateUrl: "js/view/dispatch/instruction_car_refuel.html",
            controller: "instruction_car_refuel_controller"
        })
        .state("instruction_car_refuel_details", {
            url: "/instruction_car_refuel_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_car_refuel_details.html",
            controller: "instruction_car_refuel_details_controller"
        })
        .state("dispatch_route_fee",{
            url:"/dispatch_route_fee",
            templateUrl: "js/view/dispatch/dispatch_route_fee.html",
            controller:'dispatch_route_fee_controller'
        })
        .state("dispatch_route_fee_details",{
            url:"/dispatch_route_fee_details/id/{id}",
            templateUrl: "js/view/dispatch/dispatch_route_fee_details.html",
            controller:'dispatch_route_fee_details_controller'
        })
        .state("dispatch_order",{
            url:"/dispatch_order",
            params: {"from": null},
            templateUrl: "js/view/dispatch/dispatch_order.html",
            controller:'dispatch_order_controller'
        })
        .state("dispatch_order_details",{
            url:"/dispatch_order_details/id/{id}/?from",
            templateUrl: "js/view/dispatch/dispatch_order_details.html",
            controller:'dispatch_order_details_controller'
        })
        .state("cost_application",{
            url:"/cost_application",
            params: {"from": null},
            templateUrl: "js/view/dispatch/cost_application.html",
            controller:'cost_application_controller'
        })
        .state("reissue_premium", {
            url: "/reissue_premium",
            params: {"from": null},
            templateUrl: "js/view/dispatch/reissue_premium.html",
            controller:"reissue_premium_controller"
        })
        // 消息管理 2020-12-28 新建
        .state("notification_manager", {
            url:"/notification_manager",
            templateUrl: "js/view/dispatch/notification_manager.html",
            controller:"notification_manager_controller"
        })
        .state("car_to_data", {
            url: "/car_to_data",  //路由路径
            templateUrl: "js/view/data/car_to_data.html",  //路由填充的模板
            controller:'car_to_data_controller'
        })
        .state("imported_files", {
            url: "/imported_files",
            templateUrl: "js/view/data/imported_files.html",
            controller:'imported_files_controller'
        })
        .state("imported_files_details", {
            url: "/imported_files_details/id/{id}",
            templateUrl: "js/view/data/imported_files_details.html",
            controller:'imported_files_details_controller'
        })
        .state("outsourcing_vehicles",{
            url:"/outsourcing_vehicles",
            params: {"from": null},
            templateUrl: "js/view/dispatch/outsourcing_vehicles.html",
            controller:'outsourcing_vehicles_controller'
        })
        .state("driver_attendance",{
            url:"/driver_attendance",
            params: {"from": null},
            templateUrl: "js/view/dispatch/driver_attendance.html",
            controller:'driver_attendance_controller'
        })
        .state("add_driver_detail",{
            url:"/add_driver_detail?from",
            templateUrl: "js/view/dispatch/add_driver_detail.html",
            controller:'add_driver_detail_controller'
        })
        .state("add_hand_detail",{
            url:"/add_hand_detail?from",
            templateUrl: "js/view/dispatch/add_hand_detail.html",
            controller:'add_hand_detail_controller'
        })
        .state("add_head_detail",{
            url:"/add_head_detail?from",
            templateUrl: "js/view/dispatch/add_head_detail.html",
            controller:'add_head_detail_controller'
        })


        .state("look_driver_detail",{
            url:"/look_driver_detail/id/{id}/?from",
            templateUrl: "js/view/dispatch/look_driver_detail.html",
            controller:'look_driver_detail_controller'
        })
        .state("look_hand_detail",{
            url:"/look_hand_detail/id/{id}/?from",
            templateUrl: "js/view/dispatch/look_hand_detail.html",
            controller:'look_hand_detail_controller'
        })
        .state("look_head_detail",{
            url:"/look_head_detail/id/{id}/?from",
            templateUrl: "js/view/dispatch/look_head_detail.html",
            controller:'look_head_detail_controller'
        })

        .state("driver_settlement",{
            url:"/driver_settlement",
            templateUrl: "js/view/settlement/driver_settlement.html",
            controller:'driver_settlement_controller'
        })
        // 公共数据
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
        // 数据统计
        .state("chauffeur_mileage_statistics", {
            url:"/chauffeur_mileage_statistics",
            templateUrl: "js/view/statistics/chauffeur_mileage_statistics.html",
            controller:"chauffeur_mileage_statistics_controller"
        })
        .state("car_refueling_statistics", {
            url:"/car_refueling_statistics",
            templateUrl: "js/view/statistics/car_refueling_statistics.html",
            controller:"car_refueling_statistics_controller"
        })
        .state("import_data_statistics", {
            url:"/import_data_statistics",
            templateUrl: "js/view/statistics/import_data_statistics.html",
            controller:"import_data_statistics_controller"
        })
        .state("transport_planning_statistics", {
            url:"/transport_planning_statistics",
            templateUrl: "js/view/statistics/transport_planning_statistics.html",
            controller:"transport_planning_statistics_controller"
        })
        // 部门统计 2020-12-18 新建
        .state("department_statistics", {
            url:"/department_statistics",
            templateUrl: "js/view/damage/department_statistics.html",
            controller:"department_statistics_controller"
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
        .state("single_value",{
            url:"/single_value",
            params: {"from": null},
            templateUrl: "js/view/finance/single_value.html",
            controller:'single_value_controller'
        })
        // 维修
        .state("truck_repair", {
            url:"/truck_repair/id/{id}/truckId/{truckId}/type/{type}/status/{status}?from",
            templateUrl: "js/view/truck/truck_repair.html",
            controller: 'truck_repair_controller'
        })
        // 车辆定位
        .state("truck_position", {
            url: "/truck_position",
            templateUrl: "js/view/truck/truck_position.html",
            controller: "truck_position_controller"
        })
        // 车辆维修管理
        .state("truck_repair_list", {
            url: "/truck_repair_list",
            params: {"from": null},
            templateUrl: "js/view/truck/truck_repair_list.html",
            controller: 'truck_repair_list_controller'
        })

        .state("demand_car_details", {
            url: "/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller: 'demand_car_details_controller'
        });

}]);
