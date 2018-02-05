/**
 * Created by star on 2018/2/1
 */
app.controller("setting_repair_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 10;
    $scope.search_id='';
    $scope.station='';
    // 搜索所有查询
    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - $scope.size;
        searchAll();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + $scope.size;
        searchAll();
    };
    var searchAll = function () {
        _basic.get($host.api_url + "/repairStation?start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
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
                $scope.repairStationArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 点击按钮查询
    $scope.searchRepairStationDetail = function () {
        var obj = {
            repairStationId: $scope.search_id,
            repairStationName: $scope.station
        };
        _basic.get($host.api_url + "/repairStation?"+ _basic.objToUrl(obj)+"&start=" + $scope.start + "&size=" + $scope.size).then(function (data) {
            if (data.success == true) {
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

                $scope.repairStationArray = data.result;
            }
        })
    }
    $scope.getList = function () {
        // 维修站
        _basic.get($host.api_url + "/repairStation").then(function (data) {
            if (data.success == true) {
                $scope.repairSectionList = data.result;
            }
        });
    }
    $scope.getList();
    $scope.clickAdd = function () {
        $scope.submitted = false;
        $scope.newName = "";
        $scope.newAddress = "";
        $scope.newRemark = "";
        $(".modal").modal();
        $("#clickAdd").modal("open");
    };
     //提交新增
    $scope.createRepairStation = function () {
        $scope.submitted = true;
            var obj = {
                repairStationName: $scope.newName,
                address: $scope.newAddress,
                remark: $scope.newRemark
            };
            _basic.post($host.api_url + "/user/" + userId+"/repairStation" , obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    $('#clickAdd').modal('close');
                    $scope.repairStationArray.push(obj)
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
     // 查看详情
    $scope.clickLook = function (id) {
        $(".modal").modal();
        $("#clickLook").modal("open");
         _basic.get($host.api_url +'/repairStation?repairStationId='+id).then(function (data) {
             if (data.success == true) {
                $scope.look_operation = data.result[0];
            } else {
                swal(data.msg, "", "error");
             }
         })
    };
     // 修改
    $scope.changeRepairList = function (id) {
        $scope.submitted = true;
        var obj = {
            repairStationName:$scope.look_operation.repair_station_name,
            address: $scope.look_operation.address,
            remark: $scope.look_operation.remark
        };
         _basic.put($host.api_url + "/user/" + userId+"/repairStation/" +id, obj).then(function (data) {
             if (data.success == true) {
                 console.log(data)
                swal("修改成功", "", "success");
                $('#clickLook').modal('close');
                searchAll();
            } else {
                swal(data.msg, "", "error");
             }
        })
    };
    // 停启用
    $scope.changeStatus = function (event,status,id) {
        if (status == 1) {
            status = 0
            swal({
                    title: "确定修改此状态吗?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    closeOnConfirm: true
                },
                function (flag) {
                    if(flag){
                        _basic.put($host.api_url + "/user/" + userId + '/repairStation/' + id + "/repairStationStatus/" + status
                            , {}).then(function (data) {
                            if (data.success !== true) {
                                swal(data.msg, "", "error");
                            }else{
                                $scope.searchRepairStationDetail();
                            }
                        })
                    }else {
                        event.target.checked =!event.target.checked;
                    }
                })
        } else {
            status = 1
            _basic.put($host.api_url + "/user/" + userId + '/repairStation/' + id + "/repairStationStatus/" + status
                , {}).then(function (data) {
                if (data.success !== true) {
                    swal(data.msg, "", "error");
                }else{
                    $scope.searchRepairStationDetail();
                }
            })
         }
    }
    searchAll();
}]);