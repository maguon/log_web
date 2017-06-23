/**
 * Created by ASUS on 2017/6/22.
 */
/**
 * Created by ASUS on 2017/6/7.
 */
app.controller("add_setting_shipments_controller",["$scope","_basic","_config","$host",function ($scope,_basic,_config,$host){
    var userId=_basic.getSession(_basic.USER_ID);
    // 获取城市
    (function () {
        _basic.get($host.api_url+"/city").then(function (data) {
            if(data.success==true){
                $scope.setting_city=data.result;
                // $scope.addContacts[index]={
                //     show:false
                // };
            }
        });
    })();

    // 百度地图控件
    var map=new BMap.Map("dealer_map");
    var point=new BMap.Point(121.62,38.92);
    map.centerAndZoom(point,15);
    marker=new BMap.Marker(point);
    // var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(35, 24), {
    //     anchor: new BMap.Size(35, 24)
    // });
    // var marker = new BMap.Marker(point,{
    //     icon: icon,
    //     // rotation: 90
    // });
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

                    marker=new BMap.Marker(point);
                    // var icon = new BMap.Icon('/assets/images/point.png', new BMap.Size(35, 24), {
                    //     anchor: new BMap.Size(35, 24)
                    // });
                    // var marker = new BMap.Marker(point,{
                    //     icon: icon,
                    //     // rotation: 60
                    // });
                    $scope.$apply(function(){
                        $scope.lng=point.lng;
                        $scope.lat=point.lat;
                    });
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
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
    // $scope.search_location("大连市");

//    获取移动后的坐标
    var get_location=function (){
        $scope.$apply(function(){
            var p = marker.getPosition();//获取marker的位置
            $scope.lng=p.lng;
            $scope.lat=p.lat;
        });
    };
    // 新增发货商
    $scope.add_setting_dealer=function (isValid) {
        $scope.submitted=true;
        if(isValid){
            if($scope.lng!=121.62&&$scope.lat!=38.92){
                var obj={
                    "addrName":$scope.shipments_name,
                    "address":$scope.input_address,
                    "lng":$scope.lng,
                    "lat": $scope.lat,
                    "cityId": $scope.setting_city_id,
                    "remark":$scope.remark
                };
                _basic.post($host.api_url+"/user/"+userId+"/baseAddr",obj).then(function (data) {
                    if(data.success==true){
                        swal("新增成功","","success");
                        $scope.shipments_name="";
                        $scope.input_address="";
                        $scope.setting_city_id="";
                        $scope.remark="";
                        $scope.submitted=false;
                    }
                });

            }
        }
    };

}]);