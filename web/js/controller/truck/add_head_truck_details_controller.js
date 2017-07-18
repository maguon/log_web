/**
 * Created by ASUS on 2017/7/13.
 */
/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_head_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    // 车辆存照片ID;
    var Picture_truckid;
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


    // 新增
    $scope.submit_Form=function (inValid) {
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
                // "relId":$scope.check_hand_truck,
                "truckStatus":1,
                // "number": 0,
                "drivingDate":$scope.drive_time,
                "licenseDate": $scope.service_time,
                // "twoDate": "string",
                // "drivingImage": "string",
                // "licenseImage": "string",
                "remark":$scope.textarea
            };
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
                        Picture_truckid = data.id;
                    }else {
                        swal(data.msg,"","error")
                    }
                });
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
                    // $currentDom = $(dom).prev();
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=2', function (data) {

                        if (data.success) {

                            // // console.log(data,Picture_truckid);
                            var imageId = data.imageId;
                            callback(imageId);
                            // _basic.post($host.record_url + "/car/" + $scope.Picture_truckid + "/vin/" + $scope.vin + "/storageImage", {
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

                if (dom_obj[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }

            }
            else if (filename && filename.length > 0) {
                dom_obj.val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            }else {

            }

        }
    };
    // 行驶证
    $scope.uploadBrandImage_drive = function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.drive_img=[{
                    img:$host.file_url + '/image/'+imageId,
                }];
            });
            var obj={
                "drivingImage": imageId,
                // "licenseImage": "string",
                "imageType": 1
            };
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+Picture_truckid+"/image",obj).then(function (data) {
                if(data.success==true){

                }else {
                    swal(data.msg,"","error")
                }
            })
            
        });
    };
    // 营运证
    $scope.uploadBrandImage_service=function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
            $scope.$apply(function () {
                $scope.service_img=[{
                    img:$host.file_url + '/image/'+imageId,
                }];
            });
            var obj={
                // "drivingImage": imageId,
                "licenseImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+Picture_truckid+"/image",obj).then(function (data) {
                if(data.success==true){

                }else {
                    swal("上传失败","","error")
                }
            })
        });
    };
    $scope.truck_imageBox=[];
    $scope.truck_image_i=[];
    // 车辆照片
    $scope.uploadBrandImage_truck=function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        // console.log($(dom).val());
        uploadBrandImage(filename,dom_obj,function (imageId) {
            _basic.post($host.record_url + "/user/" +userId + "/truck/" +Picture_truckid + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId
            }).then(function (data) {
                if (data.success == true) {
                    $scope._id=data.result._id;
                    var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
                    $scope.truck_image_i.push($host.file_url + '/image/' +imageId);
                    $scope.truck_imageBox.push({src: $host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
                }
            });
        });
    };
    // 删除车辆照片
    $scope.delete_=function (record_id,src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false
            },
            function () {
                // console.log(src);
                var url_array=src.split("/");
                var url=url_array[url_array.length-1];
                _basic.delete($host.record_url+"/user/"+userId+"/record/"+record_id+"/truck/"+Picture_truckid+"/image/"+url).then(function (data) {
                    if(data.success==true){
                        var i=$scope.truck_image_i.indexOf(src);
                        $scope.truck_imageBox.splice(i,1);
                        $scope.truck_image_i.splice(i,1);
                        swal("删除成功!", "", "success");
                        // $scope.lookStorageCar(data.result.id,data.result.vin)
                    }else {
                        swal(data.msg,"","error")
                    }
                })
            }
        )

    };
    // 图片--车险
    $scope.next=function () {
        $(".ui-tabs li").addClass("disabled");
        $(".test3").removeClass("disabled");
        $(".ui-tabs li>a").removeClass("active");
        $(".test3>a").addClass("active");
        $(".tabs .indicator").css({
            right:456+"px",
            left:942+"px"
        });
        $(".test").hide();
        $(".test").removeClass("active");
        $("#test3").show();
        $("#test3").addClass("active");
    };
    
    $scope.submit_time_Form=function (inValid) {
        $scope.submitted=true;
        // var obj={
        //     "truckNum":$scope.truck_num,
        //     "brandId":$scope.truck_make,
        //     "truckTel": $scope.phone_num,
        //     "theCode": $scope.vin,
        //     "driveId": $scope.main_driver,
        //     // "copilot": "string",
        //     "companyId":$scope.truck_company,
        //     "truckType":$scope.truck_type,
        //     // "relId":$scope.check_hand_truck,
        //     "truckStatus":1,
        //     // "number": 0,
        //     // "drivingDate": "string",
        //     // "licenseDate": "string",
        //     // "twoDate": "string",
        //     // "drivingImage": "string",
        //     // "licenseImage": "string",
        //     "remark":$scope.textarea
        // };
        // console.log(obj);
        if(inValid){

        }
    }
}]);