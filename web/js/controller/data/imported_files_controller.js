/*
  Created by star on 2018/1/10
 */
app.controller("imported_files_controller", ["$scope", "$rootScope", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.ImportedFilesList=[];
    // 根据条件搜索文件
    $scope.searchMatchFiles = function () {
        if($scope.startDate == null || $scope.endDate == null){
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
            }else{
                swal(data.msg, "", "error");
            }
        });
    };
}]);