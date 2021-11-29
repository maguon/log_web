app.controller("car_detection_statistics_controller", ["$scope", "$rootScope", "$host", "_basic", function ($scope, $rootScope, $host, _basic) {
    // 用户ID
    var userId = _basic.getSession(_basic.USER_ID);
    // 翻页用
    $scope.start = 0;
    $scope.size = 21;

    //管理员
    function getManagerList() {
        _basic.get($host.api_url + "/user").then(function (data) {
            if (data.success === true) {
                $scope.settingManagerList = data.result;
                $("#manager").select2({
                    placeholder: '操作员',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });
    }

    //查询功能
    $scope.searchMoveCarList= function (){
        getMoveCar();
    };
/*qaUserId dateStart dateEnd  start size*/
    function getMoveCar(){
        var obj ={
          /*  op:10,*/
            qaUserId: $scope.manager,
            dateStart:moment($scope.dateStart).format("YYYYMMDD"),
            dateEnd:moment($scope.dateEnd).format("YYYYMMDD")
        };
        if($scope.dateStart==undefined||$scope.dateEnd==undefined){
            swal('请输入完整的时间范围', "", "error");
            $scope.moveCarList=[];
        }
        else {
            _basic.get($host.api_url + "/user/" + userId+ "/damageQaUserStat?"+_basic.objToUrl(obj)).then(function (data) {
                if (data.success === true) {
                    $scope.moveCarList = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    /*导出*/
    $scope.export = function(){
        var url;
        var obj ={
           /* op:10,*/
            qaUserId: $scope.manager,
            dateStart:moment($scope.dateStart).format("YYYYMMDD"),
            dateEnd:moment($scope.dateEnd).format("YYYYMMDD")
        };
        if($scope.dateStart==undefined||$scope.dateEnd==undefined){
            swal('请输入完整的时间范围', "", "error");
        }
        else {
            url=$host.api_url + "/user/" + userId  + "/damageQaUserStat.csv?"+_basic.objToUrl(obj)
            window.open(url);
        }
    };

    /*** 2020-08-12 追加代码 开始位置 ***/

    // 质检统计
    $scope.showDetection = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.detection').addClass("active");
        $("#detection").addClass("active");
        $("#detection").show();
    };

    // 检车任务
    $scope.showDamageQaTask = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.damage').addClass("active");
        $("#damage").addClass("active");
        $("#damage").show();
    };

    /**
     * 根据条件 查询数据【检车任务】
     */
    $scope.getDamageQaTaskList = function () {
        // 基本检索URL
        var url = $host.api_url + "/user/" + userId + "/damageQaTask?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objNewTo2Url(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        _basic.get(url).then(function (data) {
            if (data.success) {
                // 将当前画面的条件
                $scope.damageQaTaskArray = data.result;
                $scope.damageQaTaskList = $scope.damageQaTaskArray.slice(0, 20);

                if ($scope.start > 0) {
                    $("#pre").show();
                } else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                } else {
                    $("#next").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 前一页
    $scope.preBtn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.getDamageQaTaskList();
    };

    // 后一页
    $scope.nextBtn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.getDamageQaTaskList();
    };

    // 组装检索条件。
    function makeConditions() {
        var damageDateStart;
        if ($scope.damageDateStart == undefined || $scope.damageDateStart == '' || $scope.damageDateStart == null) {
            damageDateStart = null;
        } else {
            damageDateStart = moment($scope.damageDateStart).format('YYYYMMDD');
        }

        var damageDateEnd;
        if ($scope.damageDateEnd == undefined || $scope.damageDateEnd == '' || $scope.damageDateEnd == null) {
            damageDateEnd = null;
        } else {
            damageDateEnd = moment($scope.damageDateEnd).format('YYYYMMDD');
        }

        return {
            dateIdStart: damageDateStart,
            dateIdEnd: damageDateEnd
        };
    }

    /**
     * 根据任务号 查询数据【检车任务详情】
     */
    $scope.getDamageQaTaskCarRel = function () {
        // 基本检索URL
        var url = $host.api_url + "/user/" + userId + "/damageQaTaskCarRel?qtId=" + $scope.qtId;
        if ($scope.qaStatus != undefined && $scope.qaStatus != null && $scope.qaStatus.length > 0) {
            url = url + "&qaStatus=" + $scope.qaStatus;
        }
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.damageQaTaskCarRelArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };

    /**
     * 根据任务号 查询数据【检车任务详情】-【用户统计】
     */
    function getDamageUserStat(qtId) {
        // 基本检索URL
        var url = $host.api_url + "/user/" + userId + "/qtId/" + qtId + "/userStat";
        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.userStatArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    }

    // 【检车任务】打开 模态 检车任务详情
    $scope.openDamageModal = function (qtId) {
        // 保存任务号
        $scope.qtId = qtId;
        // 清空检车状态
        $scope.qaStatus = '';
        // 取得任务号 检车任务详情
        $scope.getDamageQaTaskCarRel();
        // 统计用户检车数
        getDamageUserStat(qtId);

        // 显示模态
        $('#damageModal').modal('open');
    };

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 默认显示 【检车任务】
        $scope.showDamageQaTask();
        // 查询数据【检车任务】
        $scope.getDamageQaTaskList();

        // 取得 【质检统计】中用的 管理员 列表（修改前代码）
        getManagerList();
    }
    initData();
}]);