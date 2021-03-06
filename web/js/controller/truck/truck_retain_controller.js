

/*
* 车辆管理--交车暂扣款
* */
app.controller("truck_retain_controller", ["$scope","$rootScope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope,$rootScope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.size = 11;
    $scope.start = 0;
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    $('#add_start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
    //获取上个月年月
    function getLastMonth(){//获取上个月日期
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        if(month<10){
            month ='0'+month;
        }

        if(month == 0){
            year = year -1;
            month = 12;
        }
        $scope.startMonth = year.toString()+month.toString();
        $scope.addStartMonth = year.toString()+month.toString();

    }
    getLastMonth()

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
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


    //查询功能
    $scope.searchList = function (){
        $scope.start = 0;
        getData();
    };

    //获取查询数据
    function getData(){
        if( $('#start_month').val()!==''){
            $scope.startMonth = $('#start_month').val();
        }

        // 基本检索URL
        var url = $host.api_url + "/driveSalaryRetain?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditions = _basic.objToUrl({
            driveId:$scope.driveName,
            yearMonth:$scope.startMonth,
            type:2
        });
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.boxArray = data.result;
                $scope.securityList = $scope.boxArray.slice(0, 10);
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




    // 单条数据录入
    $scope.addItem = function () {
        $scope.addDrivderId = null;
        $scope.driveNameList=[];
        $scope.addTruckRetainFee=0;
        $scope.addRemark ="";
        getDriveNameList();
        $("#new_driver_withhold").modal("open");
    };


    // 新增信息
    $scope.addCarItem = function () {
        if($('#add_start_month').val()!==''){
            $scope.addStartMonth = $('#add_start_month').val();
        }
        else {
            swal("月份必填！", "", "warning")
        }
        if ($scope.addDrivderId!==null&&$scope.addDrivderId!==''&&$scope.addStartMonth!==''&&$scope.addTruckRetainFee!=='') {
            var obj = {
                "yearMonth":  $scope.addStartMonth,
                "driveId": $scope.addDrivderId.id,
                "truckRetainFee":$scope.addTruckRetainFee,
                "damageRetainFee":  0,
                "damageOpFee":0,
                "type": 2,
                "remark":$scope.addRemark

            };
            _basic.post($host.api_url + "/user/" + userId + "/driveSalaryRetain", obj).then(function (data) {
                if (data.success == true) {
                    getData();
                    $("#new_driver_withhold").modal("close");
                    swal("新增成功！", "", "success");
                }
                else{
                    swal(data.msg, "", "error")
                }
            })
        }
        else{
            swal("请输入完整信息！", "", "warning");
        }
    };


    //修改
    $scope.putItem = function(id){
        $scope.driveSocialSecurityId =id;
        _basic.get($host.api_url + "/driveSalaryRetain?driveSalaryRetainId="+id).then(function (data) {
            if (data.success == true) {
                $scope.socialSecurity = data.result[0];
                $scope.socialSecurity.total=data.result[0].drive_name+"    "+data.result[0].tel;

            } else {
                swal(data.msg, "", "error");
            }
        })
        $("#put_driver_withhold").modal("open");
    }
    $scope.putCarItem =function (){
        _basic.put($host.api_url + "/user/" + userId + "/driveSalaryRetain/" + $scope.driveSocialSecurityId, {
            "yearMonth":  $scope.socialSecurity.y_month,
            "driveId":$scope.socialSecurity.drive_id,
            "truckRetainFee": $scope.socialSecurity.truck_retain_fee,
            "damageRetainFee":  0,
            "damageOpFee":0,
            "type": 2,
            "remark": $scope.socialSecurity.remark
        }).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                $('#put_driver_withhold').modal('close');
                getData();
            } else {
                swal(data.msg, "", "error");
            }
        })
    }


    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getData();
    };

    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getData();
    };

    getDriveNameList ();
    getData();







}])