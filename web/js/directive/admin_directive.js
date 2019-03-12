var adminDirective = angular.module("adminDirective", []);
adminDirective.directive('header', function () {
    return {
        templateUrl: '/js/view/common_header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $state, $element, $rootScope, _basic, _config, $host, _socket) {
            $(function () {
                $('.image-editor').cropit();
                $('form').submit(function () {
                    // Move cropped image data to hidden input
                    var imageData = $('.image-editor').cropit('export');
                    $('.hidden-image-data').val(imageData);
                    // Print HTTP request params
                    var formValue = $(this).serialize();
                    $('#result-data').text(formValue);
                    // Prevent the form from actually submitting
                    return false;
                });
            });
            $scope.pwdReg = _config.pwdRegx;
            $scope.amendImg = function () {
                $state.go("amend_img")
            }
            //修改个人密码
            $scope.amend_user = function () {
                $(".modal").modal();
                $("#user_modal").modal("open");

            };
            $scope.download_app = function () {
                $(".modal").modal();
                $("#download").modal("open");
            };
            $scope.closeModel = function () {
                $("#user_modal").modal("close");
                $scope.submitted = false;
                $scope.user_old_password = "";
                $scope.user_new_password = "";
            };
            $scope.amend_user_submit = function (valid) {
                $scope.submitted = true;
                if (valid && $scope.user_new_password == $scope.user_confirm_password) {
                    var obj = {
                        "originPassword": $scope.user_old_password,
                        "newPassword": $scope.user_new_password
                    };
                    _basic.put($host.api_url + "/user/" + userId + "/password", obj).then(function (data) {
                        if (data.success == true) {
                            swal("密码重置成功", "", "success");
                            $("#user_modal").modal("close");
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
                }
                else{
                    swal("新密码和确认密码不一致", "", "error");
                }
            };

            //退出登录
            $scope.logOut = function () {
                swal({
                    title: "注销账号",
                    text: "是否确认退出登录",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
                }).then(
                    function(){
                        _basic.removeSession(_basic.COMMON_AUTH_NAME);
                        _basic.removeSession(_basic.USER_ID);
                        _basic.removeSession(_basic.USER_TYPE);
                        _basic.removeSession(_basic.USER_NAME);
                        window.location.href = '/admin_login.html';
                    });
                //
            }
            // var str_type=$element.attr("type");
            if (_basic.getSession(_basic.USER_TYPE) == "99") {
                var userId = _basic.getSession(_basic.USER_ID);
                $scope.userType = _basic.getSession(_basic.USER_TYPE);
                $("#brand-logo").attr("src", $element.attr("url"));
                // $("#qrCode").attr("src",$element.attr("qr"));
                // var userid=$basic.getSession($basic.USER_ID);

                //触发侧边栏导航
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    // draggable: true // Choose whether you can drag to open on touch screens
                });
                $('.collapsible').collapsible();


                //存储信息到sessionStorage
                _basic.setHeader(_basic.USER_TYPE, _basic.getSession(_basic.USER_TYPE));
                _basic.setHeader(_basic.COMMON_AUTH_NAME, _basic.getSession(_basic.COMMON_AUTH_NAME));
                $scope.qrList = [];
                _basic.get($host.api_url + "/admin/" + _basic.getSession(_basic.USER_ID)).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        $scope.userName = data.result[0].real_name;
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        MaterialAvatar(document.getElementsByClassName('nav-avatar'), {
                            shape: 'circle',
                            backgroundColor: '#4dd0e1',
                            textColor: '#fff'
                        });
                    } else {
                        swal(data.msg, "", "error");
                    }
                });
            }
            else {
                window.location = "./admin_login.html"
            }
        }
    };

});
/*
 * datepicker  日期选择触发
 * */
adminDirective.directive("date", function () {
    return {
        restrict: "A",
        link: function () {
            $('.datepicker').pickadate({
                format: 'yyyy-mm-dd',
                onSet: function (arg) {
                    if ('select' in arg) {
                        this.close();
                    }
                },
                selectMonths: false, // Creates a dropdown to control month
                selectYears: 21 // Creates a dropdown of 15 years to control year
            });
        }
    }
});

/*
 * timepicker  时间选择触发
 * */
