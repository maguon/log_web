app.controller("look_truck_management_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    var truckId = $stateParams.id;
    var  recordId;
    var accCheckId;
    // 点击返回按钮返回之前页面
    $scope.return = function () {
        $state.go($stateParams.from, {reload: true});
    };
    // 百度地图控件
    var map = new BMap.Map("dealer_map");
    var point = new BMap.Point(121.62, 38.92);
    map.centerAndZoom(point, 15);
    var marker = new BMap.Marker(point, {
    });
    map.addOverlay(marker);
    marker.enableDragging();
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
    marker.addEventListener("dragend", function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    });
    marker.addEventListener("click", function () {
        var sContent = "大连顺通物流有限公司...";
        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    });
    $scope.lng = 121.62;
    $scope.lat = 38.92;
    // 地图下拉
    function G(id) {
        return document.getElementById(id);
    }
    // 地图自动化提示
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "address",
            "location": map
        });
    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        $scope.input_address = myValue;
        setPlace();
    });
    function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var map = new BMap.Map("dealer_map");
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            marker = new BMap.Marker(pp);
            map.addOverlay(marker);    //添加标注
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            marker.enableDragging();
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
            $scope.$apply(function () {
                $scope.lng = pp.lng;
                $scope.lat = pp.lat;
            });
            marker.addEventListener("dragend", function () {
                $scope.$apply(function () {
                    var p = marker.getPosition();//获取marker的位置
                    $scope.lng = p.lng;
                    $scope.lat = p.lat;
                });
            });
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
        $scope.address=myValue;
    }
    //搜索新地址
    $scope.search_location = function (myKeys) {
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        if (myKeys != "") {
            myGeo.getPoint(myKeys, function (point) {
                if (point) {
                    var map = new BMap.Map("dealer_map");// 创建Map实例
                    marker = new BMap.Marker(point);
                    $scope.$apply(function () {
                        $scope.lng = point.lng;
                        $scope.lat = point.lat;
                    });
                    map.centerAndZoom(point, 18);
                    map.addOverlay(marker);
                    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    marker.enableDragging();
                    marker.addEventListener("dragend", get_location);
                    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放;
                    map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
                } else {
                    swal("无法定位当前地址", "", "error");
                }
            }, "中国");
        }
    };
    //获取移动后的坐标
    var get_location = function () {
        $scope.$apply(function () {
            var p = marker.getPosition();//获取marker的位置
            $scope.lng = p.lng;
            $scope.lat = p.lat;
        });
    };
    //获取信息
    function getDetailTruckData (){
        _basic.get($host.api_url + "/truckAccident?truckAccidentId=" + truckId).then(function (data) {
            if (data.success === true) {
                $scope.vId=data.result[0].id;
                $scope.truckId=data.result[0].truck_id;
                $scope.driveId=data.result[0].drive_id;
                $scope.dpRouteTaskId=data.result[0].dp_route_task_id;
                $scope.accidentDate=data.result[0].accident_date;
                $scope.accidentDateDetail=moment($scope.accidentDate).format("YYYY-MM-DD");
                $scope.lineStartTime=moment($scope.accidentDate).format("HH:mm");
                $scope.truckNum=data.result[0].truck_num;
                $scope.driveName=data.result[0].drive_name;
                $scope.accidentStatus=data.result[0].accident_status;
                $scope.address=data.result[0].address;
                $scope.remark=data.result[0].accident_explain;
                _basic.get($host.api_url + "/truckFirst?truckNum="+  $scope.truckNum).then(function (data) {
                    if (data.success === true) {
                        $scope.truckTel=data.result[0].truck_tel;
                        $scope.companyName=data.result[0].company_name;
                    }
                })
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    //事故信息
    $scope.createTruckAccident=function(valid){
        if(valid){
            var managementInfo = {
                driveId:$scope.driveId,
                truckId: $scope.truckId,
                dpRouteTaskId:$scope.dpRouteTaskId,
                accidentDate: $scope.accidentDateDetail+" " + $scope.lineStartTime,
                address: $scope.address,
                lng:$scope.lng,
                lat: $scope.lat,
                accidentExplain: $scope.remark
            };
            _basic.put($host.api_url + "/user/" + userId + "/truckAccident/"+truckId, managementInfo).then(function (data) {
                if (data.success === true) {
                    $state.go($stateParams.from, {reload: true})
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
    }
    $scope.showDamageImage = function () {
        $scope.getCurrentAccientImage();
    };
    // 获取当前车辆事故照片
    $scope.getCurrentAccientImage = function () {
        _basic.get($host.record_url + "/user/"+userId +"/truck/"+truckId +"/record").then(function (data) {
            if (data.success === true) {
                if(data.result.length !== 0){
                    $scope.AccientImageList = data.result[0].images;
                    recordId = data.result[0]._id;
                    for (var i = 0; i < $scope.AccientImageList.length; i++) {
                        $scope.AccientImageList[i].url =$host.file_url + '/image/' + $scope.AccientImageList[i].url
                    }
                  //   console.log("imageData",$scope.AccientImageList);
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // 图片
    $scope.car_image_i = [];
    $scope.uploadBrandImage = function (dom) {
        var filename = $(dom).val();
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
        _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {
            if (data.success) {
                var imageId = data.imageId;
                _basic.post($host.record_url + "/user/"+userId+"/truck/"+truckId+"/image", {
                    "username": _basic.getSession(_basic.USER_NAME),
                    "userId": userId,
                    "userType": _basic.getSession(_basic.USER_TYPE),
                    "url": imageId
                }).then(function (data) {
                    if (data.success == true) {
                        $scope.getCurrentAccientImage()
                        $scope._id = data.result._id;
                        var nowDate = moment(new Date()).format("YYYY-MM-DD hh:mm");
                        $scope.car_image_i.push($host.file_url + '/image/' + imageId);
                        $scope.AccientImageList.push({
                            src: $host.file_url + '/image/' + imageId,
                            time: nowDate,
                            record_id: $scope._id,
                            user: _basic.getSession(_basic.USER_NAME)
                        });
                    }
                });
            } else {
                swal('上传图片失败', "", "error");
            }
        }, function (error) {
            swal('服务器内部错误', "", "error");
        })
    };
    // 删除照片
    $scope.delete_img = function (imageUrl) {
        var url = imageUrl.split("/")[imageUrl.split("/").length - 1];
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
                _basic.delete($host.record_url + "/user/" + userId + "/record/" + recordId +'/truck/'+truckId + "/image/" + url).then(function (data) {
                    if (data.success === true) {
                        swal("删除成功!", "", "success");
                        $scope.getCurrentAccientImage()
                    }
                })
            }
        )
    }
    $scope.getCurrentAccInfo = function () {
        _basic.get($host.api_url + "/truckAccidentCheck?truckAccidentCheckId=" + accCheckId).then(function (data) {
            if (data.success === true) {
                $scope.currentAccInfo = data.result[0];
                if(data.result[0].truck_accident_type===0){
                    $scope.currentAccInfo.truck_accident_type = 0;
                }
            }
            else {
                swal(data.msg, "", "error");
            }
    });
    };
    // 点击开始处理，变为处理中状态并初始化处理信息
    $scope.beginProcessing = function () {
        _basic.post($host.api_url + "/user/" + userId + "/truckAccidentCheck" ,{
            truckAccidentId: truckId,
            truckAccidentType: 0,
            underUserId: 0,
            underUserName: "",
            underCost: 0,
            companyCost: 0,
            profit: 0,
            remark: ""
        }).then(function (data) {
            if (data.success === true) {

            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //事故处理
    $scope.getBeforeAccInfo = function () {
        console.log({
            truckAccidentId:truckId,
            truckAccidentType:parseInt($scope.currentAccInfo.truck_accident_type),
            underUserName:$scope.accInfoBefore.underUserName,
            underCost:$scope.accInfoBefore.under_cost,
            companyCost:$scope.accInfoBefore.company_cost,
            profit:$scope.accInfoBefore.profit,
            remark:$scope.accInfoBefore.remark
        })
        _basic.put($host.api_url + "/user/" + userId + "/truckAccidentCheck/" + accCheckId ,{
            truckAccidentId:truckId,
            truckAccidentType:parseInt($scope.currentAccInfo.truck_accident_type),
            underUserName:$scope.currentAccInfo.under_user_name,
            underCost:$scope.currentAccInfo.under_cost,
            companyCost:$scope.currentAccInfo.company_cost,
            profit:$scope.currentAccInfo.profit,
            remark:$scope.currentAccInfo.remark
        }).then(function (data) {
            if (data.success === true) {
                swal("保存成功", "", "success");
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    // // 保存当前处理信息
    // $scope.saveHandleInfoModify = function () {
    //     _basic.put($host.api_url + "/user/" + userId + "/truckAccidentCheck/" + accCheckId ,{
    //         truckAccidentId:truckId,
    //         truckAccidentType:parseInt($scope.currentAccInfo.truck_accident_type),
    //         underUserName:$scope.accInfoBefore.underUserName,
    //         underCost:$scope.accInfoBefore.under_cost,
    //         companyCost:$scope.accInfoBefore.company_cost,
    //         profit:$scope.accInfoBefore.profit,
    //         remark:$scope.accInfoBefore.remark
    //     }).then(function (data) {
    //         if (data.success === true) {
    //             swal("保存成功", "", "success");
    //             $scope.getBeforeAccInfo();
    //         }
    //         else {
    //             swal(data.msg, "", "error");
    //         }
    //     });
    // };
    // // 填完后提交处理信息，变为已处理
    // $scope.submitHandleInfo = function () {
    //         _basic.put($host.api_url + "/user/" + userId + "/truckAccidentCheck/" + accCheckId, {
    //             truckAccidentId: truckId,
    //             truckAccidentType: parseInt($scope.currentAccInfo.truck_accident_type),
    //             underUserName: $scope.accInfoBefore.underUserName,
    //             underCost: $scope.accInfoBefore.under_cost,
    //             companyCost: $scope.accInfoBefore.company_cost,
    //             profit: $scope.accInfoBefore.profit,
    //             remark: $scope.accInfoBefore.remark
    //         }).then(function (data) {
    //             if (data.success === true) {
    //                 swal("提交成功", "", "success");
    //                 $scope.getAfterAccInfo();
    //             }
    //             else {
    //                 swal(data.msg, "", "error");
    //             }
    //         });
    // };

    //维修信息
    $scope.truckRepairRel=function(){
        _basic.get($host.api_url +"/truckRepairRel?truckId="+ $scope.truckId).then(function (data) {
            if (data.success === true) {
                $scope.accidentList=data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    //理赔信息
    $scope.accidentInsure=function(){
        _basic.get($host.api_url +"/truckAccidentInsure?accidentInsureId="+ truckId).then(function (data) {
            if (data.success === true) {
                console.log(data)
                $scope.accidentInsureList=data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    }
    $scope.beginAccidentInsure=function(){
        $('#addInfoModel').modal('open');
        // _basic.post($host.api_url + "/user/" + userId + "/truck" +truckId+'/truckRepairRel',{
        //     repairType: 0,
        //     accidentId: 0,
        //     repairReason: "string",
        //     repairStationId: 0,
        //     repairUser: "string",
        //     remark: "string",
        //     repairMoney: 0
        // }).then(function (data) {
        //     if (data.success === true) {
        //
        //     }
        //     else {
        //         swal(data.msg, "", "error");
        //     }
        // });
    }
    // 提交新增的记录
    $scope.addRepairRecord = function () {
        if($scope.modTruckNum !== "" && $scope.modRecordTruckType !== "" && $scope.repairReason !== ""){
            _basic.post($host.api_url + "/user/" + userId + "/truck/" + $scope.modTruckNum + "/truckRepairRel",{
                repairType: $scope.modRecordTruckType,
                accidentId: $scope.associatedAccident,
                repairReason: $scope.repairReason
            }).then(function (data) {
                if (data.success === true) {
                    swal("新增成功", "", "success");
                    $('#addInfoModel').modal('close');
                    $scope.searchRepairRecordList();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    };
    // 获取数据
    $scope.queryData = function () {
        getDetailTruckData();
       // $scope.getCurrentAccInfo();
    };
    $scope.queryData();
}]);