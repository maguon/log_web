app.controller("entrust_setting_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.start1 = 0;
    $scope.size1 = 11;
    $scope.addFlag=false;
    $scope.userDepartment = parseInt(_basic.getSession(_basic.USER_TYPE));
    if($scope.userDepartment==79||$scope.userDepartment==71||userId=='1'){
        $scope.addFlag=true
    }
    else {
        $scope.addFlag=false;
    }

    // 跳转
    $scope.settingEntrust = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.settingEntrust ').addClass("active");
        $("#settingEntrust").addClass("active");
        $("#settingEntrust").show();
    };
    $scope.lookMyselfFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMyselfFile ').addClass("active");
        $("#lookMyselfFile").addClass("active");
        $("#lookMyselfFile").show();
    };
    $scope.routeImport = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.routeImport ').addClass("active");
        $("#routeImport").addClass("active");
        $("#routeImport").show();
    };


    $scope.lookMyselfFile  ();

    $("#pre").hide();
    $("#next").hide();
    $("#pre1").hide();
    $("#next1").hide();

    // 委托方
    function getEntrust(){
        _basic.get($host.api_url + "/entrust").then(function (data) {
            if (data.success == true) {
                $scope.get_entrust = data.result;
                $('#client').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
                $('#getClient').select2({
                    placeholder: '委托方',
                    containerCssClass: 'select2_dropdown',
                    allowClear: true
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        })
    };
    //查询城市
    function getCity() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success == true) {
                $scope.cityList = data.result;
                $('#startCity1').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#endCity1').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
            }
        });

    }

    function getCarMake(){
        // 车辆品牌
        _basic.get($host.api_url + "/carMake").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });

    }

    $scope.changeClient =function (clientId){
        // 车辆品牌
        _basic.get($host.api_url + "/entrustCityRouteRel?entrustId="+clientId).then(function (data) {
            if (data.success == true) {
                $scope.getCarMakeList = data.result;
            }
        });
    }

  /*  // 获取城市列表
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.cityList = data.result;
                $('#startCity').select2({
                    placeholder: '起始城市',
                    containerCssClass : 'select2_dropdown'
                });
                $('#endCity').select2({
                    placeholder: '目的城市',
                    containerCssClass : 'select2_dropdown'
                });
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };*/

    //点击查询按钮
    $scope.getEntrustSetting = function (){
        $scope.start = 0;
        getEntrustSetting();
    }

    //获取列表详情
    function getEntrustSetting() {
        var obj = {
                entrustId:$scope.client,
                start:$scope.start.toString(),
                size:$scope.size
        };
        _basic.get($host.api_url + "/entrustRoute?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray = data.result;
                $scope.entrustSettingArray = $scope.boxArray.slice(0, 10);
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
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    $scope.searchList = function (){
        $scope.start1 = 0;
        searchEntrust();
    };


    function searchEntrust() {
        var obj = {
            entrustId:$scope.getClient,
            makeId:$scope.getCarBrand,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1,
            start:$scope.start1.toString(),
            size:$scope.size1
        };
        _basic.get($host.api_url + "/entrustCityRouteRel?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray1 = data.result;
                $scope.importedFilesList = $scope.boxArray1.slice(0, 10);
                if ($scope.start1 > 0) {
                    $("#pre1").show();
                }
                else {
                    $("#pre1").hide();
                }
                if (data.result.length < $scope.size1) {
                    $("#next1").hide();
                }
                else {
                    $("#next1").show();
                }
            } else {
                swal(data.msg, "", "error");
            }
        });
    };


    /*导出*/
    $scope.export = function(){
        // 基本检索URL
        var url = $host.api_url + "/entrustCityRouteRel.csv?" ;
        // 检索条件
        var conditionsObj = {
            entrustId:$scope.getClient,
            makeId:$scope.getCarBrand,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1
        };
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
    }




    // 关联品牌模态框
    $scope.entrustMakeRel = function (id) {
        $scope.entrustId=id;
        _basic.get($host.api_url + "/entrustMakeRel?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.entrustMakeRelList = data.result;

            }
            else {
                swal(data.msg, "", "error");
            }
        });
        _basic.get($host.api_url + "/entrust?entrustId=" + id).then(function (data) {
            if (data.success == true && data.result.length >= 0) {
                $scope.shortName = data.result[0].short_name;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
        $('#entrustMakeInfoModel').modal('open');

    };

    //添加品牌
    $scope.addChip= function (){
        _basic.post($host.api_url + "/user/" + userId + "/entrustMakeRel", {
            entrustId: $scope.entrustId,
            makeId:$scope.car_brand.id
        }).then(function (data) {
            if (data.success === true) {
                $scope.entrustMakeRel($scope.entrustId);
                swal("新增成功", "", "success");
            }
        });
    }

    //删除品牌
    $scope.deleteChip =function (makeId,entrust){
        swal({
                title: "确定删除此品牌吗？",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "取消",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定"
        }).then(function (result) {
            if (result.value) {
                _basic.delete($host.api_url + "/user/" + userId + "/entrust/" +entrust+"/make/"+makeId , {}).then(
                    function (data) {
                        if (data.success === true) {
                            swal("删除成功", "", "success");
                            $scope.entrustMakeRel(entrust)
                        }
                        else {
                            swal(data.msg, "", "error");
                        }
                    });
            }
        })
    }


    $scope.readData = function (entrust_id,route_start_id,route_end_id,make_id,size_type){
        $scope.put_entrust_id = entrust_id;
        $scope.routeStartId =route_start_id;
        $scope.routeEndId =route_end_id;
        $scope.make_id = make_id;
        $scope.size = size_type;
        _basic.get($host.api_url + "/entrustCityRouteRel?entrustId="+entrust_id+'&makeId='+make_id+'&routeStartId='+route_start_id+'&routeEndId='+route_end_id ).then(function (data) {
            if (data.success == true) {
                $scope.putList = data.result[0];
                if($scope.putList.size_type==0) {
                    $scope.putList.size_type = '小'
                }
                else {
                    $scope.putList.size_type = '大'
                }
            }
        });

        $(".modal").modal();
        $("#putItem").modal("open");
    }

    $scope.putItem = function (){
        if($scope.putList.distance!==''&&$scope.putList.fee!==''){
            var obj={
                "distance":$scope.putList.distance,
                "fee": $scope.putList.fee,
                "twoDistance": $scope.putList.two_distance,
                "twoFee":  $scope. putList.two_fee
            }
            _basic.put($host.api_url + "/user/" + userId + "/entrust/"+  $scope.put_entrust_id+'/make/'+ $scope.make_id +"/routeStart/"+  $scope.routeStartId +'/routeEnd/'+   $scope.routeEndId+"/size/"+ $scope.size, obj).then(function (data) {
                if (data.success == true) {
                    searchEntrust();
                    $("#putItem").modal("close");
                    swal("修改成功", "", "success");

                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息", "", "error");
        }
    }




    $scope.num = 0;
    $scope.flag=false;
    $scope.templateBox = true;
    $scope.success_data_box = false;
    $scope.dataBox = false;
    $scope.local_isSuccesss = false;
    $scope.upload_isSuccesss = false;
    $scope.show_error = false;
    $scope.error_msg = false;
    $scope.rightNumber = 0;
    $scope.errorNumber = 0;
    $scope.tableHeader = [];
    $scope.fileType = "";
    // 表头原始数据
    $scope.tableHeadeArray = [];
    // 主体原始错误数据
    $scope.tableContentErrorFilter = [];
    // 主体原始成功数据
    $scope.tableContentFilter = [];
    // 过滤条件数据
    var colObjs = [
        {name: '委托方ID', type: 'number', length: 3,require: true},
        {name: '制造商ID', type: 'number', length: 3, require: true},
        {name: '起始城市ID', type: 'number', length: 3, require: true},
        {name: '目的地ID', type: 'number', length: 3, require: true},
        {name: '车型', type: 'number', length: 1, require: true},
        {name: '公里数', type: 'number',require: true},
        {name: '单价', type: 'number',require: true},
        {name: '二级公里数', type: 'number',require: true},
        {name: '二级单价', type: 'number',require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/entrustCityRouteRelFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                    $("#buttonImport").attr("disabled",false);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
                $("#buttonImport").attr("disabled",false);
                swal(data.msg, "", "error");
            }
        });
    };


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


    // 分页
    $scope.previousPage = function () {
        $scope.start = $scope.start - ($scope.size-1);
        getEntrustSetting();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        getEntrustSetting();
    };

    // 分页
    $scope.previousPage1 = function () {
        $scope.start1 = $scope.start1 - ($scope.size1-1);
        searchEntrust();
    };
    $scope.nextPage1 = function () {
        $scope.start1 = $scope.start1 + ($scope.size1-1);
        searchEntrust();
    };
    getEntrust();
    searchEntrust();
    getEntrustSetting();
    getCarMake();
    getCity();
  /*  getCityList();*/

}]);