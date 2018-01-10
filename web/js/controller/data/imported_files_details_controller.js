app.controller("imported_files_details_controller", ["$scope", "_basic", "_config", "$host", "$stateParams", function ($scope, _basic, _config, $host, $stateParams) {
     var userId = _basic.getSession(_basic.USER_ID);
     // 获取文件名字
         _basic.get($host.file_url + '/user/' + userId + '/file?fileType=1&fileId=' + $stateParams.id).then(function (data) {
             if (data.success == true) {
                 $scope.imported_files_details = data.result[0];
                 $scope.imported_files_details_filename = $scope.imported_files_details.filename;
                 $scope.imported_files_details_upload_id=$scope.imported_files_details._id;
                 $scope.imported_files_details_length = $scope.imported_files_details.length;

             }
             else {
                 swal(data.msg, "", "error");
             }
         })
    // 根据unloadId获取数据
    $scope.searchMatchFiles = function () {
        _basic.get($host.api_url+'/carList?uploadId='+ $stateParams.id).then(function (data) {
            if(data&&data.success){
                $scope.DataList = data.result;
                //console.log($scope.DataList)
            }else{
                swal('数据查询失败')
            }
        });
    };
    $scope.searchMatchFiles();
 }]);