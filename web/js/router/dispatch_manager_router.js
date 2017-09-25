/**
 * Created by zcy on 2017/9/22.
 */

app.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("", "/vehicle_index");
    $stateProvider

        .state("vehicle_index", {  //路由状态
            url: "/vehicle_index",  //路由路径
            templateUrl: "/js/view/storage/vehicle_index.html",  //路由填充的模板
            controller: 'vehicle_index_controller'
        })
        .state("user_info", {
            url: "/user_info",
            templateUrl: "/js/view/user/user_info.html",
            controller: 'user_info_controller'
        })

        .state("setting_users", {
            url: "/setting_users",
            templateUrl: "js/view/system_settings/user_manager.html",
            controller: 'setting_user_controller'
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

        // 指令调度
        .state("instruction_plan", {
            url: "/instruction_plan",
            templateUrl: "js/view/dispatch/instruction_plan.html",
            controller: "instruction_plan_controller"
        })
        .state("instruction_operation", {
            url: "/instruction_operation",
            templateUrl: "js/view/dispatch/instruction_operation.html",
            controller: "instruction_operation_controller"
        })
        .state("instruction_operation_details", {
            url: "/instruction_operation_details/id/{truckId}",
            templateUrl: "js/view/dispatch/instruction_operation_details.html",
            controller: "instruction_operation_details_controller"
        })
        .state("instruction_list", {
            url: "/instruction_list",
            templateUrl: "js/view/dispatch/instruction_list.html",
            controller: "instruction_list_controller"
        })
        .state("instruction_need", {
            url: "/instruction_need",
            templateUrl: "js/view/dispatch/instruction_need.html",
            controller: "instruction_need_controller"
        })
        .state("look_instruction_need_details", {
            url: "/look_instruction_need_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_need_details.html",
            controller: "look_instruction_need_details_controller"
        })
        .state("look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller: "look_instruction_list_details_controller"
        })
        .state("_look_instruction_list_details", {
            url: "/look_instruction_list_details/id/{id}/instruction_id/{instruction_id}/timeStart/{timeStart}/timeEnd/{timeEnd}/from/{from}?refer",
            templateUrl: "js/view/dispatch/look_instruction_list_details.html",
            controller: "look_instruction_list_details_controller"
        })

        .state("instruction_driver_mileage", {
            url: "/instruction_driver_mileage",
            templateUrl: "js/view/dispatch/instruction_driver_mileage.html",
            controller: "instruction_driver_mileage_controller"
        })
        .state("instruction_drive_details", {
            url: "/instruction_drive_details/id/{id}/timeStart/{timeStart}/timeEnd/{timeEnd}?refer",
            templateUrl: "js/view/dispatch/instruction_drive_details.html",
            controller: "instruction_drive_details_controller"
        })
        .state("instruction_car_refuel", {
            url: "/instruction_car_refuel",
            templateUrl: "js/view/dispatch/instruction_car_refuel.html",
            controller: "instruction_car_refuel_controller"
        })
        .state("instruction_car_refuel_details", {
            url: "/instruction_car_refuel_details/id/{id}/from/{from}",
            templateUrl: "js/view/dispatch/instruction_car_refuel_details.html",
            controller: "instruction_car_refuel_details_controller"
        })

        // 公共数据
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

        // 维修
        .state("truck_repair", {
            url: "/truck_repair/id/{id}/type/{type}/status/{status}?from",
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
            templateUrl: "js/view/truck/truck_repair_list.html",
            controller: 'truck_repair_list_controller'
        })

        .state("demand_car_details", {
            url: "/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller: 'demand_car_details_controller'
        });

}]);
