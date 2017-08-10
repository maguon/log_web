
/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_position_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckGps=[];
    $scope.show_truck_msg=false;
    _basic.get($host.record_url+"/user/"+userId+"/truckGps").then(function (data) {
        if(data.success==true){
            if(data.result.length>0){
                truckGps=data.result;
                $scope.truckGps=data.result;
                var position=[];
                $scope.truckGps.map(function (i) {
                    var obj=[i.lon,i.lat,i.angle];
                    position.push(obj);
                });
                // 百度地图API功能
                var map = new BMap.Map("dealer_map");
                var point = new BMap.Point(position[0].lon,position[0].lat);
                map.centerAndZoom(point,10);
                var icon = new BMap.Icon('/assets/images/truck_image.png', new BMap.Size(20, 48), {
                    anchor: new BMap.Size(10, 30)
                });
                var json_data = position;
                var pointArray = new Array();
                for(var i=0;i<json_data.length;i++){
                    var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]),{
                        icon: icon,
                        rotation:json_data[i][2]
                    }); // 创建点
                    map.enableScrollWheelZoom(true);
                    map.addOverlay(marker);    //增加点
                    pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                    marker.addEventListener("click",attribute);
                }
                // //让所有点在视野范围内
                map.setViewport(pointArray);
                //获取覆盖物位置
                function attribute(e){
                    // var p = e.target;
                    // alert("marker的位置是" + p.getPosition().lng + "," + p.getPosition().lat);
                    _basic.get($host.api_url+"/truckFirst?truckNum="+No).then(function (data) {
                        if(data.success==true){
                            $scope.dirve_msg=data.result[0];
                            $scope.No=No;
                            $scope.truck_search_text=No;
                            $scope.phone=phone;
                            $scope.time=time;
                        }
                    })
                }
            }

        }
    });
    // 输入过滤
    $scope.truck_search_map=function (val) {
        $scope.truckGps=[];
        for(var i=0;i<truckGps.length;i++){
            if(truckGps[i].vhe_no.indexOf(val)!=-1){
                $scope.truckGps.push(truckGps[i])
            }
        }
        if(val==""){
            var position=[];
            truckGps.map(function (i) {
                var obj=[i.lon,i.lat,i.angle];
                position.push(obj);
            });
            // 百度地图API功能
            var map = new BMap.Map("dealer_map");
            var point = new BMap.Point(position[0].lon,position[0].lat);
            map.centerAndZoom(point,10);
            var icon = new BMap.Icon('/assets/images/truck_image.png', new BMap.Size(20, 48), {
                anchor: new BMap.Size(10, 30)
            });
            var json_data = position;
            var pointArray = new Array();
            for(var i=0;i<json_data.length;i++){
                var marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]),{
                    icon: icon,
                    rotation:json_data[i][2]
                }); // 创建点
                map.enableScrollWheelZoom(true);
                map.addOverlay(marker);    //增加点
                pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
                marker.addEventListener("click",attribute);
            }
            // //让所有点在视野范围内
            map.setViewport(pointArray);
            //获取覆盖物位置
            function attribute(e){
                // var p = e.target;
                // alert("marker的位置是" + p.getPosition().lng + "," + p.getPosition().lat);
            }
        }
    };
    $scope.search_map=function (lon,lat,angle,No,phone,time) {
        _basic.get($host.api_url+"/truckFirst?truckNum="+No).then(function (data) {
            if(data.success==true){
                $scope.dirve_msg=data.result[0];
                $scope.No=No;
                $scope.truck_search_text=No;
                $scope.phone=phone;
                $scope.time=time;
            }
        })
        $scope.show_truck_msg=true;
        var map = new BMap.Map("dealer_map");
        var point = new BMap.Point(lon,lat);
        map.centerAndZoom(point,15);
        var icon = new BMap.Icon('/assets/images/truck_image.png', new BMap.Size(20, 48), {
            anchor: new BMap.Size(10, 30)
        });
        var marker = new BMap.Marker(new BMap.Point(lon,lat),{
            icon: icon,
            rotation:angle
        }); // 创建点
        map.enableScrollWheelZoom(true);
        map.addOverlay(marker);


    }

}]);