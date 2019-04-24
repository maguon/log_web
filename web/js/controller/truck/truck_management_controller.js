app.controller("truck_management_controller", ["$scope","$rootScope","$state", "$stateParams", "_basic", "_config", "$host",function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
        $scope.start=0;
        $scope.size = 10;
        //司机
        function getDriveNameList () {
            _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
                if (data.success == true) {
                    $scope.driveNameList = data.result;
                    $('#driveName').select2({
                        placeholder: '司机',
                        containerCssClass : 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        // 获取所有公司列表
        function getCompanyList() {
            _basic.get($host.api_url + "/company").then(function (data) {
                if (data.success === true) {
                    $scope.companyList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };
        //車牌号
        function getTruckNumList () {
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumList = data.result;
                    $('#truckNum').select2({
                        placeholder: '车牌号',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        // 获取筛选列表
        function getManagementRecordList () {
            if($scope.driveName==0){
                $scope.driveName="";
            }
            // 基本检索URL
            var url = $host.api_url + "/truckAccident?start=" + $scope.start + "&size=" + $scope.size;
            // 检索条件
            var conditionsObj = makeConditions();
            var conditions = _basic.objToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;

            _basic.get(url).then(function (data) {

                if (data.success == true) {

                    // 当前画面的检索信息
                    var pageItems = {
                        pageId: "truck_management",
                        start: $scope.start,
                        size: $scope.size,
                        conditions: conditionsObj
                    };
                    // 将当前画面的条件
                    $rootScope.refObj = {pageArray: []};
                    $rootScope.refObj.pageArray.push(pageItems);
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
                    $scope.truckManagementList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };

    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/truckAccident.csv?" ;
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
        $scope.truckAccidentId=conditions.truckAccidentId;
        $scope.truckType=conditions.truckType;
        $scope.driveName=conditions.driveName;
        $scope.check_operation_startTime=conditions.accidentDateStart;
        $scope.check_operation_endTime=conditions.accidentDateEnd;
        $scope.truckNum=conditions.truckNum;
        $scope.dpRouteTaskId=conditions.dpRouteTaskId;
        $scope.truckAccidentType=conditions.truckAccidentType;
        $scope.underUserName=conditions.underUserName;
        $scope.accidentStatus=conditions.accidentStatus;
        $scope.insureCompany =conditions.companyId;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            truckAccidentId: $scope.truckAccidentId,
            truckType:$scope.truckType,
            driveName:$scope.driveName,
            accidentDateStart: $scope.check_operation_startTime,
            accidentDateEnd: $scope.check_operation_endTime,
            truckNum:$scope.truckNum,
            dpRouteTaskId:$scope.dpRouteTaskId,
            truckAccidentType:$scope.truckAccidentType,
            underUserName:$scope.underUserName,
            accidentStatus:$scope.accidentStatus,
            companyId:$scope.insureCompany
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "look_truck_management" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "truck_management") {
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
        getManagementRecordList();

    }
    initData();




    // 搜索维修记录
        $scope.searchTruckManagement = function () {
            $scope.start=0;
            getManagementRecordList();
        };
        // 分页
        $scope.previous_page = function () {
            $scope.start = $scope.start - $scope.size;
            getManagementRecordList();
        };
        $scope.next_page = function () {
            $scope.start = $scope.start + $scope.size;
            getManagementRecordList();
        };
        // 获取数据
        function queryData () {
            getDriveNameList();
            getTruckNumList();
            $scope.searchTruckManagement();
            getCompanyList();
        };
        queryData();
    }]);