/**
 * Created by ASUS on 2017/3/7.
 */
var CommonFilter = angular.module("CommonFilter", []);
// 计划车辆是否临近出库
CommonFilter.filter("ptime", function () {
    return function (input) {
        var time;
        if (input != null) {
            var plan_time = new Date(input).getTime();
            var x = new Date();
            var new_time = (new Date()).getTime();
            time = plan_time - new_time - 1000 * 60 * 60 * 24 * 30;
            if (time > 0) {
                return false
            }
            else {
                return true
            }
        }
        else {
            return false
        }
    }
});

CommonFilter.filter("nullTo", function () {
    return function (input) {
        if (input == null || input == undefined) {
            return 0
        }
        else {
            return input
        }

    }
});


 // 时间格式转化过滤器
CommonFilter.filter("formdate", function () {
    return function (input) {
        var date = new Date(input);
        var new_date;
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) + ' ' : date.getDate() + ' ');
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) + ' ' : date.getHours() + ' ') + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) + ' ' : date.getMinutes() + ' ') + ':';
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) + ' ' : date.getSeconds() + ' ');
        new_date = Y + M + D + h + m + s;
        return new_date
    }
});


CommonFilter.filter("null_filter", function () {
    return function (input) {
        if (input == null) {
            return "空"
        }
        else {
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
            case 10:
                user = "司机";
                break;
            case 59:
                user = "财务管理员";
                break;
            case 51:
                user = "财务操作员";
                break;
            case 49:
                user = "质损管理员";
                break;
            case 41:
                user = "质损操作员";
                break;
            case 39:
                user = "调度管理员";
                break;
            case 31:
                user = "调度操作员";
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

// 指令状态类型过滤器
CommonFilter.filter("instructionsStatus", function () {
    return function (input) {
        var status;
        switch (input) {
            case 1:
                status = "待接受";
                break;
            case 2:
                status = "已接受";
                break;
            case 3:
                status = "执行";
                break;
            case 4:
                status = "在途";
                break;
            case 8:
                status = "取消安排";
                break;
            case 9:
                status = "已完成";
                break;
            case 10:
                status = "全部完成";
                break;
            default:
                status = "未知";
        }
        return status;
    }
});

// 任务状态类型过滤器
CommonFilter.filter("missionStatus", function () {
    return function (input) {
        var missionStatus;
        switch (input) {
            case 1:
                missionStatus = "未装车";
                break;
            case 3:
                missionStatus = "已装车";
                break;
            case 7:
                missionStatus = "已送达";
                break;
            case 8:
                missionStatus = "取消任务";
                break;
            case 9:
                missionStatus = "已完成";
                break;
            default:
                missionStatus = "未知";
        }
        return missionStatus;
    }
});

// 质损状态类型过滤器
CommonFilter.filter("damageStatus", function () {
    return function (input) {
        var damageStatus;
        switch (input) {
            case 1:
                damageStatus = "待处理";
                break;
            case 2:
                damageStatus = "处理中";
                break;
            case 3:
                damageStatus = "已处理";
                break;
            default:
                damageStatus = "未知";
        }
        return damageStatus;
    }
});

// 保险险种过滤器
CommonFilter.filter("insuranceType", function () {
    return function (input) {
        var insuranceType;
        switch (input) {
            case 1:
                insuranceType = "交强险";
                break;
            case 2:
                insuranceType = "商业险";
                break;
            case 3:
                insuranceType = "货运险";
                break;
            default:
                insuranceType = "未知";
        }
        return insuranceType;
    }
});

// 质损类型
CommonFilter.filter("damageType", function () {
    return function (input) {
        var damageType;
        switch (input) {
            case "1":
                damageType = "A级";
                break;
            case "2":
                damageType = "B级";
                break;
            case "3":
                damageType = "C级";
                break;
            case "4":
                damageType = "D级";
                break;
            case "6":
                damageType = "F级";
                break;
            default:
                damageType = "未知";
        }
        return damageType;
    }
});

// 质损环节类别
CommonFilter.filter("damageLinkType", function () {
    return function (input) {
        var damageLinkType;
        switch (input) {
            case "1":
                damageLinkType = "短驳质损";
                break;
            case "2":
                damageLinkType = "公路运输";
                break;
            case "3":
                damageLinkType = "公司运输";
                break;
            case "4":
                damageLinkType = "驾驶员漏检";
                break;
            case "5":
                damageLinkType = "交通事故";
                break;
            default:
                damageLinkType = "未知";
        }
        return damageLinkType;
    }
});