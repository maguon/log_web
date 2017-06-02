// var data_controller = angular.module("data_controller", []);
app.controller("dataController", ['$rootScope', '$scope', '$location', '$q', '_basic', "$host",

    function ($rootScope, $scope, $location, $q, _basic, $host) {
        //$scope.selectArray =[{id:1,name:'a'},{id:2,name:'b'}];
        $scope.selectArray = [];

        $scope.csvFile = null;
        $scope.rightNumber = 0;
        $scope.errorNumber = 0;
        $scope.upload = function (dom, val) {
            console.log($scope.csvFile);
        };
        $scope.update = function () {
            _basic.setCookie('url', "jiangsen");
        };
        $scope.update();
        $scope.tableHeader = [];

        $scope.fileType = "";
        // 表头原始数据
        $scope.tableHeadeArray = [];
        // 主体原始数据
        var tableContentFilter = [];
        // 过滤条件数据
        // $scope.filterArray=[1,2,3,4,5,6,7,8,9];
        var colObjs = [{name: 'name', type: 'number', length: 10}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}, {name: 'age', type: 'string', length: 2}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}, {name: 'age', type: 'string', length: 2}, {
            name: 'age',
            type: 'string',
            length: 2
        }, {name: 'age', type: 'string', length: 2}];
        // 头部条件判断
        $scope.titleFilter = function (headerArray) {
            if (colObjs.length != headerArray.length) {
                return false;
            } else {
                for (var i in headerArray) {
                    if (colObjs[i].name != headerArray[i]) {
                        console.log(headerArray[i]);
                        return false
                    }
                }
            }

        };
        // 主体条件判断
        $scope.ContentFilter = function (contentArray) {
            console.log(contentArray.length);
            for (var i = 0; i < contentArray.length; i++) {
                for (var j = 0; j < contentArray[i].length; j++) {
                    if (colObjs[j].type != typeof contentArray[i][j] || colObjs[j].length != contentArray[j].length) {
                        $scope.errorNumber = $scope.errorNumber + 1;
                        tableContentFilter.push(contentArray[i])
                        swal("错误条数" + tableContentFilter.length)
                    } else {
                        $scope.rightNumber = $scope.rightNumber + 1;
                    }
                    break;
                }
            }
        };
        _basic.get($host.api_url + "/storage").then(function (data) {
            if (data.success = true) {
                $scope.selectArray = data.result;
            } else {
                swal(data.msg, "", "error");
            }
        });

        $scope.fileChange = function (file) {
            $(file).parse({
                config: {
                    complete: function (result) {
                        console.log(result);
                        $scope.$apply(function () {
                            if ($scope.fileType != "application/vnd.ms-excel") {
                                swal("文件类型错误");
                            } else {
                                $scope.tableHeadeArray = result.data[0];
                                console.log(result.data.slice(1, result.data.length));
                                console.log(result.data[0]);

                                // 表头校验
                                //  if($scope.titleFilter($scope.tableHeadeArray)){
                                // 主体内容校验
                                $scope.ContentFilter(result.data.slice(1, result.data.length));
                                $scope.tableHeader = result.data[0];
                                $scope.tableContent = tableContentFilter;


                                // $scope.rightNumber = result.data.length-1;
                                // $scope.errorNumber = result.errors.length;
                                // }else {
                                //     alert("表格表头错误")
                                // }

                            }

                        });
                    }
                },
                before: function (file, inputElem) {
                    $scope.fileType = file.type;
                    // executed before parsing each file begins;
                    // what you return here controls the flow
                },
                error: function (err, file, inputElem, reason) {
                    console.log(err)
                },
                complete: function (val) {
                    console.log(val)
                }
            })
        }
        console.log('Data Controller Init !')
    }])