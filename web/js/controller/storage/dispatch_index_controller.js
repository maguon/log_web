/**
 * Created by zcy on 2017/9/25.
 */
app.controller("dispatch_index_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

    // 当前日期
    var nowDate = moment(new Date()).format("YYYY-MM-DD");

    // 初始值
    $scope.unscheduledDemand = 0; // 未安排需求
    $scope.notScheduledVehicle = 0; // 未安排商品车
    $scope.scheduledVehicles = 0; // 已安排商品车
    $scope.todayCommodityCar = 0; // 今日送达商品车
    $scope.status_1_count = 0;
    $scope.status_2_count = 0;
    $scope.status_3_count = 0;
    $scope.status_4_count = 0;
    $scope.todayCompleteInstructions = 0;
    $scope.notCompleteCount = 0;
    $scope.todayCancelInstructions = 0;


    $scope.getDispatchCountInfo = function () {
        // 查询未接受，已接受，执行中和在途的车辆数量
        _basic.get($host.api_url + "/taskStatusCount").then(function (countData) {
            if (countData.success === true) {
                console.log("countData",countData);
                for (var i = 0; i < countData.result.length; i++) {
                    if(countData.result[i].task_status === 1){
                        $scope.status_1_count = countData.result[i].task_status_count;
                    }
                    if(countData.result[i].task_status === 2){
                        $scope.status_2_count = countData.result[i].task_status_count;
                    }
                    if(countData.result[i].task_status === 3){
                        $scope.status_3_count = countData.result[i].task_status_count;
                    }
                    if(countData.result[i].task_status === 4){
                        $scope.status_4_count = countData.result[i].task_status_count;
                    }
                    if(countData.result[i].task_status === 9){
                        $scope.todayCancelInstructions = countData.result[i].task_status_count;
                    }
                }
            }
            else {
                swal(countData.msg, "", "error");
            }
        });

        // 查询今日完成指令车辆数量
        _basic.get($host.api_url + "/taskStatusCount?taskEndDateStart=" + nowDate + "&taskEndDateEnd=" + nowDate).then(function (data) {
            if (data.success === true) {
                console.log("data",data);
                if(data.result.length !== 0){
                    $scope.todayCompleteInstructions = data.result[0].task_status_count;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        // 获取未完成指令车辆数量
        _basic.get($host.api_url + "/notCompletedTaskStatusCount?taskStatusArr=1,2,3,4").then(function (notCompleteData) {
            if (notCompleteData.success === true) {
                console.log("notCompleteData",notCompleteData);
                $scope.notCompleteCount = notCompleteData.result[0].task_status_count;
            }
            else {
                swal(notCompleteData.msg, "", "error");
            }
        });

        // 获取送达商品车数量
        _basic.get($host.api_url + "/carLoadStatusCount?carLoadStatus=2&arriveDateStart=" + nowDate + "&arriveDateEnd=" + nowDate).then(function (arriveCarData) {
            if (arriveCarData.success === true) {
                console.log("arriveCarData",arriveCarData);
                $scope.todayCommodityCar = arriveCarData.result[0].arrive_count
            }
            else {
                swal(arriveCarData.msg, "", "error");
            }
        });

        // 获取未安排商品车数量和已安排商品车数量
        _basic.get($host.api_url + "/dpTaskStatCount").then(function (data) {
            if (data.success === true) {
                console.log("未安排已安排",data);
                $scope.scheduledVehicles = data.result[0].plan_count;
                $scope.notScheduledVehicle = data.result[0].pre_count - data.result[0].plan_count;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 获取数据
    $scope.queryData = function () {
        $scope.getDispatchCountInfo()
    };
    $scope.queryData();
}]);