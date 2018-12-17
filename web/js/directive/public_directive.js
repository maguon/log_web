/**
 * Created by ASUS on 2017/5/15.
 */
var publicDirective = angular.module("publicDirective", []);

publicDirective.directive('header', function () {
    return {
        templateUrl: '/js/view/common_header.html',
        replace: true,
        transclude: false,
        restrict: 'E',
        controller: function ($scope, $element, $rootScope, _basic, _config, $host, _socket) {

            // 把base64码转成bolb对象
            function convertBase64UrlToBlob(urlData) {

                var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                    ia[i] = bytes.charCodeAt(i);
                }

                return new Blob([ab], {type: 'image/png'});
            }

            // 截取图片
            $('.image-editor').cropit();
            $scope.uploadAmendImg = function () {
                var imageData = $('.image-editor').cropit('export');
                // window.open(imageData);

                var blob = convertBase64UrlToBlob(imageData);
                var formData = new FormData();
                formData.append('image', blob);
                new Promise(function (resolve, reject) {
                    _basic.formDataPost(formData, $host.file_url + '/user/' + userId + '/image?imageType=0', function (data) {
                        if (data.success == true) {
                            resolve(data.imageId);
                        }
                    }, function (err) {
                        console.log(err);
                    })
                }).then(function (imageId) {
                    _basic.put($host.api_url + "/user/" + userId + "/avatarImage", {
                        avatarImage: imageId
                    }).then(function (data) {
                        if (data.success == true) {
                            $scope.userImg = $host.file_url + '/image/' + imageId;
                            swal("上传头像成功", "", "success")
                        }


                    })
                })


            };
            $scope.pwdReg = _config.pwdRegx;
            var str_type = $element.attr("type");
            $("#brand-logo").attr("src", $element.attr("url"));
            // $("#qrCode").attr("src", $element.attr("qr"));
            //修改个人密码
            $scope.amend_user = function () {
                // $(".indicator").css({
                //     left:"0",
                //     right:"509px"
                // });
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
                    _basic.put($host.api_url + "/user/" + userid + "/password", obj).then(function (data) {
                        if (data.success == true) {
                            swal("密码重置成功", "", "success");
                            $("#user_modal").modal("close");
                        } else {
                            swal(data.msg, "", "error");
                        }
                    })
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
                    cancelButtonText: "取消",
                    closeOnConfirm: false
                }, function () {
                    _basic.removeSession(_basic.COMMON_AUTH_NAME);
                    _basic.removeSession(_basic.USER_ID);
                    _basic.removeSession(_basic.USER_TYPE);
                    _basic.removeSession(_basic.USER_NAME);
                    window.location.href = '/common_login.html';
                });

            };
            if (_basic.getSession(_basic.USER_TYPE) == str_type) {
                var userid = _basic.getSession(_basic.USER_ID);
                //触发侧边栏导航
                $("#menu_link").sideNav({
                    menuWidth: 280, // Default is 300
                    edge: 'left', // Choose the horizontal origin
                    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
                    draggable: true // Choose whether you can drag to open on touch screens
                });
                $('.collapsible').collapsible();


                //存储信息到sessionStorage
                var userId = _basic.getSession(_basic.USER_ID);
                var userType = _basic.getSession(_basic.USER_TYPE);
                var user_info_obj = _config.userTypes;
                $scope.qrList = [];
                for (var i = 0; i < user_info_obj.length; i++) {
                    if(userType == user_info_obj[i].type){
                        $scope.qrList = [];
                        if(user_info_obj[i].qr.length>0){
                            for(var j=0;j<user_info_obj[i].qr.length;j++){
                                QRCode.toDataURL($host.domain_name+user_info_obj[i].qr[j].qrSrc, function (err, url) {
                                    $scope.qrList.push({qrSrc:url});
                                })
                            }
                        }

                        break;
                    }
                }
                // console.log("qrList",$scope.qrList);
                $scope.hasUserPortrait = false;
                _basic.setHeader(_basic.USER_TYPE, userType);
                _basic.setHeader(_basic.COMMON_AUTH_NAME, _basic.getSession(_basic.COMMON_AUTH_NAME));
                _basic.get($host.api_url + "/user/" + userId).then(function (data) {
                    // $(".shadeDowWrap").hide();
                    if (data.success == true) {
                        if(data.result[0].avatar_image != null){
                            $scope.hasUserPortrait = true;
                            $scope.userImg = $host.file_url + '/image/' + data.result[0].avatar_image;
                        }
                        else{
                            $scope.hasUserPortrait = false;
                        }
                        _basic.setSession(_basic.USER_IMG, data.result[0].avatar_image);
                        _basic.setSession(_basic.USER_NAME, $scope.userName);
                        _basic.setHeader(_basic.USER_NAME, $scope.userName);
                        _basic.setSession(_basic.USER_NAME, data.result[0].real_name);
                        var user = {
                            id: userId,
                            type: userType,
                            name: data.result[0].real_name
                        };
                        _socket.connectSocket(user);
                        for (var i = 0; i < user_info_obj.length; i++) {
                            if (user_info_obj[i].type == data.result[0].type) {
                                $scope.userName = user_info_obj[i].name;
                            }
                        }
                        $scope.realName = data.result[0].real_name;
                        MaterialAvatar(document.getElementsByClassName('nav-avatar'), {
                            shape: 'circle',
                            backgroundColor: '#4dd0e1',
                            textColor: '#fff'
                        });
                    } else {
                        swal(data.msg, "", "error");
                    }
                });

            } else {
                window.location = "./common_login.html"
            }


        }
    };
});
/*
* datepicker  时间选择触发
* */
publicDirective.directive("date", function () {
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


publicDirective.directive("dateFilter", ["$filter", function ($filter) {
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
publicDirective.directive('autoMapHeight', function () {
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
/*
* meteralize css 中需要手动触发的样式
* */
publicDirective.directive("usersTabs", function () {
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
publicDirective.directive("sideNav", function () {
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
publicDirective.directive("sexChange", function () {
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
publicDirective.directive("ulTabs", function () {
    return {
        restrict: "A",
        link: function () {
            $('ul.tabs').tabs();
        }
    }
});
publicDirective.directive("collapsible", function () {
    return {
        restrict: "A",
        link: function () {
            $('.collapsible').collapsible();
        }
    }
});

/*
*
*
* */
// ng-repeat渲染后的回调
publicDirective.directive('repeatFinish', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                // console.log('ng-repeat执行完毕');
                scope.$eval(attr.repeatFinish)
            }
        }
    }
});
publicDirective.directive('repeatFinishS', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                // console.log('ng-repeat执行完毕');
                scope.$eval(attr.renderFinish_s)
            }
        }
    }
});
publicDirective.directive('repeatFinishD', function () {
    return {
        link: function (scope, element, attr) {
            if (scope.$last == true) {
                // console.log('ng-repeat执行完毕');
                scope.$eval(attr.renderFinish_d)
            }
        }
    }
});
// 时间格式过滤指令
publicDirective.directive("formDate", function () {
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
publicDirective.directive('percent', function () {
    return {
        link: function (scope, element, attr) {
            var percentage;
            var val = Number.parseInt(attr.value);

            var total = Number.parseInt(attr.total);
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
publicDirective.directive('footer', function () {
    return {
        templateUrl: '/js/view/common_footer.html',
        replace: true,
        transclude: false,
        restrict: 'E'
    };
});