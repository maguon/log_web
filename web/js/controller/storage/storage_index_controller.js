/*仓储主控*/
app.controller("storage_index_controller", ['$rootScope', '$scope', "$host", "_basic",
    function ($rootScope, $scope, $host, _basic) {

        //获取当前时间
        var date = new Date();

        //时间格式转换
        var now_date = moment(date).format('YYYYMMDD');

        //定义  仓储总车位
        $scope.totalSeats = 0;


        //定义当天的出入库及库存总车辆数据
        $scope.storageTotalData={
            sumImports:0,
            sumExports:0,
            sumBalance:0
        };


        //获取当天的出入库及库存总车辆数据
        _basic.get($host.api_url + "/storageCount?dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageTotalData = data.result[0];
            } else {
               return;
            }
        });


        // 获取 所有仓库列表及总车位
        _basic.get($host.api_url + "/storageDate?dateStart=" + now_date + "&dateEnd=" + now_date).then(function (data) {
            if (data.success == true&&data.result.length>0) {
                $scope.storageTotalList = data.result;

                for (var i in $scope.storageTotalList) {

                    $scope.totalSeats += $scope.storageTotalList[i].total_seats;
                }
                return $scope.totalSeats;
            } else {
                return;
            }
        });

    }]);
