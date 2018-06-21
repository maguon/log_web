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
            receivedDate:$scope.settlementList.received_date,
            remark:$scope.settlementList.remark
        };
        _basic.put($host.api_url + "/user/" + userId+'/settleHandover/'+id, obj).then(function (data) {
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
        getImage();
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
                            swal('该VIN不存在！', "", "error")
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
        $scope.car_details =[];
        _basic.get($host.api_url+"/settleHandoverCarRel?settleHandoverId="+settlementId).then(function (data) {
            if(data.success=true){
                if(data.result.length==0){
                    $scope.car_details =[];
                }else{
                    $scope.car_details=data.result;
                }

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
                getDetailItem();
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
    function uploadBrandImage(filename,dom_obj,callback) {
        if(filename){
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename))
            {
                var max_size_str = dom_obj.attr('max_size');
                var max_size = 4 * 1024 * 1024; //default: 4M
                var re = /\d+m/i;
                if (re.test(max_size_str)) {
                    max_size = parseInt(max_size_str.substring(0, max_size_str.length - 1)) * 1024 * 1024;
                    _basic.formPost(dom_obj.parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=7', function (data) {

                        if (data.success==true) {
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
            }else {

            }

        }
    };

     //获取交接单相片
    function getImage(){
        _basic.get($host.api_url + "/settleHandover?settleHandoverId="+settlementId).then(function (data) {
            if(data.success==true){
                if(data.result[0].handove_image){
                    $scope.no_img=false;
                    $scope.settleHandover_img=[{
                        img:$host.file_url + '/image/'+data.result[0].handove_image
                    }];
                }else {
                    $scope.no_img=true;
                }
            }else {
                swal(data.msg, "", "error")
            }
        });

    }

    // 交接单
    $scope.uploadSettlementImage = function (dom) {
        var dom_obj=$(dom);
        var filename = $(dom).val();
        uploadBrandImage(filename,dom_obj,function (imageId) {
            var nowDate=moment(new Date()).format("YYYY-MM-DD HH:mm");
            $scope.$apply(function () {
                $scope.settleHandover_img=[{
                    img:$host.file_url + '/image/'+imageId
                }];
            });
            var obj={
                "handoveImage": imageId
            };
            _basic.put($host.api_url+"/user/"+userId+"/settleHandover/"+settlementId+"/image",obj).then(function (data) {
                if(data.success==true){
                    $scope.lookImg();
                    viewer.destroy();

                }else {
                    swal(data.msg,"","error")
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

    //获取数据
    function getData(){
        getDetailItem();
        seachLinkCar();
    }
    getData();
}])