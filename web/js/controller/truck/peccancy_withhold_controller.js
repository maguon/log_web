/**
 * Created by star on 2018/6/11.
 */
app.controller("peccancy_withhold_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    var userId = _basic.getSession(_basic.USER_ID);
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
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

    //货车牌号联动查询
    $scope.changeDrivdeId = function(drivdeId){
        _basic.get($host.api_url + "/truckFirst?driveId=" + drivdeId).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0) {
                    $scope.addPeccancyTruckNum = '';
                }
                else{
                    $scope.addPeccancyTruckNum = data.result[0].truck_num;
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
        _basic.get($host.api_url + "/settleHandover?" + _basic.objToUrl({
            driverId:$scope.driverId,
            stut:$scope.peccancyStu,
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



    //打开新增模态框
    $scope.addPeccancy = function (){
        $scope.entrustList = [];
        $scope.addEntrustId = '';
        $scope.newRemark = '';
        $('#addPeccancyItem').modal('open');
    }


    //点击确定 增加完成
    $scope.addPeccancyItem = function (){
        if ($scope.addDrivderId !== undefined && $scope.addPeccancyTruckNum !== undefined && $scope.addPeccancyScore !== undefined
            &&$scope.addPeccancyMoney !== undefined &&$scope.addStartTime !== undefined&&$scope.addEndTime!==undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/settleHandover", {
                insureId: $scope.addDrivderId,
                insureType: $scope.addPeccancyTruckNum,
                insurePlan: $scope.addPeccancyScore,
                financialLoanStatus: $scope.addPeccancyMoney,
                financialLoan: $scope.addStartTime,
                paymentExplain: $scope.addEndTime,
                remark: $scope.newRemark
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addPeccancyItem').modal('close');
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
        $scope.entrustList = [];
        $scope.addEntrustId = '';
        $scope.newRemark = '';
        $('#putPeccancyItem').modal('open');
    }


    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getSettlementData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getSettlementData();
    };

    //获取数据
    function queryData() {
        getDriveNameList();
        getPeccancyData();
    }
    queryData()
}])