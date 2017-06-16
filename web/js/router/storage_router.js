/**
 * Created by ASUS on 2017/4/10.
 */

// var storage_router=angular.module("storage_router",[]);
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
            templateUrl: "/js/view/storage/storage_car.html",
            controller:'storage_car_controller'
        })
        .state("storage_store", {
            url:"/storage_store",
            templateUrl: "/js/view/storage/storage_store.html",
            controller:"storage_store_controller"
        })
        .state("statistics", {
            url:"/storage_statistics",
            templateUrl: "/js/view/storage/storage_statistics.html",
            controller:"storage_statistics_controller"
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
        .state("setting_car_brand",{
            url:"setting_car_brand",
            templateUrl: "/js/view/car/storage/setting_car_brand.html",
            controller:'setting_car_brand_controller'
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "/js/view/user/user_info.html",
            controller:'user_info_controller'
        });
}]);
