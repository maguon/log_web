/**
 * Created by ASUS on 2017/3/7.
 */
var CommonFilter=angular.module("CommonFilter",[]);
/*
    计划车辆是否临近出库
 */
CommonFilter.filter("ptime",function () {
    return function(input){
        var time;
        if(input!=null){
            var plan_time=new Date(input).getTime();
            var x=new Date();
            var new_time=(new Date()).getTime();
            time=plan_time-new_time-1000*60*60*24*30;
            if(time>0){
                return false
            }else {
                return true
            }
        }else {
            return false
        }

    }
});


/*
* 时间格式转化过滤器
* */
CommonFilter.filter("formdate",function () {
    return function (input) {
        var date = new Date(input);
        var new_date;
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()<10 ?'0'+(date.getDate())+' ':date.getDate()+' ');
        var h = (date.getHours()<10 ?'0'+(date.getHours())+' ':date.getHours()+' ') + ':';
        var m = (date.getMinutes()<10 ?'0'+(date.getMinutes())+' ':date.getMinutes()+' ')+ ':';
        var s = (date.getSeconds()<10 ?'0'+(date.getSeconds())+' ':date.getSeconds()+' ');
        new_date=Y+M+D+h+m+s;
        return new_date
    }
});



CommonFilter.filter("null_filter",function () {
    return function(input){
        if(input==null){
            return "空"
        }else {
            return input
        }

    }
});

// 用户部门过滤器
CommonFilter.filter("department", function () {
    return function (input) {
        var user;
        switch (input) {
            case 99:
                user = "超级管理员";
                break;
            case 29:
                user = "仓储部管理员";
                break;
            case 21:
                user = "仓储部操作员";
                break;
            case 19:
                user = "车管部管理员";
                break;
            case 11:
                user = "车管部操作员";
                break;
            default:
                user = "未知";
        }
        return user;
    }
});

// 性别过滤器
CommonFilter.filter("gender", function () {
    return function (input) {
        var sex;
        switch (input) {
            case "0":
                sex = "女";
                break;
            case "1":
                sex = "男";
                break;
            default:
                sex = "未知";
        }
        return sex;
    }
});

// 司机工作状态过滤器
CommonFilter.filter("workStatus", function () {
    return function (input) {
        var driver;
        switch (input) {
            case 0:
                driver = "停用";
                break;
            case 1:
                driver = "可用";
                break;
            default:
                driver = "未知";
        }
        return driver;
    }
});

// 车辆所属类型过滤器
CommonFilter.filter("carType", function () {
    return function (input) {
        var car;
        switch (input) {
            case 1:
                car = "自营";
                break;
            case 2:
                car = "外协";
                break;
            case 3:
                car = "供方";
                break;
            case 4:
                car = "承包";
                break;
            default:
                car = "未知";
        }
        return car;
    }
});
