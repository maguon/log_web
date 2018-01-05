app.controller("damage_management_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 月份选择控件
    $('#report_time_start,#report_time_end').MonthPicker({
        Button: false,
        MonthFormat: 'yy-mm'
    });

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
            console.log($scope.endCity);
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
        var reportTimeStart = $("#report_time_start").val();
        var reportTimeEnd = $("#report_time_end").val();
        _basic.get($host.api_url + "/damage?" + _basic.objToUrl({
            damageId:$scope.damageNum,
            damageStatus:$scope.processingStatus,
            vin:$scope.vinCode,
            makeId:$scope.brand,
            declareUserName:$scope.reportPerson,
            createdOnStart:reportTimeStart,
            createdOnEnd:reportTimeEnd,
            underUserName:$scope.responsibilityPerson,
            routeEndId:$scope.endCity,
            receiveId:$scope.distributor,
            damageLinkType:$scope.damage_link_type,
            damageType:$scope.damage_type
        })).then(function (data) {
            if (data.success === true) {
                $scope.damageMamagementList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDamageManagementList();
        $scope.getBrandList();
        $scope.getCityList();
    };
    $scope.queryData();
}]);