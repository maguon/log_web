/**
 * Created by ASUS on 2017/8/10.
 */


// 仓库设置
app.controller("add_setting_storage_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);

    var from=$stateParams.from;
    var id=$stateParams.id;

    // 返回
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    // 仓库标题查询
    _basic.get($host.api_url + "/storage?storageId="+id).then(function (data) {
        if (data.success == true) {
            $scope.storage = data.result[0];
        } else {
            swal(data.msg, "", "error");
        }
    });
    // // 整体查询
    var searchAll = function () {

        _basic.get($host.api_url + "/storageArea?storageId="+id+"&&areaStatus=1").then(function (data) {
            if (data.success == true) {
                $scope.storageArea = data.result;
            }else {
                swal(data.msg, "", "error");
            }
        });
    };
    searchAll();

    // 新增分区
    $scope.add_newStorage_area = function () {
        $scope.submitted = false;
        $scope.storage_area_Name = "";
        $scope.storage_count = "";
        $scope.storage_are_col = "";
        $scope.storage_are_row = "";

        $(".modal").modal();
        $("#add_newStorage_area").modal("open");

    };

    // 新增
    $scope.new_area_StorageForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                "storageId": id,
                "areaName":   $scope.storage_area_Name,
                // "total": $scope.storage_count,
                "row":  $scope.storage_are_row,
                "col":  $scope.storage_are_col,
            };
            _basic.post($host.api_url + "/user/" + userId +"/storage/"+ id+"/storageArea", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    // searchAll();
                    $("#add_newStorage_area").modal("close");
                    searchAll();
                }else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };


    // 修改查看仓库分区
    $scope.amend_storageArea = function (areaId) {
        $scope.amend_submitted=false;
        $(".modal").modal();
        $("#amend_StorageArea").modal("open");
        _basic.get($host.api_url + "/storageArea?areaId=" + areaId).then(function (data) {
            if (data.success == true) {
                $scope.selfstorageArea = data.result[0];
                $scope.storageArea_status= $scope.selfstorageArea.area_status;
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改仓库分区状态
    $scope.changeStorageArea_status = function (id,status) {
        if (status == 0) {
            // str="启用";
            status = 1;

        } else {
            // str="停用";
            status = 0;
        }
            _basic.put($host.api_url + "/user/" + userId + "/storageArea/" + id+"/areaStatus/"+status,{}).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    _basic.get($host.api_url + "/storageArea?areaId=" + id).then(function (data) {
                        if (data.success == true) {
                            $scope.selfstorageArea = data.result[0];
                            $scope.storageArea_status= $scope.selfstorageArea.area_status;
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                } else {
                    swal(data.msg, "", "error");
                }
            })
    };
    
    // 修改仓库分区名称
    $scope.amend_StorageArea=function (isValid,areaId) {
        $scope.amend_submitted=true;
        if(isValid){
            var obj={
                areaName:$scope.selfstorageArea.area_name
            };
            _basic.put($host.api_url + "/user/" + userId + "/storageArea/" + areaId,obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $("#amend_StorageArea").modal("close");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        
    }

}]);

