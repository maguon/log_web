/**
 * Created by zcy on 2017/6/7.
 */
app.controller("setting_client_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    $scope.userId = _basic.getSession(_basic.USER_ID);
    $scope.add_contacts = false;
    $scope.mobileReg=_config.mobileRegx;

    // 获取联系人信息
    $scope.getContactsInfo = function (currentId) {
        _basic.get($host.api_url + "/entrust/" + currentId + "/contacts").then(function (data) {
            if (data.success === true) {
                $scope.contactList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };

    // 控制列表项开合
    $scope.view_contacts = function (currentId, $index) {
        for (var i = 0; i < $scope.entrustList.length; i++) {
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

    $scope.carParkingFee = function(id){
        $scope.entrustId =id;
        _basic.get($host.api_url + "/entrust?entrustId="+id).then(function (data) {
            if (data.success === true) {
                $scope.carParkingFeeItem = data.result[0].car_parking_fee;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
        $(".modal").modal();
        $("#carParkingFee").modal("open");
    }
    $scope.changePinkingFee = function (){
        if($scope.carParkingFeeItem!==''){
            var obj = {
                carParkingFee: $scope.carParkingFeeItem
            };
            _basic.put($host.api_url + "/user/" + $scope.userId + "/entrust/" +  $scope.entrustId  + '/entrustCarParkingFee', obj).then(function (data) {
                if (data.success === true) {
                    $scope.getEntrust();
                    $("#carParkingFee").modal("close");
                    swal("修改成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }




    // 保存新增信息
    $scope.addContacts = function (isValid, entrustId) {
        $scope.submitted = true;
        if (isValid) {
            _basic.post($host.api_url + "/user/" + $scope.userId + "/entrust/" + entrustId + "/contacts", {
                contactsName: $scope.userNames,
                position: $scope.dutys,
                tel: $scope.phones
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $scope.add_contacts = false;
                    $scope.getContactsInfo(entrustId);
                    $scope.submitted = false;
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }

    };

    // 删除联系人信息
    $scope.delete_contact = function (contactId, entrustId) {
        swal({
                title: "确定删除吗？",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + $scope.userId + "/entrustContacts/" + contactId, {}).then(
                    function (data) {
                        if (data.success === true) {
                            swal("删除成功", "", "success");
                            $scope.getContactsInfo(entrustId);
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            }
        })
    }

    // 获取所有委托方信息
    $scope.getEntrust = function () {
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success === true) {
                $scope.entrustList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    $scope.getEntrust();

}]);