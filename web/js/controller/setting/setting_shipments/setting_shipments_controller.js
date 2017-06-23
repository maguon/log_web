/**
 * Created by ASUS on 2017/6/22.
 */
/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_shipments_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    // $scope.contacts=[];
    // $scope.addContacts=[];
    // 电话号正则
    // $scope.mobileReg=_config.mobileRegx;
    // $scope.userId=_basic.getSession(_basic.USER_ID);
    // $scope.contacts_name=[];
    // 初始数据
    _basic.get($host.api_url+"/baseAddr").then(function (data) {
        if(data.success==true&&data.result.length>0){
            $scope.setting_shipments=data.result;
            $scope.len=data.result.length;


        }
    });

}]);