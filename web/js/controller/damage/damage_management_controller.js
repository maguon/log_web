app.controller("damage_management_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_basic", "_config", function ($scope, $rootScope,$state,$stateParams,$host, _basic, _config) {

    $scope.start = 0;
    $scope.size = 21;
    // 获取config数据
    $scope.damageLinkType = _config.damageLinkType;
    $scope.damageType = _config.damageType;
    $scope.user_info_obj = _config.userTypes;

    // 下载csv
    $scope.downloadCsvFile = function () {
        // 基本检索URL
        var url = $host.api_url + "/damage.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    };

    // 获取品牌列表
    $scope.getBrandList = function () {
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取城市列表
    $scope.getCityList = function () {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#end_city_list').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 根据城市id获取经销商信息
    $scope.getReceiveList = function () {
        if($scope.endCity == 0 || $scope.endCity == "" || $scope.endCity == null){
            $scope.endCity = null;
            $scope.receiveList = [];
        }
        else{
            _basic.get($host.api_url + "/receive?cityId=" + $scope.endCity).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                    $('#dealer').select2({
                        placeholder: '经销商',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取质损管理列表
    function getDamageManagementList() {
        // 基本检索URL
        var url = $host.api_url + "/damage?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {

                // 当前画面的检索信息
                var pageItems = {
                    pageId: "damage_management",
                    start: $scope.start,
                    size: $scope.size,
                    conditions: conditionsObj
                };
                // 将当前画面的条件
                $rootScope.refObj = {pageArray: []};
                $rootScope.refObj.pageArray.push(pageItems);
                $scope.boxArray = data.result;
                $scope.damageMamagementList = $scope.boxArray.slice(0, 20);
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

    // 点击按钮进行查询
    $scope.searchDamageManagementList = function () {
        $scope.start = 0;
        getDamageManagementList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getDamageManagementList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getDamageManagementList();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.damageNum=conditions.damageId;
        $scope.processingStatus=conditions.damageStatus;
        $scope.vinCode=conditions.vinCode;
        $scope.brand=conditions.makeId;
        $scope.reportPerson=conditions.declareUserName;
        $scope.reportTimeStart=conditions.createdOnStart;
        $scope.reportTimeEnd=conditions.createdOnEnd;
        $scope.titleName=conditions.underUserType;
        $scope.responsibilityPerson=conditions.underUserName;
        $scope.endCity=conditions.routeEndId;
        $scope.distributor=conditions.receiveId;
        $scope.damage_link_type=conditions.damageLinkType;
        $scope.damage_type=conditions.damageType;
        $scope.hangStatus=conditions.hangStatus;
        $scope.deal_startTime =conditions.endDateStart;
        $scope.deal_endTime =conditions.endDateEnd;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var endStart=null;
        var endEnd=null;
        if($scope.deal_startTime==undefined){
            endStart=null
        }
        else {
            endStart=moment($scope.deal_startTime).format('YYYYMMDD')
        }
        if($scope.deal_endTime==undefined){
            endEnd=null
        }
        else {
            endEnd=moment($scope.deal_endTime).format('YYYYMMDD')
        }
        return {
            damageId:$scope.damageNum,
            damageStatus:$scope.processingStatus,
            vinCode:$scope.vinCode,
            makeId:$scope.brand,
            declareUserName:$scope.reportPerson,
            createdOnStart:$scope.reportTimeStart,
            createdOnEnd:$scope.reportTimeEnd,
            underUserType:$scope.titleName,
            underUserName:$scope.responsibilityPerson,
            routeEndId:$scope.endCity,
            receiveId:$scope.distributor,
            damageLinkType:$scope.damage_link_type,
            damageType:$scope.damage_type,
            endDateStart: endStart,
            endDateEnd:endEnd,
            hangStatus:$scope.hangStatus
        };
    }


    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "damage_management_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "damage_management") {
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
        $scope.getReceiveList();
        // 查询数据
        getDamageManagementList();

    }
    initData();



    // 获取数据
    $scope.queryData = function () {
        $scope.getBrandList();
        $scope.getCityList();
    };
    $scope.queryData();
}]);