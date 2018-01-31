app.controller("damage_management_controller", ["$scope", "$host", "_basic", "_config", function ($scope, $host, _basic, _config) {

    $scope.start = 0;
    $scope.size = 20;
    // 获取config数据
    $scope.damageLinkType = _config.damageLinkType;
    $scope.damageType = _config.damageType;

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
            // console.log($scope.endCity);
            _basic.get($host.api_url + "/receive?cityId=" + $scope.endCity).then(function (data) {
                if (data.success === true) {
                    $scope.receiveList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    };

    // 获取质损管理列表
    $scope.getDamageManagementList = function () {
        _basic.get($host.api_url + "/damage?" + _basic.objToUrl({
            damageId:$scope.damageNum,
            damageStatus:$scope.processingStatus,
            vin:$scope.vinCode,
            makeId:$scope.brand,
            declareUserName:$scope.reportPerson,
            createdOnStart:$scope.reportTimeStart,
            createdOnEnd:$scope.reportTimeEnd,
            underUserName:$scope.responsibilityPerson,
            routeEndId:$scope.endCity,
            receiveId:$scope.distributor,
            damageLinkType:$scope.damage_link_type,
            damageType:$scope.damage_type,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
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
                $scope.damageMamagementList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击按钮进行查询
    $scope.searchDamageManagementList = function () {
        $scope.start = 0;
        $scope.getDamageManagementList();
    };

    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getDamageManagementList();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getDamageManagementList();
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.searchDamageManagementList();
        $scope.getBrandList();
        $scope.getCityList();
    };
    $scope.queryData();
}]);