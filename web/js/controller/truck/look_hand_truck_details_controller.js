/**
 * Created by ASUS on 2017/7/19.
 */
app.controller("look_hand_truck_details_controller", ["$scope","$state","$stateParams","_basic", "_config", "$host", function ($scope,$state,$stateParams, _basic, _config, $host) {
    var userId=_basic.getSession(_basic.USER_ID);
    var id=$stateParams.id;
    var head_car_msg=[];
    $scope.show_unbind_head_btn=false;
    $scope.no_service_img=false;
    $scope.no_drive_img=false;
    $scope.return=function () {
        $state.go($stateParams.from,{reload:true})
    };
    var viewer;
    // 车辆存照片ID;
    var Picture_truckid;
    // 所属类型--公司联动
    $scope.getCompany=function () {
        _basic.get($host.api_url+"/company?operateType="+$scope.truckTrailer.operate_type).then(function (data) {
            if(data.success==true){
                $scope.company=data.result;
            }else {
                swal(data.msg,"","error")
            }
        });
    };
    
    function truck_msg() {
        var p =new Promise(function (resolve, reject) {
            resolve();

        });
        return p
    }
    function truck_details() {
        var p =new Promise(function (resolve, reject) {
            resolve();

        });
        return p
    }
    truck_msg().then(function () {
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
                head_car_msg=data.result;

            }else {
                swal(data.msg,"","error")
            }
        });
        return truck_details()
    }).then(function () {
        // 挂车详情
        _basic.get($host.api_url+"/truckTrailer?truckId="+id).then(function (data) {
            if(data.success==true){
                $scope.truckTrailer=data.result[0];
                $scope.truck_id=$scope.truckTrailer.truck_num;
                $scope.hand_truck_img($scope.truck_id);
                $scope.getCompany();
                $scope.Binding_head_truck=$scope.truckTrailer.first_num;
                if($scope.Binding_head_truck!=null&&$scope.Binding_head_truck!=""){
                    $scope.show_unbind_head_btn=true;
                }
                $scope.Binding_head_truck_check();
            }else {
                swal(data.msg,"","error");
            }
        });
        // 行驶证详情
        _basic.get($host.api_url + "/truckTrailer?truckId="+id).then(function (data) {
            if(data.success==true){
                if(data.result[0].driving_image){
                    $scope.drive_img=[{
                        img:$host.file_url + '/image/'+data.result[0].driving_image,
                    }];
                }else {
                    $scope.no_drive_img=true;
                }
            }else {
                swal(data.msg, "", "error")
            }
        });

        // 营运证详情
        _basic.get($host.api_url + "/truckTrailer?truckId="+id).then(function (data) {
            if(data.success==true){
                if(data.result[0].license_image){
                    $scope.service_img=[{
                        img:$host.file_url + '/image/'+data.result[0].license_image,
                    }];
                }else {
                    $scope.no_service_img=true;
                }
            }else {
                swal(data.msg, "", "error")
            }
        });
        $scope.hand_truck_img=function (truck_id) {
            // 照片详情
            _basic.get($host.record_url + "/user/" + userId + "/truck/" + truck_id + "/record").then(function (data) {
                if (data.success == true) {
                    // console.log(data);
                    $scope.operating_record = data.result[0];
                    $scope.comment = $scope.operating_record.comments;
                    $scope.truck_image = $scope.operating_record.images;
                    if($scope.truck_image.length>0){
                        for (var i in $scope.truck_image) {
                            if($scope.truck_image_i.indexOf($host.file_url + '/image/' + $scope.truck_image[i].url)==-1){
                                $scope.truck_image_i.push($host.file_url + '/image/' + $scope.truck_image[i].url);
                                $scope.truck_imageBox.push({src: $host.file_url + '/image/' + $scope.truck_image[i].url,record_id:$scope.operating_record._id,time:$scope.truck_image[i].timez,user:$scope.truck_image[i].name});
                            }

                        }
                    }

                    // $scope.imgArr.push({src:$host.file_url+'/image/'+imageId});
                } else {
                    swal(data.msg, "", "error")
                }
            });
        }

    })



    // 修改挂车
    $scope.submit_Form=function (inValid) {
        $scope.submitted=true;
        var obj={
            "truckNum":$scope.truckTrailer.truck_num,
            "brandId":$scope.truckTrailer.brand_id,
            "truckTel": $scope.truckTrailer.truck_tel,
            "theCode": $scope.truckTrailer.the_code,
            "companyId":$scope.truckTrailer.company_id,
            "truckType":2,
            "number":$scope.truckTrailer.number,
            "drivingDate":$scope.truckTrailer.driving_date,
            "licenseDate":$scope.truckTrailer.license_date,
            "remark":$scope.truckTrailer.remark
        };
        if(inValid){
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+id,obj).then(function (data) {
                if(data.success==true){
                    swal("修改成功","","success")
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

                        if (data.success==true) {

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
                "truckImage": imageId,
                // "licenseImage": "string",
                "imageType": 1
            };
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+id+"/image",obj).then(function (data) {
                if(data.success==true){
                    viewer.destroy();
                    $scope.no_drive_img=false;
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
                "truckImage": imageId,
                "imageType": 2
            };
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+id+"/image",obj).then(function (data) {
                if(data.success==true){
                    viewer.destroy();
                    $scope.no_service_img=false;
                }else {
                    swal("上传失败","","error")
                }
            })
        });
    };
    // var add_viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };
    $scope.renderFinish_s = function () {
        viewer = new Viewer(document.getElementById('look_truck_img'), {
            url: 'data-original'
        });
    };
    $scope.renderFinish_d = function () {
        viewer = new Viewer(document.getElementById('look_dirve_img'), {
            url: 'data-original'
        });
    };
    $scope.truck_imageBox=[];
    $scope.truck_image_i=[];
    // 车辆照片
    $scope.uploadBrandImage_truck=function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        if(filename){
            // console.log($(dom).val());
            uploadBrandImage(filename,dom_obj,function (imageId) {
                _basic.post($host.record_url + "/user/" +userId + "/truck/" +$scope.truck_id + "/image", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope._id = data.result._id;
                        // viewer.destroy();
                        var nowDate=moment(new Date()).format("YYYY-DD-MM HH:mm");
                        $scope.truck_image_i.push($host.file_url + '/image/' +imageId);
                        $scope.truck_imageBox.push({src: $host.file_url + '/image/' + imageId,record_id:$scope._id,time:nowDate,user:_basic.getSession(_basic.USER_NAME)});
                    }
                });
            });
        }

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
                _basic.delete($host.record_url+"/user/"+userId+"/record/"+record_id+"/truck/"+$scope.truck_id+"/image/"+url).then(function (data) {
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
    // 头车过滤
    $scope.Binding_head_truck_check=function () {
        if($scope.Binding_head_truck!=null&&$scope.Binding_head_truck!=""){
            $scope.head_car_msg=[];
            head_car_msg.forEach(function (i) {
                if(i.truck_num.indexOf($scope.Binding_head_truck)!=-1){
                    if($scope.head_car_msg.indexOf(i)==-1){
                        $scope.head_car_msg.push(i)
                    }

                }
            })
        }else {
            $scope.head_car_msg=head_car_msg;
        }

    };
    $scope.clear_head_truck=function () {
        $scope.check_head_car_id="";
    };
    $scope.check_head_truck=function (id,num) {
        $scope.check_head_car_id=id;
        $scope.Binding_head_truck=num;
    };
    // 绑定头车
    $scope.Binding_head_car_submit=function () {
        if($scope.check_head_car_id){
            _basic.put($host.api_url+"/user/"+userId+"/truck/"+$scope.check_head_car_id+"/trail/"+id+"/bind",{}).then(function (data) {
                if(data.success==true){
                    swal("绑定成功","","success");
                    truck_msg().then(function () {
                        // 获取车头
                        _basic.get($host.api_url+"/truckFirst?truckType=1").then(function (data) {
                            if(data.success==true){
                                $scope.head_car_msg=data.result;
                                head_car_msg=data.result;

                            }else {
                                swal(data.msg,"","error")
                            }
                        });
                        return truck_details()
                    }).then(function () {
                        // 挂车详情
                        _basic.get($host.api_url+"/truckTrailer?truckId="+id).then(function (data) {
                            if(data.success==true){
                                $scope.truckTrailer=data.result[0];
                                $scope.truck_id=$scope.truckTrailer.truck_num;
                                $scope.hand_truck_img($scope.truck_id);
                                $scope.getCompany();
                                $scope.Binding_head_truck=$scope.truckTrailer.first_num;
                                if($scope.Binding_head_truck!=null&&$scope.Binding_head_truck!=""){
                                    $scope.show_unbind_head_btn=true;
                                }
                                $scope.Binding_head_truck_check();
                            }else {
                                swal("请求异常","","error");
                            }
                        });
                    });
                }else {
                    swal(data.msg,"","error")
                }
            })
        }else {

        }
    };
    // 解绑头车
    $scope.unbind_head_truck=function () {
        _basic.put($host.api_url+"/user/"+userId+"/truck/"+$scope.truckTrailer.first_id+"/trail/"+id+"/unbind",{}).then(function (data) {
            if(data.success==true){
                swal("解绑成功","","success");
                $scope.show_unbind_head_btn=false;
                // 获取车头
                _basic.get($host.api_url+"/truckTrailer?truckType=1").then(function (data) {
                    if(data.success==true){
                        $scope.head_car_msg=data.result;
                        head_car_msg=data.result;

                    }else {
                        swal(data.msg,"","error")
                    }
                });

            }else {
                swal(data.msg,"","error")
            }
        });
    };


    $scope.add_guarantee=function () {
        $('.modal').modal();
        $('#add_guarantee').modal('open');
    }
}]);