app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 10;
    $scope.start = 0;
    var userId = _basic.getSession(_basic.USER_ID);
    //获取app列表
    function getAppSystemAllList () {
        _basic.get($host.api_url + "/app").then(function (data) {
            if (data.success === true) {
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
                $scope.appSystemList = data.result;
                $scope.appType="";
                $scope.getSystemType="";
                $scope.forceUpdate="";
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 获取app筛选列表
    function getAppSystemList () {
        _basic.get($host.api_url + "/app?" + _basic.objToUrl({
            app: $scope.appType,
            type:$scope.getSystemType,
            forceUpdate:$scope.forceUpdate,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
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
                $scope.appSystemList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 点击搜索
    $scope.searchAppSystem = function () {
        $scope.start=0;
        getAppSystemList();
    };
    //添加
    $scope.addAppSystem=function () {
        $('.modal').modal();
        $('#addAppSystem').modal('open');
    }
    $scope.submitAppList=function() {
        if ($scope.addAppType !== undefined && $scope.addSystemType !== undefined && $scope.addForceUpdate !== undefined && $scope.addAppVersion!== undefined&& $scope.uploadUrl!== undefined) {
            _basic.post($host.api_url + "/user/" + userId + "/app/", {
                app: $scope.addAppType,
                appType: $scope.addSystemType,
                forceUpdate: $scope.addForceUpdate,
                version: $scope.addAppVersion,
                url: $scope.uploadUrl,
                remark: $scope.appDescription
            }).then(function (data) {
                if (data.success == true) {
                    $('#addAppSystem').modal('close');
                    getAppSystemAllList();
                    swal("新增成功", "", "success");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
                swal("请填写完整信息！", "", "warning");
            }
    }
    //查看详情
    $scope.showAppSystem=function (id) {
        $('.modal').modal();
        $('#showAppSystem').modal('open');
        _basic.get($host.api_url + "/app?appId=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showAppSystemList = data.result[0];
                $scope.showAppSystemList.app = data.result[0].app+"";
                $scope.showAppSystemList.type = data.result[0].type+"";
                $scope.showAppSystemList.force_update = data.result[0].force_update+"";
            } else {
                swal(data.msg, "", "error");
            }
        })
    }
    //修改
    $scope.submitAppSystemItem = function (id) {
        if($scope.showAppSystemList.app !== "" &&  $scope.showAppSystemList.type!==""
            &&$scope.showAppSystemList.force_update!== ""&& $scope.showAppSystemList.version!== "" &&$scope.showAppSystemList.url!== ""){
            var obj = {
                app: $scope.showAppSystemList.app,
                appType: $scope.showAppSystemList.type,
                forceUpdate: $scope.showAppSystemList.force_update,
                version: $scope.showAppSystemList.version,
                url: $scope.showAppSystemList.url,
                remark: $scope.showAppSystemList.remark
            };
            _basic.put($host.api_url + "/user/" + userId+"/app/" +id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#showAppSystem').modal('close');
                    getAppSystemAllList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    else{
            swal("请填写完整信息！", "", "warning");
        }
    };
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        getAppSystemList();
    };
    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
        getAppSystemList();
    };
    $scope.searchAppSystem();
}])