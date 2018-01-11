/*
  Created by star on 2018/1/10
 */
app.controller("imported_files_controller", ["$scope", "$rootScope", "$host", "_basic", function ($scope, $rootScope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.ImportedFilesList=[];
    $scope.fileDetailObj ={
        fileName:"",
        fileLength:0,
        fileRecord:[]
    };
    // 根据条件搜索文件
    $scope.searchMatchFiles = function () {
        if($scope.startDate == null || $scope.endDate == null|| $scope.startDate == ""|| $scope.endDate == ""){
            swal('请输入完整的查询时间', "", "error")
            return;
        }
        _basic.get($host.file_url + '/user/' + userId + '/file?'+ _basic.objToUrl({
            fileType:"1",
            startDate:$scope.startDate,
            endDate:$scope.endDate
        })).then(function (data) {
            if(data&&data.success){
                $scope.importedFilesList = data.result;
            }
            else{
                swal(data.msg, "", "error");
            }
        });
    };
    $scope.changeDetail = function(file){
        $scope.fileDetailObj.fileName = file.filename;
        $scope.fileDetailObj.fileLength = file.length;
        $scope.fileDetailObj.id = file._id;
        $("#file_detail_modal").modal("open");
        _basic.get($host.api_url+'/carList?uploadId=' +  $scope.fileDetailObj.id ).then(function (data) {
            if (data.success == true) {
                $scope.fileDetailObj.fileRecord = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
}]);