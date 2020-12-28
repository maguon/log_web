/**
 * Created by yujy on 2020-12-28
 */
app.controller("notification_manager_controller", ["_basic", "_config", "$host", "$scope", function (_basic, _config, $host, $scope) {
    let userId = _basic.getSession(_basic.USER_ID);
    // 消息状态列表
    $scope.notificationStatusList =_config.notificationStatus;
    $scope.start = 0;
    $scope.size = 21;

    /**
     * 显示模态【新增消息】
     */
    $scope.showNewMsgModal = function () {
        // 初始化数据
        $scope.newMsgTitle = "";
        $scope.newMsgContent = "";
        // 显示模态
        $(".modal").modal();
        $("#newMsgModal").modal("open");
    };

    /**
     * 点击确定 新建 消息
     */
    $scope.addNotification = function (){
        if ($scope.newMsgTitle == null || $scope.newMsgTitle === "" || $scope.newMsgContent == null || $scope.newMsgContent === "" ) {
            swal("请填写完整信息！", "", "warning");
        } else {
            _basic.post($host.api_url + "/user/" + userId + "/sysNotification", {
                title: $scope.newMsgTitle,
                content: $scope.newMsgContent,
                // 默认可用
                status: $scope.notificationStatusList[1].key
            }).then(function (data) {
                if (data.success === true) {
                    $('#newMsgModal').modal('close');
                    swal("新增成功", "", "success");
                    // 刷新列表数据
                    getSysNotification();
                }  else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    // 查看详情
    $scope.showMsgModal = function (id) {
        // 初始化数据
        _basic.get($host.api_url + "/user/" + userId + "/sysNotification/" + id).then(function (data) {
            if (data.success && data.result.length > 0) {
                $scope.editId = data.result[0].id;
                $scope.editMsgTitle = data.result[0].title;
                $scope.editMsgContent = data.result[0].content;
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 显示模态
        $(".modal").modal();
        $("#editMsgModal").modal("open");
    };

    /**
     * 点击确定 新建 消息
     */
    $scope.saveNotification = function (){
        if ($scope.editMsgTitle == null || $scope.editMsgTitle === "" || $scope.editMsgContent == null || $scope.editMsgContent === "" ) {
            swal("请填写完整信息！", "", "warning");
        } else {
            _basic.put($host.api_url + "/user/" + userId + "/sysNotification/" + $scope.editId, {
                title: $scope.editMsgTitle,
                content: $scope.editMsgContent
            }).then(function (data) {
                if (data.success === true) {
                    $('#editMsgModal').modal('close');
                    swal("保存成功", "", "success");
                    // 刷新列表数据
                    getSysNotification();
                }  else {
                    swal(data.msg, "", "error");
                }
            })
        }
    };

    // 停启用
    $scope.changeStatus = function (id, status) {
        swal({
            title: "确定修改当前状态吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认",
            cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                let newStatus;
                if (status == '0') {
                    newStatus = 1;
                } else if (status == '1') {
                    newStatus = 0;
                }
                _basic.put($host.api_url + "/user/" + userId + "/sysNotification/" + id + "/status", {status : newStatus}).then(function (data) {
                    if (data.success) {
                        swal("修改成功", "", "success");
                        getSysNotification();
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            } else {
                getSysNotification();
            }
        })
    };

    // 点击按钮查询
    $scope.searchNotification = function () {
        $scope.start = 0;
        getSysNotification();
    };

    // 前一页
    $scope.previous_page = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        getSysNotification();
    };

    // 后一页
    $scope.next_page = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        getSysNotification();
    };

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            status: $scope.msgStatus,
            createdOnStart: $scope.conCreatedOnStart,
            createdOnEnd: $scope.conCreatedOnEnd
        };
    }

    /**
     * 根据条件查询
     */
    function getSysNotification() {
        // 基本检索URL
        let url = $host.api_url + "/user/" + userId + "/sysNotification?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        let conditionsObj = makeConditions();
        let conditions = _basic.objNewTo2Url(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        _basic.get(url).then(function (data) {
            if (data.success) {
                $scope.sysNotificationList = data.result.slice(0, 20);
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
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        //
        $scope.conCreatedOnStart = "";
        $scope.conCreatedOnEnd = "";
        $scope.msgStatus = "";
        // 查询数据
        $scope.searchNotification();
    }
    initData();
}]);