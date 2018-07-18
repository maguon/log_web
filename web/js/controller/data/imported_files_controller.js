/*
  Created by star on 2018/1/10
 */
app.controller("imported_files_controller", ["$scope", "$rootScope", "$host", "_basic", function ($scope, $rootScope, $host, _basic) {

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

    //点击下载
    $scope.export = function(id){
        window.open($host.file_url + "/user/" +userId+'/file/'+id);
    }

    // 点击查询
    $scope.getMatchFiles = function () {
        $scope.start = 0;
        searchMatchFiles();
    };



    // 根据条件搜索文件
     function searchMatchFiles() {
        if ($scope.startDate == null || $scope.endDate == null || $scope.startDate == "" || $scope.endDate == "") {
            swal('请输入完整的查询时间', "", "error");
        }
        else{
            _basic.get($host.file_url + '/user/' + userId + '/file?' + _basic.objToUrl({
                fileType: "1",
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                start:$scope.start,
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

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchMatchFiles();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchMatchFiles();
    };
}]);