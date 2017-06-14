

// 仓库设置
app.controller("setting_storage_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var adminId = _basic.getSession(_basic.USER_ID);

    // 整体查询
    var searchAll = function () {
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success == true) {
                $scope.storage = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    searchAll();

    $scope.newStorage = function () {
        $scope.submitted = false;
        $scope.newStorageName = "";
        $scope.newStorageCol = "";
        $scope.newStorageRoad = "";
        $scope.newStorageRemark = "";

        $(".modal").modal();
        $("#newStorage").modal("open");

    };

    // 新增
    $scope.newStorageForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            var obj = {
                storageName: $scope.newStorageName,
                row: Number($scope.newStorageCol),
                col: Number($scope.newStorageRoad),
                remark: $scope.newStorageRemark
            };
            _basic.post($host.api_url + "/user/" + adminId + "/storage", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    searchAll();
                    $("#newStorage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 查看
    $scope.lookStorage = function (id) {
        $(".modal").modal();
        $("#look_Storage").modal("open");
        _basic.get($host.api_url + "/storage?storageId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.selfStorage = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }
        })
    };
    // 修改
    $scope.lookStorageForm = function (isValid, id) {
        $scope.submitted = true;
        console.log(id);
        if (isValid) {
            var obj = {
                storageName: $scope.selfStorage.storage_name,
                remark: $scope.selfStorage.remark
            };
            console.log(obj)
            _basic.put($host.api_url + "/user/" + adminId + "/storage/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    searchAll();
                    $("#look_Storage").modal("close");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };
    // 修改仓库运营状态
    $scope.changeStorage_status = function (id, status) {
        var st;
        // var str="";
        //
        if (status == 0) {
            // str="启用";
            st = 1
        } else {
            // str="停用";
            st = 0
        }
        // swal({
        //         title: "是否"+str+"?",
        //         text: "",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#DD6B55",
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         closeOnConfirm: false
        //     },
        //     function () {

                _basic.put($host.api_url + "/user/" + adminId + "/storage/" + id + "/storageStatus/" + st, {}).then(function (data) {
                    if (data.success == true) {
                        swal("修改成功", "", "success");
                        searchAll();
                    } else {
                        swal(data.msg, "", "error");
                        searchAll();
                    }
                })
            }
        // );


    // }
}]);

