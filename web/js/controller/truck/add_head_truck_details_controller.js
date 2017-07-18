/**
 * Created by ASUS on 2017/7/13.
 */
/**
 * Created by ASUS on 2017/7/11.
 */
app.controller("add_head_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    var hand_truck_msg;
    var hand_driver_msg;
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
            hand_truck_msg=data.result;
            $scope.hand_truck_msg=data.result;
        }else {
            swal(data.msg,"","error")
        }
    });
    // 获取主驾司机
    _basic.get($host.api_url+"/drive").then(function (data) {
        if(data.success==true){
            hand_driver_msg=data.result;
            $scope.drive=hand_driver_msg;
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
                            right:1132+"px",
                            left:377+"px"
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
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename))
            {
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
    // 图片--绑定挂车
    $scope.next=function () {
        $(".ui-tabs li").addClass("disabled");
        $(".test3").removeClass("disabled");
        $(".ui-tabs li>a").removeClass("active");
        $(".test3>a").addClass("active");
        $(".tabs .indicator").css({
            right:755+"px",
            left:754+"px"
        });
        $(".test").hide();
        $(".test").removeClass("active");
        $("#test3").show();
        $("#test3").addClass("active");
    };

    // 挂车过滤
    $scope.Binding_trailer_check=function () {

        console.log($scope.Binding_trailer,hand_truck_msg);
        if($scope.Binding_trailer.length==0){
            $scope.hand_truck_msg=hand_truck_msg;
        }else {
            $scope.hand_truck_msg=[];
            hand_truck_msg.forEach(function (i) {
                for(var j=0;j<$scope.Binding_trailer.length;j++){
                    if(i.truck_num.indexOf($scope.Binding_trailer[j])!=-1){
                        $scope.hand_truck_msg.push(i)
                    }
                }
            })
        }
    };
    $scope.clear_trailer=function () {
        $scope.check_trailer_id="";
    };
    $scope.check_trailer=function (id) {
        $scope.check_trailer_id=id;
    };
    // 绑定挂车——绑定司机
    $scope.Binding_trailer_submit=function () {
        if($scope.check_trailer_id){
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+Picture_truckid+"/truckRel/"+$scope.check_trailer_id+"/bind",{}).then(function (data) {
                if(data.success==true){
                    $(".ui-tabs li").addClass("disabled");
                    $(".test4").removeClass("disabled");
                    $(".ui-tabs li>a").removeClass("active");
                    $(".test4>a").addClass("active");
                    $(".tabs .indicator").css({
                        right:378+"px",
                        left:1131+"px"
                    });
                    $(".test").hide();
                    $(".test").removeClass("active");
                    $("#test4").show();
                    $("#test4").addClass("active");
                }else {
                    swal("异常","","error")
                }
            })
        }else {
            $(".ui-tabs li").addClass("disabled");
            $(".test4").removeClass("disabled");
            $(".ui-tabs li>a").removeClass("active");
            $(".test4>a").addClass("active");
            $(".tabs .indicator").css({
                right:378+"px",
                left:1131+"px"
            });
            $(".test").hide();
            $(".test").removeClass("active");
            $("#test4").show();
            $("#test4").addClass("active");
        }
    };


    $scope.clear_driver=function () {
        $scope.check_driver_id="";
    };
    $scope.check_driver=function (id) {
        $scope.check_driver_id=id;
    };
    // 司机过滤
    $scope.Binding_driver_check=function () {

        console.log($scope.Binding_driver,hand_driver_msg);
        if($scope.Binding_driver.length==0){
            $scope.drive=hand_driver_msg;
        }else {
            $scope.drive=[];
            hand_driver_msg.forEach(function (i) {
                for(var j=0;j<$scope.Binding_driver.length;j++){
                    if(i.drive_name.indexOf($scope.Binding_driver[j])!=-1){
                        $scope.drive.push(i)
                    }
                }
            })
        }
    };
    // 绑定司机——车保
    $scope.binding_driver_submit=function () {
        if($scope.check_driver_id){
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+Picture_truckid+"/drive/"+$scope.check_driver_id+"/bind",{}).then(function (data) {
                if(data.success==true){
                    $(".ui-tabs li").addClass("disabled");
                    $(".test5").removeClass("disabled");
                    $(".ui-tabs li>a").removeClass("active");
                    $(".test5>a").addClass("active");
                    $(".tabs .indicator").css({
                        right:0+"px",
                        left:1508+"px"
                    });
                    $(".test").hide();
                    $(".test").removeClass("active");
                    $("#test5").show();
                    $("#test5").addClass("active");
                }else {
                    swal("异常","","error")
                }
            })
        }else {
            $(".ui-tabs li").addClass("disabled");
            $(".test5").removeClass("disabled");
            $(".ui-tabs li>a").removeClass("active");
            $(".test5>a").addClass("active");
            $(".tabs .indicator").css({
                right:0+"px",
                left:1508+"px"
            });
            $(".test").hide();
            $(".test").removeClass("active");
            $("#test5").show();
            $("#test5").addClass("active");
        }


    };
    $scope.add_guarantee=function () {
        $('.modal').modal();
        $('#add_guarantee').modal('open');
    }
}]);