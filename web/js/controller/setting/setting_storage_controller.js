

// 仓库设置
app.controller("setting_storage_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);

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
                remark: $scope.newStorageRemark
            };
            _basic.post($host.api_url + "/user/" + userId + "/storage", obj).then(function (data) {
                if (data.success == true) {
                    swal("新增成功", "", "success");
                    // searchAll();
                    $("#newStorage").modal("close");
                    $state.go("add_setting_storage",{id:data.id,from:"setting_storage"}, {reload:true});
                }else {
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
        if (isValid) {
            var obj = {
                storageName: $scope.selfStorage.storage_name,
                remark: $scope.selfStorage.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/storage/" + id, obj).then(function (data) {
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
        if (status == 0) {
            st = 1
        } else {
            st = 0
        }
            _basic.put($host.api_url + "/user/" + userId + "/storage/" + id + "/storageStatus/" + st, {}).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                    searchAll();
                }
            })
        }
}]);

