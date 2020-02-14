app.controller("damage_declaration_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {

    $scope.start = 0;
    $scope.size = 21;
    $scope.processingStatus = "";
    $scope.vinCode = "";
    //申报日期
    $scope.reportStart=undefined;
    $scope.reportEnd=undefined;
    $scope.damageList=[];
    $("#pre").hide();
    $("#next").hide();
    // 获取质损列表
    $scope.getDamageInfoList = function () {
        // 基本检索URL
        var url = $host.api_url + "/damage?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (damageData) {

            if (damageData.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "damage_declaration",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = damageData.result;
                $scope.damageList = $scope.boxArray.slice(0, 20);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (damageData.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
            else {
                swal(damageData.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchDamageInfoList = function () {
        $scope.start = 0;
        $scope.reportStart=$scope.reportTimeStart;
        $scope.reportEnd=$scope.reportTimeEnd;
        if(($scope.reportStart==undefined||$scope.reportEnd==undefined||$scope.reportStart==null
            ||$scope.reportEnd==null||$scope.reportStart==''||$scope.reportEnd=='')&&($scope.vinCode==undefined||$scope.vinCode==''||$scope.vinCode==null)){
            $scope.damageList=[];
            $scope.reportStart=undefined;
            $scope.reportEnd=undefined;
            $scope.vinCode=undefined;
            swal('请输入完整的申报时间或VIN', "", "error");
            $("#pre").hide();
            $("#next").hide();
        }
        else {
            $scope.getDamageInfoList();
        }

    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDamageInfoList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDamageInfoList();
    };

    // 数据导出
    $scope.export = function () {
        $scope.reportStart=$scope.reportTimeStart;
        $scope.reportEnd=$scope.reportTimeEnd;
        if(($scope.reportStart==undefined||$scope.reportEnd==undefined||$scope.reportStart==null
            ||$scope.reportEnd==null||$scope.reportStart==''||$scope.reportEnd=='')&&($scope.vinCode==undefined||$scope.vinCode==''||$scope.vinCode==null)){
            $scope.damageList=[];
            $scope.reportStart=undefined;
            $scope.reportEnd=undefined;
            $scope.vinCode=undefined;
            swal('请输入完整的申报时间或VIN', "", "error");
            $("#pre").hide();
            $("#next").hide();
        }
        else {
            // 基本检索URL
            var url = $host.api_url + "/damageBase.csv?" ;
            // 检索条件
            var conditionsObj = makeConditions();
            var conditions = _basic.objToUrl(conditionsObj);
            // 检索URL
            url = conditions.length > 0 ? url + "&" + conditions : url;
            window.open(url);
        }


    };
    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.reportTimeStart=conditions.createdOnStart;
        $scope.reportTimeEnd=conditions.createdOnEnd;
        $scope.processingStatus=conditions.damageStatus;
        $scope.hangStatus=conditions.hangStatus;
        $scope.vinCode=conditions.vinCode;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            createdOnStart: $scope.reportTimeStart,
            createdOnEnd: $scope.reportTimeEnd,
            damageStatus: $scope.processingStatus,
            hangStatus:$scope.hangStatus,
            vinCode:$scope.vinCode
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "damage_declaration_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "damage_declaration") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                // 查询数据
                $scope.getDamageInfoList();
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
        }


    }
    initData();

}]);