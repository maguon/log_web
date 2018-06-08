/**
 * Created by star  on 2018/6/5.
 */

//结算管理
app.controller("settlement_management_detail_controller", ["$scope","$state","$stateParams", "$host", "_basic", function ($scope,$state,$stateParams,$host, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    var settlementId = $stateParams.id;
    $scope.entrustId = '';
    $scope.carId = undefined;

    //获取详细信息
    function getDetailItem(){
        _basic.get($host.api_url + "/settleHandover?settleHandoverId="+settlementId).then(function (data) {
            if (data.success === true) {
                $scope.settlementList = data.result[0];
                $scope.entrustId= data.result[0].entrust_id;
                $scope.settlementList.received_date=  moment(data.result[0].received_date).format('YYYY-MM-DD');
                $scope.lookBaseMsg();
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //修改交接单信息
    $scope.putDataItem = function(id){
        var obj = {
            number: $scope.settlementList.created_on,
            remark: $scope.settlementList.remark
        };
        _basic.put($host.api_url + "/user/" + id, obj).then(function (data) {
            if (data.success == true) {
                swal("修改成功", "", "success");
                getDetailItem()
            } else {
                swal(data.msg, "", "error");
            }

        })
    }

    // 车辆照片跳转
    $scope.lookBaseMsg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookBaseMsg ').addClass("active");
        $("#lookBaseMsg").addClass("active");
        $("#lookBaseMsg").show();
    };
    $scope.lookImg = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookImg ').addClass("active");
        $("#lookImg").addClass("active");
        $("#lookImg").show();
    };


    //模糊查询
    var vinObjs ={}
    $('#autocomplete-input').autocomplete({
        data: vinObjs,
        limit: 10,
        onAutocomplete: function(val) {
        },
        minLength: 6,
    });
    $scope.shortSearch=function () {
        if($scope.carVin!==""&&$scope.carVin!==undefined) {
            if ($scope.carVin.length >= 6) {
                _basic.get($host.api_url + "/dpRouteLoadTaskDetailBase?vinCode=" +$scope.carVin+ '&entrustId='+$scope.entrustId+'&carLoadStatus=2', {}).then(function (data) {
                    if (data.success == true) {
                        if(data.result.length == 0){
                            $scope.carVin=""
                            swal('该VIN码不存在！', "", "error")
                        }
                        else{
                            $scope.vinMsg = data.result;
                            $scope.carId= data.result[0].car_id;
                            vinObjs = {};
                            for (var i in $scope.vinMsg) {
                                vinObjs[$scope.vinMsg[i].vin] = null;
                            }
                            return vinObjs;
                        }

                    }

                    else {
                        swal(data.msg, "", "error");
                    }

                }).then(function (vinObjs) {
                    $('#autocomplete-input').autocomplete({
                        data: vinObjs,
                        minLength: 6
                    });
                    $('#autocomplete-input').focus();
                })
            } else {
                $('#autocomplete-input').autocomplete({minLength: 6});
                $scope.vinMsg = {}
            }
        }
    };

    // 查询本委托方下得所有关联车辆
    function seachLinkCar(){
        $scope.carVin="";
        _basic.get($host.api_url+"/settleHandoverCarRel?settleHandoverId="+settlementId).then(function (data) {
            if(data.success=true&&data.result.length>0){
                $scope.car_details=data.result;
            }
        })
    }


    //添加关联车辆
    $scope.addLinkCar=function () {
        _basic.post($host.api_url+"/user/" + userId+'/settleHandoverCarRel' ,{
            settleHandoverId: settlementId,
            carId: $scope.carId
        }).then(function (data) {
            if(data.success==true){
                seachLinkCar();
            }
            else {
                $scope.carVin="";
                swal(data.msg, "", "error");
            }
        })
    };


   //删除当前车辆信息
     $scope.deleteSettlementList = function(carId,settleHandoverId){
         swal({
                 title: "确定删除当前车辆吗？",
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 confirmButtonText: "确认",
                 cancelButtonText: "取消",
                 closeOnConfirm: true
             },
             function(){
                 _basic.delete($host.api_url + "/user/" + userId + "/settleHandover/" +settleHandoverId+ "/car/" +carId ).then(function (data) {
                     if (data.success === true) {
                         seachLinkCar();
                     }
                     else {
                         swal(data.msg, "", "error");
                     }
                 });
             });
     }


    // 照片上传函数
    // 图片上传
    $scope.imgArr = [];
    // 预览详情照片
    $scope.ImageBox = [];
    $scope.ImageI = [];

    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
        if (filename) {
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                var max_size_str = $(dom).attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                }
                if ($(dom)[0].files[0].size > max_size) {
                    swal('图片文件最大: ' + max_size_str, "", "error");
                    return false;
                }
            }
            else if (filename && filename.length > 0) {
                $(dom).val('');
                swal('支持的图片类型为. (jpeg,jpg,png,gif,svg,bmp,tiff)', "", "error");
            }
            _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=7', function (data) {
                if (data.success) {
                    var imageId = data.imageId;
                    _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope._id = data.result._id;
                            if ($scope.ImageBox.length != 0) {
                                viewer.destroy();
                            }
                            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
                            $scope.ImageI.push($host.file_url + '/image/' + imageId);
                            $scope.ImageBox.push({
                                src: $host.file_url + '/image/' + imageId,
                                record_id: $scope._id,
                                time: nowDate,
                                user: _basic.getSession(_basic.USER_NAME)
                            });
                        }
                    });
                }
                else {
                    swal('上传图片失败', "", "error");
                }
            }, function (error) {
                swal('服务器内部错误', "", "error");
            })
        }
    };

    // var add_viewer;
    $scope.renderFinish = function () {
        viewer = new Viewer(document.getElementById('look_img'), {
            url: 'data-original'
        });
    };

    //交接单图片
    $scope.uploadBrandImage_drive = function (dom) {
        var dom_obj = $(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename, dom_obj, function (imageId) {
            var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.drive_img = [{
                    img: $host.file_url + '/image/' + imageId,
                }];
            });
            var obj = {
                "truckImage": imageId,
                "imageType": 1
            };
            _basic.put($host.api_url + "/user/" + userId + "/truck/" + truck_id + "/image", obj).then(function (data) {
                if (data.success == true) {

                } else {
                    swal(data.msg, "", "error")
                }
            })

        });
    };





    getDetailItem();
    seachLinkCar();
}])