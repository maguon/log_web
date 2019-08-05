app.controller("settlement_car_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic",'_socket', function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic,_socket) {
        var userId = _basic.getSession(_basic.USER_ID);
        var userType = _basic.getSession(_basic.USER_TYPE);
        $scope.size = 11;
        $scope.start = 0;
        $scope.upload_percent = 0;
        $scope.num = 0;
        $scope.num1 = 0;
        $scope.flag=false;
        $scope.tableBox = true;
        $scope.success_data_box = false;
        $scope.success_data_box1 = false;
        $scope.dataBox = false;
        $scope.dataBox1 = false;
        $scope.Picture_carId = "";
        $scope.fileDetailObj = {
            fileName: "",
            fileLength: 0,
            fileRecord: []
        };
        $scope.local_isSuccesss = false;
        $scope.upload_isSuccesss = false;
        $scope.show_error = false;
        $scope.error_msg = false;
        $scope.local_isSuccesss1 = false;
      /*  $scope.upload_isSuccesss1 = false;*/
        $scope.show_error1 = false;
        $scope.error_msg1 = false;

        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
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
        $scope.ImportedFilesList = [];
        // 跳转
        $scope.importFile = function () {
            $('ul.tabWrap li').removeClass("active");
            $(".tab_box").removeClass("active");
            $(".tab_box").hide();
            $('ul.tabWrap li.importFile ').addClass("active");
            $("#importFile").addClass("active");
            $("#importFile").show();
        };
        $scope.lookMyselfFile = function () {
            $('ul.tabWrap li').removeClass("active");
            $(".tab_box").removeClass("active");
            $(".tab_box").hide();
            $('ul.tabWrap li.lookMyselfFile ').addClass("active");
            $("#lookMyselfFile").addClass("active");
            $("#lookMyselfFile").show();
        };
        $scope.importFile  ();

        $("#pre").hide();
        $("#next").hide();

        // 过滤条件数据
        var colObjs = [
            {name: 'vin', type: 'string', length: 17, require: true},
            {name: 'entrustId', type: 'number', length: 3, require: true},
            {name: 'routeStartId', type: 'number', length: 3},
            {name: 'routeEndId', type: 'number', length: 3, require: true},
            {name: 'price', type: 'number', require: true},
            {name: 'seq', type: 'number', require: true}
        ];
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
                    if (colObjs[j].require) {
                        if (contentArray[i][j] == null && contentArray[i][j].length == 0) {
                            $scope.errorNumber = $scope.errorNumber + 1;
                            $scope.tableContentErrorFilter.push(contentArray[i]);
                            flag = false;
                            break;
                        }
                    }
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
            $("#buttonImport").attr("disabled",true);
            _basic.formPost($("#file_upload_form"), $host.file_url + '/user/' + userId + '/file?fileType=2&&userType=' + userType, function (data) {
                if (data.success == true) {
                    $scope.file_id = data.result.id;
                    getLocalFile($scope.file_id);
                }
            });
        };

        function  getLocalFile(id){
            _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/settleCarFile?uploadId='+id , function (data) {
                if (data.success == true) {
                    $scope.$apply(function () {
                        $scope.upload_error_array_num =data.result.failedCase;
                        $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                        $scope.num=data.result.successedInsert;
                        $scope.local_isSuccesss = false;
                        $scope.upload_isSuccesss = true;
                        $("#file_upload_form").disabled=true;
                        $("#buttonImport").attr("disabled",false);
                        swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                    });

                }
                else {
                    $("#buttonImport").attr("disabled",false);
                    swal(data.msg, "", "error");
                }
            });
        }


        // 展示上传的错误数据
        $scope.show_error_msg = function () {
            $scope.error_msg = !$scope.error_msg;
        };
        $scope.show_error_msg1 = function () {
            $scope.error_msg1 = !$scope.error_msg1;
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
                                $scope.tableBox = false;
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
                                    $scope.tableBox = true;
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


        function getAddCity() {
            //起始城市 目的城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.cityCarList = data.result;
                    $('#startCity').select2({
                        placeholder: '起始城市',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                    $('#endCity').select2({
                        placeholder: '目的城市',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
            });
            //获取委托方
            _basic.get($host.api_url + "/entrust").then(function (entrustData) {
                if (entrustData.success === true) {
                    $scope.entrustCarList = entrustData.result;
                    $('#client').select2({
                        placeholder: '委托方',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                    $('#invoiceEntrust').select2({
                        placeholder: '委托方',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(entrustData.msg, "", "error");
                }
            });
        }
        getAddCity();
        function getCity(){
            //起始城市 目的城市
            _basic.get($host.api_url + "/city").then(function (data) {
                if (data.success == true) {
                    $scope.cityList = data.result;

                    $('#updateStartCity').select2({
                        placeholder: '起始城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                    $('#updateEndCity').select2({
                        placeholder: '目的城市',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });

                }
            });

            //获取委托方
            _basic.get($host.api_url + "/entrust").then(function (entrustData) {
                if (entrustData.success === true) {
                    $scope.entrustList = entrustData.result;
                    $('#updateClient').select2({
                        placeholder: '委托方',
                        containerCssClass : 'select2_dropdown',
                        allowClear: true
                    });
                }
                else {
                    swal(entrustData.msg, "", "error");
                }
            });
        }

    //查询按钮相关
        function getsettlemnetList () {
            if ($scope.startDate == null || $scope.endDate == null || $scope.startDate == "" || $scope.endDate == "") {
                swal('请输入完整的查询时间', "", "error");
            }
            else{
                _basic.get($host.file_url + '/user/' + userId + '/file?' + _basic.objToUrl({
                    fileType: "2",
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                    start:$scope.start,
                    size:$scope.size
                })).then(function (data) {
                    if (data.success === true) {
                        $scope.boxArray = data.result;
                        $scope.importedFilesList = $scope.boxArray.slice(0, 10);
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
        };

        // 点击搜索
        $scope.searchSettlementList = function () {
            $scope.start=0;
            getsettlemnetList();
        };

        // 分页
        $scope.previous_page = function () {
            $scope.start = $scope.start - ($scope.size-1);
            getsettlemnetList();
        };

        $scope.next_page = function () {
            $scope.start = $scope.start + ($scope.size-1);
            getsettlemnetList();
        };


        // 单条数据录入
        $scope.new_data_list = function () {
            $(".modal").modal({
                height: 500
            });
            $("#new_car").modal("open");
        };


        // 新增结算车辆信息
        $scope.addsettlementItem = function () {
            if ($scope.VIN!==undefined&&$scope.addRouteStartId!==undefined&&$scope.addRouteEndId!==undefined&&$scope.addRnstrustId!==undefined&&$scope.price!==undefined) {
                var obj = {
                    vin: $scope.VIN,
                    entrustId:$scope.addRnstrustId,
                    routeStartId: $scope.addRouteStartId,
                    routeEndId: $scope.addRouteEndId,
                    price: $scope.price
                };
                _basic.post($host.api_url + "/user/" + userId + "/settleCar", _basic.removeNullProps(obj)).then(function (data) {
                    if (data.success == true) {
                        swal("新增结算车辆成功", "", "success");
                        $("#new_car").modal("close");
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



        // 单条数据修改
        $scope.openDataModel = function () {
            $('.modal').modal();
            $('#commodityCar').modal('open');
            $scope.commodityVin = '';
            $scope.flag = false;
        }

        //模糊查询
        var vinObjs ={}
        $('#autocomplete-input').autocomplete({
            data: vinObjs,
            limit: 10,
            onAutocomplete: function(val) {
            },
            minLength: 6
        });
        $scope.shortSearch=function () {
            if($scope.commodityVin!==""&&$scope.commodityVin!==undefined) {
                if ($scope.commodityVin.length >= 6) {
                    _basic.get($host.api_url + "/settleCar?userId="+userId+"&vinCode="+$scope.commodityVin, {}).then(function (data) {
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
            _basic.get($host.api_url + "/settleCar?settleCarId="+$scope.carId).then(function (data) {
                if (data.success == true) {
                    if(data.result.length==0){
                        $scope.showSettlementList = null;
                    }else {
                        $scope.showSettlementList =data.result[0];
                        getCity();
                        $scope.flag=true;
                    }
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        };

        //修改
        $scope.updateSettlementItem = function (id) {
            if ($scope.showSettlementList.entrust_id !== ""&& $scope.showSettlementList.route_start_id !== ""
                && $scope.showSettlementList.route_end_id !== "" && $scope.showSettlementList.price!== "") {
                var obj = {
                    vin: $scope.showSettlementList.vin,
                    entrustId: $scope.showSettlementList.entrust_id,
                    routeStartId: $scope.showSettlementList.route_start_id,
                    routeEndId:$scope.showSettlementList.route_end_id,
                    price: $scope.showSettlementList.price
                };
                _basic.put($host.api_url + "/user/" + userId + "/settleCar/" + id, obj).then(function (data) {
                    if (data.success == true) {

                        swal("修改成功", "", "success");
                        $('#commodityCar').modal('close');
                    } else {
                        swal(data.msg, "", "error");
                    }
                })
            }

            else {
                swal("请填写完整信息！", "", "warning");
            }
         }


        //查看详情模态框
        $scope.changeDetail = function (file) {
            $scope.fileDetailObj.fileName = file.filename;
            $scope.fileDetailObj.fileLength = file.length;
            $scope.fileDetailObj.id = file._id;
            $("#file_detail_modal").modal("open");
            _basic.get($host.api_url + '/settleCar?uploadId=' + $scope.fileDetailObj.id).then(function (data) {
                if (data.success === true) {
                    $scope.fileDetailObj.fileRecord = data.result;
                }
                else {
                    swal(data.msg, "", "error");
                }
            })
        }


        //点击下载
        $scope.export = function(id){
            window.open($host.file_url + "/user/" +userId+'/file/'+id);
        }



        //开票车辆导入
        $scope.invoiceCarModel = function(){
            $(".modal").modal();
            $("#invoiceCarModel").modal("open");
            $scope.invoiceEntrust='';
            $scope.entrustCarList=[];
            $scope.flag_invoice=false;
            $scope.dataBox1=false;
            $scope.success_data_box1=false;
            getAddCity();

        };

        //显示导入按钮
        $scope.changeEntrust = function(){
            if($scope.invoiceEntrust==''||$scope.invoiceEntrust==undefined||$scope.invoiceEntrust==null){
                $scope.flag_invoice=false;
            }
            else {
                $scope.flag_invoice=true;
            }
        }


        $scope.invoiceFileChange =function (file){
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
                                        }
                                        else if ($scope.invoiceEntrust.toString() !== content_filter_array[i][1]) {
                                            $scope.dataBox1= false;
                                            $scope.success_data_box1= false;
                                            swal("委托方不一致!", "", "error");
                                            return;
                                        }
                                        else {
                                            con_line.push(content_filter_array[i]);
                                        }

                                    }
                                    $scope.ContentFilter(con_line);
                                    if ($scope.tableContentErrorFilter.length == 0) {
                                        $scope.success_data_box1 = true;
                                        $scope.dataBox1 = false;
                                        swal("正确条数" + $scope.tableContentFilter.length);
                                        // 总条数
                                        $scope.orginData_Length1 = $scope.tableContentFilter.length;
                                        $scope.local_isSuccesss1 = true;
                                    } else {
                                        $scope.success_data_box1 = false;
                                        $scope.dataBox1 = true;
                                        swal("错误条数" + $scope.tableContentErrorFilter.length);
                                    }
                                    $scope.tableHeader = result.data[0];
                                }
                                else {
                                    swal("表头格式错误", "", "error");
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
        }

    $scope.fileInvoiceUpload = function () {
        $("#buttonImport1").attr("disabled",true);
        _basic.formPost($("#file_upload_form1"), $host.file_url + '/user/' + userId + '/file?fileType=2&userType=' + userType, function (data) {
            if (data.success == true) {
                $scope.file_id = data.result.id;
                getLocalInvoiceFile($scope.file_id);
            }
        });
    };
    function  getLocalInvoiceFile(id){
        _basic.formPost($("#file_upload_form1"), $host.api_url + '/user/' + userId + '/entrustInvoiceCarRelFile?entrustId='+$scope.invoiceEntrust+'&uploadId='+id , function (data) {
            if (data.success == true) {
                $scope.entrustInvoiceId = data.result.entrustInvoiceId;
                $scope.$apply(function () {
                    $(".modal").modal();
                    $("#invoiceCarModel").modal("close");
                    $("#file_upload_form1").disabled=true;
                    $("#buttonImport1").attr("disabled",false);
                     $state.go('invoice_detail', {
                        reload: true,
                        id:$scope.entrustInvoiceId,
                        from:'settlement_car'
                    });

                  /*  $scope.upload_error_array_num1 =data.result.failedCase;
                    $scope.orginData_Length1=data.result.failedCase+data.result.successedInsert;
                    $scope.num1=data.result.successedInsert;
                    $scope.local_isSuccesss1 = false;
                    $scope.upload_isSuccesss1 = true;*/

                  /*  swal('正确:'+$scope.num1+'错误:'+$scope.upload_error_array_num1,"", "success")
                    $scope.importFile();*!/*/
                });

            }
            else {
                $("#buttonImport1").attr("disabled",false);
                swal(data.msg, "", "error");
            }
        });
    }



}])