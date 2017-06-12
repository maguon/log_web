/**
 * Created by ASUS on 2017/6/8.
 */
/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_client_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    $scope.contacts={
        show:false
    };
    $scope.add_contacts={
        show:false
    };
    $scope.view_contacts=function () {

    };
    $scope.view_contacts=function () {
        $scope.contacts.show=!$scope.contacts.show;
    };
    $scope.open_add_contacts=function () {
        $scope.add_contacts={
            show:true
        };
    };
    $scope.close_contacts=function () {
        $scope.add_contacts={
            show:false
        };
    }
}]);