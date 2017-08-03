
/**
 * Created by ASUS on 2017/7/10.
 */
app.controller("truck_position_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    _basic.get($host.record_url+"/user/"+userId+"/truckGps").then(function (data) {
        if(data.success==true){
            $scope.truckGps=data.result;
            var position=[];
            $scope.truckGps.map(function (i) {
                var obj=[i.lon,i.lat,i.angle];
                position.push(obj)
            });
            // 百度地图API功能
            var map = new BMap.Map("dealer_map");
            var point = new BMap.Point(position[0].lon,position[0].lat);
            map.centerAndZoom(point,10);
            var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(20, 32), {
                anchor: new BMap.Size(10, 30)
            });
            console.log(position);
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
                var p = e.target;
                alert("marker的位置是" + p.getPosition().lng + "," + p.getPosition().lat);
            }
        }
    });
    $scope.search_map=function (lon,lat,angle) {
        var map = new BMap.Map("dealer_map");
        var point = new BMap.Point(lon,lat);
        map.centerAndZoom(point,15);
        var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(20, 32), {
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