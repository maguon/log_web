/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_hand_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };

    // 获取公司
    _basic.get($host.api_url+"/company").then(function (data) {
        if(data.success==true){
            $scope.company=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取品牌
    _basic.get($host.api_url+"/brand").then(function (data) {
        if(data.success==true){
            $scope.brand=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });

    // 获取车头
    _basic.get($host.api_url+"/truckFirst?truckType=1").then(function (data) {
        if(data.success==true){
            $scope.head_car_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取挂车
    _basic.get($host.api_url+"/truckTrailer?truckType=2").then(function (data) {
        if(data.success==true){
            $scope.hand_truck_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取主驾司机
    _basic.get($host.api_url+"/drive").then(function (data) {
        if(data.success==true){
            $scope.drive=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });

    // 车辆状态（头车还是挂车）
    var status=$stateParams.status;
    $scope.truck_status=status+"";

    // 新增
    $scope.submit_Form=function (inValid) {
        if($scope.truck_status=='1'){
            $scope.submitted=true;
            var obj={
                "truckNum":$scope.truck_num,
                "brandId":$scope.truck_make,
                "truckTel": $scope.phone_num,
                "theCode": $scope.vin,
                "driveId": $scope.main_driver,
                // "copilot": "string",
                "companyId":$scope.truck_company,
                "truckType":$scope.truck_type,
                "relId":$scope.check_hand_truck,
                "truckStatus": $scope.truck_status,
                // "number": 0,
                // "drivingDate": "string",
                // "licenseDate": "string",
                // "twoDate": "string",
                // "drivingImage": "string",
                // "licenseImage": "string",
                "remark":$scope.textarea
            };
            console.log(obj);
            if(inValid){
                _basic.post($host.api_url+"/user/"+userId+"/truckFirst",obj).then(function (data) {
                    if(data.success==true){
                        $(".ui-tabs li").addClass("disabled");
                        $(".test2").removeClass("disabled");
                        $(".ui-tabs li>a").removeClass("active");
                        $(".test2>a").addClass("active");
                        $(".tabs .indicator").css({
                            right:848+"px",
                            left:423+"px"
                        });
                        $(".test").hide();
                        $(".test").removeClass("active");
                        $("#test2").show();
                        $("#test2").addClass("active");
                        $scope.Picture_carId = data.result.carId;
                    }else {
                        swal(data.msg,"","error")
                    }
                });
            }
        }

    };
    // 照片上传函数
    function uploadBrandImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                //check size
                //$file_input[0].files[0].size
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                }

                if (dom_obj[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }

            }
            else if (filename && filename.length > 0) {
                dom_obj.val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            }
            // $currentDom = $(dom).prev();
            _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {

                if (data.success) {

                    // // console.log(data,Picture_carId);
                    var imageId = data.imageId;
                    callback(imageId);
                    // _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                    //     "username": _basic.getSession(_basic.USER_NAME),
                    //     "userId": userId,
                    //     "userType": _basic.getSession(_basic.USER_TYPE),
                    //     "url": imageId
                    // }).then(function (data) {
                    //     if (data.success == true) {
                    //         $scope._id=data.result._id;
                    //         var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
                    //         $scope.storage_image_i.push($host.file_url + '/image/' +imageId);
                    //         $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
                    //     }
                    // });
                } else {
                    swal('上传图片失败', "", "error");
                }
            }, function (error) {
                swal('服务器内部错误', "", "error");
            })
        }
    };
    // 行驶证
    $scope.uploadBrandImage_drive = function (dom,Picture_carId) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            console.log(imageId)
        });
    };
    // 营运证
    $scope.uploadBrandImage_service=function (dom,Picture_carId) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            console.log(imageId)
        });
    };
    // 车辆照片
    $scope.uploadBrandImage_truck=function (dom,Picture_carId) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            console.log(imageId)
        });
    }
}]);