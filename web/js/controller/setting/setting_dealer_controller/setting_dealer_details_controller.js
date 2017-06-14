/**
 * Created by ASUS on 2017/6/8.
 */
/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("setting_dealer_details_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    $scope.now_loacl="";
    var map=new BMap.Map("dealer_map");
    var point=new BMap.Point(121.62,38.92);
    map.centerAndZoom(point,15);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.enableDragging();
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    marker.addEventListener("dragend", function () {
        $scope.$apply(function(){
            var p = marker.getPosition();//获取marker的位置
            $scope.lng=p.lng;
            $scope.lat=p.lat;
        });
    });
    marker.addEventListener("click",function () {
        var sContent ="大连顺通物流有限公司...";
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    });

    $scope.lng=121.62;
    $scope.lat=38.92;

//    搜索新地址
    $scope.search_location=function (myKeys) {


        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        if(myKeys!=""){
            myGeo.getPoint(myKeys, function(point){
                if (point) {
                    var map = new BMap.Map("dealer_map");// 创建Map实例
                    // $scope.now_local="当前位置经度：" + point.lng + ",纬度：" + point.lat;
                    marker=new BMap.Marker(point);
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
                    $scope.$apply(function(){
                        $scope.lng=point.lng;
                        $scope.lat=point.lat;
                    });
                    marker.addEventListener("dragend", get_location);
                    marker.addEventListener("click",function () {
                        var sContent ="大连顺通物流有限公司...";
                        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                        map.openInfoWindow(infoWindow,point); //开启信息窗口
                    });
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                }else{
                    swal("无法定位当前地址","","error");
                }
            }, "中国");
        }

    };


//    获取移动后的坐标
    var get_location=function (){
        $scope.$apply(function(){
            var p = marker.getPosition();//获取marker的位置
            $scope.lng=p.lng;
            $scope.lat=p.lat;
        });
    }
}]);