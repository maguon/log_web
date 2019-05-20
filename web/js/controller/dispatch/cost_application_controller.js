app.controller("cost_application_controller", ["$scope", "$state","$stateParams", "$host", "_basic",  "_config",function ($scope, $state,$stateParams, $host, _basic,_config) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();

    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driveName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown'
                });
                $('#addDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    //获取货车牌号
    function getTruckNum(text) {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAllList = data.result;
                if(text==''&&text==undefined){
                    $('#addTruckId').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    $('#addTruckId').select2({
                        placeholder:text,
                        containerCssClass: 'select2_dropdown'
                    });
                    $scope.addTruckNumber=text;
                }
                $('#truckNum').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }


    $scope.changeDriver = function (driver){
        _basic.get($host.api_url + "/drive?driveId="+driver).then(function (data) {
            if (data.success == true) {
                $scope.addTruck= data.result[0].truck_id;
                getTruckNum(data.result[0].truck_num);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };


    //查询
    $scope.getCost = function () {
        $scope.start = 0;
        searchCost();
    }

    // 根据条件搜索
    function searchCost() {

            _basic.get($host.api_url+ '/dpRouteTaskFee?' + _basic.objToUrl({
                driveId: $scope.drivderId,
                truckId: $scope.truckNum,
                createdOnStart:$scope.instruct_starTime,
                createdOnEnd:$scope.instruct_endTime,
                status:$scope.getStatus,
                start:$scope.start,
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.costList = $scope.boxArray.slice(0, 10);
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


    //添加
    $scope.addCost = function (){
        $scope.addDrivderId = '';
        $scope.addTruckId = '';
        $scope.addPeccancyTruckId = "";
        $scope.addDate = "";
        $scope.addSingle = "";
        $scope.driveNameList=[];
        $scope.truckNumListAllList=[];
        getDriveNameList();
        getTruckNum();
        $('#add_cost').modal('open');
    }


    // 提交新增信息
    $scope.finishCost = function () {
        if( $scope.addTruckId!==undefined&& $scope.addTruckId!==''){
            $scope.addTruck = $scope.addTruckId.id;
            $scope.addTruckNumber= $scope.addTruckId.truck_num;
        }
        if($scope.addDate==''|| $scope.addSingle==''||$scope.addDrivderId== ''||$scope.addTruck==''){
            swal('请输入完整信息!', "", "error")
        }
        else {
            var totalP= $scope.addDate*$scope.addSingle;
            _basic.post($host.api_url + "/user/" + userId + "/dpRouteTaskFee", {
                "driveId":  $scope.addDrivderId.id,
                "driveName": $scope.addDrivderId.drive_name,
                "truckId":  $scope.addTruck,
                "truckNum": $scope.addTruckNumber,
                "dayCount": $scope.addDate,
                "singlePrice": $scope.addSingle,
                "totalPrice":  totalP
            }).then(function (data) {
                if (data.success == true) {
                    $('#add_cost').modal('close');
                    swal("新增成功", "", "success");
                    searchCost();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    };

    //修改
    $scope.putCost = function (id){
        $scope.dpRouteTaskFeeId=id;
        _basic.get($host.api_url+ '/dpRouteTaskFee?dpRouteTaskFeeId='+id).then(function (data) {
            if (data.success === true) {
                $scope.putList = data.result[0];
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#put_cost').modal('open');
    }

    $scope.finishCost = function (){
        if($scope.putList.day_count !== "" &&  $scope.putList.single_price!== ''){
          var  totalPut =$scope.putList.day_count*$scope.putList.single_price;
            _basic.put($host.api_url + "/user/" + userId + "/dpRouteTaskFee/"+$scope.dpRouteTaskFeeId,{
                "dayCount": $scope.putList.day_count,
                "singlePrice": $scope.putList.single_price,
                "totalPrice":  totalPut
            }).then(function (data) {
                if (data.success === true) {
                    $('#put_cost').modal('close');
                    swal("修改成功", "", "success");
                    searchCost();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchCost();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchCost();
    };



    getDriveNameList();
    getTruckNum();
    searchCost();

}]);