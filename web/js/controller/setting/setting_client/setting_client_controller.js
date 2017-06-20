/**
 * Created by zcy on 2017/6/7.
 */
app.controller("setting_client_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    $scope.userId = _basic.getSession(_basic.USER_ID);
    $scope.add_contacts = false;

    // 获取联系人信息
    $scope.getContactsInfo = function (currentId) {
        _basic.get($host.api_url + "/entrust/" + currentId + "/contacts").then(function (data) {
            if (data.success === true) {
                console.log("data", data);
                $scope.contact = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 控制列表项开合
    $scope.view_contacts = function (currentId, $index) {
        for (var i = 0; i < $scope.entrust.length; i++) {
            var currentClick = $(".show_flag" + i);
            // 判断总数据数组下标与当前点击下标哪个相匹配
            if (i === $index) {
                // 满足当前下标i的元素根据flag判断当前是展开状态还是收起状态
                if (currentClick.attr("flag") == "true") {
                    // 收起状态展开自身
                    currentClick.show();
                    $scope.getContactsInfo(currentId);
                    currentClick.attr("flag", "false");
                    $scope.add_contacts = false;
                }
                else {
                    // 展开状态收起自身
                    currentClick.hide();
                    currentClick.attr("flag", "true");
                }
            }
            else {
                // 不满足当前下标i的元素隐藏,并将flag设回true
                currentClick.hide();
                currentClick.attr("flag", "true");
            }
        }
        // $scope.currentIndex = $index;
    };

    // 增加联系人
    $scope.open_add_contacts = function () {
        $scope.add_contacts = true;
        // 初始化输入框
        $scope.userNames = undefined;
        $scope.dutys = undefined;
        $scope.phones = undefined;
    };

    $scope.close_contacts = function () {
        $scope.add_contacts = false;
    };

    // 保存新增信息
    $scope.save_contacts = function (entrustId) {
        console.log("entrustId:", entrustId);
        console.log("userName:", $scope.userNames);
        console.log("dutys:", $scope.dutys);
        console.log("phones", $scope.phones);

        if ($scope.userNames != undefined) {
            _basic.post($host.api_url + "/user/" + $scope.userId + "/entrust/" + entrustId + "/contacts", {
                contactsName: $scope.userNames,
                position: $scope.dutys,
                tel: $scope.phones
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $scope.add_contacts = false;
                    // 初始化输入框
                    // $scope.userNames = undefined;
                    // $scope.dutys = undefined;
                    // $scope.phones = undefined;
                    $scope.getContactsInfo(entrustId);
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写姓名", "", "error");
        }

    };

    // 删除联系人信息
    $scope.delete_contact = function (contactId, entrustId) {
        console.log("contactId:", contactId);
        console.log("listId:", entrustId);
        swal({
                title: "确定删除吗？",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function () {
                _basic.delete($host.api_url + "/user/" + $scope.userId + "/entrustContacts/" + contactId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            console.log("data", data);
                            swal("删除成功", "", "success");
                            $scope.getContactsInfo(entrustId);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
                console.log("$scope.userId:", $scope.userId);
                console.log("contactId:", contactId)
            });
    };

    // 获取所有委托方信息
    $scope.getEntrust = function () {
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success === true) {
                console.log("data", data);
                $scope.entrust = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.getEntrust();

}]);