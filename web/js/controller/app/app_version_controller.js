app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    $scope.size = 10;
    $scope.start=0;
    var userId = _basic.getSession(_basic.USER_ID);
    // 获取app筛选列表
    function getAppSystemList () {
        _basic.get($host.api_url + "/app?" + _basic.objToUrl({
            app: $scope.appType,
            type:$scope.getSystemType,
            forceUpdate:$scope.forceUpdate
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
    // 分页
    $scope.previous_page = function () {
        $scope.start = $scope.start - $scope.size;
        getAppSystemList();
    };
    $scope.next_page = function () {
        $scope.start = $scope.start + $scope.size;
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
                    swal("新增成功", "", "success");
                    $('#addAppSystem').modal('close');
                    getAppSystemList ();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else{
                swal("请填写完整信息！", "", "warning");
            }
    }
    //修改
    $scope.showAppSystem=function (id) {
        $('.modal').modal();
        $('#showAppSystem').modal('open');
        _basic.get($host.api_url + "/app?id=" + id).then(function (data) {
            if (data.success == true) {
                $scope.showAppSystemList = data.result[0];
            } else {
                swal(data.msg, "", "error");
            }

        })
    }
    // 获取数据
    function queryData () {
         $scope.searchAppSystem()
    };
    queryData();
}])