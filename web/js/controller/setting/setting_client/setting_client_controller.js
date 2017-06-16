/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_client_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    // 获取所有委托方信息
    (function () {
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success === true) {
                console.log("data", data);
                $scope.entrust = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    })();

    $scope.userId = _basic.getSession(_basic.USER_ID);
    $scope.currentIndex = 0;
    $scope.userNames = [];
    $scope.dutys = [];
    $scope.phones = [];
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
                    console.log("currentId", currentId);
                    console.log("index", $index);
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
        $scope.currentIndex = $index;
    };

    // 增加联系人
    $scope.open_add_contacts = function () {
        $scope.add_contacts = true;
    };

    $scope.close_contacts = function () {
        $scope.add_contacts = false;
    };

    // 保存新增信息
    $scope.save_contacts = function (entrustId) {
        console.log("currentIndex:", $scope.currentIndex);
        console.log("entrustId:", entrustId);
        console.log("userName:", $scope.userNames[$scope.currentIndex]);
        console.log("dutys:", $scope.dutys[$scope.currentIndex]);
        console.log("phones", $scope.phones[$scope.currentIndex]);
        // 判断为空时不能取"",因为是数组内的元素，只能取undefined
        if ($scope.userNames[$scope.currentIndex] != undefined) {
            _basic.post($host.api_url + "/user/" + $scope.userId + "/entrust/" + entrustId + "/contacts", {
                contactsName: $scope.userNames[$scope.currentIndex],
                position: $scope.dutys[$scope.currentIndex],
                tel: $scope.phones[$scope.currentIndex]
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $scope.add_contacts = false;
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
    $scope.delete_contact = function (contactId,entrustId) {
        console.log("contactId:", contactId);
        console.log("listId:",entrustId);
        swal({
                title: "确定删除吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function () {
                _basic.put($host.api_url + "/user/" + $scope.userId + "/contacts/" + contactId + "/entrustContactsStatus/" + 0,{}).then(
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
                console.log("$scope.userId:",$scope.userId);
                console.log("contactId:",contactId)
            });
    };

}]);