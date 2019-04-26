app.controller("driver_information_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {

    $scope.start = 0;
    $scope.size = 11;

    // 获取所有公司列表
    $scope.getCompanyList = function () {
        _basic.get($host.api_url + "/company").then(function (data) {
            if (data.success === true) {
                $scope.companyList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driver').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 获取司机信息
    $scope.getDriverInfoList = function () {
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
                    pageId: "driver_information",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.damageClaimList = $scope.boxArray.slice(0, 10);
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
                $scope.driverInfoList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击查询
    $scope.searchDriverInfoList = function () {
        $scope.start = 0;
        $scope.getDriverInfoList();
    };

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDriverInfoList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDriverInfoList();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.carType=conditions.operateType;
        $scope.insureCompany=conditions.companyId;
        $scope.driverName=conditions.driveName;
        $scope.mainDrive=conditions.truckNum;
        $scope.associatedTrailer=conditions.trailNum;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            operateType: $scope.carType,
            companyId: $scope.insureCompany,
            driveName: $scope.driverName,
            truckNum: $scope.mainDrive,
            trailNum: $scope.associatedTrailer
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "driver_information_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "driver_information") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }
        // 查询数据
        $scope.getDriverInfoList();
        getDriveNameList ()

    }
    initData();

    // 获取数据
    $scope.queryData = function () {
        $scope.getCompanyList();
        $scope.getDriverInfoList();

    };
    $scope.queryData();
}]);