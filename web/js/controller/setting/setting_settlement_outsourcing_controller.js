app.controller("setting_settlement_outsourcing_controller", ["$scope", "$state", "$stateParams", "_basic", "_config", "$host", function ($scope, $state, $stateParams, _basic, _config, $host) {

    var userId = _basic.getSession(_basic.USER_ID);
    $scope.hasChosen = false;
    $scope.addFlag=false;
    $scope.selectedCityId = 0;
    $scope.startCityList = [];
    $scope.endCityList = [];
    $scope.start = 0;
    $scope.size = 11;
    $scope.start1 = 0;
    $scope.size1 = 11;
    $scope.userDepartment = parseInt(_basic.getSession(_basic.USER_TYPE));
    if($scope.userDepartment==79||$scope.userDepartment==71||userId=='1'){
        $scope.addFlag=true
    }
    else {
        $scope.addFlag=false;
    }

    /*
    * 页面跳转
    * */
    $scope.settingCompany = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.settingCompany').addClass("active");
        $("#settingCompany").addClass("active");
        $("#settingCompany").show();
    };
    $scope.lookMyselfFile = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.lookMyselfFile ').addClass("active");
        $("#lookMyselfFile").addClass("active");
        $("#lookMyselfFile").show();
        getCity();
    };
    $scope.outsourcingImport = function(){
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.outsourcingImport ').addClass("active");
        $("#outsourcingImport").addClass("active");
        $("#outsourcingImport").show();
    }
    $scope.lookMyselfFile();

    $("#pre1").hide();
    $("#next1").hide();



    function getEntrust(){
        //品牌获取
        _basic.get($host.api_url + "/carMake?").then(function (data) {
            if (data.success == true) {
                $scope.get_carMake = data.result;
            }
        });
    };

    function getCompany(){
        _basic.get($host.api_url + "/company?operateType=2").then(function (companyData) {
            if (companyData.success === true) {
                $scope.companyList = companyData.result;
                $('#companyId').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#getClient').select2({
                    placeholder: '外协公司',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });


            }
            else {
                swal(companyData.msg, "", "error");
            }
        });
    }


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


    // 获取所有起始城市和结束城市
    function getCityList() {
        _basic.get($host.api_url + "/city").then(function (data) {
            if (data.success === true) {
                $scope.startCityList = data.result;
                for (var i = 0; i < data.result.length; i++) {
                    $scope.startCityList[i].flag=true;
                    var endItem = {
                        id: data.result[i].id,
                        city_name: data.result[i].city_name,
                        dis: "",
                        fee:'',
                        routeId:0,
                        flag: 1
                    };
                    $scope.endCityList.push(endItem);
                }
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };



    $scope.getOutsourcingSetting = function (){
        $scope.start = 0;
        searchOutsourcingSetting();
    }

    function searchOutsourcingSetting(){
        var obj = {
            companyId:$scope.companyId,
            operateType:2,
            start:$scope.start.toString(),
            size:$scope.size
        };

        _basic.get($host.api_url + "/companyRoute?"+ _basic.objToUrl(obj)).then(function (data) {

            if (data.success === true) {
                $scope.boxArray2 = data.result;
                $scope.entrustSettingArray = $scope.boxArray2.slice(0, 10);
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



        /*
            if (data.success === true) {
                $scope.entrustSettingArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }*/
        });
    }



    // 修改或设置里程数
    $scope.distanceModify = function () {
        if($scope.makeId !== null&&$scope.distance !== null&&$scope.fee !== null){
            _basic.post($host.api_url + "/user/" + userId + '/settleOuterTruck',{
                makeId:$scope.car_brand.id,
                makeName:$scope.car_brand.make_name,
                routeStartId: $scope.selectedCityId,
                routeStart: $scope.startCity,
                routeEndId:$scope.endCityId,
                routeEnd: $scope.endCity,
                distance:$scope.distance,
                fee: $scope.price
            }).then(function (data) {
                if (data.success === true) {
                    swal("操作成功", "", "success");
                    $scope.searchCityLine($scope.startCityList[$scope.startCityIndex],$scope.startCityIndex)
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请输入完整信息！", "", "error");
        }
    }

    $scope.searchList = function (){
        $scope.start1 = 0;
        searchEntrust();
    };


    function searchEntrust() {
        var obj = {
            companyId:$scope.getClient,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1,
            makeId:$scope.getCarBrand,
            start:$scope.start1.toString(),
            size:$scope.size1
        };
        _basic.get($host.api_url + "/settleOuterTruck?"+ _basic.objToUrl(obj)).then(function (data) {
            if (data.success === true) {
                $scope.boxArray1 = data.result;
                $scope.importedFilesList = $scope.boxArray1.slice(0,10);
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



    $scope.readData = function (route_start_id,route_end_id,make_id,company_id){

        $scope.routeStartId =route_start_id;
        $scope.routeEndId =route_end_id;
        $scope.make_id = make_id;
        $scope.company_id=company_id;
        _basic.get($host.api_url + "/settleOuterTruck?makeId="+make_id+'&routeStartId='+route_start_id+'&routeEndId='+route_end_id+'&companyId='+ company_id).then(function (data) {
            if (data.success == true) {
                $scope.putList = data.result[0];
            }
        });

        $(".modal").modal();
        $("#putItem").modal("open");
    }

    $scope.putItem = function (){
        if($scope.putList.distance!==''&&$scope.putList.fee!==''){
            var obj={
                "distance":$scope.putList.distance,
                "fee": $scope.putList.fee
            }
            _basic.put($host.api_url + "/user/" + userId+'/company/'+ $scope.company_id+'/make/'+ $scope.make_id +"/routeStart/"+  $scope.routeStartId +'/routeEnd/'+$scope.routeEndId, obj).then(function (data) {
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

    /*导出*/
    $scope.export = function(){
        // 基本检索URL
        var url = $host.api_url + "/settleOuterTruckBase.csv?" ;
        // 检索条件
        var conditionsObj = {
            companyId:$scope.getClient,
            routeStartId:$scope.startCity1,
            routeEndId:$scope.endCity1,
            makeId:$scope.getCarBrand
        };
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
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
        {name: '外协公司ID', type: 'number', length: 3,require: true},
        {name: '制造商ID', type: 'number', length: 3, require: true},
        {name: '起始城市ID', type: 'number', length: 3, require: true},
        {name: '目的地ID', type: 'number', length: 3, require: true},
       /* {name: '车型', type: 'number', length: 1, require: true},*/
        {name: '公里数', type: 'number',require: true},
        {name: '单价', type: 'number',require: true}
       /* {name: '二级公里数', type: 'number',require: true},
        {name: '二级单价', type: 'number',require: true}*/];
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
        $("#buttonImport").removeAttr("disabled");
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/settleOuterTruckFile' , function (data) {
            if (data.success == true) {
                $scope.$apply(function () {
                    $scope.upload_error_array_num =data.result.failedCase;
                    $scope.orginData_Length=data.result.failedCase+data.result.successedInsert;
                    $scope.num=data.result.successedInsert;
                    $scope.local_isSuccesss = false;
                    $scope.upload_isSuccesss = true;
                  $("#buttonImport").attr("disabled",true);
                    swal('正确:'+$scope.num+'错误:'+$scope.upload_error_array_num,"", "success")
                });

            }
            else {
              $("#buttonImport").attr("disabled",true);
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
        searchOutsourcingSetting();
    };
    $scope.nextPage = function () {
        $scope.start = $scope.start + ($scope.size-1);
        searchOutsourcingSetting();
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

    getCompany();
    getCityList();
    getEntrust();
    searchEntrust();
    searchOutsourcingSetting();
}])

