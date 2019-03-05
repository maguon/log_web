/**
 * Created by ASUS on 2017/6/9.
 */

app.controller("car_to_data_controller", ['$scope', "$host", '_basic', '_socket',function ($scope, $host, _basic, _socket) {

        var userId = _basic.getSession(_basic.USER_ID);
        var userType = _basic.getSession(_basic.USER_TYPE);
        $scope.upload_percent = 0;
        $scope.num = 0;
        $scope.flag=false;
        $scope.templateBox = true;
        $scope.success_data_box = false;
        $scope.dataBox = false;
        $scope.Picture_carId = "";
        var orginDataLength = 0;
        $scope.get_receive=[];
        // 上传数据数组
        var uploadDataArray = [];

        // 上传错误数组
        var upload_error_array = [];
        $scope.local_isSuccesss = false;
        $scope.upload_isSuccesss = false;
        $scope.show_error = false;
        $scope.error_msg = false;
        $scope.csvFile = null;
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $scope.putStartCity='';
        $scope.putArriveCity='';
        $scope.putArriveReceive='';
        $scope.update = function () {
            _basic.setCookie('url', "jiangsen");
        };
        $scope.update();
        $scope.tableHeader = [];

        $scope.fileType = "";
        // 表头原始数据
        $scope.tableHeadeArray = [];
        // 主体原始错误数据
        $scope.tableContentErrorFilter = [];
        // 主体原始成功数据
        $scope.tableContentFilter = [];
        // 过滤条件数据
        // $scope.filterArray=[1,2,3,4,5,6,7,8,9];
        var colObjs = [
            {name: 'VIN', type: 'string', length: 17, require: true},
            {name: '制造商ID', type: 'number', length: 3, require: true},
            {name: '委托方ID', type: 'number', length: 3},
            {name: '起始城市ID', type: 'number', length: 3, require: true},
            {name: '发运地址ID', type: 'number', length: 3, require: true},
            {name: '目的地ID', type: 'number', length: 3},
            {name: '经销商ID', type: 'number', length: 3},
            {name: '指令时间', type: 'string'},
            {name: '船名', type: 'string'}];
        // 头部条件判断
        $scope.titleFilter = function (headerArray) {
            if (colObjs.length != headerArray.length) {
                return false;
            } else {
                for (var i in headerArray) {
                    if (colObjs[i].name != headerArray[i]) {
                        return false
                    }
                }
            }
        };
        // 主体条件判断
        $scope.ContentFilter = function (contentArray) {

            for (var i = 0; i < contentArray.length; i++) {
                var flag = true;
                var isNumber;
                for (var j = 0; j < colObjs.length; j++) {
                    //check required
                    if (colObjs[j].require) {
                        if (contentArray[i][j] == null && contentArray[i][j].length == 0) {
                            $scope.errorNumber = $scope.errorNumber + 1;
                            $scope.tableContentErrorFilter.push(contentArray[i]);
                            flag = false;
                            break;
                        }
                    }
                    //check type
                    // console.log(isNaN(contentArray[i][j]));

                    if (contentArray[i][j] == '' || isNaN(contentArray[i][j])) {
                        isNumber = "string"
                    } else {
                        isNumber = "number"
                    }
                    if (colObjs[j].type != isNumber && contentArray[i][j] != '' &&colObjs[j].require ) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag = false;
                        break;
                    }
                    //check length
                    if (colObjs[j].type=='string'&&(colObjs[j].length && colObjs[j].length != contentArray[i][j].length)) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        $scope.tableContentErrorFilter.push(contentArray[i]);
                        flag = false;
                        break;
                    }

                }
                if (flag == true) {
                    $scope.rightNumber = $scope.rightNumber + 1;
                    $scope.tableContentFilter.push(contentArray[i]);
                }


            }

        };

        $scope.fileUpload = function () {
            _basic.formPost($("#file_upload_form"), $host.file_url + '/user/' + userId + '/file?fileType=1&&userType=' + userType, function (data) {
                if (data.success == true) {
                    $scope.file_id = data.result.id;
                    uploadDataArray = $scope.tableContentFilter;
                    if (uploadDataArray.length > 0) {
                        socketUpload($scope.file_id);
                        orginDataLength = $scope.tableContentFilter.length;
                    }
                }
            });
        };

        //发送数组中最后一条车辆信息
        function socketUpload(fileId) {
            if (uploadDataArray && uploadDataArray.length > 0) {
                $scope.num = $scope.num + 1;
                var carItem = uploadDataArray[uploadDataArray.length - 1];
                _socket.uploadCarInfo($scope.file_id, carItem, uploadDataArray.length - 1, function (msg) {
                    acknowledgeUpload(msg);
                })
            }
            else {
                swal("上传完成", "", "success");
                $scope.$apply(function () {
                    $scope.show_error = true;
                });

            }
        }

        //处理socket上传结果，递归
        function acknowledgeUpload(msg) {
            var msgContent = msg.mcontent;
            if (msgContent.success) {

            }
            else {
                //错误记录处理
                // console.log(msg);
                var list_index = msg.mid.split("_");
                // console.log(list_index[1]);
                upload_error_array.push({
                    index: parseInt(list_index[1]) + 1,
                    msg: msg.mcontent.msg
                });

                $scope.upload_error_array = upload_error_array.slice().reverse();
            }
            if (upload_error_array.length > 0) {
                $scope.upload_error_array_num = upload_error_array.length;
                $scope.local_isSuccesss = false;
                $scope.upload_isSuccesss = true;
            }
            uploadDataArray.splice(uploadDataArray.length - 1, 1);

            $scope.upload_percent = $scope.upload_percent + 100 / orginDataLength;
            $scope.$apply(function () {
                $scope.obj = {
                    "width": $scope.upload_percent + "%"
                };
            });

            return socketUpload($scope.file_id);
        }

        // 展示上传的错误数据
        $scope.show_error_msg = function () {
            $scope.error_msg = !$scope.error_msg;
        };
        $scope.fileChange = function (file) {
            // 表头原始数据
            $scope.tableHeadeArray = [];
            // 主体原始错误数据
            $scope.tableContentErrorFilter = [];
            // 主体原始成功数据
            $scope.tableContentFilter = [];
            $scope.rightNumber = 0;
            $scope.errorNumber = 0;
            $(file).parse({
                config: {
                    complete: function (result) {
                        $scope.$apply(function () {
                            if(result==null ||result.data==null ||result.data.length ==0){
                                swal("文件类型错误");
                            } else {
                                $scope.tableHeadeArray = result.data[0];
                                $scope.templateBox = false;
                                // 表头校验
                                if ($scope.titleFilter($scope.tableHeadeArray) != false) {
                                    // 主体内容校验
                                    var content_filter_array = result.data.slice(1, result.data.length);
                                    var con_line = [];
                                    // console.log(content_filter_array);
                                    // excel换行过滤
                                    for (var i = 0; i < content_filter_array.length; i++) {
                                        if (content_filter_array[i].length == 1 && content_filter_array[i][0] == "") {
                                            break;
                                        } else {
                                            con_line.push(content_filter_array[i]);
                                        }
                                    }
                                    $scope.ContentFilter(con_line);
                                    if ($scope.tableContentErrorFilter.length == 0) {
                                        $scope.success_data_box = true;
                                        $scope.dataBox = false;
                                        swal("正确条数" + $scope.tableContentFilter.length);
                                        // 总条数
                                        $scope.orginData_Length = $scope.tableContentFilter.length;
                                        $scope.local_isSuccesss = true;
                                    } else {
                                        $scope.success_data_box = false;
                                        $scope.dataBox = true;
                                        swal("错误条数" + $scope.tableContentErrorFilter.length);
                                    }
                                    $scope.tableHeader = result.data[0];
                                }
                                else {
                                    swal("表头格式错误", "", "error");
                                    $scope.templateBox = true;
                                }

                            }

                        });

                    }
                },
                before: function (file, inputElem) {
                    $scope.fileType = file.type;
                },
                error: function (err, file, inputElem, reason) {
                    console.log(err)
                },
                complete: function (val) {
                    // console.log(val)
                }
            })
        };



        // 图片上传
        $scope.car_imageBox = [];
        $scope.car_image_i = [];
        $scope.uploadBrandImage = function (dom) {
            var filename = $(dom).val();
            // console.log($(dom).val());
            if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(filename)) {
                //check size
                //$file_input[0].files[0].size
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
            // $currentDom = $(dom).prev();
            _basic.formPost($(dom).parent().parent(), $host.file_url + '/user/' + userId + '/image?imageType=4', function (data) {

                if (data.success) {
                    // console.log(data, $scope.Picture_carId);
                    var imageId = data.imageId;

                    _basic.post($host.record_url + "/car/" + $scope.Picture_carId + "/vin/" + $scope.vin + "/storageImage", {
                        "username": _basic.getSession(_basic.USER_NAME),
                        "userId": userId,
                        "userType": _basic.getSession(_basic.USER_TYPE),
                        "url": imageId
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope._id = data.result._id;
                            var nowDate = moment(new Date()).format("YYYY-MM-DD hh:mm");
                            $scope.car_image_i.push($host.file_url + '/image/' + imageId);
                            // $scope.storage_imageBox.push({src: $host.file_url + '/image/' + imageId});
                            $scope.car_imageBox.push({
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
        $scope.delete_img = function (record_id, src) {
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
                    var url_array = src.split("/");
                    var url = url_array[url_array.length - 1];
                    _basic.delete($host.record_url + "/user/" + userId + "/record/" + record_id + "/image/" + url).then(function (data) {
                        if (data.success == true) {
                            var i = $scope.car_image_i.indexOf(src);
                            $scope.car_imageBox.splice(i, 1);
                            $scope.car_image_i.splice(i, 1);
                            swal("删除成功!", "", "success");
                            // $scope.lookStorageCar(data.result.id,data.result.vin)
                        }
                    })
                }
            )

        };





    // 单条数据录入
    $scope.new_data_list = function () {
        $scope.submitted = false;
        $('.tabWrap .tab').removeClass("active");
        $(".tab_box ").removeClass("active");
        $(".tab_box ").hide();
        $('.tabWrap .test1').addClass("active");
        $("#test1").addClass("active");
        $("#test1").show();
        $(".modal").modal({
            height: 500
        });
        $("#new_car").modal("open");
        $scope.get_Msg();
        getCityEvery();
        $scope.vin = "";
        $scope.car_brand = "";
        $scope.arrival_time = "";
        $scope.start_city = "";
        $scope.base_addr ='';
        $scope.arrive_city = "";
        $scope.client = "";
        $scope.dealer = "";
        $scope.remark = "";
        $scope.get_receive=[];
    };


        // 信息获取
        $scope.get_Msg = function () {
            // 委托方
            _basic.get($host.api_url + "/entrust").then(function (data) {
                if (data.success == true) {
                    $scope.get_entrust = data.result;
                }
            })

            // 车辆品牌增加
            _basic.get($host.api_url + "/carMake").then(function (data) {
                if (data.success == true) {
                    $scope.get_carMake = data.result;
                }
            });

            // 车辆品牌修改查询
            _basic.get($host.api_url + "/carMake").then(function (data) {
                if (data.success == true) {
                    $scope.makecarName = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        };



        function getCityEvery(){
            // 城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.get_city = data.result;
                    $('#start_city').select2({
                        placeholder: '发运地城市',
                        containerCssClass : 'select2_dropdown'
                    });
                    $('#arrive_city').select2({
                        placeholder: '目的地城市',
                        containerCssClass : 'select2_dropdown'
                    });
                    $('#chooseStartCity').select2({
                        containerCssClass: 'select2_dropdown'
                    });
                    $('#chooseEndCity').select2({
                        containerCssClass: 'select2_dropdown'
                    });
                }
            });

        }
        $scope.get_Msg();
        getCityEvery();


        // 目的地城市-经销商联动
        $scope.get_received = function (id,text) {
            _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.get_receive = data.result;
                    $('#dealer').select2({
                        placeholder: '经销商',
                        containerCssClass : 'select2_dropdown'
                    });
                } else {
                    swal(data.msg, "", "error")
                }
            })
            if(text==null||text==undefined){
                _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                    if (data.success == true) {
                        $scope.put_receive = data.result;
                        $('#dealer1').select2({
                            placeholder: '经销商',
                            containerCssClass: 'select2_dropdown'
                        });

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }
            else{
                _basic.get($host.api_url + "/receive?cityId=" + id).then(function (data) {
                    if (data.success == true) {
                        $scope.put_receive = data.result;
                        $('#dealer1').select2({
                            placeholder: text,
                            containerCssClass: 'select2_dropdown'
                        });

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            }







        };


        // 发运地城市--地址联动
        $scope.start_city_change = function (val) {
            _basic.get($host.api_url + "/baseAddr?cityId=" + val).then(function (data) {
                if (data.success == true) {
                    $scope.baseAddr = data.result;
                }
            })
        };


        // 发运地城市地质联动
        $scope.get_addr = function (id,text) {
            _basic.get($host.api_url + "/baseAddr?cityId=" + id).then(function (data) {
                if (data.success == true) {
                    $scope.start_address = data.result;
                    $('#start_addr').select2({
                        placeholder: text,
                        containerCssClass: 'select2_dropdown'
                    });
                }
                else {
                    swal(data.msg, "", "error")
                }
            })
        };


        // 新增车辆信息
        $scope.addCarItem = function () {
            if ($scope.vin!==''&&$scope.car_brand.id!==undefined&&$scope.car_brand.make_name!==undefined&&$scope.start_city.id!==undefined&&$scope.base_addr!==undefined&&$scope.client!=='') {
               if($scope.shipName==undefined){
                   $scope.shipName=null;
               }
                var obj = {
                    "vin": $scope.vin,
                    "makeId": $scope.car_brand.id,
                    "makeName": $scope.car_brand.make_name,
                    "routeStartId": $scope.start_city.id,
                    "baseAddrId": $scope.base_addr.id,
                    "routeStart": $scope.start_city.city_name,
                    "routeEndId": $scope.arrive_city.id,
                    "routeEnd": $scope.arrive_city.city_name,
                    "receiveId": $scope.dealer,
                    "entrustId": $scope.client,
                    "orderDate": $scope.arrival_time,
                    "shipName": $scope.shipName,
                    "remark": $scope.remark
                };
                _basic.post($host.api_url + "/user/" + userId + "/car", _basic.removeNullProps(obj)).then(function (data) {
                    if (data.success == true) {
                        $('.tabWrap .tab').removeClass("active");
                        $(".tab_box ").removeClass("active");
                        $(".tab_box ").hide();
                        $('.tabWrap .test2').addClass("active");
                        $("#test2").addClass("active");
                        $("#test2").show();
                        $scope.Picture_carId = data.id;
                    }
                    else{
                        swal(data.msg, "", "error")
                    }
                })
            }
            else{
                swal("请填写完整信息！", "", "warning");
            }
        };


        //单条数据修改
        $scope.openDataModel = function () {
            $('.modal').modal();
            $('#commodityCar').modal('open');
            $scope.commodityVin = '';
            $scope.start_addr ='';
            $scope.flag = false;
        }



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
            if($scope.commodityVin!==""&&$scope.commodityVin!==undefined) {
                if ($scope.commodityVin.length >= 6) {
                    _basic.get($host.api_url + "/carList?userId="+userId+"&vinCode=" + $scope.commodityVin, {}).then(function (data) {
                        if (data.success == true&& data.result.length > 0) {
                            $scope.vinMsg = data.result;
                            $scope.carId= data.result[0].id;
                            vinObjs = {};
                            for (var i in $scope.vinMsg) {
                                vinObjs[$scope.vinMsg[i].vin] = null;
                            }
                            return vinObjs;
                        }

                        else {
                            return {};
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

        // 查询VIN
        $scope.getCommodityCarData=function () {
            getCityEvery();
            _basic.get($host.api_url + "/carList?carId="+$scope.carId).then(function (data) {
                if (data.success == true) {
                    if(data.result.length==0){
                        $scope.commodityCarList = null;
                    }else {
                        $scope.commodityCarList =data.result[0];
                        $scope.select_city_start = {id: $scope.commodityCarList.route_start_id, city_name: $scope.commodityCarList.route_start};
                        $scope.select_city_end = {id: $scope.commodityCarList.route_end_id, city_name: $scope.commodityCarList.route_end};
                        $scope.select_receive = {id: $scope.commodityCarList.receive_id, receive_name: $scope.commodityCarList.re_short_name};
                        $scope.start_city = $scope.select_city_start.id;
                        $scope.arrive_city = $scope.select_city_end.id === null ? "0" : $scope.select_city_end.id;
                        $scope.arrive_receive = $scope.select_receive.id;
                        if($scope.commodityCarList.order_date==null){
                            $scope.commodityCarList.order_date ='';
                        }
                        $scope.commodityCarList.order_date = moment($scope.commodityCarList.order_date).format('YYYY-MM-DD');
                        /*$scope.start_addr = $scope.commodityCarList.base_addr_id;*/
                        $scope.get_addr($scope.commodityCarList.route_start_id,$scope.commodityCarList.addr_name)
                        $scope.get_received($scope.arrive_city,$scope.select_receive.receive_name);
                        $scope.flag=true;
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        };



        // 修改
        $scope.putDataItem = function (id) {
            $scope.putDataItemId = id;
            if($scope.arrive_city==0||$scope.arrive_city==''||$scope.start_city==0||$scope.start_city==''){
                swal('请填写完整信息！',"","error")
            }
            else{
                _basic.get($host.api_url +'/city?cityId='+$scope.start_city).then(function (data) {
                    if (data.success == true) {
                        $scope.putStartCity=data.result[0].city_name;
                    }
                    else {
                        swal(data.msg, "", "error")
                    }
                });
                _basic.get($host.api_url +'/city?cityId='+$scope.arrive_city).then(function (data) {
                    if (data.success == true) {
                        $scope.putArriveCity=data.result[0].city_name;

                    }
                    else {
                        swal(data.msg, "", "error")
                    }
                });
                _basic.get($host.api_url + "/receive?cityId=" + $scope.arrive_receive).then(function (data) {
                    if (data.success == true) {
                        $scope.putArriveReceive = data.result[0].receive_name;
                        putSingleData();

                    } else {
                        swal(data.msg, "", "error")
                    }
                })
            };
        };

       function putSingleData(){
        var obj = {
            "vin": $scope.commodityCarList.vin,
            "makeId": $scope.commodityCarList.make_id,
            "makeName": $("#look_makecarName").find("option:selected").text(),
            "orderDate": $scope.commodityCarList.order_date,
            "remark": $scope.commodityCarList.remark,
            "routeStartId": $scope.start_city,
            "routeStart":$scope.putStartCity,
            "baseAddrId": $scope.start_addr,
            "routeEndId": $scope.arrive_city,
            "routeEnd":$scope.putArriveCity,
            "receiveId": $scope.arrive_receive,
            "shipName":$scope.commodityCarList.ship_name,
            "entrustId": $scope.commodityCarList.entrust_id
        };
        // 修改仓库信息
        _basic.put($host.api_url + "/user/" + userId + "/car/" +  $scope.putDataItemId, _basic.removeNullProps(obj)).then(function (data) {
            if (data.success == true) {
                $('#commodityCar').modal('close');
                swal("修改成功", "", "success");

            }
            else {
                swal(data.msg, "", "error")
            }
        });
    }



}]);