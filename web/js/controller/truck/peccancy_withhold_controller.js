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
                }).on('change', function () {
                    $scope.changeDrivde($scope.putPeccancyList.drive_id);
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }


    //货车牌号联动查询
    $scope.changeDrivdeId = function(drivdeId){
        _basic.get($host.api_url + "/truckFirst?driveId=" + drivdeId).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0) {
                    $scope.addPeccancyTruckNum = '';
                }
                else{
                    $scope.addPeccancyTruckNum = data.result[0].truck_num;
                    $scope.addPeccancyTruckId = data.result[0].id;
                }

            } else {
                swal(data.msg, "", "error")
            }
        });
    }
    $scope.changeDrivde = function(drivdeId){
        _basic.get($host.api_url + "/truckFirst?driveId=" + drivdeId).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0) {
                    $scope.putPeccancyList.truck_num = '';
                }
                else{
                    $scope.putPeccancyList.truck_num = data.result[0].truck_num;
                    $scope.putPeccancyList.id = data.result[0].id;
                }

            } else {
                swal(data.msg, "", "error")
            }
        });
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
            fineStatus:$scope.peccancyStu
        };
        window.open($host.api_url + "/drivePeccancy.csv?" + _basic.objToUrl(obj));
    };

    //打开新增模态框
    $scope.addPeccancy = function (){
        $scope.addDrivderId='';
        $scope.driveNameList =[];
        $scope.addPeccancyTruckNum='';
        $scope.addPeccancyScore='';
        $scope.addPeccancyMoney='';
        $scope.addStartTime='';
        $scope.addEndTime='';
        $scope.newRemark='';
        getDriveNameList ();
        $('#addPeccancyItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addPeccancyItem = function (){
        if ($scope.addDrivderId !== undefined && $scope.addPeccancyTruckNum !== '' && $scope.addPeccancyScore !== undefined
            &&$scope.addPeccancyMoney !== undefined &&$scope.addStartTime !== undefined&&$scope.addEndTime!==undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/drivePeccancy", {
                driveId: $scope.addDrivderId,
                truckId: $scope.addPeccancyTruckId,
                fineScore: $scope.addPeccancyScore,
                fineMoney: $scope.addPeccancyMoney,
                startDate: $scope.addStartTime,
                endDate: $scope.addEndTime,
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
                    getDriveList($scope.putPeccancyList.drive_id);
                }
            }
        })
    }


    //点击确定 修改完成
    $scope.putPeccancyItem = function (){
        if ( $scope.putPeccancyList.drive_id !== undefined && $scope.putPeccancyList.truck_num!== '' && $scope.putPeccancyList.fine_score !== undefined
            &&$scope.putPeccancyList.fine_money!== undefined &&$scope.putPeccancyList.start_date !== undefined&&$scope.putPeccancyList.end_date!==undefined) {
            _basic.put($host.api_url + "/user/" + userId + "/peccancy/"+$scope.id, {
                driveId: $scope.putPeccancyList.drive_id,
                truckId:$scope.putPeccancyList.id,
                fineScore: $scope.putPeccancyList.fine_score,
                fineMoney: $scope.putPeccancyList.fine_money,
                startDate: $scope.putPeccancyList.start_date,
                endDate: $scope.putPeccancyList.end_date,
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