app.controller("security_check_controller", ["$scope", "$state", "_basic", "_config", "$host", function ($scope, $state, _basic, _config, $host) {
    $scope.start = 0;
    $scope.size = 11;
    $scope.add_imageBox = [];
    $scope.put_imageBox = [];
    $scope.truck_image_add = [];
    $scope.truck_image_put = [];
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.getTruckType ='';

    /*打开新增模态 跳转*/
   function addTruckItem(){
       $('ul.tabWrap li').removeClass("active");
       $(".tab_box").removeClass("active");
       $(".tab_box").hide();
       $('ul.tabWrap li.addTruckItem ').addClass("active");
       $("#addTruckItem").addClass("active");
       $("#addTruckItem").show();
   }

   function addImg() {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.addImg ').addClass("active");
        $("#addImg").addClass("active");
        $("#addImg").show();
    };

    /*打开修改模态 跳转*/
    $scope.putTruckItem = function (){
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.putTruckItem ').addClass("active");
        $("#putTruckItem").addClass("active");
        $("#putTruckItem").show();
    }

    $scope.putImg = function (){
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.putImg ').addClass("active");
        $("#putImg").addClass("active");
        $("#putImg").show();
        getImg();
    }

    //获取货车牌号
    function getTruckNum(selectText) {
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success === true) {
                    $scope.truckNumListAllList = data.result;
                    $('#addTruckId').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
      else {
            _basic.get($host.api_url + "/truckBase").then(function (data) {
                if (data.success == true) {
                    $scope.truckNumList = data.result;
                    $('#putTruckId').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown'
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }

    //获取货车牌号 查询条件
    function getTruckId() {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                $('#truckId').select2({
                    placeholder: '货车牌号',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }

    //司机（添加）
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive?driveName=").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#addDrivderId').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }
    //司机（修改）
    function getDriveList(selectText){
        if(selectText==''||selectText==undefined){
            _basic.get($host.api_url + "/drive").then(function (data) {
                if (data.success == true) {
                    $scope.driveList = data.result;
                    $('#putDrivderId').select2({
                        placeholder: '司机',
                        containerCssClass : 'select2_dropdown'
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }else{
            _basic.get($host.api_url + "/drive").then(function (data) {
                if (data.success == true) {
                    $scope.driveList = data.result;
                    $('#putDrivderId').select2({
                        placeholder: selectText,
                        containerCssClass : 'select2_dropdown'
                    })
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    }

    // 数据导出
    $scope.export = function () {
        var obj = {
            truckId:$scope.truckId,
            truckType:$scope.getTruckType,
            checkDateStart:$scope.getStartTime,
            checkDateEnd:$scope.getEndTime
        };
        window.open($host.api_url + "/truckSecurityCheck.csv?" + _basic.objToUrl(obj));
    };

    //查询功能
    $scope.getInspect = function (){
        $scope.start = 0;
        getInspectData();
    }

    //获取查询数据
    function getInspectData(){
        _basic.get($host.api_url + "/truckSecurityCheck?" + _basic.objToUrl({
            truckId:$scope.truckId,
            truckType:$scope.getTruckType,
            checkDateStart:$scope.getStartTime,
            checkDateEnd:$scope.getEndTime,
            start:$scope.start.toString(),
            size:$scope.size
        })).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.InspectList = $scope.boxArray.slice(0, 10);
                if ($scope.start > 0) {
                    $("#pre").show();
                }
                else {
                    $("#pre").hide();
                }
                if (data.result.length < $scope.size) {
                    $("#next").hide();
                }
                else {
                    $("#next").show();
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    $scope.changeTruck =function (id){
        if(id==null){
            $scope.truckType=0
        }else{
            $scope.truckType=id.truck_type;
            //头车
            if( $scope.truckType==1){
                $scope.addLinkDevice =0;
                $scope.addLinkDeviceRemark ='';
                $scope.addHydraulicPressure =0;
                $scope.addHydraulicPressureRemark ='';
                $scope.addTurn =1;
                $scope.addTurnRemark ='';
                $scope.addBraking =1;
                $scope.addBrakingRemark ="";
                $scope.addLighting =1;
                $scope.addLightingRemark ='';
                $scope.addTransmission =1;
                $scope.addTransmissionRemark='';
                $scope.addTyre =1;
                $scope.addTyreRemark ='';
                $scope.addStructure =1;
                $scope.addStructureRemark='';
                $scope.addFacilities =1;
                $scope.addFacilitiesRemark ='';
                $scope.addSuspension =1;
                $scope.addSuspensionRemark ='';
            }
            //挂车
            else{
                $scope.addTurn =0;
                $scope.addTurnRemark ='';
                $scope.addTransmission =0;
                $scope.addTransmissionRemark='';
                $scope.addBraking =1;
                $scope.addBrakingRemark ='';
                $scope.addLinkDevice =1;
                $scope.addLinkDeviceRemark ='';
                $scope.addHydraulicPressure =1;
                $scope.addHydraulicPressureRemark ='';
                $scope.addLighting =1;
                $scope.addLightingRemark ='';
                $scope.addTyre =1;
                $scope.addTyreRemark ='';
                $scope.addStructure =1;
                $scope.addStructureRemark='';
                $scope.addFacilities =1;
                $scope.addFacilitiesRemark ='';
                $scope.addSuspension =1;
                $scope.addSuspensionRemark ='';
            }
        }

    }

    //打开新增模态框
    $scope.addInspect = function (){
        $scope.addTruckId ='';
        $scope.addDrivderId='';
        $scope.addStartTime ='';
        $scope.addNewRemark ='';
        $scope.truckNumListAllList =[];
        addTruckItem();
        getTruckNum();
        getDriveNameList ();
        $('#addItem').modal('open');
    }

    //点击确定 增加完成
    $scope.addInspectItem = function (){
        if($scope.addDrivderId==''){
            $scope.addDrivderId=0;
        }
        if ($scope.addTruckId !== "" && $scope.addStartTime!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/truckSecurityCheck", {
                driveId:$scope.addDrivderId,
                truckId:$scope.addTruckId.id,
                truckType: $scope.addTruckId.truck_type,
                turn:$scope.addTurn,
                turnRemark: $scope.addTurnRemark,
                braking: $scope.addBraking,
                brakingRemark:$scope.addBrakingRemark,
                liquid:$scope.addHydraulicPressure,
                liquidRemark:$scope.addHydraulicPressureRemark,
                lighting: $scope.addLighting,
                lightingRemark:$scope.addLightingRemark,
                transmission: $scope.addTransmission,
                transmissionRemark:$scope.addTransmissionRemark,
                tyre:$scope.addTyre,
                tyreRemark:$scope.addTyreRemark,
                suspension:$scope.addSuspension,
                suspensionRemark:$scope.addSuspensionRemark,
                structure: $scope.addStructure,
                structureRemark:$scope.addStructureRemark,
                facilities: $scope.addFacilities,
                facilitiesRemark:$scope.addFacilitiesRemark,
                linkDevice: $scope.addLinkDevice,
                linkDeviceDemark:$scope.addLinkDeviceRemark,
                checkDate: $scope.addStartTime,
                remark: $scope.addNewRemark
            }).then(function (data) {
                if (data.success === true) {
                    $scope.checkId=data.id;
                    addImg();
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }


    //点击图片确定
    $scope.addInspectImg =function (){
         $('#addItem').modal('close');
          getInspectData();
    }

    // 车检照片 添加
    $scope. uploadImage_truck= function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/truckCheck/" + $scope.checkId + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId,
                "vheNo": $scope.addTruckId.truck_num
            }).then(function (data) {
                if (data.success == true) {
                    if(data.result&&data.result!==null){
                        $scope._id = data.result._id;
                    }
                    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                    $scope.truck_image_add.push($host.file_url + '/image/' + imageId);
                    $scope.add_imageBox.push({
                        src: $host.file_url + '/image/' + imageId,
                        record_id: $scope._id,
                        time: nowDate,
                        user: _basic.getSession(_basic.USER_NAME)
                    });
                }
            });
        });
    };


    //打开修改模态框
    $scope.putInspect = function (id){
        $scope.id = id;
        $scope.driveList =[];
        $('#putItem').modal('open');
        $scope.putTruckItem();
        _basic.get($host.api_url + "/truckSecurityCheck?securityCheckId=" +id).then(function (data) {
            if (data.success === true) {
                if(data.result.length==0){
                    $scope.putInspectList = [];
                }
                else{
                    $scope.putInspectList = data.result[0];
                    $scope.putInspectList.drive_id = (data.result[0].drive_id==0|| data.result[0].drive_id==null|| data.result[0].drive_id=='')?null:data.result[0].drive_id;
                    $scope.putInspectList.truck_type = data.result[0].truck_type;
                    $scope.putInspectList.check_date = moment(data.result[0].check_date).format('YYYY-MM-DD');
                    getTruckNum($scope.putInspectList.truck_num)
                    getDriveList($scope.putInspectList.drive_name)
                }
            }
        })
    }

    //点击确定 修改完成
    $scope.putInspectItem = function (){
        if($scope.putInspectList.drive_id==''){
            $scope.putInspectList.drive_id=0;
        }
        $scope.putInspectList.turn=$scope.putInspectList.turn==""?0:$scope.putInspectList.turn;
        $scope.putInspectList.link_device=$scope.putInspectList.link_device==""?0:$scope.putInspectList.link_device;
        $scope.putInspectList.transmission=$scope.putInspectList.transmission==""?0:$scope.putInspectList.transmission;
        $scope.putInspectList.liquid=$scope.putInspectList.liquid==""?0:$scope.putInspectList.liquid;
        if ($scope.putInspectList.check_date!=='') {
            _basic.put($host.api_url + "/user/" + userId + "/truckSecurityCheck/"+$scope.id, {
                driveId:$scope.putInspectList.drive_id,
                turn:$scope.putInspectList.turn,
                turnRemark:$scope.putInspectList.turn_remark,
                braking:$scope.putInspectList.braking,
                brakingRemark:$scope.putInspectList.braking_remark,
                liquid:$scope.putInspectList.liquid,
                liquidRemark:$scope.putInspectList.liquid_remark,
                lighting:$scope.putInspectList.lighting,
                lightingRemark:$scope.putInspectList.lighting_remark,
                transmission:$scope.putInspectList.transmission,
                transmissionRemark:$scope.putInspectList.transmission_remark,
                tyre:$scope.putInspectList.tyre,
                tyreRemark:$scope.putInspectList.tyre_remark,
                suspension:$scope.putInspectList.suspension,
                suspensionRemark:$scope.putInspectList.suspension_remark,
                structure: $scope.putInspectList.structure,
                structureRemark:$scope.putInspectList.structure_remark,
                facilities: $scope.putInspectList.facilities,
                facilitiesRemark:$scope.putInspectList.facilities_remark,
                linkDevice: $scope.putInspectList.link_device,
                linkDeviceRemark:$scope.putInspectList.link_device_remark,
                checkDate: $scope.putInspectList.check_date,
                remark: $scope.putInspectList.remark
            }).then(function (data) {
                if (data.success === true) {
                    swal("修改成功", "", "success");
                    $scope.putImg();
                    /*getInspectData();*/
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }

    //获取图片详情
     function getImg() {
         $scope.put_imageBox =[];
         $scope.truck_image_put=[];
        // 照片详情
        _basic.get($host.record_url + "/truckCheck?truckCheckId="+ $scope.id).then(function (data) {
            if (data.success == true) {
                if(data.result.length==0){
                    $scope.operating_record={};
                }else{
                    $scope.operating_record = data.result[0];
                    $scope.comment = $scope.operating_record.comments;
                    $scope.truck_image = $scope.operating_record.check_image;
                    if ($scope.truck_image&&$scope.truck_image.length > 0) {
                        for (var i in $scope.truck_image) {
                            if ($scope.truck_image_put.indexOf($host.file_url + '/image/' + $scope.truck_image[i].url) == -1) {
                                $scope.truck_image_put.push($host.file_url + '/image/' + $scope.truck_image[i].url);
                                $scope.put_imageBox.push({
                                    src: $host.file_url + '/image/' + $scope.truck_image[i].url,
                                    record_id: $scope.operating_record._id,
                                    time: $scope.truck_image[i].timez,
                                    user: $scope.truck_image[i].name
                                });
                            }
                        }
                    }
                }
            } else {
                swal(data.msg, "", "error")
            }
        });

    };

    //修改
    $scope.uploadBrandImage_truck= function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            _basic.post($host.record_url + "/user/" + userId + "/truckCheck/" +  $scope.id + "/image", {
                "username": _basic.getSession(_basic.USER_NAME),
                "userId": userId,
                "userType": _basic.getSession(_basic.USER_TYPE),
                "url": imageId,
                "vheNo":$scope.putInspectList.truck_num
            }).then(function (data) {
                if (data.success == true) {
                    if(data.result&&data.result!==null){
                        $scope._id = data.result._id;
                    }
                    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                    $scope.truck_image_put.push($host.file_url + '/image/' + imageId);
                    $scope.put_imageBox.push({
                        src: $host.file_url + '/image/' + imageId,
                        record_id: $scope._id,
                        time: nowDate,
                        user: _basic.getSession(_basic.USER_NAME)
                    });
                }
            });
        });
    }


    $scope.putInspectImg =function (){
        $('#putItem').modal('close');
        getInspectData();
    }

    // 删除车检照片
    $scope.delete_add = function (record_id, src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                var url_array = src.split("/");
                var url = url_array[url_array.length - 1];
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + record_id + "/truckCheckImage/" + url).then(function (data) {
                    if (data.success == true) {
                        var i = $scope.truck_image_add.indexOf(src);
                        $scope.add_imageBox.splice(i, 1);
                        $scope.truck_image_add.splice(i, 1);
                        swal("删除成功!", "", "success");
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        })
    }


    // 删除车检照片
    $scope.delete_put = function (record_id, src) {
        swal({
                title: "确认删除该照片？",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
        }).then(function (result) {
            if (result.value) {
                var url_array = src.split("/");
                var url = url_array[url_array.length - 1];
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + record_id + "/truckCheckImage/" + url).then(function (data) {
                    if (data.success == true) {
                        var i = $scope.truck_image_put.indexOf(src);
                        $scope.put_imageBox.splice(i, 1);
                        $scope.truck_image_put.splice(i, 1);
                        swal("删除成功!", "", "success");
                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
        })
    }

    // 照片上传函数
    function uploadBrandImage(filename, dom_obj, callback) {
        if (filename) {
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=9', function (data) {
                        if (data.success) {
                            var imageId = data.imageId;
                            callback(imageId);
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
            } else {

            }

        }
    }

    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getInspectData();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getInspectData();
    };

    //获取数据
    function queryData() {
        getInspectData();
        getTruckId();
    }
    queryData()
}]);
