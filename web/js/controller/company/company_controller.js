/**
 * Created by ASUS on 2017/4/1.
 */
app.controller("company_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 单条公司信息
    var companyMsg;

    // 搜索查询
    $scope.search = function () {

        var obj = {
            companyName: $scope.s_computer,
            operateType: $scope.s_type,
            cityId: $scope.s_city
        };

        _basic.get($host.api_url + "/company" + _basic.objToUrl(obj)).then(function (data) {
            if (data.success == true) {
                $scope.Company = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 整体查询读取
    var searchAll = function () {
        _basic.get($host.api_url + "/company", {}).then(function (data) {
            if (data.success == true) {
                $scope.Company = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 获取城市信息
        _basic.get($host.api_url + "/city", {}).then(function (data) {
            if (data.success == true) {
                $scope.citys = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    searchAll();

    // 新增公司
    $scope.addCompany = function () {
        $('.modal').modal({
            complete: function () {
                $scope.addCompanyName = "";
                $scope.addOperateType = "";
                $scope.addCooperationTime = "";
                $scope.addContacts = "";
                $scope.addTel = "";
                $scope.addCityId = "";
                $scope.addMark = "";
            }
        });
        $scope.submitted = false;
        $('#addCompany').modal('open');

    };
    // 提交新增公司信息
    $scope.submitForm = function (isValid) {
        $scope.submitted = true;
        if (isValid) {
            _basic.post($host.api_url + "/user/" + userId + "/company", {
                "companyName": $scope.addCompanyName,
                "operateType": $scope.addOperateType,
                "cooperationTime": $scope.addCooperationTime,
                "contacts": $scope.addContacts,
                "tel": $scope.addTel,
                "cityId": $scope.addCityId,
                "remark": $scope.addMark
            }).then(function (data) {
                if (data.success == true) {
                    $('#addCompany').modal('close');
                    swal("新增成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }

    };
    // 查看公司详情
    $scope.LookCompany = function (id) {
        $('.modal').modal();
        $('#LookCompany').modal('open');

        _basic.get($host.api_url + "/company?companyId=" + id, {}).then(function (data) {
            if (data.success == true) {
                $scope.company = data.result[0];
                companyMsg = $scope.company;
                $scope.look_cooperation_time = moment($scope.company.cooperation_time).format("YYYY-MM-DD")
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 头车数量
        _basic.get($host.api_url  + "/company/" + id + "/firstCount", {}).then(function (data) {
            if (data.success == true) {
                $scope.firstCount = data.result[0].firstCount;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 挂车数量
        _basic.get($host.api_url +  "/company/" + id + "/trailerCount", {}).then(function (data) {
            if (data.success == true) {
                $scope.trailerCount = data.result[0].firstCount;

            } else {
                swal(data.msg, "", "error");
            }
        });

        // 司机数量
        _basic.get($host.api_url +  "/company/" + id + "/driveCount", {}).then(function (data) {
            if (data.success == true) {
                $scope.driveCount = data.result[0].driveCount;
            } else {
                swal(data.msg, "", "error");
            }
        });


    };
    // 修改公司详情
    $scope.look_submitForm = function (id, isValid) {
        $scope.look_submitted = true;
        if (isValid) {
            var subParam = {
                "companyName": companyMsg.company_name,
                "operateType": companyMsg.operate_type,
                "cooperationTime": $scope.look_cooperation_time,
                "contacts": companyMsg.contacts,
                "tel": companyMsg.tel,
                "cityId": companyMsg.city_id,
                "remark": companyMsg.remark
            }

            _basic.put($host.api_url + "/user/" + userId + "/company/" + id, subParam).then(function (data) {
                if (data.success == true) {
                    $('#LookCompany').modal('close');
                    swal("修改成功", "", "success");
                    searchAll();
                } else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }
}]);