/*
  Created by zcy on 2017/6/27.
 */
app.controller("imported_files_controller", ["$scope", "$rootScope", "$host", "_basic", "_config", "baseService", function ($scope, $rootScope, $host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.ImportedFilesList=[];

    // 根据条件搜索文件
    $scope.searchMatchFiles = function () {
        if($scope.startDate == null || $scope.endDate == null){
            swal('请输入完成的查询时间')
            return;
        }
        _basic.get($host.file_url + '/user/' + userId + '/file?'+ _basic.objToUrl({
            fileType:"1",
            startDate:$scope.startDate,
            endDate:$scope.endDate
        })).then(function (data) {
            if(data&&data.success){
                $scope.importedFilesList = data.result;
                // if( $scope.importedFilesList.length==0){
                //     swal('没有您需要要的数据')
                //     return;
                // }
            }else{
                swal('数据查询失败')
            }
        });
    };
}]);