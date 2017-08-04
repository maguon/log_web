/**
 * Created by ASUS on 2017/8/4.
 */

app.controller("truck_repair_list_controller", ['$rootScope', '$scope', '_basic', '$host', function ($rootScope, $scope, _basic, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    // 单条公司信息
    var companyMsg;

    // 搜索查询
    $scope.search_truck = function () {

        var obj = {
            companyName: $scope.truck_computer,
            operateType: $scope.truck_type,
        };

        _basic.get($host.api_url + "/company?" + _basic.objToUrl(obj)).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.Company = data.result;
                // console.log($scope.Company);
            } else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 整体查询读取
    var searchAll = function () {
        _basic.get($host.api_url + "/truckRepairRel").then(function (data) {
            if (data.success == true) {
                $scope.truckRepairRel = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

    };
    searchAll();


    // 查看本次维修记录
    $scope.open_now_repair = function (id) {
        $('.modal').modal();
        $('#look_now_repair').modal('open');

        _basic.get($host.api_url + "/company?companyId=" + id, {}).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.company = data.result[0];
                // console.log($scope.company.cooperation_time)
                companyMsg = $scope.company;
                // console.log($scope.company, $scope.company.cooperation_time);
                $scope.look_cooperation_time = moment($scope.company.cooperation_time).format("YYYY-DD-MM")
            } else {
                swal(data.msg, "", "error");
            }
        });
        // 头车数量
        _basic.get($host.api_url  + "/company/" + id + "/firstCount", {}).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.firstCount = data.result[0].first_count;
            } else {
                swal(data.msg, "", "error");
            }
        });

        // 挂车数量
        _basic.get($host.api_url +  "/company/" + id + "/trailerCount", {}).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.trailerCount = data.result[0].trailer_count;

            } else {
                swal(data.msg, "", "error");
            }
        });

        // 司机数量
        _basic.get($host.api_url +  "/company/" + id + "/driveCount", {}).then(function (data) {
            // $(".shadeDowWrap").hide();
            if (data.success == true) {
                $scope.driveCount = data.result[0].driveCount;
            } else {
                swal(data.msg, "", "error");
            }
        });


    };
    // 修改公司详情
    $scope.look_submitForm = function (id, isValid) {
        // console.log(companyMsg);
        $scope.look_submitted = true;
        if (isValid) {
            var subParam = {
                "companyName": companyMsg.company_name,
                "operateType": companyMsg.operate_type,
                "cooperationTime": $scope.look_cooperation_time,
                "contacts": companyMsg.contacts,
                "tel": companyMsg.tel,
                // "cityId": companyMsg.city_id,
                "remark": companyMsg.remark
            }

            _basic.put($host.api_url + "/user/" + userId + "/company/" + id, subParam).then(function (data) {
                // $(".shadeDowWrap").hide();
                if (data.success == true) {
                    // console.log(data);
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