app.controller("driver_salary_controller", ["$scope","$rootScope","$state","$stateParams", "$host", "_config", "_basic", function ($scope, $rootScope,$state,$stateParams,$host, _config, _basic) {
    var userId = _basic.getSession(_basic.USER_ID);
    $scope.start = 0;
    $scope.size = 11;
    $scope.selectedIdsArr = [];
    $scope.noLoadDistanceCount = 0;
    $scope.loadDistanceCount = 0;
    $scope.shouldPay = 0;


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
    $scope.driverSalary = function () {
        $('ul.tabWrap li').removeClass("active");
        $(".tab_box").removeClass("active");
        $(".tab_box").hide();
        $('ul.tabWrap li.driverSalary ').addClass("active");
        $("#driverSalary").addClass("active");
        $("#driverSalary").show();
    };
    $scope.driverSalary  ();



    // 过滤条件数据
    var colObjs = [
        {name: '司机姓名', type: 'string',require: true},
        {name: '电话', type: 'number', require: true},
        {name: '月份', type: 'number', require: true},
        {name: '个人所得税', type: 'number', require: true}];
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
        _basic.formPost($("#file_upload_form"), $host.api_url + '/user/' + userId + '/driveSalaryPersonalTaxFile' , function (data) {
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







    // monthPicker控件
    $('#start_month').MonthPicker({
        Button: false,
        MonthFormat: 'yymm'
    });
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
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    }

    //获取上个月年月
    function getLastMonth(){//获取上个月日期
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        if(month<10){
            month ='0'+month;
        }

        if(month == 0){
            year = year -1;
            month = 12;
        }
        $scope.startMonth = year.toString()+month.toString();
    }
    getLastMonth();

    // 获取货车品牌信息
    $scope.getTruckBrandList = function () {
        _basic.get($host.api_url + "/brand").then(function (data) {
            if (data.success === true) {
                $scope.brandList = data.result;
            }
            else {
                swal(data.msg, "", "error");
            }
        });
    };

    // 所属类型--公司联动
    $scope.getCompany = function () {
        _basic.get($host.api_url + "/company?operateType=" + $scope.carType).then(function (data) {
            if (data.success == true) {
                $scope.companyList = data.result;
            } else {
                swal(data.msg, "", "error")
            }
        });
    };

    // 获取司机工资信息
    $scope.searchDriverSalaryList = function (status) {
        if(status === "init"){
            $scope.monthStart = $scope.startMonth
        }
        else if(status === undefined){
            $scope.monthStart = $('#start_month').val();
        }
        else{
            $scope.monthStart =status;
        }
        $scope.monthVal =  $scope.monthStart;
        $scope.startMonth =  $scope.monthStart;

        // 基本检索URL
        var url = $host.api_url + "/driveSalaryBase?start=" + $scope.start + "&size=" + $scope.size;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        if($scope.monthStart==""||$scope.monthStart==null){
            $scope.driverSalaryList=[];
            $("#next").hide();
            swal('请填写月份进行查询!', "", "error")
        }
        else{
            _basic.get(url).then(function (data) {

                if (data.success == true) {

                    // 当前画面的检索信息
                    var pageItems = {
                        pageId: "driver_salary",
                        start: $scope.start,
                        size: $scope.size,
                        conditions: conditionsObj
                    };
                    // 将当前画面的条件
                    $rootScope.refObj = {pageArray: []};
                    $rootScope.refObj.pageArray.push(pageItems);
                    $scope.boxArray = data.result;
                    $scope.driverSalaryList = $scope.boxArray.slice(0, 10);
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
                    $scope.temporaryMonth = $("#start_month").val();
                }
                else {
                    swal(data.msg, "", "error");
                }
            });
        }

    };

    // 点击查询
    $scope.getDriverSalaryList = function () {
        $scope.start = 0;
        $scope.searchDriverSalaryList();
    };


    // 数据导出
    $scope.export = function () {
        // 基本检索URL
        var url = $host.api_url + "/driveSalary.csv?" ;
        // 检索条件
        var conditionsObj = makeConditions();
        var conditions = _basic.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        window.open(url);
        window.open(url);
    };



    // 分页
    $scope.pre_btn = function () {
        $scope.start = $scope.start - ($scope.size-1);
        $scope.searchDriverSalaryList();
    };

    $scope.next_btn = function () {
        $scope.start = $scope.start + ($scope.size-1);
        $scope.searchDriverSalaryList();
    };

    /**
     * 设置检索条件。
     * @param conditions 上次检索条件
     */
    function setConditions(conditions) {
        $scope.monthStart=conditions.yMonth;
        $scope.driverName=conditions.driveName;
        $scope.carType=conditions.operateType;
        $scope.insureCompany=conditions.companyId;
        $scope.truckNumber=conditions.truckNum;
        $scope.truckBrand=conditions.truckBrandId;
        $scope.grantStatus=conditions.grantStatus;
    }

    /**
     * 组装检索条件。
     */
    function makeConditions() {
        return {
            yMonth: $scope.monthStart,
            driveName: $scope.driverName,
            operateType: $scope.carType,
            companyId: $scope.insureCompany,
            truckNum: $scope.truckNumber,
            truckBrandId: $scope.truckBrand,
            grantStatus: $scope.grantStatus
        };
    }

    /**
     * 画面初期显示时，用来获取画面必要信息的初期方法。
     */
    function initData() {
        // 如果是从后画面跳回来时，取得上次检索条件
        if ($stateParams.from === "driver_salary_details" && $rootScope.refObj !== undefined && $rootScope.refObj.pageArray.length > 0) {
            var pageItems = $rootScope.refObj.pageArray.pop();
            if (pageItems.pageId === "driver_salary") {
                // 设定画面翻页用数据
                $scope.start = pageItems.start;
                $scope.size = pageItems.size;
                // 将上次的检索条件设定到画面
                setConditions(pageItems.conditions);
                $scope.searchDriverSalaryList(pageItems.conditions.monthDateId);
            }
        } else {
            // 初始显示时，没有前画面，所以没有基本信息
            $rootScope.refObj = {pageArray: []};
            $scope.searchDriverSalaryList('init');
        }
        $scope.getCompany();

    }
    initData();


    // 获取数据
    $scope.queryData = function () {
        $scope.getTruckBrandList();
        getDriveNameList ();
    };
    $scope.queryData();
}]);