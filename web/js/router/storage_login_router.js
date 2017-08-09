var login_router=angular.module("login_router",[]);
login_router.config(['$stateProvider',"$urlRouterProvider",function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.when("","/login");
    $stateProvider
        .state("login", {  //路由状态
            url: "/login",  //路由路径
            templateUrl: "/view/storage/storage_login.html",  //路由填充的模板
            controller:'loginController'
        })
}]);
//
// app.config(['$routeProvider',function($routeProvider) {
//     $routeProvider.when('/', {
//         templateUrl: '/view/login.html',
//         controller:'loginController'
//     }).otherwise({
//             templateUrl: '/view/login.html',
//             controller:'loginController'
//         });
// }]);

