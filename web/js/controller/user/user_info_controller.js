/**
 * Created by ASUS on 2017/5/16.
 */
// var user_info_controller=angular.module("user_info_controller",[]);
app.controller("user_info_controller", ["$scope", "_basic", "_config", "$host", function ($scope, _basic, _config, $host) {

    var user_info_obj = _config.userTypes;
    $scope.user_info_section = [];
    var user_info_fun = function () {
        _basic.get($host.api_url + "/user").then(function (data) {
            if (data.success == true) {
                $scope.user_info_list = data.result;
                console.log("user_info_section",data);
                console.log("user_info_obj_before",user_info_obj);
                for (var i in user_info_obj) {
                    $scope.user_info_section.push({
                        user_type: user_info_obj[i].type,
                        type_name: user_info_obj[i].name,
                        user_info_list_array: []
                    });
                }
                console.log("user_info_obj_after",user_info_obj);
                console.log("user_info_section_after",$scope.user_info_section)
                for (var k in $scope.user_info_section) {
                    for (var j in $scope.user_info_list) {
                        if ($scope.user_info_list[j].type == $scope.user_info_section[k].user_type && $scope.user_info_list[j].status == 1) {
                            $scope.user_info_section[k].user_info_list_array.push({
                                real_name: $scope.user_info_list[j].real_name,
                                mobile: $scope.user_info_list[j].mobile,
                                gender: $scope.user_info_list[j].gender,
                            })
                        }
                    }
                }


                // console.log($scope.user_info_section);
            } else {
                swal(data.msg, "", "error")
            }
        });

        // return $scope.user_info_section
    };
    user_info_fun();

}]);