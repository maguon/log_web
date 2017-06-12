/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("add_setting_dealer_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){

    // var marker;
    var map=new BMap.Map("dealer_map");
    var point=new BMap.Point(121.62,38.92);
    map.centerAndZoom(point,15);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    marker.enableDragging();
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
                    marker=new BMap.Marker(point);
                    $scope.$apply(function(){
                        $scope.lng=point.lng;
                        $scope.lat=point.lat;
                    });
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
                    marker.addEventListener("dragend", get_location)
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                }else{
                    swal("无法定位当前地址","","error");
                }
            }, "中国");
        }

    };
    // $scope.search_location("大连市");

//    获取移动后的坐标
    var get_location=function (){
        $scope.$apply(function(){
            var p = marker.getPosition();//获取marker的位置
            $scope.lng=p.lng;
            $scope.lat=p.lat;
        });
    }
}]);