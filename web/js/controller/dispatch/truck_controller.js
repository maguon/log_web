/**
 * Created by ASUS on 2017/3/31.
 */
/**
 * Created by ASUS on 2017/3/31.
 */
// var truckController = angular.module("truckController", []);
app.controller("truckController", ["$scope", function ($scope) {
    // $('.modal').modal();
    // $scope.Look=function () {
    //     $('#modal2').modal('open');
    // };
    // $scope.submit=function () {
    //     console.log(11)
    // }
    var count = 1;
    $scope.search = function () {
        console.log($scope.carType, $scope.beToType, $scope.carNum, $scope.driver, $scope.carState, $scope.insurance)
    };
    $scope.addTruck = function () {
        count = 1;
        $('#modal1').modal('open');
        $(".PublicTabs").children("div").removeClass("active");
        $(".basic1").addClass("active");
        $(".add_Truck_view").load("/view/car/new_truck/basic.html");
    };

    $scope.next = function () {
        count++;
        if (count < 5) {
            console.log(count);
            $(".PublicTabs").children().removeClass("active");
            $(".basic" + count).addClass("active");
            $(".add_Truck_view").load($(".basic" + count).attr("data-url"))
        }

    }
}]);
app.controller("truck_head_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userid = _basic.getSession(_basic.USER_ID);

    _basic.get($host.api_url + "/user/" + userid + "truck", {
        truckType: 1
    }).then(function (data) {
        if (data.success == true) {
            console.log(data)
        } else {

        }
    })

}]);
app.controller("truck_hand_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {
    var userid = _basic.getSession(_basic.USER_ID);

    _basic.get($host.api_url + "/user/" + userid + "truck", {
        truckType: 2
    }).then(function (data) {
        if (data.success == true) {
            console.log(data)
        } else {

        }
    })
}]);
app.controller("new_truck_controller", ["$scope", "$host", "_basic", function ($scope, $host, _basic) {

}]);