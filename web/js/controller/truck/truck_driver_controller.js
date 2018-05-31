/**
 * Created by zcy on 2017/7/12.
 */
app.controller("truck_driver_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 21;
    // 驾驶类型
    $scope.licenseType = _config.licenseType;

    // 搜索指定司机信息
    $scope.searchDriver = function (obj) {
        obj.start = obj.start + "";
        _basic.get($host.api_url + "/drive?" + _basic.objToUrl(obj)).then(function (driveData) {
            if (driveData.success === true) {
                $scope.boxArray = driveData.result;
                $scope.driveList = $scope.boxArray.slice(0, 20);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (driveData.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
            else {
                swal(driveData.msg, "", "error");
            }
        });
    };

    $scope.queryParams = {
        start:$scope.start ,
        size:$scope.size,
    };

    // 普通查询
    $scope.common_search_driver = function(){
        // 控制分页查询参数
        $scope.queryParams.start = $scope.start;
        $scope.searchDriver($scope.queryParams)
    };
    $scope.common_search_driver();

    // 条件赋值
    $scope.setParams = function(){
        // 控制查询参数逻辑
        if($scope.driveName){
            $scope.queryParams.driveName = $scope.driveName;
        }
        else{
            $scope.queryParams.truckNum = "";

        }
        if($scope.driverType){
            $scope.queryParams.operateType = $scope.driverType;
        }
        else {
            $scope.queryParams.operateType= "";
        }

        if($scope.driverCompany){
            $scope.queryParams.companyId = $scope.driverCompany;
        }
        else {
            $scope.queryParams.companyId= "";
        }

        if($scope.workStatus){
            $scope.queryParams.driveStatus = $scope.workStatus;
        }
        else {
            $scope.queryParams.driveStatus= "";
        }

        if($scope.driveTel){
            $scope.queryParams.mobile = $scope.driveTel;
        }
        else {
            $scope.queryParams.mobile= "";
        }

        if($scope.truckNumber){
            $scope.queryParams.truckNum = $scope.truckNumber;
        }
        else {
            $scope.queryParams.truckNum= "";
        }

        if($scope.drivingLicense){
            $scope.queryParams.licenseType = $scope.drivingLicense;
        }
        else {
            $scope.queryParams.licenseType= "";

        }
        if($scope.verificationStart){
            $scope.queryParams.licenseDateStart = $scope.verificationStart;
        }
        else {
            $scope.queryParams.licenseDateStart= "";

        }
        if($scope.verificationEnd){
            $scope.queryParams.licenseDateEnd = $scope.verificationEnd;
        }
        else {
            $scope.queryParams.licenseDateEnd= "";
        }

    };

    // 点击查询司机
    $scope.showDriverInfo = function () {
        $scope.start = 0;
        $scope.setParams();
        $scope.searchDriver($scope.queryParams)
    };

    // 停用或启用司机
    $scope.disableDriver = function (driverStatus,driverId) {
        if(driverStatus == "1"){
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/0",{}).then(function (disableData) {
                if (disableData.success === true) {
                    $scope.searchDriver($scope.queryParams);
                    swal("已停用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "warning");
                    $scope.searchDriver($scope.queryParams);
                }
            });
        }
        else{
            _basic.put($host.api_url + "/user/" + userId + "/drive/" + driverId + "/driveStatus/1",{}).then(function (activeData) {
                if (activeData.success === true) {
                    $scope.searchDriver($scope.queryParams);
                    swal("已启用该司机", "", "success");
                }
                else{
                    swal("司机已被关联，请先解绑", "", "warning");
                    $scope.searchDriver($scope.queryParams);
                }
            });
        }
    };



    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.common_search_driver();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.common_search_driver();
    };

    // 根据选择的所属类型获取公司信息
    $scope.searchOperateType = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.driverType).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                // console.log("companyList",$scope.companyList);
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };

    // 获取司机信息
    $scope.queryData = function () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
                // console.log("truckData",$scope.truckList);
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
        // 默认显示所有
        // $scope.searchDriver();
    };
    $scope.queryData();
}]);