// var index_router=angular.module("index_router",[]);
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("index", {  //路由状态
            url: "/index",  //路由路径
            templateUrl: "js/view/index.html",  //路由填充的模板
            controller:'index_controller'
        })

        // 指令调度
        .state("dispatch_index", {  //路由状态
            url: "/dispatch_index",  //路由路径
            templateUrl: "/js/view/storage/dispatch_index.html",  //路由填充的模板
            controller: 'dispatch_index_controller'
        })
        .state("instruction_plan", {
            url: "/instruction_plan",
            templateUrl: "js/view/dispatch/instruction_plan.html",
            controller:"instruction_plan_controller"
        })
        .state("instruction_operation", {
            url: "/instruction_operation",
            templateUrl: "js/view/dispatch/instruction_operation.html",
            controller:"instruction_operation_controller"
        })
        .state("instruction_operation_details", {
            url: "/instruction_operation_details/id/{truckId}",
            templateUrl: "js/view/dispatch/instruction_operation_details.html",
            controller:"instruction_operation_details_controller"
        })
        .state("instruction_list", {
            url: "/instruction_list",
            templateUrl: "js/view/dispatch/instruction_list.html",
            controller:"instruction_list_controller"
        })
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
        .state("look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller:"look_instruction_list_details_controller"
        })
        .state("_look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/instruction_id/{instruction_id}/timeStart/{timeStart}/timeEnd/{timeEnd}/from/{from}?refer",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller:"look_instruction_list_details_controller"
        })

        .state("instruction_driver_mileage", {
            url: "/instruction_driver_mileage",
            templateUrl: "js/view/dispatch/instruction_driver_mileage.html",
            controller:"instruction_driver_mileage_controller"
        })
        .state("instruction_drive_details", {
            url: "/instruction_drive_details/id/{id}/timeStart/{timeStart}/timeEnd/{timeEnd}?refer",
            templateUrl: "js/view/dispatch/instruction_drive_details.html",
            controller:"instruction_drive_details_controller"
        })
        .state("instruction_car_refuel", {
            url: "/instruction_car_refuel",
            templateUrl: "js/view/dispatch/instruction_car_refuel.html",
            controller:"instruction_car_refuel_controller"
        })
        .state("instruction_car_refuel_details", {
            url: "/instruction_car_refuel_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_car_refuel_details.html",
            controller:"instruction_car_refuel_details_controller"
        })

        // 数据导入
        .state("car_to_data", {
            url: "/car_to_data",
            templateUrl: "js/view/data/car_to_data.html",
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


        // 仓库设置
        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller:'setting_user_controller'
        })
        .state("setting_storage", {
            url:"/setting_storage",
            templateUrl: "js/view/system_settings/system_storage.html",
            controller:'setting_storage_controller'
        })
        .state("add_setting_storage", {
            url:"/add_setting_storage/id/{id}/{from}",
            templateUrl: "js/view/system_settings/add_system_storage.html",
            controller:'add_setting_storage_controller'
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
        .state("truck_brand",{
            url:"/truck_brand",
            templateUrl: "js/view/system_settings/truck_brand.html",
            controller:'truck_brand_controller'
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
        .state("setting_repair",{
            url:"/setting_repair",
            templateUrl: "js/view/system_settings/setting_repair.html",
            controller:'setting_repair_controller'
        })

        // 仓储
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "js/view/storage/storage_index.html",  //路由填充的模板
            controller:'storage_index_controller'
        })
        .state("vehicle_index", {
            url: "/vehicle_index",
            templateUrl: "js/view/storage/vehicle_index.html",
            controller:'vehicle_index_controller'
        })
        .state("calendar", {
            url:"/calendar",
            templateUrl: "js/view/storage/working_calendar.html",
            controller:'storage_working_calendar_controller'
        })
        .state("storage_car", {
            url:"/storage_car",
            templateUrl: "js/view/storage/storage_car.html",
            controller:'storage_car_controller'
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
        .state("storage_store", {
            url:"/storage_store",
            templateUrl: "js/view/storage/storage_store.html",
            controller:"storage_store_controller"
        })

        // 数据统计
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "js/view/statistics/storage_statistics.html",
            controller:"storage_statistics_controller"
        })

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

        .state("liability_compensation_statistics", {
            url:"/liability_compensation_statistics",
            templateUrl: "js/view/statistics/liability_compensation_statistics.html",
            controller:"liability_compensation_statistics_controller"
        })

        .state("car_insurance_payment_statistics", {
            url:"/car_insurance_payment_statistics",
            templateUrl: "js/view/statistics/car_insurance_payment_statistics.html",
            controller:"car_insurance_payment_statistics_controller"
        })

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

        // 从首页跳详情图
        .state("storage_car_details", {
            url:"/storage_car_details/{id}/vin/{vin}/_form/{_form}?from",
            templateUrl: "js/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storage_car_details_", {
            url:"/storageCar_details/{id}/vin/{vin}/mark/{mark}/status/{status}?from",
            templateUrl: "js/view/storage/storage_details.html",
            controller:"storage_car_details_controller"
        })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "js/view/storage/storage_car_map.html",
            controller:"storage_car_map_controller"
        })


        // 用户信息
        .state("user_info",{
            url:"/user_info",
            templateUrl: "js/view/user/user_info.html",
            controller:'user_info_controller'
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
        .state("car_statistics",{
            url:"/car_statistics",
            templateUrl: "js/view/car/car_statistics.html",
            controller:'car_statistics_controller'
        })

         // 车管
        .state("truck_details",{
            url:"/truck_details",
            templateUrl: "js/view/truck/truck_details.html",
            controller:'truck_details_controller'
        })

        // 新增（头车.挂车）
        .state("add_head_truck_details",{
            url:"/add_head_truck_details?from",
            templateUrl: "js/view/truck/add_head_truck_details.html",
            controller:'add_head_truck_details_controller'
        })
        .state("add_hand_truck_details",{
            url:"/add_hand_truck_details?from",
            templateUrl: "js/view/truck/add_hand_truck_details.html",
            controller:'add_hand_truck_details_controller'
        })
        // 详情(头车，挂车)
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
        // 保单详情
        .state("truck_guarantee_details",{
            url:"/truck_guarantee_details/id/{id}/type/{type}?from",
            templateUrl: "js/view/truck/truck_guarantee_details.html",
            controller:'truck_guarantee_details_controller'
        })
        // 维修
        .state("truck_repair",{
            url:"/truck_repair/id/{id}/type/{type}/status/{status}?from",
            templateUrl: "js/view/truck/truck_repair.html",
            controller:'truck_repair_controller'
        })
        // 车辆维修管理
        .state("truck_repair_list",{
            url:"/truck_repair_list",
            templateUrl: "js/view/truck/truck_repair_list.html",
            controller:'truck_repair_list_controller'
        })
        // 车辆定位
        .state("truck_position",{
            url:"/truck_position",
            templateUrl:"js/view/truck/truck_position.html",
            controller:"truck_position_controller"
        })
        .state("truck_company",{
            url:"/truck_company",
            templateUrl: "js/view/truck/truck_company.html",
            controller:'truck_company_controller'
        })
        .state("truck_driver",{
            url:"/truck_driver",
            templateUrl: "js/view/truck/truck_driver.html",
            controller:'truck_driver_controller'
        })
        .state("add_truck_driver",{
            url:"/add_truck_driver",
            templateUrl: "js/view/truck/add_truck_driver.html",
            controller:'add_truck_driver_controller'
        })
        .state("truck_driver_details",{
            url:"/truck_driver_details/{id}",
            templateUrl: "js/view/truck/truck_driver_details.html",
            controller:'truck_driver_details_controller'
        })
        .state("truck_insurance",{
            url:"/truck_insurance",
            templateUrl: "js/view/truck/truck_insurance.html",
            controller:'truck_insurance_controller'
        })
        //货车管理
        .state("truck_management",{
            url:"/truck_management",
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
            templateUrl: "js/view/truck/accident_claim.html",
            controller:'accident_claim_controller'
        })
        .state("accident_claim_details",{
            url:"/accident_claim_details/id/{id}",
            templateUrl: "js/view/truck/accident_claim_details.html",
            controller:'accident_claim_details_controller'
        })

        // 质损
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
        .state("damage_index",{
            url:"/damage_index",
            templateUrl: "js/view/damage/damage_index.html",
            controller:'damage_index_controller'
        })
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
            url:"/car_wash_fee_details/id/{id}",
            templateUrl: "js/view/damage/car_wash_fee_details.html",
            controller:'car_wash_fee_details_controller'
        })
        .state("add_damage_insurance",{
            url:"/add_damage_insurance",
            templateUrl: "js/view/damage/add_damage_insurance.html",
            controller:'add_damage_insurance_controller'
        })
        .state("add_damage_insurance_details",{
            url:"/add_damage_insurance_details/id/{id}",
            templateUrl: "js/view/damage/add_damage_insurance_details.html",
            controller:'add_damage_insurance_details_controller'
        })

        // 财务
        .state("truck_compensate_loan",{
            url:"/truck_compensate_loan",
            templateUrl: "js/view/finance/truck_compensate_loan.html",
            controller:'truck_compensate_loan_controller'
        })
        .state("truck_compensate_loan_details",{
            url:"/truck_compensate_loan_details/id/{id}",
            templateUrl: "js/view/finance/truck_compensate_loan_details.html",
            controller:'truck_compensate_loan_details_controller'
        })

        // 下载app
        .state("admin_download_app",{
            url:"/admin_download_app",
            templateUrl: "js/view/download/admin_download_app.html",
            controller:'admin_download_app_controller'
        })

        //app系统
        .state("app_version",{
            url:"/app_version",
            templateUrl: "js/view/app/app_version.html",
            controller:'app_version_controller'
        })
}]);
