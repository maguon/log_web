/**
 * Created by ASUS on 2017/6/2.
 */
app.controller("car_sv_driver_controller",["$state","$scope","_basic","$host",function ($state,$scope,_basic,$host) {
    // $state.go('CarMsg.truck');//默认显示第一个tab
    // $scope.change = function(x){
    //     console.log(x);
    // };
    var userId=_basic.getSession(_basic.USER_ID);
    _basic.get($host.api_url+"/user/"+userId+"/drive").then(function (data) {
        _basic.callBackDate(data,function () {
            $scope.dirvierMsg=data.result
        })
    })
    // 新增司机
    $scope.add_driver = function () {
        $('.modal').modal({
            complete: function () {
                $scope.addCompanyName = "";
                $scope.addOperateType = "";
                $scope.addCooperationTime = "";
                $scope.addContacts = "";
                $scope.addTel = "";
                $scope.addCityId = "";
                $scope.addMark = "";
            }
        });
        $scope.submitted = false;
        $('#add_driver').modal('open');

    };


}]);