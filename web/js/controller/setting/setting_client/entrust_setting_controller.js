app.controller("entrust_setting_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;

    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    function getCarMake(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

    }

    //点击查询按钮
    $scope.getEntrustSetting = function (){
        $scope.start = 0;
        getEntrustSetting();
    }

    //获取列表详情
    function getEntrustSetting() {
        var obj = {
                entrustId:$scope.client,
                start:$scope.start.toString(),
                size:$scope.size
        };
        _basic.get($host.api_url + "/entrustRoute?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.entrustSettingArray = $scope.boxArray.slice(0, 10);
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
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    // 关联品牌模态框
    $scope.entrustMakeRel = function (id) {
        $scope.entrustId=id;
        _basic.get($host.api_url + "/entrustMakeRel?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.entrustMakeRelList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/entrust?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.shortName = data.result[0].short_name;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#entrustMakeInfoModel').modal('open');

    };

    //添加品牌
    $scope.addChip= function (){
        _basic.post($host.api_url + "/user/" + userId + "/entrustMakeRel", {
            entrustId: $scope.entrustId,
            makeId:$scope.car_brand.id
        }).then(function (data) {
            if (data.success === true) {
                $scope.entrustMakeRel($scope.entrustId);
                swal("新增成功", "", "success");
            }
        });
    }

    //删除品牌
    $scope.deleteChip =function (makeId,entrust){
        swal({
                title: "确定删除此品牌吗？",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/entrust/" +entrust+"/make/"+makeId , {}).then(
                    function (data) {
                        if (data.success === true) {
                            swal("删除成功", "", "success");
                            $scope.entrustMakeRel(entrust)
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            }
        })
    }

    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getEntrustSetting();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getEntrustSetting();
    };


    getEntrust();
    getEntrustSetting();
    getCarMake();

}]);