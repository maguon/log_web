/**
 * 主菜单：app系统 控制器
 */
app.controller("app_version_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {

    // 取得当前画面 登录用户
    var userId = _basic.getSession(_basic.USER_ID);

    // 翻页用
    $scope.start = 0;
    $scope.size = 11;



    //模块
    $scope.appTypeList = _config.appType;

    //强制更新
    $scope.forceUpdateList = _config.forceUpdate;

    //系统(苹果  安卓)
    $scope.systemTypeList =_config.systemType;


    //新增信息
    $scope.newAppVersion ={};


    //新增申请  默认数据
    var defaultAppVersion = {
        //模块
        app:'',
        //系统
        appType: '',
        //是否强制更新
        forceUpdate: '',
        //版本号
        version: '',
        //下载地址
        url: '',
        //备注
        remark: ''
    };



    /**
     * 查询按钮
     */
    $scope.getAppSystem = function () {
        $scope.start=0;
        searchAppSystemList();
    };





    /**
     * 根据条件搜索
     */
    function searchAppSystemList () {
        // 基本检索URL
        var url = $host.api_url + "/app?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.appSystemList = $scope.boxArray.slice(0, 10);
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
    };





    /**
     *
     * 点击添加按钮
     */
    $scope.openAppSystem=function () {

        $('.modal').modal();
        $('#newAppSystem').modal('open');
        // 初期化数据
        angular.copy(defaultAppVersion, $scope.newAppVersion);
    }






    /*
    * 提交新增信息
    * */
    $scope.addAppList=function() {

        //判断必填项不为空
        if ($scope.newAppVersion.type !== undefined &&$scope.newAppVersion.type!==''&&
            $scope.newAppVersion.typeName !== undefined &&$scope.newAppVersion.typeName!==''&&
            $scope.newAppVersion.version !== '' &&$scope.newAppVersion.forceUpdate !== '' &&
            $scope.newAppVersion.uploadUrl !== undefined&&$scope.newAppVersion.uploadUrl!=='') {

            //添加
            _basic.post($host.api_url + "/user/" + userId + "/app", {
                app:$scope.newAppVersion.typeName,
                appType: $scope.newAppVersion.type,
                forceUpdate: $scope.newAppVersion.forceUpdate,
                version: $scope.newAppVersion.version,
                url:  $scope.newAppVersion.uploadUrl,
                remark: $scope.newAppVersion.appDescription
            }).then(function (data) {

                //添加成功执行此操作
                if (data.success == true) {

                    $('#newAppSystem').modal('close');

                    swal("新增成功", "", "success");

                    searchAppSystemList();
                }
                //添加失败
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
                swal("请填写完整信息！", "", "warning");
            }
    };




    //查看详情
    $scope.readAppSystem=function (id) {

        $('.modal').modal();
        $('#editAppSystem').modal('open');

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
    $scope.updateAppSystemItem = function (id) {

        //条件不能为空（除了备注）
        if ($scope.showAppSystemList.version !== "" && $scope.showAppSystemList.url !== "") {
            var obj = {
                app: $scope.showAppSystemList.app,
                appType: $scope.showAppSystemList.type,
                forceUpdate: $scope.showAppSystemList.force_update,
                version: $scope.showAppSystemList.version,
                url: $scope.showAppSystemList.url,
                remark: $scope.showAppSystemList.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/app/" + id, obj).then(function (data) {
                if (data.success == true) {
                    swal("修改成功", "", "success");
                    $('#editAppSystem').modal('close');
                    searchAppSystemList();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

        else {
            swal("请填写完整信息！", "", "warning");
        }
    };




    // 分页
    $scope.getPrePage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        searchAppSystemList();
    };
    $scope.getNextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchAppSystemList();
    };



    /**
     * 组装检索条件。
     */
    function makeConditions() {
        var obj = {
            app: $scope.conAppType,
            type:$scope.conSystemType,
            forceUpdate:$scope.conForceUpdate
        }
        return obj;
    }



    searchAppSystemList();
}])