adminDirective.directive("time", function () {
    return {
        restrict: "A",
        link: function () {
            $('.timepicker').pickatime({
                default: 'now', // Set default time: 'now', '1:30AM', '16:30'
                fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
                twelvehour: false, // Use AM/PM or 24-hour format
                donetext: '确定', // text for done-button
                cleartext: '清除', // text for clear-button
                canceltext: '取消', // Text for cancel-button
                autoclose: true, // automatic close timepicker
                ampmclickable: true, // make AM PM clickable
                aftershow: function () {
                } //Function for after opening timepicker
            });
        }
    }
});


adminDirective.directive('autoMapHeight', function () {
    return {
        restrict: 'A',
        scope: {},
        link: function ($scope, element, attrs) {
            var conHeight = $(".ConWrap").height(); //获取窗口高度
            var titleHeight = 200;
            element.css('min-height',
                (conHeight - titleHeight) + 'px');
        }
    };
});


adminDirective.directive("dateFilter", ["$filter", function ($filter) {
    var dateFilter = $filter("date");
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elm, attrs, ctrl) {
            function formatter(value) {
                return dateFilter(value, "yyyy-MM-dd");
            }

            function parser() {
                return ctrl.$modelValue;
            }

            ctrl.$formatters.push(formatter);
            ctrl.$parsers.unshift(parser);
        }
    }
}]);


/*
 * meteralize css 中需要手动触发的样式
 * */

adminDirective.directive("usersTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $(".users_chip").on("click", function () {
                $(".users_chip").removeClass("active");
                $(this).addClass("active")
            })
        }
    }
});

adminDirective.directive("sideNav", function () {
    return {
        restrict: "A",
        link: function () {
            $("#menu_link").sideNav({
                menuWidth: 280, // Default is 300
                edge: 'left', // Choose the horizontal origin
                closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                // draggable: true // Choose whether you can drag to open on touch screens
            });
            // $(".button-collapse").sideNav();
            $('.collapsible').collapsible();
        }
    }
})
adminDirective.directive("sexChange", function () {
    return {
        restrict: "A",
        link: function () {
            $(".sexBox i").on("click", function () {
                $(".sexBox i").removeClass("sex");
                $(this).addClass("sex")
            })
        }
    }
});

adminDirective.directive("ulTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $('ul.tabs').tabs();
        }
    }
});
adminDirective.directive("collapsible", function () {
    return {
        restrict: "A",
        link: function () {
            $('.collapsible').collapsible();
        }
    }
});

adminDirective.directive("tooltipped", function () {
    return {
        restrict: "A",
        link: function () {
            $('.tooltipped').tooltip({delay: 50});
        }
    }
});
/*
 *
 *
 * */


// ng-repeat渲染后的回调
adminDirective.directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                // console.log('ng-repeat执行完毕');
                scope.$eval(attr.repeatFinish)
            }
        }
    }
});

// 时间格式过滤指令
adminDirective.directive("formDate", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attr, ngModelCtr) {
            ngModelCtr.$formatters.push(function (modelValue) {
                if (modelValue != null && modelValue != "") {
                    var date = new Date(modelValue);
                    var new_date;
                    var Y = date.getFullYear() + '-';
                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                    var D = (date.getDate() < 10 ? '0' + (date.getDate()) + ' ' : date.getDate() + ' ');
                    var h = date.getHours() + ':';
                    var m = date.getMinutes() + ':';
                    var s = date.getSeconds();
                    new_date = Y + M + D;
                    if (typeof modelValue != "undefined") {
                        //返回字符串给view,不改变模型值
                        return new_date;
                    }
                } else {
                    return ""
                }

            })

        }
    }

});


adminDirective.directive('percent', function () {
    return {
        link: function (scope, element, attr) {
            var val = Number.parseInt(attr.value);
            var total = Number.parseInt(attr.total);
            var percentage;
            if (total != 0) {
                percentage = Number.parseInt((val * 100 / total));
            } else {
                percentage = 0;
            }
            //Highcharts.chart('percentWrap1', {
            $(element[0].children[0]).highcharts({
                // 表头
                title: {
                    text: percentage + "%",
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 8,
                    style: {
                        color: "#bdbdbd"
                    }

                },
                colors: [
                    "#4dd0e1",
                    "#cfd8dc"
                ],
                // 版权信息
                credits: {
                    enabled: "false",
                    text: '',
                    href: ''
                },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: 0,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '',
                    innerSize: '80%',
                    data: [
                        ['', percentage],
                        ['', (100 - percentage)]
                    ]
                }]
            });
            var chart = null;

        }
    }
});

adminDirective.directive('footer', function () {
    return {
        templateUrl: '/js/view/common_footer.html',
        replace: true,
        transclude: false,
        restrict: 'E'
    };
});
