// var index_router=angular.module("index_router",[]);
app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    // $routeProvider.when('/', {
    //     templateUrl: '/view/index_home.html',
    //     controller:'indexController'
    // }).when('/data', {
    //     templateUrl: '/view/data.html',
    //     controller:'dataController'
    // }).when('/setting', {
    //     templateUrl: '/view/setting.html',
    //     controller:'settingController'
    // }).otherwise({
    //     templateUrl: '/view/index_home.html',
    //     controller:'indexController'
    // });

    $urlRouterProvider.when("","/storage_index");
    $stateProvider
        .state("index", {  //路由状态
            url: "/index",  //路由路径
            templateUrl: "js/view/index.html",  //路由填充的模板
            controller:'index_controller'
        })
        .state("Com", {
            url: "/Com",  //路由路径
            templateUrl: "js/view/car/truck_statistics.html",  //路由填充的模板
            // controller:'dataController'
        })
        .state("CarMsg", {
            url: "/CarMsg",  //路由路径
            templateUrl: "js/view/car/truck_manager.html", //路由填充的模板
            // abstract:true,
            controller:function ($state) {
                $('.modal').modal();
                $state.go("CarMsg.truck");
                // console.log($state);
            }
        })
        .state("CarMsg.truck", {
            url: "/truck",  //路由路径
            templateUrl: "js/view/car/truck/truck_head.html",  //路由填充的模板
            controller:'truck_head_controller'
        })
        .state("CarMsg.hand", {
            url: "/hand",  //路由路径
            templateUrl: "js/view/car/truck/truck_hand.html",  //路由填充的模板
            controller:'truck_hand_controller'
        })
        // 车管
        // .state("car_sv_driver", {
        //     url: "/car_sv_driver",  //路由路径
        //     templateUrl: "js/view/car/car_supervise/driver.html", //路由填充的模板
        //     controller:"car_sv_driver_controller"
        // })

        // 公司
        // .state("company", {
        //     url: "/company",  //路由路径
        //     templateUrl: "js/view/company/company.html", //路由填充的模板
        //     // abstract:true,
        //     controller:"company_controller"
        // })
        .state("malfunction", {
            url: "/malfunction",  //路由路径
            templateUrl: "js/view/car/malfunction.html", //路由填充的模板
            // abstract:true,
            controller:"truck_malfunction_controller"
        })
        .state("refuel", {
            url: "/refuel",  //路由路径
            templateUrl: "js/view/car/refuel.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("refuel.carRefuel", {
            url: "/refuel",  //路由路径
            templateUrl: "js/view/car/refuel.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("refuel.oilMass", {
            url: "/refuel",  //路由路径
            templateUrl: "js/view/car/refuel.html", //路由填充的模板
            // abstract:true,
            // controller:
        })
        .state("car_to_data", {
            url: "/car_to_data",  //路由路径
            templateUrl: "js/view/data/car_to_data.html",  //路由填充的模板
            controller:'car_to_data_controller'
        })
        .state("setting_users", {
            url: "/setting_users",  //路由路径
            templateUrl: "js/view/system_settings/user_manager.html", //路由填充的模板
            controller:'setting_user_controller'
        })
        .state("setting_storage", {
            url:"/setting_storage",
            templateUrl: "js/view/system_settings/system_storage.html",
            controller:'setting_storage_controller'
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
        .state("storage_index", {  //路由状态
            url: "/storage_index",  //路由路径
            templateUrl: "js/view/storage/storage_index.html",  //路由填充的模板
            controller:'storage_index_controller'
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
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "js/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
        })

        .state("insurance_statistics", {
            url:"/insurance_statistics",
            templateUrl: "js/view/storage/insurance_statistics.html",
            controller:"insurance_statistics_controller"
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
        // .state("storage_car_details_1", {
        //     url:"/storageCar_details/{id}/vin/{vin}",
        //     templateUrl: "js/view/storage/storage_details.html",
        //     controller:"storage_car_details_controller"
        // })
        .state("storage_car_map", {
            url:"/storage_car_map/{id}?form",
            templateUrl: "js/view/storage/storage_car_map.html",
            controller:"storage_car_map_controller"
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "js/view/user/user_info.html",
            controller:'user_info_controller'
        })
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "js/view/car/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
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
        .state("demand_car_details",{
            url:"/demand_car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car/car_demand/demand_car_details.html",
            controller:'demand_car_details_controller'
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
            url:"/truck_guarantee_details/id/{id}?from",
            templateUrl: "js/view/truck/truck_guarantee_details.html",
            controller:'truck_guarantee_details_controller'
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
}]);
