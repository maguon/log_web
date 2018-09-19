/**
 * Created by ASUS on 2017/4/10.
 */

app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "/js/view/storage/storage_index.html",  //路由填充的模板
            controller:'storage_index_controller'
        })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "/js/view/storage/working_calendar.html",
            controller:'storage_working_calendar_controller'
        })
        .state("storage_car", {
            url:"/storage_car",
            params: {"from": null},
            templateUrl: "js/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        .state("storage_store", {
            url:"/storage_store",
            templateUrl: "/js/view/storage/storage_store.html",
            controller:"storage_store_controller"
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
        // 调度需求
        .state("instruction_need", {
            url: "/instruction_need",
            templateUrl: "js/view/dispatch/instruction_need.html",
            controller:"instruction_need_controller"
        })
        .state("look_instruction_need_details", {
            url: "/look_instruction_need_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_need_details.html",
            controller:"look_instruction_need_details_controller"
        })
        .state("look_instruction_need_transfer_detail", {
            url: "/look_instruction_need_transfer_detail/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_need_transfer_detail.html",
            controller:"look_instruction_need_transfer_detail_controller"
        })
        .state("setting_car_brand", {
            url:"/setting_car_brand",
            templateUrl: "js/view/system_settings/setting_car_brand.html",
            controller:'storage_car_brand_controller'
        })
        .state("setting_city",{
            url:"/setting_city",
            templateUrl: "js/view/system_settings/setting_city.html",
            controller:'setting_city_controller'
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
        .state("setting_dealer_details",{
            url:"/setting_dealer_details/{dealer_id}",
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

        .state("data_dictionary",{
            url:"/data_dictionary",
            templateUrl: "js/view/system_settings/data_dictionary.html",
            controller:'data_dictionary_controller'
        })
        .state("add_setting_dealer",{
            url:"/add_setting_dealer",
            templateUrl: "js/view/system_settings/setting_dealer/add_setting_dealer_details.html",
            controller:'add_setting_dealer_controller'
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
        .state("dealer_map",{
            url:"/dealer_map",
            templateUrl: "js/view/system_settings/dealer_map.html",
            controller:'dealer_map_controller'
        })
        .state("add_storage_car_vin", {
            url:"/add_storage_car_vin",
            templateUrl: "js/view/storage/add_storage_car_vin.html",
            controller:'add_storage_car_vin_controller'
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

        // 数据统计
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "/js/view/statistics/storage_statistics.html",
            controller:"storage_statistics_controller"
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

        .state("demand_car_details",{
            url:"/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller:'demand_car_details_controller'
        })
        .state("instruction_list", {
            url: "/instruction_list",
            templateUrl: "js/view/dispatch/instruction_list.html",
            controller:"instruction_list_controller"
        })
        .state("look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller:"look_instruction_list_details_controller"
        });

}]);
