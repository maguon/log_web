/**
 * Created by zcy on 2017/7/12.
 */
app.controller("truck_driver_controller", ["$scope","$rootScope","$state","$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope,$state,$stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 21;
    // 驾驶类型
    $scope.licenseType = _config.licenseType;

    // 根据选择的所属类型获取公司信息
    $scope.searchOperateType = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.driverType).then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    };



    // 搜索指定司机信息
    $scope.searchDriver = function () {

        // 基本检索URL
        var url = $host.api_url + "/drive?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "truck_driver",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.driveList = $scope.boxArray.slice(0, 20);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/drive.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.driveName = conditions.driveName;
        $scope.driverType = conditions.operateType;
        $scope.driverCompany = conditions.companyId;
        $scope.workStatus = conditions.driveStatus;
        $scope.driveTel = conditions.mobile;
        $scope.truckNumber = conditions.truckNum;
        $scope.drivingLicense = conditions.licenseType;
        $scope.verificationStart = conditions.licenseDateStart;
        $scope.verificationEnd = conditions.licenseDateEnd;
        $scope.operateFlag = conditions.operateFlag;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            driveName:$scope.driveName,
            operateType:$scope.driverType,
            companyId:$scope.driverCompany,
            driveStatus:$scope.workStatus,
            mobile: $scope.driveTel,
            truckNum:$scope.truckNumber,
            licenseType:$scope.drivingLicense,
            licenseDateStart:$scope.verificationStart,
            licenseDateEnd:$scope.verificationEnd,
            operateFlag:$scope. operateFlag
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "truck_driver_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_driver") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.driverType = pageItems.conditions.operateType;
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.searchOperateType();
        $scope.searchDriver();

    }
    initData();


    // 点击查询司机
    $scope.showDriverInfo = function () {
        $scope.start = 0;
        $scope.searchDriver();
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
        $scope.searchDriver();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchDriver();
    };

    // 获取司机信息
    $scope.queryData = function () {
        _basic.get($host.api_url + "/truckFirst?truckType=1").then(function (truckData) {
            if (truckData.success === true) {
                $scope.truckList = truckData.result;
            }
            else {
                swal(truckData.msg, "", "error");
            }
        });
    };
    $scope.queryData();

    $scope.searchDriver();
}]);