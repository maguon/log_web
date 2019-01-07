/**
 * Created by star on 2018/6/11.
 */
app.controller("peccancy_withhold_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
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
                $('#addDrivderId').select2({
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
    function getDriveList(selectText){
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveList = data.result;
                $('#putDrivderId').select2({
                    placeholder: selectText,
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#addPeccancyTruckId').select2({
                        placeholder: "货车牌号",
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
      else{
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumListList = data.result;
                    $('#putTruckNum').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    //查询功能
    $scope.getPeccancy = function (){
        $scope.start = 0;
        getPeccancyData();
    }

    //获取查询数据
    function getPeccancyData(){
        _basic.get($host.api_url + "/drivePeccancy?" + _basic.objToUrl({
            driveId:$scope.driverId,
            statStatus:$scope.peccancyStu,
            truckType:$scope.truckType,
            handleDateStart:$scope.getStartTime,
            handleDateEnd:$scope.getEndTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.peccancyList = $scope.boxArray.slice(0, 10);
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
    }

    // 数据导出
    $scope.export = function () {
        var obj = {
            driveId:$scope.driverId,
            fineStatus:$scope.peccancyStu,
            truckType:$scope.truckType,
            startDateStart:$scope.getStartTime,
            endDateEnd:$scope.getEndTime
        };
        window.open($host.api_url + "/drivePeccancy.csv?" + _basic.objToUrl(obj));
    };

    //打开新增模态框
    $scope.addPeccancy = function (){
        $scope.addDrivderId='';
        $scope.driveNameList =[];
        $scope.addPeccancyTruckId='';
        $scope.addPeccancyScore='';
        $scope.addPeccancyMoney='';
        $scope.addStartTime='';
        $scope.addEndTime='';
        $scope.addDealMoney='';
        $scope.handleDate='';
        $scope.addPlce='';
        $scope.newRemark='';
        getDriveNameList ();
        getTruckNum();
        $('#addPeccancyItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addPeccancyItem = function (){
        if ($scope.addDrivderId !== "" && $scope.addPeccancyTruckId !== '' && $scope.addPeccancyScore !== ''
            &&$scope.addPeccancyMoney !== '' &&$scope.addStartTime !== ""&&$scope.addEndTime!==''&&$scope.addDealMoney!==''&&$scope.handleDate!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/drivePeccancy", {
                driveId: $scope.addDrivderId,
                truckId: $scope.addPeccancyTruckId.id,
                truckType: $scope.addPeccancyTruckId.truck_type,
                fineScore: $scope.addPeccancyScore,
                trafficFine: $scope.addPeccancyMoney,
                fineMoney: $scope.addDealMoney,
                startDate: $scope.addStartTime,
                endDate: $scope.addEndTime,
                handleDate:$scope.handleDate,
                address: $scope.addPlce,
                remark: $scope.newRemark
            }).then(function (data) {
                if (data.success === true) {
                    $('#addPeccancyItem').modal('close');
                    swal("新增成功", "", "success");
                    getPeccancyData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    //打开修改模态框
    $scope.putPeccancy = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $scope.truckNumListList =[];
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
                    $scope.putPeccancyList.handle_date = moment(data.result[0].handle_date).format('YYYY-MM-DD');
                    $scope.putPeccancyList.drive_id = data.result[0].drive_id;
                    getDriveList($scope.putPeccancyList.drive_id);
                    getTruckNum($scope.putPeccancyList.truck_num)
                }
            }
        })
    }


    //点击确定 修改完成
    $scope.putPeccancyItem = function (){
        if ( $scope.putPeccancyList.drive_id !== null && $scope.putPeccancyList.truck_id!== null && $scope.putPeccancyList.fine_score !== null
            &&$scope.putPeccancyList.fine_money!== null &&$scope.putPeccancyList.start_date !== ''&&$scope.putPeccancyList.end_date!==''
            &&$scope.putPeccancyList.truck_type!==null
            &&$scope.putPeccancyList.traffic_fine!== null
            &&$scope.putPeccancyList.handle_date!=='') {
            _basic.put($host.api_url + "/user/" + userId + "/peccancy/"+$scope.id, {
                driveId: $scope.putPeccancyList.drive_id,
                truckId:$scope.putPeccancyList.truck_id,
                fineScore: $scope.putPeccancyList.fine_score,
                trafficFine: $scope.putPeccancyList.traffic_fine,
                startDate: $scope.putPeccancyList.start_date,
                endDate: $scope.putPeccancyList.end_date,
                truckType: $scope.putPeccancyList.truck_type,
                fineMoney: $scope.putPeccancyList.fine_money,
                handleDate:$scope.putPeccancyList.handle_date,
                address: $scope.putPeccancyList.address,
                remark: $scope.putPeccancyList.remark
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $('#putPeccancyItem').modal('close');
                    getPeccancyData();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }

    $scope.putPeccancyItem2 = function (){
        $('#putPeccancyItem').modal('close');
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getPeccancyData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getPeccancyData();
    };

    //获取数据
    function queryData() {
        getDriveNameList();
        getPeccancyData();
    }
    queryData()
}])