/**
 * Created by ASUS on 2017/8/29.
 */
app.controller("instruction_driver_mileage_controller", ["$scope", "$host","_config","_basic", function ($scope, $host,_config, _basic) {

        // 指令任务状态
        _basic.get($host.api_url+"/city").then(function (data){
            if(data.success==true){
                $scope.cityList=data.result;
            }
        });
}]);