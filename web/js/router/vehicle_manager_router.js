/**
 * Created by ASUS on 2017/4/10.
 */


app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    // $routeProvider.when('/', {
    //     templateUrl: '/view/index_home.html',
    //     controller:'indexController'
    // }).when('/data', {
    //     templateUrl: '/view/car_to_data.html',
    //     controller:'dataController'
    // }).when('/setting', {
    //     templateUrl: '/view/setting.html',
    //     controller:'settingController'
    // }).otherwise({
    //     templateUrl: '/view/index_home.html',
    //     controller:'indexController'
    // });
    $urlRouterProvider.when("","/storage_index_vehicle");
    $stateProvider

        .state("storage_index_vehicle", {  //路由状态
            url: "/storage_index_vehicle",  //路由路径
            templateUrl: "/js/view/storage/storage_index_vehicle.html",  //路由填充的模板
            controller:'storage_index_vehicle_controller'
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
        .state("setting_dealer_details",{
            url:"/setting_dealer_details/{dealer_id}",
            templateUrl: "js/view/system_settings/setting_dealer/setting_dealer_details.html",
            controller:'setting_dealer_details_controller'
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

        // 车管
        .state("truck_company",{
            url:"/truck_company",
            templateUrl: "js/view/truck/truck_company.html",
            controller:'truck_company_controller'
        })
        .state("truck_details",{
            url:"/truck_details",
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
        // 保单详情
        .state("truck_guarantee_details",{
            url:"/truck_guarantee_details/id/{id}/type/{type}?from",
            templateUrl: "js/view/truck/truck_guarantee_details.html",
            controller:'truck_guarantee_details_controller'
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
        // 维修
        .state("truck_repair",{
            url:"/truck_maintain/id/{id}/type/{type}/status/{status}?from",
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
        .state("insurance_statistics", {
            url:"/insurance_statistics",
            templateUrl: "js/view/storage/insurance_statistics.html",
            controller:"insurance_statistics_controller"
        })
        .state("maintenance_statistics", {
            url:"/maintenance_statistics",
            templateUrl: "js/view/storage/maintenance_statistics.html",
            controller:"maintenance_statistics_controller"
        })
        .state("demand_car_details",{
            url:"/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller:'demand_car_details_controller'
        });

}]);
