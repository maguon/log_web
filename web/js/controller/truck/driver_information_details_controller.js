app.controller("driver_information_details_controller", ["$scope", "$host", "$stateParams", "_basic", "_config", function ($scope, $host, $stateParams, _basic, _config) {

    var driverId = $stateParams.driverId;
    $scope.driverIdd = $stateParams.driverId;

    // 执行状态
    $scope.taskStatusArr = _config.taskStatus;

    // 里程初始值
    $scope.allDistance = 0;
    $scope.loadDistance = 0;
    $scope.noLoadDistance = 0;

    $scope.start = 0;
    $scope.size = 10;

    // 获取司机基本信息
    $scope.getBasicDriverInfo = function () {
        _basic.get($host.api_url + "/drive?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                if(data.result[0].drive_image != null){
                    data.result[0].drive_image = $host.file_url + '/image/' + data.result[0].drive_image;
                }
                else{
                    data.result[0].drive_image = "../assets/images/id_image_b.png"
                }

                if(data.result[0].driver_image_re != null){
                    data.result[0].driver_image_re = $host.file_url + '/image/' + data.result[0].driver_image_re;
                }
                else{
                    data.result[0].driver_image_re = "../assets/images/drive_image_back_b.png"
                }

                if(data.result[0].license_image != null){
                    data.result[0].license_image = $host.file_url + '/image/' + data.result[0].license_image;
                }
                else{
                    data.result[0].license_image = "../assets/images/drive_image_b.png"
                }

                if(data.result[0].op_license_image != null){
                    data.result[0].op_license_image = $host.file_url + '/image/' + data.result[0].op_license_image;
                }
                else{
                    data.result[0].op_license_image = "../assets/images/permit_image_b.png"
                }

                if(data.result[0].driver_avatar_image != null){
                    data.result[0].driver_avatar_image = $host.file_url + '/image/' + data.result[0].driver_avatar_image;
                }
                else{
                    data.result[0].driver_avatar_image = "../assets/images/no_driver_img.png"
                }
                $scope.driverDetails = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 点击查看图片大图
    var viewer;
    $scope.lookCertificatesImg = function () {
        viewer = new Viewer(document.getElementById('certificates_img'), {
            url: 'data-original'
        });
    };

    // 点击查询
    $scope.searchDriverInfoList = function () {
        $scope.start = 0;
        $scope.getDispatchMissionList();
    };

    // 获取起始城市信息
    $scope.getStartCityInfo = function () {
        _basic.get($host.api_url + "/city").then(function (cityData) {
            if (cityData.success === true) {
                $scope.startCityList = cityData.result;
                $('#start_city_list').select2({
                    placeholder: '始发城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#end_city_list').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(cityData.msg, "", "error");
            }
        });
    };

    // 修改下拉框初始值
    $scope.changeSelInitVal = function () {
        if($scope.startCityId == 0 || $scope.startCityId == "" || $scope.startCityId == null){
            $scope.startCityId = null;
        }
        if($scope.endCityId == 0 || $scope.endCityId == "" || $scope.endCityId == null){
            $scope.endCityId = null;
        }
    };

    // 获取调度任务信息
    $scope.getDispatchMissionList = function () {
        _basic.get($host.api_url + "/dpRouteTask?" + _basic.objToUrl({
            driveId: driverId,
            dpRouteTaskId: $scope.dispatchNum,
            taskStatus: $scope.implementStatus,
            taskPlanDateStart: $scope.planStartTime,
            taskPlanDateEnd: $scope.planEndTime,
            routeStartId: $scope.startCityId,
            routeEndId: $scope.endCityId,
            dateIdStart: $scope.finishStartTime,
            dateIdEnd: $scope.finishEndTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
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
                $scope.driverDispatchMissionList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取司机货车责任信息
    $scope.getDriverAccidentInfo = function () {
        _basic.get($host.api_url + "/truckAccident?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.driverAccidentList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取商品车责任信息
    $scope.getCarResList = function () {
        _basic.get($host.api_url + "/damage?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
                // console.log("data", data);
                $scope.carResList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - $scope.size;
        $scope.getDispatchMissionList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + $scope.size;
        $scope.getDispatchMissionList();
    };

    // 显示货车责任模态框
    $scope.showTruckAccidentModal = function (accidentInfo) {
        $("#truckAccidentDetailsModal").modal("open");
        // console.log("accidentInfo",accidentInfo);
        $scope.truckAccidentDetail = accidentInfo;
    };

    // 显示商品车责任模态框
    $scope.showCarAccidentModal = function (accidentInfo) {
        $("#carAccidentDetailsModal").modal("open");
        // console.log("accidentInfo",accidentInfo);
        $scope.carAccidentDetail = accidentInfo;
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getBasicDriverInfo();
        $scope.getStartCityInfo();
    };
    $scope.queryData();
}]);