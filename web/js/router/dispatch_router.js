/**
 * Created by ASUS on 2017/5/19.
 */

app.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/user_info");
    $stateProvider
        .state("car_demand",{
            url:"/car_demand",
            templateUrl: "js/view/car_demand/car_demand.html",
            controller:'car_demand_controller'
        })
        .state("demand_Car_details",{
            url:"/demand_Car_details/{id}/vin/{vin}?from",
            templateUrl: "js/view/car_demand/demand_Car_details.html",
            controller:'demand_Car_details_controller'
        })
        .state("user_info",{
            url:"/user_info",
            templateUrl: "js/view/user/user_info.html",
            controller:'user_info_controller'
        });
}]);
