/*
  Created by star on 2018/1/10
 */
app.controller("setting_files_controller", ["$scope", "$rootScope", "$host", "_basic", function ($scope, $rootScope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.ImportedFilesList = [];
    $scope.fileDetailObj = {
        fileName: "",
        fileLength: 0,
        fileRecord: []
    };
    $scope.start = 0;
    $scope.size = 11;
    $("#pre").hide();
    $("#next").hide();

    //管理员
    function getManagerList() {
        _basic.get($host.api_url + "/user").then(function (data) {
            if (data.success === true) {
                $scope.settingManagerList = data.result;
                $("#manager").select2({
                    placeholder: '请选择',
                    containerCssClass : 'select2_dropdown'
                });
            }
        });
    };

    //点击下载
    $scope.export = function(id){
        window.open($host.file_url + "/user/" +userId+'/file/'+id);
    }

    // 点击查询
    $scope.getMatchFiles = function () {
        $scope.start = 0;
        $scope.searchMatchFiles();
    };

    // 根据条件搜索文件
    $scope.searchMatchFiles = function () {
        if ($scope.manager==null||$scope.manager==""||$scope.startDate == null || $scope.endDate == null || $scope.startDate == "" || $scope.endDate == "") {
            swal('请输入完整的查询条件', "", "error");
        }
        else{
            _basic.get($host.file_url + '/user/' + $scope.manager  + '/file?' + _basic.objToUrl({
                fileType: 1,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                start:$scope.start.toString(),
                size:$scope.size
            })).then(function (data) {
                if (data.success === true) {
                    $scope.boxArray = data.result;
                    $scope.importedFilesList = $scope.boxArray.slice(0, 10);
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
    };


    $scope.changeDetail = function (file) {
        $scope.fileDetailObj.fileName = file.filename;
        $scope.fileDetailObj.fileLength = file.length;
        $scope.fileDetailObj.id = file._id;
        $("#file_detail_modal").modal("open");
        _basic.get($host.api_url + '/carList?uploadId=' + $scope.fileDetailObj.id).then(function (data) {
            if (data.success === true) {
                $scope.fileDetailObj.fileRecord = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    //删除
    $scope.delete = function(id){
        swal({
                title: "确定删除所在车辆吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
        function (isConfirm) {
            if (isConfirm) {
                _basic.delete($host.api_url + "/user/" + userId + "/upload/" +  id).then(function (data) {
                    if (data.success === true) {
                       swal('删除成功！','','success')
                    }
                    else {
                        swal(data.msg, "", "error");
                    }
                });
            }
    });
    }


    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.searchMatchFiles();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchMatchFiles();
    };

    getManagerList();
}]);