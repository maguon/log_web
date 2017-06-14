/**
 * Created by ASUS on 2017/5/17.
 */
/**
 * Created by ASUS on 2017/5/5.
 */
// var demand_Car_details_controller = angular.module("demand_Car_details_controller", []);
app.controller("demand_car_details_controller", [ "$state", "$stateParams", "_config", "baseService", "$scope", "$host", "_basic", function ( $state, $stateParams, _config, baseService, $scope, $host, _basic) {
    // console.log($stateParams.id, $stateParams.vin)
    var userId = _basic.getSession(_basic.USER_ID);
    var val = $stateParams.id;
    var vin = $stateParams.vin;

    // 颜色
    $scope.color = _config.config_color;

    // modelId全局变量
    $scope.change_model_id = "";

    // 车辆照片跳转
    $scope.look_car_img = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_car_img ').addClass("active");
        $("#look_car_img").addClass("active");
        $("#look_car_img").show();
    };
    $scope.look_msg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg ').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();
    };


    // 仓库车辆详情



    //controller里对应的处理函数
    var viewer;
    // var add_viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };


    // 返回
    $scope.return = function () {
        if ($stateParams.from == "storage_car_map") {
            $state.go($stateParams.from, {id: $scope.self_car.storage_id, form: "storageStore"}, {reload: true})
        } else {
            $state.go($stateParams.from, {}, {reload: true})
        }
    };

    // 查看详情
    $scope.lookStorageCar = function (val, vin) {
        $scope.submitted = false;
        // 照片清空
        $scope.imgArr = [];
        // 预览详情照片
        $scope.storage_imageBox = [];

        // console.log(val);
        // $(".modal").modal({
        //     // dismissible: false
        // });
        $(".main_storage_car").hide();
        $("#look_StorageCar").show();


        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.look_msg').addClass("active");
        $("#look_msg").addClass("active");
        $("#look_msg").show();

        $scope.Picture_carId = val;
        $scope.vin = vin;
        _basic.get($host.record_url + "/user/" + userId + "/car/" + val + "/record").then(function (data) {
            if (data.success == true) {
                // console.log(data);
                $scope.operating_record = data.result[0];
                $scope.comment = $scope.operating_record.comment;
                $scope.storage_image = $scope.operating_record.storage_image;
                for (var i in $scope.storage_image) {
                    $scope.storage_imageBox.push({src: $host.file_url + '/image/' + $scope.storage_image[i].url,time:$scope.storage_image[i].timez,user:$scope.storage_image[i].name});
                }
                // console.log($scope.storage_imageBox);
                // $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
            } else {
                swal(data.msg, "", "error")
            }
        });
        _basic.get($host.api_url +  "/car?carId=" + val + '&active=1').then(function (data) {
            if (data.success == true) {
                $scope.modelId = data.result[0].model_id;
                $scope.self_car = data.result[0];
                // modelID赋值
                $scope.look_make_id = $scope.self_car.make_id,

                $scope.look_model_id = $scope.self_car.model_id,
                    $scope.look_create_time = moment($scope.self_car.pro_date).format('YYYY-MM-DD');
                $scope.look_storageName = $scope.self_car.storage_name + "  " + $scope.self_car.row + "排" + $scope.self_car.col + "列";

                // 车辆id
                $scope.look_car_id = $scope.self_car.id;
            } else {
                swal(data.msg, "", "error")
            }
        })

    };
    $scope.lookStorageCar(val, vin);
  }]);