app.controller("driver_information_details_controller", ["$scope","$state", "$host", "$stateParams", "_basic", "_config", function ($scope, $state, $host, $stateParams, _basic, _config) {

    var driverId = $stateParams.driverId;
    $scope.driverIdd = $stateParams.driverId;

    // 执行状态
    $scope.taskStatusArr = _config.taskStatus;

    // 里程初始值
    $scope.allDistance = 0;
    $scope.loadDistance = 0;
    $scope.noLoadDistance = 0;

    $scope.start = 0;
    $scope.size = 11;

    // 返回
    $scope.return = function () {
        $state.go($stateParams.from,{from:"driver_information_details"}, {reload: true})
    };

    // 获取司机基本信息
    $scope.getBasicDriverInfo = function () {
        _basic.get($host.api_url + "/drive?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
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
        _basic.get($host.api_url + "/dpRouteTaskList?" + _basic.objToUrl({
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
                $scope.driverDispatchMissionBox = data.result;
                $scope.driverDispatchMissionList = $scope.driverDispatchMissionBox.slice(0, 10);
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

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDispatchMissionList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start +($scope.size-1);
        $scope.getDispatchMissionList();
    };


    //获取公里数
    function getDistance(){
        var p = new Promise(function (resolve, reject) {
            var obj = {
                taskStatus: 10,
                driveId:driverId
            };
            _basic.get($host.api_url + "/driveDistanceLoadStat?" + _basic.objToUrl(obj)).then(function (data) {
                if (data.success == true) {
                    if(data.result.length==0){
                        $scope.driveDetail=[];
                        $scope.driveDetail.no_load_distance = 0;
                        $scope.driveDetail.load_distance = 0;
                    }
                    else{
                        $scope.driveDetail = data.result[0];
                        if ($scope.driveDetail.no_load_distance == null) {
                            $scope.driveDetail.no_load_distance = 0
                        }
                        if ($scope.driveDetail.load_distance == null) {
                            $scope.driveDetail.load_distance = 0
                        }
                    }

                    resolve();
                } else {
                    swal("异常", "", "error")
                }
            });
        });
        return p

    }

    //货车责任
    $scope.getTruckAccident = function(){
        $scope.start = 0;
        $scope.getDriverAccidentInfo();
    }
    // 获取货车责任信息
    $scope.getDriverAccidentInfo = function () {
        _basic.get($host.api_url + "/truckAccident?"+ _basic.objToUrl({
            driveId: driverId,
            truckAccidentId:$scope.truckAccidentId,
            truckAccidentType: $scope.truckAccidentType,
            accidentDateStart: $scope.startTime,
            accidentDateEnd: $scope.endTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayAccident = data.result;
                $scope.driverAccidentList = $scope.boxArrayAccident.slice(0, 10);
                if ($scope.start > 0) {
                    $("#preTruck").show();
                }
                else {
                    $("#preTruck").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#nextTruck").hide();
                }
                else {
                    $("#nextTruck").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 分页
    $scope.preTruck = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDriverAccidentInfo();
    };

    $scope.nextTruck = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDriverAccidentInfo();
    };



    // 获取商品车责任信息
    $scope.getCarResList = function () {
        _basic.get($host.api_url + "/damage?driveId=" + driverId).then(function (data) {
            if (data.success === true) {
                $scope.carResList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    // 显示货车责任模态框
    $scope.showTruckAccidentModal = function (accidentInfo) {
        $("#truckAccidentDetailsModal").modal("open");
        _basic.get($host.api_url + "/truckAccident?truckAccidentId="+accidentInfo).then(function (data) {
            if (data.success === true) {
                $scope.truckAccidentDetail = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 显示商品车责任模态框
    $scope.showCarAccidentModal = function (accidentInfo) {
        $("#carAccidentDetailsModal").modal("open");

        $scope.carAccidentDetail = accidentInfo;
    };

    //违章扣款
    $scope.getPeccancy = function (){
        $scope.start = 0;
        $scope.getPeccancyList();
    };
    $scope.getPeccancyList = function (){
        _basic.get($host.api_url + "/drivePeccancy?" + _basic.objToUrl({
            driveId:driverId,
            startDateStart:$scope.startPeccancyTime,
            endDateEnd:$scope.endPeccancyTime,
            fineStatus:$scope.peccancyStu,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.peccancyList = $scope.boxArray.slice(0, 10);
                if ($scope.start > 0) {
                    $("#prePeccancy").show();
                }
                else {
                    $("#prePeccancy").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#nextPeccancy").hide();
                }
                else {
                    $("#nextPeccancy").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //详情
    $scope.detailPeccancy = function(id){
        $('#putPeccancyItem').modal('open');
        _basic.get($host.api_url + "/drivePeccancy?peccancyId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putPeccancyList = [];
                }
                else{
                    $scope.putPeccancyList = data.result[0];
                    $scope.putPeccancyList.start_date = moment(data.result[0].start_date).format('YYYY-MM-DD');
                    $scope.putPeccancyList.end_date =  moment(data.result[0].end_date).format('YYYY-MM-DD');
                    $scope.putPeccancyList.drive_id = data.result[0].drive_id;
                }
            }
        })
    }

    $scope.putPeccancyItem2 = function (){
        $('#putPeccancyItem').modal('close');
    }
    // 分页
    $scope.pre_btnPeccancy = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getDriverAccidentInfo();
    };
    $scope.next_btnPeccancy = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getDriverAccidentInfo();
    };

    //超量扣款
    $scope.getExceedOil= function (){
        $scope.start = 0;
        $scope.getExceedOilList();
    };
    $scope.getExceedOilList = function (){
        _basic.get($host.api_url + "/driveExceedOil?" + _basic.objToUrl({
            driveId:driverId,
            dpRouteTaskId:$scope.dispatchId,
            taskPlanDateStart:$scope.driveStartTime,
            taskPlanDateEnd:$scope.driveEndTime,
            exceedType:$scope.exceedType,
            fineStatus:$scope.ExceedOilStu,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.ExceedOilList = $scope.boxArray.slice(0, 10);
                if ($scope.start > 0) {
                    $("#preExceedOil").show();
                }
                else {
                    $("#preExceedOil").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#nextExceedOil").hide();
                }
                else {
                    $("#nextExceedOil").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    $scope.putExceedOil =function (id){
        $('#putExceedOilItem').modal('open');
        _basic.get($host.api_url + "/driveExceedOil?exceedOilId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putExceedOilList = [];
                }
                else{
                    $scope.putExceedOilList = data.result[0];
                    $scope.putExceedOilList.task_plan_date = moment(data.result[0].task_plan_date).format('YYYY-MM-DD');
                }
            }
        })
    }
    $scope.putExceedOilItem2 = function (){
        $('#putExceedOilItem').modal('close');
    }
    // 分页
    $scope.pre_btnExceedOil = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.getExceedOilList();
    };
    $scope.next_btnExceedOil = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.getExceedOilList();
    };




    // 获取数据
    $scope.queryData = function () {
        $scope.getBasicDriverInfo();
        $scope.getStartCityInfo();
        getDistance();
    };
    $scope.queryData();
}]);