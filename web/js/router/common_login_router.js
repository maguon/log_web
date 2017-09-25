/**
 * Created by ASUS on 2017/9/25.
 */

Login_model.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/common_login");
    $stateProvider
        .state("common_login", {  //路由状态
            url: "/common_login",  //路由路径
            templateUrl: "./common_login_view.html",  //路由填充的模板
            controller:'common_login_view_controller'
        })
        .state("retrieve_password", {  //路由状态
            url: "/retrieve_password",  //路由路径
            templateUrl: "./retrieve_password.html",  //路由填充的模板
            controller:'retrieve_password_controller'
        })
        .state('retrieve_password.phone', {
            url: '/phone',
            template: '<h2>Your priority inbox</h2>'
        });


}]);
