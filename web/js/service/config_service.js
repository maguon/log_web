/**
 * Created by ASUS on 2017/5/25.
 */

// var configService=angular.module("configService",[]);
// 公共数据
baseService.factory("_config", function () {
    var _this = {};
    // userType
    _this.userTypes = {
        // admin : {type:99,name:"admin"},
        storageUser : {type:2,name:"仓储部"},
        dispatch : {type:3,name:"调度部"},
        international_trade : {type:4,name:"国贸部"}
    };

    _this.rel_status = 1;

    // 车辆状态
    _this.car_rel_status=[
        {
            s_num: 1,
            status_text: "在库"
        },
        {
            s_num: 2,
            status_text: "出库"
        },
    ];

    // 颜色
    _this.config_color = [
        {
            colorName: "白色",
            colorId: "FFFFFF"
        },
        {
            colorName: "黑色",
            colorId: "000000"
        },
        {
            colorName: "银色",
            colorId: "ECECEC"
        },
        {
            colorName: "金色",
            colorId: "EDB756"
        },
        {
            colorName: "红色",
            colorId: "D0011B"
        },
        {
            colorName: "蓝色",
            colorId: "0B7DD5"
        },
        {
            colorName: "灰色",
            colorId: "9B9B9B"
        },
        {
            colorName: "紫色",
            colorId: "7C24AB"
        },
        {
            colorName: "桔色",
            colorId: "FF6600"
        },
        {
            colorName: "黄色",
            colorId: "FFCC00"
        },
        {
            colorName: "绿色",
            colorId: "39A23F "
        },
        {
            colorName: "棕色",
            colorId: "794A21 "
        },
        {
            colorName: "粉色",
            colorId: "FF9CC3 "
        },
        {
            colorName: "其他",
            colorId: "CCCCCC "
        }
    ];
    // 正则验证
    // 电话号
    _this.mobileRegx = "^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
    // email
    _this.emailRegx = "^[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$";
    // 密码
    _this.pwdRegx = "[a-zA-Z0-9]*";

    return _this
});
