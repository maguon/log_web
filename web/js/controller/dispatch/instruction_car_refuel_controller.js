/**
 * Created by zcy on 2017/8/30.
 */
app.controller("instruction_car_refuel_controller", ["$scope","$rootScope","$state","$stateParams",  "$host", "_basic", function ($scope,$rootScope,$state,$stateParams, $host, _basic) {
    $scope.start = 0;
    $scope.size = 11;
    $scope.addTruckNum='';
    $scope.car_refuel=[];
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.num = 0;
    $scope.flag=false;
    $scope.tableBox = true;
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
    $scope.instructionCarRefuel = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.instructionCarRefuel ').addClass("active");
        $("#instructionCarRefuel").addClass("active");
        $("#instructionCarRefuel").show();
    };
    // 过滤条件数据
    var colObjs = [
        {name: '车号', type: 'string',require: true},
        {name: '司机', type: 'string',require: true},
        {name: '时间', type: 'string', require: true},
        {name: '地点', type: 'string', require: true},
        {name: '加油升数', type: 'number', require: true},
        {name: '加油单价', type: 'number', require: true},
        {name: '加油金额', type: 'number', require: true},
        {name: '加尿素量', type: 'number', require: true},
        {name: '尿素单价', type: 'number', require: true},
        {name: '尿素金额', type: 'number', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/driveExceedOilRelFile' , function (data) {
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
                            $scope.tableBox = false;
                            // 表头校验
                            if ($scope.titleFilter($scope.tableHeadeArray) != false) {
                                // 主体内容校验
                                var content_filter_array = result.data.slice(1, result.data.length);
                                var con_line = [];
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
            }
        })
    };

    //获取货车牌号
    function getTruckId(text) {
        _basic.get($host.api_url + "/truckBase").then(function (data) {
            if (data.success === true) {
                $scope.truckNumListAll = data.result;
                if(text==''&&text==undefined){
                    $('#addTruckNum').select2({
                        placeholder: '货车牌号',
                        containerCssClass: 'select2_dropdown',
                        allowClear: true
                    });
                }
               else {
                    $('#addTruckNum').select2({
                        placeholder:text,
                        containerCssClass: 'select2_dropdown'
                    });
                }
                $('#truckNumber').select2({
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
    $scope.changeDriver = function (driver){
        _basic.get($host.api_url + "/drive?driveId="+driver).then(function (data) {
            if (data.success == true) {
                $scope.addTruckId= data.result[0].truck_id;
                getTruckId(data.result[0].truck_num);
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };
    //司机
    function getDriveNameList () {
        _basic.get($host.api_url + "/drive").then(function (data) {
            if (data.success == true) {
                $scope.driveNameList = data.result;
                $('#driverName').select2({
                    placeholder: '司机',
                    containerCssClass : 'select2_dropdown',
                    allowClear: true
                });
                $('#addExceedOilDriver').select2({
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
    // 单条数据录入
    $scope.new_data_list =function (){
        $scope.addOil ='';
        $scope.addUrea ='';
        $scope.addTime ='';
        $scope.addPlce ='';
        $scope.addType='';
        $scope.oilMoney ='';
        $scope.ureaMoney='';
        $scope.oilSinglePrice='';
        $scope.ureaSinglePrice='';
        getDriveNameList ();
        $(".modal").modal();
        $("#addActData").modal("open");
    }
    $scope.changeAddOil = function (el1,el2){
        $scope.oilMoney =el1*el2;
        $scope.putList.oil_money =el1*el2;

    }
    $scope.changeAddUrea = function (el1,el2){
        $scope.ureaMoney=el1*el2;
        $scope.putList.urea_money=el1*el2;

    }
    $scope.changeOilSinglePrice = function (el1,el2){
        $scope.oilMoney=el1*el2;
        $scope.putList.oil_money =el1*el2;
    }
    $scope.changeUreaSinglePrice = function (el1,el2){
        $scope.ureaMoney=el1*el2;
        $scope.putList.urea_money=el1*el2;
    }

    $scope.changeTruckNum = function (id){
        $scope.addTruckId=id;
    }
    $scope.addDataItem = function (){
        if ($scope.addExceedOilDriver!==''&&$scope.addTime !== '' && $scope.addPlce !== ''&&$scope.addTruckId!==undefined&& $scope.addType!==''&&$scope.oilMoney!=='') {
            _basic.post($host.api_url + "/user/" + userId + "/driveExceedOilRel", {
                "exceedOilId": 0,
                "driveId":$scope.addExceedOilDriver,
                "truckId": $scope.addTruckId,
                "oilDate":  $scope.addTime,
                'oilAddressType':$scope.addType,
                "oilAddress":  $scope.addPlce,
                'oilMoney': $scope.oilMoney,
                "oil":  $scope.addOil,
                "oilSinglePrice":$scope.oilSinglePrice,
                "ureaSinglePrice": $scope.ureaSinglePrice,
                "ureaMoney": $scope.ureaMoney,
                "urea": $scope.addUrea
            }).then(function (data) {
                if (data.success == true) {
                    $('#addActData').modal('close');
                    swal("新增成功", "", "success");
                } else {
                    swal(data.msg, "", "error");
                }
            })
        }
        else {
            swal("请填写完整信息！", "", "warning");
        }
    }



    $scope.putSystem = function (id){
        $scope.relId= id;
        _basic.get($host.api_url + "/driveExceedOilRel?relId="+id).then(function (data) {
            if (data.success == true) {
                $scope.putList = data.result[0];
                $scope.putList.oil_date = moment(data.result[0].oil_date).format('YYYY-MM-DD');
            }
            else {
                swal(data.msg, "", "error");
            }
        });

        $(".modal").modal();
        $("#putActData").modal("open");
    }

    $scope.putDataItem =function (){
        if($scope.putList.oil !== "" &&  $scope.putList.urea!== ''
            &&  $scope.putList.oil_single_price!== ''&&   $scope.putList.urea_single_price!== ''
            &&   $scope.putList.oil_date!== ''&& $scope.putList.oil_address_type!==null){
            _basic.put($host.api_url + "/user/" + userId + "/driveExceedOilRel/" +$scope.relId,{
                "oilDate":  $scope.putList.oil_date,
                "oilAddressType": $scope.putList.oil_address_type,
                "oilAddress":  $scope.putList.oil_address,
                "oil":  $scope.putList.oil,
                "urea":  $scope.putList.urea,
                "oilSinglePrice":  $scope.putList.oil_single_price,
                "ureaSinglePrice":  $scope.putList.urea_single_price,
                "oilMoney":$scope.putList.oil_money,
                "ureaMoney": $scope.putList.urea_money
            }).then(function (data) {
                if (data.success === true) {
                    $scope.search_query();
                    $('#putActData').modal('close');
                    swal("修改成功", "", "success");
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }
        else{
            swal("请填写完整信息！", "", "warning");
        }
    }



    // 头车搜索事件-条件查询
    $scope.search_condition = function () {
        $scope.start = 0;
        $scope.search_query();
    };
    // 搜索请求
    $scope.search_query = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveExceedOilRel?start=" + $scope.start + "&size=" + $scope.size;
        // 基本检索URL
        var urlCount = $host.api_url + "/driveExceedOilRelCount?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        urlCount = conditions.length > 0 ? urlCount + "&" + conditions : urlCount;

        _basic.get(url).then(function (data) {

            if (data.success == true) {
                $scope.car_refuel_obj = data.result;
                $scope.car_refuel = $scope.car_refuel_obj.slice(0, 10);
                if ($scope.start > 0) {
                    $scope.pre = true;
                }
                else {
                    $scope.pre = false;
                }
                if ($scope.car_refuel_obj.length < $scope.size) {
                    $scope.next = false;
                }
                else {
                    $scope.next = true;
                }

            }
            else {
                swal(data.msg, "", "error")
            }
        })

        _basic.get(urlCount).then(function (data) {
            if (data.success === true) {
                $scope.boxArrayFee = data.result[0];
            }

        })
    };
    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            driveId:$scope.driveName,
            truckId:$scope.truckNum,
            oilDateStart: $scope.refueling_startTime,
            oilDateEnd:$scope.refueling_endTime
        }
    }
    // 上一页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size - 1);
        $scope.search_query();
    };
    // 下一页
    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size - 1);
        $scope.search_query();
    };

    $scope.importFile();
    getDriveNameList ();
    getTruckId();
    $scope.search_query();
}]);